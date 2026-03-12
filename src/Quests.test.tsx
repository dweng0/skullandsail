import { describe, it, expect, afterEach } from "vitest";
import QuestManager from "./QuestManager";

describe("Quests (LLM Game Master)", () => {
  afterEach(() => {
    // Cleanup
  });

  it("At game start, LLM generates 3 initial quests", () => {
    // Verify that game start creates 3 quests
    const manager = new QuestManager();
    manager.generateInitialQuests();

    const quests = manager.getActiveQuests();
    expect(quests.length).toBe(3);

    quests.forEach((quest) => {
      expect(quest.title).toBeDefined();
      expect(quest.objective).toBeDefined();
      expect(quest.reward).toBeDefined();
    });
  });

  it("Completing quest awards XP, gold, and triggers narrative", () => {
    // Verify that quest completion gives rewards
    const manager = new QuestManager();
    manager.generateInitialQuests();

    const quest = manager.getActiveQuests()[0];
    const reward = manager.completeQuest(quest.id);

    expect(reward.xp).toBeGreaterThan(0);
    expect(reward.gold).toBeGreaterThan(0);
    expect(reward.narrative).toBeDefined();
  });

  it("New quests can be generated dynamically by LLM", () => {
    // Verify that new quests can be generated mid-game
    const manager = new QuestManager();
    manager.generateInitialQuests();

    const initialCount = manager.getActiveQuests().length;
    manager.generateDynamicQuest();

    const newCount = manager.getActiveQuests().length;
    expect(newCount).toBeGreaterThan(initialCount);
  });

  it("Quest objectives appear in HUD log", () => {
    // Verify that quest info is available for display
    const manager = new QuestManager();
    manager.generateInitialQuests();

    const hudInfo = manager.getHUDInfo();
    expect(hudInfo.quests).toBeDefined();
    expect(hudInfo.quests.length).toBe(3);

    hudInfo.quests.forEach((quest) => {
      expect(quest.title).toBeDefined();
      expect(quest.objective).toBeDefined();
    });
  });

  it("LLM narrates major story milestones", () => {
    // Verify that quest milestones have narrative text
    const manager = new QuestManager();
    manager.generateInitialQuests();

    const narrative = manager.getMilestoneNarrative();
    expect(narrative).toBeDefined();
    expect(typeof narrative).toBe("string");
    expect(narrative.length).toBeGreaterThan(0);
  });
});
