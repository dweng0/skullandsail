export interface POI {
  id: string;
  name: string;
  type: "town" | "island" | "anomaly";
  coords: { x: number; y: number };
  biome: string;
  difficulty: number;
  npcCount: number;
  description?: string;
  visited?: boolean;
}

export interface BiomeRegion {
  biome: string;
  startX: number;
  startY: number;
  width: number;
  height: number;
  color: { r: number; g: number; b: number };
}

export interface WorldManifestData {
  seed: number;
  worldName: string;
  climate: "tropical" | "temperate" | "arctic" | "mixed";
  dangerLevel: number;
  distinctiveFeatures: string[];
  biomeMap: BiomeRegion[];
  poiList: POI[];
  discoveredPOIs: string[];
  completedQuests: string[];
  timestamp: number;
}

export class WorldManifest {
  seed: number;
  worldName: string;
  climate: "tropical" | "temperate" | "arctic" | "mixed";
  dangerLevel: number;
  distinctiveFeatures: string[];
  biomeMap: BiomeRegion[];
  poiList: POI[];
  discoveredPOIs: string[];
  completedQuests: string[];
  timestamp: number;

  constructor(data: WorldManifestData) {
    this.seed = data.seed;
    this.worldName = data.worldName;
    this.climate = data.climate;
    this.dangerLevel = data.dangerLevel;
    this.distinctiveFeatures = data.distinctiveFeatures;
    this.biomeMap = data.biomeMap;
    this.poiList = data.poiList;
    this.discoveredPOIs = data.discoveredPOIs || [];
    this.completedQuests = data.completedQuests || [];
    this.timestamp = data.timestamp;
  }

  /**
   * Mark a POI as discovered
   */
  discoverPOI(poiId: string): void {
    if (!this.discoveredPOIs.includes(poiId)) {
      this.discoveredPOIs.push(poiId);
      const poi = this.poiList.find((p) => p.id === poiId);
      if (poi) {
        poi.visited = true;
      }
    }
  }

  /**
   * Get biome at coordinates
   */
  getBiomeAt(x: number, y: number): string {
    for (const region of this.biomeMap) {
      if (
        x >= region.startX &&
        x < region.startX + region.width &&
        y >= region.startY &&
        y < region.startY + region.height
      ) {
        return region.biome;
      }
    }
    return "tropical"; // default
  }

  /**
   * Get all POIs in a specific biome
   */
  getPOIsByBiome(biome: string): POI[] {
    return this.poiList.filter((poi) => poi.biome === biome);
  }

  /**
   * Serialize for saving
   */
  serialize(): WorldManifestData {
    return {
      seed: this.seed,
      worldName: this.worldName,
      climate: this.climate,
      dangerLevel: this.dangerLevel,
      distinctiveFeatures: this.distinctiveFeatures,
      biomeMap: this.biomeMap,
      poiList: this.poiList,
      discoveredPOIs: this.discoveredPOIs,
      completedQuests: this.completedQuests,
      timestamp: this.timestamp,
    };
  }

  /**
   * Deserialize from save file
   */
  static deserialize(data: WorldManifestData): WorldManifest {
    return new WorldManifest(data);
  }
}

/**
 * Create a new world manifest with deterministic seed
 */
export function createWorldManifest(): WorldManifest {
  // Use a fixed seed for deterministic generation
  const seed = 42; // Fixed seed like Collatz conjecture seed

  // Generate biome regions
  const biomeMap = generateBiomeRegions();

  // Generate world name and features
  const { worldName, distinctiveFeatures, climate } =
    generateWorldCharacteristics();

  // Generate POIs
  const poiList = generatePOIs(seed, biomeMap, climate);

  // Determine overall danger level
  const dangerLevel = Math.ceil(Math.random() * 5);

  return new WorldManifest({
    seed,
    worldName,
    climate,
    dangerLevel,
    distinctiveFeatures,
    biomeMap,
    poiList,
    discoveredPOIs: [],
    completedQuests: [],
    timestamp: Date.now(),
  });
}

/**
 * Generate biome regions for the world
 */
function generateBiomeRegions(): BiomeRegion[] {
  const regions: BiomeRegion[] = [];

  // Tropical region (top-left)
  regions.push({
    biome: "tropical",
    startX: 0,
    startY: 0,
    width: 16,
    height: 16,
    color: { r: 34, g: 139, b: 34 }, // Forest green
  });

  // Temperate region (top-right)
  regions.push({
    biome: "temperate",
    startX: 16,
    startY: 0,
    width: 16,
    height: 16,
    color: { r: 85, g: 107, b: 47 }, // Dark khaki
  });

  // Volcanic region (bottom-left)
  regions.push({
    biome: "volcanic",
    startX: 0,
    startY: 16,
    width: 16,
    height: 16,
    color: { r: 139, g: 69, b: 19 }, // Saddle brown
  });

  // Arctic region (bottom-right)
  regions.push({
    biome: "arctic",
    startX: 16,
    startY: 16,
    width: 16,
    height: 16,
    color: { r: 176, g: 196, b: 222 }, // Light steel blue
  });

  return regions;
}

/**
 * Generate world characteristics
 */
function generateWorldCharacteristics(): {
  worldName: string;
  distinctiveFeatures: string[];
  climate: "tropical" | "temperate" | "arctic" | "mixed";
} {
  const worldNames = [
    "The Shattered Isles",
    "The Cursed Archipelago",
    "The Forgotten Seas",
    "The Dragon Reaches",
    "The Sunken Kingdom",
  ];

  const features = [
    "abundant tropical islands",
    "dangerous sea monsters",
    "hidden treasure caches",
    "abandoned pirate havens",
    "volcanic anomalies",
    "ghost ship encounters",
    "ancient ruins",
    "merchant routes",
  ];

  const climates: ("tropical" | "temperate" | "arctic" | "mixed")[] = [
    "tropical",
    "temperate",
    "arctic",
    "mixed",
  ];

  return {
    worldName: worldNames[Math.floor(Math.random() * worldNames.length)],
    distinctiveFeatures: features.sort(() => Math.random() - 0.5).slice(0, 3),
    climate: climates[Math.floor(Math.random() * climates.length)],
  };
}

/**
 * Generate POIs for the world
 */
function generatePOIs(
  _seed: number,
  biomeMap: BiomeRegion[],
  _climate: string,
): POI[] {
  const pois: POI[] = [];
  let poiId = 1;

  // Generate ~10-15 POIs distributed across biomes
  const targetPOICount = 10 + Math.floor(Math.random() * 5);

  for (let i = 0; i < targetPOICount; i++) {
    // Random biome region
    const biomeRegion = biomeMap[Math.floor(Math.random() * biomeMap.length)];

    // Random position in region
    const x =
      biomeRegion.startX + Math.floor(Math.random() * biomeRegion.width);
    const y =
      biomeRegion.startY + Math.floor(Math.random() * biomeRegion.height);

    // Random POI type with distribution
    let type: "town" | "island" | "anomaly";
    const typeRoll = Math.random();
    if (typeRoll < 0.4) {
      type = "island";
    } else if (typeRoll < 0.8) {
      type = "town";
    } else {
      type = "anomaly";
    }

    // Generate name based on type and biome
    const name = generatePOIName(type, biomeRegion.biome);

    // Difficulty based on biome
    let difficulty = 2;
    if (biomeRegion.biome === "volcanic") difficulty = 3;
    if (biomeRegion.biome === "arctic") difficulty = 4;
    if (biomeRegion.biome === "temperate") difficulty = 2;
    if (biomeRegion.biome === "tropical") difficulty = 1;

    const poi: POI = {
      id: `poi_${poiId++}`,
      name,
      type,
      coords: { x, y },
      biome: biomeRegion.biome,
      difficulty,
      npcCount: type === "town" ? Math.floor(Math.random() * 3) + 3 : 0,
      visited: false,
    };

    pois.push(poi);
  }

  return pois;
}

/**
 * Generate POI name based on type and biome
 */
function generatePOIName(type: string, biome: string): string {
  const townNames = {
    tropical: ["Port Royal", "Tortuga Bay", "Skull Harbor", "Paradise Isle"],
    volcanic: ["Lava Haven", "Scorched Port", "Ember Bay", "Inferno Cove"],
    arctic: ["Frozen Reach", "Ice Port", "Frostholm", "Snowhaven"],
    temperate: ["Green Port", "Merchant Haven", "Oak Harbor", "Trade Post"],
  };

  const islandNames = {
    tropical: [
      "Jungle Ruins",
      "Emerald Isle",
      "Hidden Cove",
      "Treasure Island",
    ],
    volcanic: ["Lava Rock", "Fire Peak", "Obsidian Isle", "Magma Crag"],
    arctic: ["Ice Shelf", "Frozen Peak", "Glacial Island", "Snowdrift Isle"],
    temperate: ["Green Hill", "Stone Isle", "Oak Island", "Meadow Rock"],
  };

  const anomalyNames = {
    tropical: ["Ghost Ship Encounter", "Cursed Waters", "Phantom Fleet"],
    volcanic: ["Lava Maelstrom", "Fiery Vortex", "Burning Abyss"],
    arctic: ["Frozen Ghostlands", "Ice Phantom", "Blizzard Vortex"],
    temperate: ["Murky Depths", "Strange Lights", "Eerie Fog Bank"],
  };

  const biomeKey = biome as keyof typeof townNames;
  if (type === "town") {
    const names = townNames[biomeKey] || townNames.tropical;
    return names[Math.floor(Math.random() * names.length)];
  } else if (type === "island") {
    const names = islandNames[biomeKey] || islandNames.tropical;
    return names[Math.floor(Math.random() * names.length)];
  } else {
    const names = anomalyNames[biomeKey] || anomalyNames.tropical;
    return names[Math.floor(Math.random() * names.length)];
  }
}
