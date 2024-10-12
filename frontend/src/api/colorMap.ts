export const ColorMap: { [key: string]: string } = {
  // 緑系のカテゴリ
  'green': '#4CAF50',      // 緑
  'leaf': '#388E3C',       // 濃い緑
  'leafy': '#388E3C',       // 濃い緑
  'melon': '#66BB6A',      // メロンのような明るい緑
  'herb': '#81C784',       // ハーブの柔らかい緑
  'peppermint': '#4CAF50', // ペパーミントの緑
  'mint': '#4CAF50',       // ミントの緑
  'herbaceous': '#2E7D32', // ハーブ系の深い緑
  'vegetable': '#388E3C',  // 野菜の濃い緑
  'wintergreen': '#4CAF50', // ワイルドストロベリーの緑
  'cumin': '#4CAF50',      // クミンの緑
  'herbal': '#4CAF50',     // ハーバルの緑
  'new mown hay': '#66BB6A', // 刈ったばかりの干し草の緑
  'caraway': '#388E3C',    // キャラウェイの緑
  'celery': '#4CAF50',     // セロリの緑
  'cabbage': '#4CAF50',    // キャベツの緑

  // 黄色系のカテゴリ
  'cheese': '#FFEB3B',     // チーズの黄色
  'sweet': '#FBC02D',      // 蜜のような黄色
  'pine': '#FBC02D',      // 蜜のような黄色
  'pineapple': '#FFEB3B',  // パイナップルの黄色
  'honey': '#FFB300',      // ハチミツの濃い黄色
  'waxy': '#FFB300',      // ハチミツの濃い黄色
  'very mild': '#FFD54F',  // 淡い黄色
  'butter': '#FFC107',     // バターの黄色
  'dairy': '#FFE082',      // 乳製品の淡い黄色
  'soy': '#FFE082',     // バターの黄色
  'cream': '#FFF9C4',      // クリームの淡い黄色
  'creamy': '#FFF9C4',     // クリーミーな淡い黄色
  'milky': '#FFF8E1',      // ミルクの淡い黄色
  'buttery': '#FFE57F',    // バターの明るい黄色
  'pear': '#FFF176',       // 洋梨の黄色
  'vanilla': '#FFEB3B',    // バニラの黄色
  'coconut': '#FFE082',    // ココナッツの黄色
  'fatty': '#FFD54F',      // 脂肪の黄色
  'peach': '#FFD54F',      // ピーチの黄色

  // 茶色系のカテゴリ
  'wood': '#8D6E63',       // 木の茶色
  'nuts': '#795548',       // ナッツの茶色
  'nutty': '#795548',      // ナッツの茶色
  'woody': '#6D4C41',      // ウッディな濃い茶色
  'caramel': '#A1887F',    // カラメルの茶色
  'balsam': '#8E6B55',     // バルサム系の茶色
  'bready': '#D7CCC8',     // パンのような柔らかい茶色
  'chocolate': '#5D4037',  // チョコレートの濃い茶色
  'almond': '#D2B48C',     // アーモンドの茶色
  'whiskey': '#A0522D',    // ウイスキーの茶色
  'cocoa': '#795548',      // ココアの茶色
  'oily': '#6D4C41',       // 油っぽい茶色
  'cinnamon': '#D2691E',   // シナモンのオレンジっぽい茶色
  'spicy': '#FF7043',      // スパイシーなオレンジ
  'spice': '#FF7043',      // スパイスのオレンジ
  'sulfurous': '#D2691E',  // 硫黄系のスパイス色
  'pepper': '#D2691E',     // 胡椒の茶色
  'rum': '#A0522D',        // ラムの茶色
  'burnt': '#A52A2A',      // 焦げた茶色
  'toasted': '#A52A2A',    // トーストした茶色

  // 赤系のカテゴリ
  'rose': '#E57373',       // バラの赤
  'musk': '#D32F2F',       // ムスクの濃い赤
  'apple': '#FF1744',      // りんごの赤
  'apple peel': '#FF1744', // りんごの赤
  'cherry': '#D50000',     // さくらんぼの赤
  'grapefruit': '#FF5252', // グレープフルーツの赤
  'fruity': '#FF5252', // グレープフルーツの赤
  'fruit': '#FF5252', // グレープフルーツの赤
  'floral': '#FF4081',     // フローラルなピンク
  'flower': '#F50057',     // 花の濃いピンク
  'berry': '#E91E63',      // ベリーの赤
  'apricot': '#FF8A65',    // アプリコットの赤
  'meaty': '#C62828',      // 肉の赤
  'wine_like': '#B71C1C',  // ワインの赤
  'vinegar': '#B71C1C',  // ワインの赤
  'hyacinth': '#E91E63',   // ヒヤシンスの赤
  'coumarin': '#FADADD', // 桜の色

  // 青系のカテゴリ
  'fishy': '#4A90E2',      // 魚の青
  'sour': '#1976D2',       // 酸味の青
  'sharp': '#2196F3',      // シャープな青
  'ether': '#42A5F5',      // エーテルの青
  'ethereal': '#1E88E5',   // エーテリアルの青
  'aldehydic': '#64B5F6',  // アルデヒド系の青
  'urine': '#1976D2',      // 尿の青
  'faint': '#1E88E5',      // かすかな青
  'strong': '#0D47A1',     // 強い青
  'medicinal': '#42A5F5',  // 薬の青
  'medicine': '#64B5F6',   // 医薬の青
  'fusel': '#2196F3',      // フューゼルの青
  'rancid': '#1976D2',     // 酸敗した青
  'acetic': '#4A90E2',     // 酢酸の青
  'musty': '#42A5F5',      // カビ臭い青
  'formyl': '#64B5F6',     // フォルミル系の青
  'tonka': '#1976D2',      // トンカの青
  'acrid': '#2196F3',      // 刺激臭の青
  'metallic': '#1E90FF',   // メタリックな青
  'camphor': '#1E88E5',    // カンファーの青
  'alkane': '#42A5F5',     // アルカンの青
  'pungent': '#2196F3',   // 辛い青
  'sulfur': '#2196F3',   // 硫黄の青

  // その他
  'onion': '#F3ECD8',      // 玉ねぎの白
  'garlic': '#F3ECD8',      // 玉ねぎの白
  'leather': '#8D6E63',    // レザーの茶色
};
