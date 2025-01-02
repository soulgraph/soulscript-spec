import { z } from 'zod';

export const TraitSchema = z.object({
  trait: z.string(),
  strength: z.number().min(0).max(1),
  expression_rules: z.array(z.string()).optional(),
});

export const ConflictSchema = z.object({
  value: z.string(),
  resolution: z.string(),
});

export const BoundarySchema = z.object({
  type: z.string(),
  description: z.string(),
  enforcement: z.string(),
});

export const EntitySchema = z.object({
  form: z.string(),
  occupation: z.string(),
  gender: z.string(),
  age: z.string(),
  background: z.string().optional(),
  expertise: z.array(z.string()).optional(),
});

export const ValueSchema = z.object({
  name: z.string(),
  expression: z.string(),
  importance: z.number().min(0).max(1).optional(),
  conflicts: z.array(ConflictSchema).optional(),
});

export const VoiceSchema = z.object({
  style: z.string(),
  tone: z.string(),
  qualities: z.array(z.string()),
  patterns: z.array(z.string()),
});

export const RelationshipSchema = z.object({
  style: z.string(),
  boundaries: z.string(),
});

export const PersonalitySchema = z.object({
  name: z.string(),
  core_traits: z.array(TraitSchema).min(1),
  values: z.array(ValueSchema),
  voice: VoiceSchema,
  relationship: RelationshipSchema.optional(),
});

export const SoulscriptDefinitionSchema = z.object({
  entity: EntitySchema,
  personality: PersonalitySchema,
  version: z.string().optional()
});