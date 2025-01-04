import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Entry } from './api/types';

// グローバルで管理する値と関数の型を定義
interface AppContextProps {
  selectedMainGroup: string;
  setSelectedMainGroup: (main_group: string) => void;
  selectedMainItems: Entry[];
  setSelectedMainItems: (items: Entry[]) => void;
  selectedGroups: string[];
  setSelectedGroups: (entry: string[]) => void;
  selectedAdditionalEntries: Entry[];
  setSelectedAdditionalEntries: (entry: Entry[]) => void;
  resetAllData: () => void; // リセット関数を追加
}

// コンテキストを作成
const AppContext = createContext<AppContextProps | undefined>(undefined);

// useContext フックを使って AppContext を簡単に呼び出せるフックを作成
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// ローカルストレージのキーを定義
const LOCAL_STORAGE_KEYS = {
  selectedMainGroup: 'selectedMainGroup',
  selectedMainItems: 'selectedMainItems',
  selectedGroups: 'selectedGroups',
  selectedAdditionalEntries: 'selectedAdditionalEntries',
};

// データをローカルストレージから読み込むヘルパー関数
const loadFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : defaultValue;
};

// データをローカルストレージに保存するヘルパー関数
const saveToLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// AppProvider コンポーネントを作成し、アプリ全体でグローバルな状態を管理
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 初期値をローカルストレージから読み込み
  const [selectedMainGroup, setSelectedMainGroup] = useState<string>(
    loadFromLocalStorage(LOCAL_STORAGE_KEYS.selectedMainGroup, '')
  );
  const [selectedMainItems, setSelectedMainItems] = useState<Entry[]>(
    loadFromLocalStorage(LOCAL_STORAGE_KEYS.selectedMainItems, [])
  );
  const [selectedGroups, setSelectedGroups] = useState<string[]>(
    loadFromLocalStorage(LOCAL_STORAGE_KEYS.selectedGroups, [])
  );
  const [selectedAdditionalEntries, setSelectedAdditionalEntries] = useState<Entry[]>(
    loadFromLocalStorage(LOCAL_STORAGE_KEYS.selectedAdditionalEntries, [])
  );

  // 状態が変更されたときにローカルストレージに保存
  useEffect(() => {
    saveToLocalStorage(LOCAL_STORAGE_KEYS.selectedMainGroup, selectedMainGroup);
  }, [selectedMainGroup]);

  useEffect(() => {
    saveToLocalStorage(LOCAL_STORAGE_KEYS.selectedMainItems, selectedMainItems);
  }, [selectedMainItems]);

  useEffect(() => {
    saveToLocalStorage(LOCAL_STORAGE_KEYS.selectedGroups, selectedGroups);
  }, [selectedGroups]);

  useEffect(() => {
    saveToLocalStorage(LOCAL_STORAGE_KEYS.selectedAdditionalEntries, selectedAdditionalEntries);
  }, [selectedAdditionalEntries]);

   // 全ての状態とローカルストレージをリセットする関数
   const resetAllData = () => {
    // 状態をリセット
    setSelectedMainGroup('');
    setSelectedMainItems([]);
    setSelectedGroups([]);
    setSelectedAdditionalEntries([]);
    
    // ローカルストレージをリセット
    Object.values(LOCAL_STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  };

  return (
    <AppContext.Provider
      value={{
        selectedMainGroup,
        setSelectedMainGroup,
        selectedMainItems,
        setSelectedMainItems,
        selectedGroups,
        setSelectedGroups,
        selectedAdditionalEntries,
        setSelectedAdditionalEntries,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
