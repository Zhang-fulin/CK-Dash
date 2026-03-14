import React, { useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
import { AddressEntry } from '../types';
import { T } from '../i18n';
import { styles } from '../styles';
import { MinerCard } from '../components/MinerCard';
import { AddModal } from '../components/AddModal';
import { DeleteModal } from '../components/DeleteModal';
import { BalanceData } from '../hooks/useBalance';

function parseHashrateToTH(str: string): number {
  if (!str) return 0;
  const m = str.match(/([\d.]+)\s*(P|T|G|M|K)/i);
  if (!m) return 0;
  const v = parseFloat(m[1]);
  const unit = m[2].toUpperCase();
  const map: Record<string, number> = { K: 1e-9, M: 1e-6, G: 1e-3, T: 1, P: 1e3 };
  return v * (map[unit] ?? 0);
}

function formatTotalHashrate(th: number): string {
  if (th >= 1000) return `${(th / 1000).toFixed(2)} PH/s`;
  if (th >= 1) return `${th.toFixed(2)} TH/s`;
  if (th >= 0.001) return `${(th * 1000).toFixed(2)} GH/s`;
  return `${(th * 1e6).toFixed(2)} MH/s`;
}

type Props = {
  addresses: AddressEntry[];
  dataMap: Record<string, any>;
  loadingMap: Record<string, boolean>;
  errorMap: Record<string, boolean>;
  fetchAll: (list: AddressEntry[]) => void;
  balanceMap: Record<string, BalanceData>;
  fetchAllBalances: (list: AddressEntry[]) => void;
  onAddAddress: (entry: AddressEntry) => void;
  onDeleteAddress: (entry: AddressEntry) => void;
  deleteTarget: AddressEntry | null;
  onDeleteConfirm: () => void;
  onDeleteClose: () => void;
  showModal: boolean;
  onShowModal: () => void;
  onCloseModal: () => void;
  onSelectEntry: (id: string) => void;
  lang: 'zh' | 'en';
  toggleLang: () => void;
  t: T;
};

export function ListScreen({
  addresses, dataMap, loadingMap, errorMap,
  fetchAll, balanceMap, fetchAllBalances,
  onAddAddress, onDeleteAddress,
  deleteTarget, onDeleteConfirm, onDeleteClose,
  showModal, onShowModal, onCloseModal,
  onSelectEntry, lang, toggleLang, t,
}: Props) {
  useEffect(() => {
    if (addresses.length === 0) return;
    fetchAll(addresses);
    fetchAllBalances(addresses);
    const interval = setInterval(() => { fetchAll(addresses); fetchAllBalances(addresses); }, 30000);
    return () => clearInterval(interval);
  }, [addresses, fetchAll, fetchAllBalances]);

  const totalHashrateTH = addresses.reduce((sum, entry) => {
    const worker = dataMap[entry.id]?.worker?.[0];
    return sum + parseHashrateToTH(worker?.hashrate1m ?? '');
  }, 0);

  const totalBTC = addresses.reduce((sum, entry) => {
    const b = balanceMap[entry.id];
    return sum + (b ? b.confirmed / 1e8 : 0);
  }, 0);

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#0d0d0d' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0d0d" />
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.header}>
          <Text style={styles.title}>{t.title}</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.langBtn} onPress={toggleLang}>
              <Text style={styles.langBtnText}>{lang === 'zh' ? 'EN' : '中'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addBtn} onPress={onShowModal}>
              <Text style={styles.addBtnText}>{t.add}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {addresses.length > 0 && (
          <View style={[styles.card, { marginBottom: 20, flexDirection: 'row' }]}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={[styles.hashrateValue, { fontSize: 22 }]}>{formatTotalHashrate(totalHashrateTH)}</Text>
              <Text style={styles.hashrateLabel}>{lang === 'zh' ? '总算力' : 'Total Hashrate'}</Text>
            </View>
            <View style={styles.divider} />
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={[styles.hashrateValue, { fontSize: 22 }]}>₿ {totalBTC.toFixed(8)}</Text>
              <Text style={styles.hashrateLabel}>{lang === 'zh' ? '总余额' : 'Total Balance'}</Text>
            </View>
          </View>
        )}

        {addresses.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>{t.empty}</Text>
            <Text style={styles.emptyHint}>{t.emptyHint}</Text>
          </View>
        ) : (
          addresses.map(entry => (
            <MinerCard
              key={entry.id}
              entry={entry}
              worker={dataMap[entry.id]?.worker?.[0]}
              isLoading={loadingMap[entry.id]}
              hasError={errorMap[entry.id]}
              balance={balanceMap[entry.id]}
              onPress={() => onSelectEntry(entry.id)}
              onLongPress={() => onDeleteAddress(entry)}
              t={t}
            />
          ))
        )}
      </ScrollView>

      <AddModal visible={showModal} onClose={onCloseModal} onConfirm={onAddAddress} t={t} />
      <DeleteModal target={deleteTarget} onClose={onDeleteClose} onConfirm={onDeleteConfirm} t={t} />
    </KeyboardAvoidingView>
  );
}
