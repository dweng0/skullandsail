import { describe, it, expect, afterEach } from "vitest";
import ShipUpgradeSystem from "./ShipUpgradeSystem";

describe("Ship Upgrades & Crew", () => {
  afterEach(() => {
    // Cleanup
  });

  it("Cannon upgrades increase battle damage output", () => {
    // Verify that cannon upgrades increase damage
    const system = new ShipUpgradeSystem();

    const baseDamage = system.getCannonDamage();
    system.upgradeCannnons(1);
    const upgradedDamage = system.getCannonDamage();

    expect(upgradedDamage).toBeGreaterThan(baseDamage);
    expect(upgradedDamage).toBe(baseDamage + 1);
  });

  it("Hull upgrades increase max HP", () => {
    // Verify that hull upgrades increase max HP
    const system = new ShipUpgradeSystem();

    const baseHP = system.getMaxHP();
    system.upgradeHull(1);
    const upgradedHP = system.getMaxHP();

    expect(upgradedHP).toBeGreaterThan(baseHP);
    expect(upgradedHP).toBe(baseHP + 10);
  });

  it("Sail upgrades increase world map speed", () => {
    // Verify that sail upgrades increase speed multiplier
    const system = new ShipUpgradeSystem();

    const baseSpeed = system.getSpeedMultiplier();
    system.upgradeSails(1);
    const upgradedSpeed = system.getSpeedMultiplier();

    expect(upgradedSpeed).toBeGreaterThan(baseSpeed);
    expect(upgradedSpeed).toBe(baseSpeed + 0.1);
  });

  it("Crew members can be assigned roles", () => {
    // Verify that crew have assignable roles
    const system = new ShipUpgradeSystem();

    system.hireCrew({ name: "Jack", role: "gunner" });
    const crew = system.getCrew();

    expect(crew.length).toBe(1);
    expect(crew[0].role).toBe("gunner");
  });

  it("Max crew capacity depends on ship class", () => {
    // Verify that different ships have different crew limits
    const sloopSystem = new ShipUpgradeSystem("sloop");
    const brigantineSystem = new ShipUpgradeSystem("brigantine");
    const galleonSystem = new ShipUpgradeSystem("galleon");

    const sloopCapacity = sloopSystem.getCrewCapacity();
    const brigantineCapacity = brigantineSystem.getCrewCapacity();
    const galleonCapacity = galleonSystem.getCrewCapacity();

    expect(sloopCapacity).toBe(1);
    expect(brigantineCapacity).toBe(2);
    expect(galleonCapacity).toBe(3);
  });
});
