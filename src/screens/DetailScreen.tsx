import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, StatusBar, ActivityIndicator, TextInput, PanResponder,
} from 'react-native';
import { AddressEntry } from '../types';
import { T } from '../i18n';
import { styles } from '../styles';
import { tsToTime } from '../utils';
import { DeleteModal } from '../components/DeleteModal';
import { BalanceData } from '../hooks/useBalance';

type Props = {
  entry: AddressEntry;
  data: any;
  loading: boolean;
  hasError: boolean;
  fetchOne: (entry: AddressEntry) => void;
  balance: BalanceData | undefined;
  balanceLoading: boolean;
  balanceError: boolean;
  fetchBalance: (entry: AddressEntry) => void;
  onBack: () => void;
  onDelete: (entry: AddressEntry) => void;
  onRename: (id: string, label: string) => void;
  deleteTarget: AddressEntry | null;
  onDeleteConfirm: () => void;
  onDeleteClose: () => void;
  t: T;
};

export function DetailScreen({
  entry, data, loading, hasError,
  fetchOne, onBack, onDelete, onRename,
  balance, balanceLoading, balanceError, fetchBalance,
  deleteTarget, onDeleteConfirm, onDeleteClose,
  t,
}: Props) {
  const [countdown, setCountdown] = useState(10);
  const [editingLabel, setEditingLabel] = useState(false);
  const [labelInput, setLabelInput] = useState(entry.label);
  const worker = data?.worker?.[0];

  const panResponder = useRef(PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => g.dx > 20 && Math.abs(g.dy) < 50,
    onPanResponderRelease: (_, g) => { if (g.dx > 80) onBack(); },
  })).current;

  useEffect(() => {
    fetchOne(entry);
    fetchBalance(entry);
    setCountdown(10);
    const interval = setInterval(() => { fetchOne(entry); fetchBalance(entry); setCountdown(10); }, 10000);
    const tick = setInterval(() => setCountdown(c => c > 0 ? c - 1 : 0), 1000);
    return () => { clearInterval(interval); clearInterval(tick); };
  }, [entry.id]);

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#0d0d0d' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} {...panResponder.panHandlers}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0d0d" />
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.detailHeader}>
          <View style={{ flex: 1 }}>
            {editingLabel ? (
              <TextInput
                style={[styles.detailTitle, { borderBottomWidth: 1, borderBottomColor: '#f7931a', paddingVertical: 2 }]}
                value={labelInput}
                onChangeText={setLabelInput}
                autoFocus
                onBlur={() => {
                  const trimmed = labelInput.trim();
                  if (trimmed && trimmed !== entry.label) onRename(entry.id, trimmed);
                  else setLabelInput(entry.label);
                  setEditingLabel(false);
                }}
                onSubmitEditing={() => {
                  const trimmed = labelInput.trim();
                  if (trimmed && trimmed !== entry.label) onRename(entry.id, trimmed);
                  else setLabelInput(entry.label);
                  setEditingLabel(false);
                }}
              />
            ) : (
              <TouchableOpacity onPress={() => { setLabelInput(entry.label); setEditingLabel(true); }}>
                <Text style={styles.detailTitle}>{entry.label} <Text style={{ color: '#555', fontSize: 14 }}>✎</Text></Text>
              </TouchableOpacity>
            )}
          </View>
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

            <View style={styles.card}>
              <Text style={styles.label}>{t.balance}</Text>
              {balanceLoading && !balance ? (
                <ActivityIndicator color="#f7931a" />
              ) : balanceError ? (
                <Text style={{ color: '#e74c3c', fontSize: 13 }}>{t.balanceError}</Text>
              ) : balance ? (
                <View style={styles.hashrateRow}>
                  <View style={styles.hashrateItem}>
                    <Text style={[styles.hashrateValue, { fontSize: 28 }]}>
                      {(balance.confirmed / 1e8).toFixed(8)}
                    </Text>
                    <Text style={styles.hashrateLabel}>{t.balanceConfirmed} BTC</Text>
                  </View>
                  {balance.unconfirmed !== 0 && (
                    <>
                      <View style={styles.divider} />
                      <View style={styles.hashrateItem}>
                        <Text style={[styles.hashrateValue, { color: '#f0c040', fontSize: 28 }]}>
                          {balance.unconfirmed > 0 ? '+' : ''}{(balance.unconfirmed / 1e8).toFixed(8)}
                        </Text>
                        <Text style={styles.hashrateLabel}>{t.balanceUnconfirmed} BTC</Text>
                      </View>
                    </>
                  )}
                </View>
              ) : (
                <Text style={{ color: '#555', fontSize: 13 }}>{t.noData}</Text>
              )}
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
