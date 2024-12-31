export interface Personality {
    name: string;
    core_traits: Trait[];
    values: Value[],
    voice: {
        style: string;
        tone: string;
        qualities: string[];
        patterns: string[];
    },
    relationship?: {
        style: string;
        boundaries: string;
    }
}

export interface Value {
    name: string;
    expression: string;
    importance?: number;
    conflicts?: Conflict[];
}

export interface Trait {
    trait: string;
    strength: number;
    expression_rules?: string[];
}

export interface Conflict {
    value: string;
    resolution: string;
}

export interface SoulscriptDefinition {
    entity: {
        form: string;
        occupation: string;
        gender: string;
        age: string;
        background?: string;
        expertise?: string[];
    }
    personality: Personality,
    version?: string;
}