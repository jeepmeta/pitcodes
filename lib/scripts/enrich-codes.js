import { GoogleGenAI, SchemaType } from "@google/genai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const DB_DIR = path.join(process.cwd(), "lib", "code-db");

const responseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    symptoms: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "2 to 4 items. Short single-sentence diagnostic phrases. No compound items, no conversational tone."
    },
    causes: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "2 to 4 items. Short single-sentence diagnostic phrases. Separate all items into individual entries."
    },
    solutions: {
      type: SchemaType.STRING,
      description: "Direct 1 to 2 sentence diagnostic summary of how to resolve the issue."
    },
    diy_cost: {
      type: SchemaType.STRING,
      description: "Estimated DIY price range, e.g. '$20 - $50'"
    },
    pro_cost: {
      type: SchemaType.STRING,
      description: "Estimated Professional repair price range, e.g. '$150 - $350'"
    }
  },
  required: ["symptoms", "causes", "solutions", "diy_cost", "pro_cost"]
};

async function runEnrichment() {
  if (!fs.existsSync(DB_DIR)) {
    console.error(`[FATAL ERROR] Database directory not found at ${DB_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(DB_DIR).filter(f => f.endsWith("xx.json"));
  console.log(`Scanning ${files.length} chunk files for incomplete entries...\n`);

  for (const file of files) {
    const filePath = path.join(DB_DIR, file);
    let entries = [];

    try {
      entries = JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (e) {
      console.error(`Could not read ${file}, skipping.`);
      continue;
    }

    let updatedInFile = false;

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];

      // Process only if symptoms or causes are unpopulated
      if (Array.isArray(entry.symptoms) && entry.symptoms.length > 0) {
        continue;
      }

      console.log(`Enriching [${entry.code}] in ${file}...`);

      const systemPrompt = `You are a concise automotive diagnostic technical writer. 
Generate diagnostic information for OBD-II Code ${entry.code}: ${entry.description}.

STRICT FORMATTING LAWS:
1. Every symptom and cause MUST be a single, short diagnostic phrase or bullet-style sentence.
2. NEVER use conversational filler like "The air filter may be..." or "You might notice...". Write in direct diagnostic terms (e.g., "Clogged air filter", "Illuminated Check Engine Light").
3. NEVER combine causes or symptoms using 'or' or commas (e.g., BAD: "Clogged filter or damaged PCM"). Split them into distinct array items (e.g., ITEM 1: "Clogged air filter", ITEM 2: "Damaged PCM").
4. Minimum 2, maximum 4 array items for 'symptoms' and 'causes'.
5. 'diy_cost' and 'pro_cost' must strictly be short estimated price ranges (e.g. "$15 - $40", "$120 - $300").`;

      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: systemPrompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
            temperature: 0.1
          }
        });

        const enrichmentData = JSON.parse(response.text);

        // Merge enriched fields cleanly into existing entry
        entries[i] = {
          ...entry,
          symptoms: enrichmentData.symptoms,
          causes: enrichmentData.causes,
          solutions: enrichmentData.solutions,
          diy_cost: enrichmentData.diy_cost,
          pro_cost: enrichmentData.pro_cost
        };

        updatedInFile = true;
        console.log(`  ✓ Enriched ${entry.code}`);

        // Write file update immediately per item to preserve progress
        fs.writeFileSync(filePath, JSON.stringify(entries, null, 2), "utf8");

        // Short throttle pause for API stability
        await new Promise(resolve => setTimeout(resolve, 800));

      } catch (error) {
        console.error(`[API ERROR] Failed to enrich ${entry.code}:`, error.message || error);
        console.log("Pausing 4 seconds before continuing...");
        await new Promise(resolve => setTimeout(resolve, 4000));
      }
    }

    if (updatedInFile) {
      console.log(`File ${file} updated and saved.\n`);
    }
  }

  console.log("Enrichment workflow complete!");
}

runEnrichment();