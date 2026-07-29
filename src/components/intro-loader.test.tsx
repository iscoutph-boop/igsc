import { render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { IntroLoader } from "./intro-loader";

afterEach(() => {
  sessionStorage.clear();
});

describe("IntroLoader", () => {
  it("does not render after the session has already seen the intro", () => {
    sessionStorage.setItem("igs-intro-seen", "true");

    const { container } = render(<IntroLoader />);

    expect(container.firstChild).toBeNull();
  });
});
