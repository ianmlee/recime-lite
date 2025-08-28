import { Recipe } from "../types";

type PartialRecipe = Omit<Recipe, "id" | "url">;

function tryParseJsonLd(html: string): PartialRecipe | null {
  const scriptRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;
  while ((match = scriptRegex.exec(html))) {
    const content = match[1].trim();
    try {
      const parsed = JSON.parse(content);
      const items: any[] = Array.isArray(parsed) ? parsed : [parsed];
      for (const item of items) {
        const graph = item["@graph"];
        if (Array.isArray(graph)) {
          for (const node of graph) {
            const rec = coerceSchemaOrgRecipe(node);
            if (rec) return rec;
          }
        }
        const rec = coerceSchemaOrgRecipe(item);
        if (rec) return rec;
      }
    } catch {}
  }
  return null;
}

function coerceSchemaOrgRecipe(node: any): PartialRecipe | null {
  if (!node) return null;
  const type = node["@type"];
  const isRecipe = Array.isArray(type) ? type.includes("Recipe") : type === "Recipe";
  if (!isRecipe) return null;

  const title: string = node.name || node.headline || "Untitled";
  const imageUrl: string | undefined = normalizeImage(node.image);
  const servings: string | undefined = node.recipeYield ? String(node.recipeYield) : undefined;
  const totalTime: string | undefined = node.totalTime || node.cookTime || node.prepTime;
  const sourceName: string | undefined = node.author?.name || (typeof node.author === "string" ? node.author : undefined);

  const ingredients: string[] = Array.isArray(node.recipeIngredient)
    ? node.recipeIngredient.map(String)
    : Array.isArray(node.ingredients)
    ? node.ingredients.map(String)
    : [];

  const instructions: string[] = normalizeInstructions(node.recipeInstructions);

  const tags: string[] = Array.isArray(node.keywords)
    ? node.keywords.flatMap((k: any) => String(k).split(/,\s*/g)).filter(Boolean)
    : typeof node.keywords === "string"
    ? node.keywords.split(/,\s*/g).filter(Boolean)
    : [];

  return { title, ingredients, instructions, imageUrl, servings, totalTime, sourceName, tags };
}

function normalizeImage(image: any): string | undefined {
  if (!image) return undefined;
  if (typeof image === "string") return image;
  if (Array.isArray(image)) return typeof image[0] === "string" ? image[0] : image[0]?.url;
  return image.url || image["@id"] || undefined;
}

function normalizeInstructions(instructions: any): string[] {
  if (!instructions) return [];
  if (typeof instructions === "string") return [instructions];
  if (Array.isArray(instructions)) {
    return instructions
      .map((it) => {
        if (typeof it === "string") return it;
        if (it?.text) return String(it.text);
        if (it?.name) return String(it.name);
        return "";
      })
      .filter(Boolean);
  }
  if (instructions?.text) return [String(instructions.text)];
  return [];
}

export function parseRecipe(html: string): PartialRecipe {
  const jsonLd = tryParseJsonLd(html);
  if (jsonLd) return jsonLd;

  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : "Untitled";

  return { title, ingredients: [], instructions: [] };
}
