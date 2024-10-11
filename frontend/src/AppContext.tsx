import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Entry } from './api/types';

// グローバルで管理する値と関数の型を定義
interface AppContextProps {
  selectedMainGroup: string;
  setSelectedMainGroup: (main_group: string) => void;
  selectedMainItems: Entry[];
  setSelectedMainItems: (items: Entry[]) => void;
  selectedGroups: string[];
  setSelectedGroups: (group: string[]) => void;
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

// AppProvider コンポーネントを作成し、アプリ全体でグローバルな状態を管理
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedMainGroup, setSelectedMainGroup] = useState<string>('');
  const [selectedMainItems, setSelectedMainItems] = useState<Entry[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  return (
    <AppContext.Provider value={{ 
      selectedMainGroup, setSelectedMainGroup, 
      selectedMainItems, setSelectedMainItems,
      selectedGroups, setSelectedGroups
      }}>
      {children}
    </AppContext.Provider>
  );
};
