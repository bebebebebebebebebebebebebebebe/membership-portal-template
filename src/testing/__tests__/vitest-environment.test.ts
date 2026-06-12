import { describe, expect, it } from "vitest";

import { cn } from "@/lib/utils";

describe("Vitest environment", () => {
  it("runs with jsdom and resolves the @ path alias", () => {
    const element = document.createElement("div");

    element.className = cn("base", "active");

    expect(element).toHaveClass("base");
    expect(element).toHaveClass("active");
  });
});
