// Import Jest DOM matchers
import "@testing-library/jest-dom";

// Fix for React 19 compatibility with React Testing Library
import { configure } from "@testing-library/react";

configure({
  // Disable act warnings for React 19
  reactStrictMode: false,
});

// Polyfill for TextEncoder/TextDecoder
import { TextEncoder, TextDecoder } from "util";
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return {
      get: jest.fn(),
    };
  },
  usePathname() {
    return "/";
  },
}));

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    const { src, alt, width, height, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} width={width} height={height} {...rest} />;
  },
}));

// Mock Next.js dynamic imports
jest.mock("next/dynamic", () => () => {
  const MockedComponent = (props) => <div {...props} />;
  MockedComponent.displayName = "MockedDynamicComponent";
  return MockedComponent;
});

// Mock PWA-specific APIs
Object.defineProperty(window, "navigator", {
  value: {
    ...window.navigator,
    onLine: true,
    serviceWorker: {
      register: jest.fn(() => Promise.resolve({})),
      getRegistration: jest.fn(() => Promise.resolve({})),
    },
    connection: {
      effectiveType: "4g",
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
  },
  writable: true,
});

// Mock matchMedia for responsive design tests
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver for lazy loading tests
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock geolocation for location-based features
Object.defineProperty(global.navigator, "geolocation", {
  value: {
    getCurrentPosition: jest.fn(),
    watchPosition: jest.fn(),
    clearWatch: jest.fn(),
  },
  writable: true,
});

// Mock localStorage and sessionStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

Object.defineProperty(window, "sessionStorage", {
  value: sessionStorageMock,
});

// Mock console methods for testing
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  // Suppress expected React warnings during testing
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("Warning: ReactDOM.render is deprecated") ||
        args[0].includes("Warning: componentWillReceiveProps"))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args) => {
    if (typeof args[0] === "string" && args[0].includes("deprecated")) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// Global test setup
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();

  // Reset localStorage and sessionStorage
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();

  sessionStorageMock.getItem.mockClear();
  sessionStorageMock.setItem.mockClear();
  sessionStorageMock.removeItem.mockClear();
  sessionStorageMock.clear.mockClear();

  // Reset navigator.onLine
  Object.defineProperty(navigator, "onLine", {
    writable: true,
    value: true,
  });
});

// Custom test utilities
global.testUtils = {
  // Mock fetch responses
  mockFetch: (responseData, status = 200) => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: status >= 200 && status < 300,
        status,
        json: () => Promise.resolve(responseData),
        text: () => Promise.resolve(JSON.stringify(responseData)),
      })
    );
  },

  // Simulate network conditions
  simulateOffline: () => {
    Object.defineProperty(navigator, "onLine", {
      writable: true,
      value: false,
    });
    window.dispatchEvent(new Event("offline"));
  },

  simulateOnline: () => {
    Object.defineProperty(navigator, "onLine", {
      writable: true,
      value: true,
    });
    window.dispatchEvent(new Event("online"));
  },

  // Simulate slow connection
  simulateSlowConnection: () => {
    Object.defineProperty(navigator, "connection", {
      value: {
        effectiveType: "slow-2g",
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      },
      writable: true,
    });
  },

  // Mock viewport dimensions
  mockViewport: (width, height) => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: width,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: height,
    });
    window.dispatchEvent(new Event("resize"));
  },
};
