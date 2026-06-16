import { requireCurrentAdminForRoute } from "@/lib/auth/authorization";

/**
 * Admin Zone の admin guard を request time に評価する slot。
 *
 * `/admin/*` の入口で admin role を要求し、layout の static shell から認証読み取りを切り離す。
 * Proxy の早期 redirect を通過しても、ここで最終的に role を再確認する。data source 近くの
 * CRUD / Route Handler / Server Action では別途 admin check を行う。
 *
 * @param nextPath 未ログイン時の login redirect 後に戻すパス。
 * @param children Admin Zone の各ページ本文。
 */
export async function AdminAuthSlot({
  nextPath,
  children,
}: {
  nextPath: string;
  children: React.ReactNode;
}) {
  await requireCurrentAdminForRoute({ nextPath });

  return children;
}
