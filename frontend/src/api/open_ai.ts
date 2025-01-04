import axios from "axios";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// 各シェフのプロンプトを型で定義
type ChefStyle = "French" | "Mediterranean" | "Turkish";

const chefPrompts: Record<ChefStyle, string> = {
  French: `
 Using the following ingredients, create a sophisticated and delicate French recipe  n following markdown format:
Please translate it into Japanese and return only the translated Japanese text.
French Cuisine
`,
  Mediterranean: `
Using the above ingredients, create a Mediterranean recipe incorporating olive oil, herbs, and vegetables in following markdown format:
Please translate it into Japanese and return only the translated Japanese text.
## Mediterranean Cuisine
`,
  Turkish: `
Using the above ingredients, create a Mediterranean recipe incorporating olive oil, herbs, and vegetables in following markdown format:
Please translate it into Japanese and return only the translated Japanese text.
## Turkish Cuisine
`,
};

const responsePrompt = `
## Dish Name <- Please input the name of dish you created
(French Cuisine, Mediterranean Cuisine, Turkish Cuisine) <= Please specify the cuisine style
#### Ingredients: 
  - List of ingredients
#### Steps:
  - Cooking instructions
***
`;

// レシピを生成する関数
async function generateRecipe(style: ChefStyle, ingredients: string[]): Promise<string> {
  const prompt = `Ingredients: ${JSON.stringify(ingredients)}\n${chefPrompts[style]}\n${responsePrompt}`;
  
  const response = await axios.post(
    OPENAI_API_URL,
    {
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a world-class chef. Hummer out a new dish with provided information." },
        { role: "user", content: prompt },
      ],
      max_tokens: 500,
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.choices[0].message.content.trim() + "\n";
}

// 議論してフュージョンレシピを作成する関数
async function debateAndFuseRecipes(recipes: Record<ChefStyle, string>): Promise<string> {
  const debatePrompt = `
You are a group of expert chefs. Each of you has created a recipe in your style. Now, discuss and agree on the best elements from each recipe to create a perfect fusion dish.
The format of the final recipe should be:
** Best Fusion Cuisine
* Dish Name *
Ingredients: List of ingredients
Steps: Cooking instructions

Here are the individual recipes:
${Object.entries(recipes)
  .map(([style, recipe]) => `${style} Recipe:\n${recipe}`)
  .join("\n\n")}
`;

  const response = await axios.post(
    OPENAI_API_URL,
    {
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a world-class chef." },
        { role: "user", content: `${debatePrompt}\n${responsePrompt}` },
      ],
      max_tokens: 500,
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.choices[0].message.content.trim() + "\n";
}

// メインフロー
export async function main() {
  const ingredients = ["Napa cabbage", "Star anise", "Beef", "Chinese chives"];
  
  console.log("Generating individual recipes...\n");
  const individualRecipes: Record<ChefStyle, string> = {} as Record<ChefStyle, string>;

  // 各シェフのスタイルでレシピを生成
  for (const style of Object.keys(chefPrompts) as ChefStyle[]) {
    console.log(`Generating ${style} recipe...`);
    individualRecipes[style] = await generateRecipe(style, ingredients);
    console.log(`${style} Recipe:\n${individualRecipes[style]}\n`);
  }

  // 議論してフュージョンレシピを生成
  console.log("Debating recipes to create the best fusion dish...\n");
  const fusionRecipe = await debateAndFuseRecipes(individualRecipes);
  console.log("Best Fusion Recipe:\n");
  console.log(fusionRecipe);
}
