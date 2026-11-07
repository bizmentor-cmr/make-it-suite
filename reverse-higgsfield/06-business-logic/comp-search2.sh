#!/bin/bash
# Phase 8 — Batch 2 : reviews utilisateurs
OUT=/home/z/my-project/reverse-higgsfield/06-business-logic/captures
mkdir -p "$OUT"

fc_search() {
  local name="$1"; local query="$2"; local limit="${3:-8}"
  curl -s -m 45 -X POST https://api.firecrawl.dev/v1/search \
    -H "Content-Type: application/json" \
    -d "{\"query\":$(printf '%s' "$query" | jq -Rs .),\"limit\":$limit}" \
    > "$OUT/comp-search-$name.json"
  echo "--- $name : $(jq -r '.data[]? | .title' "$OUT/comp-search-$name.json" 2>/dev/null | head -2 | tr '\n' ' | ')"
  sleep 2
}

fc_search "rev-g2"        "Higgsfield G2 reviews rating" 6
fc_search "rev-capterra"  "Higgsfield Capterra reviews rating" 6
fc_search "rev-trustpilot" "Higgsfield Trustpilot reviews" 6
fc_search "rev-reddit-hf" "Higgsfield review reddit honest opinion" 8
fc_search "rev-runway"    "Runway ML G2 Capterra reviews complaints" 6
fc_search "rev-heygen"    "HeyGen G2 Capterra reviews complaints" 6
fc_search "rev-synthesia" "Synthesia G2 Capterra reviews rating" 6
fc_search "rev-others"    "Pika Luma Kling Invideo LTX Studio user reviews complaints" 8
echo "DONE batch 2"
