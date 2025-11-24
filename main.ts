// main.ts
// Deno + Zypher + Firecrawl
// Competitor research agent for yakitori restaurants in Boston
// Outputs structured JSON

import { load } from "std/dotenv";
await load();

console.log("OPENAI:", Deno.env.get("OPENAI_API_KEY"));

import {
  OpenAIModelProvider,
  createZypherContext,
  ZypherAgent,
} from "@corespeed/zypher";
import { eachValueFrom } from "rxjs-for-await";

// safely read environment variables
function getEnv(name: string): string {
  const val = Deno.env.get(name);
  if (!val) {
    throw new Error(`Environment variable ${name} is not set`);
  }
  return val;
}

// =======================
// 1. Initialize context
// =======================
const ctx = await createZypherContext(Deno.cwd());

// =======================
// 2. Create AI agent using OpenAI
// =======================
const agent = new ZypherAgent(
  ctx,
  new OpenAIModelProvider({
    apiKey: getEnv("OPENAI_API_KEY"),
  }),
);

// // =======================
// // 3. Register Firecrawl MCP server
// // =======================
// // Required to actually crawl Yelp / Google / blogs / websites
// await agent.mcp.registerServer({
//   id: "firecrawl",
//   type: "command",
//   command: {
//     command: "npx",
//     args: ["-y", "firecrawl-mcp"],
//     env: {
//       FIRECRAWL_API_KEY: getEnv("FIRECRAWL_API_KEY"),
//     },
//   },
// });

// =======================
// 4. Task Prompt
// =======================
const city = "Boston, MA";
const cuisine = "yakitori / Japanese izakaya / Japanese skewers";
const maxCompetitors = 5;

const taskPrompt = `
You are a restaurant market research analyst specializing in North American food & beverage competition.
Research approximately 5 representative yakitori / Japanese skewer restaurants in Boston, MA.
Use your existing knowledge and publicly available information from reviews, restaurant menus, or online summaries.
Do NOT scrape websites. Do not crawl webpages.

Research approximately ${maxCompetitors} representative yakitori / Japanese skewer restaurants in ${city}.

For each restaurant, extract:
- name
- neighborhood_or_area
- address
- price_range  (example: "$$" or "25–45 USD per person")
- average_rating
- popular_dishes (3–8 items)
- positive_review_keywords (5–10 short keywords)
- negative_review_keywords (5–10 short keywords)
- audience_persona (who visits)
- vibe_and_ambience

If some information is unknown, leave empty string.

After analyzing competitors, provide a short English summary of market insights.

Then output a single valid JSON object:

{
  "city": "${city}",
  "cuisine_focus": "${cuisine}",
  "competitors": [
    {
      "name": "string",
      "neighborhood_or_area": "string",
      "address": "string",
      "price_range": "string",
      "average_rating": "string",
      "popular_dishes": ["string"],
      "positive_review_keywords": ["string"],
      "negative_review_keywords": ["string"],
      "audience_persona": "string",
      "vibe_and_ambience": "string"
    }
  ],
  "overall_insights": {
    "typical_price_positioning": "string",
    "common_strengths": ["string"],
    "common_weaknesses": ["string"],
    "typical_audience_personas": ["string"],
    "market_gaps_and_opportunities": ["string"]
  }
}

Rules:
- JSON must be syntactically valid
- Keys must be double quoted
- No extra text after JSON
`;

// =======================
// 5. Run task using GPT
// =======================
const event$ = agent.runTask(taskPrompt, "gpt-4o-mini");

// =======================
// 6. Stream agent output
// =======================
for await (const event of eachValueFrom(event$)) {
  console.log(event);
}
