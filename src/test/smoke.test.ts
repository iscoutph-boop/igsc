import { describe, expect, it } from "vitest";

describe("test harness", () => {
  it("provides a DOM", () => {
    const element = document.createElement("main");
    element.textContent = "IG Sabroso";
    expect(element).toHaveTextContent("IG Sabroso");
  });
});
