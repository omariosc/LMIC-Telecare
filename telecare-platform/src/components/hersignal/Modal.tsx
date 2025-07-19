"use client";

import React, { useEffect, useRef, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ModalSize = "small" | "medium" | "large" | "fullscreen";
type ModalAnimation = "fade-in" | "slide-up" | "scale";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: ModalSize;
  animation?: ModalAnimation;
  header?: ReactNode;
  footer?: ReactNode;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscapePress?: boolean;
  className?: string;
};

const sizeClasses = {
  small: "w-full max-w-md",
  medium: "w-full max-w-2xl",
  large: "w-full max-w-4xl",
  fullscreen: "w-full h-full max-w-none",
} as const;

const animationVariants = {
  "fade-in": {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  "slide-up": {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
} as const;

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "medium",
  animation = "fade-in",
  header,
  footer,
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscapePress = true,
  className = "",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      // Save the previously focused element
      previousActiveElementRef.current = document.activeElement as HTMLElement;
      
      // Lock body scroll
      document.body.style.overflow = "hidden";
      
      // Focus the modal
      setTimeout(() => {
        if (modalRef.current) {
          const firstFocusableElement = modalRef.current.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) as HTMLElement;
          
          if (firstFocusableElement) {
            firstFocusableElement.focus();
          } else {
            modalRef.current.focus();
          }
        }
      }, 100);
    } else {
      // Restore body scroll
      document.body.style.overflow = "";
      
      // Restore focus to the previously focused element
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle escape key press
  useEffect(() => {
    if (!closeOnEscapePress) return;

    const handleEscapePress = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapePress);
    return () => document.removeEventListener("keydown", handleEscapePress);
  }, [isOpen, onClose, closeOnEscapePress]);

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (closeOnBackdropClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleModalContentClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          data-testid="modal-container"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            data-testid="modal-backdrop"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
          />

          {/* Modal Content */}
          <motion.div
            ref={modalRef}
            data-testid="modal-content"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
            tabIndex={-1}
            className={`
              relative z-10 card-glass shadow-2xl rounded-2xl overflow-hidden
              ${sizeClasses[size]}
              ${size === "fullscreen" ? "m-0 rounded-none" : "mx-auto"}
              ${animation === "fade-in" ? "animate-fade-in" : ""}
              ${animation === "slide-up" ? "animate-slide-up" : ""}
              ${className}
            `}
            variants={animationVariants[animation]}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ 
              duration: 0.3,
              ease: [0.4, 0.0, 0.2, 1]
            }}
            onClick={handleModalContentClick}
          >
            {/* Header */}
            {(header || title || showCloseButton) && (
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex-1">
                  {header || (
                    title && (
                      <h2 
                        id="modal-title" 
                        className="text-2xl font-bold text-gray-900"
                      >
                        {title}
                      </h2>
                    )
                  )}
                </div>
                
                {showCloseButton && (
                  <button
                    aria-label="Close modal"
                    className="ml-4 w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 hover-lift transition-all duration-200"
                    onClick={onClose}
                  >
                    <svg 
                      className="w-6 h-6" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M6 18L18 6M6 6l12 12" 
                      />
                    </svg>
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div className={`
              ${size === "fullscreen" ? "flex-1 overflow-auto" : ""}
              ${(!header && !title && !showCloseButton) ? "pt-6" : ""}
              px-6 py-6
            `}>
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Utility hook for modal management
export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = React.useState(initialState);

  const openModal = React.useCallback(() => setIsOpen(true), []);
  const closeModal = React.useCallback(() => setIsOpen(false), []);
  const toggleModal = React.useCallback(() => setIsOpen(prev => !prev), []);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
  };
};

// Pre-styled modal variants for common use cases
export const ConfirmationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "info",
}) => {
  const variantStyles = {
    danger: "btn-urgent",
    warning: "bg-medical-orange-600 hover:bg-medical-orange-700 text-white",
    info: "btn-primary",
  } as const;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const footer = (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 sm:justify-end">
      <button
        className="btn-outline order-2 sm:order-1"
        onClick={onClose}
      >
        {cancelText}
      </button>
      <button
        className={`${variantStyles[variant]} order-1 sm:order-2`}
        onClick={handleConfirm}
      >
        {confirmText}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="small"
      footer={footer}
    >
      <p className="text-gray-700 leading-relaxed">{message}</p>
    </Modal>
  );
};

// Loading modal variant
export const LoadingModal: React.FC<{
  isOpen: boolean;
  message?: string;
}> = ({
  isOpen,
  message = "Loading...",
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}} // Cannot be closed
      size="small"
      showCloseButton={false}
      closeOnBackdropClick={false}
      closeOnEscapePress={false}
    >
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-700 font-medium">{message}</p>
      </div>
    </Modal>
  );
};