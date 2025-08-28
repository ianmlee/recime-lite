import { Link } from "expo-router";
import { View, Text, Button } from "react-native";

export default function Home() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Recime Lite</Text>
      <Link href="/add">
        <Button title="Add Recipe from URL" />
      </Link>
      <View style={{ height: 12 }} />
      <Link href="/recipes">
        <Button title="View Recipes" />
      </Link>
    </View>
  );
}
