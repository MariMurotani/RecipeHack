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
MATCH (m:Entry {category: 'meat'}) RETURN m;
MATCH (e:Entry)-[r]->(m:Molecule) RETURN e, type(r), m;
MATCH (e:Entry {category: 'meat'})-[:CONTAINS]->(m:Molecule) RETURN e, m;
MATCH (e:Entry {alias: 'tomato'})-[:CONTAINS]->(m:Molecule) RETURN e, m.flavor_profile;
CALL db.index.fulltext.queryNodes('my_text_index', 'tomato') YIELD node RETURN node;
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
