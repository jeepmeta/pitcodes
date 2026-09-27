import fs from "fs";
import path from "path";

// Define the database directory path
const DB_DIR = path.join(process.cwd(), "lib", "code-db");

function sortDatabaseFiles() {
  if (!fs.existsSync(DB_DIR)) {
    console.error(`[ERROR] Directory not found at ${DB_DIR}`);
    process.exit(1);
  }

  // Target all JSON files in the directory
  const files = fs.readdirSync(DB_DIR).filter(file => file.endsWith(".json"));

  if (files.length === 0) {
    console.log("No JSON files found in the directory.");
    return;
  }

  let processedCount = 0;

  for (const file of files) {
    const filePath = path.join(DB_DIR, file);

    try {
      const fileData = fs.readFileSync(filePath, "utf8");
      const codeEntries = JSON.parse(fileData);

      // Defensively ensure the JSON structure is an array before sorting
      if (!Array.isArray(codeEntries)) {
        console.warn(`[SKIPPED] ${file} - Root element is not an array.`);
        continue;
      }

      // Sort the array of JSON objects based on the 'code' key alphabetically [cite: 1.1.5]
      codeEntries.sort((a, b) => {
        const codeA = a.code ? a.code.toString().toUpperCase() : "";
        const codeB = b.code ? b.code.toString().toUpperCase() : "";
        
        // localeCompare ensures reliable alphabetical string sorting [cite: 1.1.5]
        return codeA.localeCompare(codeB);
      });

      // Write the sorted array back to the file with 2-space indentation
      fs.writeFileSync(filePath, JSON.stringify(codeEntries, null, 2), "utf8");
      console.log(`✓ Sorted: ${file}`);
      processedCount++;

    } catch (error) {
      console.error(`[ERROR] Failed to sort ${file}. Reason: ${error.message}`);
    }
  }

  console.log(`\nSuccess! Alphabetically sorted ${processedCount} files in ${DB_DIR}.`);
}

sortDatabaseFiles();