import neo4j from 'neo4j-driver';

const uri = 'bolt://localhost:7687';  // Neo4jサーバーのURI
const user = 'neo4j';  // ユーザー名
const password = 'abcd7890';  // パスワード

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

export default driver;
