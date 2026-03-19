import { useEffect, useRef, useState } from "react";
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
} from "babylonjs";
import PauseMenu from "./PauseMenu";
import PlayerList from "./PlayerList";
import MultiplayerChat from "./MultiplayerChat";
import POIInteractionSystem from "./POIInteractionSystem";
import type { POIInteraction } from "./POIInteractionSystem";
import type { POI } from "./WorldManifest";
import type MultiplayerManager from "./MultiplayerManager";
import "./styles.css";

export type ShipClass = "sloop" | "brigantine" | "galleon";

// Hardcoded POI data matching the 3D scene positions
const WORLD_POIS: POI[] = [
  { id: "town_0", name: "Port Royal", type: "town", coords: { x: -8, y: -8 }, biome: "tropical", difficulty: 1, npcCount: 5, visited: false },
  { id: "town_1", name: "Tortuga Bay", type: "town", coords: { x: 8, y: 5 }, biome: "tropical", difficulty: 1, npcCount: 4, visited: false },
  { id: "island_0", name: "Emerald Isle", type: "island", coords: { x: -5, y: 8 }, biome: "tropical", difficulty: 1, npcCount: 0, visited: false },
  { id: "island_1", name: "Treasure Island", type: "island", coords: { x: 10, y: -10 }, biome: "temperate", difficulty: 2, npcCount: 0, visited: false },
  { id: "anomaly_0", name: "Cursed Waters", type: "anomaly", coords: { x: 5, y: -5 }, biome: "tropical", difficulty: 3, npcCount: 0, visited: false },
  { id: "anomaly_1", name: "Ghost Ship", type: "anomaly", coords: { x: -10, y: 5 }, biome: "temperate", difficulty: 3, npcCount: 0, visited: false },
  { id: "anomaly_2", name: "Strange Lights", type: "anomaly", coords: { x: 12, y: 8 }, biome: "temperate", difficulty: 2, npcCount: 0, visited: false },
];

interface GameProps {
  playerShipClass?: ShipClass;
  showBattle?: boolean;
  onQuitToMenu?: () => void;
  onInteract?: (interaction: POIInteraction) => void;
  multiplayerManager?: MultiplayerManager;
}

export default function Game({
  playerShipClass = "brigantine",
  showBattle = false,
  onQuitToMenu,
  onInteract,
  multiplayerManager,
}: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const shipMeshRef = useRef<Mesh | null>(null);
  const shipPhysicsRef = useRef({
    x: 0,
    z: 0,
    angle: 0,
    velocity: 0,
  });
  const [shipPosition, setShipPosition] = useState({ x: 0, z: 0 });
  const [direction, setDirection] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [remotePlayersState, setRemotePlayersState] = useState<any[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [interactionPrompt, setInteractionPrompt] = useState<string | null>(null);

  // Use refs for callbacks to avoid stale closures in the render loop
  const onInteractRef = useRef(onInteract);
  onInteractRef.current = onInteract;
  const poiSystemRef = useRef<POIInteractionSystem | null>(null);
  const lastPromptRef = useRef<string | null>(null);

  // Enhanced camera control state
  const cameraStateRef = useRef({
    distance: 8,
    panAngle: 0,
    defaultDistance: 8,
    defaultPanAngle: 0,
    isReturning: false,
    returnStartTime: 0,
    returnDuration: 3000,
    minDistance: 2,
    maxDistance: 15,
    panActive: false,
    lastMouseX: 0,
    lastMouseY: 0,
  });

  // Listen for remote player position updates
  useEffect(() => {
    if (multiplayerManager) {
      multiplayerManager.onPositionUpdate((players) => {
        setRemotePlayersState(players);
      });
    }
  }, [multiplayerManager]);

  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      const engine = new Engine(canvasRef.current, true);
      const scene = new Scene(engine);

      const camera = new UniversalCamera("camera", new Vector3(0, 5, 5));
      camera.attachControl(canvasRef.current, true);
      camera.inertia = 0.7;
      camera.angularSensibility = 1000;

      const cameraHeight = 6;

      const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
      light.intensity = 0.8;

      // Initialize POI interaction system
      const poiSystem = new POIInteractionSystem(WORLD_POIS);
      poiSystemRef.current = poiSystem;

      if (showBattle) {
        createBattleScene(scene, playerShipClass);
      } else {
        createOcean(scene);
        createIslands(scene);
        createTowns(scene);
        createAnomalies(scene);

        const playerShip = createShip(
          scene,
          playerShipClass,
          new Vector3(0, 0, 0),
        );
        shipMeshRef.current = playerShip;
      }

      engineRef.current = engine;

      engine.runRenderLoop(() => {
        scene.render();
      });

      const keysPressed: Record<string, boolean> = {};

      const handleKeyDown = (e: KeyboardEvent) => {
        keysPressed[e.key.toLowerCase()] = true;
        keysPressed[e.code.toLowerCase()] = true;

        if (e.key === "Escape" && !showBattle) {
          setIsPaused((prev) => !prev);
        }

        // E key for POI interaction
        if (e.key.toLowerCase() === "e" && !showBattle) {
          const sys = poiSystemRef.current;
          if (sys) {
            const interaction = sys.handleEKey();
            if (interaction) {
              onInteractRef.current?.(interaction);
            }
          }
        }
      };

      const handleKeyUp = (e: KeyboardEvent) => {
        keysPressed[e.key.toLowerCase()] = false;
        keysPressed[e.code.toLowerCase()] = false;
      };

      const handleMouseWheel = (e: WheelEvent) => {
        const state = cameraStateRef.current;
        if (!showBattle) {
          e.preventDefault();
          const zoomDelta = e.deltaY > 0 ? 0.5 : -0.5;
          state.distance = Math.max(
            state.minDistance,
            Math.min(state.maxDistance, state.distance + zoomDelta),
          );
          if (state.distance !== state.defaultDistance) {
            state.isReturning = false;
          }
        }
      };

      const handleMouseDown = (e: MouseEvent) => {
        const state = cameraStateRef.current;
        if (e.button === 2 && !showBattle) {
          state.panActive = true;
          state.lastMouseX = e.clientX;
          state.lastMouseY = e.clientY;
        }
      };

      const handleMouseMove = (e: MouseEvent) => {
        const state = cameraStateRef.current;
        if (state.panActive) {
          const deltaX = e.clientX - state.lastMouseX;
          const panSensitivity = 0.005;
          state.panAngle += deltaX * panSensitivity;
          state.lastMouseX = e.clientX;
          state.lastMouseY = e.clientY;
          if (state.panAngle !== state.defaultPanAngle) {
            state.isReturning = false;
          }
        }
      };

      const handleMouseUp = () => {
        const state = cameraStateRef.current;
        state.panActive = false;
        if (
          state.distance !== state.defaultDistance ||
          state.panAngle !== state.defaultPanAngle
        ) {
          state.isReturning = true;
          state.returnStartTime = Date.now();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
      canvasRef.current.addEventListener("wheel", handleMouseWheel, {
        passive: false,
      });
      window.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);

      const shipConfig = {
        sloop: {
          maxSpeed: 0.3,
          acceleration: 0.015,
          turnRate: 0.06,
          friction: 0.95,
        },
        brigantine: {
          maxSpeed: 0.2,
          acceleration: 0.01,
          turnRate: 0.04,
          friction: 0.94,
        },
        galleon: {
          maxSpeed: 0.15,
          acceleration: 0.008,
          turnRate: 0.03,
          friction: 0.93,
        },
      };
      const config = shipConfig[playerShipClass];

      scene.registerBeforeRender(() => {
        const physics = shipPhysicsRef.current;

        if (keysPressed["w"] || keysPressed["arrowup"] || keysPressed["W"]) {
          physics.velocity = Math.min(
            physics.velocity + config.acceleration,
            config.maxSpeed,
          );
        }
        if (keysPressed["s"] || keysPressed["arrowdown"] || keysPressed["S"]) {
          physics.velocity = Math.max(
            physics.velocity - config.acceleration,
            -config.maxSpeed * 0.5,
          );
        }

        if (keysPressed["a"] || keysPressed["arrowleft"] || keysPressed["A"]) {
          physics.angle += config.turnRate;
        }
        if (keysPressed["d"] || keysPressed["arrowright"] || keysPressed["D"]) {
          physics.angle -= config.turnRate;
        }

        if (
          !keysPressed["w"] &&
          !keysPressed["arrowup"] &&
          !keysPressed["s"] &&
          !keysPressed["arrowdown"] &&
          !keysPressed["W"] &&
          !keysPressed["S"]
        ) {
          physics.velocity *= config.friction;
        }

        if (Math.abs(physics.velocity) > 0.001) {
          physics.x += Math.sin(physics.angle) * physics.velocity;
          physics.z += Math.cos(physics.angle) * physics.velocity;
        }

        if (shipMeshRef.current) {
          shipMeshRef.current.position.x = physics.x;
          shipMeshRef.current.position.z = physics.z;
          shipMeshRef.current.rotation.y = physics.angle;
        }

        // Update POI system and interaction prompt
        if (!showBattle && poiSystemRef.current) {
          poiSystemRef.current.updatePlayerPosition(physics.x, physics.z);
          const prompt = poiSystemRef.current.getInteractionPrompt();
          const promptText = prompt ? prompt.text : null;
          if (promptText !== lastPromptRef.current) {
            lastPromptRef.current = promptText;
            setInteractionPrompt(promptText);
          }
        }

        // Camera follow
        const state = cameraStateRef.current;

        if (state.isReturning) {
          const elapsed = Date.now() - state.returnStartTime;
          const progress = Math.min(elapsed / state.returnDuration, 1);
          state.distance =
            state.distance +
            (state.defaultDistance - state.distance) * progress;
          state.panAngle =
            state.panAngle +
            (state.defaultPanAngle - state.panAngle) * progress;
          if (progress === 1) {
            state.isReturning = false;
            state.distance = state.defaultDistance;
            state.panAngle = state.defaultPanAngle;
          }
        }

        const shipHeading = physics.angle + state.panAngle;
        const cameraOffsetX = -Math.sin(shipHeading) * state.distance;
        const cameraOffsetZ = -Math.cos(shipHeading) * state.distance;

        camera.position.x = physics.x + cameraOffsetX;
        camera.position.z = physics.z + cameraOffsetZ;
        camera.position.y = cameraHeight;

        camera.setTarget(new Vector3(physics.x, 0, physics.z));

        setShipPosition({ x: physics.x, z: physics.z });
        setDirection(physics.angle);
        setSpeed(physics.velocity);
      });

      const handleResize = () => engine.resize();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
        if (canvasRef.current) {
          canvasRef.current.removeEventListener("wheel", handleMouseWheel);
        }
        window.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        engine.dispose();
      };
    } catch (error) {
      console.error("Game initialization error:", error);
    }
  }, [playerShipClass, showBattle]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          margin: 0,
          padding: 0,
        }}
        data-testid="game-canvas"
      />
      {multiplayerManager && (
        <>
          <PlayerList
            players={remotePlayersState}
            localPlayerId={multiplayerManager.getPlayerId()}
            isHost={multiplayerManager.getSessionConfig()?.isHost || false}
          />
          <MultiplayerChat
            manager={multiplayerManager}
            isOpen={chatOpen}
            onToggle={() => setChatOpen(!chatOpen)}
          />
        </>
      )}

      {/* Interaction prompt */}
      {interactionPrompt && !showBattle && (
        <div
          data-testid="interaction-prompt"
          style={{
            position: "absolute",
            bottom: "120px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(10, 14, 39, 0.95)",
            border: "2px solid #ffd700",
            borderRadius: "8px",
            padding: "14px 28px",
            color: "#ffd700",
            fontSize: "18px",
            fontWeight: "bold",
            textAlign: "center",
            textShadow: "0 0 10px rgba(255, 215, 0, 0.5)",
            animation: "promptPulse 1.5s ease-in-out infinite",
          }}
        >
          {interactionPrompt}
          <style>{`
            @keyframes promptPulse {
              0%, 100% { border-color: #ffd700; box-shadow: 0 0 10px rgba(255,215,0,0.3); }
              50% { border-color: #ffed4a; box-shadow: 0 0 20px rgba(255,215,0,0.6); }
            }
          `}</style>
        </div>
      )}

      {!showBattle && (
        <div
          className="hud"
          style={{
            position: "absolute",
            top: "16px",
            left: "16px",
            backgroundColor: "rgba(10, 14, 39, 0.9)",
            border: "2px solid #d4a574",
            borderRadius: "4px",
            padding: "12px 16px",
            color: "#e8dcc8",
            fontSize: "12px",
            maxWidth: "250px",
          }}
        >
          <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
            Ship Controls
          </div>
          <div style={{ fontSize: "11px", lineHeight: "1.6" }}>
            <div>W - Forward</div>
            <div>S - Back</div>
            <div>A - Left</div>
            <div>D - Right</div>
            <div>E - Interact</div>
          </div>
          <div
            style={{
              marginTop: "8px",
              paddingTop: "8px",
              borderTop: "1px solid #444",
              fontSize: "11px",
            }}
          >
            <div>
              Pos: ({shipPosition.x.toFixed(1)}, {shipPosition.z.toFixed(1)})
            </div>
            <div>Dir: {(direction * (180 / Math.PI)).toFixed(0)}°</div>
            <div>Speed: {(speed * 10).toFixed(1)}</div>
          </div>
        </div>
      )}
      {isPaused && (
        <PauseMenu
          onResume={() => setIsPaused(false)}
          onQuit={() => {
            setIsPaused(false);
            onQuitToMenu?.();
          }}
        />
      )}
    </div>
  );
}

// ─── Ship Construction ───────────────────────────────────────────────

interface ShipSpecs {
  width: number;
  length: number;
  height: number;
  color: Color3;
  mastCount: number;
}

const SHIP_SPECS: Record<ShipClass, ShipSpecs> = {
  sloop: {
    width: 0.6,
    length: 1.4,
    height: 0.4,
    color: new Color3(0.55, 0.35, 0.2),
    mastCount: 1,
  },
  brigantine: {
    width: 0.8,
    length: 1.8,
    height: 0.5,
    color: new Color3(0.45, 0.28, 0.15),
    mastCount: 2,
  },
  galleon: {
    width: 1.0,
    length: 2.2,
    height: 0.6,
    color: new Color3(0.35, 0.22, 0.12),
    mastCount: 3,
  },
};

function createShip(
  scene: Scene,
  shipClass: ShipClass,
  position: Vector3,
): Mesh {
  const specs = SHIP_SPECS[shipClass];
  const uid = `${shipClass}_${Math.random().toString(36).slice(2, 6)}`;

  // Root node
  const root = new Mesh(`ship_root_${uid}`, scene);
  root.position = position;

  // Materials
  const hullMat = new StandardMaterial(`hull_mat_${uid}`, scene);
  hullMat.emissiveColor = specs.color;
  hullMat.specularColor = new Color3(0.15, 0.1, 0.05);

  const deckMat = new StandardMaterial(`deck_mat_${uid}`, scene);
  deckMat.emissiveColor = new Color3(0.65, 0.5, 0.3);

  const mastMat = new StandardMaterial(`mast_mat_${uid}`, scene);
  mastMat.emissiveColor = new Color3(0.4, 0.28, 0.15);

  const sailMat = new StandardMaterial(`sail_mat_${uid}`, scene);
  sailMat.emissiveColor = new Color3(0.95, 0.9, 0.8);
  sailMat.backFaceCulling = false;

  const railMat = new StandardMaterial(`rail_mat_${uid}`, scene);
  railMat.emissiveColor = new Color3(0.5, 0.35, 0.2);

  // Hull body
  const hull = MeshBuilder.CreateBox(`hull_${uid}`, {
    width: specs.width,
    height: specs.height * 0.7,
    depth: specs.length * 0.65,
  }, scene);
  hull.parent = root;
  hull.position.y = specs.height * 0.35;
  hull.material = hullMat;

  // Bow (front) - tapered wedge using a 3-sided cylinder
  const bow = MeshBuilder.CreateCylinder(`bow_${uid}`, {
    height: specs.height * 0.7,
    diameterTop: 0.01,
    diameterBottom: specs.width * 0.9,
    tessellation: 4,
  }, scene);
  bow.parent = root;
  bow.position.z = specs.length * 0.45;
  bow.position.y = specs.height * 0.35;
  bow.scaling.x = 0.5;
  bow.scaling.z = 1.2;
  bow.material = hullMat;

  // Bowsprit (long pole at front)
  const bowsprit = MeshBuilder.CreateCylinder(`bowsprit_${uid}`, {
    height: specs.length * 0.4,
    diameter: specs.width * 0.04,
  }, scene);
  bowsprit.parent = root;
  bowsprit.rotation.x = Math.PI / 2 + 0.3; // Angled up slightly
  bowsprit.position.z = specs.length * 0.7;
  bowsprit.position.y = specs.height * 0.5;
  bowsprit.material = mastMat;

  // Stern (back) - slightly raised cabin
  const stern = MeshBuilder.CreateBox(`stern_${uid}`, {
    width: specs.width * 0.85,
    height: specs.height * 0.6,
    depth: specs.length * 0.2,
  }, scene);
  stern.parent = root;
  stern.position.z = -specs.length * 0.35;
  stern.position.y = specs.height * 0.7;
  stern.material = hullMat;

  // Stern cabin roof
  const sternRoof = MeshBuilder.CreateBox(`stern_roof_${uid}`, {
    width: specs.width * 0.9,
    height: specs.height * 0.08,
    depth: specs.length * 0.22,
  }, scene);
  sternRoof.parent = root;
  sternRoof.position.z = -specs.length * 0.35;
  sternRoof.position.y = specs.height * 1.02;
  sternRoof.material = deckMat;

  // Deck
  const deck = MeshBuilder.CreateBox(`deck_${uid}`, {
    width: specs.width * 0.9,
    height: specs.height * 0.05,
    depth: specs.length * 0.6,
  }, scene);
  deck.parent = root;
  deck.position.y = specs.height * 0.68;
  deck.material = deckMat;

  // Side rails
  for (const side of [-1, 1]) {
    const rail = MeshBuilder.CreateBox(`rail_${side}_${uid}`, {
      width: specs.width * 0.04,
      height: specs.height * 0.25,
      depth: specs.length * 0.65,
    }, scene);
    rail.parent = root;
    rail.position.x = side * specs.width * 0.47;
    rail.position.y = specs.height * 0.82;
    rail.material = railMat;
  }

  // Masts and sails
  const mastPositions = specs.mastCount === 1
    ? [0]
    : specs.mastCount === 2
      ? [-specs.length * 0.1, specs.length * 0.2]
      : [-specs.length * 0.2, specs.length * 0.05, specs.length * 0.25];

  const mastHeights = specs.mastCount === 1
    ? [specs.height * 3.5]
    : specs.mastCount === 2
      ? [specs.height * 3.5, specs.height * 3.0]
      : [specs.height * 3.0, specs.height * 3.8, specs.height * 2.8];

  mastPositions.forEach((zPos, i) => {
    const mastHeight = mastHeights[i];
    const mast = MeshBuilder.CreateCylinder(`mast_${i}_${uid}`, {
      height: mastHeight,
      diameter: specs.width * 0.05,
    }, scene);
    mast.parent = root;
    mast.position.z = zPos;
    mast.position.y = specs.height * 0.68 + mastHeight / 2;
    mast.material = mastMat;

    // Sail
    const sailHeight = mastHeight * 0.55;
    const sailWidth = specs.width * (i === (specs.mastCount === 3 ? 1 : 0) ? 0.9 : 0.7);
    const sail = MeshBuilder.CreatePlane(`sail_${i}_${uid}`, {
      width: sailWidth,
      height: sailHeight,
    }, scene);
    sail.parent = root;
    sail.position.z = zPos + 0.05;
    sail.position.y = specs.height * 0.68 + mastHeight * 0.55;
    sail.material = sailMat;

    // Yard arm (horizontal pole holding sail)
    const yard = MeshBuilder.CreateCylinder(`yard_${i}_${uid}`, {
      height: sailWidth * 1.1,
      diameter: specs.width * 0.03,
    }, scene);
    yard.parent = root;
    yard.rotation.z = Math.PI / 2;
    yard.position.z = zPos;
    yard.position.y = specs.height * 0.68 + mastHeight * 0.82;
    yard.material = mastMat;
  });

  // Crow's nest on main mast (tallest)
  const mainMastIdx = specs.mastCount === 3 ? 1 : 0;
  const crowsNest = MeshBuilder.CreateCylinder(`crows_nest_${uid}`, {
    height: specs.height * 0.15,
    diameterTop: specs.width * 0.25,
    diameterBottom: specs.width * 0.15,
    tessellation: 8,
  }, scene);
  crowsNest.parent = root;
  crowsNest.position.z = mastPositions[mainMastIdx];
  crowsNest.position.y = specs.height * 0.68 + mastHeights[mainMastIdx] * 0.75;
  crowsNest.material = railMat;

  return root;
}

// ─── Ocean ───────────────────────────────────────────────────────────

function createOcean(scene: Scene): Mesh {
  const ocean = MeshBuilder.CreateGround(
    "ocean",
    { width: 80, height: 80 },
    scene,
  );
  ocean.position.y = -0.1;

  const waterMaterial = new StandardMaterial("waterMaterial", scene);
  waterMaterial.emissiveColor = new Color3(0.05, 0.3, 0.55);
  waterMaterial.specularColor = new Color3(0.6, 0.7, 0.9);
  waterMaterial.specularPower = 64;

  ocean.material = waterMaterial;

  let time = 0;
  scene.registerBeforeRender(() => {
    time += 0.016;
    waterMaterial.alpha = 0.95 + Math.sin(time * 0.5) * 0.05;
    // Subtle color shimmer
    waterMaterial.emissiveColor = new Color3(
      0.05 + Math.sin(time * 0.3) * 0.02,
      0.3 + Math.sin(time * 0.2) * 0.03,
      0.55 + Math.sin(time * 0.4) * 0.04,
    );
  });

  return ocean;
}

// ─── Islands ─────────────────────────────────────────────────────────

function createIslands(scene: Scene): void {
  const islandPositions = [
    { x: -8, z: -8 },
    { x: 8, z: 5 },
    { x: -5, z: 8 },
    { x: 10, z: -10 },
  ];

  const islandMat = new StandardMaterial("island_sand_mat", scene);
  islandMat.emissiveColor = new Color3(0.85, 0.78, 0.55);
  islandMat.specularColor = new Color3(0.1, 0.1, 0.1);

  const beachMat = new StandardMaterial("beach_mat", scene);
  beachMat.emissiveColor = new Color3(0.95, 0.9, 0.7);

  const grassMat = new StandardMaterial("grass_mat", scene);
  grassMat.emissiveColor = new Color3(0.3, 0.55, 0.2);

  const trunkMat = new StandardMaterial("trunk_mat", scene);
  trunkMat.emissiveColor = new Color3(0.45, 0.3, 0.15);

  const leafMat = new StandardMaterial("leaf_mat", scene);
  leafMat.emissiveColor = new Color3(0.2, 0.6, 0.15);

  const rockMat = new StandardMaterial("rock_mat", scene);
  rockMat.emissiveColor = new Color3(0.4, 0.38, 0.35);

  islandPositions.forEach((pos, index) => {
    const size = 1.2 + (index % 3) * 0.4;

    // Main island base - flattened cylinder
    const base = MeshBuilder.CreateCylinder(`island_${index}`, {
      height: 0.5,
      diameterTop: size * 1.6,
      diameterBottom: size * 2.0,
      tessellation: 12,
    }, scene);
    base.position.set(pos.x, 0.15, pos.z);
    base.material = islandMat;

    // Beach ring
    const beach = MeshBuilder.CreateCylinder(`beach_${index}`, {
      height: 0.12,
      diameterTop: size * 2.1,
      diameterBottom: size * 2.3,
      tessellation: 12,
    }, scene);
    beach.position.set(pos.x, -0.02, pos.z);
    beach.material = beachMat;

    // Grassy top
    const grass = MeshBuilder.CreateCylinder(`grass_${index}`, {
      height: 0.08,
      diameter: size * 1.3,
      tessellation: 10,
    }, scene);
    grass.position.set(pos.x, 0.42, pos.z);
    grass.material = grassMat;

    // Palm trees (2-3 per island)
    const treeCount = 2 + (index % 2);
    for (let t = 0; t < treeCount; t++) {
      const angle = (t / treeCount) * Math.PI * 2 + index;
      const dist = size * 0.4;
      const tx = pos.x + Math.cos(angle) * dist;
      const tz = pos.z + Math.sin(angle) * dist;

      // Trunk - slightly curved using a tilted cylinder
      const trunk = MeshBuilder.CreateCylinder(`trunk_${index}_${t}`, {
        height: 1.2 + Math.random() * 0.4,
        diameterTop: 0.06,
        diameterBottom: 0.1,
      }, scene);
      trunk.position.set(tx, 1.0, tz);
      trunk.rotation.x = (Math.random() - 0.5) * 0.2;
      trunk.rotation.z = (Math.random() - 0.5) * 0.2;
      trunk.material = trunkMat;

      // Leaf canopy - flattened sphere
      const leaves = MeshBuilder.CreateSphere(`leaves_${index}_${t}`, {
        segments: 6,
        diameter: 0.8,
      }, scene);
      leaves.position.set(tx, 1.7 + Math.random() * 0.2, tz);
      leaves.scaling = new Vector3(1.2, 0.5, 1.2);
      leaves.material = leafMat;
    }

    // Rocks
    if (index % 2 === 0) {
      const rock = MeshBuilder.CreateSphere(`rock_${index}`, {
        segments: 4,
        diameter: 0.3,
      }, scene);
      rock.position.set(
        pos.x + size * 0.6,
        0.35,
        pos.z + size * 0.3,
      );
      rock.scaling = new Vector3(1, 0.6, 0.8);
      rock.material = rockMat;
    }
  });
}

// ─── Towns ───────────────────────────────────────────────────────────

function createTowns(scene: Scene): void {
  const townPositions = [
    { x: -8, z: -8, name: "Port Royal" },
    { x: 8, z: 5, name: "Tortuga Bay" },
  ];

  const buildingMat = new StandardMaterial("building_mat", scene);
  buildingMat.emissiveColor = new Color3(0.7, 0.6, 0.45);

  const roofMat = new StandardMaterial("roof_mat", scene);
  roofMat.emissiveColor = new Color3(0.6, 0.2, 0.15);

  const dockMat = new StandardMaterial("dock_mat", scene);
  dockMat.emissiveColor = new Color3(0.5, 0.38, 0.22);

  const flagMat = new StandardMaterial("flag_mat", scene);
  flagMat.emissiveColor = new Color3(0.9, 0.15, 0.1);
  flagMat.backFaceCulling = false;

  const lanternMat = new StandardMaterial("lantern_mat", scene);
  lanternMat.emissiveColor = new Color3(1.0, 0.85, 0.3);

  townPositions.forEach((pos, index) => {
    // Buildings (3-4 per town)
    const buildingCount = 3 + index;
    for (let b = 0; b < buildingCount; b++) {
      const angle = (b / buildingCount) * Math.PI * 2 + 0.5;
      const dist = 0.7 + b * 0.15;
      const bx = pos.x + Math.cos(angle) * dist;
      const bz = pos.z + Math.sin(angle) * dist;
      const bHeight = 0.4 + Math.random() * 0.4;
      const bWidth = 0.25 + Math.random() * 0.15;

      // Building body
      const building = MeshBuilder.CreateBox(`building_${index}_${b}`, {
        width: bWidth,
        height: bHeight,
        depth: bWidth * 1.2,
      }, scene);
      building.position.set(bx, 0.4 + bHeight / 2, bz);
      building.rotation.y = angle + Math.PI / 4;
      building.material = buildingMat;

      // Pitched roof
      const roof = MeshBuilder.CreateCylinder(`roof_${index}_${b}`, {
        height: bWidth * 1.3,
        diameterTop: 0,
        diameterBottom: bWidth * 1.5,
        tessellation: 4,
      }, scene);
      roof.position.set(bx, 0.4 + bHeight + bWidth * 0.4, bz);
      roof.rotation.y = angle + Math.PI / 4;
      roof.material = roofMat;
    }

    // Dock extending into water
    const dockAngle = index === 0 ? Math.PI / 4 : -Math.PI / 3;
    const dock = MeshBuilder.CreateBox(`dock_${index}`, {
      width: 0.3,
      height: 0.08,
      depth: 2.0,
    }, scene);
    dock.position.set(
      pos.x + Math.cos(dockAngle) * 1.5,
      0.08,
      pos.z + Math.sin(dockAngle) * 1.5,
    );
    dock.rotation.y = dockAngle;
    dock.material = dockMat;

    // Dock posts
    for (let p = 0; p < 3; p++) {
      const postDist = 0.7 + p * 0.6;
      const post = MeshBuilder.CreateCylinder(`dock_post_${index}_${p}`, {
        height: 0.5,
        diameter: 0.06,
      }, scene);
      post.position.set(
        pos.x + Math.cos(dockAngle) * postDist,
        0.1,
        pos.z + Math.sin(dockAngle) * postDist,
      );
      post.material = dockMat;
    }

    // Flagpole with flag
    const pole = MeshBuilder.CreateCylinder(`flagpole_${index}`, {
      height: 2.0,
      diameter: 0.05,
    }, scene);
    pole.position.set(pos.x + 0.3, 1.4, pos.z + 0.3);
    pole.material = dockMat;

    const flag = MeshBuilder.CreatePlane(`flag_${index}`, {
      width: 0.4,
      height: 0.25,
    }, scene);
    flag.position.set(pos.x + 0.55, 2.2, pos.z + 0.3);
    flag.material = flagMat;

    // Animated flag wave
    let flagTime = index * 2;
    scene.registerBeforeRender(() => {
      flagTime += 0.03;
      flag.position.x = pos.x + 0.55 + Math.sin(flagTime) * 0.03;
    });

    // Lantern glow
    const lantern = MeshBuilder.CreateSphere(`lantern_${index}`, {
      segments: 6,
      diameter: 0.15,
    }, scene);
    lantern.position.set(pos.x, 1.2, pos.z);
    lantern.material = lanternMat;

    // Lantern glow animation
    let lanternTime = 0;
    scene.registerBeforeRender(() => {
      lanternTime += 0.02;
      (lantern.material as StandardMaterial).emissiveColor = new Color3(
        1.0,
        0.85 + Math.sin(lanternTime) * 0.1,
        0.3 + Math.sin(lanternTime * 1.5) * 0.1,
      );
    });
  });
}

// ─── Anomalies ───────────────────────────────────────────────────────

function createAnomalies(scene: Scene): void {
  const anomalyPositions = [
    { x: 5, z: -5 },
    { x: -10, z: 5 },
    { x: 12, z: 8 },
  ];

  anomalyPositions.forEach((pos, index) => {
    const isPurple = index % 2 === 0;
    const baseColor = isPurple
      ? new Color3(0.4, 0.1, 0.5)
      : new Color3(0.6, 0.05, 0.15);

    // Outer torus - spinning ring
    const outerMat = new StandardMaterial(`anomaly_outer_${index}`, scene);
    outerMat.emissiveColor = baseColor;
    outerMat.specularColor = new Color3(0.9, 0.5, 0.8);

    const outer = MeshBuilder.CreateTorus(`anomaly_ring_${index}`, {
      diameter: 1.4,
      thickness: 0.15,
      tessellation: 24,
    }, scene);
    outer.position.set(pos.x, 0.8, pos.z);
    outer.material = outerMat;

    // Inner torus - counter-rotating
    const innerMat = new StandardMaterial(`anomaly_inner_${index}`, scene);
    innerMat.emissiveColor = isPurple
      ? new Color3(0.6, 0.2, 0.8)
      : new Color3(0.8, 0.15, 0.3);
    innerMat.alpha = 0.7;

    const inner = MeshBuilder.CreateTorus(`anomaly_inner_ring_${index}`, {
      diameter: 0.9,
      thickness: 0.1,
      tessellation: 20,
    }, scene);
    inner.position.set(pos.x, 0.8, pos.z);
    inner.material = innerMat;

    // Central glowing orb
    const orbMat = new StandardMaterial(`anomaly_orb_${index}`, scene);
    orbMat.emissiveColor = isPurple
      ? new Color3(0.8, 0.5, 1.0)
      : new Color3(1.0, 0.3, 0.4);
    orbMat.alpha = 0.8;

    const orb = MeshBuilder.CreateSphere(`anomaly_orb_${index}`, {
      segments: 8,
      diameter: 0.35,
    }, scene);
    orb.position.set(pos.x, 0.8, pos.z);
    orb.material = orbMat;

    // Vertical light beam
    const beamMat = new StandardMaterial(`anomaly_beam_${index}`, scene);
    beamMat.emissiveColor = baseColor;
    beamMat.alpha = 0.3;

    const beam = MeshBuilder.CreateCylinder(`anomaly_beam_${index}`, {
      height: 4,
      diameterTop: 0.05,
      diameterBottom: 0.3,
    }, scene);
    beam.position.set(pos.x, 2.5, pos.z);
    beam.material = beamMat;

    // Animations
    scene.registerBeforeRender(() => {
      outer.rotation.y += 0.02;
      outer.rotation.x += 0.008;
      inner.rotation.y -= 0.03;
      inner.rotation.z += 0.015;

      // Pulsing orb
      const pulse = 0.9 + Math.sin(Date.now() * 0.003 + index) * 0.15;
      orb.scaling = new Vector3(pulse, pulse, pulse);

      // Beam flicker
      (beamMat as StandardMaterial).alpha = 0.2 + Math.sin(Date.now() * 0.005 + index * 2) * 0.15;
    });
  });
}

// ─── Battle Scene ────────────────────────────────────────────────────

function createBattleScene(scene: Scene, playerShipClass: ShipClass): void {
  const background = MeshBuilder.CreatePlane("battle_bg", { size: 30 }, scene);
  background.position.z = -5;
  const bgMaterial = new StandardMaterial("bg_material", scene);
  bgMaterial.emissiveColor = new Color3(0.2, 0.3, 0.4);
  background.material = bgMaterial;

  createShip(scene, playerShipClass, new Vector3(-6, 1, 0));

  const enemyShipClass = (
    playerShipClass === "sloop" ? "galleon" : "sloop"
  ) as ShipClass;
  const enemyShip = createShip(scene, enemyShipClass, new Vector3(6, 1, 0));
  enemyShip.rotation.y = Math.PI;
}
