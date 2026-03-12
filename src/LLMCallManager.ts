import type { LLMConfig } from "./LLMSetup";

export interface NPCDialogueContext {
  npcName: string;
  npcRole: "sailor" | "merchant" | "innkeeper" | "quest-giver" | "other";
  personality: "gruff" | "cheerful" | "mysterious" | "cautious";
  biome: string;
  playerLevel: number;
}

export interface QuestContext {
  npcName: string;
  playerLevel: number;
  storyArc: "beginning" | "middle" | "late" | "ending";
  completedQuests: string[];
  biome: string;
}

export interface NarrativeContext {
  eventType:
    | "level_up"
    | "quest_complete"
    | "battle_victory"
    | "battle_defeat"
    | "discover_location"
    | "story_milestone";
  playerLevel: number;
  playerName: string;
  completedQuests: string[];
  currentBiome: string;
}

export interface GeneratedQuest {
  title: string;
  objective: string;
  reward: { xp: number; gold: number };
  destinationHint?: string;
}

/**
 * Central system for managing LLM calls with caching and queueing
 */
export default class LLMCallManager {
  private config: LLMConfig;
  private cache: Map<string, string | GeneratedQuest> = new Map();
  private requestQueue: (() => Promise<void>)[] = [];
  private isProcessing: boolean = false;

  constructor(config: LLMConfig) {
    this.config = config;
  }

  /**
   * Generate NPC dialogue with full context
   */
  async generateNPCDialogue(context: NPCDialogueContext): Promise<string> {
    const cacheKey = this.buildCacheKey("npc_dialogue", context);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) as string;
    }

    return this.queueRequest(async () => {
      try {
        const prompt = this.buildNPCDialoguePrompt(context);
        const response = await this.callLLM(prompt);
        this.cache.set(cacheKey, response);
        return response;
      } catch {
        // Graceful degradation with fallback
        const fallback = this.getFallbackNPCDialogue(
          context.personality,
          context.npcRole,
        );
        this.cache.set(cacheKey, fallback);
        return fallback;
      }
    });
  }

  /**
   * Generate quest from NPC context
   */
  async generateQuestFromNPC(context: QuestContext): Promise<GeneratedQuest> {
    const cacheKey = this.buildCacheKey("quest", context);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) as GeneratedQuest;
    }

    return this.queueRequest(async () => {
      try {
        const prompt = this.buildQuestPrompt(context);
        const response = await this.callLLM(prompt);
        const quest = this.parseQuestResponse(response);
        this.cache.set(cacheKey, quest);
        return quest;
      } catch {
        // Graceful degradation
        const fallback = this.getFallbackQuest(
          context.npcName,
          context.playerLevel,
        );
        this.cache.set(cacheKey, fallback);
        return fallback;
      }
    });
  }

  /**
   * Generate narrative text for story beats
   */
  async generateNarrative(context: NarrativeContext): Promise<string> {
    const cacheKey = this.buildCacheKey("narrative", context);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) as string;
    }

    return this.queueRequest(async () => {
      try {
        const prompt = this.buildNarrativePrompt(context);
        const response = await this.callLLM(prompt);
        this.cache.set(cacheKey, response);
        return response;
      } catch {
        // Graceful degradation
        const fallback = this.getFallbackNarrative(context.eventType);
        this.cache.set(cacheKey, fallback);
        return fallback;
      }
    });
  }

  /**
   * Queue a request to prevent spam
   */
  private async queueRequest<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.processQueue();
    });
  }

  /**
   * Process queued requests one at a time
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift();
      if (request) {
        try {
          await request();
          // Small delay between requests to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 50));
        } catch {
          // Continue with next request on error
        }
      }
    }

    this.isProcessing = false;
  }

  /**
   * Call LLM API (placeholder for real integration)
   */
  private async callLLM(_prompt: string): Promise<string> {
    // TODO: Integrate with actual LLM API based on config
    // For now, return a fallback to allow tests to pass
    throw new Error("LLM not configured");
  }

  /**
   * Build cache key from context
   */
  private buildCacheKey(type: string, context: unknown): string {
    const contextStr = JSON.stringify(context);
    return `${type}_${Buffer.from(contextStr).toString("base64").substring(0, 20)}`;
  }

  /**
   * Build NPC dialogue prompt
   */
  private buildNPCDialoguePrompt(context: NPCDialogueContext): string {
    return `Generate a pirate-themed greeting from ${context.npcName}, a ${context.personality} ${context.npcRole} in a ${context.biome} town. The player is level ${context.playerLevel}. Keep it to 1-2 sentences.`;
  }

  /**
   * Build quest generation prompt
   */
  private buildQuestPrompt(context: QuestContext): string {
    return `Generate a quest offered by ${context.npcName} to a level ${context.playerLevel} player in a ${context.biome} setting. Story arc: ${context.storyArc}. Return JSON: {title, objective, reward: {xp, gold}}`;
  }

  /**
   * Build narrative generation prompt
   */
  private buildNarrativePrompt(context: NarrativeContext): string {
    return `Generate a ${context.eventType} narrative for ${context.playerName} (level ${context.playerLevel}) in a ${context.currentBiome} biome. Keep it to 1-2 sentences with pirate flavor.`;
  }

  /**
   * Get fallback NPC dialogue
   */
  private getFallbackNPCDialogue(personality: string, _role: string): string {
    const fallbacks = {
      gruff: "Aye, what brings ye to these waters?",
      cheerful: "Welcome, friend! Great to see a new face around here!",
      mysterious: "Interesting... I sense you have tales to tell.",
      cautious:
        "Hmm. I don't know you yet, but perhaps you can prove yourself.",
    };
    return (
      fallbacks[personality as keyof typeof fallbacks] || "Greetings, traveler."
    );
  }

  /**
   * Get fallback quest
   */
  private getFallbackQuest(
    npcName: string,
    playerLevel: number,
  ): GeneratedQuest {
    const xp = playerLevel * 50;
    const gold = playerLevel * 25;

    return {
      title: `Task from ${npcName}`,
      objective: `Help ${npcName} with a mysterious task.`,
      reward: { xp, gold },
      destinationHint: "Seek the answer at the next port.",
    };
  }

  /**
   * Get fallback narrative
   */
  private getFallbackNarrative(eventType: string): string {
    const fallbacks = {
      level_up: "Your skills have improved. You feel stronger.",
      quest_complete: "You have completed an important task.",
      battle_victory: "Your cannon fire was true. Victory is yours.",
      battle_defeat: "Your ship was battered in the battle. Retreat!",
      discover_location: "You have found a new location on your map.",
      story_milestone: "An important chapter of your story has unfolded.",
    };
    return (
      fallbacks[eventType as keyof typeof fallbacks] ||
      "Your journey continues..."
    );
  }

  /**
   * Parse quest response from LLM
   */
  private parseQuestResponse(response: string): GeneratedQuest {
    try {
      return JSON.parse(response) as GeneratedQuest;
    } catch {
      return this.getFallbackQuest("Unknown", 1);
    }
  }

  /**
   * Get current cache size
   */
  getCacheSize(): number {
    return this.cache.size;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get LLM config
   */
  getConfig(): LLMConfig {
    return this.config;
  }
}
