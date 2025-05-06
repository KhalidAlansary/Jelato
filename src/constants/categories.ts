export const categories = [
  "chocolate",
  "fruity",
  "tropical",
  "caramel",
] as const;
export type Category = (typeof categories)[number];
