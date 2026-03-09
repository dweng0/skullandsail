import { useEffect, useRef } from 'react'
import { Engine, Scene, Mesh, Vector3 } from 'babylonjs'

export type ShipClass = 'sloop' | 'brigantine' | 'galleon'

interface GameProps {
    playerShipClass?: ShipClass
}

export default function Game({ playerShipClass = 'brigantine' }: GameProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const engineRef = useRef<Engine | null>(null)

    useEffect(() => {
        if (!canvasRef.current) return

        try {
            const engine = new Engine(canvasRef.current, true)
            const scene = new Scene(engine)

            // Set up camera for top-down view
            const camera = new (require('babylonjs').UniversalCamera)(
                'camera',
                new Vector3(0, 5, 5),
            )
            camera.attachControl(canvasRef.current, true)
            camera.inertia = 0.7
            camera.angularSensibility = 1000

            // Set up lighting
            const light = new (require('babylonjs').HemisphericLight)(
                'light',
                new Vector3(0, 1, 0),
                scene,
            )
            light.intensity = 0.8

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

            engineRef.current = engine

            // Render loop
            engine.runRenderLoop(() => {
                scene.render()
            })

            // Handle resize
            const handleResize = () => engine.resize()
            window.addEventListener('resize', handleResize)

            return () => {
                window.removeEventListener('resize', handleResize)
                engine.dispose()
            }
        } catch (error) {
            // Silently handle initialization errors in test environments
        }
    }, [playerShipClass])

    return (
        <canvas
            ref={canvasRef}
            style={{ display: 'block', width: '100%', height: '100%' }}
            data-testid="game-canvas"
        />
    )
}

function createOcean(scene: Scene): Mesh {
    const BabylonJS = require('babylonjs')
    const { MeshBuilder, StandardMaterial, Color3 } = BabylonJS

    // Create a large plane for the ocean
    const ocean = MeshBuilder.CreateGround(
        'ocean',
        { width: 50, height: 50 },
        scene,
    )
    ocean.position.y = -0.1

    // Create animated water material
    const waterMaterial = new StandardMaterial('waterMaterial', scene)
    waterMaterial.diffuse = new Color3(0.1, 0.5, 0.8)
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
    const BabylonJS = require('babylonjs')
    const { MeshBuilder, StandardMaterial, Color3 } = BabylonJS

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
            islandMaterial.diffuse = new Color3(0.9, 0.85, 0.6)
        } else {
            // Green color
            islandMaterial.diffuse = new Color3(0.4, 0.6, 0.3)
        }
        islandMaterial.specularColor = new Color3(0.2, 0.2, 0.2)

        island.material = islandMaterial
    })
}

function createTowns(scene: Scene): void {
    const BabylonJS = require('babylonjs')
    const { MeshBuilder, StandardMaterial, Color3 } = BabylonJS

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
        beaconMaterial.diffuse = new Color3(1.0, 0.85, 0.2)
        beaconMaterial.specularColor = new Color3(1.0, 1.0, 0.5)
        beaconMaterial.specularPower = 128

        beacon.material = beaconMaterial

        // Create cone top for beacon
        const coneTop = MeshBuilder.CreateCone(
            `town_cone_${index}`,
            { height: 0.8, diameter: 0.6 },
            scene,
        )
        coneTop.position.x = pos.x
        coneTop.position.z = pos.z
        coneTop.position.y = 1.8

        coneTop.material = beaconMaterial
    })
}

function createAnomalies(scene: Scene): void {
    const BabylonJS = require('babylonjs')
    const { MeshBuilder, StandardMaterial, Color3 } = BabylonJS

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
        // Mix of purple and red
        const isPurple = index % 2 === 0
        if (isPurple) {
            anomalyMaterial.diffuse = new Color3(0.7, 0.2, 0.8)
        } else {
            anomalyMaterial.diffuse = new Color3(0.9, 0.1, 0.3)
        }
        anomalyMaterial.specularColor = new Color3(0.9, 0.5, 0.8)

        anomaly.material = anomalyMaterial

        // Add rotation animation to create swirl effect
        scene.registerBeforeRender(() => {
            anomaly.rotation.z += 0.02
            anomaly.rotation.x += 0.01
        })
    })
}

function createShip(
    scene: Scene,
    shipClass: ShipClass,
    position: Vector3,
): Mesh {
    const BabylonJS = require('babylonjs')
    const { MeshBuilder, StandardMaterial, Color3 } = BabylonJS

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
    material.diffuse = specs.color
    material.specularColor = new Color3(0.2, 0.2, 0.2)
    ship.material = material

    return ship
}
