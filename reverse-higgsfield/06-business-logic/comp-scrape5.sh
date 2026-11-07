#!/bin/bash
# Phase 8 — Compléments : G2 Runway (URL correcte)
OUT=/home/z/my-project/reverse-higgsfield/06-business-logic/scrapes
curl -s -m 60 -X POST https://api.firecrawl.dev/v1/scrape \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.g2.com/products/runway-2022-01-04/reviews","formats":["markdown"],"onlyMainContent":true}' \
  | jq -r 'if .success then .data.markdown else "ERROR: \(.error // "unknown")" end' \
  > "$OUT/comp-g2-runway.md" 2>/dev/null
echo "[g2-runway] $(wc -c < "$OUT/comp-g2-runway.md") bytes :: $(head -c 100 "$OUT/comp-g2-runway.md" | tr '\n' ' ')"
