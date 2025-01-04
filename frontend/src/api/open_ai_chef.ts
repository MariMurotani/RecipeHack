import axios from "axios";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// シェフのスタイルを型定義
type ChefStyle = "French" | "Mediterranean" | "Turkish";

// 各シェフのプロンプトを型付きで定義
const chefPrompts: Record<ChefStyle, string> = {
  French: `
Using the following ingredients, create a sophisticated and delicate French recipe in this format:

# French Cuisine
`,
  Mediterranean: `
Using the following ingredients, create a Mediterranean recipe incorporating olive oil, herbs, and vegetables in this format:

# Mediterranean Cuisine
`,
  Turkish: `
Using the following ingredients, create a homely Turkish recipe utilizing spices and yogurt in this format:

# Turkish Cuisine
`,
};

const responsePrompt = `
## Dish Name
** Ingredients **: List of ingredients
** Steps **: Cooking instructions

- Please translate into Japanese.
`;

// OpenAI APIを呼び出す関数
async function callOpenAI(prompt: string): Promise<string> {
  const response = await axios.post(
    OPENAI_API_URL,
    {
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a world-class chef." },
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

  return response.data.choices[0].message.content.trim();
}

// レシピを生成する関数
async function generateRecipe(style: ChefStyle, ingredients: string[]): Promise<string> {
  const prompt = `Ingredients: ${JSON.stringify(ingredients)}\n${chefPrompts[style]}\n${responsePrompt}`;
  return callOpenAI(prompt);  
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

  return callOpenAI(debatePrompt);
}

// メインフロー
export async function generateAllRecipe(ingredients: string[], callback: (recipe: string) => void) {
  
  console.log("Generating individual recipes...\n");
  const individualRecipes: Record<ChefStyle, string> = {} as Record<ChefStyle, string>;

  // 各シェフのスタイルでレシピを生成
  for (const style of Object.keys(chefPrompts) as ChefStyle[]) {
    console.log(`Generating ${style} recipe...`);
    individualRecipes[style] = await generateRecipe(style, ingredients);
    console.log(individualRecipes[style])
    callback(individualRecipes[style]);
  }

  // 議論してフュージョンレシピを生成
  console.log("Debating recipes to create the best fusion dish...\n");
  const fusionRecipe = await debateAndFuseRecipes(individualRecipes);
  //callback(fusionRecipe);
}
