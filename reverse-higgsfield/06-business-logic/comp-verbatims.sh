#!/bin/bash
# Phase 8 — Verbatims Reddit via snippets (Firecrawl search ciblés + DDG HTML)
OUT=/home/z/my-project/reverse-higgsfield/06-business-logic/captures
mkdir -p "$OUT"

fc_search() {
  local name="$1"; local query="$2"; local limit="${3:-6}"
  curl -s -m 45 -X POST https://api.firecrawl.dev/v1/search \
    -H "Content-Type: application/json" \
    -d "{\"query\":$(printf '%s' "$query" | jq -Rs .),\"limit\":$limit}" \
    > "$OUT/comp-search-$name.json"
  echo "--- $name : $(jq -r '.data | length' "$OUT/comp-search-$name.json" 2>/dev/null) résultats"
  sleep 2
}

fc_search "reddit-verbatim1" "reddit Higgsfield scam unlimited lie credits charge" 8
fc_search "reddit-verbatim2" "reddit Higgsfield pros cons quality Seedance worth it" 8
fc_search "reddit-verbatim3" "reddit r/HiggsfieldAI experience subscription cancel" 8
fc_search "reddit-verbatim4" "reddit Runway subscription expensive credits complaints" 6
fc_search "reddit-verbatim5" "reddit Pika Luma Kling quality comparison which best" 6
fc_search "g2-runway-url" "site:g2.com Runway AI video generator reviews" 5

# DuckDuckGo HTML pour threads précis
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
ddg() {
  local name="$1"; local q="$2"
  curl -s -m 30 -A "$UA" "https://html.duckduckgo.com/html/?q=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "$q")" \
    | python3 -c "
import sys, re, html
content = sys.stdin.read()
results = re.findall(r'<a rel=\"nofollow\" class=\"result__a\" href=\"([^\"]+)\">(.*?)</a>.*?class=\"result__snippet\"[^>]*>(.*?)</a>', content, re.S)
out = []
for url, title, snip in results[:8]:
    clean = lambda s: html.unescape(re.sub(r'<[^>]+>', '', s)).strip()
    out.append({'url': url, 'title': clean(title), 'snippet': clean(snip)[:400]})
import json; print(json.dumps(out, indent=1))
" > "$OUT/comp-ddg-$name.json"
  echo "--- ddg-$name : $(jq 'length' "$OUT/comp-ddg-$name.json" 2>/dev/null) résultats"
  sleep 3
}

ddg "scam-thread"  "reddit higgsfield ai review scam or actually worth it"
ddg "4months"      "reddit my honest experience with higgsfield after 4 months"
ddg "proscons"     "reddit higgsfield pros cons from real users"
echo "DONE verbatims"
