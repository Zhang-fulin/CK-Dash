import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  TouchableWithoutFeedback, Modal,
} from 'react-native';
import { T } from '../i18n';
import { styles } from '../styles';
import { AddressEntry } from '../types';
import { shortAddr } from '../utils';

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (entry: AddressEntry) => void;
  t: T;
};

export function AddModal({ visible, onClose, onConfirm, t }: Props) {
  const [address, setAddress] = useState('');
  const [label, setLabel] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    const addr = address.trim();
    if (!addr) { setError(t.alertEmpty); return; }
    setError('');
    onConfirm({
      id: Date.now().toString(),
      label: label.trim() || shortAddr(addr),
      address: addr,
    });
    setAddress('');
    setLabel('');
  };

  const handleClose = () => {
    setAddress('');
    setLabel('');
    setError('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalBox, { borderTopWidth: 2, borderTopColor: '#f7931a' }]}>
              <View style={{ width: 36, height: 4, backgroundColor: '#333', borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />
              <Text style={styles.modalTitle}>{t.modalTitle}</Text>
              <Text style={styles.inputLabel}>{t.labelHint}</Text>
              <TextInput
                style={styles.input}
                value={label}
                onChangeText={setLabel}
                placeholder={t.labelPlaceholder}
                placeholderTextColor="#444"
                autoCorrect={false}
              />
              <Text style={styles.inputLabel}>{t.addrHint}</Text>
              <TextInput
                style={[styles.input, { fontFamily: undefined, letterSpacing: 0.3 }, error ? { borderColor: '#e74c3c' } : null]}
                value={address}
                onChangeText={v => { setAddress(v); if (error) setError(''); }}
                placeholder={t.addrPlaceholder}
                placeholderTextColor="#444"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {error ? <Text style={{ color: '#e74c3c', fontSize: 12, marginTop: -8, marginBottom: 10 }}>{error}</Text> : null}
              <TouchableOpacity style={styles.button} onPress={handleConfirm}>
                <Text style={styles.buttonText}>{t.confirm}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.secondaryButton, { marginTop: 10 }]} onPress={handleClose}>
                <Text style={styles.secondaryButtonText}>{t.cancel}</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
