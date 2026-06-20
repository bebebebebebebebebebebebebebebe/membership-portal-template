# Modular Member Portal

最終確認日: 2026-06-10

## 1. プロジェクト概要

ポートフォリオ・技術検証・将来的な実サービス化を並行して目指す、汎用的な会員制情報ポータルの Web アプリケーションです。

コンテンツの種別を記事・資料などに限定しすぎず、Public / Member / Admin の 3 ゾーンを軸に、認証・RBAC・CRUD・検索・通知などを段階的に追加できる骨格を作ることを目的にしています。

この README は開発者・検証者向けに、現在の実装状態と未実装の MVP 要件を分けて記録します。

## 2. 現在の実装状態

### 2-1. 状態区分

| 状態 | 定義 |
|------|------|
| 実装済み | route/page が存在し、画面として確認できるもの |
| 部分実装 | 静的 UI や mock data で成立しているが、認証・DB・CRUD などが未実装のもの |
| Coming Soon | route/page は存在し、未実装であることと将来の役割を表示する placeholder |
| 未実装 | README 上の MVP/将来構想にはあるが、現時点で route/page がないもの |
| 未確定 | 実装方式や採用技術の決定が必要なもの |

### 2-2. 実装済み

| 項目 | パス | 現状 |
|------|------|------|
| トップページ | `/` | `(public)/page.tsx` の Public Home。サービス概要・閲覧条件・ゾーン構成・機能・アーキテクチャを紹介する入口画面 |
| Public Zone layout | `(public)` route group | `(public)/layout.tsx` がロゴ＋公開導線（コンテンツ/ログイン/新規登録）のヘッダーと中央寄せ main コンテナを提供。認証境界・サイドバーは持たない |

### 2-3. 部分実装

| 項目 | パス | 現状 |
|------|------|------|
| Member Zone layout | `(member)` route group | sidebar/header/nav config と認証必須 layout（`requireCurrentUserForRoute`）は実装済み。未ログイン時は `/login?next=<original-path>` へ遷移。認証基盤はモック |
| コンテンツカタログ | `/contents` | `(public)` 配下の公開カタログ。非会員も閲覧できる。データは `getContents()`（published+listed）経由。DB/API は未実装 |
| コンテンツ詳細 | `/contents/[id]` | `(public)` 配下。URL 自体は `routeAccessPolicy`、本文 full detail は `accessPolicy` で分離制御する。`routeAccessPolicy=loginRequired` の匿名 access は `/login?next=<content-path>` へ redirect。本文不可なら `ContentAccessGate`、記事以外は Coming Soon、hidden・未作成 ID は `notFound()` |

### 2-4. Coming Soon

| 項目 | パス | 備考 |
|------|------|------|
| ログイン | `/login` | 認証基盤未確定。Coming Soon 表示 |
| 新規登録 | `/register` | 認証基盤未確定。Coming Soon 表示 |
| ダッシュボード | `/dashboard` | Member Zone の placeholder。Coming Soon 表示 |
| お気に入り | `/bookmarks` | Member Zone の placeholder。Coming Soon 表示 |
| 通知 | `/notifications` | Member Zone の placeholder。Coming Soon 表示 |
| プロフィール設定 | `/settings/profile` | Member Zone の placeholder。Coming Soon 表示 |
| アカウント設定 | `/settings/account` | Member Zone の placeholder。Coming Soon 表示 |
| Admin コンテンツ管理 | `/admin/contents` | Coming Soon 表示 + Admin Guard。CRUD と実認証 provider は未実装 |

### 2-5. 利用可能な scripts

`package.json` で確認できる scripts は次の 10 個です。`e2e` は現時点では定義されていません。

```bash
pnpm run dev
pnpm run build
pnpm run start
pnpm run lint
pnpm run docs:api
pnpm run docs:api:check
pnpm run docs:api:serve
pnpm run typecheck
pnpm run test
pnpm run test:watch
```

## 3. 確定している設計方針

### 3-1. 技術スタック

| 項目 | 決定値 |
|------|--------|
| フレームワーク | Next.js 16.2.6（App Router） |
| React | React 19.2.4 |
| 言語 | TypeScript |
| UI ライブラリ | shadcn/ui |
| スタイリング | Tailwind CSS |
| アイコン | Hugeicons |
| デザインテーマ | ライトテーマ基調 |
| メインカラー | ティール・シアン系 |

### 3-2. 画面構成方針

```txt
Root
├── Public Zone        認証不要。集客・認証導線・公開カタログ
│   └── Content Catalog  /contents・/contents/[id]（一覧は常に公開、詳細は routeAccessPolicy と Content Gate で制御）
├── Member Zone        ログイン必須。dashboard / bookmarks / notifications / settings
└── Admin Zone         管理者専用。Admin Guard で制御し、CRUD は未実装
```

- `src/app/(public)` は Public Zone の route group として扱い、`(public)/layout.tsx` が公開 shell（ヘッダー・背景・main コンテナ）を提供する。
- `/contents` は常に Public Zone の公開カタログとして扱う。`/contents/[id]` は `(public)` 配下のまま、content 単位の `routeAccessPolicy` で URL 自体への到達可否を制御する。
- `src/app/(member)` は Member Zone の route group として扱い、`(member)/layout.tsx` が認証必須 shell（sidebar/header）を提供する。`proxy.ts` は未ログイン時の早期 redirect を担当し、Server Component の layout guard が最終確認を行う。`/contents` への導線は Member sidebar にも「コンテンツカタログ」として残す。
- `src/app/admin` は Admin Zone として扱い、`admin/layout.tsx` が `requireCurrentAdminForRoute()` で admin role を要求する。未ログインは `/login?next=...`、非 admin は `/forbidden` へ遷移する。
- 領域・URL への入場制御（Route Guard）と本文の閲覧制御（Content Gate）を分離する。`/dashboard` などは Member Route Guard、`/contents/[id]` の URL 到達は `routeAccessPolicy`、本文は `accessPolicy` ベースの Content Gate で制御する。
- `features/contents` はコンテンツ機能の UI・型・API・ロジックと mock data を持つ feature として扱う。
- 現時点では DB・バックエンドが未確定のため、コンテンツ画面は静的モックを使う。

### 3-3. アーキテクチャ境界

依存方向は `shared -> features -> app` として扱います。

| 層 | 対象 | 依存してよい先 |
|----|------|----------------|
| shared | `src/components`, `src/config`, `src/hooks`, `src/lib`, `src/types`, `src/utils` | shared のみ |
| features | `src/features/*` | 同一 feature、shared |
| app | `src/app` | app 内部、features、shared |

禁止する import:

- `features -> app`
- `shared -> features`
- `shared -> app`
- feature 間の直接 import

複数 feature の合成は `src/app` で行います。この境界は ESLint で検出します。

### 3-4. デザインシステムルール

| 項目 | 値 |
|------|----|
| スペーシング単位 | 4px / 8px / 12px / 16px / 24px / 32px / 48px |
| 角丸 | sm: 6px / md: 8px / lg: 12px / full: 9999px |
| フォント（日本語） | Noto Sans JP |
| フォント（欧文） | Geist / system-ui |
| コントラスト基準 | WCAG 2.2 AA 以上 |

### 3-5. アクセス制御とデータ境界

コンテンツの閲覧制御は次の方針で `features/contents` に閉じて実装する。詳細は [docs/content-access.md](docs/content-access.md) を参照。

- **routeAccessPolicy と accessPolicy の分離**: `ContentRouteAccessPolicy` は `/contents/[id]` の URL 到達条件だけを持ち、`ContentAccessPolicy` は本文 full detail の閲覧条件だけを持つ。
- **accessPolicy と価格の分離**: `ContentAccessPolicy` は閲覧条件の判定に必要な情報だけを持ち、表示文言や価格を持たない。価格は `ProductOffer`（`getProductOffer()` 経由）から取得する。
- **URL 到達可否判定**: `canAccessContentRoute(policy, user)` が anonymous / authenticated のみで URL 到達可否を返す。Proxy は `src/config/content-route-access-manifest.ts` の静的 manifest だけを使う optimistic redirect に限定する。
- **本文閲覧可否判定**: `canViewContent(policy, viewer)` が allowed / denied と理由を返す。admin は常に allowed。
- **Route Guard と Content Gate の分離**: 領域への入場は Route Guard（`requireCurrentUserForRoute` など）、content detail URL は `routeAccessPolicy`、本文の閲覧は Content Gate（`canViewContent`）で制御する。未ログイン access は `/login?next=<original-path>` へ遷移する。
- **データ境界**: metadata（`getContentMetadata`）と preview（`getContentPreview`）は認可前に取得してよい。full body を含む detail（`getContentDetail`）は `routeAccessPolicy` と `canViewContent()` の allowed に通った後でのみ取得する。
- **ページの脱モック依存**: page は `mockContents` などを直接 import せず、API abstraction（`features/contents/api`）経由で取得する。
- **mock auth scenario**: server 側は `AUTH_PROVIDER=mock` と `MOCK_AUTH_SCENARIO=anonymous` / `premium-member` / `admin` などで切り替える。browser MSW 側は `NEXT_PUBLIC_API_MOCKING=enabled` と `NEXT_PUBLIC_AUTH_MOCK_SCENARIO=admin` で表示確認用 viewer を切り替える。

## 4. 未確定事項

### 4-1. 実装ブロッカー

以下は実装方式が確定していないため、現時点では本実装ではなくモックまたは設計予定として扱います。

| # | 項目 | 選択肢 | 影響範囲 |
|---|------|--------|----------|
| 1 | 認証基盤 | NextAuth.js / Supabase Auth / Clerk | middleware、session 管理、Public/Member/Admin のアクセス制御 |
| 2 | DB・バックエンド | Next.js route handlers のみ / 別途バックエンド | data layer、API 設計、CRUD、deploy 構成 |
| 3 | ダークモード対応時期 | MVP から両対応 / 後から追加 | theme token、UI 検証コスト |
| 4 | 多言語対応時期 | MVP から構成に含める / 後から追加 | route 構成、文言管理、翻訳 workflow |

認証基盤と DB・バックエンドは、RBAC と Admin CRUD を実装する前に決定する必要があります。

## 5. MVP 要件

`MVP` 列は要求を示します。`実装状態` 列は現在の repo 状態を示します。

### 5-1. Public Zone

| # | ページ名 | パス | 目的 | MVP | 実装状態 |
|---|---------|------|------|:---:|----------|
| 1 | トップページ | `/` | サービス概要・ログイン導線 | ✅ | 実装済み |
| 2 | ログイン | `/login` | メール・パスワード認証 | ✅ | Coming Soon |
| 3 | 新規登録 | `/register` | 会員登録フォーム | ✅ | Coming Soon |
| 4 | パスワードリセット | `/reset-password` | 再設定メール送信 | — | 未実装 |
| 5 | 利用規約 | `/terms` | 法的ページ（静的） | — | 未実装 |
| 6 | プライバシーポリシー | `/privacy` | 法的ページ（静的） | — | 未実装 |

### 5-2. Member Zone

| # | ページ名 | パス | 目的 | MVP | 実装状態 |
|---|---------|------|------|:---:|----------|
| 1 | ダッシュボード | `/dashboard` | 全体状況の把握 | ✅ | Coming Soon |
| 2 | コンテンツ一覧 | `/contents` | 記事・資料・投稿の一覧 | ✅ | 部分実装（`(public)` で公開カタログ化。非会員も閲覧可） |
| 3 | コンテンツ詳細 | `/contents/[id]` | 情報の閲覧 | ✅ | 部分実装（`(public)`。URL は routeAccessPolicy、本文は accessPolicy ベースの Content Gate で制御） |
| 4 | お気に入り | `/bookmarks` | 保存済み情報の一覧 | ✅ | Coming Soon |
| 5 | 通知 | `/notifications` | お知らせ・更新情報 | ✅ | Coming Soon |
| 6 | プロフィール設定 | `/settings/profile` | 会員情報管理 | ✅ | Coming Soon |
| 7 | アカウント設定 | `/settings/account` | メール・パスワード・退会 | ✅ | Coming Soon |

### 5-3. Admin Zone

| # | ページ名 | パス | 目的 | MVP | 実装状態 |
|---|---------|------|------|:---:|----------|
| 1 | コンテンツ管理 | `/admin/contents` | 投稿・編集・削除・公開制御 | ✅ | Coming Soon + Admin Guard（CRUD と実認証 provider は未実装） |
| 2 | ユーザー管理 | `/admin/users` | 会員一覧・ロール管理 | — | 未実装 |
| 3 | お知らせ管理 | `/admin/notifications` | 通知の作成・配信 | — | 未実装 |

### 5-4. ページ数サマリ

| ゾーン | MVP 要求 | 現在の実装済み | 現在の部分実装 | Coming Soon | 未実装/将来追加 | 合計 |
|--------|:--------:|:--------------:|:--------------:|:-----------:|:---------------:|:----:|
| Public | 3 | 1 | 0 | 2 | 3 | 6 |
| Member | 7 | 0 | 2 | 5 | 0 | 7 |
| Admin | 1 | 0 | 0 | 1 | 2 | 3 |
| **合計** | **11** | **1** | **2** | **8** | **5** | **16** |

## 6. 評価基準

- **UI 設計力**: 汎用的な骨格として設計されており、特定ユースケースに縛られない
- **コンポーネント設計**: shadcn/ui ベースの一貫したデザインシステム
- **情報設計**: 3 層ゾーン構成（Public / Member / Admin）と RBAC の整合性
- **認証設計**: provider 非依存の mock auth service と Member/Admin Guard は部分実装。実認証 provider は未実装
- **CRUD 実装**: Admin コンテンツ管理画面でフルサイクルを示す。現時点では未実装
- **レスポンシブ対応**: モバイル・タブレット・デスクトップの 3 ブレークポイント
- **アクセシビリティ**: WCAG 2.2 AA 準拠（キーボード操作・コントラスト・フォーカス表示）
- **拡張性**: 将来機能の追加を想定した設計ドキュメントの存在

## 7. 今後の実装順序

1. README と実装状態の乖離を継続的に更新する。
2. `features/contents` を `types`、`constants`、`data`、`api` に分割し、page から mock data への直接依存を外す。
3. `shared -> features -> app` の一方向依存を ESLint で検出できるようにする。
4. 認証基盤未確定を前提に、provider 非依存の認証・認可境界を shared layer に定義する。
   - `AuthUser` / `UserRole` を `src/types/auth.ts` に定義する。
   - current user 取得を `src/lib/auth/get-current-user.ts` に集約する。
   - Member/Admin の認可判定を `src/lib/auth/authorization.ts` に集約する。
   - 認証基盤の選定は RBAC / Admin CRUD / 実ログイン・登録の本実装前に行う。
5. 実認証 provider と session 管理を導入し、mock auth service を置き換える。
6. Admin コンテンツ管理の CRUD を実装する。
7. DB・バックエンド確定後、mock data を API/data layer 経由へ移行する。

## 拡張想定機能（将来フェーズ）

| カテゴリ | 機能例 | デザイン上の受け皿 |
|----------|--------|--------------------|
| 認証拡張 | ソーシャルログイン・MFA | ログイン画面の拡張 |
| お知らせ配信 | 管理者からの通知送信 | `/admin/notifications` |
| 検索・絞り込み | 全文検索・タグ絞り込み | コンテンツ一覧の検索バー |
| AI 機能 | 要約・アシスタント | ダッシュボードパネル |
| 決済・プラン | プラン比較・Stripe 連携 | `/pricing`・`/settings/billing` |
| API 連携 | 外部サービス連携ログ | `/admin/api-logs` |
| 学習コンテンツ | コース一覧・進捗管理 | `/courses`・`/courses/[id]` |
| 多言語対応 | 日英切り替え | 全ページ |
| ダークモード | ライト/ダーク切り替え | 全ページ |
| 監査ログ | 操作履歴の記録・参照 | `/admin/audit-logs` |
