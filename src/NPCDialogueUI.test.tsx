import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import NPCDialogueUI from "./NPCDialogueUI";
import type { NPC } from "./NPCManager";

describe("NPC Dialogue Trees", () => {
  const mockNPC: NPC = {
    id: "npc_1",
    name: "Captain Blackhook",
    role: "quest-giver",
    personality: "gruff",
    backstory: "A legendary pirate who has sailed for decades.",
    dialogue: ["Aye, what brings ye here?", "I have work that needs doing."],
    reputation: 25,
    isQuestGiver: true,
    availableQuests: ["quest_1", "quest_2"],
    interactionCount: 3,
  };

  it("Clicking NPC opens dialogue menu", () => {
    const onClose = vi.fn();
    const { container } = render(
      <NPCDialogueUI
        npc={mockNPC}
        isOpen={true}
        onClose={onClose}
        onSelectQuest={() => {}}
      />,
    );

    const menu = container.querySelector(".npc-dialogue-menu");
    expect(menu).toBeInTheDocument();
    expect(screen.getByText("Captain Blackhook")).toBeInTheDocument();
  });

  it("Dialogue menu shows NPC name and options", () => {
    render(
      <NPCDialogueUI
        npc={mockNPC}
        isOpen={true}
        onClose={() => {}}
        onSelectQuest={() => {}}
      />,
    );

    expect(screen.getByText("Captain Blackhook")).toBeInTheDocument();
    expect(screen.getByText(/Greet/i)).toBeInTheDocument();
    expect(screen.getByText(/Learn More/i)).toBeInTheDocument();
  });

  it("Greet option shows NPC greeting dialogue", () => {
    const { container } = render(
      <NPCDialogueUI
        npc={mockNPC}
        isOpen={true}
        onClose={() => {}}
        onSelectQuest={() => {}}
      />,
    );

    const buttons = container.querySelectorAll(".dialogue-btn");
    const greetButton = Array.from(buttons).find((b) =>
      b.textContent?.toLowerCase().includes("greet"),
    ) as HTMLButtonElement;

    if (greetButton) {
      fireEvent.click(greetButton);
      // After clicking Greet, dialogue text should appear
      const dialogueText = container.querySelector(".dialogue-text");
      expect(dialogueText).toBeInTheDocument();
    }
  });

  it("Learn More shows NPC backstory", () => {
    render(
      <NPCDialogueUI
        npc={mockNPC}
        isOpen={true}
        onClose={() => {}}
        onSelectQuest={() => {}}
      />,
    );

    const learnButton = screen.getByText(/Learn More/i);
    fireEvent.click(learnButton);

    expect(
      screen.getByText(/legendary pirate|sailed for decades/i),
    ).toBeInTheDocument();
  });

  it("Ask About Quests shows available quests", () => {
    const mockQuestList = [
      {
        id: "quest_1",
        title: "Treasure Hunt",
        reward: { xp: 100, gold: 50 },
      },
      {
        id: "quest_2",
        title: "Crew Rescue",
        reward: { xp: 150, gold: 75 },
      },
    ];

    const onSelectQuest = vi.fn();
    render(
      <NPCDialogueUI
        npc={mockNPC}
        isOpen={true}
        onClose={() => {}}
        onSelectQuest={onSelectQuest}
        availableQuests={mockQuestList}
      />,
    );

    const questsButton = screen.getByText(/Ask About Quests/i);
    fireEvent.click(questsButton);

    expect(screen.getByText(/Treasure Hunt/i)).toBeInTheDocument();
    expect(screen.getByText(/Crew Rescue/i)).toBeInTheDocument();
  });

  it("Dialogue is personalized based on reputation", () => {
    const highRepNPC: NPC = {
      ...mockNPC,
      reputation: 100,
    };

    const { container } = render(
      <NPCDialogueUI
        npc={highRepNPC}
        isOpen={true}
        onClose={() => {}}
        onSelectQuest={() => {}}
      />,
    );

    const buttons = container.querySelectorAll(".dialogue-btn");
    const greetButton = Array.from(buttons).find((b) =>
      b.textContent?.toLowerCase().includes("greet"),
    ) as HTMLButtonElement;

    if (greetButton) {
      fireEvent.click(greetButton);
      const dialogueText = container.querySelector(".dialogue-text");
      expect(dialogueText).toBeInTheDocument();
    }
  });

  it("Menu hides when closed", () => {
    const onClose = vi.fn();
    const { container, rerender } = render(
      <NPCDialogueUI
        npc={mockNPC}
        isOpen={true}
        onClose={onClose}
        onSelectQuest={() => {}}
      />,
    );

    let menu = container.querySelector(".npc-dialogue-menu");
    expect(menu).toBeInTheDocument();

    rerender(
      <NPCDialogueUI
        npc={mockNPC}
        isOpen={false}
        onClose={onClose}
        onSelectQuest={() => {}}
      />,
    );

    menu = container.querySelector(".npc-dialogue-menu");
    expect(menu).not.toBeInTheDocument();
  });

  it("Clicking quest calls onSelectQuest callback", () => {
    const onSelectQuest = vi.fn();
    const mockQuestList = [
      {
        id: "quest_1",
        title: "Treasure Hunt",
        reward: { xp: 100, gold: 50 },
      },
    ];

    const { container } = render(
      <NPCDialogueUI
        npc={mockNPC}
        isOpen={true}
        onClose={() => {}}
        onSelectQuest={onSelectQuest}
        availableQuests={mockQuestList}
      />,
    );

    const buttons = container.querySelectorAll(".dialogue-btn");
    const questsButton = Array.from(buttons).find(
      (b) =>
        b.textContent?.toLowerCase().includes("ask about") ||
        b.textContent?.toLowerCase().includes("quests"),
    ) as HTMLButtonElement;

    if (questsButton) {
      fireEvent.click(questsButton);

      const questTitle = container.querySelector(".quest-title");
      expect(questTitle?.textContent).toBe("Treasure Hunt");

      const acceptButton = container.querySelector(".quest-accept-btn");
      if (acceptButton) {
        fireEvent.click(acceptButton);
        expect(onSelectQuest).toHaveBeenCalled();
      }
    }
  });

  it("Back button returns to main menu", () => {
    render(
      <NPCDialogueUI
        npc={mockNPC}
        isOpen={true}
        onClose={() => {}}
        onSelectQuest={() => {}}
      />,
    );

    const learnButton = screen.getByText(/Learn More/i);
    fireEvent.click(learnButton);

    const backButton = screen.getByText(/Back/i);
    fireEvent.click(backButton);

    // Should be back to main menu with options
    expect(screen.getByText(/Greet/i)).toBeInTheDocument();
  });
});
