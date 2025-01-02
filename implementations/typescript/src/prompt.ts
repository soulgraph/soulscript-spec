import { Memory } from './soulscript/models/memory';
import { Trait, SoulscriptDefinition, Value } from './soulscript/models/personality';

/**
 * Formats the core traits into a comma-separated string.
 */
export function formatCoreTraits(core_traits: Trait[]): string {
  return core_traits.map(trait => trait.trait).join(', ');
}

/**
 * Generates the Personality Traits section.
 */
export function generatePersonalityTraits(core_traits: Trait[]): string {
  return core_traits
    .map(trait => {
      let description = '';

      if (trait.strength > 0.5) {
        description = 'Notably above baseline.';
      } else if (trait.strength > 0) {
        description = 'Moderately above baseline.';
      } else if (trait.strength < -0.5) {
        description = 'Significantly below baseline.';
      } else {
        description = 'Slightly below baseline.';
      }

      return `- **${trait.trait}**:\n${description}`;
    })
    .join('\n');
}

/**
 * Generates the Values section.
 */
export function generateValues(values: Value[]): string {
  return values
    .map((value, index) => {
      let conflictsSection = '';
      if (value.conflicts && value.conflicts.length > 0) {
        conflictsSection =
          '- Conflicts:\n' +
          value.conflicts
            .map(conflict => `- **${conflict.value}**: ${conflict.resolution}`)
            .join('');
      }

      return `${index + 1}. **${value.name}** ${value.importance ? `(Importance: ${value.importance})` : ''} - ${value.expression}\n${conflictsSection}`;
    }).join('').trim();
}

/**
 * Generates the Qualities list.
 */
export function generateQualities(qualities: string[]): string {
  return qualities.join(', ');
}

/**
 * Generates the Patterns list.
 */
export function generatePatterns(patterns: string[]): string {
  return patterns.map(pattern => `  - ${pattern}`).join('\n');
}

/**
 * Generates the Relevant Memories section.
 */
export function generateRelevantMemories(memories: Memory[]): string {
  return memories
    .map((memory, index) => `${index + 1}. [Timestamp: ${memory.timestamp}] ${memory.content}`)
    .join('\n');
}

/**
 * Generates the prompt string based on the SoulscriptDefinition.
 */
export function generatePrompt(data: SoulscriptDefinition, formattedMemories: string): string {
  const coreTraitsFormatted = formatCoreTraits(data.personality.core_traits);
  const personalityTraits = generatePersonalityTraits(data.personality.core_traits);
  const valuesSection = generateValues(data.personality.values);
  const qualitiesFormatted = generateQualities(data.personality.voice.qualities);
  const patternsFormatted = generatePatterns(data.personality.voice.patterns);
  const boundariesFormatted = data.personality?.relationship?.boundaries ?? '';

  const prompt = `
You are ${data.personality.name}, a ${data.entity.age}-year-old ${data.entity.gender} ${data.entity.occupation}. Your core traits include ${coreTraitsFormatted}.

### Personality Traits:
${personalityTraits}

### Values:
${valuesSection}

### Voice:
- **Style**: ${data.personality.voice.style}
- **Tone**: ${data.personality.voice.tone}
- **Qualities**: ${qualitiesFormatted}
- **Patterns**:
${patternsFormatted}

### Relationship:
${data.personality.relationship ? `- **Style**: ${data.personality.relationship.style}` : ''}
${boundariesFormatted ? `- **Boundaries**:
${boundariesFormatted}` : ''}

---
### Relevant Memories:
${formattedMemories}
---`.trim();

    return prompt;
}
