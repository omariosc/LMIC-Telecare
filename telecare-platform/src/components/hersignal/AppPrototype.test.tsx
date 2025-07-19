import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AppPrototype } from "./AppPrototype";

// Mock intersection observer for carousel functionality
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

describe("AppPrototype", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Component Structure", () => {
    it("should render the app prototype container", () => {
      render(<AppPrototype />);
      expect(screen.getByTestId("app-prototype-container")).toBeInTheDocument();
    });

    it("should display the section title", () => {
      render(<AppPrototype />);
      expect(screen.getByText(/app prototype/i)).toBeInTheDocument();
    });

    it("should show carousel navigation controls", () => {
      render(<AppPrototype />);
      expect(screen.getByLabelText(/previous prototype/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/next prototype/i)).toBeInTheDocument();
    });
  });

  describe("Carousel Functionality", () => {
    it("should display multiple prototype images", () => {
      render(<AppPrototype />);
      const images = screen.getAllByTestId(/prototype-image-/);
      expect(images.length).toBeGreaterThan(1);
    });

    it("should navigate to next prototype when next button is clicked", async () => {
      render(<AppPrototype />);
      const nextButton = screen.getByLabelText(/next prototype/i);
      
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByTestId("prototype-carousel")).toHaveAttribute("data-current", "1");
      });
    });

    it("should navigate to previous prototype when previous button is clicked", async () => {
      render(<AppPrototype />);
      const nextButton = screen.getByLabelText(/next prototype/i);
      const prevButton = screen.getByLabelText(/previous prototype/i);
      
      // Go to next first
      fireEvent.click(nextButton);
      await waitFor(() => {
        expect(screen.getByTestId("prototype-carousel")).toHaveAttribute("data-current", "1");
      });
      
      // Then go back
      fireEvent.click(prevButton);
      await waitFor(() => {
        expect(screen.getByTestId("prototype-carousel")).toHaveAttribute("data-current", "0");
      });
    });

    it("should show dot indicators for navigation", () => {
      render(<AppPrototype />);
      const dotIndicators = screen.getAllByTestId(/carousel-dot-/);
      expect(dotIndicators.length).toBeGreaterThan(1);
    });

    it("should navigate when dot indicator is clicked", async () => {
      render(<AppPrototype />);
      const secondDot = screen.getByTestId("carousel-dot-1");
      
      fireEvent.click(secondDot);
      
      await waitFor(() => {
        expect(screen.getByTestId("prototype-carousel")).toHaveAttribute("data-current", "1");
      });
    });
  });

  describe("Image Preloading", () => {
    it("should preload images for better performance", () => {
      render(<AppPrototype />);
      const images = screen.getAllByTestId(/prototype-image-/);
      
      images.forEach((image) => {
        expect(image).toHaveAttribute("loading", "lazy");
      });
    });

    it("should show loading placeholder while images load", () => {
      render(<AppPrototype />);
      const skeletons = screen.getAllByTestId(/image-skeleton-/);
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe("Professional Styling", () => {
    it("should apply glass effect styling", () => {
      render(<AppPrototype />);
      const carousel = screen.getByTestId("prototype-carousel");
      expect(carousel.parentElement).toHaveClass("card-glass");
    });

    it("should have hover effects on carousel controls", () => {
      render(<AppPrototype />);
      const nextButton = screen.getByLabelText(/next prototype/i);
      expect(nextButton).toHaveClass("hover-lift");
    });

    it("should display with proper responsive layout", () => {
      render(<AppPrototype />);
      const container = screen.getByTestId("app-prototype-container");
      // Check that responsive container class is applied
      expect(container).toHaveClass("container-responsive");
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels for navigation", () => {
      render(<AppPrototype />);
      expect(screen.getByLabelText(/previous prototype/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/next prototype/i)).toBeInTheDocument();
    });

    it("should have descriptive alt text for images", () => {
      render(<AppPrototype />);
      const images = screen.getAllByTestId(/prototype-image-/);
      
      images.forEach((image) => {
        expect(image).toHaveAttribute("alt");
        expect(image.getAttribute("alt")).not.toBe("");
      });
    });

    it("should support keyboard navigation", () => {
      render(<AppPrototype />);
      const nextButton = screen.getByLabelText(/next prototype/i);
      
      nextButton.focus();
      expect(nextButton).toHaveFocus();
    });
  });

  describe("Performance Features", () => {
    it("should lazy load images", () => {
      render(<AppPrototype />);
      const images = screen.getAllByTestId(/prototype-image-/);
      
      images.forEach((image) => {
        expect(image).toHaveAttribute("loading", "lazy");
      });
    });

    it("should show loading states", () => {
      render(<AppPrototype />);
      const skeletons = screen.getAllByTestId(/image-skeleton-/);
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });
});