import { describe, it, expect, beforeEach } from 'vitest'
import POIInteractionSystem from './POIInteractionSystem'
import type { POI } from './WorldManifest'

describe('Dynamic POI Interaction UI', () => {
    let interactionSystem: POIInteractionSystem
    const mockPOIs: POI[] = [
        {
            id: 'poi_1',
            name: 'Port Royal',
            type: 'town',
            coords: { x: 10, y: 5 },
            biome: 'tropical',
            difficulty: 1,
            npcCount: 3,
            visited: false,
        },
        {
            id: 'poi_2',
            name: 'Treasure Island',
            type: 'island',
            coords: { x: 15, y: 20 },
            biome: 'tropical',
            difficulty: 2,
            npcCount: 0,
            visited: false,
        },
        {
            id: 'poi_3',
            name: 'Ghost Ship',
            type: 'anomaly',
            coords: { x: 5, y: 8 },
            biome: 'tropical',
            difficulty: 3,
            npcCount: 0,
            visited: false,
        },
    ]

    beforeEach(() => {
        interactionSystem = new POIInteractionSystem(mockPOIs)
    })

    it('E key triggers interaction when near POI', () => {
        interactionSystem.updatePlayerPosition(10.5, 5.2)
        const nearby = interactionSystem.getNearbyPOI()

        expect(nearby).toBeDefined()
        expect(nearby?.id).toBe('poi_1')

        const interaction = interactionSystem.handleEKey()
        expect(interaction).toBeDefined()
        expect(interaction?.type).toBe('town')
    })

    it('Hovering over POI shows tooltip info', () => {
        interactionSystem.updatePlayerPosition(15, 20)
        interactionSystem.updateMousePosition(15, 20)

        const tooltip = interactionSystem.getTooltip()
        expect(tooltip).toBeDefined()
        expect(tooltip?.name).toBe('Treasure Island')
        expect(tooltip?.type).toBe('island')
        expect(tooltip?.biome).toBe('tropical')
    })

    it('Interaction prompts appear on screen near POI', () => {
        interactionSystem.updatePlayerPosition(10.3, 5.1)
        const prompt = interactionSystem.getInteractionPrompt()

        expect(prompt).toBeDefined()
        expect(prompt?.text).toContain('[E]')
        expect(prompt?.text).toContain('Port Royal')
    })

    it('POI names display on world map', () => {
        const poiLabels = interactionSystem.getPOILabels()

        expect(poiLabels).toBeDefined()
        expect(poiLabels.length).toBe(mockPOIs.length)

        poiLabels.forEach((label, index) => {
            expect(label.name).toBe(mockPOIs[index].name)
            expect(label.coords).toEqual(mockPOIs[index].coords)
            expect(label.color).toBeDefined()
        })
    })

    it('Player can see interaction radius around POI', () => {
        interactionSystem.updatePlayerPosition(10, 5)
        const radius = interactionSystem.getInteractionRadius()

        expect(radius).toBeDefined()
        expect(radius?.poiId).toBe('poi_1')
        expect(radius?.distance).toBeLessThan(2)
        expect(radius?.isVisible).toBe(true)
    })

    it('Anomaly encounters include narrative lead-in', () => {
        interactionSystem.updatePlayerPosition(5, 8)
        const anomaly = interactionSystem.getNearbyPOI()

        if (anomaly?.type === 'anomaly') {
            const encounter = interactionSystem.getAnomalyEncounter()
            expect(encounter).toBeDefined()
            expect(encounter?.description).toBeDefined()
            expect(encounter?.description.length).toBeGreaterThan(0)
            expect(encounter?.timeToEncounter).toBeGreaterThan(0)
        }
    })

    it('Pressing E away from POI does nothing', () => {
        interactionSystem.updatePlayerPosition(0, 0)
        const interaction = interactionSystem.handleEKey()

        expect(interaction).toBeUndefined()
    })

    it('Interaction radius is visually indicated', () => {
        interactionSystem.updatePlayerPosition(10, 5)
        const indicator = interactionSystem.getRadiusIndicator()

        expect(indicator).toBeDefined()
        expect(indicator?.isVisible).toBe(true)
        expect(indicator?.opacity).toBeGreaterThan(0)
        expect(indicator?.poiId).toBe('poi_1')
    })

    it('Tooltip fades when mouse leaves POI', () => {
        interactionSystem.updatePlayerPosition(15, 20)
        interactionSystem.updateMousePosition(15, 20)

        let tooltip = interactionSystem.getTooltip()
        expect(tooltip).toBeDefined()

        interactionSystem.updateMousePosition(0, 0)
        tooltip = interactionSystem.getTooltip()
        expect(tooltip).toBeUndefined()
    })
})
