# neo4jとGDSPlugin

## インストール
MACの場合にbrewでneo4jをインストール
プラグインは下記からダウンロード
https://neo4j.com/deployment-center/#gds-tab
MACのインストールフォルダのplugin以下にjarファイルをおいて再起動

```
(base)  /opt/homebrew/Cellar/neo4j/5.23.0/libexec/plugins/ [stable] neo4j stop
neo4j start
Stopping Neo4j............ stopped.
Directories in use:
home:         /opt/homebrew/Cellar/neo4j/5.23.0/libexec
config:       /opt/homebrew/Cellar/neo4j/5.23.0/libexec/conf
logs:         /opt/homebrew/var/log/neo4j
plugins:      /opt/homebrew/Cellar/neo4j/5.23.0/libexec/plugins
import:       /opt/homebrew/Cellar/neo4j/5.23.0/libexec/import
data:         /opt/homebrew/var/neo4j/data
certificates: /opt/homebrew/Cellar/neo4j/5.23.0/libexec/certificates
licenses:     /opt/homebrew/Cellar/neo4j/5.23.0/libexec/licenses
run:          /opt/homebrew/Cellar/neo4j/5.23.0/libexec/run
Starting Neo4j.
```

GDSのバージョン
```
CALL gds.version();
CALL gds.list();
```
