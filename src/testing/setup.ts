import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll } from "vitest";
import "@testing-library/jest-dom/vitest";

import { resetTestAuthState } from "@/lib/auth/testing/test-auth-state";
import { server } from "@/testing/mocks/server";

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

// vitest config で globals を有効にしていないため、RTL の自動 cleanup が
// 登録されない。テスト間で jsdom の DOM を残さないよう明示的に破棄する。
afterEach(() => {
  server.resetHandlers();
  resetTestAuthState();
  cleanup();
});

afterAll(() => {
  server.close();
});
