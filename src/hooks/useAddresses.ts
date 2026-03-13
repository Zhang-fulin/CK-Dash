import { useState } from 'react';
import { AddressEntry } from '../types';
import { loadSettings, saveAddresses as persist, saveLang } from '../storage';
import { Lang } from '../types';

export function useAddresses() {
  const [addresses, setAddresses] = useState<AddressEntry[]>([]);

  const load = async (onLang: (l: Lang) => void) => {
    const pairs = await loadSettings();
    const raw = pairs[0][1];
    const savedLang = pairs[1][1] as Lang | null;
    if (raw) { try { setAddresses(JSON.parse(raw)); } catch {} }
    if (savedLang === 'en' || savedLang === 'zh') onLang(savedLang);
  };

  const save = async (list: AddressEntry[]) => {
    setAddresses(list);
    await persist(list);
  };

  const addAddress = async (entry: AddressEntry) => {
    const next = [...addresses, entry];
    await save(next);
    return next;
  };

  const removeAddress = async (id: string) => {
    const next = addresses.filter(a => a.id !== id);
    await save(next);
    return next;
  };

  return { addresses, load, addAddress, removeAddress };
}
