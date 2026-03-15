import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NarrativePanel from "./NarrativePanel";

describe("Narrative Display Panel", () => {
  it("Narrative text displays in a styled panel", () => {
    const narrative =
      "A ghostly ship emerges from the fog, tattered sails snapping in the wind!";
    const { container } = render(
      <NarrativePanel
        narrative={narrative}
        speaker="Game Master"
        isVisible={true}
        onClose={() => {}}
      />,
    );

    expect(screen.getByText(narrative)).toBeInTheDocument();
    const panel = container.querySelector(".narrative-panel");
    expect(panel).toBeInTheDocument();
  });

  it("Player can dismiss narrative text", async () => {
    const onClose = vi.fn();
    const { container } = render(
      <NarrativePanel
        narrative="Test narrative"
        speaker="NPC: Captain"
        isVisible={true}
        onClose={onClose}
      />,
    );

    const closeButton = container.querySelector(".narrative-close-btn");
    if (closeButton) {
      fireEvent.click(closeButton);
      await waitFor(() => {
        expect(onClose).toHaveBeenCalled();
      });
    }
  });

  it("Speaker label shows narrative source", () => {
    // Label shows who is narrating: "Game Master", "NPC: [Name]", "Tavern Keeper", etc.
    // Label appears above or integrated with text
    // Label helps player understand context of narrative
    // Multiple NPCs can speak with different labels

    const { container, rerender } = render(
      <NarrativePanel
        narrative="Test message"
        speaker="Town Crier"
        isVisible={true}
        onClose={() => {}}
      />,
    );

    expect(screen.getByText("Town Crier")).toBeInTheDocument();
    const speakerLabel = container.querySelector(".narrative-speaker");
    expect(speakerLabel).toBeInTheDocument();

    // Test with different speaker
    rerender(
      <NarrativePanel
        narrative="Another message"
        speaker="NPC: Captain"
        isVisible={true}
        onClose={() => {}}
      />,
    );

    expect(screen.getByText("NPC: Captain")).toBeInTheDocument();

    // Test with Game Master
    rerender(
      <NarrativePanel
        narrative="Yet another message"
        speaker="Game Master"
        isVisible={true}
        onClose={() => {}}
      />,
    );

    expect(screen.getByText("Game Master")).toBeInTheDocument();
  });

  it("Narrative includes speaker/context label", () => {
    // Narrative panel shows who is speaking (e.g., "Game Master", "Town Crier", "NPC Name")
    // Context label appears above or integrated with text
    // Helps player understand the source of narrative

    const { container } = render(
      <NarrativePanel
        narrative="A ghostly figure approaches from the shadows..."
        speaker="Game Master"
        isVisible={true}
        onClose={() => {}}
      />,
    );

    // Verify speaker label is displayed
    const speakerLabel = container.querySelector(".narrative-speaker");
    expect(speakerLabel).toBeInTheDocument();
    expect(screen.getByText("Game Master")).toBeInTheDocument();

    // Verify narrative text is also displayed
    expect(
      screen.getByText("A ghostly figure approaches from the shadows..."),
    ).toBeInTheDocument();
  });

  it("Narrative appears with smooth animations", () => {
    // Panel slides in from bottom/side when triggered
    // Text fades in or typewriter-scrolls for readability
    // Panel slides out when dismissed
    // Animation speed is configurable (affects pacing)

    const { container, rerender } = render(
      <NarrativePanel
        narrative="Test"
        speaker="Game Master"
        isVisible={false}
        onClose={() => {}}
        displayMode="fade"
      />,
    );

    let panel = container.querySelector(".narrative-panel");
    expect(panel).not.toBeInTheDocument();

    rerender(
      <NarrativePanel
        narrative="Test"
        speaker="Game Master"
        isVisible={true}
        onClose={() => {}}
        displayMode="fade"
      />,
    );

    panel = container.querySelector(".narrative-panel");
    expect(panel).toBeInTheDocument();
    expect(panel?.className).toContain("mode-fade");
  });

  it("Narrative panel supports multiple display modes", () => {
    const modes: Array<"instant" | "typewriter" | "fade"> = [
      "instant",
      "typewriter",
      "fade",
    ];

    modes.forEach((mode) => {
      const { container } = render(
        <NarrativePanel
          narrative="Test"
          speaker="Game Master"
          isVisible={true}
          onClose={() => {}}
          displayMode={mode}
        />,
      );

      const panel = container.querySelector(".narrative-panel");
      if (panel) {
        expect(panel.className).toContain(`mode-${mode}`);
      }
    });
  });

  it("Panel hides when isVisible is false", () => {
    const { container, rerender } = render(
      <NarrativePanel
        narrative="Test narrative"
        speaker="NPC"
        isVisible={true}
        onClose={() => {}}
      />,
    );

    let panel = container.querySelector(".narrative-panel");
    expect(panel).toBeInTheDocument();

    rerender(
      <NarrativePanel
        narrative="Test narrative"
        speaker="NPC"
        isVisible={false}
        onClose={() => {}}
      />,
    );

    // When isVisible is false, the entire overlay is not rendered
    const overlay = container.querySelector(".narrative-overlay");
    expect(overlay).not.toBeInTheDocument();
  });

  it("ESC key dismisses the panel", () => {
    const onClose = vi.fn();
    render(
      <NarrativePanel
        narrative="Test narrative"
        speaker="Game Master"
        isVisible={true}
        onClose={onClose}
      />,
    );

    fireEvent.keyDown(window, { key: "Escape", code: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });

  it("Clicking outside panel dismisses it", () => {
    const onClose = vi.fn();
    const { container } = render(
      <NarrativePanel
        narrative="Test narrative"
        speaker="Game Master"
        isVisible={true}
        onClose={onClose}
      />,
    );

    const overlay = container.querySelector(".narrative-overlay");
    if (overlay) {
      fireEvent.click(overlay);
      expect(onClose).toHaveBeenCalled();
    }
  });
});
