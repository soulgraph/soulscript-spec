import { z } from 'zod';

export const MemoryFragmentSchema = z.array(z.union([
  z.object({
    type: z.literal('observation'),
    content: z.string(),
    timestamp: z.number(),
    importance: z.number().min(0).max(1),
    emotional_valence: z.number().min(-1).max(1),
    context: z.object({
      topic: z.string(),
      user_state: z.string(),
      agent_state: z.string().optional(),
      interaction_type: z.string().optional(),
    }),
  }),
  z.object({
    type: z.literal('reflection'),
    content: z.string(),
    timestamp: z.number(),
    importance: z.number().min(0).max(1),
    emotional_valence: z.number().min(-1).max(1),
    context: z.object({
      insight_type: z.enum(['relationship_development', 'user_preference', 'learning_style']),
      personality_trait: z.string(),
    }),
  }),
]));

export const EmotionalSignatureSchema = z.object({
  valence: z.number().min(-1).max(1),
  intensity: z.number().min(0).max(1),
});

export const MetadataSchema = z.object({
  topic_tags: z.array(z.string()).optional(),
  personality_influence: z.array(z.string()).optional(),
  memory_type: z.string().optional(),
});

export const ConsolidatedMemorySchema = z.object({
  id: z.string(),
  core_memory: z.string(),
  fragments: z.array(MemoryFragmentSchema),
  connections: z.array(z.string()),
  emotional_signature: EmotionalSignatureSchema,
  importance_score: z.number().min(0).max(1),
  creation_date: z.number(),
  last_accessed: z.number(),
  metadata: z.any().optional(),
});

export const BaseTraitsSchema = z.object({
  empathy: z.number(),
  patience: z.number(),
  analytical: z.number(),
  last_evolution: z.number(),
});

export const PersonalityStateSchema = z.object({
  base_traits: BaseTraitsSchema,
});

export const IndicesSchema = z.object({
  temporal: z.record(z.string(), z.number()),
  emotional: z.record(z.string(), z.number()),
  semantic: z.record(z.string(), z.array(z.string())),
});

export const StatsSchema = z.object({
  total_memories: z.number(),
  last_consolidation: z.number(),
});

export const MemoryGraphSchema = z.object({
  memories: z.record(z.string(), ConsolidatedMemorySchema),
  personality_state: PersonalityStateSchema.optional(),
  indices: IndicesSchema.optional(),
  stats: StatsSchema.optional(),
});
