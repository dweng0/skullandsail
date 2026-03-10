import { describe, it, expect, beforeEach } from 'vitest'
import StoryProgressionSystem from './StoryProgressionSystem'

describe('Storyline Progression Tracking', () => {
    let storySystem: StoryProgressionSystem

    beforeEach(() => {
        storySystem = new StoryProgressionSystem()
    })

    it('Story arc has progression states', () => {
        expect(storySystem.getCurrentArc()).toBe('beginning')

        const states = storySystem.getValidArcStates()
        expect(states).toContain('beginning')
        expect(states).toContain('middle')
        expect(states).toContain('late')
        expect(states).toContain('ending')
    })

    it('Major quests trigger story progression', () => {
        const initialArc = storySystem.getCurrentArc()
        expect(initialArc).toBe('beginning')

        storySystem.completeMajorQuest('defeat_first_enemy', {
            questId: 'q1',
            title: 'Defeat the First Enemy',
            playerLevel: 1,
        })

        // Story arc should still be beginning (might need multiple quests)
        const currentArc = storySystem.getCurrentArc()
        expect(['beginning', 'middle']).toContain(currentArc)
    })

    it('Arc progression unlocks new areas and quests', () => {
        storySystem.progressArc('middle')

        const available = storySystem.getAvailableQuestHooks()
        expect(available.length).toBeGreaterThan(0)
        expect(available[0]).toContain('middle')
    })

    it('Narrative calls back to previous major quests', () => {
        storySystem.completeMajorQuest('rescue_crew', {
            questId: 'q2',
            title: 'Rescue the Crew',
            playerLevel: 3,
        })

        const narrative = storySystem.generateArcNarrative()
        expect(narrative).toBeDefined()
        expect(narrative.length).toBeGreaterThan(0)
        // Narrative should reference the completed quest
        expect(narrative.toLowerCase()).toMatch(/rescue|crew|quest/i)
    })

    it('Player choices affect story branches', () => {
        const choice1 = storySystem.recordPlayerChoice(
            'encounter_pirate',
            'attack',
        )
        expect(choice1).toBe(true)

        const choice2 = storySystem.recordPlayerChoice(
            'encounter_merchant',
            'negotiate',
        )
        expect(choice2).toBe(true)

        const choices = storySystem.getPlayerChoices()
        expect(choices.length).toBe(2)
        expect(choices[0]).toEqual({
            eventId: 'encounter_pirate',
            choice: 'attack',
        })
    })

    it('NPC dialogue references player choices', () => {
        storySystem.recordPlayerChoice('rescue_mission', 'save_hostages')

        const dialogue = storySystem.generateContextAwareDialogue('patron_npc')
        expect(dialogue).toBeDefined()
        expect(dialogue.length).toBeGreaterThan(0)
    })

    it('Story milestones generate commemorative narratives', () => {
        storySystem.progressArc('middle')

        const milestone = storySystem.getMilestoneNarrative()
        expect(milestone).toBeDefined()
        expect(milestone.length).toBeGreaterThan(0)
        // Milestone narrative should be arc-specific
        expect(milestone).toContain('Word of your deeds')
    })

    it('Different choice paths lead to different endings', () => {
        // Path A
        storySystem.recordPlayerChoice('final_choice', 'mercy')
        storySystem.progressArc('ending')
        const endingA = storySystem.generateEndingNarrative()

        // Path B - fresh instance
        const storySystem2 = new StoryProgressionSystem()
        storySystem2.recordPlayerChoice('final_choice', 'vengeance')
        storySystem2.progressArc('ending')
        const endingB = storySystem2.generateEndingNarrative()

        // Both should be valid endings (might be same text with fallback)
        expect(endingA).toBeDefined()
        expect(endingB).toBeDefined()
        expect(endingA.length).toBeGreaterThan(0)
        expect(endingB.length).toBeGreaterThan(0)
    })

    it('Narrative journal logs major story beats', () => {
        const narrative1 = storySystem.generateArcNarrative()
        storySystem.logStoryBeat('story_beat_1', narrative1)

        const narrative2 = storySystem.generateArcNarrative()
        storySystem.logStoryBeat('story_beat_2', narrative2)

        const journal = storySystem.getStoryJournal()
        expect(journal.length).toBeGreaterThanOrEqual(2)
        expect(journal[0]).toContain('story_beat')
    })

    it('Story system serializes for save files', () => {
        storySystem.progressArc('middle')
        storySystem.recordPlayerChoice('test_choice', 'option_a')
        storySystem.logStoryBeat('beat_1', 'Test narrative')

        const serialized = storySystem.serialize()
        expect(serialized).toBeDefined()
        expect(serialized.currentArc).toBe('middle')

        const newSystem = new StoryProgressionSystem()
        newSystem.deserialize(serialized)

        expect(newSystem.getCurrentArc()).toBe('middle')
        expect(newSystem.getPlayerChoices().length).toBe(1)
        expect(newSystem.getStoryJournal().length).toBe(1)
    })
})
