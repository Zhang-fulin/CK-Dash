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

type Props = {
  addresses: AddressEntry[];
  dataMap: Record<string, any>;
  loadingMap: Record<string, boolean>;
  errorMap: Record<string, boolean>;
  fetchAll: (list: AddressEntry[]) => void;
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
  fetchAll, onAddAddress, onDeleteAddress,
  deleteTarget, onDeleteConfirm, onDeleteClose,
  showModal, onShowModal, onCloseModal,
  onSelectEntry, lang, toggleLang, t,
}: Props) {
  useEffect(() => {
    if (addresses.length === 0) return;
    fetchAll(addresses);
    const interval = setInterval(() => fetchAll(addresses), 30000);
    return () => clearInterval(interval);
  }, [addresses, fetchAll]);

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
