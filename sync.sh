#!/bin/bash

############################################
# 1. DOWNLOAD
############################################
# 「【ついにやる】東島通商語の蒐集【bixe本番データ】」をダウンロード
wget --output-file="./preprocess/logs_corpus.txt" "https://docs.google.com/spreadsheets/d/1XjlK42tfTCrBegQUiv974qlC1XqrnNUbp43UJx1Qv8w/export?format=tsv&gid=0" -O "./preprocess/corpus.tsv"
wget --output-file="./preprocess/logs_links.txt" "https://docs.google.com/spreadsheets/d/1XjlK42tfTCrBegQUiv974qlC1XqrnNUbp43UJx1Qv8w/export?format=tsv&gid=312538559" -O "./preprocess/links.tsv"

# 「東島通商語の辞書的データを全部乗せよう」をダウンロード
wget --output-file="./preprocess/logs_words.txt" "https://docs.google.com/spreadsheets/d/1Eo2VcfflWTTtJhMyeFNxQ0pDtkHETSKKM1yuVtVrnQs/export?format=tsv&gid=0" -O "./preprocess/words.tsv"

############################################
# 2. PREPROCESS & GENERATE TYPESCRIPT
############################################
cd preprocess
node index.js

############################################
# 3. TRANSPILE TYPESCRIPT
############################################
cd ..
tsc
