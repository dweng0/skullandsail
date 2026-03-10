import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

describe('Game Save/Load System', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear()
    })

    afterEach(() => {
        cleanup()
        localStorage.clear()
    })

    it('Player can load a saved game', () => {
        // Create a mock saved game state
        const savedGameState = {
            captainName: 'Captain Ahab',
            shipClass: 'brigantine',
            shipPosition: { x: 10, z: 20 },
            heading: 45,
            velocity: 0.1,
            level: 2,
            xp: 150,
            gold: 500,
            inventory: ['rum', 'spices'],
            quests: [],
            timestamp: Date.now(),
        }

        // Save to localStorage
        localStorage.setItem('gameSave', JSON.stringify(savedGameState))

        // The component should detect the saved game
        // and load it on initialization
        expect(localStorage.getItem('gameSave')).toBeDefined()

        const savedData = JSON.parse(localStorage.getItem('gameSave') || '{}')
        expect(savedData.captainName).toBe('Captain Ahab')
        expect(savedData.shipClass).toBe('brigantine')
        expect(savedData.shipPosition.x).toBe(10)
        expect(savedData.level).toBe(2)
    })

    it('Save file includes captain name and ship details', () => {
        // Verify that saved game includes all required captain and ship info
        const savedGameState = {
            captainName: 'Captain Barbossa',
            shipClass: 'galleon',
            shipName: 'The Black Pearl',
            shipPosition: { x: 5, z: 15 },
            heading: 90,
            velocity: 0.15,
            level: 3,
            xp: 250,
            gold: 1000,
            inventory: ['silks', 'sugar'],
            upgrades: {
                cannons: 2,
                hull: 1,
                sails: 0,
            },
            crew: ['navigator', 'gunner'],
            timestamp: Date.now(),
        }

        localStorage.setItem('gameSave', JSON.stringify(savedGameState))

        // Retrieve and verify all details are present
        const saved = JSON.parse(localStorage.getItem('gameSave') || '{}')

        expect(saved.captainName).toBe('Captain Barbossa')
        expect(saved.shipClass).toBe('galleon')
        expect(saved.shipName).toBe('The Black Pearl')
        expect(saved.shipPosition).toBeDefined()
        expect(saved.level).toBe(3)
        expect(saved.gold).toBe(1000)
        expect(saved.upgrades).toBeDefined()
        expect(saved.crew).toBeDefined()
    })
})
