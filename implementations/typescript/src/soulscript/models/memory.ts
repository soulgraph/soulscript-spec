export interface BaseTraits {
  [trait: string]: number;
  last_evolution: number;
}

export interface PersonalityState {
  base_traits: BaseTraits;
}

export interface Indices {
  temporal: {
    [memoryId: string]: number;
  };
  emotional: {
    [memoryId: string]: number;
  };
  semantic: {
    [memoryId: string]: string[];
  };
}

export interface Stats {
  total_memories: number;
  last_consolidation: number;
}

export interface EmotionalSignature {
  // Range: -1.0 - 1.0
  valence: number;
  // Range: 0.0 - 1.0
  intensity: number;
}

export interface Metadata {
  topic_tags: string[];
  personality_influence: string[];
  memory_type: string;
}

export interface ObservationFragment {
  type: 'observation';
  content: string;
  // Unix timestamp in milliseconds
  timestamp: number;
  // Range: 0.0 - 1.0
  importance: number;
  // Range: -1.0 - 1.0
  emotional_valence: number; 
  context: {
    topic: string;
    user_state: string;
    agent_state?: string;
    interaction_type?: string;
  };
}

export interface ReflectionFragment {
  type: 'reflection';
  content: string;
  // Unix timestamp in milliseconds
  timestamp: number;
  // Range: 0.0 - 1.0
  importance: number;
  // Range: -1.0 - 1.0
  emotional_valence: number;
  context: {
    insight_type: InsightType;
    personality_trait: string;
  };
}

export type MemoryFragment = ObservationFragment | ReflectionFragment;
export type InsightType = 'relationship_development' | 'user_preference' | 'learning_style' | string;

export interface ConsolidatedMemory {
  id: string;
  core_memory: string;
  fragments: MemoryFragment[];
  // Array of related memory IDs
  connections: string[];
  emotional_signature: EmotionalSignature;
  // Range: 0.0 - 1.0
  importance_score: number;
  // Unix timestamp in milliseconds
  creation_date: number;
  // Unix timestamp in milliseconds 
  last_accessed: number;
  metadata?: any;
}

export interface MemoryGraph {
  memories: {
    [memoryId: string]: ConsolidatedMemory;
  };
  personality_state?: PersonalityState;
  indices?: Indices;
  stats?: Stats;
}

export interface Memory {
  id: string;
  type: string;
  content: string;
  timestamp: number;
  importance: number;
  emotional_valence: number;
  context: MemoryContext;
}

export interface MemoryContext {
  user_state: string;
  agent_state: string;
  topic: string;
  interaction_type: string;
}