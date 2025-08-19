import { useTheme } from "../contexts/ThemeContext";

export const useThemeClass = () => {
  const { theme } = useTheme();

  const getThemeClass = (lightClass: string, darkClass: string = "") => {
    if (!darkClass) {
      return `${lightClass} dark:${lightClass.replace(
        /^bg-|text-|border-/,
        "dark:"
      )}`;
    }
    return theme === "light" ? lightClass : darkClass;
  };

  const isDark = theme === "dark";
  const isLight = theme === "light";

  return {
    theme,
    isDark,
    isLight,
    getThemeClass,
  };
};
