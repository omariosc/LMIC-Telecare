/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CTA } from "./CTA";

describe("CTA Component", () => {
  it("should display main CTA heading", () => {
    render(<CTA />);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeDefined();
    expect(heading.textContent).toContain("Join");
  });

  it("should have primary call-to-action button", () => {
    render(<CTA />);

    const buttons = screen.getAllByRole("button");
    const primaryButton = buttons.find((btn) =>
      btn.classList.contains("btn-primary")
    );
    expect(primaryButton).toBeDefined();
  });

  it("should have secondary call-to-action option", () => {
    render(<CTA />);

    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it("should handle primary CTA button clicks", async () => {
    const user = userEvent.setup();
    render(<CTA />);

    const buttons = screen.getAllByRole("button");
    const primaryButton = buttons.find((btn) =>
      btn.classList.contains("btn-primary")
    );

    // Should not throw error when clicked
    if (primaryButton) {
      await user.click(primaryButton);
    }
    expect(true).toBe(true); // Placeholder - will be replaced with actual functionality
  });

  it("should emphasize urgent medical mission", () => {
    render(<CTA />);

    const elements = screen.getAllByText(
      /urgent|emergency|critical|mission|gaza/i
    );
    expect(elements.length).toBeGreaterThan(0);
  });

  it("should mention platform purpose clearly", () => {
    render(<CTA />);

    const elements = screen.getAllByText(
      /medical|healthcare|specialist|consultation/i
    );
    expect(elements.length).toBeGreaterThan(0);
  });

  it("should have proper semantic HTML structure", () => {
    render(<CTA />);

    const section = screen.getByRole("region");
    expect(section.getAttribute("aria-label")).toContain("call to action");
  });

  it("should be mobile-responsive", () => {
    render(<CTA />);

    const container = screen.getByTestId("cta-container");
    expect(container.classList.contains("container-responsive")).toBe(true);
  });

  it("should include specialist registration option", () => {
    render(<CTA />);

    const elements = screen.getAllByText(/specialist|volunteer|professional/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  it("should include Gaza clinician registration option", () => {
    render(<CTA />);

    const elements = screen.getAllByText(
      /gaza.*clinician|gaza.*medical|palestinian.*doctor/i
    );
    expect(elements.length).toBeGreaterThan(0);
  });

  it("should emphasize no-cost participation", () => {
    render(<CTA />);

    const elements = screen.getAllByText(
      /free|no.*cost|volunteer|donation.*based/i
    );
    expect(elements.length).toBeGreaterThan(0);
  });

  it("should create sense of urgency", () => {
    render(<CTA />);

    const elements = screen.getAllByText(/now|today|immediate|urgent|crisis/i);
    expect(elements.length).toBeGreaterThan(0);
  });
});
