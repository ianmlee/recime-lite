export type Recipe = {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  url: string;
  imageUrl?: string;
  totalTime?: string;
  servings?: string;
  tags?: string[];
  sourceName?: string;
};
