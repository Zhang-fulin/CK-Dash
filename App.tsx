import React, { useEffect, useState } from 'react';
import { useAddresses } from './src/hooks/useAddresses';
import { useMining } from './src/hooks/useMining';
import { useBalance } from './src/hooks/useBalance';
import { I18N } from './src/i18n';
import { saveLang } from './src/storage';
import { AddressEntry, Lang } from './src/types';
import { ListScreen } from './src/screens/ListScreen';
import { DetailScreen } from './src/screens/DetailScreen';

export default function App() {
  const [lang, setLang] = useState<Lang>('zh');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AddressEntry | null>(null);

  const { addresses, load, addAddress, removeAddress, renameAddress } = useAddresses();
  const { dataMap, loadingMap, errorMap, fetchOne, fetchAll, clearEntry } = useMining();
  const { balanceMap, balanceLoadingMap, balanceErrorMap, fetchBalance, fetchAllBalances, clearBalanceEntry } = useBalance();
  const t = I18N[lang];

  useEffect(() => {
    load(setLang);
  }, []);

  const toggleLang = async () => {
    const next: Lang = lang === 'zh' ? 'en' : 'zh';
    setLang(next);
    await saveLang(next);
  };

  const handleAddAddress = async (entry: AddressEntry) => {
    await addAddress(entry);
    setShowModal(false);
    fetchOne(entry);
    fetchBalance(entry);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    clearEntry(deleteTarget.id);
    clearBalanceEntry(deleteTarget.id);
    await removeAddress(deleteTarget.id);
    if (activeId === deleteTarget.id) setActiveId(null);
    setDeleteTarget(null);
  };

  const activeEntry = addresses.find(a => a.id === activeId);

  if (activeId && activeEntry) {
    return (
      <DetailScreen
        entry={activeEntry}
        data={dataMap[activeId]}
        loading={loadingMap[activeId]}
        hasError={errorMap[activeId]}
        fetchOne={fetchOne}
        balance={balanceMap[activeId]}
        balanceLoading={balanceLoadingMap[activeId]}
        balanceError={balanceErrorMap[activeId]}
        fetchBalance={fetchBalance}
        onBack={() => setActiveId(null)}
        onDelete={setDeleteTarget}
        onRename={renameAddress}
        deleteTarget={deleteTarget}
        onDeleteConfirm={handleDeleteConfirm}
        onDeleteClose={() => setDeleteTarget(null)}
        t={t}
      />
    );
  }

  return (
    <ListScreen
      addresses={addresses}
      dataMap={dataMap}
      loadingMap={loadingMap}
      errorMap={errorMap}
      fetchAll={fetchAll}
      balanceMap={balanceMap}
      fetchAllBalances={fetchAllBalances}
      onAddAddress={handleAddAddress}
      onDeleteAddress={setDeleteTarget}
      deleteTarget={deleteTarget}
      onDeleteConfirm={handleDeleteConfirm}
      onDeleteClose={() => setDeleteTarget(null)}
      showModal={showModal}
      onShowModal={() => setShowModal(true)}
      onCloseModal={() => setShowModal(false)}
      onSelectEntry={setActiveId}
      lang={lang}
      toggleLang={toggleLang}
      t={t}
    />
  );
}
