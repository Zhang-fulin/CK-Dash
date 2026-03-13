import React from 'react';
import {
  View, Text, TouchableOpacity,
  TouchableWithoutFeedback, Modal,
} from 'react-native';
import { AddressEntry } from '../types';
import { T } from '../i18n';
import { styles } from '../styles';

type Props = {
  target: AddressEntry | null;
  onClose: () => void;
  onConfirm: () => void;
  t: T;
};

export function DeleteModal({ target, onClose, onConfirm, t }: Props) {
  return (
    <Modal visible={!!target} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalBox}>
              <Text style={styles.deleteModalIcon}>⚠</Text>
              <Text style={styles.modalTitle}>{t.deleteTitle}</Text>
              <Text style={styles.deleteModalMsg}>{target ? t.deleteMsg(target.label) : ''}</Text>
              <TouchableOpacity style={styles.deleteConfirmBtn} onPress={onConfirm}>
                <Text style={styles.deleteConfirmText}>{t.deleteConfirm}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.secondaryButton, { marginTop: 10 }]} onPress={onClose}>
                <Text style={styles.secondaryButtonText}>{t.deleteCancel}</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
