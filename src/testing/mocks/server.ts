import { setupServer } from "msw/node";

import { handlers } from "@/testing/mocks/handlers";

/** Vitest で HTTP API 境界を mock する MSW server。 */
export const server = setupServer(...handlers);
