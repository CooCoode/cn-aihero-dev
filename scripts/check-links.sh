#!/usr/bin/env bash
# 检查构建产物里的站内链接。build 之后跑。
#
# 存在的理由：Astro 不会给 markdown 正文里的链接自动加 base，
# 写漏了不会报错，只会在线上变成 404。这个脚本把它变成构建期错误。
#
#   bash scripts/check-links.sh

set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST="$ROOT/dist"
BASE="$(cd "$ROOT" && node -e "import('./astro.config.mjs').then(m=>console.log(m.BASE))" 2>/dev/null)"

if [ -z "$BASE" ]; then
  echo "无法从 astro.config.mjs 读到 BASE" >&2
  exit 1
fi
if [ ! -d "$DIST" ]; then
  echo "dist/ 不存在，先跑 npm run build" >&2
  exit 1
fi

fail=0

# --- 1. 所有站内 href 都必须以 BASE 开头 ---
missing="$(grep -rhoE 'href="/[^"]*"' "$DIST" --include='*.html' \
  | sed 's/href="//;s/"$//' \
  | grep -v "^${BASE}/" \
  | grep -vE '^//' \
  | sort -u)"

if [ -n "$missing" ]; then
  echo "✗ 这些站内链接缺少 base 前缀（线上会 404）："
  echo "$missing" | sed 's/^/    /'
  echo
  echo "  修法：把这些链接写成 ${BASE}/xxx/ 开头。"
  fail=1
fi

# --- 2. 站内链接指向的页面必须真的存在 ---
broken=""
while read -r href; do
  [ -z "$href" ] && continue
  # dist/ 里不含 base 目录（base 由托管平台在服务时加上），所以先剥掉
  rel="${href#"$BASE"}"
  case "$rel" in */) path="${DIST}${rel}index.html" ;; *) path="${DIST}${rel}" ;; esac
  [ -e "$path" ] || [ -e "${path}.html" ] || broken="${broken}${href}"$'\n'
done < <(grep -rhoE "href=\"${BASE}/[^\"]*\"" "$DIST" --include='*.html' | sed 's/href="//;s/"$//' | sort -u)

if [ -n "$broken" ]; then
  echo "✗ 这些站内链接指向的页面不存在："
  echo "$broken" | sed '/^$/d;s/^/    /'
  fail=1
fi

if [ "$fail" = 0 ]; then
  echo "✓ 站内链接检查通过（base=${BASE}）"
fi
exit "$fail"
