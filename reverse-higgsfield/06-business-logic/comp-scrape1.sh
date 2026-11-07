#!/bin/bash
# Phase 8 — Scrapes Firecrawl (batch A+B+C : reviews HF, comparatifs HF, pricing concurrents)
OUT=/home/z/my-project/reverse-higgsfield/06-business-logic/scrapes
mkdir -p "$OUT"

fc_scrape() {
  local name="$1"; local url="$2"
  if [ -s "$OUT/comp-$name.md" ] && head -c 20 "$OUT/comp-$name.md" | rg -q "success"; then :; fi
  curl -s -m 60 -X POST https://api.firecrawl.dev/v1/scrape \
    -H "Content-Type: application/json" \
    -d "{\"url\":$(printf '%s' "$url" | jq -Rs .),\"formats\":[\"markdown\"],\"onlyMainContent\":true}" \
    | jq -r 'if .success then .data.markdown else "ERROR: \(.error // "unknown")" end' \
    > "$OUT/comp-$name.md" 2>/dev/null
  local size=$(wc -c < "$OUT/comp-$name.md")
  echo "[$name] $size bytes :: $(head -c 100 "$OUT/comp-$name.md" | tr '\n' ' ')"
  sleep 2
}

# --- Batch A : reviews Higgsfield
fc_scrape "trustpilot-higgsfield" "https://www.trustpilot.com/review/higgsfield.ai"
fc_scrape "g2-higgsfield"         "https://www.g2.com/products/higgsfield/reviews"
fc_scrape "capterra-higgsfield"   "https://www.capterra.ie/software/1177667/Higgsfield"
fc_scrape "hackceleration-higgsfield" "https://hackceleration.com/labs/review/higgsfield"

# --- Batch B : positionnement Higgsfield (comparatifs officiels)
fc_scrape "hf-vs-runway"  "https://higgsfield.ai/blog/higgsfield-vs-runway-2026"
fc_scrape "hf-vs-kling"   "https://higgsfield.ai/blog/higgsfield-vs-kling-2026"

echo "DONE batch A+B"
