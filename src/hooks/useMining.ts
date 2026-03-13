import { useState, useRef, useCallback } from 'react';
import { AddressEntry } from '../types';

export function useMining() {
  const [dataMap, setDataMap] = useState<Record<string, any>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [errorMap, setErrorMap] = useState<Record<string, boolean>>({});
  const dataMapRef = useRef<Record<string, any>>({});

  const fetchOne = useCallback(async (entry: AddressEntry) => {
    setLoadingMap(m => ({ ...m, [entry.id]: true }));
    try {
      const res = await fetch(`https://solo.ckpool.org/users/${entry.address}`);
      if (!res.ok) throw new Error();
      const json = await res.json();
      if (JSON.stringify(json) !== JSON.stringify(dataMapRef.current[entry.id])) {
        dataMapRef.current = { ...dataMapRef.current, [entry.id]: json };
        setDataMap(m => ({ ...m, [entry.id]: json }));
      }
      setErrorMap(m => ({ ...m, [entry.id]: false }));
    } catch {
      setErrorMap(m => ({ ...m, [entry.id]: true }));
    }
    setLoadingMap(m => ({ ...m, [entry.id]: false }));
  }, []);

  const fetchAll = useCallback((list: AddressEntry[]) => {
    list.forEach(e => fetchOne(e));
  }, [fetchOne]);

  const clearEntry = (id: string) => {
    const newMap = { ...dataMapRef.current };
    delete newMap[id];
    dataMapRef.current = newMap;
    setDataMap(newMap);
    setErrorMap(m => { const n = { ...m }; delete n[id]; return n; });
  };

  return { dataMap, loadingMap, errorMap, fetchOne, fetchAll, clearEntry };
}
