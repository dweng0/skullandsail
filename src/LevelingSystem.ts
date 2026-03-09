import type { ShipClass } from './Game'

export interface Stats {
    hp: number
    str: number
    dex: number
    con: number
}

interface HUDInfo {
    level: number
    xp: number
    xpNextLevel: number
    stats: Stats
}

export default class LevelingSystem {
    private level: number = 1
    private totalXP: number = 0
    private shipClass: ShipClass
    private baseStats: Stats

    constructor(shipClass: ShipClass = 'brigantine') {
        this.shipClass = shipClass
        this.baseStats = {
            hp: 30,
            str: 5,
            dex: 5,
            con: 5,
        }
    }

    awardXP(xp: number): void {
        this.totalXP += xp

        // Check for level ups
        while (this.totalXP >= this.getXPThreshold(this.level + 1)) {
            this.level += 1
        }
    }

    private getXPThreshold(level: number): number {
        // Level 1 needs 0 XP, Level 2 needs 200, Level 3 needs 300, etc.
        return level === 1 ? 0 : level * 100
    }

    getLevel(): number {
        return this.level
    }

    getTotalXP(): number {
        return this.totalXP
    }

    getStats(): Stats {
        const stats: Stats = {
            hp: this.baseStats.hp + (this.level - 1) * 5,
            str: this.baseStats.str + (this.level - 1),
            dex: this.baseStats.dex + (this.level - 1),
            con: this.baseStats.con + (this.level - 1),
        }

        // Apply ship class bonuses
        if (this.shipClass === 'sloop') {
            stats.dex += 2 // +3 total instead of +1
        } else if (this.shipClass === 'galleon') {
            stats.str += 2 // +3 total instead of +1
        }

        return stats
    }

    getHUDInfo(): HUDInfo {
        const nextLevelThreshold = this.getXPThreshold(this.level + 1)
        const currentLevelThreshold = this.getXPThreshold(this.level)
        const xpInCurrentLevel = Math.max(
            0,
            this.totalXP - currentLevelThreshold,
        )
        const xpNeededForNext = nextLevelThreshold - currentLevelThreshold

        return {
            level: this.level,
            xp: xpInCurrentLevel,
            xpNextLevel: xpNeededForNext,
            stats: this.getStats(),
        }
    }
}
