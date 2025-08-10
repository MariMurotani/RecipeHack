import { hexToHsl } from './color_utils';

export const FOOD_CATEGORIES = [
    { label: 'Earth - 土', color: '#8B4513', key: 'Earth' },
    { label: 'Green - 緑', color: '#556B2F', key: 'Green' },
    { label: 'Tropical - トロピカル', color: '#D2691E', key: 'Tropical' },
    { label: 'Ocean - 海', color: '#4682B4', key: 'Ocean' },
    { label: 'Mountain - 山', color: '#2E8B57', key: 'Mountain' },
    { label: 'Pasture - 牧草地', color: '#2E8B57', key: 'Pasture' },
    { label: 'Field - 畑', color: '#C2B280', key: 'Field' },
    { label: 'Spice & Herbs - スパイスとハーブ', color: '#8B0000', key: 'Spice & Herbs' },
    { label: 'Oil - オイル', color: '#BDB76B', key: 'Oil' },
    { label: 'Drink - 飲み物', color: '#6B8E23', key: 'Drink' },
    { label: 'Others - その他', color: '#708090', key: 'Other' }  
] as const;

// Neo4j に接続するためのドライバを作成
// 接続情報を確認
export const uri = 'bolt://localhost:7687';  // 接続先のURL
export const user = 'neo4j';  // ユーザー名
export const password = 'abcd7890';  // パスワード
//const uri = process.env.NEO4J_URI || 'neo4j://localhost:7687';  // 接続先のURL
//const user = process.env.NEO4J_USER || 'neo4j';  // ユーザー名
//const password = process.env.NEO4J_PASSWORD || 'neo4j';  // パスワード