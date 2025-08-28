import { useSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, TextInput, Button, ScrollView, Alert } from "react-native";
import { getRecipeById, updateRecipe } from "../../src/data/db";
import type { Recipe } from "../../src/types";

export default function EditRecipe() {
  const { id } = useSearchParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    (async () => {
      const r = await getRecipeById(String(id));
      if (r) setRecipe(r);
    })();
  }, [id]);

  const handleSave = async () => {
    if (!recipe) return;
    await updateRecipe(recipe);
    Alert.alert("Saved", "Your changes have been saved.");
  };

  if (!recipe) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 8 }}>Edit Recipe</Text>
      <Text>Title</Text>
      <TextInput value={recipe.title} onChangeText={(t) => setRecipe({ ...recipe, title: t })} style={{ borderWidth: 1, padding: 8, marginBottom: 12 }} />
      <Text>Ingredients (one per line)</Text>
      <TextInput
        value={recipe.ingredients.join("\n")}
        onChangeText={(t) => setRecipe({ ...recipe, ingredients: t.split(/\n+/).filter(Boolean) })}
        multiline
        numberOfLines={6}
        style={{ borderWidth: 1, padding: 8, marginBottom: 12 }}
      />
      <Text>Instructions (one per line)</Text>
      <TextInput
        value={recipe.instructions.join("\n")}
        onChangeText={(t) => setRecipe({ ...recipe, instructions: t.split(/\n+/).filter(Boolean) })}
        multiline
        numberOfLines={6}
        style={{ borderWidth: 1, padding: 8, marginBottom: 12 }}
      />
      <Button title="Save Changes" onPress={handleSave} />
    </ScrollView>
  );
}
