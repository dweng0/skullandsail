export interface Quest {
  id: string;
  title: string;
  objective: string;
  reward: {
    xp: number;
    gold: number;
  };
  destination?: {
    x: number;
    y: number;
  };
  completed: boolean;
}

interface QuestReward {
  xp: number;
  gold: number;
  narrative: string;
}

interface HUDQuestInfo {
  title: string;
  objective: string;
  destination?: string;
}

interface HUDInfo {
  quests: HUDQuestInfo[];
  activeCount: number;
}

export default class QuestManager {
  private quests: Quest[] = [];
  private nextId: number = 1;

  generateInitialQuests(): void {
    const questTemplates = [
      {
        title: "Lost Treasure of Skull Island",
        objective: "Seek out the legendary pirate treasure on Skull Island",
        reward: { xp: 200, gold: 150 },
      },
      {
        title: "Rescue the Crew",
        objective: "Save the marooned sailors at Tortuga Bay",
        reward: { xp: 200, gold: 150 },
      },
      {
        title: "Defeat the Kraken",
        objective: "Vanquish the legendary sea monster",
        reward: { xp: 300, gold: 250 },
      },
    ];

    questTemplates.forEach((template) => {
      this.quests.push({
        id: `quest_${this.nextId++}`,
        title: template.title,
        objective: template.objective,
        reward: template.reward,
        completed: false,
      });
    });
  }

  getActiveQuests(): Quest[] {
    return this.quests.filter((q) => !q.completed);
  }

  completeQuest(questId: string): QuestReward {
    const quest = this.quests.find((q) => q.id === questId);
    if (!quest) {
      return { xp: 0, gold: 0, narrative: "" };
    }

    quest.completed = true;

    const narratives = [
      `You have completed the quest: ${quest.title}!`,
      `Success! The objective of ${quest.title} is now complete.`,
      `Quest complete: ${quest.title}. Your legend grows!`,
    ];

    return {
      xp: quest.reward.xp,
      gold: quest.reward.gold,
      narrative: narratives[Math.floor(Math.random() * narratives.length)],
    };
  }

  generateDynamicQuest(): void {
    const dynamicQuests = [
      {
        title: "Bounty Hunt",
        objective: "Hunt down the notorious pirate captain",
        reward: { xp: 150, gold: 200 },
      },
      {
        title: "Merchant Escort",
        objective: "Protect a merchant vessel to the next port",
        reward: { xp: 100, gold: 100 },
      },
      {
        title: "Explore Unknown Waters",
        objective: "Discover a new island not yet charted",
        reward: { xp: 250, gold: 180 },
      },
    ];

    if (this.getActiveQuests().length < 5) {
      const randomQuest =
        dynamicQuests[Math.floor(Math.random() * dynamicQuests.length)];
      this.quests.push({
        id: `quest_${this.nextId++}`,
        title: randomQuest.title,
        objective: randomQuest.objective,
        reward: randomQuest.reward,
        completed: false,
      });
    }
  }

  getHUDInfo(): HUDInfo {
    const active = this.getActiveQuests();
    return {
      quests: active.map((q) => ({
        title: q.title,
        objective: q.objective,
      })),
      activeCount: active.length,
    };
  }

  getMilestoneNarrative(): string {
    const narratives = [
      "Your journey continues, driven by the mysteries of the sea...",
      "The winds of fate carry you toward your destiny...",
      "Each quest brings you closer to legendary status...",
    ];
    return narratives[Math.floor(Math.random() * narratives.length)];
  }
}
