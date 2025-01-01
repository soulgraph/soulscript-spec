import readline from "readline";
import { config } from "dotenv";
import { loadSoulscript, loadMemoryGraph } from "./utils/fileLoader.js";
import { generatePrompt } from "./prompt.js";
import { selectRelevantMemories } from "./utils/memorySelector.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("Starting CLI...");

  config();
  console.log("Environment loaded");

  if (!process.env.OPENAI_API_KEY) {
    console.warn("Warning: OPENAI_API_KEY not found in environment variables");
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    console.log("Loading soul file...");
    const soulPath = path.join(__dirname, "../data/agent.soul");
    const soul = await loadSoulscript(soulPath);
    console.log("Soul loaded:", soul.personality.name);

    console.log("Loading memories...");
    const memoriesPath = path.join(__dirname, "../data/memories.json");
    const memoryGraph = await loadMemoryGraph(memoriesPath);
    console.log(`Loaded ${Object.keys(memoryGraph.memories).length} memories`);

    console.log("\n=== Chat Started ===\n");
    console.log("Type 'exit' to quit\n");

    rl.on("line", async (input) => {
      console.log(`Received input: ${input}`);

      if (input.toLowerCase() === "exit") {
        console.log("Exiting...");
        rl.close();
        return;
      }

      const relevantMemories = selectRelevantMemories(
        Object.values(memoryGraph.memories),
        input
      );

      console.log(`Selected ${relevantMemories.length} relevant memories`);

      const formattedMemories = relevantMemories
        .map((mem) => `[${mem.creation_date}] ${mem.core_memory}`)
        .join("\n");

      const prompt = generatePrompt(soul, formattedMemories);
      console.log("\nGenerated prompt:", prompt);

      console.log("\nBot: [Response placeholder]");
    });
  } catch (error) {
    console.error("Failed to start chat:", error);
    console.error(
      "Error details:",
      error instanceof Error ? error.message : error
    );
    rl.close();
  }
}

console.log("CLI module loaded");
main().catch(console.error);
