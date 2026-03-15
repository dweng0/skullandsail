/**
 * Test suite for StoryProgressionSystem
 */
import { describe, it, expect } from "vitest";
import StoryProgressionSystem from "./StoryProgressionSystem";
import { MajorQuest } from "./types";

// Mock quest data
const mockQuest1: MajorQuest = {
  id: "quest_1",
  title: "Defeat the First Enemy",
  description: "Defeat the first enemy ship.",
  reward: "100 gold coins",
};

const mockQuest2: MajorQuest = {
  id: "quest_2",
  title: "Rescue the Crew",
  description: "Rescue the captured crew members.",
  reward: "A rare compass",
};

const mockQuest3: MajorQuest = {
  id: "quest_3",
  title: "Find the Treasure Map",
  description: "Discover the lost treasure map.",
  reward: "500 gold coins",
};

const mockQuest4: MajorQuest = {
  id: "quest_4",
  title: "Battle the Kraken",
  description: "Fight the giant sea monster.",
  reward: "Kraken's tentacle as a trophy",
};

const mockQuest5: MajorQuest = {
  id: "quest_5",
  title: "Conquer the Island",
  description: "Take control of the island fortress.",
  reward: "Royal armor",
};

const mockQuest6: MajorQuest = {
  id: "quest_6",
  title: "Steal the Crown",
  description: "Infiltrate the royal palace and steal the crown.",
  reward: "Crown of the Sea King",
};

const mockQuest7: MajorQuest = {
  id: "quest_7",
  title: "Uncover the Secret",
  description: "Discover the truth behind the curse.",
  reward: "Ancient knowledge",
};

const mockQuest8: MajorQuest = {
  id: "quest_8",
  title: "Break the Curse",
  description: "Remove the ancient curse from the land.",
  reward: "The power to command the seas",
};

const mockQuest9: MajorQuest = {
  id: "quest_9",
  title: "Challenge the Pirate King",
  description: "Face the legendary pirate king in combat.",
  reward: "Pirate King's scepter",
};

const mockQuest10: MajorQuest = {
  id: "quest_10",
  title: "Rule the Seas",
  description: "Establish your dominance over all pirate factions.",
  reward: "The title of Supreme Admiral",
};

describe("StoryProgressionSystem", () => {
  it("initializes with beginning arc", () => {
    const storySystem = new StoryProgressionSystem();
    expect(storySystem.getCurrentArc()).toBe("beginning");
  });

  it("progresses arc after completing 3 quests", () => {
    const storySystem = new StoryProgressionSystem();
    storySystem.completeMajorQuest("defeat_first_enemy", mockQuest1);
    storySystem.completeMajorQuest("rescue_crew", mockQuest2);
    storySystem.completeMajorQuest("find_treasure_map", mockQuest3);
    expect(storySystem.getCurrentArc()).toBe("middle");
  });

  it("progresses arc after completing 6 quests", () => {
    const storySystem = new StoryProgressionSystem();
    storySystem.completeMajorQuest("defeat_first_enemy", mockQuest1);
    storySystem.completeMajorQuest("rescue_crew", mockQuest2);
    storySystem.completeMajorQuest("find_treasure_map", mockQuest3);
    storySystem.completeMajorQuest("battle_kraken", mockQuest4);
    storySystem.completeMajorQuest("conquer_island", mockQuest5);
    storySystem.completeMajorQuest("steal_crown", mockQuest6);
    expect(storySystem.getCurrentArc()).toBe("late");
  });

  it("progresses arc after completing 10 quests", () => {
    const storySystem = new StoryProgressionSystem();
    storySystem.completeMajorQuest("defeat_first_enemy", mockQuest1);
    storySystem.completeMajorQuest("rescue_crew", mockQuest2);
    storySystem.completeMajorQuest("find_treasure_map", mockQuest3);
    storySystem.completeMajorQuest("battle_kraken", mockQuest4);
    storySystem.completeMajorQuest("conquer_island", mockQuest5);
    storySystem.completeMajorQuest("steal_crown", mockQuest6);
    storySystem.completeMajorQuest("uncover_secret", mockQuest7);
    storySystem.completeMajorQuest("break_curse", mockQuest8);
    storySystem.completeMajorQuest("challenge_pirate_king", mockQuest9);
    storySystem.completeMajorQuest("rule_seas", mockQuest10);
    expect(storySystem.getCurrentArc()).toBe("ending");
  });

  it("gets valid arc states", () => {
    const storySystem = new StoryProgressionSystem();
    const validArcs = storySystem.getValidArcStates();
    expect(validArcs).toEqual(["beginning", "middle", "late", "ending"]);
  });

  it("records player choices", () => {
    const storySystem = new StoryProgressionSystem();
    const success = storySystem.recordPlayerChoice(
      "rescue_mission",
      "save_hostages",
    );
    expect(success).toBe(true);
    const choices = storySystem.getPlayerChoices();
    expect(choices.length).toBe(1);
    expect(choices[0]).toEqual({
      eventId: "rescue_mission",
      choice: "save_hostages",
    });
  });

  it("generates narrative based on current arc", () => {
    const storySystem = new StoryProgressionSystem();
    expect(storySystem.generateArcNarrative()).toContain("journey begins");

    storySystem.progressArc("middle");
    expect(storySystem.generateArcNarrative()).toContain("reputation grows");

    storySystem.progressArc("late");
    expect(storySystem.generateArcNarrative()).toContain(
      "threshold of destiny",
    );

    storySystem.progressArc("ending");
    expect(storySystem.generateArcNarrative()).toContain("culmination");
  });

  it("includes completed quest reference in narrative", () => {
    const storySystem = new StoryProgressionSystem();
    storySystem.completeMajorQuest("defeat_first_enemy", mockQuest1);
    const narrative = storySystem.generateArcNarrative();
    expect(narrative).toContain("Defeat the First Enemy");
  });

  it("generates context-aware dialogue for NPCs", () => {
    const storySystem = new StoryProgressionSystem();

    // Default dialogue
    let dialogue = storySystem.generateContextAwareDialogue("patron_npc");
    expect(dialogue).toBe("I have another task for someone of your caliber.");

    // Personalized based on choices
    storySystem.recordPlayerChoice("rescue_mission", "save_hostages");
    dialogue = storySystem.generateContextAwareDialogue("tavern_keeper");
    expect(dialogue).toBe("They say you have a good heart. I respect that.");

    storySystem.recordPlayerChoice("attack_mission", "destroy_ship");
    dialogue = storySystem.generateContextAwareDialogue("merchant");
    expect(dialogue).toBe("I hear you're ruthless. That could be useful.");
  });

  it("gets milestone narrative for current arc", () => {
    const storySystem = new StoryProgressionSystem();
    expect(storySystem.getMilestoneNarrative()).toContain("reputation spreads");

    storySystem.progressArc("middle");
    expect(storySystem.getMilestoneNarrative()).toContain(
      "deeds reaches distant lands",
    );

    storySystem.progressArc("late");
    expect(storySystem.getMilestoneNarrative()).toContain(
      "spoken of in legends",
    );

    storySystem.progressArc("ending");
    expect(storySystem.getMilestoneNarrative()).toContain("your moment");
  });

  it("generates ending narrative based on choices", () => {
    const storySystem = new StoryProgressionSystem();

    // Mercy-focused
    storySystem.recordPlayerChoice("final_choice", "mercy");
    const ending1 = storySystem.generateEndingNarrative();
    expect(ending1).toContain("compassion");
    expect(ending1).toContain("kindness");

    // Vengeance-focused
    storySystem.recordPlayerChoice("final_choice", "vengeance");
    const ending2 = storySystem.generateEndingNarrative();
    expect(ending2).toContain("took what you felt was rightfully yours");

    // Balanced
    storySystem.recordPlayerChoice("final_choice", "balance");
    const ending3 = storySystem.generateEndingNarrative();
    expect(ending3).toContain("walked a balanced path");
  });

  it("logs story beats and returns journal entries", () => {
    const storySystem = new StoryProgressionSystem();
    storySystem.logStoryBeat(
      "story_beat_1",
      "Your journey begins on humble seas.",
    );
    storySystem.logStoryBeat(
      "story_beat_2",
      "You complete your first major quest.",
    );

    const journal = storySystem.getStoryJournal();
    expect(journal.length).toBe(2);
    expect(journal[0]).toContain("story_beat_1");
    expect(journal[0]).toContain("journey begins");
    expect(journal[1]).toContain("story_beat_2");
    expect(journal[1]).toContain("first major quest");
  });

  it("serializes and deserializes state correctly", () => {
    const storySystem = new StoryProgressionSystem();
    storySystem.completeMajorQuest("defeat_first_enemy", mockQuest1);
    storySystem.completeMajorQuest("rescue_crew", mockQuest2);
    storySystem.recordPlayerChoice("rescue_mission", "save_hostages");
    storySystem.logStoryBeat(
      "story_beat_1",
      "Your journey begins on humble seas.",
    );

    const serialized = storySystem.serialize();

    const newSystem = new StoryProgressionSystem();
    newSystem.deserialize(serialized);

    expect(newSystem.getCurrentArc()).toBe("middle");
    expect(newSystem.getPlayerChoices().length).toBe(1);
    expect(newSystem.getStoryJournal().length).toBe(1);
  });
});
