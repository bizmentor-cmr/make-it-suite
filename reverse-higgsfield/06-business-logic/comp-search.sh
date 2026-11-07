#!/bin/bash
# Phase 8 — Veille concurrentielle : recherches Firecrawl
OUT=/home/z/my-project/reverse-higgsfield/06-business-logic/captures
mkdir -p "$OUT"

fc_search() {
  local name="$1"; local query="$2"; local limit="${3:-8}"
  curl -s -m 45 -X POST https://api.firecrawl.dev/v1/search \
    -H "Content-Type: application/json" \
    -d "{\"query\":$(printf '%s' "$query" | jq -Rs .),\"limit\":$limit}" \
    > "$OUT/comp-search-$name.json"
  echo "--- $name ($(jq '.success' "$OUT/comp-search-$name.json" 2>/dev/null)) : $(jq -r '.data[]? | .title' "$OUT/comp-search-$name.json" 2>/dev/null | head -3 | tr '\n' ' | ')"
  sleep 2
}

fc_search "alternatives"    "Higgsfield AI top competitors alternatives 2025 2026"
fc_search "landscape"       "best AI video generation platforms 2026 comparison Runway Pika Kling Sora Luma"
fc_search "vs-runway"       "Higgsfield vs Runway comparison which is better"
fc_search "vs-pika-kling"   "Higgsfield vs Pika vs Kling AI comparison"
fc_search "avatars"         "HeyGen vs Synthesia AI avatar video comparison 2026"
fc_search "marketers"       "AI video tools for social media marketers agencies 2026"
fc_search "agregateurs"     "multi-model AI video aggregator platforms Freepik Pollo Krea Higgsfield"
fc_search "pricing-comp"    "Runway Pika Kling Luma pricing plans credits comparison"
echo "DONE batch 1"
