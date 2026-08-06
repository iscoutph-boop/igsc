import { describe, expect, it } from "vitest";
import { DEFAULT_SOCIAL_IMAGE, LOCAL_BUSINESS_SCHEMA, SITE_URL, buildCanonicalUrl } from "./seo";

describe("SEO configuration", () => {
  it("uses production IG Sabroso metadata instead of preview-host assets", () => {
    expect(SITE_URL).toBe("https://www.igsabroso.com");
    expect(DEFAULT_SOCIAL_IMAGE).toBe("https://www.igsabroso.com/og/ig-sabroso-social.jpg");
    expect(DEFAULT_SOCIAL_IMAGE).not.toContain("lovable");
    expect(buildCanonicalUrl("/projects")).toBe("https://www.igsabroso.com/projects");
    expect(LOCAL_BUSINESS_SCHEMA.logo).toBe("https://www.igsabroso.com/brand/ig-sabroso-logo.png");
  });
});
