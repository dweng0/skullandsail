import type { ShipClass } from "./Game";

export interface CrewMember {
  name: string;
  role: "navigator" | "gunner" | "medic";
}

interface UpgradeLevel {
  cannons: number;
  hull: number;
  sails: number;
}

export default class ShipUpgradeSystem {
  private shipClass: ShipClass;
  private upgrades: UpgradeLevel = {
    cannons: 0,
    hull: 0,
    sails: 0,
  };
  private crew: CrewMember[] = [];

  private baseStats = {
    cannonDamage: 1,
    maxHP: 30,
    speedMultiplier: 1.0,
  };

  private crewCapacity: Record<ShipClass, number> = {
    sloop: 1,
    brigantine: 2,
    galleon: 3,
  };

  constructor(shipClass: ShipClass = "brigantine") {
    this.shipClass = shipClass;
  }

  upgradeCannnons(levels: number): void {
    this.upgrades.cannons = Math.min(5, this.upgrades.cannons + levels);
  }

  upgradeHull(levels: number): void {
    this.upgrades.hull = Math.min(5, this.upgrades.hull + levels);
  }

  upgradeSails(levels: number): void {
    this.upgrades.sails = Math.min(5, this.upgrades.sails + levels);
  }

  getCannonDamage(): number {
    return this.baseStats.cannonDamage + this.upgrades.cannons;
  }

  getMaxHP(): number {
    return this.baseStats.maxHP + this.upgrades.hull * 10;
  }

  getSpeedMultiplier(): number {
    return this.baseStats.speedMultiplier + this.upgrades.sails * 0.1;
  }

  hireCrew(member: CrewMember): boolean {
    if (this.crew.length < this.crewCapacity[this.shipClass]) {
      this.crew.push(member);
      return true;
    }
    return false;
  }

  getCrew(): CrewMember[] {
    return [...this.crew];
  }

  getCrewCapacity(): number {
    return this.crewCapacity[this.shipClass];
  }

  getCrewBonus(role: "navigator" | "gunner" | "medic"): number {
    const count = this.crew.filter((c) => c.role === role).length;
    return count;
  }
}
