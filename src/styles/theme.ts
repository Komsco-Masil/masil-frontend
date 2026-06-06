export const theme = {
  colors: {
    white: "#ffffff",
    black: "#111111",
    textPrimary: "#1a1a1a",
    textSecondary: "#6b6b6b",
    textMuted: "#9a9a9a",
    textSoft: "#c9c9c9",
    border: "#e8e8e8",
    borderLight: "#f0f0f0",
    coral: "#37C9A2",
    coralDark: "#e04f4f",
    brandGreen: "#a4d136",
    brandOrange: "#ff7f27",
    bannerNavy: "#143f8f",
    bannerViolet: "#7c436d",
    navInactive: "#8a8a8a",
    starGold: "#f5b942",
  },
  radii: {
    pill: "999px",
    card: "14px",
    button: "10px",
  },
  shadows: {
    card: "0 4px 20px rgba(0, 0, 0, 0.06)",
    header: "0 1px 0 rgba(0, 0, 0, 0.04)",
  },
  layout: {
    maxWidth: 375,
    headerHeight: 66,
    bottomNavHeight: 72,
  },
} as const;
