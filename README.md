# bixe

東島通商語コーパス検索システム「ビシェ」

実体は [Google Spreadsheets](https://docs.google.com/spreadsheets/d/1XjlK42tfTCrBegQUiv974qlC1XqrnNUbp43UJx1Qv8w/edit#gid=0) で中央管理し、このリポジトリは Web 上の UI だけを提供する。

![](bixe_screenshot.png)

## Google Spreadsheet の更新を反映する方法

このリポジトリを WSL か Linux 環境にクローンして、以下のコマンドを実行する。（Node.js が必要）

```sh
./index.sh
```

## ローカルで実行

CORS の関係上、ローカルで試すには

```
npm install -g http-server
http-server ./docs -p 31198 --cors
```

が必要。Windows なら `./local_debug.bat` でできるようにしてある。

npx tsc が上手くいかない場合は `npm install -g typescript@latest` をすること。