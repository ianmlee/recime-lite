import { useEffect, useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import { addRecipeFromUrl } from "../src/logic/ingest";

export default function AddRecipe() {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const text = await Clipboard.getStringAsync();
      if (isLikelyUrl(text)) {
        setUrl(text);
      }
    })();
  }, []);

  const handleAdd = async () => {
    try {
      if (!isLikelyUrl(url)) {
        Alert.alert("Invalid URL", "Please paste a valid recipe URL.");
        return;
      }
      setLoading(true);
      const recipe = await addRecipeFromUrl(url);
      setMessage(`Saved: ${recipe.title}`);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
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
      <Button title={loading ? "Saving..." : "Save Recipe"} onPress={handleAdd} disabled={loading} />
      {message ? <Text style={{ marginTop: 20 }}>{message}</Text> : null}
    </View>
  );
}

function isLikelyUrl(text: string | null): boolean {
  if (!text) return false;
  try {
    const u = new URL(text);
    return !!u.protocol && !!u.host;
  } catch {
    return false;
  }
}
