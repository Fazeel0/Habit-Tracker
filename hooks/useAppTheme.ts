import { useSelector } from "react-redux";

// Tailwind class string helpers for theming
export function useAppTheme() {
  const { isDarkMode } = useSelector((state: any) => state.theme);

  // Primary colors
  const primary = isDarkMode ? "bg-indigo-600" : "bg-indigo-500";
  const primaryText = isDarkMode ? "text-indigo-400" : "text-indigo-500";
  const primaryBorder = isDarkMode ? "border-indigo-600" : "border-indigo-500";

  // Secondary colors
  const secondary = isDarkMode ? "bg-purple-600" : "bg-purple-500";
  const secondaryText = isDarkMode ? "text-purple-400" : "text-purple-500";

  // Background colors
  const background = isDarkMode ? "bg-gray-900" : "bg-gray-100";
  const surface = isDarkMode ? "bg-gray-800" : "bg-white";

  // Text colors
  const text = isDarkMode ? "text-white" : "text-gray-800";
  const textSecondary = isDarkMode ? "text-gray-400" : "text-gray-500";

  // Border colors
  const border = isDarkMode ? "border-gray-700" : "border-gray-200";

  // Status colors
  const success = isDarkMode ? "text-emerald-400" : "text-emerald-500";
  const successBg = isDarkMode ? "bg-emerald-900/30" : "bg-emerald-100";
  const error = isDarkMode ? "text-red-400" : "text-red-500";
  const warning = isDarkMode ? "text-yellow-400" : "text-yellow-500";

  // Header specific
  const headerBg = isDarkMode ? "bg-indigo-600" : "bg-indigo-500";

  // Tab bar active color (always use darker indigo)
  const tabBarActiveBg = "#4f46e5"; // indigo-600

  // Active/Inactive button colors

  // Active/Inactive button colors
  const activeBg = isDarkMode ? "bg-indigo-600" : "bg-indigo-500";
  const inactiveBg = isDarkMode ? "bg-gray-600" : "bg-gray-400";

  return {
    isDarkMode,
    // Colors object for inline styles (hex values)
    colors: isDarkMode
      ? {
          primary: "#818cf8",
          secondary: "#a78bfa",
          background: "#111827",
          surface: "#1F2937",
          text: "#F9FAFB",
          textSecondary: "#9CA3AF",
          border: "#374151",
          success: "#34D399",
          error: "#F87171",
          warning: "#FBBF24",
          tabBarActiveBg: "#818cf8",
          tabBarActiveText: "#F9FAFB",
        }
      : {
          primary: "#667eea",
          secondary: "#764ba2",
          background: "#F3F4F6",
          surface: "#FFFFFF",
          text: "#1F2937",
          textSecondary: "#6B7280",
          border: "#E5E7EB",
          success: "#10B981",
          error: "#EF4444",
          warning: "#F59E0B",
          tabBarActiveBg: "#818cf8",
          tabBarActiveText: "#F9FAFB",
        },
    // Tailwind class strings
    classes: {
      primary,
      primaryText,
      primaryBorder,
      secondary,
      secondaryText,
      background,
      surface,
      text,
      textSecondary,
      border,
      success,
      successBg,
      error,
      warning,
      headerBg,
      tabBarActiveBg,
      activeBg,
      inactiveBg,
    },
  };
}
