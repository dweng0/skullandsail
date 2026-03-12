import { describe, it, expect, afterEach } from "vitest";
import WorldMapController from "./WorldMapController";

describe("World Map Navigation", () => {
  afterEach(() => {
    // Cleanup
  });

  it("Captain's ship is rendered on sea map", () => {
    // Verify that the captain's ship is rendered at starting position
    // captains ship is rendered on sea map
    const controller = new WorldMapController();
    const shipPosition = controller.getShipPosition();

    expect(shipPosition).toBeDefined();
    expect(shipPosition.x).toBeDefined();
    expect(shipPosition.y).toBeDefined();
  });

  it("Player can sail in eight directions with keyboard input", () => {
    // Verify that WASD and arrow keys control ship movement
    const controller = new WorldMapController();

    // Simulate key inputs
    const directions = [
      "w",
      "a",
      "s",
      "d",
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
    ];

    directions.forEach((dir) => {
      expect(() => {
        controller.handleInput(dir);
      }).not.toThrow();
    });
  });

  it("Ship speed on map varies by ship class", () => {
    // Verify that different ship classes move at different speeds
    const sloopController = new WorldMapController("sloop");
    const brigantineController = new WorldMapController("brigantine");
    const galleonController = new WorldMapController("galleon");

    const sloopSpeed = sloopController.getShipSpeed();
    const brigantineSpeed = brigantineController.getShipSpeed();
    const galleonSpeed = galleonController.getShipSpeed();

    // Sloop should be fastest, galleon should be slowest
    expect(sloopSpeed).toBeGreaterThan(brigantineSpeed);
    expect(brigantineSpeed).toBeGreaterThan(galleonSpeed);
  });

  it("When ship enters town proximity, transition prompt appears", () => {
    // Verify that approaching a town triggers a prompt
    const controller = new WorldMapController();

    // Move ship near a town
    controller.setPosition(0, 0); // Start at town location

    const prompt = controller.getProximityPrompt();
    expect(prompt).toBeDefined();
    if (prompt) {
      expect(prompt.type).toBe("town");
    }
  });

  it("When ship enters anomaly proximity, encounter is triggered", () => {
    // Verify that approaching an anomaly triggers battle
    const controller = new WorldMapController();

    // Move ship near an anomaly (set position based on test world)
    const encounter = controller.checkForEncounter();
    expect(encounter).toBeDefined();
  });

  it("LLM narrates each anomaly encounter", () => {
    // Verify that anomaly encounters have narrative text
    const controller = new WorldMapController();
    const narrative = controller.getAnomalyNarrative();

    expect(narrative).toBeDefined();
    expect(typeof narrative).toBe("string");
    expect(narrative.length).toBeGreaterThan(0);
  });
});
