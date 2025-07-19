import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AppDownload } from "./AppDownload";

describe("AppDownload", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Component Structure", () => {
    it("should render the download buttons container", () => {
      render(<AppDownload />);
      expect(
        screen.getByTestId("download-buttons-container")
      ).toBeInTheDocument();
    });

    it("should display the section title", () => {
      render(<AppDownload />);
      expect(
        screen.getByRole("heading", { level: 2, name: "Download Our App" })
      ).toBeInTheDocument();
    });

    it("should show App Store button", () => {
      render(<AppDownload />);
      expect(
        screen.getByLabelText(/download on app store/i)
      ).toBeInTheDocument();
    });

    it("should show Google Play Store button", () => {
      render(<AppDownload />);
      expect(
        screen.getByLabelText(/get it on google play/i)
      ).toBeInTheDocument();
    });
  });

  describe("Button Functionality", () => {
    it("should handle App Store button click", () => {
      const mockOpen = jest.fn();
      global.open = mockOpen;

      render(<AppDownload />);
      const appStoreButton = screen.getByLabelText(/download on app store/i);

      fireEvent.click(appStoreButton);

      expect(mockOpen).toHaveBeenCalledWith(
        expect.stringContaining("apps.apple.com"),
        "_blank"
      );
    });

    it("should handle Google Play Store button click", () => {
      const mockOpen = jest.fn();
      global.open = mockOpen;

      render(<AppDownload />);
      const playStoreButton = screen.getByLabelText(/get it on google play/i);

      fireEvent.click(playStoreButton);

      expect(mockOpen).toHaveBeenCalledWith(
        expect.stringContaining("play.google.com"),
        "_blank"
      );
    });

    it("should show download statistics", () => {
      render(<AppDownload />);
      expect(screen.getByTestId("download-stats")).toBeInTheDocument();
    });

    it("should display app ratings", () => {
      render(<AppDownload />);
      expect(screen.getByText(/★/)).toBeInTheDocument();
    });
  });

  describe("App Information", () => {
    it("should display app version information", () => {
      render(<AppDownload />);
      expect(screen.getByText(/version/i)).toBeInTheDocument();
    });

    it("should show compatibility information", () => {
      render(<AppDownload />);
      expect(screen.getByText("iOS 14.0+")).toBeInTheDocument();
      expect(screen.getByText("Android 8.0+")).toBeInTheDocument();
    });

    it("should display app size information", () => {
      render(<AppDownload />);
      expect(screen.getByText(/mb/i)).toBeInTheDocument();
    });

    it("should show last updated date", () => {
      render(<AppDownload />);
      expect(screen.getByText(/updated/i)).toBeInTheDocument();
    });
  });

  describe("Professional Styling", () => {
    it("should apply glass effect styling", () => {
      render(<AppDownload />);
      const container = screen.getByTestId("download-buttons-container");
      expect(container.querySelector(".card-glass")).toBeInTheDocument();
    });

    it("should have hover effects on download buttons", () => {
      render(<AppDownload />);
      const appStoreButton = screen.getByLabelText(/download on app store/i);
      expect(appStoreButton).toHaveClass("hover-lift");
    });

    it("should display with professional gradient backgrounds", () => {
      render(<AppDownload />);
      const appStoreButton = screen.getByLabelText(/download on app store/i);
      expect(appStoreButton).toHaveClass("bg-gradient-to-r");
    });

    it("should have animated appearance", () => {
      render(<AppDownload />);
      const container = screen.getByTestId("download-buttons-container");
      expect(container.querySelector(".animate-fade-in")).toBeInTheDocument();
    });
  });

  describe("QR Code Feature", () => {
    it("should display QR code for mobile downloads", () => {
      render(<AppDownload />);
      expect(screen.getByTestId("qr-code-section")).toBeInTheDocument();
    });

    it("should show QR code instructions", () => {
      render(<AppDownload />);
      expect(screen.getByText(/scan with your phone/i)).toBeInTheDocument();
    });

    it("should have QR code placeholder", () => {
      render(<AppDownload />);
      expect(screen.getByTestId("qr-code-placeholder")).toBeInTheDocument();
    });
  });

  describe("Responsive Design", () => {
    it("should apply responsive container classes", () => {
      render(<AppDownload />);
      const container = screen.getByTestId("download-buttons-container");
      expect(container).toHaveClass("container-responsive");
    });

    it("should have responsive button layout", () => {
      render(<AppDownload />);
      const buttonsGrid = screen.getByTestId("download-buttons-grid");
      expect(buttonsGrid).toHaveClass("flex", "flex-col", "sm:flex-row");
    });

    it("should stack buttons vertically on mobile", () => {
      render(<AppDownload />);
      const buttonsGrid = screen.getByTestId("download-buttons-grid");
      expect(buttonsGrid).toHaveClass("gap-4");
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels for download buttons", () => {
      render(<AppDownload />);
      expect(
        screen.getByLabelText(/download on app store/i)
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(/get it on google play/i)
      ).toBeInTheDocument();
    });

    it("should have descriptive alt text for store badges", () => {
      render(<AppDownload />);
      const appStoreButton = screen.getByLabelText(/download on app store/i);
      const playStoreButton = screen.getByLabelText(/get it on google play/i);

      expect(appStoreButton).toHaveAttribute("role", "button");
      expect(playStoreButton).toHaveAttribute("role", "button");
    });

    it("should support keyboard navigation", () => {
      render(<AppDownload />);
      const appStoreButton = screen.getByLabelText(/download on app store/i);

      appStoreButton.focus();
      expect(appStoreButton).toHaveFocus();
    });

    it("should have proper heading structure", () => {
      render(<AppDownload />);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
    });
  });

  describe("Analytics Tracking", () => {
    it("should track App Store download clicks", () => {
      const mockTrack = jest.fn();
      global.gtag = mockTrack;

      render(<AppDownload />);
      const appStoreButton = screen.getByLabelText(/download on app store/i);

      fireEvent.click(appStoreButton);

      expect(mockTrack).toHaveBeenCalledWith("event", "download_click", {
        platform: "ios",
        store: "app_store",
      });
    });

    it("should track Google Play Store download clicks", () => {
      const mockTrack = jest.fn();
      global.gtag = mockTrack;

      render(<AppDownload />);
      const playStoreButton = screen.getByLabelText(/get it on google play/i);

      fireEvent.click(playStoreButton);

      expect(mockTrack).toHaveBeenCalledWith("event", "download_click", {
        platform: "android",
        store: "google_play",
      });
    });
  });

  describe("Platform Detection", () => {
    it("should highlight appropriate button based on user platform", () => {
      // Mock iOS user agent
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
        configurable: true,
      });

      render(<AppDownload />);
      const appStoreButton = screen.getByLabelText(/download on app store/i);
      expect(appStoreButton).toHaveClass("ring-2", "ring-medical-blue-500");
    });

    it("should show platform-specific messaging", () => {
      render(<AppDownload />);
      expect(screen.getByTestId("platform-message")).toBeInTheDocument();
    });
  });
});
