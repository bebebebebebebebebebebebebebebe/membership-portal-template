import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

/**
 * 記事詳細ページ上部のパンくず。
 *
 * 共有ヘッダー（SiteHeader）は現在パスから 2 階層しか生成できないため、
 * 詳細ページの 3 階層（Member Zone › コンテンツ一覧 › 記事詳細）はページ内に描画する。
 * 先頭はメンバーゾーンのホーム（/dashboard）、中間は一覧（/contents）へのリンク。
 */
export function DetailBreadcrumb() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard">Member Zone</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/contents">コンテンツ一覧</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>記事詳細</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
