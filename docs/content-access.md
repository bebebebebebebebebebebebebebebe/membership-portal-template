# コンテンツアクセス制御

コンテンツの公開・閲覧制御に関する設計をまとめる。実装は `src/features/contents` に閉じ、app 層（route / layout / page）は合成に集中する。

## 1. 基本方針

- `/contents`・`/contents/[id]` は Member Zone 専用ではなく、`(public)` route group の **公開条件つきカタログ**として扱う。非会員も一覧と無料公開コンテンツを閲覧できる。
- 本文の閲覧可否は `content.accessPolicy` で判定する。
- **Route Guard**（領域への入場制御）と **Content Gate**（本文の閲覧制御）を分離する。
  - Route Guard: `/dashboard`・`/bookmarks`・`/notifications`・`/settings/*` などの Member Zone。`(member)/layout.tsx` が `requireAuthenticatedUser()` で保護する。
  - Content Gate: `/contents/[id]` の本文。`canViewContent()` の結果で本文 or `ContentAccessGate` を出し分ける。

## 2. accessPolicy（閲覧条件）

`ContentAccessPolicy`（[content-access.ts](../src/features/contents/types/content-access.ts)）は判別ユニオン。表示文言や価格は持たせず、判定に必要な情報だけを保持する。

| kind | 意味 | 追加フィールド |
|------|------|----------------|
| `free` | ログイン不要で閲覧可 | — |
| `loginRequired` | ログインで閲覧可 | — |
| `planRequired` | 対象プラン加入で閲覧可 | `requiredPlans` |
| `purchaseRequired` | 単品購入で閲覧可 | `productId` |
| `planOrPurchase` | プラン加入または単品購入で閲覧可 | `requiredPlans`, `productId` |

価格は accessPolicy ではなく `ProductOffer`（`getProductOffer()`）から取得し、閲覧条件と販売条件を分離する。

## 3. 閲覧可否判定

`canViewContent(policy, viewer)`（[content-access.ts](../src/features/contents/utils/content-access.ts)）が `ContentAccessDecision` を返す。

- admin（`viewer.user.role === "admin"`）は常に allowed。
- denied 理由: `loginRequired` / `planRequired` / `purchaseRequired` / `planOrPurchaseRequired`。
- `viewer` は `getContentViewer()` がサーバー側の認証状態（`getCurrentUser()`）から組み立てる（`plan` の正規化、購入済み productId）。

`ContentAccessGate`（[content-access-gate.tsx](../src/features/contents/components/content-access-gate.tsx)）は denied 理由に応じた説明と CTA（ログイン / プラン確認 / 単品購入）を表示する。単品購入 CTA は `ContentPurchaseCta` が `ProductOffer` 由来の価格で描画する。

## 4. データ境界

| データ | 取得 API | 認可前に取得してよいか |
|--------|----------|:----------------------:|
| metadata（title/description/tags/accessPolicy 等） | `getContentMetadata()` | ○ |
| preview（概要のみ。本文・URL を含まない） | `getContentPreview()` | ○ |
| full detail（本文セクション・コメント） | `getContentDetail()` | × （認可後のみ） |

`getContentDetail()` は `canViewContent()` の allowed に通った後でのみ呼ぶ。これにより UI gate だけに依存せず、本文データそのものを認可前に渡さない。

## 5. 詳細ページの処理順

`(public)/contents/[id]/page.tsx` の評価順:

1. `getContentMetadata(id)` を取得。存在しない、または `isPubliclyAccessibleContentMetadata()` が false（未公開・hidden）なら `notFound()`。
2. 記事以外（資料）は本ルート対象外として `notFound()`。
3. `getContentViewer()` で viewer を取得。
4. `canViewContent(accessPolicy, viewer)` で判定。
5. denied → `getContentPreview(id)` + `ContentAccessGate`。
6. allowed → `getContentDetail(id)` + `ArticleDetail`（`free` は非会員でも本文表示。`currentUser` が null ならコメント投稿欄は出さない）。

## 6. 公開判定ユーティリティ

[content-publication.ts](../src/features/contents/utils/content-publication.ts):

- `isListedPublishedContent()`: 一覧掲載対象（published かつ listed）。`getContents()` / 関連コンテンツの絞り込みに使う。
- `isPubliclyAccessibleContentMetadata()`: URL 直アクセス対象（published かつ hidden でない）。listed / unlisted は直アクセス可、draft / scheduled / archived / hidden は `notFound()`。
