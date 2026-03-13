import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, StatusBar, ActivityIndicator,
} from 'react-native';
import { AddressEntry } from '../types';
import { T } from '../i18n';
import { styles } from '../styles';
import { tsToTime } from '../utils';
import { DeleteModal } from '../components/DeleteModal';

type Props = {
  entry: AddressEntry;
  data: any;
  loading: boolean;
  hasError: boolean;
  fetchOne: (entry: AddressEntry) => void;
  onBack: () => void;
  onDelete: (entry: AddressEntry) => void;
  deleteTarget: AddressEntry | null;
  onDeleteConfirm: () => void;
  onDeleteClose: () => void;
  lang: 'zh' | 'en';
  toggleLang: () => void;
  t: T;
};

export function DetailScreen({
  entry, data, loading, hasError,
  fetchOne, onBack, onDelete,
  deleteTarget, onDeleteConfirm, onDeleteClose,
  lang, toggleLang, t,
}: Props) {
  const [countdown, setCountdown] = useState(10);
  const worker = data?.worker?.[0];

  useEffect(() => {
    fetchOne(entry);
    setCountdown(10);
    const interval = setInterval(() => { fetchOne(entry); setCountdown(10); }, 10000);
    const tick = setInterval(() => setCountdown(c => c > 0 ? c - 1 : 0), 1000);
    return () => { clearInterval(interval); clearInterval(tick); };
  }, [entry.id]);

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#0d0d0d' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0d0d" />
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.detailHeader}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backText}>{t.back}</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.detailTitle}>{entry.label}</Text>
          </View>
          <TouchableOpacity onPress={toggleLang} style={styles.langBtn}>
            <Text style={styles.langBtnText}>{lang === 'zh' ? 'EN' : '中'}</Text>
          </TouchableOpacity>
        </View>

        {hasError && !worker ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorIcon}>⚠</Text>
            <Text style={styles.errorText}>{t.fetchError}</Text>
            <Text style={styles.errorHint}>{t.fetchErrorHint}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={() => fetchOne(entry)}>
              <Text style={styles.retryBtnText}>{t.retry}</Text>
            </TouchableOpacity>
          </View>
        ) : !worker ? (
          <View style={styles.centerBox}>
            <ActivityIndicator color="#f7931a" />
          </View>
        ) : (
          <>
            <View style={styles.statusBar}>
              <View style={[styles.statusDot, hasError && { backgroundColor: '#e74c3c' }]} />
              <Text style={[styles.statusText, hasError && { color: '#e74c3c' }]}>
                {hasError ? t.fetchError : t.monitoring}
              </Text>
              <Text style={styles.countdown}>
                {loading ? t.refreshing : t.afterRefresh(countdown)}
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>{t.workerAddr}</Text>
              <Text selectable style={styles.address}>{worker.workername}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>{t.hashrate}</Text>
              <View style={styles.hashrateRow}>
                <View style={styles.hashrateItem}>
                  <Text style={styles.hashrateValue}>{worker.hashrate1m}</Text>
                  <Text style={styles.hashrateLabel}>{t.min1}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.hashrateItem}>
                  <Text style={styles.hashrateValue}>{worker.hashrate5m}</Text>
                  <Text style={styles.hashrateLabel}>{t.min5}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.hashrateItem}>
                  <Text style={styles.hashrateValue}>{worker.hashrate1hr}</Text>
                  <Text style={styles.hashrateLabel}>{t.hr1}</Text>
                </View>
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.card, styles.halfCard]}>
                <Text style={styles.label}>{t.lastShare}</Text>
                <Text style={styles.time}>{tsToTime(worker.lastshare)}</Text>
              </View>
              <View style={[styles.card, styles.halfCard]}>
                <Text style={styles.label}>{t.startTime}</Text>
                <Text style={styles.time}>{tsToTime(data.authorised)}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.secondaryButton} onPress={() => onDelete(entry)}>
              <Text style={[styles.secondaryButtonText, { color: '#c0392b' }]}>{t.deleteAddr}</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      <DeleteModal target={deleteTarget} onClose={onDeleteClose} onConfirm={onDeleteConfirm} t={t} />
    </KeyboardAvoidingView>
  );
}
