# BDD Status

Checked 167 scenario(s) across 27 test file(s).


## Feature: Procedural Asset Pipeline

- [x] Game initialises without missing asset errors
- [x] Ship classes render as distinct silhouettes
- [x] Ocean renders with animated water material
- [x] Island tiles render as raised terrain
- [x] Town markers render as gold beacons
- [x] Anomaly markers render as purple/red swirls
- [x] Battle scene renders distinct ship silhouettes
- [x] Game uses consistent pirate-themed UI palette

## Feature: LLM Setup

- [x] User can enter OpenAI-compatible API endpoint and key
- [x] User can enter Claude API key and test connection
- [x] User can enter Gemini API key and test connection
- [x] If connection test fails, user sees error and can retry
- [x] Once connected, LLM generates overarching storyline
- [x] LLM configuration is persisted in localStorage
- [x] Auto-connect with cached LLM configuration
- [x] Pause menu appears when pressing Escape
- [x] Settings menu allows clearing cached data

## Feature: Character & Ship Selection

- [x] User can enter captain name
- [x] User can choose ship class
- [x] Each ship class has different starting stats
- [x] User cannot start game without name and ship selected
- [x] LLM suggests ship names based on ship class
- [x] Player can pick from suggested ship names
- [x] Player can manually enter custom ship name
- [x] Ship name is displayed on HUD during gameplay

## Feature: World Generation & Map Manifest

- [x] Game loads with fixed deterministic seed
- [x] Map manifest includes world metadata
- [x] Biome generation assigns terrain types to regions
- [x] Biome affects encounter difficulty and theme
- [x] Sea map contains islands, towns, and anomalies
- [x] Towns and anomalies are stable per seed
- [x] LLM is consulted to name points of interest
- [x] World manifest is loaded on game start
- [x] World state is saved to localStorage for resumption

## Feature: World Map Navigation

- [x] Captain's ship is rendered on sea map
- [x] Camera follows ship from behind
- [x] Movement controls are displayed on the HUD
- [x] Ship uses realistic physics for movement and steering
- [x] Player can sail in eight directions with keyboard input
- [x] Ship speed on map varies by ship class
- [x] When ship enters town proximity, transition prompt appears
- [x] When ship enters anomaly proximity, encounter is triggered
- [x] LLM narrates each anomaly encounter

## Feature: Sea Battle (ATB Combat)

- [x] Random encounter or anomaly triggers battle scene
- [x] Each combatant has ATB time bar that fills in real time
- [x] When player's ATB bar is full, player can choose action
- [x] Special skills have separate charge bar
- [x] Fire Cannons deals standard damage
- [x] Broadside deals AoE damage with longer reset
- [x] Defeating all enemies ends battle and awards XP
- [x] If player's ship HP reaches 0, the run ends
- [x] Battle difficulty is influenced by player level and LLM
- [x] LLM provides one-line narrative for battle outcome

## Feature: Experience & Leveling (DnD-style)

- [x] Defeating enemies in battle awards XP
- [x] When XP reaches threshold, captain levels up
- [x] Each level-up increases stats (HP, STR, DEX, CON)
- [x] Stat increases vary by ship class
- [x] Level and stats are displayed on HUD

## Feature: Towns & Ports

- [x] Entering town loads side-scrolling port view
- [x] Town has Market, Shipyard, and Tavern
- [x] In Market, player can buy and sell trade goods
- [x] Trade prices vary between towns
- [x] In Tavern, player can rest to restore HP
- [x] Tavern displays LLM-generated NPC dialogue and quests
- [x] In Shipyard, player can upgrade cannons, hull, or sails
- [x] In Shipyard, player can hire crew members

## Feature: Quests (LLM Game Master)

- [x] At game start, LLM generates 3 initial quests
- [x] Completing quest awards XP, gold, and triggers narrative
- [x] New quests can be generated dynamically by LLM
- [x] Quest objectives appear in HUD log
- [x] LLM narrates major story milestones

## Feature: Ship Upgrades & Crew

- [x] Cannon upgrades increase battle damage output
- [x] Hull upgrades increase max HP
- [x] Sail upgrades increase world map speed
- [x] Crew members can be assigned roles
- [x] Max crew capacity depends on ship class

## Feature: Text-to-Speech Narration (Low Priority)

- [x] LLM narrative text can be read aloud
- [x] Player can toggle TTS on/off in settings
- [x] Each spoken line uses configurable voice and rate

## Feature: Game Save/Load System

- [x] Game state is saved to localStorage automatically
- [x] Player can load a saved game
- [x] Save file includes captain name and ship details

## Feature: Main Menu Redesign

- [x] Main menu shows game flow options
- [x] New Game prompts LLM setup if needed
- [x] Continue button only appears if save exists

## Feature: Ship Modularity System

- [x] Ships are defined in a configurable system
- [x] Each ship class has distinct visual and gameplay feel

## Feature: Narrative Display UI

- [x] Narrative text displays in a styled panel
- [x] Player can dismiss narrative text
- [x] Narrative appears with smooth animations
- [x] Narrative includes speaker/context label

## Feature: Points of Interest Interaction

- [x] Player can hover over POI names to see info
- [x] Player can interact with points of interest
- [x] Island visitation shows location description
- [x] Town names are generated once and cached
- [x] POI names display on world map
- [x] Player can see interaction radius around POI
- [x] Anomaly encounters include narrative lead-in

## Feature: Location Data Persistence

- [x] World generation includes location metadata
- [x] Save file includes POI metadata
- [x] NPC dialogue is generated once per location

## Feature: NPC System

- [x] NPCs are generated during town creation
- [x] NPC names are thematic to world setting
- [x] NPCs have distinct personalities and dialogue
- [x] NPCs remember player reputation
- [x] Quest-giving NPCs are flagged as patrons
- [x] NPCs have background stories generated by LLM

## Feature: LLM-Driven Quest Generation

- [x] LLM generates quests from NPC hooks
- [x] Quests are narrative-driven with context
- [x] Quest completion triggers LLM narrative continuation
- [x] Failed quests have alternative outcomes
- [x] Quest rewards are scaled to player level
- [x] Active quest log shows quest-giver NPC

## Feature: World Manifest & POI Metadata

- [x] World manifest defines all POI locations
- [x] Biome affects NPC types and quests
- [x] World manifest persists across saves
- [x] Manifest includes POI discovery tracking

## Feature: Dynamic POI Interaction UI

- [x] E key triggers interaction when near POI
- [x] Hovering over POI shows tooltip info
- [x] POI names render on world map with zoom scaling
- [x] Interaction radius is visually indicated
- [x] POI interaction handler routes to correct UI

## Feature: Narrative Display Panel

- [x] Narrative panel appears when LLM generates text
- [x] Narrative text is readable with proper formatting
- [x] Speaker label shows narrative source
- [x] Player can dismiss narrative panel
- [x] Narrative panel supports multiple display modes
- [x] Narrative is recorded in story journal

## Feature: LLM Integration Hub

- [x] LLM is called with full game context
- [x] LLM responses are cached to prevent redundant calls
- [x] LLM calls are queued to prevent spam
- [x] LLM failures gracefully degrade

## Feature: NPC Dialogue Trees

- [x] Clicking NPC opens dialogue menu
- [x] "Greet" option shows NPC's greeting dialogue
- [x] "Learn More" shows NPC backstory
- [x] "Ask About Quests" shows available quests
- [x] Dialogue is personalized based on player history

## Feature: Battle Encounter Narrative

- [x] Approaching anomaly shows encounter narrative
- [x] Battle outcome includes victory/defeat narrative
- [x] Enemy encounters are themed to biome and storyline

## Feature: Storyline Progression Tracking

- [x] Story arc has progression states
- [x] Major quests trigger story progression
- [x] Player choices affect story branches
- [x] Story milestones generate commemorative narratives

## Feature: Enhanced Camera Controls

- [x] Player can scroll to zoom camera in and out
- [x] Player can right-click to pan camera
- [x] Camera slowly returns to follow mode after manual adjustment

## Feature: WebRTC Multiplayer (Star Topology)

- [x] User can join multiplayer session
- [x] Server/host initiates multiplayer game
- [x] Peer connection uses WebRTC with STUN/TURN
- [x] Player sees other players' ships on world map
- [x] Player can see player list and connection status
- [x] Disconnect and reconnect logic
- [x] Ship positions sync across peers
- [x] World state remains consistent across peers
- [x] Battle encounters with multiplayer
- [x] Crew and ship upgrades are per-player
- [x] Chat/emote system for players
- [x] Session persistence and save/load

## Feature: LLM Game Master Narrative

- [x] LLM maintains narrative context across session
- [x] Story beat appears at major progression milestones
- [x] LLM generates random world events during exploration
- [x] Player choices create branching narrative consequences
- [x] NPC reactions change based on player history
- [x] LLM adjusts narrative tension based on player power level
- [x] Major story conclusion generates epilogue
- [x] Narrative journal logs major story beats

---
**167/167 scenarios covered.**

All BDD scenarios are now covered and passing.