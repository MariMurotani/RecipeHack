import neo4j from 'neo4j-driver';

// Neo4j に接続するためのドライバを作成
const driver = neo4j.driver(
  'neo4j://localhost:7687', // Neo4j の URL（通常は localhost）
  neo4j.auth.basic('neo4j', 'your_password') // ユーザー名とパスワード
);

// セッションを作成してクエリを実行する
export const getEntryDataWithCategoryGroup = async () => {
  const session = driver.session();

  try {
    // クエリを実行
    const result = await session.run(
      'MATCH (e:Entry) RETURN n LIMIT 10'
    );

    // データを取得し、コンソールに出力
    result.records.forEach((record) => {
      console.log(record.get('n'));
    });
  } catch (error) {
    console.error('Error retrieving data from Neo4j:', error);
  } finally {
    // セッションを閉じる
    await session.close();
  }
};

// データ取得関数をエクスポート
export const getDataFromNeo4j = async () => {
  const session = driver.session();

  try {
    const result = await session.run('MATCH (n) RETURN n LIMIT 10');
    return result.records;
  } catch (error) {
    console.error('Error retrieving data from Neo4j:', error);
  } finally {
    await session.close();
  }
};