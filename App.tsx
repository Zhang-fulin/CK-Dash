import React, { useEffect, useState } from 'react';
import { useAddresses } from './src/hooks/useAddresses';
import { useMining } from './src/hooks/useMining';
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

  const { addresses, load, addAddress, removeAddress } = useAddresses();
  const { dataMap, loadingMap, errorMap, fetchOne, fetchAll, clearEntry } = useMining();
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
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    clearEntry(deleteTarget.id);
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
        onBack={() => setActiveId(null)}
        onDelete={setDeleteTarget}
        deleteTarget={deleteTarget}
        onDeleteConfirm={handleDeleteConfirm}
        onDeleteClose={() => setDeleteTarget(null)}
        lang={lang}
        toggleLang={toggleLang}
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
