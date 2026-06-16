import { Suspense } from "react";

import { AdminAuthSlot } from "./_components/admin-auth-slot";

/**
 * Admin Zone 共通の route guard layout。
 *
 * admin role の確認は request-time の `AdminAuthSlot` に隔離し、`<Suspense>` で包むことで
 * layout 全体を dynamic 化せずに済ませる。Admin shell はほぼ無いため fallback は null。
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <AdminAuthSlot nextPath="/admin/contents">{children}</AdminAuthSlot>
    </Suspense>
  );
}
