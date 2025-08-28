import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { getRecipes } from "../src/data/db";
import type { Recipe } from "../src/types";

export default function RecipesList() {
	const [recipes, setRecipes] = useState<Recipe[]>([]);

	useEffect(() => {
		(async () => {
			const data = await getRecipes();
			setRecipes(data);
		})();
	}, []);

	return (
		<View style={{ flex: 1, padding: 16 }}>
			<Text style={{ fontSize: 20, marginBottom: 12 }}>Recipes</Text>
			<FlatList
				data={recipes}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<Link href={{ pathname: "/recipe/[id]", params: { id: item.id } }} asChild>
						<TouchableOpacity style={{ paddingVertical: 12 }}>
							<Text style={{ fontSize: 16 }}>{item.title}</Text>
						</TouchableOpacity>
					</Link>
				)}
				ListEmptyComponent={<Text>No recipes yet.</Text>}
			/>
		</View>
	);
}