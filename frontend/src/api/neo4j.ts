import neo4j, { QueryResult, RecordShape } from 'neo4j-driver';
import { Category, Entry, Coefficient, AromaCompound, FoodAromaPageRankResult, FoodRecipePageRankResult } from './types';
import { uri, user, password } from './constants';

// ドライバの初期化
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

// グループを指定してEntryを検索する
export const getEntryDataWithCategoryGroup = async (class_name: string, value:string): Promise<Entry[]|undefined>  => {
  const categories: string[] = await getCategories(class_name);
  const cate_string = categories.map((category) => `'${category}'`).join(", ");
  const session = driver.session();
  try {
    // クエリを実行
    const result = await session.run(`
      CALL db.index.fulltext.queryNodes("food_origin_index_text_search", "${value}*") 
      YIELD node AS f, score
      MATCH (f)-[c:HAS_GROUP]->(fg:FoodGroup)
      WHERE fg.id IN [${cate_string}]
      RETURN f, fg, score
      ORDER BY score DESC, f.popularity desc;
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
export const getMatchedParingEntries = async (main_entries: Entry[], groups:string[], filter_category:string): Promise<{ categories: Category[], entryResult: Entry[] }> =>  {
  const session = driver.session();
  let categories:Category[] = await getCategorySubFromGroup(groups);
  const main_entries_string = main_entries.map((entry) => `'${entry.id}'`).join(",");
  if(filter_category !== ""){
    categories = categories.filter((category) => category.id === filter_category);
  }
  const cate_string = categories.map((category) => `'${category.id}'`).join(",");
  
  try {
    const query = `
    // Step 1: 特定のFoodノードから関連するCompoundを取得
    MATCH (f1:Food)-[:HAS_SUBTYPE]->(fst1:FoodSubType)-[:CONTAINS]->(comp:Compound)
    WHERE f1.id IN [${main_entries_string}]

    // Step 2: CompoundのIDをリストとして取得
    WITH f1, f1.flavor_vector AS f1Vector, COLLECT(comp.id) AS compoundIds

    // Step 3: 同じCompoundを共有するFoodノードを取得
    MATCH (f2:Food)-[:HAS_SUBTYPE]->(fst2:FoodSubType)-[:CONTAINS]->(comp2:Compound)
    WHERE comp2.id IN compoundIds

    // Step 4: Categoryでフィルタリング
    MATCH (f2)-[:HAS_SUB_GROUP]->(fg:FoodSubGroup)
    WHERE fg.id IN [${cate_string}] and f2.id <> f1.id

    // Step 5: ベクター計算
    WITH f2 AS f,
        COLLECT(DISTINCT fst2.key_note) AS key_notes,
        COUNT(DISTINCT comp2.id) AS count,
        AVG(gds.similarity.cosine(f1.word_vector, f2.word_vector)) AS word_score,
        AVG(gds.similarity.overlap(f1.flavor_vector, f2.flavor_vector)) AS flavor_score

    // Step 6: ユニークな結果を返す
    RETURN f, key_notes, count, word_score, flavor_score
    ORDER BY word_score DESC, flavor_score DESC, f.popularity desc;
    `;
    console.log(query);
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
const getCategories = async (class_name: string): Promise<string[]> => {
  const session = driver.session();
  const result = await session.run(`
      MATCH (fg:FoodGroup)
      WHERE fg.class_name='${class_name}'
      RETURN fg;
  `);
  const category_ids: string[] = result.records.map(
    (record) => record.get('fg').properties.id
  );
  return category_ids;
}

// カテゴリないの一覧を文字列で返す
const getCategorySubFromGroup = async (class_names: string[]): Promise<Category[]> => {
  const session = driver.session();
  const class_name_string = class_names.join("','");
  const result = await session.run(`
      MATCH (fg:FoodSubGroup)
      WHERE fg.class_name in ['${class_name_string}']
      RETURN fg;
  `);
  const category_ids: Category[] = result.records.map(
    (record) => {
      const properties = record.get('fg').properties;
      return {
        id: properties.id,
        name: properties.name,
        name_ja: properties.display_name_ja
      }
    }
  );
  return category_ids;
}

// Coefficient 分析用のエッジを指定された要素で作成する
export const extractLocalCoefficient = async (entries: Entry[]): Promise<Coefficient[]> => {
  const session = driver.session();
  const entry_ids = entries.map((entry) => entry.id);

  try {
    const resultCoefficient:Coefficient[] = [];

    // エントリーのペアを作成 (e1, e2) 総当たりで作成する
    for (let i = 0; i < entry_ids.length; i++) {
      for (let k = i + 1; k < entry_ids.length; k++) {
        const e1 = entry_ids[i];
        const e2 = entry_ids[k];
        // 同じMoleculeを共有するEntry同士にリレーションシップを作成し、countプロパティに共有するMoleculeの数を追加
        const tmp_query = `
        // Step 1: 特定のFoodノードから関連するAromaを取得
        MATCH (f1:Food {id: '${e1}'})-[:HAS_SUBTYPE]->(fst1:FoodSubType)-[:SCENTED]->(aroma:Aroma)

        // Step 2: AromaのIDをリストとして取得
        WITH f1, f1.flavor_vector AS f1Vector, COLLECT(DISTINCT aroma.id) AS aromaIds

        // Step 3: 同じAromaを共有するFoodノードを取得
        MATCH (f2:Food {id: '${e2}'})-[:HAS_SUBTYPE]->(fst2:FoodSubType)-[r:SCENTED]->(aroma2:Aroma)
        WHERE aroma2.id IN aromaIds

        // Step 4: AromaのIDごとにカウントを集計
        WITH f1, f2, COALESCE(SUM(r.ratio), 0.0) AS aromaRatio, aroma2, COUNT(DISTINCT aroma2.id) AS aromaCount

        // 結果を返す
        RETURN f1, f2, aromaRatio, aroma2.id as aromaId, aromaCount, aroma2.color as aromaColor
        ORDER BY aromaCount, aromaRatio DESC
        LIMIT 3;
        `;
        // console.log(tmp_query);
        const tmp_shared_count_result = await session.run(tmp_query);
        tmp_shared_count_result.records.forEach((record) => {
          const aromaRatio = record.get('aromaRatio');
          resultCoefficient.push({
            e1: formatEntry(record, record.get('f1').properties), 
            e2: formatEntry(record, record.get('f2').properties), 
            aroma: record.get('aromaId'), 
            count: parseInt(record.get('aromaCount') ?? 0),
            ratio: parseFloat(isNaN(Number(aromaRatio)) ? 0.0 : aromaRatio),
            color: record.get('aromaColor')
          } as Coefficient);
        });
      }
    }
    return resultCoefficient;
  } catch (error) {
    console.error('Error executing query:', error);
    return [];
  } finally {
    await session.close();
  }
}

// Entryの値idを受け取ってEntryごとのAromaの一覧と含有量を返す
export const fetchAromaCompoundWithEntry = async (entry_id: string): Promise<AromaCompound[]> => {
  const session = driver.session();
  const query = `
    MATCH (f:Food {id:'${entry_id}'})-[:HAS_SUBTYPE]->(fs:FoodSubType)-[r:SCENTED]->(a:Aroma)
    WITH 
      f.id AS food_id, 
      f.name AS food_name,
      f.display_name_ja AS food_name_ja,
      a.id AS aroma_id, 
      a.name AS aroma_name, 
      a.color AS color_code,
      AVG(toFloat(r.ratio)) AS average_ratio
    WHERE average_ratio > 0
    RETURN 
      DISTINCT food_id, food_name, food_name_ja,
      aroma_id, 
      color_code, 
      aroma_name, 
      average_ratio
    ORDER BY average_ratio DESC
    LIMIT 8
  `
  try {
    // console.log(query);
    const result = await session.run(query);
    const max_average_ratio = Math.max(...result.records.map((record) => parseFloat(record.get('average_ratio'))));

    const aromaCompounds = result.records.map((record) => {
      return {
        entry_id: record.get('food_id'),
        entry_name: record.get('food_name'),
        entry_name_ja: record.get('food_name_ja'),
        aroma_id: record.get('aroma_id'),
        name: record.get('aroma_name'),
        color: record.get('color_code'),
        average_ratio: parseFloat(record.get('average_ratio')) / max_average_ratio
      } as AromaCompound;
    });
    return aromaCompounds;
  } catch (error) {
    console.error('Error executing query:', error);
    return [];
  } finally {
    await session.close();
  }
};

// Entryの値idを受け取ってEntryごとのAromaの一覧と含有量を返す
export const fetchAromaCompoundWithEntries= async (entry_ids: string[]): Promise<AromaCompound[]> => {
  const session = driver.session();
  const query = `
    MATCH (f:Food)-[:HAS_SUBTYPE]->(fs:FoodSubType)-[r:SCENTED]->(a:Aroma)
    WHERE f.id in [${entry_ids.map((entry_id) => `'${entry_id}'`).join(', ')}]
    OPTIONAL MATCH (f)-[:BELONGS_TO]->(fg:FoodGroup)
    OPTIONAL MATCH (f)-[:BELONGS_TO]->(fsg:FoodSubGroup)
    WITH 
      f.id AS food_id, 
      f.name AS food_name,
      f.display_name_ja AS food_name_ja,
      fg.display_name_ja AS food_category,
      fsg.display_name_ja AS food_sub_category,
      a.id AS aroma_id, 
      a.name AS aroma_name, 
      a.color AS color_code,
      SUM(toFloat(r.ratio)) AS average_ratio
    WHERE average_ratio > 0
    RETURN 
      DISTINCT food_id, 
      food_name, food_name_ja, 
      food_category, food_sub_category,
      aroma_id, 
      color_code, 
      aroma_name, 
      average_ratio
    ORDER BY food_category, food_sub_category, average_ratio DESC
  `
  // console.log(query);
  try {
    const result = await session.run(query);
    const max_average_ratio = Math.max(...result.records.map((record) => parseFloat(record.get('average_ratio'))));

    const aromaCompounds = result.records.map((record) => {
      return {
        entry_id: record.get('food_id'),
        entry_name: record.get('food_name'),
        entry_name_ja: record.get('food_name_ja'),
        category: record.get('food_category'),
        sub_category: record.get('food_sub_category'),
        aroma_id: record.get('aroma_id'),
        name: record.get('aroma_name'),
        color: record.get('color_code'),
        average_ratio: (parseFloat(record.get('average_ratio')) / max_average_ratio) * 100
      } as AromaCompound;
    });
    return aromaCompounds;
  } catch (error) {
    console.error('Error executing query:', error);
    return [];
  } finally {
    await session.close();
  }
};

// FoodとAromaのページランクの結果を返す
export const fetchPageRank = async (group_names: string[]):Promise<FoodAromaPageRankResult[]> => {
  const project_name = generateRandomString(6);
  let categories:Category[] = await getCategorySubFromGroup(group_names);
  const category_string = categories.map((category) => `"${category.id}"`).join(", ");
  const session = driver.session();
  
  await session.run(`
    CALL gds.graph.exists('${project_name}')
    YIELD exists
    WITH exists
    WHERE exists = true
    CALL gds.graph.drop('${project_name}') YIELD graphName
    RETURN graphName;
  `);

  const excluded_categories = ["dishes", "snack_foods", "frozen_desserts", "other_beverages", "confectioneries", "beverages"].map((category) => `"${category}"`);
  const filter_query = (categories.length > 0) ? 
    `f.group IN [${category_string}]`:
    `NOT f.group IN [${excluded_categories.join(', ')}]`; 
    
  const query1= `
    CALL gds.graph.project.cypher(
      '${project_name}',
      'MATCH (n) 
      WHERE (n:FoodSubType AND 
              EXISTS { MATCH (f:Food)-[:HAS_SUBTYPE]->(n) 
                      WHERE ${filter_query} }
            ) 
          OR n:Compound 
          OR n:Aroma
      RETURN id(n) AS id, labels(n) AS labels',
      'MATCH (n)-[r:CONTAINS|SCENTED]-(m) 
      RETURN id(n) AS source, id(m) AS target, type(r) AS type',
      { validateRelationships: false }
    )`;
  console.log(query1);
  await session.run(query1);

  const result = await session.run(`
    WITH [${excluded_categories.join(',')}] AS excludedGroups

    // 中心性分析を実行 PageRankアルゴリズムを使用
    CALL gds.pageRank.stream('${project_name}')
    YIELD nodeId, score
    ORDER BY score DESC 
    WITH excludedGroups, COLLECT(nodeId) AS foodSubNodeIds, COLLECT(score) AS scores

    // 特定カテゴリを除外してFoodSubTypeを取得
    UNWIND range(0, size(foodSubNodeIds) - 1) AS idx 
    MATCH (f:Food)-[:HAS_SUBTYPE]->(fs:FoodSubType) 
    WHERE id(fs) = foodSubNodeIds[idx] 
      AND NOT f.group IN excludedGroups
    WITH f, AVG(scores[idx]) AS avgScore, COLLECT(fs.name) AS subTypes
    RETURN f.id as foodId, f.name as foodName, f.display_name_ja as displayNameJa, avgScore, subTypes
    ORDER BY avgScore DESC
    LIMIT 100
  `);

  const pageRankResult:FoodAromaPageRankResult[] = result.records.map((record)=> (
      {
        "foodId": record.get("foodId"),
        "foodName": record.get("foodName"),
        "displayNameJa": record.get("displayNameJa"), 
        "avgScore": record.get("avgScore").toFixed(2),
        "subTypes": record.get("subTypes")
      }
    )
  );

  await session.run(`
    CALL gds.graph.drop('${project_name}') YIELD graphName
  `);

  return pageRankResult
};

// Foodとレシピのページランクの結果を返す
export const fetchFoodRecipePageRank = async (id: string):Promise<FoodRecipePageRankResult[]> => {
  const project_name = generateRandomString(6);
  const session = driver.session();
  
  await session.run(`
    CALL gds.graph.exists('${project_name}')
    YIELD exists
    WITH exists
    WHERE exists = true
    CALL gds.graph.drop('${project_name}') YIELD graphName
    RETURN graphName;
  `);

  const query1 = `
    CALL gds.graph.project.cypher(
      '${project_name}', 
      'MATCH (n) 
      WHERE (n:Food AND EXISTS { 
              MATCH (f:Recipe)-[:CONTAINS]->(n) 
              WHERE f.id IN ["${id}"] 
            }) 
          OR (n:Food AND EXISTS { 
              MATCH (:Food {id: "${id}"})-[:USED_TOGETHER]->(n) 
            }) 
          OR (n:Recipe AND EXISTS { 
              MATCH (n)-[:CONTAINS]->(:Food {id: "${id}"}) 
            })
      RETURN id(n) AS id, labels(n) AS labels',
      'MATCH (n)-[r:CONTAINS|USED_TOGETHER]-(m)
      RETURN id(n) AS source, id(m) AS target, type(r) AS type',
      { validateRelationships: false }
    );
  `;
  console.log("query1", query1); 
  try{
    await session.run(query1);
  } catch (error) {
    return [];
  }
  const result = await session.run(`
    CALL gds.pageRank.stream('${project_name}')
    YIELD nodeId, score
    WITH gds.util.asNode(nodeId) AS node, score
    WHERE node.id <> "${id}"
    RETURN node as f, score
    ORDER BY score DESC
    LIMIT 20;
  `);
  const pageRankResult:FoodRecipePageRankResult[] = result.records.map((record)=> {
    const properties = record.get('f').properties;
    return {
      "e1": formatEntry(record, properties),
      "score": record.get("score").toFixed(2)
    }
  });

  await session.run(`
    CALL gds.graph.drop('${project_name}') YIELD graphName
  `);
  return pageRankResult;
};

// エントリの結果をフォーマットする
const formatEntries = (result: QueryResult<RecordShape>): Entry[] => {
  let entries: Entry[] = result.records.map((record) => {
    const properties = record.get('f').properties;
    return formatEntry(record, properties);
  });
  // 各エントリの distance を最大値で正規化する
  entries = normalizeDistances(entries, "distance");
  entries = normalizeDistances(entries, "word_score");
  entries = normalizeDistances(entries, "flavor_score");

  console.log(entries);
  return entries ?? [];
};

// エントリの結果をフォーマットする
const formatEntry = (record:any, properties:any): Entry => {
  let count = 0;
  let flavor_score = 0;
  let word_score = 0;
  let key_notes = [];
  if(record.has('count')){
    count = parseInt(record.get('count'));
  }
  if (record.has('flavor_score')) {
    flavor_score = parseFloat(record.get('flavor_score'));
  }
  if(record.has('word_score')){
    word_score = parseFloat(record.get('word_score'));
  }
  if(record.has('key_notes')){
    key_notes = record.get('key_notes');
  }
  return {
    id: properties.id,
    name: properties.name,
    name_ja: properties.display_name_ja,
    category: properties.group,
    sub_category: properties.sub_group,
    flavor_principal: properties.flavor_principal,
    scientific_name: properties.scientific_name,
    synonyms: properties.string,
    flavor_count: JSON.parse(properties.SharedCompoundCount ?? '{}'),
    paring_scores: JSON.parse(properties.paring_scores ?? '{}'),
    flavor_score: flavor_score,
    word_score: word_score,
    count: count,
    distance: 0,
    key_notes: key_notes
  };
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
 
export const normalizeDistances = (entries: Entry[], target: keyof Entry): Entry[] => {
  if (entries.length === 0) return entries;

  const values = entries
  .map(entry => Number(entry[target] ?? 0))
  .filter(value => !isNaN(value));

  const maxValue = values.length > 0 ? Math.max(...values) : 0;

  return entries.map((entry) => {
    const value = Number(entry[target] ?? 0);
    if (!isNaN(value) && maxValue !== 0) {
      return {
        ...entry,
        [target]: parseFloat((value / maxValue).toFixed(2)), // Normalize
      };
    } else {
      return entry;
    }
  });
};

