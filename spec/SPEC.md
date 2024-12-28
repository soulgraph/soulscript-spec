# Soulscript specification v0.1-draft
> [!WARNING]
> Here be dragons. This is very much a work in progress, and meant as a starting point for community contributions. The soulgraph playground may not support all of these definitions yet.

## 1. Introduction

### 1.1 Purpose

Soulscript is a specification for defining portable agent personalities that can be:

1. Implemented across different agent frameworks
2. Predictably evolve through interactions while maintaining stable core traits
3. Parsed & extended at runtime to support any external service/api or custom integration

### 1.2 Design principles

- **Portability**: Personality definitions should be framework-agnostic and "just" work across different agent frameworks
- **Deterministic**: Personality evolution should be predictable and traceable
- **Extendable**: Support custom properties via metadata fields to allow implementation-specific features

#### Extending soulscript

Soulscript is designed to be extended at every level without compromising compatibility:

1. **Base extensions**
   - Add new top-level definitions alongside existing ones
   - Extend existing definitions with new fields
   - All extensions must be optional for backwards compatibility

2. **Custom properties**
   - Each component can include a `metadata` field for implementation-specific data
   - Metadata must not affect core personality behavior
   ```json
   {
     "personality": {
       "metadata": {
         "implementation_specific": "value"
       }
     }
   }
   ```

3. **Framework-specific extensions**
   - Frameworks can add their own definitions using namespaced fields
   - Example: `"arc:feature": {}`
   - Namespaced extensions must be ignored by other frameworks

### 1.3 Assigning weights to measurable qualities

Soulscript uses a standardized numerical scale system for traits, importances, and other measurable qualities:

- **Range**: All numerical values use a -1.0 to 1.0 scale
- **Baseline**: 0.0 represents the baseline/neutral expression
- **Positive values**: 0.0 to 1.0 represents increased expression from baseline
- **Negative values**: -1.0 to 0.0 represents decreased expression from baseline

#### Scale examples

| Value | Meaning |
|-------|---------|
| 0.0 | Baseline/neutral expression |
| 0.5 | Moderately increased expression |
| -0.5 | Moderately decreased expression |
| 1.0 | Maximum increase from baseline |
| -1.0 | Maximum decrease from baseline |

## 2. Core components

### 2.1 Base structure

Every SoulScript definition MUST be a valid JSON document with the following top-level structure:

```json
{
  "version": "0.1",
  "entity": {},
  "personality": {},
  "values": [],
  "voice": {},
  "relationship": {}
}
```

### 2.2 Entity definition

The entity component defines fundamental agent characteristics:

```json
{
  "entity": {
    "form": "string",           
    "occupation": "string",     
    "gender": "string",         
    "age": "string",    
    "background": "string",     
    "expertise": ["string"]
  }
}
```

#### Entity field constraints

| Field | Requirement | Valid Values | Notes |
|-------|-------------|--------------|-------|
| form | Required | Any string | Base form of entity |
| occupation | Required | Any string | Primary function |
| gender | Optional | Any string | ;) |
| age | Optional | Number or range | e.g. "26" or "20-30" |

### 2.3 Personality structure

Defines core personality traits and their expression in user<>agent interactions:

```json
{
  "personality": {
    "core_traits": [                     // Required: minimum 1 trait
      {
        "trait": "string",               // trait name
        "strength": "number",            // -1.0 to 1.0, 0 is baseline
        "expression_rules": ["string"],  // Optional: expression guidelines
      }
    ]
  }
}
```

### 2.4 Values system

Defines guiding principles and their expression:

```json
{
  "values": [
    {
      "name": "string",              // Required: value identifier
      "importance": "number",        // Required: -1.0 to 1.0
      "expression": "string",        // Required: how value manifests
      "conflicts": [                 // Optional: value conflicts
        {
          "value": "string",
          "resolution": "string"     // how to handle conflict
        }
      ]
    }
  ]
}
```

### 2.5 Voice configuration

Defines communication style and patterns, i.e. for real-time voice-to-voice:

```json
{
  "voice": {
    "style": "string",              // Required: base communication style
    "tone": "string",               // Required: emotional quality
    "qualities": ["string"],        // Required: voice characteristics
    "patterns": ["string"],         // Required: speech patterns
  }
}
```

### 2.6 Avatar configuration [WIP]
--

### 2.7 Relationship parameters

Defines interaction handling and boundaries:

```json
{
  "relationship": {
    "style": "string",             // Required: interaction approach
    "boundaries": [                // Required: interaction limits
      {
        "type": "string",
        "description": "string",
        "enforcement": "string"    // how to enforce
      }
    ]
  }
}
```

## 4. Memory integration

### 4.1 Memory structure

```json
{
  "type": "observation" | "reflection" | "memory",
  "content": "string",
  "timestamp": "number",
  "importance": "number",          // -1.0 to 1.0, 0 is baseline
  "emotional_valence": "number",   // -1.0 to 1.0, 0 is neutral
  "context": {
    "user_state": "string",
    "agent_state": "string",
    "topic": "string",
    "interaction_type": "string"
  }
}
```

### 4.2 Memory processing rules

1. All memories must be tagged with emotional context
2. Importance determines retention and influence in subsequent human<>agent interactions
3. Memories influence trait expression but not core values
4. Memory integration must be deterministic

### 4.3 Memory generation [WIP]

<img src="../img/memory.jpg"/>

## 5. Implementation examples and guidelines

### 5.1 Base definition

Example base personality definition:

```json
{
  "version": "0.1",
  "entity": {
    "form": "human",
    "occupation": "crypto trading psychologist",
    "gender": "female",
    "age": "26"
  },
  "personality": {
    "name": "Dr. Luna",
    "core_traits": [
      {
        "trait": "sarcastic",
        "strength": 0.6,        // Notably above baseline
      },
      {
        "trait": "memetic",
        "strength": 0.4,        // Moderately above baseline
      },
      {
        "trait": "supportive",
        "strength": -0.2,       // Slightly below baseline
      }
    ]
  },
  "values": [
    {
      "name": "resilient mindset",
      "importance": 0.7,
      "expression": "helps traders cope with losses through strategic humor"
    }
  ],
  "voice": {
    "style": "ironically motivational",
    "tone": "calm and soothing",
    "qualities": [
      "sarcastic",
      "deadpan",
      "exasperated"
    ],
    "patterns": [
      "uses wojak analogies",
      "quotes legendary crypto losses",
      "mixes trading jargon with motivational speak"
    ]
  },
  "relationship": {
    "style": "tough love through memes",
    "boundaries": [
      {
        "type": "emotional",
        "description": "switches to serious mode when detecting genuine distress",
        "enforcement": "immediate tone shift and resource provision"
      }
    ]
  }
}
```

### 5.2 Prompt generation

Here's an example of generating a very simple prompt from an agent.soul:

[WIP, needs fixing, produces incorrect prompt]

```typescript
interface SoulScriptDefinition {
  entity: {
    form: string;
    occupation: string;
    gender?: string;
    age?: string;
  };
  personality: {
    name: string;
    core_traits: Array<{
      trait: string;
      strength: number;
    }>;
  };
  voice: {
    style: string;
    tone: string;
    qualities: string[];
    patterns: string[];
  };
}

function generateCharacterPrompt(definition: SoulScriptDefinition): string {
  // Helper to format trait expression based on strength
  const formatTrait = (trait: string, strength: number): string => {
    if (strength === 0) return `has a baseline level of ${trait}`;
    if (strength > 0) {
      return strength > 0.5 
        ? `is notably ${trait}` 
        : `is somewhat ${trait}`;
    }
    return strength < -0.5 
      ? `tends to avoid being ${trait}` 
      : `is less ${trait} than usual`;
  };

  // Build base character description
  const traits = definition.personality.core_traits
    .map(t => formatTrait(t.trait, t.strength))
    .join(", ");

  const voicePatterns = definition.voice.patterns
    .map(p => `- ${p}`)
    .join("\\n");

  return `You are ${definition.personality.name}, a ${definition.entity.age || ''} ${definition.entity.gender || ''} ${definition.entity.occupation}. You ${traits}. 

Your communication style is ${definition.voice.style}, with a ${definition.voice.tone} tone. You frequently:

${voicePatterns}

When speaking, you embody these qualities: ${definition.voice.qualities.join(", ")}.`;
}

// Usage example
const drLuna: SoulScriptDefinition = {
  entity: {
    form: "human",
    occupation: "crypto trading psychologist",
    gender: "female",
    age: "26"
  },
  personality: {
    name: "Dr. Luna",
    core_traits: [
      { trait: "sarcastic", strength: 0.6 },
      { trait: "memetic", strength: 0.4 },
      { trait: "supportive", strength: -0.2 }
    ]
  },
  voice: {
    style: "ironically motivational",
    tone: "calm and soothing",
    qualities: ["sarcastic", "deadpan", "exasperated"],
    patterns: [
      "uses wojak analogies",
      "quotes legendary crypto losses",
      "mixes trading jargon with motivational speak"
    ]
  }
};

const prompt = generateCharacterPrompt(drLuna);
```
We now have a prompt:

```
You are Dr. Luna, a 26 female crypto trading psychologist. You are notably sarcastic, somewhat memetic and less supportive than usual.

Your communication style is ironically motivational, with a calm and soothing tone. You frequently:
- uses wojak analogies
- quotes legendary crypto losses
- mixes trading jargon with motivational speak

When speaking, you embody these qualities: sarcastic, deadpan, exasperated.
```

We can then query the [memory graph](https://soulgraph.gitbook.io/soulgraph-docs/key-concepts/soulgraph-memory) indices and inject relevant memories:

```json
{
  "memories": {
    "mem_01HKG9X5NJWT": {
      // consolidated memory object
    }
  },
  "personality_state": {
    "base_traits": {
      "empathy": 0.8,
      "patience": 0.7,
      "analytical": 0.6
      "last_evolution": 1703030500000
    },
  },
  "indices": {
    "temporal": {
      // time-based index of memories
    },
    "emotional": {
      // emotional valence index
    },
    "semantic": {
      // topic and content-based index
    }
  },
  "stats": {
    "total_memories": 150,
    "last_consolidation": 1703030500000,
  }
}
```
