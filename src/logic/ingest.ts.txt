import { Recipe } from "../types";
import { saveRecipe } from "../data/db";
import { parseRecipe } from "./parse";
import { v4 as uuidv4 } from "uuid";

export async function addRecipeFromUrl(url: string): Promise<Recipe> {
  const response = await fetch(url);
  const html = await response.text();

  const recipe = parseRecipe(html);
  const fullRecipe: Recipe = { ...recipe, id: uuidv4(), url };
  await saveRecipe(fullRecipe);
  return fullRecipe;
}
