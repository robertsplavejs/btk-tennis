export type MatchCardThemeName =
  | "classic"
  | "dark"
  | "clay"
  | "grass"
  | "hard"
  | "night";

export type MatchCardTheme = {
  background: string;
  surface: string;

  primaryText: string;
  secondaryText: string;

  accent: string;
  accentText: string;

  border: string;

  winnerBackground: string;
  winnerText: string;

  loserBackground: string;
  loserText: string;

  gradientFrom: string;
  gradientTo: string;
};

const themes: Record<
  MatchCardThemeName,
  MatchCardTheme
> = {
  classic: {
    background: "#ffffff",
    surface: "#f7f7f7",

    primaryText: "#111111",
    secondaryText: "#707070",

    accent: "#111111",
    accentText: "#ffffff",

    border: "#e5e5e5",

    winnerBackground: "#DCFCE7",
    winnerText: "#166534",

    loserBackground: "#F5F5F5",
    loserText: "#737373",

    gradientFrom: "#ffffff",
    gradientTo: "#f4f4f4",
  },

  dark: {
    background: "#111111",
    surface: "#1d1d1d",

    primaryText: "#ffffff",
    secondaryText: "#d4d4d4",

    accent: "#ffffff",
    accentText: "#111111",

    border: "#303030",

    winnerBackground: "#14532D",
    winnerText: "#BBF7D0",

    loserBackground: "#262626",
    loserText: "#D4D4D4",

    gradientFrom: "#1c1c1c",
    gradientTo: "#080808",
  },

  clay: {
    background: "#FDF7F2",
    surface: "#FFF5EE",

    primaryText: "#3B1D12",
    secondaryText: "#875F4A",

    accent: "#C96A2B",
    accentText: "#ffffff",

    border: "#E8C8B0",

    winnerBackground: "#FFE5CF",
    winnerText: "#8A3B12",

    loserBackground: "#F7ECE6",
    loserText: "#76584A",

    gradientFrom: "#FFF7F2",
    gradientTo: "#F2D2BE",
  },

  grass: {
    background: "#F8FFF8",
    surface: "#F1FAF1",

    primaryText: "#12351B",
    secondaryText: "#487457",

    accent: "#237A37",
    accentText: "#ffffff",

    border: "#CFE8D1",

    winnerBackground: "#DCFCE7",
    winnerText: "#166534",

    loserBackground: "#EEF8EF",
    loserText: "#5A705F",

    gradientFrom: "#ffffff",
    gradientTo: "#D9F2DC",
  },

  hard: {
    background: "#F5F8FC",
    surface: "#EEF3FA",

    primaryText: "#12263A",
    secondaryText: "#5B7287",

    accent: "#2563EB",
    accentText: "#ffffff",

    border: "#D7E3F1",

    winnerBackground: "#DBEAFE",
    winnerText: "#1D4ED8",

    loserBackground: "#EFF4FA",
    loserText: "#5F7287",

    gradientFrom: "#ffffff",
    gradientTo: "#E3EDF8",
  },

  night: {
    background: "#0B1020",
    surface: "#151D33",

    primaryText: "#F8FAFC",
    secondaryText: "#B8C5DB",

    accent: "#38BDF8",
    accentText: "#0F172A",

    border: "#24314F",

    winnerBackground: "#164E63",
    winnerText: "#BAE6FD",

    loserBackground: "#1E293B",
    loserText: "#CBD5E1",

    gradientFrom: "#0F172A",
    gradientTo: "#020617",
  },
};

export function getMatchCardTheme(
  theme: MatchCardThemeName = "classic"
) {
  return themes[theme];
}