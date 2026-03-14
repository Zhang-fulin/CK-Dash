import { useState, useRef, useCallback } from 'react';
import { AddressEntry } from '../types';

export type BalanceData = {
  confirmed: number;   // satoshi
  unconfirmed: number; // satoshi
};

export function useBalance() {
  const [balanceMap, setBalanceMap] = useState<Record<string, BalanceData>>({});
  const [balanceLoadingMap, setBalanceLoadingMap] = useState<Record<string, boolean>>({});
  const [balanceErrorMap, setBalanceErrorMap] = useState<Record<string, boolean>>({});
  const balanceMapRef = useRef<Record<string, BalanceData>>({});

  const fetchBalance = useCallback(async (entry: AddressEntry) => {
    setBalanceLoadingMap(m => ({ ...m, [entry.id]: true }));
    try {
      const res = await fetch(`https://mempool.space/api/address/${entry.address}`);
      if (!res.ok) throw new Error();
      const json = await res.json();
      const confirmed =
        (json.chain_stats?.funded_txo_sum ?? 0) - (json.chain_stats?.spent_txo_sum ?? 0);
      const unconfirmed =
        (json.mempool_stats?.funded_txo_sum ?? 0) - (json.mempool_stats?.spent_txo_sum ?? 0);
      const data: BalanceData = { confirmed, unconfirmed };
      const prev = balanceMapRef.current[entry.id];
      if (!prev || prev.confirmed !== confirmed || prev.unconfirmed !== unconfirmed) {
        balanceMapRef.current = { ...balanceMapRef.current, [entry.id]: data };
        setBalanceMap(m => ({ ...m, [entry.id]: data }));
      }
      setBalanceErrorMap(m => ({ ...m, [entry.id]: false }));
    } catch {
      setBalanceErrorMap(m => ({ ...m, [entry.id]: true }));
    }
    setBalanceLoadingMap(m => ({ ...m, [entry.id]: false }));
  }, []);

  const fetchAllBalances = useCallback((list: AddressEntry[]) => {
    list.forEach(e => fetchBalance(e));
  }, [fetchBalance]);

  const clearBalanceEntry = (id: string) => {
    const newMap = { ...balanceMapRef.current };
    delete newMap[id];
    balanceMapRef.current = newMap;
    setBalanceMap(newMap);
    setBalanceErrorMap(m => { const n = { ...m }; delete n[id]; return n; });
  };

  return { balanceMap, balanceLoadingMap, balanceErrorMap, fetchBalance, fetchAllBalances, clearBalanceEntry };
}
