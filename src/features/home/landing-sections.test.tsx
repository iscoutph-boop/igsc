import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithRouter } from "@/test/render-with-router";
import { LandingSections } from "./landing-sections";

const renderLandingSections = () => renderWithRouter(<LandingSections />);

describe("LandingSections", () => {
  it("links the featured-work action to the complete projects route", async () => {
    await renderLandingSections();

    expect(screen.getByRole("link", { name: "Explore all projects" })).toHaveAttribute(
      "href",
      "/projects",
    );
  });

  it("shows verified Gono, Obida, and Alivio covers with exact catalog alt text", async () => {
    await renderLandingSections();

    expect(screen.getByRole("img", { name: "Gono Project — image 1 of 6" })).toHaveAttribute(
      "src",
      "/assets/projects/gono/thumb-01.webp",
    );
    expect(screen.getByRole("img", { name: "Obida Project — image 1 of 6" })).toHaveAttribute(
      "src",
      "/assets/projects/obida/thumb-01.webp",
    );
    expect(screen.getByRole("img", { name: "Alivio Project — image 1 of 6" })).toHaveAttribute(
      "src",
      "/assets/projects/alivio/thumb-01.webp",
    );
  });

  it("keeps the lead project media and caption in bounded desktop grid rows", async () => {
    await renderLandingSections();

    const leadFigure = screen
      .getByRole("img", { name: "Gono Project — image 1 of 6" })
      .closest("figure");
    expect(leadFigure).toHaveClass("grid");
    expect(leadFigure).toHaveClass("lg:grid-rows-[minmax(0,1fr)_auto]");
  });

  it("provides the exact anchored landing sections", async () => {
    await renderLandingSections();

    expect(
      screen.getByRole("region", {
        name: "Building the future with quality and trust.",
      }),
    ).toHaveAttribute("id", "about");
    expect(screen.getByRole("region", { name: "Services" })).toHaveAttribute("id", "services");
    expect(screen.getByRole("region", { name: "Our process" })).toHaveAttribute("id", "process");
  });

  it("renders exactly four open editorial service rows", async () => {
    await renderLandingSections();

    const services = screen.getByRole("region", { name: "Services" });
    expect(within(services).getAllByRole("listitem")).toHaveLength(4);
  });

  it("renders exactly four numbered process steps", async () => {
    await renderLandingSections();

    const process = screen.getByRole("region", { name: "Our process" });
    expect(within(process).getAllByRole("listitem")).toHaveLength(4);
  });

  it("links the consultation call to action to its dedicated route", async () => {
    await renderLandingSections();

    expect(screen.getByRole("link", { name: "Book a consultation" })).toHaveAttribute(
      "href",
      "/consultation",
    );
  });

  it("does not render decorative service or process icons", async () => {
    await renderLandingSections();

    const services = screen.getByRole("region", { name: "Services" });
    const process = screen.getByRole("region", { name: "Our process" });
    expect(services.querySelector("svg")).not.toBeInTheDocument();
    expect(process.querySelector("svg")).not.toBeInTheDocument();
  });
});
