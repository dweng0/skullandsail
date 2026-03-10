import { useEffect, useRef, useState } from 'react'
import {
    Engine,
    Scene,
    Mesh,
    Vector3,
    UniversalCamera,
    HemisphericLight,
    MeshBuilder,
    StandardMaterial,
    Color3,
} from 'babylonjs'
import './styles.css'

export type ShipClass = 'sloop' | 'brigantine' | 'galleon'

interface GameProps {
    playerShipClass?: ShipClass
    showBattle?: boolean
}

export default function Game({
    playerShipClass = 'brigantine',
    showBattle = false,
}: GameProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const engineRef = useRef<Engine | null>(null)
    const [shipPosition, setShipPosition] = useState({ x: 0, z: 0 })
    const [direction, setDirection] = useState(0)

    useEffect(() => {
        if (!canvasRef.current) return

        try {
            const engine = new Engine(canvasRef.current, true)
            const scene = new Scene(engine)

            // Set up camera for top-down view
            const camera = new UniversalCamera('camera', new Vector3(0, 5, 5))
            camera.attachControl(canvasRef.current, true)
            camera.inertia = 0.7
            camera.angularSensibility = 1000

            // Set up lighting
            const light = new HemisphericLight(
                'light',
                new Vector3(0, 1, 0),
                scene,
            )
            light.intensity = 0.8

            if (showBattle) {
                // Battle scene layout
                createBattleScene(scene, playerShipClass)
            } else {
                // World map layout
                // Create ocean water
                createOcean(scene)

                // Create islands
                createIslands(scene)

                // Create town markers
                createTowns(scene)

                // Create anomaly markers
                createAnomalies(scene)

                // Create player ship
                createShip(scene, playerShipClass, new Vector3(0, 0, 0))
            }

            engineRef.current = engine

            // Render loop
            engine.runRenderLoop(() => {
                scene.render()
            })

            // Handle keyboard input for ship movement
            const keysPressed: Record<string, boolean> = {}

            const handleKeyDown = (e: KeyboardEvent) => {
                keysPressed[e.key.toLowerCase()] = true
                keysPressed[e.code.toLowerCase()] = true
            }

            const handleKeyUp = (e: KeyboardEvent) => {
                keysPressed[e.key.toLowerCase()] = false
                keysPressed[e.code.toLowerCase()] = false
            }

            window.addEventListener('keydown', handleKeyDown)
            window.addEventListener('keyup', handleKeyUp)

            // Movement loop
            let dirX = 0,
                dirZ = 0
            scene.registerBeforeRender(() => {
                dirX = 0
                dirZ = 0

                // WASD controls
                if (
                    keysPressed['w'] ||
                    keysPressed['arrowup'] ||
                    keysPressed['W']
                ) {
                    dirZ += 0.1
                }
                if (
                    keysPressed['s'] ||
                    keysPressed['arrowdown'] ||
                    keysPressed['S']
                ) {
                    dirZ -= 0.1
                }
                if (
                    keysPressed['a'] ||
                    keysPressed['arrowleft'] ||
                    keysPressed['A']
                ) {
                    dirX -= 0.1
                }
                if (
                    keysPressed['d'] ||
                    keysPressed['arrowright'] ||
                    keysPressed['D']
                ) {
                    dirX += 0.1
                }

                if (dirX !== 0 || dirZ !== 0) {
                    setShipPosition((prev) => ({
                        x: prev.x + dirX,
                        z: prev.z + dirZ,
                    }))
                    if (dirX !== 0 || dirZ !== 0) {
                        setDirection(Math.atan2(dirX, dirZ))
                    }
                }
            })

            // Handle resize
            const handleResize = () => engine.resize()
            window.addEventListener('resize', handleResize)

            return () => {
                window.removeEventListener('resize', handleResize)
                window.removeEventListener('keydown', handleKeyDown)
                window.removeEventListener('keyup', handleKeyUp)
                engine.dispose()
            }
        } catch (error) {
            console.error('Game initialization error:', error)
            // Silently handle initialization errors in test environments
        }
    }, [playerShipClass, showBattle])

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <canvas
                ref={canvasRef}
                style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    margin: 0,
                    padding: 0,
                }}
                data-testid="game-canvas"
            />
            {!showBattle && (
                <div
                    className="hud"
                    style={{
                        position: 'absolute',
                        top: '16px',
                        left: '16px',
                        backgroundColor: 'rgba(10, 14, 39, 0.9)',
                        border: '2px solid #d4a574',
                        borderRadius: '4px',
                        padding: '12px 16px',
                        color: '#e8dcc8',
                        fontSize: '12px',
                        maxWidth: '250px',
                    }}
                >
                    <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>
                        ⚓ Ship Controls
                    </div>
                    <div style={{ fontSize: '11px', lineHeight: '1.6' }}>
                        <div>↑ W - Forward</div>
                        <div>↓ S - Back</div>
                        <div>← A - Left</div>
                        <div>→ D - Right</div>
                    </div>
                    <div
                        style={{
                            marginTop: '8px',
                            paddingTop: '8px',
                            borderTop: '1px solid #444',
                            fontSize: '11px',
                        }}
                    >
                        <div>Pos: ({shipPosition.x.toFixed(1)}, {shipPosition.z.toFixed(1)})</div>
                        <div>Dir: {(direction * (180 / Math.PI)).toFixed(0)}°</div>
                    </div>
                </div>
            )}
        </div>
    )
}

function createOcean(scene: Scene): Mesh {
    // Create a large plane for the ocean
    const ocean = MeshBuilder.CreateGround(
        'ocean',
        { width: 50, height: 50 },
        scene,
    )
    ocean.position.y = -0.1

    // Create animated water material
    const waterMaterial = new StandardMaterial('waterMaterial', scene)
    waterMaterial.emissiveColor = new Color3(0.1, 0.5, 0.8)
    waterMaterial.specularColor = new Color3(0.8, 0.8, 1.0)
    waterMaterial.specularPower = 64

    ocean.material = waterMaterial

    // Add animation to simulate wave movement
    let time = 0
    scene.registerBeforeRender(() => {
        time += 0.016 // ~60fps
        // Create subtle wave animation through material property changes
        waterMaterial.alpha = 0.95 + Math.sin(time * 0.5) * 0.05
    })

    return ocean
}

function createIslands(scene: Scene): void {
    // Create a few procedural islands on the map
    const islandPositions = [
        { x: -8, z: -8 },
        { x: 8, z: 5 },
        { x: -5, z: 8 },
        { x: 10, z: -10 },
    ]

    islandPositions.forEach((pos, index) => {
        // Create raised island mesh
        const island = MeshBuilder.CreateSphere(
            `island_${index}`,
            { segments: 16 },
            scene,
        )
        island.position.x = pos.x
        island.position.z = pos.z
        island.position.y = 0.4

        // Scale to look like a raised landmass
        island.scaling = new Vector3(1.5, 0.8, 1.5)

        // Create island material (sandy/green color scheme)
        const islandMaterial = new StandardMaterial(
            `island_${index}_material`,
            scene,
        )
        if (index % 2 === 0) {
            // Sandy color
            islandMaterial.emissiveColor = new Color3(0.9, 0.85, 0.6)
        } else {
            // Green color
            islandMaterial.emissiveColor = new Color3(0.4, 0.6, 0.3)
        }
        islandMaterial.specularColor = new Color3(0.2, 0.2, 0.2)

        island.material = islandMaterial
    })
}

function createTowns(scene: Scene): void {
    // Create town beacon markers
    const townPositions = [
        { x: -8, z: -8 },
        { x: 8, z: 5 },
    ]

    townPositions.forEach((pos, index) => {
        // Create beacon shape: cylinder with a cone on top
        const beacon = MeshBuilder.CreateCylinder(
            `town_beacon_${index}`,
            { height: 1.2, diameter: 0.5 },
            scene,
        )
        beacon.position.x = pos.x
        beacon.position.z = pos.z
        beacon.position.y = 1.0

        // Create gold/yellow material for beacon
        const beaconMaterial = new StandardMaterial(
            `beacon_${index}_material`,
            scene,
        )
        beaconMaterial.emissiveColor = new Color3(1.0, 0.85, 0.2)
        beaconMaterial.specularColor = new Color3(1.0, 1.0, 0.5)
        beaconMaterial.specularPower = 128

        beacon.material = beaconMaterial

        // Create sphere top for beacon
        const coneTop = MeshBuilder.CreateSphere(
            `town_top_${index}`,
            { segments: 8, diameter: 0.6 },
            scene,
        )
        coneTop.position.x = pos.x
        coneTop.position.z = pos.z
        coneTop.position.y = 1.8

        coneTop.material = beaconMaterial
    })
}

function createAnomalies(scene: Scene): void {
    // Create anomaly swirl markers
    const anomalyPositions = [
        { x: 5, z: -5 },
        { x: -10, z: 5 },
        { x: 12, z: 8 },
    ]

    anomalyPositions.forEach((pos, index) => {
        // Create spinning torus for swirl effect
        const anomaly = MeshBuilder.CreateTorus(
            `anomaly_${index}`,
            { diameter: 1.2, thickness: 0.3 },
            scene,
        )
        anomaly.position.x = pos.x
        anomaly.position.z = pos.z
        anomaly.position.y = 0.6

        // Create purple/red material for anomaly
        const anomalyMaterial = new StandardMaterial(
            `anomaly_${index}_material`,
            scene,
        )
        // Mix of purple and red - darker to avoid overly bright appearance
        const isPurple = index % 2 === 0
        if (isPurple) {
            anomalyMaterial.emissiveColor = new Color3(0.4, 0.1, 0.5)
        } else {
            anomalyMaterial.emissiveColor = new Color3(0.6, 0.05, 0.15)
        }
        // Add some ambient color for better visibility
        anomalyMaterial.ambientColor = new Color3(0.2, 0.1, 0.2)
        anomalyMaterial.specularColor = new Color3(0.9, 0.5, 0.8)

        anomaly.material = anomalyMaterial

        // Add rotation animation to create swirl effect
        scene.registerBeforeRender(() => {
            anomaly.rotation.z += 0.02
            anomaly.rotation.x += 0.01
        })
    })
}

function createBattleScene(scene: Scene, playerShipClass: ShipClass): void {
    // Create battle background
    const background = MeshBuilder.CreatePlane('battle_bg', { size: 30 }, scene)
    background.position.z = -5
    const bgMaterial = new StandardMaterial('bg_material', scene)
    bgMaterial.emissiveColor = new Color3(0.2, 0.3, 0.4)
    background.material = bgMaterial

    // Place player ship on left side
    createShip(scene, playerShipClass, new Vector3(-6, 1, 0))

    // Place enemy ship on right side
    const enemyShipClass = (
        playerShipClass === 'sloop' ? 'galleon' : 'sloop'
    ) as ShipClass
    const enemyShip = createShip(scene, enemyShipClass, new Vector3(6, 1, 0))

    // Rotate enemy ship to face opposite direction
    enemyShip.rotation.y = Math.PI
}

function createShip(
    scene: Scene,
    shipClass: ShipClass,
    position: Vector3,
): Mesh {
    const ship = MeshBuilder.CreateBox('ship', { size: 0.1 }, scene)
    ship.position = position

    // Define ship dimensions and colors based on class
    const shipSpecs = {
        sloop: {
            width: 0.3,
            length: 0.6,
            height: 0.2,
            color: new Color3(0.8, 0.7, 0.6),
        },
        brigantine: {
            width: 0.6,
            length: 0.8,
            height: 0.25,
            color: new Color3(0.7, 0.6, 0.5),
        },
        galleon: {
            width: 0.9,
            length: 1.0,
            height: 0.3,
            color: new Color3(0.6, 0.5, 0.4),
        },
    }

    const specs = shipSpecs[shipClass]

    // Scale the ship box to represent the class
    ship.scaling = new Vector3(specs.width, specs.height, specs.length)

    // Apply material with distinct color
    const material = new StandardMaterial(`ship_${shipClass}_material`, scene)
    material.emissiveColor = specs.color
    material.specularColor = new Color3(0.2, 0.2, 0.2)
    ship.material = material

    return ship
}
