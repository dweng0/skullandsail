interface BattleConfig {
  playerLevel?: number;
  playerHP?: number;
  playerSTR?: number;
  enemyLevel?: number;
}

export default class BattleEngine {
  private playerLevel: number;
  private playerHP: number;
  private playerMaxHP: number;
  private playerSTR: number;
  private playerATB: number;
  private playerSpecialCharge: number;

  private enemyLevel: number;
  private enemyHP: number;
  private enemyMaxHP: number;
  private enemyATB: number;

  private active: boolean;

  constructor(config: BattleConfig = {}) {
    this.playerLevel = config.playerLevel || 1;
    this.playerMaxHP = 30 + (this.playerLevel - 1) * 5;
    this.playerHP = config.playerHP || this.playerMaxHP;
    this.playerSTR = config.playerSTR || 5 + (this.playerLevel - 1);
    this.playerATB = 0;
    this.playerSpecialCharge = 0;

    this.enemyLevel = config.enemyLevel || this.playerLevel + 1;
    this.enemyMaxHP = 30 + (this.enemyLevel - 1) * 5;
    this.enemyHP = this.enemyMaxHP;
    this.enemyATB = 0;

    this.active = true;
  }

  isActive(): boolean {
    return this.active;
  }

  getPlayerATB(): number {
    return this.playerATB;
  }

  fillPlayerATBToMax(): void {
    this.playerATB = 100;
  }

  fillATB(): void {
    this.playerATB = Math.min(100, this.playerATB + 1);
    this.playerSpecialCharge = Math.min(100, this.playerSpecialCharge + 0.2);
    this.enemyATB = Math.min(100, this.enemyATB + 1);
  }

  canPlayerAct(): boolean {
    return this.playerATB >= 100;
  }

  getAvailableActions(): string[] {
    return [
      "Fire Cannons",
      "Broadside",
      this.isSpecialAvailable() ? "Special Skill" : "",
    ].filter((a) => a.length > 0);
  }

  getSpecialCharge(): number {
    return this.playerSpecialCharge;
  }

  isSpecialAvailable(): boolean {
    return this.playerSpecialCharge >= 100;
  }

  calculateCannonDamage(): number {
    const base = this.playerSTR + 1;
    const roll = Math.floor(Math.random() * 6) + 1;
    return base + roll;
  }

  calculateBroadsideDamage(): number {
    return Math.floor(this.playerSTR * 1.5) + Math.floor(Math.random() * 6) + 1;
  }

  setEnemyHP(hp: number): void {
    this.enemyHP = hp;
  }

  setPlayerHP(hp: number): void {
    this.playerHP = hp;
  }

  isBattleOver(): boolean {
    return this.enemyHP <= 0;
  }

  isGameOver(): boolean {
    return this.playerHP <= 0;
  }

  getXPReward(): number {
    return 100 * this.enemyLevel;
  }

  getEnemyLevel(): number {
    return this.enemyLevel;
  }

  getOutcomeNarrative(): string {
    const victories = [
      "Your cannons split the enemy hull!",
      "Victory! The enemy ship sinks into the depths.",
      "Your crew cheers as the battle ends!",
    ];

    const defeats = [
      "The enemy overwhelms your ship... the end draws near.",
      "Your ship goes down in a blaze of glory.",
      "Defeated, but your name will be remembered.",
    ];

    if (this.isBattleOver()) {
      return victories[Math.floor(Math.random() * victories.length)];
    } else {
      return defeats[Math.floor(Math.random() * defeats.length)];
    }
  }
}
