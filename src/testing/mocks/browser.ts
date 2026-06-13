import { setupWorker } from "msw/browser";

import { browserHandlers } from "@/testing/mocks/handlers/browser";

/** 開発時の browser fetch を mock する MSW worker。 */
export const worker = setupWorker(...browserHandlers);
