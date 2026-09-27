import fs from "fs";
import path from "path";

const DB_DIR = path.join(process.cwd(), "lib", "code-db");

function verifyDatabase() {
  if (!fs.existsSync(DB_DIR)) {
    console.error(`[FATAL ERROR] Directory not found at ${DB_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(DB_DIR).filter(file => file.endsWith("xx.json"));
  
  if (files.length === 0) {
    console.log("No JSON files found to verify.");
    return;
  }

  let totalFiles = 0;
  let totalEntries = 0;
  let totalErrors = 0;

  console.log(`Starting verification across ${files.length} files...\n`);

  for (const file of files) {
    const filePath = path.join(DB_DIR, file);
    let codeEntries;

    try {
      const fileData = fs.readFileSync(filePath, "utf8");
      codeEntries = JSON.parse(fileData);
    } catch (error) {
      console.error(`[FILE ERROR] Invalid JSON format in ${file}`);
      totalErrors++;
      continue;
    }

    if (!Array.isArray(codeEntries)) {
      console.error(`[FILE ERROR] Root element in ${file} is not an array.`);
      totalErrors++;
      continue;
    }

    totalFiles++;

    codeEntries.forEach((entry, index) => {
      totalEntries++;
      const codeId = entry.code || `Unknown (Index ${index})`;
      const errors = [];

      // 1. Check strict required string fields
      const requiredStrings = ["code", "description", "solutions", "diy_cost", "pro_cost"];
      for (const field of requiredStrings) {
        if (typeof entry[field] !== "string" || entry[field].trim() === "") {
          errors.push(`Missing or empty required field: '${field}'`);
        }
      }

      // 2. Enforce precise severity values
      const validSeverities = ["low", "medium", "critical"];
      if (!entry.severity || typeof entry.severity !== "string" || !validSeverities.includes(entry.severity.toLowerCase())) {
        errors.push(`Invalid severity: '${entry.severity}'. Must be 'low', 'medium', or 'critical'.`);
      }

      // 3. Enforce populated arrays
      const requiredArrays = ["symptoms", "causes", "related_codes"];
      for (const field of requiredArrays) {
        if (!Array.isArray(entry[field])) {
          errors.push(`Must be an array: '${field}'`);
        } else if (entry[field].length === 0) {
          errors.push(`Array cannot be empty: '${field}'`);
        } else if (entry[field].some(item => typeof item !== "string" || item.trim() === "")) {
          errors.push(`Array contains invalid or blank items: '${field}'`);
        }
      }

      // 4. Check fields that are allowed to be empty, but MUST exist in the object
      const allowedEmptyStrings = ["affiliate_links", "guide_links", "youtube_links"];
      for (const field of allowedEmptyStrings) {
        if (entry[field] === undefined) {
          errors.push(`Field is missing entirely (even if meant to be empty): '${field}'`);
        } else if (typeof entry[field] !== "string") {
          errors.push(`Field must be a string (even if empty): '${field}'`);
        }
      }

      // If any validation failed, log the specific code and its errors
      if (errors.length > 0) {
        console.log(`[INVALID DATA] File: ${file} | Code: ${codeId}`);
        errors.forEach(err => console.log(`  -> ${err}`));
        totalErrors++;
      }
    });
  }

  // Print final summary
  console.log("\n--------------------------------------------------");
  console.log("Verification Summary");
  console.log("--------------------------------------------------");
  console.log(`Files scanned:   ${totalFiles}`);
  console.log(`Entries checked: ${totalEntries}`);
  
  if (totalErrors === 0) {
    console.log(`Status:          ✅ All entries passed verification!`);
  } else {
    console.log(`Status:          ❌ Found errors in ${totalErrors} entries. Run generation script again for missing entries or fix manually.`);
  }
}

verifyDatabase();