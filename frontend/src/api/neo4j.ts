import neo4j from 'neo4j-driver';

// Neo4j に接続するためのドライバを作成
// 接続情報を確認
//const uri = process.env.NEO4J_URI || 'neo4j://localhost:7687';  // 接続先のURL
//const user = process.env.NEO4J_USER || 'neo4j';  // ユーザー名
//const password = process.env.NEO4J_PASSWORD || 'neo4j';  // パスワード

const uri = 'neo4j://localhost:7687';  // 接続先のURL
const user = 'neo4j';  // ユーザー名
const password = 'abcd7890';  // パスワード

// ドライバの初期化
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
// セッションを作成してクエリを実行する
export const getEntryDataWithCategoryGroup = async (category: string, value:string) => {
  const session = driver.session();

  console.log(value)
  try {
    console.log(value)
    // クエリを実行
    const result = await session.run(`
      CALL db.index.fulltext.queryNodes('my_text_index', '${value}*') 
      YIELD node as e, score
      WHERE e.category = '${category}' 
      RETURN e, score 
      ORDER BY score DESC
    `);

    result.records.forEach((record) => {
      console.log(record.get('e').properties);
    });
  } catch (error) {
    console.error('Error retrieving data from Neo4j:', error);
  } finally {
    // セッションを閉じる
    await session.close();
  }
};
