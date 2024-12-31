import * as fs from 'fs-extra';
import { SoulscriptDefinition } from '../soulscript/models/personality';
import { SoulscriptDefinitionSchema } from '../soulscript/types/personality';
import { MemoryGraphSchema } from '../soulscript/types/memory';
import { MemoryGraph } from '../soulscript/models/memory';
import Handlebars from 'handlebars';

/**
 * Loads and validates the SoulscriptDefinition from a .soul file.
 * @param filePath - Path to the .soul file.
 * @returns Parsed SoulscriptDefinition object.
 */
export async function loadSoulscript(filePath: string): Promise<SoulscriptDefinition> {
  try {
    const rawData = await fs.readFile(filePath, 'utf-8');
    const jsonData = stripFirstLine(rawData);
    const parsed = JSON.parse(jsonData);
    const validation = SoulscriptDefinitionSchema.safeParse(parsed);
    
    if (!validation.success) {
      console.error('SoulscriptDefinition validation failed:', validation.error.errors);
      throw new Error('Invalid SoulscriptDefinition data.');
    }
    
    return validation.data;
  } catch (error) {
    console.error(`Failed to load SoulscriptDefinition from ${filePath}:`, error);
    throw error;
  }
}

export async function loadMemoryGraph(filePath: string): Promise<MemoryGraph> {
    try {
      const jsonData = await fs.readFile(filePath, 'utf-8');
      const parsed = JSON.parse(jsonData);
      const validation = MemoryGraphSchema.safeParse(parsed);
      // if (!validation.success) {
      //   console.error('MemoryGraph validation failed:', validation.error.errors);
      //   throw new Error('Invalid MemoryGraph data.');
      // }
      // return validation.data;
      return parsed;
    } catch (error) {
      console.error(`Failed to load MemoryGraph from ${filePath}:`, error);
      throw error;
    }
  }

/**
 * Helper function to remove the first line from the agent.soul file (JSON-Mode identifier).
 * @param data - Raw file content.
 * @returns JSON string without the first line.
 */
function stripFirstLine(data: string): string {
  const lines = data.split('\n');
  // Remove the first line
  const jsonLines = lines.slice(1);
  return jsonLines.join('\n');
}
  