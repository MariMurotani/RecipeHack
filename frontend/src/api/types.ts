// Entryの型を定義
export interface Entry {
    id: string;
    name: string;
    name_ja: string;
    category: string;
    sub_category: string;
    flavor_principal: string;
    scientific_name: string, 
    synonyms: string
    flavor_count: { [key: string]: number };
    paring_scores: { [key: string]: number };
    flavor_score: number | undefined,
    word_score: number | undefined,
    count: number | undefined,
    distance: number | undefined
  }

// Categoryの型を定義
export interface Category {
  id: string;
  name: string;
  name_ja?: string;
}

// 共起分析を受け取るための型
export interface Coefficient {
  e1: Entry;
  e2: Entry;
  count: number;
}