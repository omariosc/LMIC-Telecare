/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Hero } from "./Hero";

describe("Hero Component", () => {
  it("should display crisis headline", () => {
    render(<Hero />);

    const headline = screen.getByRole("heading", { level: 1 });
    expect(headline).toBeDefined();
    expect(headline.textContent).toContain("Gaza");
    expect(headline.textContent).toContain("Medical");
  });

  it("should display surgeon statistics", () => {
    render(<Hero />);

    // Should show compelling statistics about UK surgeons or medical need
    expect(screen.getByText(/1,200\+.*surgeon/i)).toBeDefined();
  });

  it("should have primary CTA for UK doctors", () => {
    render(<Hero />);

    const ukDoctorCTA = screen.getByRole("button", { name: /uk.*doctor/i });
    expect(ukDoctorCTA).toBeDefined();
    expect(ukDoctorCTA.classList.contains("btn-primary")).toBe(true);
  });

  it("should have secondary CTA for Gaza access", () => {
    render(<Hero />);

    const gazaCTA = screen.getByRole("button", { name: /gaza.*platform/i });
    expect(gazaCTA).toBeDefined();
    expect(gazaCTA.classList.contains("btn-secondary")).toBe(true);
  });

  it("should have emergency consultation CTA", () => {
    render(<Hero />);

    const emergencyCTA = screen.getByRole("button", { name: /emergency/i });
    expect(emergencyCTA).toBeDefined();
    expect(emergencyCTA.classList.contains("btn-urgent")).toBe(true);
  });

  it("should handle CTA clicks", async () => {
    const user = userEvent.setup();
    render(<Hero />);

    const ukDoctorCTA = screen.getByRole("button", { name: /uk.*doctor/i });

    // Should not throw error when clicked
    await user.click(ukDoctorCTA);
    expect(true).toBe(true); // Placeholder - will be replaced with actual navigation logic
  });

  it("should display Gaza flag cultural accent", () => {
    render(<Hero />);

    const flagAccent = screen.getByTestId("gaza-flag-accent");
    expect(flagAccent).toBeDefined();
    expect(flagAccent.classList.contains("gaza-flag-accent")).toBe(true);
  });

  it("should be mobile-responsive", () => {
    render(<Hero />);

    const heroContainer = screen.getByTestId("hero-container");
    expect(heroContainer.classList.contains("container-responsive")).toBe(true);
  });

  it("should have proper ARIA labels for accessibility", () => {
    render(<Hero />);

    const heroSection = screen.getByRole("banner");
    expect(heroSection.getAttribute("aria-label")).toContain("hero");
  });

  it("should display crisis urgency messaging", () => {
    render(<Hero />);

    // Should emphasize urgency and current crisis
    expect(screen.getByText(/critical.*healthcare.*crisis/i)).toBeDefined();
  });
});
