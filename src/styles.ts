import { StyleSheet, Platform } from 'react-native';
import { colors } from './theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 16,
  },
  // 列表页 header
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.orange,
    letterSpacing: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langBtn: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  langBtnText: {
    color: colors.textSecondary,
    fontWeight: '700',
    fontSize: 13,
  },
  addBtn: {
    backgroundColor: colors.orange,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  addBtnText: {
    color: '#000',
    fontWeight: '800',
    fontSize: 14,
  },
  // 空状态
  emptyBox: {
    marginTop: 80,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textDim,
    fontSize: 18,
    fontWeight: '600',
  },
  emptyHint: {
    color: '#333',
    fontSize: 13,
    marginTop: 8,
  },
  // 列表卡片
  listCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  listLabel: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  listAddr: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  listCardRight: {
    alignItems: 'flex-end',
    minWidth: 70,
  },
  listHashrate: {
    color: colors.orange,
    fontSize: 18,
    fontWeight: '800',
  },
  listHashrateLabel: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  listError: {
    color: colors.textDim,
    fontSize: 13,
  },
  listErrorRed: {
    color: colors.red,
    fontSize: 13,
    fontWeight: '600',
  },
  // 详情页 header
  detailHeader: {
    paddingTop: 56,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    marginRight: 12,
    paddingVertical: 4,
  },
  backText: {
    color: colors.orange,
    fontSize: 16,
    fontWeight: '600',
  },
  detailTitle: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: '800',
  },
  centerBox: {
    marginTop: 80,
    alignItems: 'center',
  },
  // 状态栏
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.green,
  },
  statusText: {
    color: colors.green,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    marginLeft: 8,
  },
  countdown: {
    color: colors.textMuted,
    fontSize: 13,
  },
  // 通用卡片
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  address: {
    fontSize: 14,
    color: colors.textCode,
    backgroundColor: colors.inputBg,
    padding: 10,
    borderRadius: 8,
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  hashrateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hashrateItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  hashrateValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.orange,
  },
  hashrateLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfCard: {
    flex: 1,
    marginBottom: 12,
  },
  time: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  // 按钮
  button: {
    backgroundColor: colors.orange,
    borderRadius: 10,
    paddingVertical: 14,
  },
  buttonText: {
    color: '#000',
    textAlign: 'center',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 1,
  },
  secondaryButton: {
    borderRadius: 10,
    paddingVertical: 13,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  secondaryButtonText: {
    color: colors.textMuted,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 15,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: 24,
    paddingBottom: 36,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    color: '#888',
    fontSize: 12,
    marginBottom: 6,
    letterSpacing: 1,
  },
  input: {
    height: 48,
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: colors.inputBg,
    paddingHorizontal: 14,
    fontSize: 15,
    marginBottom: 14,
    color: colors.textPrimary,
  },
  // 错误状态
  errorBox: {
    marginTop: 60,
    alignItems: 'center',
    padding: 24,
  },
  errorIcon: {
    fontSize: 40,
    color: colors.red,
    marginBottom: 12,
  },
  errorText: {
    color: colors.red,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  errorHint: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 20,
  },
  retryBtn: {
    backgroundColor: colors.card,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderWidth: 1,
    borderColor: colors.orange,
  },
  retryBtnText: {
    color: colors.orange,
    fontWeight: '700',
    fontSize: 15,
  },
  // 删除确认 Modal
  deleteModalIcon: {
    fontSize: 36,
    color: colors.red,
    textAlign: 'center',
    marginBottom: 8,
  },
  deleteModalMsg: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  deleteConfirmBtn: {
    backgroundColor: colors.darkRed,
    borderRadius: 10,
    paddingVertical: 14,
  },
  deleteConfirmText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '800',
    fontSize: 16,
  },
});
