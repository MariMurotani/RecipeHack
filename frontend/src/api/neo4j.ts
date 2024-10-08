import neo4j, { QueryResult, RecordShape } from 'neo4j-driver';
import { Entry } from './types';

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
export const getEntryDataWithCategoryGroup = async (category: string, value:string): Promise<Entry[]|undefined>  => {
  const session = driver.session();
  const cate_maps: { [key: string]: string[] }  = {
    'meat': ['meat'],
    'fish': ['fish'],
    'vegetable': ['vegetable', 'fungus'],
    'fruit': ['fruit'],
  }
  const cate_string = cate_maps[category].join("', '");

  console.log("category: ", cate_string);
  console.log("value: ", value);
  try {
    // クエリを実行
    const result = await session.run(`
      CALL db.index.fulltext.queryNodes('my_text_index', '${value}*') 
      YIELD node as e, score
      WHERE e.category in ['${cate_string}']
      RETURN e, score 
      ORDER BY score DESC
    `);

    return formatEntries(result);

  } catch (error) {
    console.error('Error retrieving data from Neo4j:', error);
  } finally {
    // セッションを閉じる
    await session.close();
  }
};

const formatEntries = async (result: QueryResult<RecordShape>)=> {
  const entries: Entry[] = result.records.map((record) => {
    const properties = record.get('e').properties;
    
    return {
      id: properties.id,
      name: properties.name,
      category: properties.category,
      flavor_principal: properties.flavor_principal,
      scientific_name: properties.scientific_name,
      synonyms: properties.string,
      flavor_count: JSON.parse(properties.flavor_count),
      paring_scores: JSON.parse(properties.paring_scores),
    };
  });

  return entries ?? [];
};