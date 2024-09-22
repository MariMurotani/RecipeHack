# RecipeHack


## system requirement
1. install neo4j
http://localhost:7474/browser/
default_user: neo4j
default_password: neo4j

2. run build_flavor_db.ipynb

3. lookup via  cypher-shell
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

4. testing query
http://localhost:7474/browser/

EntryをNodeにして、同じMoleculeを持っているものの共起分析をします
中心になるのは、id 364のトマト
カテゴリでフィルタできるようにします

```
WITH ['vegetable', 'nut', 'additive', 'cabbage', 'vegetable stem', 'dairy', 'spice', 'plant', 'herb', 'vegetable root', 'vegetable tuber'] AS validCategories
MATCH (center:Entry {id: 364})-[:CONTAINS]->(m:Molecule)<-[:CONTAINS]-(e2:Entry)
WHERE e2.category IN validCategories
AND center <> e2
WITH center, e2, COUNT(DISTINCT m) AS CooccurrenceCount
WHERE CooccurrenceCount >= 2
WITH center, e2, CooccurrenceCount
ORDER BY CooccurrenceCount DESC
LIMIT 20
MERGE (center)-[r:COOCCURS_WITH {count: CooccurrenceCount}]->(e2)
RETURN center, e2, r;
```

## directory
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
