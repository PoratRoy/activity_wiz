#!/usr/bin/env bash
# Checks that every old Firebase URL (scripts/legacy-urls.txt, from the old sitemap plus common variants)
# permanently redirects to a page that returns 200. Usage: scripts/check-legacy-redirects.sh [base-url]
set -u
BASE="${1:-https://activitywiz.com}"
DIR="$(cd "$(dirname "$0")" && pwd)"
fail=0
while read -r path; do
  [ -z "$path" ] && continue
  first=$(curl -s -o /dev/null -w '%{http_code}' "$BASE$path")
  read -r final hops <<<"$(curl -s -o /dev/null -L -w '%{http_code} %{num_redirects}' "$BASE$path")"
  if [ "$path" = "/" ]; then ok=$([ "$final" = 200 ] && echo y); else ok=$([[ "$first" =~ ^30[18]$ && "$final" = 200 ]] && echo y); fi
  if [ "${ok:-}" != y ]; then echo "FAIL $path first=$first final=$final hops=$hops"; fail=$((fail+1)); fi
done < "$DIR/legacy-urls.txt"
echo "$(wc -l < "$DIR/legacy-urls.txt" | tr -d ' ') URLs checked, $fail failed"
[ "$fail" = 0 ]
