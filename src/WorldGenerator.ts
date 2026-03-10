// Fixed world seed - ensures all players get the same world
// Based on Collatz conjecture seed-like approach: fixed value for consistent experience
export const FIXED_WORLD_SEED = 42

export interface Position {
    x: number
    y: number
}

export interface Island extends Position {
    id: string
}

export interface Town extends Position {
    id: string
    name: string
}

export interface Anomaly extends Position {
    id: string
}

export interface NamedLocation extends Position {
    name: string
}

export interface WorldMap {
    seed: number
    width: number
    height: number
    islands: Island[]
    towns: Town[]
    anomalies: Anomaly[]
    namedLocations: NamedLocation[]
}

export default class WorldGenerator {
    private seed: number
    private rng: () => number

    constructor(seed: number) {
        this.seed = seed
        this.rng = this.createSeededRandom(seed)
    }

    private createSeededRandom(seed: number): () => number {
        return () => {
            seed = (seed * 9301 + 49297) % 233280
            return seed / 233280
        }
    }

    generateMap(width: number, height: number): WorldMap {
        const islands: Island[] = []
        const towns: Town[] = []
        const anomalies: Anomaly[] = []
        const namedLocations: NamedLocation[] = []

        // Generate islands
        const islandCount = Math.floor(width * height * 0.15)
        for (let i = 0; i < islandCount; i++) {
            islands.push({
                id: `island_${i}`,
                x: Math.floor(this.rng() * width),
                y: Math.floor(this.rng() * height),
            })
        }

        // Generate towns on islands
        const townCount = Math.min(5, Math.floor(islands.length * 0.3))
        for (let i = 0; i < townCount; i++) {
            const island = islands[Math.floor(this.rng() * islands.length)]
            towns.push({
                id: `town_${i}`,
                name: this.generateTownName(),
                x: island.x,
                y: island.y,
            })

            namedLocations.push({
                name: `Town: ${towns[towns.length - 1].name}`,
                x: island.x,
                y: island.y,
            })
        }

        // Generate anomalies
        const anomalyCount = Math.floor(width * height * 0.08)
        for (let i = 0; i < anomalyCount; i++) {
            anomalies.push({
                id: `anomaly_${i}`,
                x: Math.floor(this.rng() * width),
                y: Math.floor(this.rng() * height),
            })

            namedLocations.push({
                name: `Anomaly ${i + 1}`,
                x: anomalies[anomalies.length - 1].x,
                y: anomalies[anomalies.length - 1].y,
            })
        }

        return {
            seed: this.seed,
            width,
            height,
            islands,
            towns,
            anomalies,
            namedLocations,
        }
    }

    private generateTownName(): string {
        const prefixes = ['Port', 'Fort', 'Bay', 'Haven', 'Skull', 'Dead']
        const suffixes = ['Rum', 'Treasure', 'Skull', 'Cross', 'Cove', 'Harbor']

        const prefix = prefixes[Math.floor(this.rng() * prefixes.length)]
        const suffix = suffixes[Math.floor(this.rng() * suffixes.length)]

        return `${prefix} ${suffix}`
    }

    toJSON() {
        return {
            seed: this.seed,
            map: 'World map data',
        }
    }
}
