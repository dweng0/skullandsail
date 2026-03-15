import { useState, useEffect, useRef } from "react";
import Game from "./Game";
import NarrativePanel from "./NarrativePanel";
import NPCDialogueUI from "./NPCDialogueUI";
import POIInteractionSystem from "./POIInteractionSystem";
import StoryProgressionSystem from "./StoryProgressionSystem";
import { WorldManifest, createWorldManifest } from "./WorldManifest";
import type { POI } from "./WorldManifest";
import NPCManager from "./NPCManager";
import QuestManagerUpgraded from "./QuestManagerUpgraded";
import LLMCallManager from "./LLMCallManager";
import type { LLMConfig } from "./LLMSetup";
import type { ShipClass } from "./Game";
import type MultiplayerManager from "./MultiplayerManager";
import type { NPC } from "./NPCManager";

interface GameMasterProps {
  playerShipClass: ShipClass;
  llmConfig: LLMConfig;
  onQuitToMenu: () => void;
  multiplayerManager?: MultiplayerManager;
}

type NarrativeDisplayMode = "instant" | "typewriter" | "fade";

/**
 * GameMaster: Central coordinator for all LLM-driven game systems
 * Integrates: POI Interaction, Narrative Display, NPC Dialogue, Story Progression
 */
export default function GameMaster({
  playerShipClass,
  llmConfig,
  onQuitToMenu,
  multiplayerManager,
}: GameMasterProps) {
  // Core systems
  const [worldManifest] = useState<WorldManifest>(() => createWorldManifest());
  const [npcManager] = useState(() => new NPCManager());
  const [llmManager] = useState(() => new LLMCallManager(llmConfig));
  // Quest manager for future integration (useRef to prevent dependency issues)
  useRef(new QuestManagerUpgraded(llmManager, npcManager));
  const [storySystem] = useState(() => new StoryProgressionSystem());
  const [poiSystem] = useState(
    () => new POIInteractionSystem(worldManifest.poiList),
  );

  // Initialize NPCs for all towns
  useEffect(() => {
    worldManifest.poiList.forEach((poi: POI) => {
      if (poi.type === "town") {
        npcManager.generateNPCsForTown(poi.id, poi.biome);
      }
    });
  }, [worldManifest, npcManager]);

  // UI State
  // const [shipPosition, setShipPosition] = useState({ x: 0, z: 0 });
  const [narrativeVisible, setNarrativeVisible] = useState(false);
  const [narrativeText, setNarrativeText] = useState("");
  const [narrativeSpeaker, setNarrativeSpeaker] = useState("Game Master");
  const [narrativeMode, setNarrativeMode] =
    useState<NarrativeDisplayMode>("fade");

  const [dialogueOpen, setDialogueOpen] = useState(false);
  const [selectedNPC, setSelectedNPC] = useState<NPC | null>(null);
  const [selectedTownId, setSelectedTownId] = useState<string>("");

  const [interactionPrompt] = useState<string>("");

  const gameRef = useRef<HTMLDivElement>(null);

  // Handle E key for POI interaction
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toUpperCase() === "E" && !dialogueOpen) {
        const interaction = poiSystem.handleEKey();

        if (interaction) {
          if (interaction.type === "town") {
            // Open NPC dialogue for town
            const npcs = npcManager.getNPCsForTown(interaction.poiId);
            if (npcs.length > 0) {
              const firstNPC = npcs[0];
              setSelectedNPC(firstNPC);
              setSelectedTownId(interaction.poiId);
              setDialogueOpen(true);
            }
          } else if (interaction.type === "island") {
            // Show island description
            showIslandNarrative(interaction.name);
          } else if (interaction.type === "anomaly") {
            // Show anomaly encounter
            showAnomalyEncounter(interaction.name);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dialogueOpen, poiSystem, npcManager]);

  // Show island description narrative
  const showIslandNarrative = async (islandName: string) => {
    const descriptions = [
      `${islandName} is a lush tropical paradise with ancient ruins hidden in the jungle.`,
      `The shores of ${islandName} are lined with white sand and crystal waters.`,
      `${islandName} rises from the sea like a jewel, teeming with mystery.`,
    ];
    const description =
      descriptions[Math.floor(Math.random() * descriptions.length)];
    setNarrativeText(description);
    setNarrativeSpeaker("Game Master");
    setNarrativeMode("fade");
    setNarrativeVisible(true);
  };

  // Show anomaly encounter narrative
  const showAnomalyEncounter = async (_anomalyName: string) => {
    const encounter = poiSystem.getAnomalyEncounter();
    if (encounter) {
      setNarrativeText(encounter.description);
      setNarrativeSpeaker("⚠️ Danger Warning");
      setNarrativeMode("typewriter");
      setNarrativeVisible(true);
    }
  };

  // Handle quest selection from NPC
  const handleQuestSelect = async (quest: any) => {
    if (selectedNPC && selectedTownId) {
      setDialogueOpen(false);
      const narrative = await storySystem.generateArcNarrative();
      setNarrativeText(`You accept: "${quest.title}". ${narrative}`);
      setNarrativeSpeaker("Game Master");
      setNarrativeMode("fade");
      setNarrativeVisible(true);
    }
  };

  // Handle dialogue close
  const handleDialogueClose = () => {
    setDialogueOpen(false);
    setSelectedNPC(null);
    setSelectedTownId("");
  };

  // Get available quests for selected NPC
  const getAvailableQuests = () => {
    if (selectedNPC && selectedTownId) {
      return [
        {
          id: "quest_1",
          title: "Sample Quest",
          reward: { xp: 100, gold: 50 },
        },
      ];
    }
    return [];
  };

  return (
    <div ref={gameRef} style={{ width: "100%", height: "100%" }}>
      {/* Main Game Renderer */}
      <Game
        playerShipClass={playerShipClass}
        onQuitToMenu={onQuitToMenu}
        multiplayerManager={multiplayerManager}
      />

      {/* Interaction Prompt HUD */}
      {interactionPrompt && (
        <div
          style={{
            position: "fixed",
            bottom: "120px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.7)",
            border: "2px solid #ffd700",
            color: "#ffd700",
            padding: "10px 20px",
            borderRadius: "8px",
            fontSize: "14px",
            zIndex: 500,
          }}
        >
          {interactionPrompt}
        </div>
      )}

      {/* Narrative Display Panel */}
      <NarrativePanel
        narrative={narrativeText}
        speaker={narrativeSpeaker}
        isVisible={narrativeVisible}
        onClose={() => setNarrativeVisible(false)}
        displayMode={narrativeMode}
      />

      {/* NPC Dialogue UI */}
      {selectedNPC && (
        <NPCDialogueUI
          npc={selectedNPC}
          isOpen={dialogueOpen}
          onClose={handleDialogueClose}
          onSelectQuest={handleQuestSelect}
          availableQuests={getAvailableQuests()}
        />
      )}

      {/* Debug Info - Remove in production */}
      {false && (
        <div
          style={{
            position: "fixed",
            top: "10px",
            left: "10px",
            background: "rgba(0,0,0,0.8)",
            color: "#ffd700",
            padding: "10px",
            fontSize: "12px",
            fontFamily: "monospace",
            maxWidth: "300px",
            zIndex: 1000,
          }}
        >
          <div>Ship: 0.0, 0.0</div>
          <div>Arc: {storySystem.getCurrentArc()}</div>
          <div>POIs: {worldManifest.poiList.length}</div>
        </div>
      )}
    </div>
  );
}
