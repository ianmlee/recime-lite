import { useSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Image, Button, Share } from "react-native";
import { getRecipes } from "../../src/data/db";
import type { Recipe } from "../../src/types";

export default function RecipeDetail() {
  const { id } = useSearchParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    (async () => {
      const list = await getRecipes();
      const found = list.find(r => r.id === id);
      setRecipe(found ?? null);
    })();
  }, [id]);

  if (!recipe) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {recipe.imageUrl ? (
        <Image source={{ uri: recipe.imageUrl }} style={{ width: "100%", height: 200, borderRadius: 8, marginBottom: 12 }} />
      ) : null}
      <Text style={{ fontSize: 22, marginBottom: 4 }}>{recipe.title}</Text>
      <Text style={{ color: "#666", marginBottom: 8 }}>{[recipe.sourceName, recipe.totalTime, recipe.servings].filter(Boolean).join(" • ")}</Text>
      <Button title="Share" onPress={() => Share.share({ message: `${recipe.title} - ${recipe.url}` })} />
      <View style={{ height: 12 }} />
      <Text style={{ fontWeight: "bold", marginTop: 8 }}>Ingredients</Text>
      {recipe.ingredients.length ? (
        recipe.ingredients.map((ing, idx) => (
          <Text key={idx}>• {ing}</Text>
        ))
      ) : (
        <Text>No ingredients</Text>
      )}
      <Text style={{ fontWeight: "bold", marginTop: 12 }}>Instructions</Text>
      {recipe.instructions.length ? (
        recipe.instructions.map((step, idx) => (
          <Text key={idx}>{idx + 1}. {step}</Text>
        ))
      ) : (
        <Text>No instructions</Text>
      )}
    </View>
  );
}
