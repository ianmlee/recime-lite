import AsyncStorage from "@react-native-async-storage/async-storage";
import { Recipe } from "../types";

const STORAGE_KEY = "recipes";

export async function saveRecipe(recipe: Recipe) {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  const recipes = data ? JSON.parse(data) : [];
  recipes.push(recipe);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

export async function getRecipes(): Promise<Recipe[]> {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}
