import { describe, it, expect, beforeEach } from 'vitest'
import QuestManagerUpgraded from './QuestManagerUpgraded'
import LLMCallManager from './LLMCallManager'
import NPCManager from './NPCManager'
import type { LLMConfig } from './LLMSetup'

describe('LLM-Driven Quest Generation', () => {
    let questManager: QuestManagerUpgraded
    let llmManager: LLMCallManager
    let npcManager: NPCManager

    const mockLLMConfig: LLMConfig = {
        provider: 'openai',
        model: 'gpt-4-turbo',
        apiKey: 'test-key',
    }

    beforeEach(() => {
        llmManager = new LLMCallManager(mockLLMConfig)
        npcManager = new NPCManager()
        questManager = new QuestManagerUpgraded(llmManager, npcManager)
    })

    it('LLM generates quests from NPC hooks', async () => {
        npcManager.generateNPCsForTown('town_1', 'tropical')
        const npcs = npcManager.getNPCsForTown('town_1')
        const patron = npcs.find((n) => n.isQuestGiver)

        if (patron) {
            const quest = await questManager.generateQuestFromNPC(
                'town_1',
                patron.id,
                'beginning',
            )

            expect(quest).toBeDefined()
            expect(quest.title).toBeDefined()
            expect(quest.objective).toBeDefined()
            expect(quest.reward.xp).toBeGreaterThan(0)
            expect(quest.npcId).toBe(patron.id)
        }
    })

    it('Quests are narrative-driven with context', async () => {
        npcManager.generateNPCsForTown('town_2', 'volcanic')
        const npcs = npcManager.getNPCsForTown('town_2')
        const patron = npcs.find((n) => n.isQuestGiver)

        if (patron) {
            const quest = await questManager.generateQuestFromNPC(
                'town_2',
                patron.id,
                'middle',
            )

            expect(quest.storyContext).toBeDefined()
            expect(quest.difficulty).toBeGreaterThanOrEqual(1)
        }
    })

    it('Quest completion triggers LLM narrative continuation', async () => {
        npcManager.generateNPCsForTown('town_3', 'temperate')
        const npcs = npcManager.getNPCsForTown('town_3')
        const patron = npcs.find((n) => n.isQuestGiver)

        if (patron) {
            const quest = await questManager.generateQuestFromNPC(
                'town_3',
                patron.id,
                'beginning',
            )

            const completion = await questManager.completeQuest(quest.id, 'town_3', patron.id)

            expect(completion.xp).toBeGreaterThan(0)
            expect(completion.gold).toBeGreaterThan(0)
            expect(completion.narrative).toBeDefined()
            expect(completion.narrative.length).toBeGreaterThan(0)
        }
    })

    it('Quest rewards are scaled to player level', async () => {
        npcManager.generateNPCsForTown('town_4', 'arctic')
        const npcs = npcManager.getNPCsForTown('town_4')
        const patron = npcs.find((n) => n.isQuestGiver)

        if (patron) {
            // Level 1 quest
            const quest1 = await questManager.generateQuestFromNPC(
                'town_4',
                patron.id,
                'beginning',
                1,
            )

            // Level 10 quest
            const quest2 = await questManager.generateQuestFromNPC(
                'town_4',
                patron.id,
                'middle',
                10,
            )

            // Higher level should give better rewards
            expect(quest2.reward.xp).toBeGreaterThanOrEqual(
                quest1.reward.xp,
            )
            expect(quest2.reward.gold).toBeGreaterThanOrEqual(
                quest1.reward.gold,
            )
        }
    })

    it('Active quest log shows quest-giver NPC', async () => {
        npcManager.generateNPCsForTown('town_5', 'tropical')
        const npcs = npcManager.getNPCsForTown('town_5')
        const patron = npcs.find((n) => n.isQuestGiver)

        if (patron) {
            const quest = await questManager.generateQuestFromNPC(
                'town_5',
                patron.id,
                'beginning',
            )

            questManager.acceptQuest(quest.id)
            const activeQuests = questManager.getActiveQuests()

            expect(activeQuests.length).toBeGreaterThan(0)
            const activeQuest = activeQuests.find((q) => q.id === quest.id)
            expect(activeQuest).toBeDefined()
            expect(activeQuest?.npcId).toBe(patron.id)
            expect(activeQuest?.townId).toBe('town_5')
        }
    })

    it('Failed quests can generate alternative outcomes', async () => {
        npcManager.generateNPCsForTown('town_6', 'volcanic')
        const npcs = npcManager.getNPCsForTown('town_6')
        const patron = npcs.find((n) => n.isQuestGiver)

        if (patron) {
            const quest = await questManager.generateQuestFromNPC(
                'town_6',
                patron.id,
                'beginning',
            )

            const failure = await questManager.failQuest(quest.id, 'town_6', patron.id)

            expect(failure.narrative).toBeDefined()
            expect(failure.narrative.length).toBeGreaterThan(0)
        }
    })

    it('Quest log persists across saves', async () => {
        npcManager.generateNPCsForTown('town_7', 'tropical')
        const npcs = npcManager.getNPCsForTown('town_7')
        const patron = npcs.find((n) => n.isQuestGiver)

        if (patron) {
            const quest = await questManager.generateQuestFromNPC(
                'town_7',
                patron.id,
                'beginning',
            )

            questManager.acceptQuest(quest.id)

            const serialized = questManager.serialize()
            expect(serialized).toBeDefined()

            const newManager = new QuestManagerUpgraded(llmManager, npcManager)
            newManager.deserialize(serialized)

            const restored = newManager.getActiveQuests()
            expect(restored.length).toBeGreaterThan(0)
        }
    })
})
