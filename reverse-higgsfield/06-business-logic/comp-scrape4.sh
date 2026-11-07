#!/bin/bash
# Phase 8 — Scrapes batch F : Reddit + fallbacks G2
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

fc_scrape "g2-runway"  "https://www.g2.com/products/runway/reviews"
fc_scrape "g2-invideo" "https://www.g2.com/products/invideo/reviews"

# Threads Reddit (via old.reddit.com, plus scrapeable)
fc_scrape "reddit-scam-or-worth"  "https://old.reddit.com/r/generativeAI/comments/1sp4ivr/higgsfield_ai_review_scam_or_actually_worth_it/"
fc_scrape "reddit-4-months"       "https://old.reddit.com/r/generativeAI/comments/1rvaj50/my_honest_experience_with_higgsfield_after_4/"
fc_scrape "reddit-proscons"       "https://old.reddit.com/r/HiggsfieldAI/comments/1qdj607/higgsfield_proscons_from_real_users_not_the/"
fc_scrape "reddit-cheap-alt"      "https://old.reddit.com/r/generativeAI/comments/1x3zfom/any_higgsfield_alternatives_that_are_actually/"
fc_scrape "reddit-professional"   "https://old.reddit.com/r/generativeAI/comments/1u0jhm0/which_video_company_for_professional_work_kling/"
fc_scrape "reddit-legit"          "https://old.reddit.com/r/generativeAI/comments/1u3183z/is_higgsfield_actually_legit_now_looking_to_sign/"
echo "DONE batch F"
