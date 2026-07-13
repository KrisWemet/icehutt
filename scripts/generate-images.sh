#!/usr/bin/env bash
# Generates the site's photography from images/prompts.json using the free
# Pollinations.ai API (Flux model). Run by .github/workflows/generate-images.yml.
set -euo pipefail

PROMPTS_FILE="images/prompts.json"
OUT_DIR="images"
MIN_BYTES=15000

command -v jq >/dev/null || { echo "jq is required"; exit 1; }

count=$(jq length "$PROMPTS_FILE")
echo "Generating $count images…"

fail=0
for i in $(seq 0 $((count - 1))); do
  name=$(jq -r ".[$i].name" "$PROMPTS_FILE")
  prompt=$(jq -r ".[$i].prompt" "$PROMPTS_FILE")
  width=$(jq -r ".[$i].width" "$PROMPTS_FILE")
  height=$(jq -r ".[$i].height" "$PROMPTS_FILE")
  seed=$(jq -r ".[$i].seed" "$PROMPTS_FILE")
  encoded=$(jq -rn --arg p "$prompt" '$p|@uri')
  url="https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=flux"
  out="$OUT_DIR/$name.jpg"

  ok=0
  for attempt in 1 2 3 4 5; do
    echo "[$name] attempt $attempt…"
    if curl -fsSL --max-time 300 -o "$out" "$url"; then
      size=$(stat -c%s "$out" 2>/dev/null || echo 0)
      mime=$(file -b --mime-type "$out" 2>/dev/null || echo unknown)
      if [ "$size" -ge "$MIN_BYTES" ] && [ "$mime" = "image/jpeg" ]; then
        echo "[$name] OK ($size bytes)"
        ok=1
        break
      fi
      echo "[$name] rejected (size=$size mime=$mime)"
    fi
    sleep $((attempt * 10))
  done

  if [ "$ok" -ne 1 ]; then
    echo "[$name] FAILED after 5 attempts"
    rm -f "$out"
    fail=1
  fi
done

exit $fail
