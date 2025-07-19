/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { Testimonials } from "./Testimonials";

describe("Testimonials Component", () => {
  it("should display main testimonials section heading", () => {
    render(<Testimonials />);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeDefined();
    expect(heading.textContent).toContain("Testimonials");
  });

  it("should display multiple testimonial cards", () => {
    render(<Testimonials />);

    const testimonialCards = screen.getAllByTestId(/testimonial-\d+/);
    expect(testimonialCards.length).toBeGreaterThanOrEqual(2);
    expect(testimonialCards.length).toBeLessThanOrEqual(6);
  });

  it("should have UK specialist testimonial", () => {
    render(<Testimonials />);

    const ukElements = screen.getAllByText(/uk.*specialist|uk.*doctor/i);
    expect(ukElements.length).toBeGreaterThan(0);
  });

  it("should have Gaza clinician testimonial", () => {
    render(<Testimonials />);

    expect(screen.getByText(/gaza.*clinician|gaza.*doctor/i)).toBeDefined();
  });

  it("should display professional credentials", () => {
    render(<Testimonials />);

    expect(screen.getByText("NHS Foundation Trust, London")).toBeDefined();
    expect(screen.getByText("Royal London Hospital")).toBeDefined();
  });

  it("should include professional titles and credentials", () => {
    render(<Testimonials />);

    const professionalElements = screen.getAllByText(
      /dr\.|doctor|consultant|surgeon/i
    );
    expect(professionalElements.length).toBeGreaterThan(0);
  });

  it("should mention emergency or urgent care benefits", () => {
    render(<Testimonials />);

    const emergencyElements = screen.getAllByText(
      /emergency|urgent|critical|life.*saving/i
    );
    expect(emergencyElements.length).toBeGreaterThan(0);
  });

  it("should reference Gaza healthcare crisis", () => {
    render(<Testimonials />);

    const gazaElements = screen.getAllByText(
      /gaza|palestine|crisis|humanitarian/i
    );
    expect(gazaElements.length).toBeGreaterThan(0);
  });

  it("should emphasize trust and reliability", () => {
    render(<Testimonials />);

    const trustElements = screen.getAllByText(
      /trust|reliable|confident|professional/i
    );
    expect(trustElements.length).toBeGreaterThan(0);
  });

  it("should have proper semantic HTML structure", () => {
    render(<Testimonials />);

    const section = screen.getByRole("region");
    expect(section.getAttribute("aria-label")).toContain("testimonials");
  });

  it("should be mobile-responsive", () => {
    render(<Testimonials />);

    const container = screen.getByTestId("testimonials-container");
    expect(container.classList.contains("container-responsive")).toBe(true);
  });

  it("should include testimonial attribution with names", () => {
    render(<Testimonials />);

    const attributions = screen.getAllByTestId(/testimonial-\d+-author/);
    expect(attributions.length).toBeGreaterThanOrEqual(2);
  });

  it("should mention platform effectiveness", () => {
    render(<Testimonials />);

    const effectivenessElements = screen.getAllByText(
      /effective|helpful|valuable|impact/i
    );
    expect(effectivenessElements.length).toBeGreaterThan(0);
  });

  it("should highlight international collaboration", () => {
    render(<Testimonials />);

    const collaborationElements = screen.getAllByText(
      /collaboration|support|connect|bridge/i
    );
    expect(collaborationElements.length).toBeGreaterThan(0);
  });
});
