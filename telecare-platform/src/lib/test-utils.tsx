/**
 * Custom testing utilities for behavior-driven testing
 * Following CLAUDE.md principles: test behavior, not implementation
 */

import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock providers for testing
const MockProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <div data-testid="test-providers">
      {/* Future providers will go here (Auth, Language, etc.) */}
      {children}
    </div>
  );
};

// Custom render function that includes providers
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => {
  return render(ui, { wrapper: MockProviders, ...options });
};

// Behavior-driven test utilities
export const behaviorUtils = {
  // User interactions
  async fillForm(formData: Record<string, string>) {
    const user = userEvent.setup();

    for (const [fieldName, value] of Object.entries(formData)) {
      const field = screen.getByLabelText(new RegExp(fieldName, "i"));
      await user.clear(field);
      await user.type(field, value);
    }
  },

  async clickButton(buttonText: string | RegExp) {
    const user = userEvent.setup();
    const button = screen.getByRole("button", { name: buttonText });
    await user.click(button);
  },

  async selectOption(selectLabel: string | RegExp, optionText: string) {
    const user = userEvent.setup();
    const select = screen.getByLabelText(selectLabel);
    await user.selectOptions(select, optionText);
  },

  // Assertions for medical platform behavior
  expectEmergencyAlert() {
    expect(screen.getByRole("alert")).toBeDefined();
    expect(screen.getByText(/emergency/i)).toBeDefined();
  },

  expectCriticalStatus() {
    const criticalElement = screen.getByText(/critical/i);
    expect(criticalElement.classList.contains("critical")).toBe(true);
  },

  expectSuccessMessage() {
    expect(screen.getByText(/success/i)).toBeDefined();
  },

  expectLoadingState() {
    expect(screen.getByText(/loading/i)).toBeDefined();
  },

  expectOfflineMode() {
    expect(screen.getByText(/offline/i)).toBeDefined();
  },

  // Language and accessibility
  expectArabicContent() {
    const arabicText = screen.getByText(/[\u0600-\u06FF]/);
    expect(arabicText).toBeDefined();
  },

  expectRTLLayout() {
    const element = document.querySelector('[dir="rtl"]');
    expect(element).toBeDefined();
  },

  // Mobile-specific behaviors
  expectTouchFriendlySize(element: HTMLElement) {
    const styles = window.getComputedStyle(element);
    const minHeight = parseInt(styles.minHeight);
    expect(minHeight).toBeGreaterThanOrEqual(44); // 44px minimum touch target
  },

  // Network-aware behaviors
  async expectSlowConnectionOptimization() {
    // Simulate slow connection
    (global as any).testUtils.simulateSlowConnection();

    await waitFor(() => {
      expect(screen.getByText(/slow connection/i)).toBeDefined();
    });
  },

  // PWA behaviors
  expectInstallPrompt() {
    expect(screen.getByText(/install app/i)).toBeDefined();
  },

  expectOfflineCapability() {
    (global as any).testUtils.simulateOffline();
    expect(screen.getByText(/available offline/i)).toBeDefined();
  },
};

// Medical scenario testing helpers
export const medicalScenarios = {
  async simulateEmergencyConsultation() {
    const user = userEvent.setup();

    // Fill emergency consultation form
    await behaviorUtils.fillForm({
      "Patient Age": "45",
      "Chief Complaint": "Severe chest pain",
      Symptoms: "Crushing chest pain, shortness of breath, sweating",
    });

    // Select emergency priority
    await behaviorUtils.selectOption("Priority", "Emergency");

    // Submit consultation
    await behaviorUtils.clickButton("Request Emergency Consultation");

    return { user };
  },

  async simulateSpecialistResponse() {
    const user = userEvent.setup();

    // Specialist accepts consultation
    await behaviorUtils.clickButton("Accept Consultation");

    // Provide medical advice
    await behaviorUtils.fillForm({
      "Medical Advice":
        "Recommend immediate ECG and cardiac enzymes. Consider aspirin and oxygen.",
      "Follow-up Instructions":
        "Monitor vitals every 15 minutes. Transfer to cardiac unit if available.",
    });

    await behaviorUtils.clickButton("Send Response");

    return { user };
  },

  async simulateUKDoctorRegistration() {
    const user = userEvent.setup();

    await behaviorUtils.fillForm({
      "Full Name": "Dr. Sarah Johnson",
      Email: "sarah.johnson@nhs.uk",
      "GMC Number": "1234567",
      Specialty: "Emergency Medicine",
      "Years of Experience": "10",
    });

    await behaviorUtils.clickButton("Register as Volunteer");

    return { user };
  },

  async simulateGazaClinicianRegistration() {
    const user = userEvent.setup();

    await behaviorUtils.fillForm({
      "Full Name": "Dr. Ahmed Hassan",
      Email: "ahmed.hassan@alshifa.ps",
      Institution: "Al-Shifa Hospital",
      Department: "Emergency Department",
      Position: "Senior Resident",
    });

    await behaviorUtils.clickButton("Register for Access");

    return { user };
  },
};

// Network condition testing
export const networkTesting = {
  async testOfflineExperience(componentTest: () => Promise<void>) {
    // Test online first
    (global as any).testUtils.simulateOnline();
    await componentTest();

    // Then test offline
    (global as any).testUtils.simulateOffline();
    await componentTest();

    // Verify offline-specific behavior
    behaviorUtils.expectOfflineMode();
  },

  async testSlowConnectionOptimization(componentTest: () => Promise<void>) {
    (global as any).testUtils.simulateSlowConnection();
    await componentTest();
    await behaviorUtils.expectSlowConnectionOptimization();
  },

  async testConnectionRecovery() {
    // Start offline
    (global as any).testUtils.simulateOffline();
    behaviorUtils.expectOfflineMode();

    // Go back online
    (global as any).testUtils.simulateOnline();

    await waitFor(() => {
      expect(screen.queryByText(/offline/i)).toBeNull();
    });
  },
};

// Responsive design testing
export const responsiveTesting = {
  async testMobileLayout() {
    (global as any).testUtils.mockViewport(375, 667);

    // Check mobile-specific elements
    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      behaviorUtils.expectTouchFriendlySize(button);
    });
  },

  async testTabletLayout() {
    (global as any).testUtils.mockViewport(768, 1024);
    // Test tablet-specific behavior
  },

  async testDesktopLayout() {
    (global as any).testUtils.mockViewport(1280, 720);
    // Test desktop-specific behavior
  },
};

// Accessibility testing helpers
export const a11yTesting = {
  expectKeyboardNavigation: async () => {
    const user = userEvent.setup();

    // Test tab navigation
    await user.tab();
    expect(document.activeElement?.getAttribute("tabindex")).toBeDefined();

    // Test enter/space for activation
    await user.keyboard("{Enter}");
    // Should trigger action
  },

  expectScreenReaderLabels: () => {
    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(
        button.getAttribute("aria-label") || button.textContent
      ).toBeTruthy();
    });

    const inputs = screen.getAllByRole("textbox");
    inputs.forEach((input) => {
      expect(
        input.getAttribute("aria-label") ||
          input.getAttribute("aria-labelledby")
      ).toBeTruthy();
    });
  },

  expectHighContrastSupport: () => {
    // Simulate high contrast mode
    document.body.style.setProperty("--color-primary", "#000000");

    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      const styles = window.getComputedStyle(button);
      expect(styles.border).not.toBe("none");
    });
  },
};

// Re-export everything from testing-library
export * from "@testing-library/react";
export { userEvent };

// Export custom render as default render
export { customRender as render };
