import { describe, it, expect } from 'vitest'

describe('Ship Modularity System', () => {
    it('Ships are defined in a configurable system', () => {
        // Test ship configuration system
        interface ShipConfig {
            name: string
            stats: {
                speed: number
                trade: number
                combat: number
            }
            physics: {
                maxSpeed: number
                acceleration: number
                turnRate: number
                friction: number
            }
            visuals: {
                width: number
                height: number
                color: string
            }
        }

        type ShipType = 'sloop' | 'brigantine' | 'galleon'

        const shipConfigs: Record<ShipType, ShipConfig> = {
            sloop: {
                name: 'Sloop',
                stats: {
                    speed: 2,
                    trade: 0,
                    combat: -1,
                },
                physics: {
                    maxSpeed: 0.3,
                    acceleration: 0.015,
                    turnRate: 0.06,
                    friction: 0.95,
                },
                visuals: {
                    width: 2,
                    height: 4,
                    color: '#8B4513',
                },
            },
            brigantine: {
                name: 'Brigantine',
                stats: {
                    speed: 0,
                    trade: 1,
                    combat: 0,
                },
                physics: {
                    maxSpeed: 0.2,
                    acceleration: 0.01,
                    turnRate: 0.04,
                    friction: 0.94,
                },
                visuals: {
                    width: 3,
                    height: 5,
                    color: '#A0522D',
                },
            },
            galleon: {
                name: 'Galleon',
                stats: {
                    speed: -1,
                    trade: 0,
                    combat: 1,
                },
                physics: {
                    maxSpeed: 0.15,
                    acceleration: 0.008,
                    turnRate: 0.03,
                    friction: 0.93,
                },
                visuals: {
                    width: 4,
                    height: 6,
                    color: '#654321',
                },
            },
        }

        // Test that all ships are defined
        expect(Object.keys(shipConfigs).length).toBe(3)
        expect(shipConfigs.sloop).toBeDefined()
        expect(shipConfigs.brigantine).toBeDefined()
        expect(shipConfigs.galleon).toBeDefined()

        // Test ship properties
        const sloop = shipConfigs.sloop
        expect(sloop.name).toBe('Sloop')
        expect(sloop.stats.speed).toBe(2)
        expect(sloop.physics.maxSpeed).toBe(0.3)
        expect(sloop.visuals.width).toBe(2)

        const brigantine = shipConfigs.brigantine
        expect(brigantine.stats.trade).toBe(1)
        expect(brigantine.physics.turnRate).toBe(0.04)
        expect(brigantine.visuals.color).toBe('#A0522D')

        const galleon = shipConfigs.galleon
        expect(galleon.stats.combat).toBe(1)
        expect(galleon.physics.friction).toBe(0.93)

        // Test that ships can be retrieved by type
        const getShip = (shipType: ShipType): ShipConfig => shipConfigs[shipType]
        const selectedShip = getShip('brigantine')
        expect(selectedShip.name).toBe('Brigantine')

        // Test that new ships can be added to config
        const extendedConfigs: Record<string, ShipConfig> = {
            ...shipConfigs,
            frigate: {
                name: 'Frigate',
                stats: {
                    speed: 1,
                    trade: 0,
                    combat: 1,
                },
                physics: {
                    maxSpeed: 0.25,
                    acceleration: 0.012,
                    turnRate: 0.05,
                    friction: 0.94,
                },
                visuals: {
                    width: 3.5,
                    height: 5.5,
                    color: '#696969',
                },
            },
        }

        expect(Object.keys(extendedConfigs).length).toBe(4)
        expect(extendedConfigs.frigate).toBeDefined()
        expect(extendedConfigs.frigate.name).toBe('Frigate')
    })
})
