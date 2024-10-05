# RecipeHack


## system requirement
1. Install neo4j

http://localhost:7474/browser/

```
default_user: neo4j
default_password: neo4j
```

2. Run build_flavor_db.ipynb

3. Lookup via cypher-shell
example:  
```
MATCH (m:Molecule {id: 171}) RETURN m;
MATCH (m:Molecule) WHERE 'green' IN m.flavor_profile RETURN m;
MATCH (e:Entry {category: 'meat'}) RETURN e;
MATCH (e:Entry)-[r]->(m:Molecule) RETURN e, type(r), m;
MATCH (e:Entry {category: 'meat'})-[:CONTAINS]->(m:Molecule) RETURN e, m;
MATCH (e:Entry {alias: 'tomato'})-[:CONTAINS]->(m:Molecule) RETURN e, m.flavor_profile;
CALL db.index.fulltext.queryNodes('my_text_index', 'tomato') YIELD node RETURN node;
```

4. Testing query

http://localhost:7474/browser/


EntryをNodeにして、同じMoleculeを持っているものの共起分析をします
中心になるのは、id 364のトマト
カテゴリでフィルタできるようにします

閲覧にはcategory, limit, CooccurrenceCountの調整が必要

```
WITH ['vegetable', 'nut', 'additive', 'cabbage', 'vegetable stem', 'dairy', 'spice', 'plant', 'herb', 'vegetable root', 'vegetable tuber'] AS validCategories
MATCH (center:Entry {id: 364})-[:CONTAINS]->(m:Molecule)<-[:CONTAINS]-(e2:Entry)
WHERE e2.category IN validCategories
AND center <> e2
WITH center, e2, COUNT(DISTINCT m) AS CooccurrenceCount
WHERE CooccurrenceCount >= 10
WITH center, e2, CooccurrenceCount
ORDER BY CooccurrenceCount DESC
LIMIT 30
MERGE (center)-[r:COOCCURS_WITH {count: CooccurrenceCount}]->(e2)
RETURN center, e2, r;
```

さらにflavor_profileでの共起分析をします
```
WITH ['vegetable', 'nut', 'additive', 'cabbage', 'vegetable stem', 'dairy', 'spice', 'plant', 'herb', 'vegetable root', 'vegetable tuber'] AS validCategories
MATCH (center:Entry {id: 364})-[:CONTAINS]->(m:Molecule)<-[:CONTAINS]-(e2:Entry)
WHERE e2.category IN validCategories
AND center <> e2
WITH center, e2, m
UNWIND m.flavor_profile AS flavor
WITH center, e2, COUNT(DISTINCT flavor) AS CooccurrenceCount
WHERE CooccurrenceCount >= 10
WITH center, e2, CooccurrenceCount
ORDER BY CooccurrenceCount DESC
LIMIT 30
MERGE (center)-[r:COOCCURS_WITH {count: CooccurrenceCount}]->(e2)
RETURN center, e2, r;

```

特定のidで共起分析をします

```
WITH [250, 75, 937, 364] AS entryIds 
MATCH (e1:Entry)-[:CONTAINS]->(m:Molecule)<-[:CONTAINS]-(e2:Entry)
WHERE e1.id IN entryIds AND e2.id IN entryIds 
AND e1 <> e2 WITH e1, e2, 
COUNT(DISTINCT m) AS CooccurrenceCount 
WHERE CooccurrenceCount > 0 WITH e1, e2, CooccurrenceCount ORDER BY CooccurrenceCount DESC
// すべてのノード間のリレーションシップを作成 
MERGE (e1)-[r:COOCCURS_WITH {count: CooccurrenceCount}]->(e2)  
// ノードとリレーションシップをグラフ表示 RETURN e1, e2, r;
```

あるEntryとあるEntryの共有している分子のflavor_profileを確認します
```
// id:49 緑茶、id:172: coconut 
MATCH (e1:Entry {id: 49})-[:CONTAINS]->(m:Molecule)<-[:CONTAINS]-(e2:Entry {id: 172}) RETURN m.id, m.flavor_profile;

// 957	["sulfury", "coffee", "fishy", "smoke", "alliaceous", "meaty", "roasted"]
// 323	["alkane"]
```

```
// id:172: coconut 、id:167: banana 
MATCH (e1:Entry {id: 172})-[:CONTAINS]->(m:Molecule)<-[:CONTAINS]-(e2:Entry {id: 167}) RETURN m.id, m.flavor_profile;

// 379	["strawberry", "pungent", "roquefort cheese", "sour", "cheese", "acid", "sweat"]
// 1130	["balsam", "herbal", "pine", "woody", "camphor"]
// 985	["nutty", "burnt", "celery", "coumarin", "tonka", "toasted", "coconut"]
// 1032	["onion", "sulfurous", "garlic"]
// 802	["sweet", "apple peel", "green", "fruit", "fruity", "pineapple", "banana", "waxy"]
// 338	["nutty", "berry", "pungent", "fermented", "fruity", "malt", "bready", "almond"]
```

```
// id:49 緑茶、、id:167: banana 
MATCH (e1:Entry {id: 49})-[:CONTAINS]->(m:Molecule)<-[:CONTAINS]-(e2:Entry {id: 167}) RETURN m.id, m.flavor_profile;

// 323	["alkane"]
// 957	["sulfury", "coffee", "fishy", "smoke", "alliaceous", "meaty", "roasted"]
```

グリーンのフレーバーを持つ一覧
```
MATCH (e1:Entry)-[:CONTAINS]->(m:Molecule)-[:HAS_FLAVOR]->(e2:Flavor {id: 'green'})
WHERE e1.flavor_vector_sum IS NOT NULL
AND e2.flavor_vector IS NOT NULL
RETURN e1.name AS Entry1, e2.id AS Entry2
```

## directory info
```
datas
    ┗ csvdata
jupyter
    ┗ python code with jupyter
frontend
    ┗ typescript code
```

## frontend development
1. npm install
2. npx webpack serve
