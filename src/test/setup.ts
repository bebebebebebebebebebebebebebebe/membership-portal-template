import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";

// vitest config で globals を有効にしていないため、RTL の自動 cleanup が
// 登録されない。テスト間で jsdom の DOM を残さないよう明示的に破棄する。
afterEach(() => {
  cleanup();
});
