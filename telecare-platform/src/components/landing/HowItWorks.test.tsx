/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { HowItWorks } from "./HowItWorks";

describe("HowItWorks Component", () => {
  it("should display main section heading", () => {
    render(<HowItWorks />);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeDefined();
    expect(heading.textContent).toContain("How It Works");
  });

  it("should display 3-4 step visual process", () => {
    render(<HowItWorks />);

    // Should have exactly 4 steps
    const steps = screen.getAllByTestId(/^step-\d+$/).filter(el => !el.getAttribute('data-testid')?.includes('-indicator'));
    expect(steps.length).toBe(4);
  });

  it("should have Gaza clinician registration step", () => {
    render(<HowItWorks />);

    // Step for Gaza clinicians to register/request help
    expect(screen.getByText("Gaza Clinician Request")).toBeDefined();
  });

  it("should have UK specialist matching step", () => {
    render(<HowItWorks />);

    // Step for UK specialist matching and notification
    expect(screen.getByText(/uk.*specialist.*match/i)).toBeDefined();
  });

  it("should have consultation connection step", () => {
    render(<HowItWorks />);

    // Step for secure video/chat consultation
    expect(screen.getByText(/secure.*consultation/i)).toBeDefined();
  });

  it("should have follow-up or documentation step", () => {
    render(<HowItWorks />);

    // Step for follow-up care or medical documentation
    expect(screen.getByText("Follow-up Documentation")).toBeDefined();
  });

  it("should display step numbers or icons", () => {
    render(<HowItWorks />);

    // Each step should have a visual indicator (number or icon)
    const stepIndicators = screen.getAllByTestId(/step-\d+-indicator/);
    expect(stepIndicators.length).toBe(4);
  });

  it("should have proper semantic HTML structure", () => {
    render(<HowItWorks />);

    const section = screen.getByRole("region");
    expect(section.getAttribute("aria-label")).toContain("how it works");
  });

  it("should be mobile-responsive", () => {
    render(<HowItWorks />);

    const container = screen.getByTestId("how-it-works-container");
    expect(container.classList.contains("container-responsive")).toBe(true);
  });

  it("should emphasize emergency capability", () => {
    render(<HowItWorks />);

    // Should mention emergency or urgent capabilities
    const emergencyElements = screen.getAllByText(/emergency|urgent|24.*7/i);
    expect(emergencyElements.length).toBeGreaterThan(0);
  });

  it("should mention security and privacy", () => {
    render(<HowItWorks />);

    // Should reference secure communication
    expect(screen.getByText(/Emergency consultations available 24\/7 with secure encrypted connections/i)).toBeDefined();
  });
});