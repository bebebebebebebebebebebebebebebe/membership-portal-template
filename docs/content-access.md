# コンテンツアクセス制御

コンテンツの公開・閲覧制御に関する設計をまとめる。実装は `src/features/contents` に閉じ、app 層（route / layout / page）は合成に集中する。

## 1. 基本方針

- `/contents` は常に Public Zone の公開カタログとして扱う。非会員も一覧と無料公開コンテンツを閲覧できる。
- `/contents/[id]` は `(public)` route group に置いたまま、content 単位の `routeAccessPolicy` で URL 自体への到達可否を判定する。
- 本文 full detail の閲覧可否は `content.accessPolicy` で判定する。
- **Route Guard**（領域への入場制御）と **Content Gate**（本文の閲覧制御）を分離する。
  - Route Guard: `/dashboard`・`/bookmarks`・`/notifications`・`/settings/*` などの Member Zone と、`routeAccessPolicy=loginRequired` の `/contents/[id]`。`proxy.ts` は早期 redirect、Server Component / API は最終確認を担当する。
  - Content Gate: `/contents/[id]` の本文。`canViewContent()` の結果で本文 or `ContentAccessGate` を出し分ける。

## 2. routeAccessPolicy（URL 到達条件）

`ContentRouteAccessPolicy`（[content-route-access.ts](../src/features/contents/types/content-route-access.ts)）は URL 自体への到達条件だけを表す。

| kind | 意味 |
|------|------|
| `public` | 匿名でも `/contents/[id]` を開ける |
| `loginRequired` | 匿名は `/login?next=<content-path>` へ redirect する |

`canAccessContentRoute(policy, user)`（[content-route-access.ts](../src/features/contents/utils/content-route-access.ts)）は `AuthUser | null` だけを使う。プラン・購入状態は見ない。

Proxy は [content-route-access-manifest.ts](../src/config/content-route-access-manifest.ts) の軽量 manifest だけを読み、DB / repository / Route Handler を呼ばない。これは早期 redirect 用の optimistic check であり、最終認可は Server Component と detail API 側で再確認する。

## 3. accessPolicy（本文閲覧条件）

`ContentAccessPolicy`（[content-access.ts](../src/features/contents/types/content-access.ts)）は判別ユニオン。表示文言や価格は持たせず、判定に必要な情報だけを保持する。

| kind | 意味 | 追加フィールド |
|------|------|----------------|
| `free` | ログイン不要で閲覧可 | — |
| `loginRequired` | ログインで閲覧可 | — |
| `planRequired` | 対象プラン加入で閲覧可 | `requiredPlans` |
| `purchaseRequired` | 単品購入で閲覧可 | `productId` |
| `planOrPurchase` | プラン加入または単品購入で閲覧可 | `requiredPlans`, `productId` |

価格は accessPolicy ではなく `ProductOffer`（`getProductOffer()`）から取得し、閲覧条件と販売条件を分離する。

## 4. 本文閲覧可否判定

`canViewContent(policy, viewer)`（[content-access.ts](../src/features/contents/utils/content-access.ts)）が `ContentAccessDecision` を返す。

- admin（`viewer.user.role === "admin"`）は常に allowed。
- denied 理由: `loginRequired` / `planRequired` / `purchaseRequired` / `planOrPurchaseRequired`。
- `viewer` は `getContentViewer()` がサーバー側の認証状態（`getCurrentUser()`）から組み立てる（`plan` の正規化、購入済み productId）。

`ContentAccessGate`（[content-access-gate.tsx](../src/features/contents/components/content-access-gate.tsx)）は denied 理由に応じた説明と CTA（ログイン / プラン確認 / 単品購入）を表示する。単品購入 CTA は `ContentPurchaseCta` が `ProductOffer` 由来の価格で描画する。

## 5. データ境界

| データ | 取得 API | 認可前に取得してよいか |
|--------|----------|:----------------------:|
| metadata（title/description/tags/routeAccessPolicy/accessPolicy 等） | `getContentMetadata()` | ○ |
| preview（概要のみ。本文・URL を含まない） | `getContentPreview()` | ○ |
| full detail（本文セクション・コメント） | `getContentDetail()` | × （認可後のみ） |

`getContentDetail()` は `routeAccessPolicy` と `canViewContent()` の allowed に通った後でのみ呼ぶ。detail API も同じ二段階の条件を確認し、UI gate だけに依存せず本文データそのものを認可前に渡さない。

## 6. 詳細ページの処理順

`(public)/contents/[id]/page.tsx` の評価順:

1. `getContentMetadata(id)` を取得。存在しない、または `isPubliclyAccessibleContentMetadata()` が false（未公開・hidden）なら `notFound()`。
2. `routeAccessPolicy=loginRequired` の場合は、`<Suspense>` fallback を返す前に `getContentViewer()` と `canAccessContentRoute(routeAccessPolicy, viewer.user)` で URL 到達条件を最終確認する。
3. `routeAccessPolicy=loginRequired` かつ anonymous → `/login?next=<content-path>` へ redirect。fallback や content-derived shell は返さない。
4. 記事以外（資料）は詳細 UI 未実装のため Coming Soon を表示する。
5. `<Suspense>` fallback を含む shell を返す。public content の viewer 取得は `ContentRouteGuardSlot` 内、loginRequired 通過済み content は取得済み viewer を `PersonalizedContentAccess` へ渡す。
6. `PersonalizedContentAccess` が `canViewContent(accessPolicy, viewer)` で本文閲覧条件を判定する。
7. denied → `getContentPreview(id)` + `ContentAccessGate`。
8. allowed → `getContentDetail(id)` + `ArticleDetail`（`free` は非会員でも本文表示。`currentUser` が null ならコメント投稿欄は出さない）。

## 7. 公開判定ユーティリティ

[content-publication.ts](../src/features/contents/utils/content-publication.ts):

- `isListedPublishedContent()`: 一覧掲載対象（published かつ listed）。`getContents()` / 関連コンテンツの絞り込みに使う。
- `isPubliclyAccessibleContentMetadata()`: URL 直アクセス対象（published かつ hidden でない）。listed / unlisted は直アクセス可、draft / scheduled / archived / hidden は `notFound()`。
