import { requireCurrentAdminForRoute } from "@/lib/auth/authorization";

export const dynamic = "force-dynamic";

/**
 * Admin Zone 共通の route guard layout。
 *
 * `/admin/*` 配下の入口で admin role を要求し、認証状態が build 時に固定されないよう
 * dynamic rendering として扱う。将来の CRUD / Route Handler / Server Action では
 * data source 近くでも admin check を行う。
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireCurrentAdminForRoute({ nextPath: "/admin/contents" });

  return children;
}
