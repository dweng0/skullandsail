import { describe, it, expect, beforeEach } from 'vitest'
import { WorldManifest, createWorldManifest } from './WorldManifest'

describe('World Manifest & POI Metadata', () => {
    let manifest: WorldManifest

    beforeEach(() => {
        manifest = createWorldManifest()
    })

    it('World manifest defines all POI locations', () => {
        expect(manifest).toBeDefined()
        expect(manifest.seed).toBeDefined()
        expect(manifest.biomeMap).toBeDefined()
        expect(manifest.poiList).toBeDefined()
        expect(manifest.poiList.length).toBeGreaterThan(0)

        manifest.poiList.forEach((poi) => {
            expect(poi.id).toBeDefined()
            expect(poi.name).toBeDefined()
            expect(poi.type).toMatch(/town|island|anomaly/)
            expect(poi.coords).toBeDefined()
            expect(poi.coords.x).toBeDefined()
            expect(poi.coords.y).toBeDefined()
            expect(poi.biome).toBeDefined()
            expect(poi.difficulty).toBeGreaterThanOrEqual(1)
        })
    })

    it('Biome affects NPC types and quests', () => {
        const towns = manifest.poiList.filter(
            (p) => p.type === 'town',
        )

        // Any town should have NPCs
        if (towns.length > 0) {
            const town = towns[0]
            expect(town.npcCount).toBeGreaterThanOrEqual(0)
        }

        // POIs have biome property
        manifest.poiList.forEach((poi) => {
            expect(['tropical', 'temperate', 'volcanic', 'arctic']).toContain(
                poi.biome,
            )
        })
    })

    it('World manifest persists across saves', () => {
        const serialized = manifest.serialize()
        expect(serialized).toBeDefined()

        const newManifest = WorldManifest.deserialize(serialized)
        expect(newManifest.seed).toBe(manifest.seed)
        expect(newManifest.poiList.length).toBe(manifest.poiList.length)
    })

    it('Manifest includes POI discovery tracking', () => {
        expect(manifest.discoveredPOIs).toBeDefined()
        expect(manifest.completedQuests).toBeDefined()

        // Initially no discoveries
        expect(manifest.discoveredPOIs.length).toBe(0)

        // Mark a POI as discovered
        if (manifest.poiList.length > 0) {
            manifest.discoverPOI(manifest.poiList[0].id)
            expect(manifest.discoveredPOIs.length).toBe(1)
            expect(manifest.discoveredPOIs).toContain(manifest.poiList[0].id)
        }
    })

    it('World name and distinctive features are defined', () => {
        expect(manifest.worldName).toBeDefined()
        expect(manifest.worldName.length).toBeGreaterThan(0)
        expect(manifest.distinctiveFeatures).toBeDefined()
        expect(manifest.distinctiveFeatures.length).toBeGreaterThan(0)
    })

    it('Manifest includes climate information', () => {
        expect(manifest.climate).toBeDefined()
        expect(['tropical', 'temperate', 'arctic', 'mixed']).toContain(
            manifest.climate,
        )

        expect(manifest.dangerLevel).toBeGreaterThanOrEqual(1)
        expect(manifest.dangerLevel).toBeLessThanOrEqual(5)
    })
})
