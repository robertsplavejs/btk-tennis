export type MatchCardStyle = "premium" | "score" | "clean";

export type MatchCardStyleOption = {
  id: MatchCardStyle;
  name: string;
  description: string;
};

export const matchCardStyleOptions: MatchCardStyleOption[] = [
  {
    id: "premium",
    name: "Premium",
    description: "Liels foto un elegants tumšais pārklājums.",
  },
  {
    id: "score",
    name: "Rezultāts",
    description: "Galvenais akcents uz spēles rezultātu.",
  },
  {
    id: "clean",
    name: "Tīrs",
    description: "Minimāls, gaišs un sportisks noformējums.",
  },
];