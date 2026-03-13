import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  TouchableWithoutFeedback, Modal, Alert,
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

  const handleConfirm = () => {
    const addr = address.trim();
    if (!addr) { Alert.alert(t.alertEmptyTitle, t.alertEmpty); return; }
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
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>{t.modalTitle}</Text>
              <Text style={styles.inputLabel}>{t.labelHint}</Text>
              <TextInput
                style={styles.input}
                value={label}
                onChangeText={setLabel}
                placeholder={t.labelPlaceholder}
                placeholderTextColor="#555"
                autoCorrect={false}
              />
              <Text style={styles.inputLabel}>{t.addrHint}</Text>
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder={t.addrPlaceholder}
                placeholderTextColor="#555"
                autoCapitalize="none"
                autoCorrect={false}
              />
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
