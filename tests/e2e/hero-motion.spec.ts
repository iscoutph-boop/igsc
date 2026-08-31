import { expect, test } from "@playwright/test";

test("desktop hero owns three isolated states", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const media = page.getByTestId("concept03-desktop-hero-media");
  await expect(media).toHaveAttribute("data-interaction-ready", "true");
  await expect(media).toHaveAttribute("data-hero-state", "idle");
  const box = await media.boundingBox();
  if (!box) throw new Error("Desktop hero media is not visible");

  await page.mouse.move(box.x + box.width * 0.08, box.y + box.height * 0.45);
  await expect(media).toHaveAttribute("data-hero-state", "sketchReveal");
  await page.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.45);
  await expect(media).toHaveAttribute("data-hero-state", "finishedLights");
  await expect(media.locator(".heroLightInterior")).toHaveCSS("opacity", "1");
  await page.mouse.move(10, 10);
  await expect(media).toHaveAttribute("data-hero-state", "idle");
  await expect(media.locator(".heroLightLayer")).toHaveCSS("opacity", "0");
});

test("touch uses the static mobile fallback", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.getByTestId("concept03-mobile-hero-media")).toBeVisible();
  await expect(page.getByTestId("concept03-desktop-hero-media")).toBeHidden();
  await expect(page.getByTestId("hero-motion-layers")).toHaveCount(0);
  await context.close();
});

test("reduced motion keeps interaction but removes transition timing", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const media = page.getByTestId("concept03-desktop-hero-media");
  await expect(media).toHaveAttribute("data-interaction-ready", "true");
  const box = await media.boundingBox();
  if (!box) throw new Error("Desktop hero media is not visible");
  await page.mouse.move(box.x + box.width * 0.82, box.y + box.height * 0.45);
  await expect(media).toHaveAttribute("data-hero-state", "finishedLights");
  const durations = await media
    .locator(".heroLightLayer")
    .evaluateAll((layers) => layers.map((layer) => getComputedStyle(layer).transitionDuration));
  expect(durations.every((duration) => duration === "0s")).toBe(true);
});
