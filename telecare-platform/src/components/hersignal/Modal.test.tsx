import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Modal } from "./Modal";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

describe("Modal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    title: "Test Modal",
    children: <div>Modal content</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Component Structure", () => {
    it("should render modal when open", () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByTestId("modal-container")).toBeInTheDocument();
    });

    it("should not render modal when closed", () => {
      render(<Modal {...defaultProps} isOpen={false} />);
      expect(screen.queryByTestId("modal-container")).not.toBeInTheDocument();
    });

    it("should display modal title", () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByText("Test Modal")).toBeInTheDocument();
    });

    it("should render modal content", () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByText("Modal content")).toBeInTheDocument();
    });

    it("should show close button", () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByLabelText(/close modal/i)).toBeInTheDocument();
    });
  });

  describe("Modal Functionality", () => {
    it("should call onClose when close button is clicked", () => {
      const onClose = jest.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);
      
      const closeButton = screen.getByLabelText(/close modal/i);
      fireEvent.click(closeButton);
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("should call onClose when backdrop is clicked", () => {
      const onClose = jest.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);
      
      const backdrop = screen.getByTestId("modal-backdrop");
      fireEvent.click(backdrop);
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("should not close when modal content is clicked", () => {
      const onClose = jest.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);
      
      const modalContent = screen.getByTestId("modal-content");
      fireEvent.click(modalContent);
      
      expect(onClose).not.toHaveBeenCalled();
    });

    it("should close on Escape key press", () => {
      const onClose = jest.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);
      
      fireEvent.keyDown(document, { key: "Escape", keyCode: 27 });
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("should not close on other key presses", () => {
      const onClose = jest.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);
      
      fireEvent.keyDown(document, { key: "Enter", keyCode: 13 });
      
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe("Modal Variants", () => {
    it("should render small modal variant", () => {
      render(<Modal {...defaultProps} size="small" />);
      const modalContent = screen.getByTestId("modal-content");
      expect(modalContent).toHaveClass("max-w-md");
    });

    it("should render medium modal variant (default)", () => {
      render(<Modal {...defaultProps} />);
      const modalContent = screen.getByTestId("modal-content");
      expect(modalContent).toHaveClass("max-w-2xl");
    });

    it("should render large modal variant", () => {
      render(<Modal {...defaultProps} size="large" />);
      const modalContent = screen.getByTestId("modal-content");
      expect(modalContent).toHaveClass("max-w-4xl");
    });

    it("should render fullscreen modal variant", () => {
      render(<Modal {...defaultProps} size="fullscreen" />);
      const modalContent = screen.getByTestId("modal-content");
      expect(modalContent).toHaveClass("w-full", "h-full");
    });
  });

  describe("Professional Styling", () => {
    it("should apply backdrop blur styling", () => {
      render(<Modal {...defaultProps} />);
      const backdrop = screen.getByTestId("modal-backdrop");
      expect(backdrop).toHaveClass("backdrop-blur-sm");
    });

    it("should have glass effect on modal content", () => {
      render(<Modal {...defaultProps} />);
      const modalContent = screen.getByTestId("modal-content");
      expect(modalContent).toHaveClass("card-glass");
    });

    it("should have animated appearance", () => {
      render(<Modal {...defaultProps} />);
      const modalContent = screen.getByTestId("modal-content");
      expect(modalContent).toHaveClass("animate-fade-in");
    });

    it("should have hover effects on close button", () => {
      render(<Modal {...defaultProps} />);
      const closeButton = screen.getByLabelText(/close modal/i);
      expect(closeButton).toHaveClass("hover-lift");
    });
  });

  describe("Header and Footer", () => {
    it("should render custom header", () => {
      const customHeader = <div data-testid="custom-header">Custom Header</div>;
      render(<Modal {...defaultProps} header={customHeader} />);
      expect(screen.getByTestId("custom-header")).toBeInTheDocument();
    });

    it("should render custom footer", () => {
      const customFooter = <div data-testid="custom-footer">Custom Footer</div>;
      render(<Modal {...defaultProps} footer={customFooter} />);
      expect(screen.getByTestId("custom-footer")).toBeInTheDocument();
    });

    it("should hide close button when specified", () => {
      render(<Modal {...defaultProps} showCloseButton={false} />);
      expect(screen.queryByLabelText(/close modal/i)).not.toBeInTheDocument();
    });

    it("should allow disabling backdrop click to close", () => {
      const onClose = jest.fn();
      render(<Modal {...defaultProps} onClose={onClose} closeOnBackdropClick={false} />);
      
      const backdrop = screen.getByTestId("modal-backdrop");
      fireEvent.click(backdrop);
      
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA attributes", () => {
      render(<Modal {...defaultProps} />);
      const modal = screen.getByTestId("modal-content");
      expect(modal).toHaveAttribute("role", "dialog");
      expect(modal).toHaveAttribute("aria-modal", "true");
      expect(modal).toHaveAttribute("aria-labelledby");
    });

    it("should have descriptive aria-label for close button", () => {
      render(<Modal {...defaultProps} />);
      const closeButton = screen.getByLabelText(/close modal/i);
      expect(closeButton).toHaveAttribute("aria-label", "Close modal");
    });

    it("should focus trap within modal", async () => {
      render(<Modal {...defaultProps} />);
      const closeButton = screen.getByLabelText(/close modal/i);
      
      // Wait for the focus to be applied
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 150));
      });
      
      // Modal should focus the first focusable element
      expect(closeButton).toHaveFocus();
    });

    it("should restore focus when modal closes", async () => {
      const { rerender } = render(<Modal {...defaultProps} />);
      
      // Close the modal
      rerender(<Modal {...defaultProps} isOpen={false} />);
      
      // Focus should be restored to the previously focused element
      expect(document.body).toHaveFocus();
    });
  });

  describe("Body Scroll Lock", () => {
    it("should prevent body scroll when modal is open", () => {
      render(<Modal {...defaultProps} />);
      expect(document.body.style.overflow).toBe("hidden");
    });

    it("should restore body scroll when modal closes", () => {
      const { rerender } = render(<Modal {...defaultProps} />);
      
      // Close the modal
      rerender(<Modal {...defaultProps} isOpen={false} />);
      
      expect(document.body.style.overflow).toBe("");
    });
  });

  describe("Responsive Design", () => {
    it("should apply responsive padding on mobile", () => {
      render(<Modal {...defaultProps} />);
      const container = screen.getByTestId("modal-container");
      expect(container).toHaveClass("p-4", "sm:p-6", "md:p-8");
    });

    it("should have mobile-optimized sizing", () => {
      render(<Modal {...defaultProps} size="small" />);
      const modalContent = screen.getByTestId("modal-content");
      expect(modalContent).toHaveClass("w-full", "max-w-md");
    });

    it("should stack footer buttons on mobile", () => {
      const footer = (
        <div className="flex flex-col sm:flex-row gap-2">
          <button>Cancel</button>
          <button>Confirm</button>
        </div>
      );
      render(<Modal {...defaultProps} footer={footer} />);
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });
  });

  describe("Animation Integration", () => {
    it("should apply entrance animations", () => {
      render(<Modal {...defaultProps} />);
      const modalContent = screen.getByTestId("modal-content");
      expect(modalContent).toHaveClass("animate-fade-in");
    });

    it("should support custom animations", () => {
      render(<Modal {...defaultProps} animation="slide-up" />);
      const modalContent = screen.getByTestId("modal-content");
      expect(modalContent).toHaveClass("animate-slide-up");
    });

    it("should have smooth transitions", () => {
      render(<Modal {...defaultProps} />);
      const backdrop = screen.getByTestId("modal-backdrop");
      expect(backdrop).toHaveClass("transition-all", "duration-300");
    });
  });
});