/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Donation } from "./Donation";

describe("Donation Component", () => {
  it("should display main donation section heading", () => {
    render(<Donation />);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeDefined();
    expect(heading.textContent).toContain("Support");
  });

  it("should include blockade impact messaging", () => {
    render(<Donation />);

    const elements = screen.getAllByText(/blockade|restrict|limit|barrier/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  it("should emphasize humanitarian crisis urgency", () => {
    render(<Donation />);

    const elements = screen.getAllByText(/humanitarian.*crisis|emergency|urgent|critical/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  it("should mention Gaza healthcare specifically", () => {
    render(<Donation />);

    const elements = screen.getAllByText(/gaza.*healthcare|gaza.*medical|palestine/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  it("should have donation call-to-action buttons", () => {
    render(<Donation />);

    const donateButtons = screen.getAllByRole("button");
    const donationCTAs = donateButtons.filter(button => 
      /donate|support|contribute|fund/i.test(button.textContent || "")
    );
    expect(donationCTAs.length).toBeGreaterThanOrEqual(1);
  });

  it("should handle donation button clicks", async () => {
    const user = userEvent.setup();
    render(<Donation />);

    const donateButton = screen.getByRole("button", { name: /donate|support/i });
    
    // Should not throw error when clicked
    await user.click(donateButton);
    expect(true).toBe(true); // Placeholder - will be replaced with actual functionality
  });

  it("should explain how donations help", () => {
    render(<Donation />);

    const elements = screen.getAllByText(/help|enable|provide|support.*medical/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  it("should mention platform sustainability", () => {
    render(<Donation />);

    const elements = screen.getAllByText(/sustain|maintain|operate|fund.*platform/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  it("should have proper semantic HTML structure", () => {
    render(<Donation />);

    const section = screen.getByRole("region");
    expect(section.getAttribute("aria-label")).toContain("donation");
  });

  it("should be mobile-responsive", () => {
    render(<Donation />);

    const container = screen.getByTestId("donation-container");
    expect(container.classList.contains("container-responsive")).toBe(true);
  });

  it("should emphasize transparency and trust", () => {
    render(<Donation />);

    const elements = screen.getAllByText(/transparent|trust|secure|safe/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  it("should mention impact of contributions", () => {
    render(<Donation />);

    expect(screen.getByText(/impact|difference|save.*lives|help.*patients/i)).toBeDefined();
  });
});