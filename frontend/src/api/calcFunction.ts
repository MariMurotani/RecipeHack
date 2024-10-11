export interface Item {
    paring_scores: { [key: string]: number };
    flavor_count: { [key: string]: number };
  }
  
// スコアを合計する
export const calculateScores = (
    selectedMainItems: Item[], 
    selectedAdditionalEntries: Item[]
  ): { paringScore: { [key: string]: number }, flavorCount: { [key: string]: number } } => {
    const paringScore: { [key: string]: number } = {};
    const flavorCount: { [key: string]: number } = {};
  
    // アイテムを1つの配列にまとめて処理
    [...selectedMainItems, ...selectedAdditionalEntries].forEach((item) => {
      Object.keys(item.paring_scores).forEach((key: string) => {
        const v1 = item.paring_scores[key];
        const v2 = item.flavor_count[key];
  
        if (Object.keys(paringScore).includes(key) && key.length > 1) {
          paringScore[key] += v1 * 100;
          flavorCount[key] += v2 * 100;
        } else {
          paringScore[key] = v1 * 1000;
          flavorCount[key] = v2 * 1000;
        }
      });
    });
  
    return { paringScore, flavorCount };
};


// オブジェクトのソートと上位n件を取得する関数
export const sortAndSliceTopN = (obj: { [key: string]: number }, n: number) => {
    return Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .slice(0, n);
  };
  
// スケール合わせる
export const maxScale = (data: [string, number][], max=3000): [string, number][] => {
    const maxValue = Math.max(...data.map(item => item[1]));

    // 最大値が0でないことを確認してから正規化
    if (maxValue === 0) return data;

    // 各値を3000を最大値としてスケール
    return data.map(([key, value]) => [key, parseFloat(((value / maxValue) * max).toFixed(2))]);
};