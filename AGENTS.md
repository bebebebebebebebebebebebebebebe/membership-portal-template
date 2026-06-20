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

- 実装コードを追加・変更するときは、外部 contract として依存される public class / function / type / interface に JSDoc/TSDoc コメントを書き、型・名前・実装から自明でない責務・入力制約・返却条件・重要な失敗条件・副作用が分かるようにする。
- public method では、型シグネチャだけでは分からない制約・返却条件・失敗条件がある場合に `@param`, `@returns`, `@throws` を付ける。
- 抽象レイヤーの type / interface / use case / repository contract には、責務・入力・返却値・失敗条件を、呼び出し側が依存してよい contract として集約して書く。
- 具象レイヤーでは、抽象 contract と同じ説明を method ごとに再掲しない。public export / public method に差分を書く場合は JSDoc/TSDoc 形式で、server/client 境界、mock / DB / API 差し替え、cache、認可、fallback、副作用、transaction、retry、timeout など、具象実装固有かつ呼び出し側の判断に影響する差分だけを書く。
- protocol boundary、transport lifecycle、pending request 管理、manual input、承認フロー、error isolation、shutdown behavior など、意図が読み取りにくい private helper には短い意図コメントを書く。
- 実装をそのまま言い換えるだけのコメントは避け、目的・契約・制約・非自明な tradeoff を説明する。型で表現できることは型に書き、コメントでは型だけでは表現しにくい意味や判断理由を補足する。
- テストファイルは原則として説明的な test name で仕様を表現する。コメントは、非自明な setup、race condition、timing behavior、微妙な protocol expectation がある場合だけ短く追加する。
- この repository では documentation comment を日本語で書く。
