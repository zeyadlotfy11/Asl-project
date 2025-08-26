import { describe, it, expect } from "vitest";

// Helper functions to test (these would be imported from actual utility files)
const formatDate = (timestamp: bigint | number): string => {
  const date = new Date(
    typeof timestamp === "bigint" ? Number(timestamp) / 1000000 : timestamp
  );
  return date.toLocaleDateString();
};

const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .trim();
};

const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

describe("Utility Functions", () => {
  describe("formatDate", () => {
    it("formats bigint timestamp correctly", () => {
      const timestamp = BigInt(1693440000000000000); // Example timestamp in nanoseconds
      const formatted = formatDate(timestamp);

      expect(formatted).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/); // MM/DD/YYYY or similar format
    });

    it("formats number timestamp correctly", () => {
      const timestamp = 1693440000000; // Example timestamp in milliseconds
      const formatted = formatDate(timestamp);

      expect(formatted).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
    });

    it("handles invalid timestamps gracefully", () => {
      const formatted = formatDate(0);
      expect(formatted).toBeTruthy();
    });
  });

  describe("truncateText", () => {
    it("truncates long text correctly", () => {
      const longText = "This is a very long text that should be truncated";
      const truncated = truncateText(longText, 20);

      expect(truncated).toBe("This is a very lo...");
      expect(truncated.length).toBe(20);
    });

    it("returns original text if shorter than max length", () => {
      const shortText = "Short text";
      const result = truncateText(shortText, 20);

      expect(result).toBe(shortText);
    });

    it("handles empty string", () => {
      const result = truncateText("", 10);
      expect(result).toBe("");
    });

    it("handles edge case where text length equals max length", () => {
      const text = "exactly twenty chars";
      const result = truncateText(text, 20);

      expect(result).toBe(text);
    });
  });

  describe("validateEmail", () => {
    it("validates correct email addresses", () => {
      expect(validateEmail("user@example.com")).toBe(true);
      expect(validateEmail("test.email+tag@domain.co.uk")).toBe(true);
      expect(validateEmail("user123@subdomain.example.org")).toBe(true);
    });

    it("rejects invalid email addresses", () => {
      expect(validateEmail("invalid-email")).toBe(false);
      expect(validateEmail("user@")).toBe(false);
      expect(validateEmail("@domain.com")).toBe(false);
      expect(validateEmail("user@@domain.com")).toBe(false);
      expect(validateEmail("")).toBe(false);
    });
  });

  describe("formatNumber", () => {
    it("formats large numbers with M suffix", () => {
      expect(formatNumber(1500000)).toBe("1.5M");
      expect(formatNumber(2000000)).toBe("2.0M");
    });

    it("formats thousands with K suffix", () => {
      expect(formatNumber(1500)).toBe("1.5K");
      expect(formatNumber(2000)).toBe("2.0K");
    });

    it("returns small numbers as is", () => {
      expect(formatNumber(999)).toBe("999");
      expect(formatNumber(42)).toBe("42");
      expect(formatNumber(0)).toBe("0");
    });
  });

  describe("generateId", () => {
    it("generates unique IDs", () => {
      const id1 = generateId();
      const id2 = generateId();

      expect(id1).not.toBe(id2);
      expect(id1.length).toBeGreaterThan(10);
      expect(id2.length).toBeGreaterThan(10);
    });

    it("generates alphanumeric IDs", () => {
      const id = generateId();
      expect(id).toMatch(/^[a-z0-9]+$/);
    });
  });

  describe("sanitizeInput", () => {
    it("removes dangerous HTML tags", () => {
      const input = '<script>alert("xss")</script>Hello';
      const sanitized = sanitizeInput(input);

      expect(sanitized).not.toContain("<");
      expect(sanitized).not.toContain(">");
      expect(sanitized).toContain("Hello");
    });

    it("removes javascript: protocols", () => {
      const input = 'javascript:alert("xss")';
      const sanitized = sanitizeInput(input);

      expect(sanitized).not.toContain("javascript:");
    });

    it("trims whitespace", () => {
      const input = "  Hello World  ";
      const sanitized = sanitizeInput(input);

      expect(sanitized).toBe("Hello World");
    });

    it("handles empty input", () => {
      const sanitized = sanitizeInput("");
      expect(sanitized).toBe("");
    });
  });

  describe("calculatePercentage", () => {
    it("calculates percentage correctly", () => {
      expect(calculatePercentage(25, 100)).toBe(25);
      expect(calculatePercentage(3, 4)).toBe(75);
      expect(calculatePercentage(1, 3)).toBe(33);
    });

    it("handles zero total", () => {
      expect(calculatePercentage(5, 0)).toBe(0);
    });

    it("handles zero value", () => {
      expect(calculatePercentage(0, 100)).toBe(0);
    });

    it("rounds to nearest integer", () => {
      expect(calculatePercentage(1, 6)).toBe(17); // 16.666... rounded to 17
    });
  });

  describe("debounce", () => {
    it("delays function execution", async () => {
      let callCount = 0;
      const mockFn = () => {
        callCount++;
      };
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(callCount).toBe(0);

      await new Promise((resolve) => setTimeout(resolve, 150));

      expect(callCount).toBe(1);
    });

    it("cancels previous calls", async () => {
      let callCount = 0;
      const mockFn = () => {
        callCount++;
      };
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      setTimeout(() => debouncedFn(), 50); // This should cancel the first call

      await new Promise((resolve) => setTimeout(resolve, 200));

      expect(callCount).toBe(1);
    });
  });
});
