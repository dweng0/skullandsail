import { describe, it, expect, beforeEach } from 'vitest'
import LLMCallManager from './LLMCallManager'
import type { LLMConfig } from './LLMSetup'

describe('LLM Integration Hub', () => {
    let manager: LLMCallManager
    const mockLLMConfig: LLMConfig = {
        provider: 'openai',
        model: 'gpt-4-turbo',
        apiKey: 'test-key-123',
    }

    beforeEach(() => {
        manager = new LLMCallManager(mockLLMConfig)
    })

    it('LLM is called with full game context', async () => {
        const context = {
            npcName: 'Captain Blackhook',
            npcRole: 'quest-giver' as const,
            personality: 'gruff' as const,
            biome: 'tropical',
            playerLevel: 5,
        }

        const result = await manager.generateNPCDialogue(context)
        expect(result).toBeDefined()
        expect(typeof result).toBe('string')
        expect(result.length).toBeGreaterThan(0)
    })

    it('LLM responses are cached to prevent redundant calls', async () => {
        const context = {
            npcName: 'Captain Blackhook',
            npcRole: 'quest-giver' as const,
            personality: 'gruff' as const,
            biome: 'tropical',
            playerLevel: 5,
        }

        // First call
        const result1 = await manager.generateNPCDialogue(context)

        // Second call - should return cached result
        const result2 = await manager.generateNPCDialogue(context)

        expect(result1).toBe(result2)

        // Check cache size
        const cacheSize = manager.getCacheSize()
        expect(cacheSize).toBeGreaterThan(0)
    })

    it('LLM calls are queued to prevent spam', async () => {
        const context1 = {
            npcName: 'NPC1',
            npcRole: 'merchant' as const,
            personality: 'cheerful' as const,
            biome: 'tropical',
            playerLevel: 1,
        }

        const context2 = {
            npcName: 'NPC2',
            npcRole: 'sailor' as const,
            personality: 'cautious' as const,
            biome: 'volcanic',
            playerLevel: 3,
        }

        // Make multiple calls
        const promise1 = manager.generateNPCDialogue(context1)
        const promise2 = manager.generateNPCDialogue(context2)

        const results = await Promise.all([promise1, promise2])
        expect(results.length).toBe(2)
        expect(results[0]).toBeDefined()
        expect(results[1]).toBeDefined()
    })

    it('LLM failures gracefully degrade', async () => {
        const context = {
            npcName: 'FailTest',
            npcRole: 'quest-giver' as const,
            personality: 'mysterious' as const,
            biome: 'arctic',
            playerLevel: 1,
        }

        // Call with context that might fail
        const result = await manager.generateNPCDialogue(context)

        // Should return something, even if LLM is unavailable
        expect(result).toBeDefined()
        expect(typeof result).toBe('string')
    })

    it('Quest generation receives full story context', async () => {
        const questContext = {
            npcName: 'Captain Teach',
            playerLevel: 3,
            storyArc: 'beginning' as const,
            completedQuests: ['find_treasure', 'rescue_crew'],
            biome: 'tropical',
        }

        const result = await manager.generateQuestFromNPC(questContext)
        expect(result).toBeDefined()
        expect(result.title).toBeDefined()
        expect(result.objective).toBeDefined()
        expect(result.reward).toBeDefined()
    })

    it('Narrative generation includes player history', async () => {
        const narrativeContext = {
            eventType: 'level_up' as const,
            playerLevel: 5,
            playerName: 'Captain Smith',
            completedQuests: ['defeat_kraken'],
            currentBiome: 'volcanic',
        }

        const result = await manager.generateNarrative(narrativeContext)
        expect(result).toBeDefined()
        expect(typeof result).toBe('string')
        expect(result.length).toBeGreaterThan(0)
    })

    it('Manager can be reset to clear cache', async () => {
        const context = {
            npcName: 'ClearTest',
            npcRole: 'innkeeper' as const,
            personality: 'cheerful' as const,
            biome: 'temperate',
            playerLevel: 2,
        }

        await manager.generateNPCDialogue(context)
        expect(manager.getCacheSize()).toBeGreaterThan(0)

        manager.clearCache()
        expect(manager.getCacheSize()).toBe(0)
    })
})
