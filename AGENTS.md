<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Codebase Search and Inspection

- When searching, exploring, or verifying code or files, always use Serena MCP first.
- Prefer Serena MCP semantic tools such as `get_symbols_overview`, `find_symbol`, `find_referencing_symbols`, and `find_declaration` for codebase understanding.
- Use shell/file tools such as `rg`, `grep`, `find`, `ls`, `cat`, or editor search only as a fallback when Serena MCP cannot inspect the target file type or required context.
- If falling back from Serena MCP, briefly state why the fallback is necessary.

## Development Servers

検証やテストのために `pnpm run start`、`pnpm run dev` などの開発用サーバーを起動した場合は、確認後に必ず該当プロセスを終了する。バックグラウンドに開発用サーバーを残さない。

## Documentation Comments

- 実装コードを追加・変更するときは、public class / function / type / interface に JSDoc/TSDoc コメントを書き、責務・入力・返却値・重要な失敗条件が分かるようにする。
- public method では、意味のある場合に `@param`, `@returns`, `@throws` を付ける。
- protocol boundary、transport lifecycle、pending request 管理、manual input、承認フロー、error isolation、shutdown behavior など、意図が読み取りにくい private helper には短い意図コメントを書く。
- 実装をそのまま言い換えるだけのコメントは避け、目的・契約・非自明な tradeoff を説明する。
- テストファイルは原則として説明的な test name で仕様を表現する。コメントは、非自明な setup、race condition、timing behavior、微妙な protocol expectation がある場合だけ短く追加する。
- この repository では documentation comment を日本語で書く。

