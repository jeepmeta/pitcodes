import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({
  baseURL: "http://localhost:1234/v1",
  apiKey: "lm-studio",
});

const DB_DIR = path.join(process.cwd(), "lib", "code-db");
const RAW_FILE = path.join(DB_DIR, "raw-codes.json");

function getExistingCodesMap() {
  const map = new Map();
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
    return map;
  }

  const files = fs.readdirSync(DB_DIR).filter(f => f.endsWith("xx.json"));
  for (const file of files) {
    try {
      const filePath = path.join(DB_DIR, file);
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
      data.forEach(entry => map.set(entry.code.toUpperCase(), file));
    } catch (e) {
      console.warn(`Could not parse ${file}, skipping check.`);
    }
  }
  return map;
}

function saveOrUpdateEntry(prefix, entry) {
  const chunkPath = path.join(DB_DIR, `${prefix}xx.json`);
  let chunk = [];

  if (fs.existsSync(chunkPath)) {
    try {
      chunk = JSON.parse(fs.readFileSync(chunkPath, "utf8"));
    } catch (e) {
      chunk = [];
    }
  }

  const existingIndex = chunk.findIndex(item => item.code.toUpperCase() === entry.code.toUpperCase());
  if (existingIndex >= 0) {
    chunk[existingIndex] = { ...chunk[existingIndex], ...entry };
  } else {
    chunk.push(entry);
  }

  fs.writeFileSync(chunkPath, JSON.stringify(chunk, null, 2), "utf8");
}

async function runPopulate() {
  if (!fs.existsSync(RAW_FILE)) {
    console.error(`[FATAL ERROR] raw-codes.json not found at ${RAW_FILE}`);
    process.exit(1);
  }

  const rawData = JSON.parse(fs.readFileSync(RAW_FILE, "utf8"));
  const existingMap = getExistingCodesMap();

  console.log(`Loaded ${rawData.length} raw codes. ${existingMap.size} existing entries indexed.\n`);

  for (const entry of rawData) {
    const code = entry.Code.toUpperCase();
    const prefix = code.substring(0, 3).toLowerCase();

    if (existingMap.has(code)) {
      console.log(`Skipping ${code} (Entry already exists in chunk file)`);
      continue;
    }

    console.log(`Populating metadata locally for: ${code} - ${entry.Description}`);

    try {
      const response = await openai.chat.completions.create({
        model: "local-model",
        messages: [
          {
            role: "system",
            content: `You are an automotive OBD-II diagnostic tool. Output ONLY a raw JSON object with no markdown block, following this structure strictly:
{
  "severity": "low, medium, or critical",
  "related_codes": ["CODE1", "CODE2"]
}
Requirements:
- 'severity' must strictly be one of: "low", "medium", or "critical".
- 'related_codes' must be an array of 2 to 4 related OBD-II code strings only (e.g. ["P0171", "P0174"]), without descriptions.`
          },
          {
            role: "user",
            content: `Provide severity and related codes for ${code}: ${entry.Description}`
          }
        ],
        temperature: 0.1
      });

      let rawText = response.choices[0].message.content.trim();
      rawText = rawText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "");

      const parsed = JSON.parse(rawText);

      // Build initial schema entry
      const codeRecord = {
        code: code,
        description: entry.Description,
        severity: (parsed.severity || "medium").toLowerCase(),
        symptoms: [],
        causes: [],
        solutions: "",
        diy_cost: "",
        pro_cost: "",
        related_codes: Array.isArray(parsed.related_codes) ? parsed.related_codes : [],
        affiliate_links: "",
        guide_links: "",
        youtube_links: ""
      };

      saveOrUpdateEntry(prefix, codeRecord);
      console.log(`✓ Created initial entry for ${code} in ${prefix}xx.json`);

    } catch (error) {
      console.error(`[LOCAL ERROR] Failed to populate ${code}:`, error.message);
    }
  }

  console.log("\nPopulate process complete!");
}

runPopulate();