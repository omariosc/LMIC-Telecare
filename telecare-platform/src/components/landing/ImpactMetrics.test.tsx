/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { ImpactMetrics } from "./ImpactMetrics";

describe("ImpactMetrics Component", () => {
  it("should display main impact metrics section heading", () => {
    render(<ImpactMetrics />);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeDefined();
    expect(heading.textContent).toContain("Impact");
  });

  it("should display multiple impact metric cards", () => {
    render(<ImpactMetrics />);

    const metricCards = screen.getAllByTestId(/^metric-\d+$/).filter(el => !el.getAttribute('data-testid')?.includes('-value'));
    expect(metricCards.length).toBe(4);
  });

  it("should have coming soon placeholder for consultations", () => {
    render(<ImpactMetrics />);

    expect(screen.getByText("Emergency Consultations")).toBeDefined();
    const comingSoonElements = screen.getAllByText(/coming soon/i);
    expect(comingSoonElements.length).toBeGreaterThan(0);
  });

  it("should have coming soon placeholder for lives impacted", () => {
    render(<ImpactMetrics />);

    expect(screen.getByText("Lives Impacted")).toBeDefined();
  });

  it("should have coming soon placeholder for response time", () => {
    render(<ImpactMetrics />);

    expect(screen.getByText(/response.*time|average.*time/i)).toBeDefined();
  });

  it("should have coming soon placeholder for specialists registered", () => {
    render(<ImpactMetrics />);

    expect(screen.getByText(/specialist.*register|doctor.*register/i)).toBeDefined();
  });

  it("should display coming soon badges or indicators", () => {
    render(<ImpactMetrics />);

    const comingSoonElements = screen.getAllByText(/coming soon/i);
    expect(comingSoonElements.length).toBeGreaterThanOrEqual(3);
  });

  it("should have proper semantic HTML structure", () => {
    render(<ImpactMetrics />);

    const section = screen.getByRole("region");
    expect(section.getAttribute("aria-label")).toContain("impact metrics");
  });

  it("should be mobile-responsive", () => {
    render(<ImpactMetrics />);

    const container = screen.getByTestId("impact-metrics-container");
    expect(container.classList.contains("container-responsive")).toBe(true);
  });

  it("should emphasize future data collection", () => {
    render(<ImpactMetrics />);

    expect(screen.getByText(/Live impact data collection begins at platform launch/i)).toBeDefined();
  });

  it("should mention Gaza humanitarian focus", () => {
    render(<ImpactMetrics />);

    const gazaElements = screen.getAllByText(/gaza|humanitarian|crisis/i);
    expect(gazaElements.length).toBeGreaterThan(0);
  });

  it("should have visual metric indicators or placeholders", () => {
    render(<ImpactMetrics />);

    const metricIndicators = screen.getAllByTestId(/metric-\d+-value/);
    expect(metricIndicators.length).toBe(4);
  });

  it("should indicate real-time tracking capability", () => {
    render(<ImpactMetrics />);

    const realTimeElements = screen.getAllByText(/real.*time|live.*track|24.*7/i);
    expect(realTimeElements.length).toBeGreaterThan(0);
  });
});