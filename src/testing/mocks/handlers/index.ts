import { contentHandlers } from "@/testing/mocks/handlers/contents";

/** Vitest と browser worker で共有する MSW handlers。 */
export const handlers = [...contentHandlers];
