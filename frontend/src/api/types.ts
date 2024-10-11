// Entryの型を定義
export interface Entry {
    id: string;
    name: string;
    category: string;
    flavor_principal: string;
    scientific_name: string, 
    synonyms: string
    flavor_count: { [key: string]: number };
    paring_scores: { [key: string]: number };
    distance : number | undefined
  }

// Categoryの型を定義
export interface Category {
  id: string;
  name: string;
}