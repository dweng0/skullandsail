export interface NPC {
    id: string
    name: string
    role: 'sailor' | 'merchant' | 'innkeeper' | 'quest-giver' | 'other'
    personality: 'gruff' | 'cheerful' | 'mysterious' | 'cautious'
    backstory: string
    dialogue: string[]
    reputation: number
    isQuestGiver: boolean
    availableQuests: string[]
    interactionCount: number
}


export default class NPCManager {
    private npcsByTown: Map<string, NPC[]> = new Map()
    private npcById: Map<string, NPC> = new Map()
    private nextId: number = 1

    /**
     * Generate NPCs for a town based on biome
     * Returns count of NPCs generated
     */
    generateNPCsForTown(townId: string, biome: string): number {
        // Generate 3-5 NPCs per town
        const npcCount = 3 + Math.floor(Math.random() * 3)
        const npcs: NPC[] = []

        for (let i = 0; i < npcCount; i++) {
            const npc = this.createNPC(townId, biome)
            npcs.push(npc)
            this.npcById.set(npc.id, npc)
        }

        this.npcsByTown.set(townId, npcs)
        return npcCount
    }

    /**
     * Create a single NPC with generated attributes
     */
    private createNPC(townId: string, biome: string): NPC {
        const personality = this.generatePersonality()
        const role = this.generateRole()
        const name = this.generateNPCName(role, biome)
        const backstory = this.generateBackstory(name, role, personality, biome)
        const dialogue = this.generateDialogue(personality, role)
        const isQuestGiver = role === 'quest-giver' || Math.random() > 0.7

        return {
            id: `npc_${this.nextId++}`,
            name,
            role,
            personality,
            backstory,
            dialogue,
            reputation: 0,
            isQuestGiver,
            availableQuests: isQuestGiver
                ? [`quest_${townId}_${Math.random().toString(36).substring(7)}`]
                : [],
            interactionCount: 0,
        }
    }

    /**
     * Generate thematic NPC name based on role and biome
     */
    private generateNPCName(
        role: NPC['role'],
        _biome: string,
    ): string {
        const piratePrefixes = [
            'Captain',
            'Sailor',
            'Old',
            'Black',
            'Bloody',
            'Scarred',
        ]
        const pirateNames = [
            'Blackhook',
            'Teach',
            'Morgan',
            'Flint',
            'Roberts',
            'Drake',
        ]
        const femaleNames = [
            'Rosie',
            'Margaret',
            'Anne',
            'Mary',
            'Elizabeth',
            'Sarah',
        ]
        const innkeeperNames = [
            'The Crimson Mare',
            'The Anchor',
            "O'Malley's",
        ]

        if (role === 'quest-giver') {
            return `${piratePrefixes[Math.floor(Math.random() * piratePrefixes.length)]} ${pirateNames[Math.floor(Math.random() * pirateNames.length)]}`
        } else if (role === 'innkeeper') {
            return innkeeperNames[Math.floor(Math.random() * innkeeperNames.length)]
        } else if (role === 'merchant') {
            return `${femaleNames[Math.floor(Math.random() * femaleNames.length)]} the ${['Shrewd', 'Fair', 'Bold'][Math.floor(Math.random() * 3)]}`
        } else {
            const firstName =
                Math.random() > 0.5
                    ? femaleNames[Math.floor(Math.random() * femaleNames.length)]
                    : piratePrefixes[Math.floor(Math.random() * piratePrefixes.length)]
            const lastName =
                pirateNames[Math.floor(Math.random() * pirateNames.length)]
            return `${firstName} ${lastName}`
        }
    }

    /**
     * Generate NPC personality
     */
    private generatePersonality(): NPC['personality'] {
        const personalities: NPC['personality'][] = [
            'gruff',
            'cheerful',
            'mysterious',
            'cautious',
        ]
        return personalities[Math.floor(Math.random() * personalities.length)]
    }

    /**
     * Generate NPC role
     */
    private generateRole(): NPC['role'] {
        const roles: NPC['role'][] = [
            'sailor',
            'merchant',
            'innkeeper',
            'quest-giver',
        ]
        return roles[Math.floor(Math.random() * roles.length)]
    }

    /**
     * Generate NPC backstory (placeholder for LLM integration)
     */
    private generateBackstory(
        name: string,
        role: NPC['role'],
        _personality: NPC['personality'],
        _biome: string,
    ): string {
        const backstories = {
            sailor: `${name} has sailed these seas for decades. Weathered by sun and salt, they carry tales of distant lands and sunken treasures.`,
            merchant: `${name} runs a trading operation, buying low in one port and selling high in another. Sharp-eyed and sharper-witted.`,
            innkeeper: `${name} has heard every story and secret told over their bar. They know the value of a good ear and a loose tongue.`,
            'quest-giver': `${name} is a legendary figure with a reputation that precedes them. They seek worthy adventurers to help with dangerous tasks.`,
            other: `${name} is a mysterious figure whose true motives remain unclear.`,
        }

        return backstories[role as keyof typeof backstories] || backstories.other
    }

    /**
     * Generate NPC dialogue based on personality
     */
    private generateDialogue(
        personality: NPC['personality'],
        _role: NPC['role'],
    ): string[] {
        const dialogueByPersonality = {
            gruff: [
                'Aye, what brings ye here?',
                "I've got no time for nonsense.",
                'State yer business.',
            ],
            cheerful: [
                'Welcome, welcome! Great to see a new face!',
                "Let's share a drink and hear yer tales!",
                'What an adventure awaits us!',
            ],
            mysterious: [
                'Interesting... you seek something, I presume?',
                'Many come seeking answers... few find them.',
                'The tides reveal secrets to those patient enough.',
            ],
            cautious: [
                'I will help you, but proceed carefully.',
                'Trust must be earned here.',
                'How do I know you are trustworthy?',
            ],
        }

        return dialogueByPersonality[personality as keyof typeof dialogueByPersonality] || dialogueByPersonality.cheerful
    }

    /**
     * Get all NPCs in a town
     */
    getNPCsForTown(townId: string): NPC[] {
        return this.npcsByTown.get(townId) || []
    }

    /**
     * Get a specific NPC by ID
     */
    getNPCById(townId: string, npcId: string): NPC | undefined {
        const npcs = this.getNPCsForTown(townId)
        return npcs.find((n) => n.id === npcId)
    }

    /**
     * Update NPC reputation
     */
    updateNPCReputation(townId: string, npcId: string, delta: number): void {
        const npc = this.getNPCById(townId, npcId)
        if (npc) {
            npc.reputation = Math.max(-100, Math.min(100, npc.reputation + delta))
            npc.interactionCount++
        }
    }

    /**
     * Serialize NPCs for save file
     */
    serialize(): Map<string, NPC[]> {
        return new Map(this.npcsByTown)
    }

    /**
     * Deserialize NPCs from save file
     */
    deserialize(data: Map<string, NPC[]>): void {
        this.npcsByTown = data
        data.forEach((npcs) => {
            npcs.forEach((npc) => {
                this.npcById.set(npc.id, npc)
            })
        })
    }
}
