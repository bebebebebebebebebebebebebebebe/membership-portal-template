import { browserContentHandlers } from "@/testing/mocks/handlers/browser-contents";

/** 開発用 browser worker に登録する client-safe MSW handlers。 */
export const browserHandlers = [...browserContentHandlers];
