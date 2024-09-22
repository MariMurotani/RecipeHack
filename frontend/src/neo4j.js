import neo4j from 'neo4j-driver';
var uri = 'bolt://localhost:7687'; // Neo4jサーバーのURI
var user = 'neo4j'; // ユーザー名
var password = 'abcd7890'; // パスワード
var driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
export default driver;
