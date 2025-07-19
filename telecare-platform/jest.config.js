const nextJest = require("next/jest");

// Providing the path to your Next.js app which will enable loading next.config.js and .env files
const createJestConfig = nextJest({ dir: "./" });

// Custom Jest configuration
const customJestConfig = {
  // Setup files to run before each test
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  // Test environment for DOM testing
  testEnvironment: "jsdom",

  // Module name mapping for path aliases
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@/components/(.*)$": "<rootDir>/src/components/$1",
    "^@/hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "^@/lib/(.*)$": "<rootDir>/src/lib/$1",
    "^@/types/(.*)$": "<rootDir>/src/types/$1",
    "^@/styles/(.*)$": "<rootDir>/src/styles/$1",
  },

  // Test match patterns
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
    "<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}",
    "<rootDir>/tests/**/*.{test,spec}.{js,jsx,ts,tsx}",
  ],

  // Coverage configuration
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.stories.{js,jsx,ts,tsx}",
    "!src/app/**/layout.tsx",
    "!src/app/**/loading.tsx",
    "!src/app/**/not-found.tsx",
    "!src/app/**/error.tsx",
    "!src/middleware.ts",
  ],

  // Coverage thresholds (100% as per CLAUDE.md requirements)
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },

  // Coverage reporters
  coverageReporters: ["text", "lcov", "html"],

  // Ignore patterns
  testPathIgnorePatterns: [
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
    "<rootDir>/build/",
    "<rootDir>/dist/",
  ],

  // Transform ignore patterns
  transformIgnorePatterns: ["/node_modules/(?!(next-pwa)/)"],

  // Global setup/teardown
  globalSetup: undefined,
  globalTeardown: undefined,

  // Verbose output for better debugging
  verbose: true,

  // Automatically clear mock calls and instances
  clearMocks: true,

  // Restore mocks after each test
  restoreMocks: true,

  // Maximum number of concurrent workers
  maxWorkers: "50%",

  // Test timeout (30 seconds)
  testTimeout: 30000,
};

// Export the Jest configuration
module.exports = createJestConfig(customJestConfig);
