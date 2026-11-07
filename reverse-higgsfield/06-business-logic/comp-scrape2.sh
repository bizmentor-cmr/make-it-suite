#!/bin/bash
# Phase 8 — Scrapes Firecrawl (batch C : pricing concurrents)
OUT=/home/z/my-project/reverse-higgsfield/06-business-logic/scrapes
mkdir -p "$OUT"

fc_scrape() {
  local name="$1"; local url="$2"
  curl -s -m 60 -X POST https://api.firecrawl.dev/v1/scrape \
    -H "Content-Type: application/json" \
    -d "{\"url\":$(printf '%s' "$url" | jq -Rs .),\"formats\":[\"markdown\"],\"onlyMainContent\":true}" \
    | jq -r 'if .success then .data.markdown else "ERROR: \(.error // "unknown")" end' \
    > "$OUT/comp-$name.md" 2>/dev/null
  local size=$(wc -c < "$OUT/comp-$name.md")
  echo "[$name] $size bytes :: $(head -c 90 "$OUT/comp-$name.md" | tr '\n' ' ')"
  sleep 2
}

fc_scrape "runway-pricing"   "https://runwayml.com/pricing"
fc_scrape "pika-pricing"     "https://pika.art/pricing"
fc_scrape "luma-pricing"     "https://lumalabs.ai/dream-machine/pricing"
fc_scrape "heygen-pricing"   "https://www.heygen.com/pricing"
fc_scrape "synthesia-pricing" "https://www.synthesia.io/pricing"
fc_scrape "hailuo-pricing"   "https://hailuoai.video/pricing"
fc_scrape "ltx-pricing"      "https://ltx.studio/pricing"
fc_scrape "invideo-pricing"  "https://invideo.io/pricing"
fc_scrape "kling-pricing"    "https://app.klingai.com/global/pay/subscriptions"
fc_scrape "sora-pricing"     "https://openai.com/sora/pricing"
fc_scrape "freepik-pricing"  "https://www.freepik.com/pricing"
fc_scrape "pollo-pricing"    "https://pollo.ai/pricing"
echo "DONE batch C"
