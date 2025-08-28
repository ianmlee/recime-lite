import { Recipe } from "../types";

export function parseRecipe(html: string): Omit<Recipe, "id" | "url"> {
  // Simplified example — real parsing would use Cheerio
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : "Untitled";

  return {
    title,
    ingredients: [],
    instructions: [],
  };
}
