# Modular Member Portal

最終確認日: 2026-06-07

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
| 未実装 | README 上の MVP/将来構想にはあるが、現時点で route/page がないもの |
| 未確定 | 実装方式や採用技術の決定が必要なもの |

### 2-2. 実装済み

| 項目 | パス | 現状 |
|------|------|------|
| トップページ | `/` | `src/app/page.tsx` に実体がある Public Zone の入口画面 |

### 2-3. 部分実装

| 項目 | パス | 現状 |
|------|------|------|
| Member Zone layout | `(member)` route group | sidebar/header/nav config は実装済み。ただし認証境界は未実装 |
| コンテンツ一覧 | `/contents` | `mockContents` を直接参照する静的 UI。DB/API/認証連携は未実装 |
| コンテンツ詳細 | `/contents/[id]` | `mockContents` と `getContentDetail(id)` を使う静的詳細 UI。記事以外や存在しない ID は `notFound()` |

### 2-4. 未実装

| 項目 | パス | 備考 |
|------|------|------|
| ログイン | `/login` | 認証基盤未確定 |
| 新規登録 | `/register` | 認証基盤未確定 |
| ダッシュボード | `/dashboard` | route/page なし |
| お気に入り | `/bookmarks` | route/page なし |
| 通知 | `/notifications` | route/page なし |
| プロフィール設定 | `/settings/profile` | route/page なし |
| アカウント設定 | `/settings/account` | route/page なし |
| Admin コンテンツ管理 | `/admin/contents` | route/page なし。CRUD/RBAC は未実装 |

### 2-5. 利用可能な scripts

`package.json` で確認できる scripts は次の 4 つです。`test`、`typecheck`、`e2e` は現時点では定義されていません。

```bash
pnpm run dev
pnpm run build
pnpm run start
pnpm run lint
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
├── Public Zone      認証不要。集客・認証導線
├── Member Zone      ログイン必須想定。情報閲覧・設定
└── Admin Zone       管理者専用想定。RBAC で制御
```

- `src/app/(member)` は Member Zone の route group として扱う。
- Member Zone の sidebar/header/nav config は `src/app/(member)` 配下の内部実装として管理する。
- `features/contents` はコンテンツ機能の UI と mock data を持つ feature として扱う。
- 現時点では DB・バックエンドが未確定のため、コンテンツ画面は静的モックを使う。

### 3-3. アーキテクチャ境界

依存方向は `shared -> features -> app` として扱います。

| 層 | 対象 | 依存してよい先 |
|----|------|----------------|
| shared | `src/components`, `src/hooks`, `src/lib`, `src/types`, `src/utils` | shared のみ |
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
| 2 | ログイン | `/login` | メール・パスワード認証 | ✅ | 未実装 |
| 3 | 新規登録 | `/register` | 会員登録フォーム | ✅ | 未実装 |
| 4 | パスワードリセット | `/reset-password` | 再設定メール送信 | — | 未実装 |
| 5 | 利用規約 | `/terms` | 法的ページ（静的） | — | 未実装 |
| 6 | プライバシーポリシー | `/privacy` | 法的ページ（静的） | — | 未実装 |

### 5-2. Member Zone

| # | ページ名 | パス | 目的 | MVP | 実装状態 |
|---|---------|------|------|:---:|----------|
| 1 | ダッシュボード | `/dashboard` | 全体状況の把握 | ✅ | 未実装 |
| 2 | コンテンツ一覧 | `/contents` | 記事・資料・投稿の一覧 | ✅ | 部分実装 |
| 3 | コンテンツ詳細 | `/contents/[id]` | 情報の閲覧 | ✅ | 部分実装 |
| 4 | お気に入り | `/bookmarks` | 保存済み情報の一覧 | ✅ | 未実装 |
| 5 | 通知 | `/notifications` | お知らせ・更新情報 | ✅ | 未実装 |
| 6 | プロフィール設定 | `/settings/profile` | 会員情報管理 | ✅ | 未実装 |
| 7 | アカウント設定 | `/settings/account` | メール・パスワード・退会 | ✅ | 未実装 |

### 5-3. Admin Zone

| # | ページ名 | パス | 目的 | MVP | 実装状態 |
|---|---------|------|------|:---:|----------|
| 1 | コンテンツ管理 | `/admin/contents` | 投稿・編集・削除・公開制御 | ✅ | 未実装 |
| 2 | ユーザー管理 | `/admin/users` | 会員一覧・ロール管理 | — | 未実装 |
| 3 | お知らせ管理 | `/admin/notifications` | 通知の作成・配信 | — | 未実装 |

### 5-4. ページ数サマリ

| ゾーン | MVP 要求 | 現在の実装済み | 現在の部分実装 | 将来追加 | 合計 |
|--------|:--------:|:--------------:|:--------------:|:--------:|:----:|
| Public | 3 | 1 | 0 | 3 | 6 |
| Member | 7 | 0 | 2 | 0 | 7 |
| Admin | 1 | 0 | 0 | 2 | 3 |
| **合計** | **11** | **1** | **2** | **5** | **16** |

## 6. 評価基準

- **UI 設計力**: 汎用的な骨格として設計されており、特定ユースケースに縛られない
- **コンポーネント設計**: shadcn/ui ベースの一貫したデザインシステム
- **情報設計**: 3 層ゾーン構成（Public / Member / Admin）と RBAC の整合性
- **認証設計**: ロールベースアクセス制御の実装。現時点では未実装
- **CRUD 実装**: Admin コンテンツ管理画面でフルサイクルを示す。現時点では未実装
- **レスポンシブ対応**: モバイル・タブレット・デスクトップの 3 ブレークポイント
- **アクセシビリティ**: WCAG 2.2 AA 準拠（キーボード操作・コントラスト・フォーカス表示）
- **拡張性**: 将来機能の追加を想定した設計ドキュメントの存在

## 7. 今後の実装順序

1. README と実装状態の乖離を継続的に更新する。
2. `features/contents` を `types`、`constants`、`data`、`api` に分割し、page から mock data への直接依存を外す。
3. `shared -> features -> app` の一方向依存を ESLint で検出できるようにする。
4. 認証基盤を決定し、`AuthUser` / `UserRole` / session 取得境界を定義する。
5. Member Zone と Admin Zone のアクセス制御を実装する。
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
