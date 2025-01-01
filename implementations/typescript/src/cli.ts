import readline from 'readline';
import { config } from 'dotenv';
import { loadSoulscript, loadMemoryGraph } from './utils/fileLoader.js';
import { generatePrompt } from './prompt.js';
import { selectRelevantMemories } from './utils/memorySelector.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { getChatCompletion as getOpenAICompletion } from './utils/openai.js';
import { getChatCompletion as getAnthropicCompletion } from './utils/anthropic.js';
import { getChatCompletion as getOllamaCompletion } from './utils/ollama.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type LLMProvider = 'openai' | 'anthropic' | 'ollama';

async function getAIResponse(
  provider: LLMProvider,
  systemPrompt: string,
  userInput: string
) {
  try {
    switch (provider) {
      case 'openai':
        return await getOpenAICompletion(systemPrompt, userInput);
      case 'anthropic':
        return await getAnthropicCompletion(systemPrompt, userInput);
      case 'ollama':
        return await getOllamaCompletion(systemPrompt, userInput);
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  } catch (error) {
    console.error(`${provider} API error:`, error);
    throw error;
  }
}

async function main() {
  console.log('Starting CLI...');

  config();
  console.log('Environment loaded');

  if (!process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
    throw new Error('No API keys found in environment variables');
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    console.log('Loading soul file...');
    const soulPath = path.join(__dirname, '../data/agent.soul');
    const soul = await loadSoulscript(soulPath);
    console.log('Soul loaded:', soul.personality.name);

    console.log('Loading memories...');
    const memoriesPath = path.join(__dirname, '../data/memories.json');
    const memoryGraph = await loadMemoryGraph(memoriesPath);
    console.log(`Loaded ${Object.keys(memoryGraph.memories).length} memories`);

    console.log('\n=== Chat Started ===');
    console.log('Commands:');
    console.log('  !o <message> - Use OpenAI');
    console.log('  !a <message> - Use Anthropic');
    console.log('  !l <message> - Use Ollama');
    console.log('  exit - Quit the program\n');

    rl.on('line', async (input) => {
      if (input.toLowerCase() === 'exit') {
        console.log('Exiting...');
        rl.close();
        return;
      }

      try {
        let provider: LLMProvider;
        let userInput: string;

        if (input.startsWith('!o ')) {
          provider = 'openai';
          userInput = input.slice(3);
        } else if (input.startsWith('!a ')) {
          provider = 'anthropic';
          userInput = input.slice(3);
        } else if (input.startsWith('!l ')) {
          provider = 'ollama';
          userInput = input.slice(3);
        } else {
          console.log('Please prefix with !o, !a, or !l to select the API');
          return;
        }

        const relevantMemories = selectRelevantMemories(
          Object.values(memoryGraph.memories),
          userInput
        );

        console.log(`Selected ${relevantMemories.length} relevant memories`);

        const formattedMemories = relevantMemories
          .map((mem) => `[${mem.creation_date}] ${mem.core_memory}`)
          .join('\n');

        const prompt = generatePrompt(soul, formattedMemories);
        console.log(`Using ${provider.toUpperCase()}...`);

        const response = await getAIResponse(provider, prompt, userInput);
        console.log('\nBot:', response);
      } catch (error) {
        console.error('Error getting response:', error);
        console.log('\nBot: Sorry, I encountered an error. Please try again.');
      }
    });
  } catch (error) {
    console.error('Failed to start chat:', error);
    console.error(
      'Error details:',
      error instanceof Error ? error.message : error
    );
    rl.close();
  }
}

console.log('CLI module loaded');
main().catch(console.error);
