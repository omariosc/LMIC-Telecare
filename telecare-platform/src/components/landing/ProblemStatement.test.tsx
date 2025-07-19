/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { ProblemStatement } from "./ProblemStatement";

describe("ProblemStatement Component", () => {
  it("should display Gaza healthcare crisis statistics", () => {
    render(<ProblemStatement />);

    // Should display key healthcare statistics for Gaza
    expect(screen.getByText(/2\.3 million/i)).toBeDefined();
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.textContent).toContain("Gaza");
  });

  it("should show hospital capacity statistics", () => {
    render(<ProblemStatement />);

    // Should show hospital functionality data
    expect(screen.getByText(/hospital/i)).toBeDefined();
    expect(screen.getByText(/35/)).toBeDefined(); // Number of functional hospitals
  });

  it("should display medical staff shortage", () => {
    render(<ProblemStatement />);

    // Should highlight medical staff shortages
    expect(screen.getByText(/specialist shortage/i)).toBeDefined();
    expect(screen.getByText(/90%/)).toBeDefined();
  });

  it("should have compelling visual statistics", () => {
    render(<ProblemStatement />);

    // Should display statistics in visually compelling format
    const statisticCards = screen.getAllByTestId(/statistic-card/);
    expect(statisticCards.length).toBeGreaterThanOrEqual(3);
  });

  it("should emphasize urgency and time sensitivity", () => {
    render(<ProblemStatement />);

    // Should convey urgent timing
    expect(screen.getByText(/every minute counts/i)).toBeDefined();
  });

  it("should be mobile-responsive", () => {
    render(<ProblemStatement />);

    const container = screen.getByTestId("problem-statement-container");
    expect(container.classList.contains("container-responsive")).toBe(true);
  });

  it("should use medical priority styling", () => {
    render(<ProblemStatement />);

    // Should use medical card styling for statistics
    const criticalStat = screen.getByTestId("statistic-card-critical");
    expect(criticalStat.classList.contains("medical-card-critical")).toBe(true);
  });

  it("should have proper section heading", () => {
    render(<ProblemStatement />);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeDefined();
    expect(heading.textContent).toContain("Healthcare");
  });

  it("should include blockade impact messaging", () => {
    render(<ProblemStatement />);

    // Should mention impact of blockade/restrictions
    expect(screen.getByText(/blockade restrictions/i)).toBeDefined();
  });

  it("should provide context for UK doctor involvement", () => {
    render(<ProblemStatement />);

    // Should explain why UK doctors are needed
    expect(
      screen.getByText(/why uk medical specialists are critical/i)
    ).toBeDefined();
  });
});
