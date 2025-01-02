import { ConsolidatedMemory, Memory } from '../soulscript/models/memory'

/**
 * Selects relevant memories based on user input
 * @param memories - Array of ConsolidatedMemory objects.
 * @param userInput - User's input text.
 * @param maxMemories - Maximum number of memories to select.
 * @returns Array of selected Memory objects.
 */
export function selectRelevantMemories(
    memories: ConsolidatedMemory[],
    userInput: string,
    maxMemories: number = 5
  ): ConsolidatedMemory[] {
  
    // TODO: Relavancy scoring
    const relevantMemories = memories.filter((memory) => {
        // Combine content from all fragments
        return memory.fragments.map((frag) => frag.content).join(' ');
      });
  
    // Sort by importance_score descending, then by last_accessed descending
    relevantMemories.sort((a, b) => {
      if (b.importance_score !== a.importance_score) {
        return b.importance_score - a.importance_score;
      }
      return b.last_accessed - a.last_accessed;
    });
  
    return relevantMemories.slice(0, maxMemories);
  }

