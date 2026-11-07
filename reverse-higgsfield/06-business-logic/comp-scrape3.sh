#!/bin/bash
# Phase 8 — Scrapes batch D+E : fallbacks + reviews concurrents + comparatifs neutres
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

# Fallbacks
fc_scrape "kling-pricing"   "https://klingai.com/pricing"
fc_scrape "chatgpt-pricing" "https://openai.com/chatgpt/pricing"

# Reviews concurrents (G2 / Capterra / Trustpilot)
fc_scrape "g2-runway"      "https://www.g2.com/products/runwayml/reviews"
fc_scrape "g2-heygen"      "https://www.g2.com/products/heygen/reviews"
fc_scrape "g2-synthesia"   "https://www.g2.com/products/synthesia/reviews"
fc_scrape "g2-pika"        "https://www.g2.com/products/pika/reviews"
fc_scrape "g2-luma"        "https://www.g2.com/products/luma-ai/reviews"
fc_scrape "g2-invideo"     "https://www.g2.com/products/invideo-io/reviews"
fc_scrape "trustpilot-runway" "https://www.trustpilot.com/review/runwayml.com"
fc_scrape "trustpilot-heygen" "https://www.trustpilot.com/review/heygen.com"
fc_scrape "capterra-heygen"   "https://www.capterra.com/p/237279/HeyGen/"

# Comparatifs neutres / landscape
fc_scrape "layer3-runway"  "https://www.layer3labs.io/comparisons/higgsfield-ai-vs-runway"
fc_scrape "air-alternatives" "https://air.inc/resources/best-higgsfield-ai-alternatives"
fc_scrape "ulazai-guide"   "https://ulazai.com/ai-video-models-guide-2025/"
fc_scrape "reviewnprep-alt" "https://reviewnprep.com/blog/5-best-higgsfield-ai-alternatives-for-creators-and-marketers-in-2026/"
echo "DONE batch D+E"
