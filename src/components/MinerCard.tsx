import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AddressEntry } from '../types';
import { T } from '../i18n';
import { styles } from '../styles';
import { shortAddr } from '../utils';
import { BalanceData } from '../hooks/useBalance';

type Props = {
  entry: AddressEntry;
  worker: any;
  isLoading: boolean;
  hasError: boolean;
  balance: BalanceData | undefined;
  onPress: () => void;
  onLongPress: () => void;
  t: T;
};

export function MinerCard({ entry, worker, isLoading, hasError, balance, onPress, onLongPress, t }: Props) {
  return (
    <TouchableOpacity
      style={styles.listCard}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.listCardLeft}>
        <View style={[styles.statusDot, hasError ? { backgroundColor: '#e74c3c' } : !worker && { backgroundColor: '#444' }]} />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.listLabel}>{entry.label}</Text>
          <Text style={styles.listAddr}>{shortAddr(entry.address)}</Text>
          {balance !== undefined && (
            <Text style={{ color: '#f7931a', fontSize: 12, marginTop: 3 }}>
              ₿ {(balance.confirmed / 1e8).toFixed(8)}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.listCardRight}>
        {isLoading && !worker ? (
          <ActivityIndicator size="small" color="#f7931a" />
        ) : worker ? (
          <>
            <Text style={styles.listHashrate}>{worker.hashrate1m}</Text>
            <Text style={styles.listHashrateLabel}>1m</Text>
          </>
        ) : hasError ? (
          <Text style={styles.listErrorRed}>⚠ {t.fetchError}</Text>
        ) : (
          <Text style={styles.listError}>{t.noData}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
