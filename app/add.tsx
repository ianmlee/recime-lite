import { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { addRecipeFromUrl } from "../src/logic/ingest";

export default function AddRecipe() {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");

  const handleAdd = async () => {
    try {
      const recipe = await addRecipeFromUrl(url);
      setMessage(`Saved: ${recipe.title}`);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="Paste recipe URL"
        value={url}
        onChangeText={setUrl}
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />
      <Button title="Save Recipe" onPress={handleAdd} />
      {message ? <Text style={{ marginTop: 20 }}>{message}</Text> : null}
    </View>
  );
}
