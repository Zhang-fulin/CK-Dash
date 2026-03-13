import AsyncStorage from '@react-native-async-storage/async-storage';
import { AddressEntry, Lang } from './types';

const STORAGE_KEY = 'savedAddresses';
const LANG_KEY = 'appLang';

export const loadSettings = () =>
  AsyncStorage.multiGet([STORAGE_KEY, LANG_KEY]);

export const saveAddresses = (list: AddressEntry[]) =>
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));

export const saveLang = (lang: Lang) =>
  AsyncStorage.setItem(LANG_KEY, lang);
