import { normalizeInternalNextPath } from "@/lib/auth/auth-redirect";

/**
 * ログイン後の戻り先（`next`）を案内する request-time slot。
 *
 * `searchParams` は request time にしか確定しないため、static shell には含めず
 * `<Suspense>` 内のこの Server Component に隔離する。値は `normalizeInternalNextPath`
 * で内部パスへ正規化し、open redirect を避ける。
 *
 * @param searchParams - 未解決の検索パラメータ Promise（page 本体では await しない）。
 */
export async function LoginNextNotice({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const nextPath = normalizeInternalNextPath(next);

  return (
    <p className="mx-auto w-full max-w-3xl px-1 text-sm text-muted-foreground">
      ログイン完了後は {nextPath} に戻れます。
    </p>
  );
}
