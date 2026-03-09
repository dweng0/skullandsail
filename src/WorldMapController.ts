import type { ShipClass } from './Game'

interface Position {
    x: number
    y: number
}

interface ProximityPrompt {
    type: 'town' | 'anomaly'
    name: string
}

export default class WorldMapController {
    private shipClass: ShipClass
    private position: Position = { x: 0, y: 0 }
    private towns: Position[] = [
        { x: 0, y: 0 },
        { x: 5, y: 5 },
    ]
    private anomalies: Position[] = [
        { x: 10, y: 10 },
        { x: -5, y: 8 },
    ]
    private proximityRange = 2

    constructor(shipClass: ShipClass = 'brigantine') {
        this.shipClass = shipClass
    }

    getShipPosition(): Position {
        return { ...this.position }
    }

    setPosition(x: number, y: number): void {
        this.position = { x, y }
    }

    handleInput(direction: string): void {
        const moveDistance = 0.1

        switch (direction.toLowerCase()) {
            case 'w':
            case 'arrowup':
                this.position.y += moveDistance
                break
            case 's':
            case 'arrowdown':
                this.position.y -= moveDistance
                break
            case 'a':
            case 'arrowleft':
                this.position.x -= moveDistance
                break
            case 'd':
            case 'arrowright':
                this.position.x += moveDistance
                break
        }
    }

    getShipSpeed(): number {
        const baseSpeed = 10
        const classModifiers: Record<ShipClass, number> = {
            sloop: 2.0,
            brigantine: 1.0,
            galleon: 0.7,
        }

        return baseSpeed * classModifiers[this.shipClass]
    }

    getProximityPrompt(): ProximityPrompt | null {
        // Check if near any town
        for (const town of this.towns) {
            const distance = Math.sqrt(
                Math.pow(this.position.x - town.x, 2) +
                    Math.pow(this.position.y - town.y, 2),
            )

            if (distance < this.proximityRange) {
                return {
                    type: 'town',
                    name: 'Approach Town?',
                }
            }
        }

        return null
    }

    checkForEncounter(): { type: 'anomaly'; difficulty: number } | null {
        // Check if near any anomaly
        for (const anomaly of this.anomalies) {
            const distance = Math.sqrt(
                Math.pow(this.position.x - anomaly.x, 2) +
                    Math.pow(this.position.y - anomaly.y, 2),
            )

            if (distance < this.proximityRange) {
                return {
                    type: 'anomaly',
                    difficulty: 5,
                }
            }
        }

        return null
    }

    getAnomalyNarrative(): string {
        const narratives = [
            'A ghostly ship emerges from the fog...',
            'Strange lights flicker on the horizon...',
            'The sea grows unnaturally calm and dark...',
            'An otherworldly sound echoes across the waves...',
        ]

        return narratives[Math.floor(Math.random() * narratives.length)]
    }
}
