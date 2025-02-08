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
    distance?: number | undefined,
    key_notes: string[];
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
  aroma: string;
  count: number;
  ratio: number;
  color: string;
}

// Aroma構成を返却
export interface AromaCompound {
  entry_id: string;
  entry_name: string;
  entry_name_ja: string;
  category: string;
  sub_category: string;
  aroma_id: string;
  name: string;
  color: string;
  average_ratio: number;
}

// リンク間のAroma構成
export interface AromaLink {
  link_id: string;
  aromaNotes?: Map<string, number>
};

// PageRankの結果
export interface PageRankResult {
  foodId: string;
  foodName: string;
  displayNameJa: string;
  avgScore: number;
  subTypes: string[];
}