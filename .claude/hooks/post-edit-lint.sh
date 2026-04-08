#!/bin/bash
# PostToolUse hook: lint ONLY the single file that was just edited/written
# stdin receives JSON: {"tool_name":"Edit","tool_input":{"file_path":"/abs/path/file.ts"}}
FILE=$(node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>process.stdout.write(JSON.parse(d).tool_input.file_path||''))")

if [[ ! "$FILE" =~ \.(ts|js|svelte)$ ]]; then
  exit 0
fi

OUTPUT=$(npx eslint "$FILE" 2>&1)
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ] && [ -n "$OUTPUT" ]; then
  ESCAPED=$(echo "$OUTPUT" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>process.stdout.write(JSON.stringify(d)))")
  echo "{\"hookSpecificOutput\":{\"hookEventName\":\"PostToolUse\",\"additionalContext\":\"Lint errors found:\\n\"${ESCAPED}}}"
fi
