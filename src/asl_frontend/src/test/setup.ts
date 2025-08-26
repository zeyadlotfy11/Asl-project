import "@testing-library/jest-dom";
import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Mock IC agent for tests
vi.mock("@dfinity/agent", () => ({
  HttpAgent: vi.fn().mockImplementation(() => ({
    fetchRootKey: vi.fn().mockResolvedValue(undefined),
  })),
  Actor: {
    createActor: vi.fn().mockReturnValue({
      get_platform_stats: vi.fn().mockResolvedValue({
        total_artifacts: 0,
        total_users: 0,
        total_communities: 0,
        total_proposals: 0,
      }),
      get_user_profile: vi.fn().mockResolvedValue(null),
      get_artifacts: vi.fn().mockResolvedValue([]),
      get_communities: vi.fn().mockResolvedValue([]),
    }),
  },
}));

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: "div",
    section: "section",
    header: "header",
    main: "main",
    article: "article",
    aside: "aside",
    nav: "nav",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    p: "p",
    span: "span",
    button: "button",
    img: "img",
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  useAnimation: () => ({
    start: vi.fn(),
    stop: vi.fn(),
    set: vi.fn(),
  }),
  useInView: () => true,
}));

// Runs a cleanup after each test case
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
