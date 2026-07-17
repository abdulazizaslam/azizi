#!/usr/bin/env bash
# Auto-commit + push after Claude writes/edits a file.
# Triggered by a PostToolUse hook (Write|Edit|MultiEdit).
set -euo pipefail

cd "$CLAUDE_PROJECT_DIR" || exit 0

# Nothing changed? Do nothing.
if [ -z "$(git status --porcelain)" ]; then
  exit 0
fi

git add -A

# Build a short commit message from the changed files.
changed=$(git diff --cached --name-only | head -5 | paste -sd ', ' -)
count=$(git diff --cached --name-only | wc -l | tr -d ' ')
msg="Auto-commit: update ${changed}"
if [ "$count" -gt 5 ]; then
  msg="Auto-commit: update ${count} files"
fi

git commit -m "$msg" \
  -m "Co-Authored-By: Claude <noreply@anthropic.com>" >/dev/null 2>&1 || exit 0

# Push to the current branch; don't fail the hook if offline.
branch=$(git rev-parse --abbrev-ref HEAD)
git push origin "$branch" >/dev/null 2>&1 || echo "auto-commit: committed locally, push failed (offline?)" >&2

exit 0
