const path = require('path');

module.exports = {
  mode: 'development',  // ここを追加
  entry: './src/index.tsx', // アプリケーションのエントリーポイント
  output: {
    filename: 'bundle.js', // 出力されるファイル名
    path: path.resolve(__dirname, 'dist'), // 出力先ディレクトリ
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'], // 対応するファイル拡張子
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // .ts, .tsx ファイルに適用
        use: 'ts-loader', // TypeScript を処理するローダー
        exclude: /node_modules/, // node_modules は除外
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // 開発サーバーのコンテンツディレクトリ
    },
    compress: true, // gzip 圧縮を有効化
    port: 9000, // 開発サーバーのポート番号
  },
  performance: {
    maxAssetSize: 500000, // アセットの最大サイズ (500 KB)
    maxEntrypointSize: 500000, // エントリーポイントの最大サイズ
  },
};
