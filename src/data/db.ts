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

export async function getRecipeById(id: string): Promise<Recipe | null> {
  const list = await getRecipes();
  return list.find(r => r.id === id) ?? null;
}

export async function updateRecipe(updated: Recipe): Promise<void> {
  const list = await getRecipes();
  const next = list.map(r => (r.id === updated.id ? updated : r));
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export async function getRecipeByUrl(url: string): Promise<Recipe | null> {
  const list = await getRecipes();
  return list.find(r => r.url === url) ?? null;
}
