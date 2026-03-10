import LLMCallManager from './LLMCallManager'
import NPCManager from './NPCManager'

export interface Quest {
    id: string
    title: string
    objective: string
    reward: {
        xp: number
        gold: number
    }
    npcId: string
    townId: string
    storyContext?: string
    difficulty: number
    completed: boolean
    failed: boolean
    acceptedAt?: number
}

export interface QuestReward {
    xp: number
    gold: number
    narrative: string
}

export default class QuestManagerUpgraded {
    private quests: Quest[] = []
    private nextId: number = 1
    private llmManager: LLMCallManager
    private npcManager: NPCManager

    constructor(llmManager: LLMCallManager, npcManager: NPCManager) {
        this.llmManager = llmManager
        this.npcManager = npcManager
    }

    /**
     * Generate a quest from an NPC quest-giver
     */
    async generateQuestFromNPC(
        townId: string,
        npcId: string,
        storyArc: 'beginning' | 'middle' | 'late' | 'ending',
        playerLevel: number = 1,
    ): Promise<Quest> {
        const npc = this.npcManager.getNPCById(townId, npcId)
        if (!npc || !npc.isQuestGiver) {
            throw new Error(`NPC ${npcId} is not a quest-giver`)
        }

        // Generate quest via LLM
        const generatedQuest = await this.llmManager.generateQuestFromNPC({
            npcName: npc.name,
            playerLevel,
            storyArc,
            completedQuests: this.getCompletedQuestIds(),
            biome: townId,
        })

        const difficulty = this.calculateDifficulty(playerLevel, storyArc)

        const quest: Quest = {
            id: `quest_${this.nextId++}`,
            title: generatedQuest.title,
            objective: generatedQuest.objective,
            reward: {
                xp: Math.ceil(generatedQuest.reward.xp * (playerLevel / 5)),
                gold: Math.ceil(generatedQuest.reward.gold * (playerLevel / 5)),
            },
            npcId,
            townId,
            storyContext: generatedQuest.destinationHint,
            difficulty,
            completed: false,
            failed: false,
        }

        this.quests.push(quest)
        return quest
    }

    /**
     * Accept a quest (mark as active)
     */
    acceptQuest(questId: string): void {
        const quest = this.quests.find((q) => q.id === questId)
        if (quest) {
            quest.acceptedAt = Date.now()
        }
    }

    /**
     * Complete a quest
     */
    async completeQuest(
        questId: string,
        townId: string,
        npcId: string,
    ): Promise<QuestReward> {
        const quest = this.quests.find((q) => q.id === questId)
        if (!quest) {
            return { xp: 0, gold: 0, narrative: '' }
        }

        quest.completed = true

        // Generate completion narrative
        const narrative = await this.llmManager.generateNarrative({
            eventType: 'quest_complete',
            playerLevel: 1,
            playerName: 'Captain',
            completedQuests: this.getCompletedQuestIds(),
            currentBiome: quest.townId,
        })

        // Update NPC reputation
        this.npcManager.updateNPCReputation(townId, npcId, 25)

        return {
            xp: quest.reward.xp,
            gold: quest.reward.gold,
            narrative,
        }
    }

    /**
     * Fail a quest
     */
    async failQuest(
        questId: string,
        townId: string,
        npcId: string,
    ): Promise<QuestReward> {
        const quest = this.quests.find((q) => q.id === questId)
        if (!quest) {
            return { xp: 0, gold: 0, narrative: '' }
        }

        quest.failed = true

        // Generate failure narrative
        const narrative = await this.llmManager.generateNarrative({
            eventType: 'quest_complete',
            playerLevel: 1,
            playerName: 'Captain',
            completedQuests: this.getCompletedQuestIds(),
            currentBiome: quest.townId,
        })

        // Reduce NPC reputation
        this.npcManager.updateNPCReputation(townId, npcId, -10)

        return {
            xp: 0,
            gold: 0,
            narrative: `You failed the quest: ${quest.title}. ${narrative}`,
        }
    }

    /**
     * Get active (not completed/failed) quests
     */
    getActiveQuests(): Quest[] {
        return this.quests.filter(
            (q) => !q.completed && !q.failed && q.acceptedAt,
        )
    }

    /**
     * Get all quests for a specific town
     */
    getQuestsForTown(townId: string): Quest[] {
        return this.quests.filter((q) => q.townId === townId)
    }

    /**
     * Get quests for a specific NPC
     */
    getQuestsFromNPC(townId: string, npcId: string): Quest[] {
        return this.quests.filter(
            (q) => q.townId === townId && q.npcId === npcId,
        )
    }

    /**
     * Calculate difficulty based on player level and story arc
     */
    private calculateDifficulty(
        playerLevel: number,
        storyArc: string,
    ): number {
        let baseDifficulty = 1

        if (storyArc === 'beginning') {
            baseDifficulty = 1
        } else if (storyArc === 'middle') {
            baseDifficulty = 2
        } else if (storyArc === 'late') {
            baseDifficulty = 3
        } else if (storyArc === 'ending') {
            baseDifficulty = 4
        }

        // Scale with player level
        const scaledDifficulty = Math.max(1, baseDifficulty + Math.floor((playerLevel - 1) / 3))

        return Math.min(5, scaledDifficulty)
    }

    /**
     * Get list of completed quest IDs
     */
    private getCompletedQuestIds(): string[] {
        return this.quests
            .filter((q) => q.completed)
            .map((q) => q.id)
    }

    /**
     * Serialize for save file
     */
    serialize(): Quest[] {
        return JSON.parse(JSON.stringify(this.quests))
    }

    /**
     * Deserialize from save file
     */
    deserialize(data: Quest[]): void {
        this.quests = data
        // Update nextId to avoid conflicts
        const maxId = Math.max(
            ...this.quests.map((q) =>
                parseInt(q.id.replace('quest_', ''), 10),
            ),
            0,
        )
        this.nextId = maxId + 1
    }
}
