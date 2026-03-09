import { describe, it, expect, afterEach } from 'vitest'
import LevelingSystem from './LevelingSystem'

describe('Experience & Leveling (DnD-style)', () => {
    afterEach(() => {
        // Cleanup
    })

    it('Defeating enemies in battle awards XP', () => {
        // Verify that XP is awarded based on enemy level
        const levelSystem = new LevelingSystem()
        const enemyLevel = 3

        levelSystem.awardXP(100 * enemyLevel)
        const totalXP = levelSystem.getTotalXP()

        expect(totalXP).toBe(300)
    })

    it('When XP reaches threshold, captain levels up', () => {
        // Verify that leveling occurs at correct thresholds
        const levelSystem = new LevelingSystem()

        // Level 1 requires 0 XP (default)
        expect(levelSystem.getLevel()).toBe(1)

        // Award enough XP for level 2 (needs 200 XP)
        levelSystem.awardXP(200)
        expect(levelSystem.getLevel()).toBe(2)

        // Award enough XP for level 3 (needs 300 total XP)
        levelSystem.awardXP(100)
        expect(levelSystem.getLevel()).toBe(3)
    })

    it('Each level-up increases stats (HP, STR, DEX, CON)', () => {
        // Verify that base stats increase with leveling
        const levelSystem = new LevelingSystem('brigantine')

        const level1Stats = levelSystem.getStats()
        const level1HP = level1Stats.hp

        // Level up to level 2
        levelSystem.awardXP(200)
        const level2Stats = levelSystem.getStats()

        // HP should increase by 5 per level
        expect(level2Stats.hp).toBe(level1HP + 5)
        expect(level2Stats.str).toBe(6) // Base 5 + 1
        expect(level2Stats.dex).toBe(6)
        expect(level2Stats.con).toBe(6)
    })

    it('Stat increases vary by ship class', () => {
        // Verify that Sloop has +3 DEX, Galleon has +3 STR
        const sloopSystem = new LevelingSystem('sloop')
        const galleonSystem = new LevelingSystem('galleon')

        // Level up both
        sloopSystem.awardXP(200)
        galleonSystem.awardXP(200)

        const sloopStats = sloopSystem.getStats()
        const galleonStats = galleonSystem.getStats()

        // Sloop should have more DEX
        expect(sloopStats.dex).toBeGreaterThan(galleonStats.dex)

        // Galleon should have more STR
        expect(galleonStats.str).toBeGreaterThan(sloopStats.str)
    })

    it('Level and stats are displayed on HUD', () => {
        // Verify that HUD display information is available
        const levelSystem = new LevelingSystem()

        const hudInfo = levelSystem.getHUDInfo()
        expect(hudInfo).toBeDefined()
        expect(hudInfo.level).toBe(1)
        expect(hudInfo.xp).toBe(0)
        expect(hudInfo.xpNextLevel).toBe(200)
        expect(hudInfo.stats).toBeDefined()
        expect(hudInfo.stats.hp).toBe(30)
    })
})
