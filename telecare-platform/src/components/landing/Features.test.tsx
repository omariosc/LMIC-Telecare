/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { Features } from "./Features";

describe("Features Component", () => {
  it("should display main features section heading", () => {
    render(<Features />);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeDefined();
    expect(heading.textContent).toContain("Features");
  });

  it("should display feature grid with multiple items", () => {
    render(<Features />);

    const featureItems = screen
      .getAllByTestId(/^feature-\d+$/)
      .filter((el) => !el.getAttribute("data-testid")?.includes("-icon"));
    expect(featureItems.length).toBe(6);
  });

  it("should have emergency consultation feature", () => {
    render(<Features />);

    expect(screen.getByText("Emergency Consultation")).toBeDefined();
  });

  it("should have video/chat communication feature", () => {
    render(<Features />);

    expect(screen.getByText("Secure Video Calls")).toBeDefined();
  });

  it("should have specialist matching feature", () => {
    render(<Features />);

    expect(screen.getByText("Expert Matching")).toBeDefined();
  });

  it("should have medical records feature", () => {
    render(<Features />);

    expect(screen.getByText("Medical Records")).toBeDefined();
  });

  it("should have offline capability feature", () => {
    render(<Features />);

    expect(screen.getByText("Offline Access")).toBeDefined();
  });

  it("should have multilingual support feature", () => {
    render(<Features />);

    expect(screen.getByText("Arabic-English Support")).toBeDefined();
  });

  it("should display feature icons", () => {
    render(<Features />);

    const featureIcons = screen.getAllByTestId(/feature-\d+-icon/);
    expect(featureIcons.length).toBe(6);
  });

  it("should have proper semantic HTML structure", () => {
    render(<Features />);

    const section = screen.getByRole("region");
    expect(section.getAttribute("aria-label")).toContain("features");
  });

  it("should be mobile-responsive", () => {
    render(<Features />);

    const container = screen.getByTestId("features-container");
    expect(container.classList.contains("container-responsive")).toBe(true);
  });

  it("should emphasize emergency and urgency", () => {
    render(<Features />);

    const emergencyElements = screen.getAllByText(
      /24.*7|emergency|urgent|instant/i
    );
    expect(emergencyElements.length).toBeGreaterThan(0);
  });

  it("should mention security and privacy", () => {
    render(<Features />);

    const securityElements = screen.getAllByText(
      /secure|encrypted|private|hipaa|gdpr/i
    );
    expect(securityElements.length).toBeGreaterThan(0);
  });

  it("should highlight Gaza-specific benefits", () => {
    render(<Features />);

    const gazaElements = screen.getAllByText(
      /gaza|palestine|blockade|humanitarian/i
    );
    expect(gazaElements.length).toBeGreaterThan(0);
  });
});
