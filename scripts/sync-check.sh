#!/usr/bin/env bash
# 检查上游 mattpocock/skills 有哪些 SKILL.md 变了，需要重新翻译。
#
#   bash scripts/sync-check.sh            只看报告
#   bash scripts/sync-check.sh --update   把当前上游状态记为新的基线
#
# 原理：浅克隆拿上游当前文件，逐文件比对 sha256 与 .upstream-hashes 里记录的基线。
# 不用 git diff，因为浅克隆里拿不到旧的 commit。

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CACHE="$ROOT/.upstream"
HASHES="$ROOT/.upstream-hashes"
REPO="https://github.com/mattpocock/skills.git"

# 已翻译的目录（in-progress 和 deprecated 不翻，理由见 skills/index.md）
DIRS=(engineering productivity misc)

UPDATE=0
[ "${1:-}" = "--update" ] && UPDATE=1

# --- 1. 取上游当前状态 ---
if [ -d "$CACHE/.git" ]; then
  git -C "$CACHE" fetch --depth 1 --quiet origin main
  git -C "$CACHE" reset --hard --quiet FETCH_HEAD
else
  rm -rf "$CACHE"
  git clone --depth 1 --quiet "$REPO" "$CACHE"
fi

# --- 2. 生成当前上游的哈希清单（只含我们负责的目录）---
tmp="$(mktemp)"
for d in "${DIRS[@]}"; do
  find "$CACHE/skills/$d" -name SKILL.md 2>/dev/null | sort | while read -r f; do
    rel="${f#"$CACHE"/}"                                  # skills/engineering/tdd/SKILL.md
    name="$(basename "$(dirname "$f")")"                  # tdd
    sum="$(shasum -a 256 "$f" | cut -d' ' -f1)"
    echo "$rel $name $sum"
  done
done > "$tmp"

if [ "$UPDATE" = 1 ]; then
  cp "$tmp" "$HASHES"
  echo "基线已更新，共 $(wc -l < "$HASHES" | tr -d ' ') 个 SKILL.md"
  rm -f "$tmp"
  exit 0
fi

if [ ! -f "$HASHES" ]; then
  echo "还没有基线。先跑：bash scripts/sync-check.sh --update"
  rm -f "$tmp"
  exit 0
fi

# --- 3. 比对 ---
changed=0; missing=0

echo "上游已变更，需要重看译文："
echo
while read -r rel name sum; do
  dir="$(echo "$rel" | cut -d/ -f2)"
  old="$(awk -v r="$rel" '$1==r {print $3}' "$HASHES")"
  zh="src/content/docs/skills/$dir/$name.md"
  if [ -z "$old" ]; then
    echo "  [上游新增] $rel"
    changed=1
  elif [ "$old" != "$sum" ]; then
    echo "  [已变更]   $rel"
    if [ -f "$ROOT/$zh" ]; then
      echo "             -> 需要重看 $zh"
    else
      echo "             -> $zh 尚未翻译"
    fi
    changed=1
  fi
done < "$tmp"

while read -r rel name sum; do
  if ! grep -q "^$rel " "$tmp"; then
    echo "  [上游已删除] $rel"
    echo "               -> 本地 $name 译文可以删了"
    missing=1
  fi
done < "$HASHES"

[ "$changed" = 0 ] && [ "$missing" = 0 ] && echo "  （没有变化，译文都是最新的）"

echo
echo "上游当前 commit: $(git -C "$CACHE" rev-parse --short HEAD)"
echo "处理完之后跑：   bash scripts/sync-check.sh --update"
rm -f "$tmp"
