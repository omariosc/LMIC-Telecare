/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { Partners } from "./Partners";

describe("Partners Component", () => {
  it("should display main partners section heading", () => {
    render(<Partners />);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeDefined();
    expect(heading.textContent).toContain("Partner Organizations");
  });

  it("should display multiple partner organizations", () => {
    render(<Partners />);

    const partnerItems = screen.getAllByTestId(/^partner-\d+$/).filter(el => !el.getAttribute('data-testid')?.includes('-logo'));
    expect(partnerItems.length).toBe(5);
  });

  it("should have medical organization partners", () => {
    render(<Partners />);

    const medicalElements = screen.getAllByText(/medical.*association|nhs|hospital|health/i);
    expect(medicalElements.length).toBeGreaterThan(0);
  });

  it("should have humanitarian organization partners", () => {
    render(<Partners />);

    const humanitarianElements = screen.getAllByText(/humanitarian|relief|aid|charity/i);
    expect(humanitarianElements.length).toBeGreaterThan(0);
  });

  it("should have technology or innovation partners", () => {
    render(<Partners />);

    const techElements = screen.getAllByText(/technology|innovation|tech|digital/i);
    expect(techElements.length).toBeGreaterThan(0);
  });

  it("should display partner logos or placeholder areas", () => {
    render(<Partners />);

    const logoAreas = screen.getAllByTestId(/partner-\d+-logo/);
    expect(logoAreas.length).toBeGreaterThanOrEqual(3);
  });

  it("should mention partnership support for Gaza", () => {
    render(<Partners />);

    const elements = screen.getAllByText(/gaza|palestine|support|collaboration/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  it("should have proper semantic HTML structure", () => {
    render(<Partners />);

    const section = screen.getByRole("region");
    expect(section.getAttribute("aria-label")).toContain("partner");
  });

  it("should be mobile-responsive", () => {
    render(<Partners />);

    const container = screen.getByTestId("partners-container");
    expect(container.classList.contains("container-responsive")).toBe(true);
  });

  it("should include partnership call-to-action", () => {
    render(<Partners />);

    const elements = screen.getAllByText(/join.*partner|become.*partner|partner.*with.*us/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  it("should emphasize humanitarian mission", () => {
    render(<Partners />);

    const elements = screen.getAllByText(/humanitarian|crisis|mission|emergency/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  it("should display coming soon or placeholder messaging", () => {
    render(<Partners />);

    const elements = screen.getAllByText(/coming soon|placeholder|logo|partner/i);
    expect(elements.length).toBeGreaterThan(0);
  });
});