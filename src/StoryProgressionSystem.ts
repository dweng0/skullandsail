export type StoryArc = "beginning" | "middle" | "late" | "ending";

export interface PlayerChoice {
  eventId: string;
  choice: string;
}

export interface MajorQuest {
  questId: string;
  title: string;
  playerLevel: number;
}

export interface StoryState {
  currentArc: StoryArc;
  majorQuestsCompleted: MajorQuest[];
  playerChoices: PlayerChoice[];
  journalBeat: string[];
  unlockedAreas: string[];
}

/**
 * System for tracking narrative arc progression and player choices
 */
export default class StoryProgressionSystem {
  private currentArc: StoryArc = "beginning";
  private majorQuestsCompleted: MajorQuest[] = [];
  private playerChoices: PlayerChoice[] = [];
  private journalBeats: Array<{ id: string; narrative: string }> = [];
  private unlockedAreas: string[] = [];

  /**
   * Get current story arc state
   */
  getCurrentArc(): StoryArc {
    return this.currentArc;
  }

  /**
   * Get valid arc states
   */
  getValidArcStates(): StoryArc[] {
    return ["beginning", "middle", "late", "ending"];
  }

  /**
   * Progress the story arc
   */
  progressArc(newArc: StoryArc): void {
    this.currentArc = newArc;
    this.unlockedAreas.push(`area_${newArc}`);
  }

  /**
   * Complete a major quest
   */
  completeMajorQuest(_questId: string, quest: MajorQuest): void {
    this.majorQuestsCompleted.push(quest);

    // Unlock new areas/quests based on completion
    if (this.majorQuestsCompleted.length >= 3) {
      this.progressArc("middle");
    }
    if (this.majorQuestsCompleted.length >= 6) {
      this.progressArc("late");
    }
    if (this.majorQuestsCompleted.length >= 10) {
      this.progressArc("ending");
    }
  }

  /**
   * Get available quest hooks for current arc
   */
  getAvailableQuestHooks(): string[] {
    const hooks = [
      `${this.currentArc}_quest_1: Explore the mysterious lands`,
      `${this.currentArc}_quest_2: Defeat the regional boss`,
      `${this.currentArc}_quest_3: Uncover the secret`,
    ];
    return hooks;
  }

  /**
   * Record a player choice
   */
  recordPlayerChoice(eventId: string, choice: string): boolean {
    this.playerChoices.push({ eventId, choice });
    return true;
  }

  /**
   * Get all player choices made
   */
  getPlayerChoices(): PlayerChoice[] {
    return [...this.playerChoices];
  }

  /**
   * Generate narrative for current arc
   */
  generateArcNarrative(): string {
    const arcNarratives = {
      beginning:
        "Your journey begins on humble seas. The world is vast and full of possibility.",
      middle:
        "Your reputation grows with each victory. The stakes have risen, and greater challenges await.",
      late: "You stand at the threshold of destiny. The final battle approaches.",
      ending:
        "This is the culmination of your voyage. Your choices have led you here.",
    };

    let narrative = arcNarratives[this.currentArc];

    // Add references to completed quests
    if (this.majorQuestsCompleted.length > 0) {
      const latestQuest =
        this.majorQuestsCompleted[this.majorQuestsCompleted.length - 1];
      narrative += ` You remember ${latestQuest.title}.`;
    }

    return narrative;
  }

  /**
   * Generate context-aware dialogue for NPCs
   */
  generateContextAwareDialogue(npcType: string): string {
    const baseDialogues = {
      patron_npc: "I have another task for someone of your caliber.",
      tavern_keeper: "The tavern is quiet tonight. Strange times we live in.",
      merchant: "Your reputation precedes you. I have something special.",
    };

    let dialogue =
      baseDialogues[npcType as keyof typeof baseDialogues] ||
      "Well met, traveler.";

    // Personalize based on choices
    if (this.playerChoices.some((c) => c.eventId.includes("rescue"))) {
      dialogue = "They say you have a good heart. I respect that.";
    } else if (this.playerChoices.some((c) => c.eventId.includes("attack"))) {
      dialogue = "I hear you're ruthless. That could be useful.";
    }

    return dialogue;
  }

  /**
   * Get narrative for story arc milestone
   */
  getMilestoneNarrative(): string {
    const milestones = {
      beginning:
        "Your reputation spreads across the seas. You are no longer unknown.",
      middle:
        "Word of your deeds reaches distant lands. Heroes are born, not made.",
      late: "You are spoken of in legends. Your final chapter awaits.",
      ending: "This is your moment. Everything has led to this point.",
    };

    return milestones[this.currentArc] || "Your journey continues...";
  }

  /**
   * Generate ending narrative based on choices and progress
   */
  generateEndingNarrative(): string {
    const baseEnding =
      "Your voyage has come full circle. The sea has been your teacher and your home.";

    let ending = baseEnding;

    // Vary based on player choices
    const mercyChoices = this.playerChoices.filter((c) =>
      c.choice.toLowerCase().includes("mercy"),
    );
    const vengefulChoices = this.playerChoices.filter((c) =>
      c.choice.toLowerCase().includes("vengeance"),
    );

    if (mercyChoices.length > vengefulChoices.length) {
      ending += " You chose compassion, and the world remembers your kindness.";
    } else if (vengefulChoices.length > mercyChoices.length) {
      ending +=
        " You took what you felt was rightfully yours, and none can gainsay it.";
    } else {
      ending += " You walked a balanced path, neither pure light nor shadow.";
    }

    // Add legacy based on major quests
    ending += ` You completed ${this.majorQuestsCompleted.length} major tasks.`;

    return ending;
  }

  /**
   * Log a major story beat
   */
  logStoryBeat(beatId: string, narrative: string): void {
    this.journalBeats.push({ id: beatId, narrative });
  }

  /**
   * Get story journal
   */
  getStoryJournal(): string[] {
    return this.journalBeats.map(
      (beat) => `[${beat.id}] ${beat.narrative.substring(0, 100)}...`,
    );
  }

  /**
   * Serialize for save file
   */
  serialize(): StoryState {
    return {
      currentArc: this.currentArc,
      majorQuestsCompleted: [...this.majorQuestsCompleted],
      playerChoices: [...this.playerChoices],
      journalBeat: this.journalBeats.map((b) => b.narrative),
      unlockedAreas: [...this.unlockedAreas],
    };
  }

  /**
   * Deserialize from save file
   */
  deserialize(state: StoryState): void {
    this.currentArc = state.currentArc;
    this.majorQuestsCompleted = [...state.majorQuestsCompleted];
    this.playerChoices = [...state.playerChoices];
    this.journalBeats = state.journalBeat.map((narrative, index) => ({
      id: `beat_${index}`,
      narrative,
    }));
    this.unlockedAreas = [...state.unlockedAreas];
  }
}
