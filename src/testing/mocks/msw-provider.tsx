"use client";

import { useEffect } from "react";

import { getPublicEnv } from "@/config/public-env";

/**
 * 開発時だけ MSW browser worker を起動する provider。
 *
 * app layer から dev-only に合成される testing support。shared component 層へ
 * testing mocks への依存を持ち込まないよう、MSW 関連の実装を `src/testing` に閉じる。
 *
 * @param children - アプリ本体。
 */
export function MswProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (getPublicEnv().NEXT_PUBLIC_API_MOCKING !== "enabled") {
      return;
    }

    void import("@/testing/mocks/browser").then(({ worker }) =>
      worker.start({ onUnhandledRequest: "bypass" })
    );
  }, []);

  return children;
}
