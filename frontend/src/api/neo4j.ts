import neo4j, { QueryResult, RecordShape } from 'neo4j-driver';
import { Category, Entry, Coefficient } from './types';

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
export const getMatchedParingEntries = async (main_entries: Entry[], groups:string[], category:string): Promise<{ categories: Category[], entryResult: Entry[] }> =>  {
  const session = driver.session();
  let categories:Category[] = (await getCategoriesFromGroup(groups));
  if(category != ''){
    categories = categories.filter((cate) => cate.id == category);
  }
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
      RETURN DISTINCT other as e, sum(distance) as distance
      ORDER BY distance
    `
    // クエリを実行
    const result = await session.run(query);
    const entryResult:Entry[] = formatEntries(result);

    return { categories, entryResult };
  
  } catch (error) {
    console.error('Error retrieving data from Neo4j:', error);
    return { categories: [], entryResult: [] };
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
    'vegetable': ['vegetable', 'fungus', 'maize', 'vegetable fruit', 'gourd', 'seed', 'nut','plant', 'root', 'legume', 'vegetable root', 'vegetable stem', 'vegetable tuber', 'cabbage'],
    'fruit': ['fruit', 'berry', 'fruit-berry', 'fruit citrus']
  }
  const cate_string = cate_maps[category].join("', '");
  return `'${cate_string}'`;
}

// グループからカテゴリを検索する
const getCategoriesFromGroup = async (groups: string[]): Promise<Category[]> => {
  const session = driver.session();
  const group_ids = groups.map((group) => `'${group}'`).join(', ');
  const query = `
  MATCH (cg:CategoryGroup)-[r:GROUPED]->(c:Category)
  WHERE cg.id IN [${group_ids}]
  RETURN c;
  `
  // クエリを実行
  const records = await session.run(query);
  const categories: Category[] = records.records.map((record) => {
    const properties = record.get('c').properties;
    return {
      id: properties.id,
      name: properties.name,
    }
  });
  return categories ?? [];
}

// Coefficient 分析用のエッジを指定された要素で作成する
export const createSharedFlavorEdges = async (entries: Entry[]): Promise<undefined> => {
  const session = driver.session();
  const entry_ids = entries.map((entry) => entry.id);

  try {
    // entriesの配列を使って動的にクエリを生成
    const queries = [];

    // エントリーのペアを作成 (e1, e2) 総当たりで作成する
    for (let i = 0; i < entry_ids.length; i++) {
      for (let k = i + 1; k < entry_ids.length; k++) {
          // 同じMoleculeを共有するEntry同士にリレーションシップを作成し、countプロパティに共有するMoleculeの数を追加
          const tmp_query = `
          MATCH (e1:Entry {id: ${entry_ids[i]}})-[:CONTAINS]->(m:Molecule)<-[:CONTAINS]-(e2:Entry {id: ${entry_ids[k]}})
          WHERE id(e1) <> id(e2)
          WITH e1, e2, COUNT(m) AS sharedMoleculeCount  // 共有するMoleculeの数をカウント
          MERGE (e1)-[r:RELATED_TO]->(e2)
          SET r.count = sharedMoleculeCount  // リレーションシップにcountプロパティを設定
          RETURN e1, e2, r
          `;
          await session.run(tmp_query);
      }
    }
  } catch (error) {
    console.error('Error executing query:', error);
  } finally {
    await session.close();
  }
}

// Coefficient 分析用のエッジを指定された要素で作成する
export const extractLocalCoefficient = async (entries: Entry[]): Promise<Coefficient[]> => {
  const session = driver.session();
  const entry_ids = entries.map((entry) => entry.id);

  // 検索クエリ
  const f_graph_query = `
  MATCH (e1:Entry)-[r:RELATED_TO]-(e2:Entry)
  WHERE e1.id IN [${entry_ids}] AND e2.id IN [${entry_ids}]
  RETURN e1, r, e2
  `;

  try {
    console.log(f_graph_query);
    const result = await session.run(f_graph_query);

    // クエリ結果を処理
    const result_entries = result.records.map((record) => {
      return {
        e1: record.get('e1').properties,
        e2: record.get('e2').properties,
        count: record.get('r').properties.count
      };
    });

    return result_entries;
  } catch (error) {
    console.error('Error executing query:', error);
    return [];
  } finally {
    await session.close();
  }
};


// エントリの結果をフォーマットする
const formatEntries = (result: QueryResult<RecordShape>): Entry[] => {
  let entries: Entry[] = result.records.map((record) => {
    const properties = record.get('e').properties;
    let distance = 0;
    if(record.keys.includes('distance')){
      distance = record.get('distance');
    }
    return {
      id: properties.id,
      name: properties.name,
      category: properties.category,
      flavor_principal: properties.flavor_principal,
      scientific_name: properties.scientific_name,
      synonyms: properties.string,
      flavor_count: JSON.parse(properties.flavor_count ?? '{}'),
      paring_scores: JSON.parse(properties.paring_scores ?? '{}'),
      distance: distance
    };
  });

  // 各エントリの distance を最大値で正規化する
  entries = normalizeDistances(entries);

  return entries ?? [];
};

export const normalizeDistances = (entries: Entry[]): Entry[] => {
  // distance の最大値を取得
  const maxDistance = Math.max(...entries.map(entry => entry.distance ?? 0));

  // 各エントリの distance を最大値で正規化する
  return entries.map((entry) => {
    if (entry.distance != undefined && maxDistance !== 0) {
      return {
        ...entry,
        distance: parseFloat((1 - (entry.distance / maxDistance)).toFixed(2)) // 最大値で割る
      };
    } else {
      return entry;
    }
  });
};

function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  
  // lengthの長さだけランダムな文字を結合
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}