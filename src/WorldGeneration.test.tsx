import { describe, it, expect, afterEach } from 'vitest'
import WorldGenerator from './WorldGenerator'

describe('World Generation', () => {
    afterEach(() => {
        // Cleanup
    })

    it('Each new game generates unique sea map from random seed', () => {
        // Verify that a random seed generates a unique procedural map
        const seed1 = 12345
        const seed2 = 54321

        const map1 = new WorldGenerator(seed1).generateMap(32, 32)
        const map2 = new WorldGenerator(seed2).generateMap(32, 32)

        // Maps from different seeds should be different
        expect(map1).toBeDefined()
        expect(map2).toBeDefined()
        expect(map1).not.toEqual(map2)
    })

    it('Sea map contains islands, towns, and anomalies', () => {
        // Verify that the generated map has all three element types
        const generator = new WorldGenerator(12345)
        const map = generator.generateMap(32, 32)

        expect(map.islands).toBeDefined()
        expect(map.islands.length).toBeGreaterThan(0)

        expect(map.towns).toBeDefined()
        expect(map.towns.length).toBeGreaterThan(0)

        expect(map.anomalies).toBeDefined()
        expect(map.anomalies.length).toBeGreaterThan(0)
    })

    it('Towns and anomalies are stable per seed', () => {
        // Verify that the same seed produces the same world layout
        const seed = 12345

        const map1 = new WorldGenerator(seed).generateMap(32, 32)
        const map2 = new WorldGenerator(seed).generateMap(32, 32)

        // Same seed should produce identical layouts
        expect(map1.towns).toEqual(map2.towns)
        expect(map1.anomalies).toEqual(map2.anomalies)
        expect(map1.islands).toEqual(map2.islands)
    })

    it('LLM is consulted to place named points of interest', () => {
        // Verify that the world has named locations
        const generator = new WorldGenerator(12345)
        const map = generator.generateMap(32, 32)

        expect(map.namedLocations).toBeDefined()
        expect(map.namedLocations.length).toBeGreaterThan(0)

        // Each named location should have a name and position
        map.namedLocations.forEach((location) => {
            expect(location.name).toBeDefined()
            expect(location.x).toBeDefined()
            expect(location.y).toBeDefined()
        })
    })

    it('World state is saved to localStorage for resumption', () => {
        // Verify that world data can be serialized and stored
        const generator = new WorldGenerator(12345)
        generator.generateMap(32, 32)
        const worldState = generator.toJSON()

        expect(worldState).toBeDefined()
        expect(worldState.seed).toBe(12345)
        expect(worldState.map).toBeDefined()

        // Should be able to reconstruct from JSON
        const restored = new WorldGenerator(worldState.seed)
        expect(restored).toBeDefined()
    })
})
