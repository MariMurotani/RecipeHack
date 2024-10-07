const path = require('path');

module.exports = {
  mode: 'development', // 開発モードまたは本番モード
  entry: './src/index.tsx', // エントリーポイント (アプリケーションの開始ファイル)
  output: {
    path: path.resolve(__dirname, 'dist'), // 出力先ディレクトリ
    filename: 'bundle.js', // 出力されるバンドルファイルの名前
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // .ts や .tsx ファイルを対象に
        use: 'ts-loader', // ts-loader を使用して TypeScript をコンパイル
        exclude: /node_modules/, // node_modules フォルダは除外
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'], // 対象とする拡張子
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // 開発サーバーが提供するディレクトリ
    },
    compress: true, // gzip 圧縮を有効化
    port: 9000, // 開発サーバーのポート
    historyApiFallback: true, // シングルページアプリケーション用の設定
  },
};
