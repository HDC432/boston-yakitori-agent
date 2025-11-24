Boston Yakitori Competitor Research Agent

This project uses Deno + Zypher Agent + OpenAI to generate structured competitor analysis for yakitori / izakaya restaurants in Boston.
The agent outputs JSON with:

Competitor list

Price ranges

Popular dishes

Audience personas

Market strengths & weaknesses

Opportunities/gaps

No scraping is performed — the analysis is based on model knowledge and reasoning.

🚀 Quick Start
1️⃣ Install Deno 2+

https://deno.land

2️⃣ Add dependencies
deno add jsr:@corespeed/zypher
deno add npm:rxjs-for-await

🔑 Environment Variables

Create a .env file in the root directory:

OPENAI_API_KEY=your_api_key_here


▶️ Run The Agent
export $(grep -v '^#' .env | xargs) && deno run -A main.ts


This automatically loads environment variables from .env
and launches the agent with full permissions (-A).

📦 Output

The agent prints:

A short market summary

A valid JSON object:

{
  "city": "...",
  "cuisine_focus": "...",
  "competitors": [...],
  "overall_insights": {...}
}

