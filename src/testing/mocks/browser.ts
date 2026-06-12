import { setupWorker } from "msw/browser";

import { handlers } from "@/testing/mocks/handlers";

/** 開発時の browser fetch を mock する MSW worker。 */
export const worker = setupWorker(...handlers);
