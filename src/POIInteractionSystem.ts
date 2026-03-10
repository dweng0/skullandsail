import type { POI } from './WorldManifest'

export interface POITooltip {
    name: string
    type: string
    biome: string
    distance: number
}

export interface InteractionPrompt {
    text: string
    poiId: string
    poiName: string
}

export interface POILabel {
    name: string
    coords: { x: number; y: number }
    type: 'town' | 'island' | 'anomaly'
    color: { r: number; g: number; b: number }
}

export interface InteractionRadius {
    poiId: string
    distance: number
    isVisible: boolean
}

export interface RadiusIndicator {
    poiId: string
    isVisible: boolean
    opacity: number
}

export interface AnomalyEncounter {
    description: string
    timeToEncounter: number
}

export interface POIInteraction {
    poiId: string
    type: 'town' | 'island' | 'anomaly'
    name: string
}

/**
 * System for managing POI interactions on the world map
 */
export default class POIInteractionSystem {
    private pois: POI[]
    private playerPos: { x: number; y: number } = { x: 0, y: 0 }
    private mousePos: { x: number; y: number } = { x: 0, y: 0 }
    private interactionRadius: number = 2.0
    private detectionRadius: number = 4.0
    private lastInteractionTime: number = 0
    private interactionCooldown: number = 500 // ms

    constructor(pois: POI[]) {
        this.pois = pois
    }

    /**
     * Update player position
     */
    updatePlayerPosition(x: number, y: number): void {
        this.playerPos = { x, y }
    }

    /**
     * Update mouse position for tooltip
     */
    updateMousePosition(x: number, y: number): void {
        this.mousePos = { x, y }
    }

    /**
     * Get nearby POI (within interaction radius)
     */
    getNearbyPOI(): POI | undefined {
        for (const poi of this.pois) {
            const distance = this.calculateDistance(
                this.playerPos.x,
                this.playerPos.y,
                poi.coords.x,
                poi.coords.y,
            )
            if (distance < this.interactionRadius) {
                return poi
            }
        }
        return undefined
    }

    /**
     * Handle E key press
     */
    handleEKey(): POIInteraction | undefined {
        const now = Date.now()
        if (now - this.lastInteractionTime < this.interactionCooldown) {
            return undefined
        }

        const nearbyPOI = this.getNearbyPOI()
        if (!nearbyPOI) {
            return undefined
        }

        this.lastInteractionTime = now

        return {
            poiId: nearbyPOI.id,
            type: nearbyPOI.type,
            name: nearbyPOI.name,
        }
    }

    /**
     * Get tooltip for hovered POI
     */
    getTooltip(): POITooltip | undefined {
        // Find POI near mouse position
        for (const poi of this.pois) {
            const distance = this.calculateDistance(
                this.mousePos.x,
                this.mousePos.y,
                poi.coords.x,
                poi.coords.y,
            )

            // Tooltip shows if mouse is within 1 unit of POI marker
            if (distance < 1.0) {
                const playerDistance = this.calculateDistance(
                    this.playerPos.x,
                    this.playerPos.y,
                    poi.coords.x,
                    poi.coords.y,
                )

                return {
                    name: poi.name,
                    type: poi.type,
                    biome: poi.biome,
                    distance: Math.round(playerDistance * 10) / 10,
                }
            }
        }
        return undefined
    }

    /**
     * Get interaction prompt text
     */
    getInteractionPrompt(): InteractionPrompt | undefined {
        const nearby = this.getNearbyPOI()
        if (!nearby) {
            return undefined
        }

        return {
            text: `[E] ${nearby.type === 'town' ? 'Enter' : 'Explore'} ${nearby.name}`,
            poiId: nearby.id,
            poiName: nearby.name,
        }
    }

    /**
     * Get all POI labels for map rendering
     */
    getPOILabels(): POILabel[] {
        return this.pois.map((poi) => ({
            name: poi.name,
            coords: poi.coords,
            type: poi.type,
            color: this.getColorForPOIType(poi.type),
        }))
    }

    /**
     * Get color for POI type
     */
    private getColorForPOIType(
        type: 'town' | 'island' | 'anomaly',
    ): { r: number; g: number; b: number } {
        switch (type) {
            case 'town':
                return { r: 255, g: 215, b: 0 } // Gold
            case 'island':
                return { r: 34, g: 139, b: 34 } // Forest green
            case 'anomaly':
                return { r: 139, g: 0, b: 139 } // Dark magenta
            default:
                return { r: 255, g: 255, b: 255 } // White
        }
    }

    /**
     * Get interaction radius indicator
     */
    getInteractionRadius(): InteractionRadius | undefined {
        const nearby = this.getNearbyPOI()
        if (!nearby) {
            return undefined
        }

        const distance = this.calculateDistance(
            this.playerPos.x,
            this.playerPos.y,
            nearby.coords.x,
            nearby.coords.y,
        )

        return {
            poiId: nearby.id,
            distance,
            isVisible: true,
        }
    }

    /**
     * Get radius indicator for visual effect
     */
    getRadiusIndicator(): RadiusIndicator | undefined {
        // Show indicator if player is within detection radius of a POI
        for (const poi of this.pois) {
            const distance = this.calculateDistance(
                this.playerPos.x,
                this.playerPos.y,
                poi.coords.x,
                poi.coords.y,
            )

            if (distance < this.detectionRadius) {
                // Opacity decreases with distance
                const opacity = Math.max(
                    0.3,
                    1 - distance / this.detectionRadius,
                )

                return {
                    poiId: poi.id,
                    isVisible: true,
                    opacity,
                }
            }
        }

        return undefined
    }

    /**
     * Get anomaly encounter description
     */
    getAnomalyEncounter(): AnomalyEncounter | undefined {
        const nearby = this.getNearbyPOI()
        if (!nearby || nearby.type !== 'anomaly') {
            return undefined
        }

        const descriptions = [
            'A ghostly ship emerges from the fog, tattered sails snapping in the wind!',
            'Strange lights dance across the water. Your crew grows uneasy.',
            'The sea churns with unnatural energy. Something ancient stirs below.',
            'A ghostly cry echoes across the waves. Danger awaits ahead!',
            'The compass spins wildly. Something is very wrong here.',
        ]

        const description =
            descriptions[Math.floor(Math.random() * descriptions.length)]

        return {
            description,
            timeToEncounter: 3, // seconds before battle trigger
        }
    }

    /**
     * Calculate distance between two points
     */
    private calculateDistance(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
    ): number {
        return Math.sqrt(
            Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2),
        )
    }

    /**
     * Get all POIs
     */
    getPOIs(): POI[] {
        return this.pois
    }

    /**
     * Check if a POI has been visited
     */
    isVisited(poiId: string): boolean {
        const poi = this.pois.find((p) => p.id === poiId)
        return poi?.visited || false
    }

    /**
     * Mark POI as visited
     */
    markVisited(poiId: string): void {
        const poi = this.pois.find((p) => p.id === poiId)
        if (poi) {
            poi.visited = true
        }
    }
}
