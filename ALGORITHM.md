# アルゴリズム一覧

### Function List
https://neo4j.com/docs/cypher-manual/current/functions/scalar/
### 仮想グラフの作成をする
https://neo4j.com/docs/graph-data-science/current/management-ops/graph-creation/graph-project/
Gdsライブラリで利用するための、仮想グラフを作成します
データベースからインメモリにロードして利用でき、次のいずれかが発生するまで残存し続けます
- グラフは gds.graph.drop プロシージャで削除
- グラフの投影元である Neo4j データベースが停止または削除
- Neo4j DBMS が停止されています。
※1 仮想グラフを作成するときにPropetry

## 1. 中央性（Centrality）
https://neo4j.com/docs/graph-data-science/current/algorithms/centrality/
中央性は、グラフ内で重要なノードを見つけるために使用されます。
* **PageRank**: ノードの重要性をランク付けします（Googleの検索アルゴリズムで有名）。
* **Betweenness Centrality**: ノードがどれだけ他のノード間のショートカットに位置するかを計測。
* **Degree Centrality**: ノードが持つ直接のリンクの数を計測。
* **Closeness Centrality**: 他のすべてのノードにどれだけ近いかを測定。
* **Harmonic Centrality**: 他のノードに対する平均的な「距離」を逆数で表現。
~~~
// 仮想グラフがあれば削除
CALL gds.graph.exists('myCentrality')
YIELD exists
WITH exists
WHERE exists = true
CALL gds.graph.drop('myCentrality') YIELD graphName
RETURN graphName;

// 仮想グラフを作成
CALL gds.graph.project(
	'myCentrality',
	['Entry', 'Molecule'],
	{
		CONTAINS: {
			orientation: 'UNDIRECTED'
	}
	}
);

// 仮想グラフから読みとる
CALL gds.pageRank.stream('myCentrality')
YIELD nodeId, score
WITH gds.util.asNode(nodeId) AS node, score
WHERE node:Entry AND node.name IS NOT NULL

// Entryノードに紐づくMoleculeとflavor_profileを取得
OPTIONAL MATCH (node)-[:CONTAINS]->(m:Molecule)
WITH node, score, m.flavor_profile AS flavors

// 配列を展開して、ユニークなflavor_profileを取得
UNWIND flavors AS flavor
WITH node, score, flavor
WHERE flavor IS NOT NULL AND flavor <> ""

// フレーバーごとのカウントを集計し、カウントに基づいて並べ替え
WITH node, score, flavor, COUNT(flavor) AS flavorCount
ORDER BY flavorCount DESC  // フレーバーをカウントで並べ替え

// ソートされたデータをリストにまとめる
WITH node, score, collect({name: flavor, count: flavorCount}) AS flavorData

// 結果を返す
RETURN node.name AS name, flavorData, score
ORDER BY score DESC
LIMIT 30;
~~~

###  2. コミュニティ検出（Community Detection）
ノードをグループ分けしてコミュニティを発見するアルゴリズムです。
* **Louvain**: ノードをコミュニティにグループ化してモジュラリティを最適化します。
* **Label Propagation**: ラベルを近隣ノードに伝播させ、コミュニティを形成します。
* **Connected Components**: 連結成分を見つけます。
* **Weakly Connected Components**: 弱連結成分を特定。
* **Strongly Connected Components**: 強連結成分を特定。

#### Moleculeをflavor_vectorによってクラスタリングする
```
// 仮想グラフがあれば削除
CALL gds.graph.exists('kmeansGraph')
YIELD exists
WITH exists
WHERE exists = true
CALL gds.graph.drop('kmeansGraph') YIELD graphName
RETURN graphName;

// 仮想グラフを作成
CALL gds.graph.project(
  'kmeansGraph',
  {
    Entry: {
      label: 'Entry'
    },
    Molecule: {
      label: 'Molecule',
      properties: ['flavor_vector']  // プロパティを指定
    }
  },
  {
    CONTAINS: {
      type: 'CONTAINS',
      orientation: 'UNDIRECTED'
    }
  }
);

// Kmeansでクラスタ数を指定して
CALL gds.kmeans.stream('kmeansGraph', {
nodeLabels: ['Molecule'], // Molecule ノードのみを対象
relationshipTypes: ['CONTAINS'], // CONTAINS リレーションシップを使う
k: 10, // クラスタの数を指定
maxIterations: 100, // 最大反復回数
nodeProperty: 'flavor_vector' // クラスタリングに使用するプロパティ
})
YIELD nodeId, communityId, distanceFromCentroid, silhouette
WITH gds.util.asNode(nodeId) AS node, communityId, distanceFromCentroid, silhouette
RETURN node.common_name AS name, communityId, distanceFromCentroid, silhouette
ORDER BY communityId, distanceFromCentroid;
```

#### Entryをflavor_vectorによってクラスタリングする (SUM)
```
// 仮想グラフがあれば削除
CALL gds.graph.exists('entryClusteringGraph')
YIELD exists
WITH exists
WHERE exists = true
CALL gds.graph.drop('entryClusteringGraph') YIELD graphName
RETURN graphName;

// 仮想グラフを作成
CALL gds.graph.project(
  'entryClusteringGraph', 
  {
    Entry: {
      label: 'Entry',
      properties: ['flavor_vector_sum']  // flavor_vector_sumを使用
    }
  },
  {
    CONTAINS: {
      type: 'CONTAINS',
      orientation: 'UNDIRECTED'
    }
  }
);

// Entryごとのクラスタを作成
CALL gds.kmeans.stream('entryClusteringGraph', {
  nodeLabels: ['Entry'],
  relationshipTypes: ['CONTAINS'],
  k: 10,  // クラスタ数を指定
  maxIterations: 100,  // 最大反復回数
  nodeProperty: 'flavor_vector_sum'  // クラスタリングに使用するプロパティ
})
YIELD nodeId, communityId, distanceFromCentroid, silhouette
WITH gds.util.asNode(nodeId) AS node, communityId, distanceFromCentroid, silhouette
RETURN node.name AS entryName, communityId, distanceFromCentroid, silhouette
ORDER BY communityId, distanceFromCentroid;
```
#### Entryをflavor_vectorによってクラスタリングする (AVG)
```
// 仮想グラフがあれば削除
CALL gds.graph.exists('entryClusteringGraph2Avg')
YIELD exists
WITH exists
WHERE exists = true
CALL gds.graph.drop('entryClusteringGraph2Avg') YIELD graphName
RETURN graphName;

// 仮想グラフを作成
CALL gds.graph.project(
'entryClusteringGraph',
{
Entry: {
label: 'Entry',
properties: ['flavor_vector_avg'] // flavor_vector_avgを使用
}
},
{
CONTAINS: {
type: 'CONTAINS',
orientation: 'UNDIRECTED'
}
}
);

// Entryごとのクラスタを作成
CALL gds.kmeans.stream('entryClusteringGraph', {
nodeLabels: ['Entry'],
relationshipTypes: ['CONTAINS'],
k: 50, // クラスタ数を指定
maxIterations: 100, // 最大反復回数
nodeProperty: 'flavor_vector_avg' // クラスタリングに使用するプロパティ
})
YIELD nodeId, communityId, distanceFromCentroid, silhouette
WITH gds.util.asNode(nodeId) AS node, communityId, distanceFromCentroid, silhouette
RETURN node.name AS entryName, communityId, distanceFromCentroid, silhouette
ORDER BY communityId, distanceFromCentroid;
```

### 3. 最短経路（Shortest Path）
グラフ内の最短経路を見つけるために使用します。
* **Dijkstra's Algorithm**: ウェイト付きグラフの最短経路を計算します。
* *A (A-Star) Algorithm**: 最短経路をヒューリスティックを使って効率的に計算します。
* **Yen’s K-Shortest Paths**: 複数の最短経路を見つけます。
* **Single Source Shortest Path**: 特定のノードから他のすべてのノードへの最短経路を計算します。

### 4. 類似度（Similarity）
ノード間の類似性や関係を測定します。
* **Node Similarity**: ノード間の類似性スコアを計算します。
* **Cosine Similarity**: コサイン類似度を計算。
* **Jaccard Similarity**: ジャカード係数を計算。

#### Entryのコサイン類似度
```
MATCH (e1:Entry), (e2:Entry)
WHERE e1 <> e2 // 自分自身との比較を避ける
AND e1.flavor_vector_sum IS NOT NULL
AND e2.flavor_vector_sum IS NOT NULL
WITH e1, e2,
vector.similarity.euclidean(e1.flavor_vector_sum, e2.flavor_vector_sum) AS distance
WHERE distance <= 5.0 // 距離のしきい値（小さいほど類似）
RETURN e1.name AS Entry1, e2.name AS Entry2, distance
ORDER BY distance ASC // 距離が近い順にソート
LIMIT 10;
```

#### Entryのユーグリッド類似度
※ 特定のEntryの類似度が高い物を探すのに利用する
```
MATCH (e1:Entry {id: 2}), (e2:Entry)
WHERE e1 <> e2 // 自分自身との比較を避ける
AND e1.flavor_vector_sum IS NOT NULL
AND e2.flavor_vector_sum IS NOT NULL
WITH e1, e2,
vector.similarity.euclidean(e1.flavor_vector_sum, e2.flavor_vector_sum) AS distance
WHERE distance <= 5.0 // 距離のしきい値（小さいほど類似）
RETURN e1.name AS Entry1, e2.name AS Entry2, distance
ORDER BY distance ASC // 距離が近い順にソート
LIMIT 10;
```
### 5. リンク予測（Link Prediction）
グラフ内のノード間に新しいリンク（エッジ）が発生する可能性を予測します。
* **Common Neighbors**: 2つのノード間の共通の近隣ノードを基にリンクを予測。
* **Adamic-Adar**: 近隣ノードの重要性に基づいてリンクを予測。
* **Preferential Attachment**: ノードの「人気」に基づいてリンクを予測。

### 6. トラバーサルとウォーク（Traversals and Walks）
ノードをたどるアルゴリズム。
* **Random Walk**: ノードをランダムにたどるウォークを実行します。
* **Node2Vec**: グラフ内のノードの特徴を学習します。

### 7. 空間解析（Graph Embedding）
グラフ構造を低次元のベクトル空間にマッピングします。
* **FastRP (Fast Random Projection)**: グラフを低次元空間に埋め込むための高速アルゴリズム。
* **Node2Vec**: ノードの類似性に基づいてノードを埋め込む。

### 8. ツリーと階層（Tree and Hierarchical Algorithms）
ツリー構造や階層構造を扱います。
* **Minimum Spanning Tree (MST)**: 最小コストのツリーを構築します。
* **Union-Find**: ノード間のグループ化と検出を行う。
