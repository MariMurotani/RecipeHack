import neo4j, { QueryResult, RecordShape } from 'neo4j-driver';
import { Category, Entry } from './types';

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

// グループを指定してEntryを検索する
export const getEntryDataWithCategoryGroup = async (category: string, value:string): Promise<Entry[]|undefined>  => {
  const session = driver.session();
  const cate_string = getCategories(category);

  try {
    // クエリを実行
    const result = await session.run(`
      CALL db.index.fulltext.queryNodes('my_text_index', '${value}*') 
      YIELD node as e, score
      WHERE e.category in [${cate_string}]
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

// 指定されたエントリのマッチングアイテムをエントリの一覧から探す
export const getMatchedParingEntries = async (main_entries: Entry[], category:string): Promise<Entry[]|undefined>  => {
  const session = driver.session();
  const categories = (await getCategoriesFromGroup(category));
  const main_entries_string = main_entries.map((entry) => `${entry.id}`).join(', ');
  const cate_string = categories.map((category) => `'${category.id}'`).join(', ');

  try {
    const query = `
    MATCH (e:Entry)-[:CONTAINS]->(c:Molecule)<-[:CONTAINS]-(other:Entry)
    WHERE e.id IN [${main_entries_string}]
    MATCH (e)-[:HAS_CATEGORY]->(ec:Category)
    MATCH (other)-[:HAS_CATEGORY]->(oc:Category)
    WHERE e.name <> other.name
    AND other.category IN [${cate_string}]
    AND e.flavor_vector IS NOT NULL
    AND other.flavor_vector IS NOT NULL
    WITH e, other, vector.similarity.euclidean(e.flavor_vector, other.flavor_vector) AS distance
    RETURN DISTINCT other as e, distance
    ORDER BY distance DESC
    `
    // クエリを実行
    const result = await session.run(query);

    return formatEntries(result);

  } catch (error) {
    console.error('Error retrieving data from Neo4j:', error);
  } finally {
    // セッションを閉じる
    await session.close();
  }
}

// カテゴリないの一覧を文字列で返す
const getCategories = (category: string): string => {
  const cate_maps: { [key: string]: string[] }  = {
    'meat': ['meat', 'Animal Product'],
    'fish': ['fish', 'seafood'],
    'vegetable': ['vegetable', 'fungus', 'vegetable fruit', 'gourd', 'seed', 'plant', 'root', 'legume', 'vegetable root', 'vegetable stem', 'vegetable tuber', 'cabbage'],
    'fruit': ['fruit', 'berry', 'fruit-berry', 'fruit citrus'],
  }
  console.log("category: ", category);
  const cate_string = cate_maps[category].join("', '");
  return `'${cate_string}'`;
}

// グループからカテゴリを検索する
const getCategoriesFromGroup =  async (group: string): Promise<Category[]> => {
  const session = driver.session();
  const query = `
  MATCH (cg:CategoryGroup {id: '${group}'})-[r:GROUPED]->(c:Category)
  RETURN c;
  `
  // クエリを実行
  const records = await session.run(query);
  const entries: Category[] = records.records.map((record) => {
    const properties = record.get('c').properties;
    return {
      id: properties.id,
      name: properties.name,
    }
  });
  return entries;
}


// エントリの結果をフォーマットする
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
      distance: properties.distance,
    };
  });

  return entries ?? [];
};