// Fixed world seed - ensures all players get the same world
// Based on Collatz conjecture seed-like approach: fixed value for consistent experience
export const FIXED_WORLD_SEED = 42

export interface Position {
    x: number
    y: number
}

export interface BiomeRegion {
    type: string
    startX: number
    startY: number
    width: number
    height: number
}

export interface Island extends Position {
    id: string
    biome?: string
}

export interface Town extends Position {
    id: string
    name: string
    biome?: string
    difficulty?: number
}

export interface Anomaly extends Position {
    id: string
    biome?: string
    difficulty?: number
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
    biomeMap: BiomeRegion[]
}

export default class WorldGenerator {
    private seed: number
    private rng: () => number
    private biomeMap: BiomeRegion[] = []

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

    private generateBiomeRegions(width: number, height: number): BiomeRegion[] {
        const biomeTypes = ['tropical', 'temperate', 'volcanic', 'arctic', 'swamp']
        const regions: BiomeRegion[] = []

        // Divide the world into a 2x3 grid of biome regions
        const cellWidth = width / 2
        const cellHeight = height / 3

        let biomeIndex = 0
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 2; col++) {
                regions.push({
                    type: biomeTypes[biomeIndex % biomeTypes.length],
                    startX: Math.floor(col * cellWidth),
                    startY: Math.floor(row * cellHeight),
                    width: Math.floor(cellWidth),
                    height: Math.floor(cellHeight),
                })
                biomeIndex++
            }
        }

        return regions
    }

    private getBiomeAt(x: number, y: number): string {
        for (const region of this.biomeMap) {
            if (
                x >= region.startX &&
                x < region.startX + region.width &&
                y >= region.startY &&
                y < region.startY + region.height
            ) {
                return region.type
            }
        }
        return 'tropical' // default
    }

    generateMap(width: number, height: number): WorldMap {
        const islands: Island[] = []
        const towns: Town[] = []
        const anomalies: Anomaly[] = []
        const namedLocations: NamedLocation[] = []

        // Generate biome regions
        this.biomeMap = this.generateBiomeRegions(width, height)

        // Generate islands with biome assignment
        const islandCount = Math.floor(width * height * 0.15)
        for (let i = 0; i < islandCount; i++) {
            const x = Math.floor(this.rng() * width)
            const y = Math.floor(this.rng() * height)
            islands.push({
                id: `island_${i}`,
                x,
                y,
                biome: this.getBiomeAt(x, y),
            })
        }

        // Generate towns on islands with biome-based names and difficulty scaling
        const townCount = Math.min(5, Math.floor(islands.length * 0.3))
        for (let i = 0; i < townCount; i++) {
            const island = islands[Math.floor(this.rng() * islands.length)]
            const biome = island.biome || 'tropical'

            // Calculate difficulty based on biome
            let difficulty = 2
            if (biome === 'volcanic') difficulty = 3
            if (biome === 'arctic') difficulty = 4
            if (biome === 'temperate') difficulty = 2
            if (biome === 'tropical') difficulty = 1
            if (biome === 'swamp') difficulty = 2

            towns.push({
                id: `town_${i}`,
                name: this.generateTownName(biome),
                x: island.x,
                y: island.y,
                biome,
                difficulty,
            })

            namedLocations.push({
                name: `Town: ${towns[towns.length - 1].name}`,
                x: island.x,
                y: island.y,
            })
        }

        // Generate anomalies with biome assignment and difficulty scaling
        const anomalyCount = Math.floor(width * height * 0.08)
        for (let i = 0; i < anomalyCount; i++) {
            const x = Math.floor(this.rng() * width)
            const y = Math.floor(this.rng() * height)
            const biome = this.getBiomeAt(x, y)

            // Calculate difficulty based on biome
            let difficulty = 2
            if (biome === 'volcanic') difficulty = 3
            if (biome === 'arctic') difficulty = 4
            if (biome === 'temperate') difficulty = 2
            if (biome === 'tropical') difficulty = 1
            if (biome === 'swamp') difficulty = 2

            anomalies.push({
                id: `anomaly_${i}`,
                x,
                y,
                biome,
                difficulty,
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
            biomeMap: this.biomeMap,
        }
    }

    private generateTownName(biome: string = 'tropical'): string {
        const biomeNames: Record<string, { prefixes: string[]; suffixes: string[] }> = {
            tropical: {
                prefixes: ['Port', 'Haven', 'Skull', 'Treasure', 'Paradise'],
                suffixes: ['Royal', 'Harbor', 'Bay', 'Isle', 'Cove'],
            },
            temperate: {
                prefixes: ['Fort', 'Green', 'Trade', 'Merchant', 'Stone'],
                suffixes: ['Haven', 'Port', 'Harbor', 'Town', 'Post'],
            },
            volcanic: {
                prefixes: ['Lava', 'Fire', 'Scorched', 'Ember', 'Inferno'],
                suffixes: ['Haven', 'Bay', 'Cove', 'Peak', 'Port'],
            },
            arctic: {
                prefixes: ['Frozen', 'Ice', 'Frost', 'Snow', 'Glacial'],
                suffixes: ['Haven', 'Port', 'Reach', 'Hold', 'Peak'],
            },
            swamp: {
                prefixes: ['Murky', 'Cursed', 'Dark', 'Misty', 'Bog'],
                suffixes: ['Haven', 'Marsh', 'Cove', 'Waters', 'Fen'],
            },
        }

        const names = biomeNames[biome] || biomeNames.tropical
        const prefix = names.prefixes[Math.floor(this.rng() * names.prefixes.length)]
        const suffix = names.suffixes[Math.floor(this.rng() * names.suffixes.length)]

        return `${prefix} ${suffix}`
    }

    toJSON() {
        return {
            seed: this.seed,
            map: 'World map data',
        }
    }
}
