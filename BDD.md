---
language: typescript
framework: react-vite
build_cmd: npm run build
test_cmd: npx vitest run
lint_cmd: npm run lint
fmt_cmd: npm run format
birth_date: 2026-03-09
---

# Skull & Sail — Pirate Roguelike RPG

## System Description

Skull & Sail is a pirate roguelike RPG where an AI Game Master narrates your voyage across a procedurally generated sea. Command your ship, trade at ports, fight turn-based ATB sea battles, and chase an LLM-crafted overarching storyline. Every run generates a new world.

Feature: Procedural Asset Pipeline

All visuals are procedurally generated via BabylonJS code — no external asset files required. Game logic is pure TypeScript, renderer is BabylonJS, UI is React.

Scenario: Game initialises without missing asset errors
- The game starts with only procedurally generated geometry
- No external model/texture files are loaded
- The app does not crash or show "missing asset" warnings

Scenario: Ship classes render as distinct silhouettes
- Sloop renders as a small/narrow top-down silhouette (fast visual archetype)
- Brigantine renders as a medium-width silhouette
- Galleon renders as a large/wide silhouette
- All are rendered in the world map top-down view

Scenario: Ocean renders with animated water material
- The world map background is an animated blue plane
- The water has a normal-mapped surface effect to suggest waves
- Animation loops smoothly without hitching

Scenario: Island tiles render as raised terrain
- Islands appear as raised mesh geometry on the map
- They use a sandy/green color scheme
- Islands are positioned according to the world seed

Scenario: Town markers render as gold beacons
- Town locations show a distinct yellow/gold beacon shape
- The beacon is visually different from islands or anomalies
- Beacons are positioned at known town coordinates

Scenario: Anomaly markers render as purple/red swirls
- Anomaly encounter points show a distinct purple/red swirling shape
- Visually distinct from towns and islands
- Positioned at known anomaly coordinates

Scenario: Battle scene renders distinct ship silhouettes
- Player and enemy ships render as 3D top-down silhouettes in battle
- Each ship is clearly distinguishable (color, scale, orientation)
- Cannon mounts are visible on each ship

Scenario: Game uses consistent pirate-themed UI palette
- UI components use dark navy backgrounds
- Gold/yellow for highlights and important elements
- Aged parchment color for text overlays and panels
- Consistent palette throughout all screens

Feature: LLM Setup

Players configure their LLM backend before starting the game. Supported providers: OpenAI-compatible, Claude, Gemini.

Scenario: User can enter OpenAI-compatible API endpoint and key
- A setup form collects an API endpoint URL and API key
- A "Test Connection" button validates the connection
- On success, a confirmation message appears
- The endpoint and key are stored in game state for LLM calls

Scenario: User can enter Claude API key and test connection
- A separate form field collects a Claude API key
- Clicking "Test Connection" makes a test API call to Claude
- On success, confirmation message appears
- Key is stored for LLM narrative generation

Scenario: User can enter Gemini API key and test connection
- A form field accepts a Google Gemini API key
- "Test Connection" validates via a test API call
- Success confirmation appears
- Key is stored in game state

Scenario: If connection test fails, user sees error and can retry
- Failed connection attempts show a clear error message
- Error explains the failure (e.g., invalid key, network error)
- User can edit the key/endpoint and try again without restarting
- Retrying does not lose previous input

Scenario: Once connected, LLM generates overarching storyline
- After a successful connection test, the game calls the LLM to generate a high-level storyline (200-300 words)
- The storyline is stored in game state
- This storyline provides context for later quest generation

Scenario: LLM configuration is persisted in localStorage
- After a successful connection, API config (provider, key, endpoint) is saved to browser localStorage
- On app reload, saved config is loaded and displayed
- User can edit and update saved config
- Clearing localStorage removes stored config

Scenario: Auto-connect with cached LLM configuration
- On app load, if LLM config exists in localStorage, automatically establish connection
- Skip LLM setup form if config is already cached
- Proceed directly to character selection or main menu
- User can override with Settings menu → Clear Cache

Scenario: Pause menu appears when pressing Escape
- Pressing ESC during gameplay opens a pause menu overlay
- Menu shows "Resume", "Settings", "Quit to Menu" options
- Game is paused while menu is open
- Pressing ESC again or clicking "Resume" closes menu and resumes play
- Menu can be closed without losing game state

Scenario: Settings menu allows clearing cached data
- A Settings option in pause menu opens settings panel
- "Clear Cache" button removes all cached LLM config and game saves
- Confirmation dialog prevents accidental data loss
- After clearing, user must re-enter LLM credentials
- Other settings can be added here in future (audio, graphics, etc.)

Feature: Character & Ship Selection

Player creates a captain and chooses a starting ship class.

Scenario: User can enter captain name
- A text input field accepts a captain name (1-30 characters)
- The name is stored in game state
- The name is displayed on the HUD during gameplay

Scenario: User can choose ship class
- Three radio buttons or card options: Sloop, Brigantine, Galleon
- Each option shows a visual preview and stat summary
- Selecting a ship updates game state with that class

Scenario: Each ship class has different starting stats
- Sloop: Speed +2, Trade 0, Combat -1
- Brigantine: Speed 0, Trade +1, Combat 0
- Galleon: Speed -1, Trade 0, Combat +1
- Stats are derived from ship class and influence gameplay

Scenario: User cannot start game without name and ship selected
- A "Start Game" button is disabled until both fields are filled
- Clicking it without selection shows a prompt to complete setup
- Once both are set, the button enables and starts world generation

Scenario: LLM suggests ship names based on ship class
- After selecting a ship class, the LLM generates 3-5 ship name suggestions
- Suggestions are thematic to pirate/naval vessels
- Examples: "The Crimson Tide" (Brigantine), "Swift Justice" (Sloop)
- Suggestions appear instantly or with brief loading

Scenario: Player can pick from suggested ship names
- Ship name suggestions are displayed as clickable buttons or a dropdown
- Selecting a suggestion fills the ship name field
- Player can still manually edit the name after selection

Scenario: Player can manually enter custom ship name
- A text input field accepts a custom ship name (1-50 characters)
- If no suggestion is selected, player can type their own name
- Name is validated and stored in game state

Scenario: Ship name is displayed on HUD during gameplay
- Captain's ship name appears on the main HUD
- Name is visible during world map navigation
- Name appears in battle interface and port screens

Feature: World Generation & Map Manifest

The game uses a deterministic seed and biome system with an LLM-aware world manifest.

Scenario: Game loads with fixed deterministic seed
- Game uses a fixed, non-random seed (e.g., Collatz conjecture seed or similar)
- All players receive the same procedurally generated world
- Seed is encoded in the map manifest and shipped with the game
- Ensures consistent experience across all playthroughs

Scenario: Map manifest includes world metadata
- Manifest is a JSON object containing:
  - seed (fixed value)
  - biome_map (2D grid of biome types)
  - poi_list (islands, towns, anomalies with coords and types)
  - climate (overall world climate: tropical, temperate, arctic)
  - danger_level (baseline encounter difficulty: low, medium, high)
  - world_name (e.g., "The Shattered Isles")
  - distinctive_features (e.g., "volcanic archipelago", "frozen wastes")
- Manifest is human-readable and can be cached/inspected

Scenario: Biome generation assigns terrain types to regions
- World is divided into biome zones: tropical, temperate, volcanic, tundra, swamp
- Each biome has distinct visual style and encounter types
- Islands inherit biome characteristics (jungle island vs. ice island)
- Towns and anomalies fit their biome (tropical port vs. ice fortress)

Scenario: Biome affects encounter difficulty and theme
- Tropical biome: easier encounters, pirate-themed (merchant ships, corsairs)
- Volcanic biome: medium encounters, fire-themed (lava anomalies, fire ships)
- Tundra biome: harder encounters, ice-themed (ghost ships, frozen threats)
- Swamp biome: medium encounters, cursed-themed (undead, cursed crews)
- Encounters scale to biome danger level

Scenario: Sea map contains islands, towns, and anomalies
- Islands are scattered across the map according to fixed seed
- Towns are placed on some islands (stable, seed-dependent)
- Anomalies are non-island locations with LLM-generated encounters
- All three element types are visible on the rendered map
- POI distribution matches biome regions

Scenario: Towns and anomalies are stable per seed
- Given the same seed, the same islands, towns, and anomalies appear at the same coordinates
- The world is fully deterministic: seed defines all generation
- No randomness between playthroughs (same world every time)

Scenario: LLM is consulted to name points of interest
- After world generation, LLM reads the map manifest
- LLM is prompted: "Name these towns based on the biome/climate" with POI coords and biome info
- LLM suggests thematic names (e.g., "Scorched Port" in volcanic biome)
- Names are cached in the manifest for future loads

Scenario: World manifest is loaded on game start
- On app launch, the fixed map manifest is loaded from game data
- Manifest is parsed and world is generated from it
- All players receive identical POI locations and biome distribution
- Manifest is stored with player save file for game resumption

Scenario: World state is saved to localStorage for resumption
- After world generation, player state (position, inventory, stats) is saved
- Save includes reference to world manifest (no duplication)
- Closing and reopening the game reloads the exact same world
- Player can resume from last position with world fully restored

Feature: World Map Navigation

Player sails their ship across the sea map in real time.

Scenario: Captain's ship is rendered on sea map
- A ship silhouette (based on chosen class) appears at the starting position
- Ship position updates in real time as the player navigates
- Ship faces the direction it is sailing

Scenario: Camera follows ship from behind
- Camera position tracks the ship with a fixed offset behind it
- Camera height is fixed above the sea level for top-down perspective
- Camera rotation matches ship heading so player always looks "forward"
- Camera smoothly follows ship movement without lag
- Player always sees what's ahead of their ship

Scenario: Movement controls are displayed on the HUD
- A control panel shows keyboard controls for ship movement (WASD or Arrow Keys)
- HUD displays current position and direction
- Control hints persist during gameplay
- Movement speeds are shown for reference

Scenario: Ship uses realistic physics for movement and steering
- W key accelerates the ship forward
- S key decelerates/reverses the ship
- A key steers the ship left (rotates hull)
- D key steers the ship right (rotates hull)
- Ship momentum carries it forward even when W is released
- Ship rotates to face the direction it's moving
- Ship visual (hull mesh) rotates to match movement direction

Scenario: Player can sail in eight directions with keyboard input
- Arrow keys or WASD control movement (Up/Down/Left/Right + diagonals)
- Ship moves continuously while a direction key is held
- Releasing the key stops movement

Scenario: Ship speed on map varies by ship class
- Sloop moves fastest (2.0x base speed)
- Brigantine moves at base speed (1.0x)
- Galleon moves slowest (0.7x base speed)
- Speed affects time to reach distant locations

Scenario: When ship enters town proximity, transition prompt appears
- Entering a 2-tile radius of a town shows an on-screen prompt (e.g., "Approach [Town Name]?")
- Player can press 'E' to enter or 'Esc' to continue sailing
- Entering the town loads the port view (Feature 7)

Scenario: When ship enters anomaly proximity, encounter is triggered
- Entering a 2-tile radius of an anomaly location auto-triggers a battle scene
- The encounter difficulty is set by the LLM based on player level
- Battle loads (Feature 5)

Scenario: LLM narrates each anomaly encounter
- When an anomaly is triggered, the LLM generates a 1-2 sentence description of the encounter
- Example: "A ghostly ship emerges from the fog... your crew readies for battle!"
- Narrative is displayed as an overlay before the battle starts

Feature: Sea Battle (ATB Combat)

Real-time ATB (Active Time Battle) system. Player and enemy ships fight with cannons.

Scenario: Random encounter or anomaly triggers battle scene
- Anomalies and random roaming enemy ships trigger this scene
- Scene changes to a side-view battle layout (player ship on left, enemy on right)
- Battle HUD shows both ships' HP, ATB bars, and special charge

Scenario: Each combatant has ATB time bar that fills in real time
- ATB bar fills at a rate of 1 per second (configurable)
- ATB is capped at 100
- Both player and enemy bars fill simultaneously

Scenario: When player's ATB bar is full, player can choose action
- At 100 ATB, a menu appears: "Fire Cannons", "Broadside", "Special Skill"
- Player selects an action within 5 seconds or auto-defaults to Fire Cannons
- Selecting an action consumes 100 ATB and resets the bar to 0

Scenario: Special skills have separate charge bar
- Special Skill bar fills at 0.2 per second (50s to fully charge from zero)
- Charge bar fills even during enemy turns
- Special Skill is only available when its bar is 100
- Using the skill resets its bar to 0

Scenario: Fire Cannons deals standard damage
- Damage = (Ship STR stat) + 1d6 (die roll)
- Base STR at game start is 5
- Cannon upgrades increase damage output

Scenario: Broadside deals AoE damage with longer reset
- Broadside damages both player's own ship (10% splash damage) and enemy
- Enemy takes (Ship STR stat) * 1.5 + 1d6 damage
- After Broadside, ATB resets and takes 2 seconds to start refilling (downtime cost)
- Risky but high-reward action

Scenario: Defeating all enemies ends battle and awards XP
- When enemy HP reaches 0, battle ends
- Victory screen shows XP earned (based on enemy level)
- Defeated enemies drop gold (variable amount)
- Player returns to world map at last position

Scenario: If player's ship HP reaches 0, the run ends
- Roguelike death: run is over
- Game offers "Game Over" screen with run statistics
- Player can start a new run or exit

Scenario: Battle difficulty is influenced by player level and LLM
- Enemy level is set to (player level) + 0-2 (LLM adjusts difficulty)
- Enemy stats scale with level
- LLM can increase difficulty for story pacing

Scenario: LLM provides one-line narrative for battle outcome
- On victory: LLM generates a celebratory line (e.g., "Your cannons split the enemy's hull!")
- On defeat: LLM generates a dramatic death narrative
- Narrative appears as an overlay after the battle resolves

Feature: Experience & Leveling (DnD-style)

Player gains XP from battles and levels up with stat increases.

Scenario: Defeating enemies in battle awards XP
- Defeating an enemy ship awards 100 * (enemy level) XP
- XP is added to the captain's total XP
- XP counter is displayed on the HUD

Scenario: When XP reaches threshold, captain levels up
- Threshold for level N is (N * 100) XP
- Example: Level 2 requires 200 total XP, Level 3 requires 300, etc.
- Leveling automatically occurs when threshold is reached
- Level-up message appears on screen

Scenario: Each level-up increases stats (HP, STR, DEX, CON)
- HP: +5 per level (base 30)
- STR: +1 per level (base 5)
- DEX: +1 per level (base 5)
- CON: +1 per level (base 5)
- All ships receive the same stat increases regardless of class

Scenario: Stat increases vary by ship class
- Sloop: +3 DEX (instead of +1), keeps +1 STR
- Brigantine: standard increases
- Galleon: +3 STR (instead of +1), keeps +1 DEX
- Ship class provides specialization

Scenario: Level and stats are displayed on HUD
- Current level displayed prominently
- HP, STR, DEX, CON shown as numbers or bars
- XP progress toward next level shown (e.g., "250/300 XP")

Feature: Towns & Ports

Player can dock at towns to rest, trade, and upgrade.

Scenario: Entering town loads side-scrolling port view
- Town screen is a 2D side-scroller with a dockside layout
- Player character is a small sprite that can walk left/right
- Various building sprites/shapes are positioned along the dock
- Press 'E' to interact with each location

Scenario: Town has Market, Shipyard, and Tavern
- Market: buy/sell trade goods (Feature 7)
- Shipyard: upgrade ship and hire crew (Feature 9)
- Tavern: rest to restore HP, hear NPC dialogue, view quests (Feature 8)
- Each is represented as a distinct building on the dock

Scenario: In Market, player can buy and sell trade goods
- Market inventory shows 5-8 tradeable goods (spices, rum, silks, etc.)
- Each good has a base price
- Player can buy goods to carry or sell goods they own
- Carrying capacity depends on ship class (Galleon carries most)

Scenario: Trade prices vary between towns
- Each town applies a ±30% price modifier per good (seed-dependent)
- Example: Rum costs 100g in Port A, 130g in Port B
- Player can buy low and sell high for profit
- Prices are recalculated per run but stable across visits to the same town

Scenario: In Tavern, player can rest to restore HP
- A "Rest" action costs 50 gold
- Resting restores 100% of current max HP
- Resting takes 1 in-game day (or just instant in early builds)

Scenario: Tavern displays LLM-generated NPC dialogue and quests
- LLM is called to generate 2-3 NPC dialogue snippets
- Dialogue provides world flavor and hints at quests
- Quest log shows available quests for this town
- Quests are linked to the overarching storyline

Scenario: In Shipyard, player can upgrade cannons, hull, or sails
- Cannon upgrades: +1 damage per level, cost 200g per level
- Hull upgrades: +10 max HP per level, cost 150g per level
- Sail upgrades: +0.1 speed multiplier, cost 150g per level
- Upgrades are cumulative and persistent across the run

Scenario: In Shipyard, player can hire crew members
- 3 crew roles available: Navigator, Gunner, Medic
- Each role costs 100g to hire
- Max crew capacity: Sloop 1, Brigantine 2, Galleon 3 (Feature 9)
- Crew apply stat bonuses in battle

Feature: Quests (LLM Game Master)

Procedurally generated quests driven by LLM narrative.

Scenario: At game start, LLM generates 3 initial quests
- LLM is called with the world name/layout and overarching storyline
- LLM generates 3 quest hooks tied to that storyline
- Each quest has a title, objective, reward (XP + gold), and destination
- Quests are stored in game state

Scenario: Completing quest awards XP, gold, and triggers narrative
- Reaching a quest destination and interacting with an NPC marks the quest "complete"
- Completion awards 200 XP + 150 gold
- LLM is called to generate a one-paragraph narrative continuation
- Narrative appears as a story beat

Scenario: New quests can be generated dynamically by LLM
- Talking to a tavern NPC can trigger LLM to generate a new local quest
- Example: "I've heard rumors of a treasure wreck nearby..."
- Player can accept or decline the new quest
- Up to 5 active quests at a time

Scenario: Quest objectives appear in HUD log
- A quest log panel lists all active quests
- Each quest shows title, objective, destination, and reward
- Selecting a quest highlights its destination on the map
- Completed quests are archived

Scenario: LLM narrates major story milestones
- Arriving at a quest destination shows an LLM-generated intro narrative
- Completing an objective triggers an LLM narrative beat
- Final quest completion triggers an ending narrative
- All narrative is thematic to the overarching storyline

Feature: Ship Upgrades & Crew

Ship customization and crew management.

Scenario: Cannon upgrades increase battle damage output
- Base cannon damage is 1d6 + STR
- Each cannon upgrade level adds +1 to base damage
- Upgrades cost 200g per level
- Up to 5 levels purchasable

Scenario: Hull upgrades increase max HP
- Base max HP is 30
- Each hull upgrade adds +10 max HP
- Upgrades cost 150g per level
- Up to 5 levels purchasable

Scenario: Sail upgrades increase world map speed
- Base speed multiplier is 1.0
- Each sail upgrade adds +0.1 to the multiplier
- Upgrades cost 150g per level
- Up to 5 levels purchasable

Scenario: Crew members can be assigned roles
- Navigator role: +10% world map speed (bonus to class speed)
- Gunner role: +1 damage per hit in battles
- Medic role: heal captain for 20 HP after each battle
- Each crew role stacks independently

Scenario: Max crew capacity depends on ship class
- Sloop: max 1 crew member
- Brigantine: max 2 crew members
- Galleon: max 3 crew members
- Exceeding capacity prevents hiring additional crew

Feature: Text-to-Speech Narration (Low Priority)

Accessibility feature: read LLM narrative aloud.

Scenario: LLM narrative text can be read aloud
- A "Speak" button or toggle is available next to narrative text
- Clicking "Speak" reads the text using the browser's Web Speech API
- Playback can be paused, resumed, or stopped

Scenario: Player can toggle TTS on/off in settings
- A settings menu has a checkbox: "Enable Text-to-Speech"
- When enabled, all narrative automatically plays when generated
- When disabled, narrative appears as text only
- Setting is persisted in localStorage

Scenario: Each spoken line uses configurable voice and rate
- Settings menu provides dropdowns for voice selection (browser-provided voices)
- A slider controls speech rate (0.5x to 2.0x)
- Preferences are saved in localStorage

Feature: Game Save/Load System

Players can save their progress and resume later.

Scenario: Game state is saved to localStorage automatically
- After character creation and at regular intervals during play
- Save includes: captain name, ship class, position, heading, velocity
- Also saves: level, XP, gold, inventory, quests, stats
- Save data is JSON format with timestamp
- Multiple saves can be stored (or overwrite latest)

Scenario: Player can load a saved game
- Main menu shows "Continue" button if save file exists
- Clicking "Continue" loads ship state, position, and all progress
- Game resumes at exact position with all stats intact
- Player can choose "New Game" to start fresh instead

Scenario: Save file includes captain name and ship details
- Saved data shows captain name for player reference
- Ship class is restored (Sloop, Brigantine, or Galleon)
- Visual representation matches original ship class

Feature: Main Menu Redesign

Improved menu flow with game progression options.

Scenario: Main menu shows game flow options
- "New Game" button - Start fresh game
- "Continue" button - Load saved game (hidden if no save)
- "Settings" button - Open settings panel
- "Quit" button - Exit game

Scenario: New Game prompts LLM setup if needed
- Clicking "New Game" checks for cached LLM config
- If no config, goes to LLM setup form
- If config exists, proceeds directly to character selection
- No redundant setup forms

Scenario: Continue button only appears if save exists
- Check localStorage for game save file on menu load
- Show "Continue" button only if valid save found
- Clicking loads that save and resumes gameplay
- Save file shows creation timestamp or captain name

Feature: Ship Modularity System

Easy framework for adding new ship types.

Scenario: Ships are defined in a configurable system
- Ship definitions stored in single config object/file
- Each ship has: name, stats, mesh generator, physics config
- Stats include: speed, trade, combat modifiers
- Physics config: maxSpeed, acceleration, turnRate, friction
- New ships can be added by extending config, no code changes needed

Scenario: Each ship class has distinct visual and gameplay feel
- Ship mesh creation is modular (easy to add new visual styles)
- Physics values can be tuned per ship for unique handling
- Stat modifiers create distinct gameplay niches
- Adding ship = 1 config entry, no scattered hardcoded values

Feature: Narrative Display UI

All LLM-generated narrative text is displayed visually to the player.

Scenario: Narrative text displays in a styled panel
- When LLM generates narrative, text appears in a panel overlay
- Panel has dark background with gold/parchment text styling
- Panel is positioned at bottom or center of screen
- Text is readable and matches game UI theme

Scenario: Player can dismiss narrative text
- A "Close" button or click-outside dismisses the narrative panel
- Pressing ESC closes the panel
- Closing does not interrupt gameplay
- Player can re-read narrative later in journal log

Scenario: Narrative appears with smooth animations
- Panel slides in from bottom/side when triggered
- Text fades in or typewriter-scrolls for readability
- Panel slides out when dismissed
- Animation speed is configurable (affects pacing)

Scenario: Narrative includes speaker/context label
- Narrative panel shows who is speaking (e.g., "Game Master", "Town Crier", "NPC Name")
- Context label appears above or integrated with text
- Helps player understand the source of narrative

Feature: Points of Interest Interaction

Players can interact with islands, towns, and anomalies on the map. Full visual and mechanical integration with narrative.

Scenario: Player can hover over POI names to see info
- Hovering mouse over a town/island/anomaly shows a tooltip
- Tooltip displays location name and type (Town, Island, Anomaly)
- Tooltip also shows distance and any relevant stats
- Tooltip fades when mouse leaves POI

Scenario: Player can interact with points of interest
- Pressing 'E' when near a POI (within 2-tile radius) triggers interaction
- Different POI types (town, island, anomaly) have different effects
- Interaction prompts appear on screen near POI (e.g., "[E] Enter Town", "[E] Explore Island")
- Game responds appropriately (enter port, show description, trigger battle, etc.)
- Pressing 'E' away from POI does nothing

Scenario: Island visitation shows location description
- Visiting an island shows an LLM-generated description in narrative panel
- Description provides context about the location (history, resources, danger level)
- Player sees 2-3 sentence description with atmospheric details
- Player can choose to "Loot", "Stay", or "Continue Sailing" via buttons
- Visiting is tracked in game state

Scenario: Town names are generated once and cached
- On first world generation, LLM generates unique names for all towns
- Town names are stored in world state (name, coords, type)
- Names persist across save/load cycles
- LLM is NOT called again for same town in same run
- Town names are deterministic per seed (same world = same names)

Scenario: POI names display on world map
- Each POI's name is visible on the map (small text near marker)
- Town names appear in gold/yellow color
- Island names appear in green/brown color
- Anomaly names appear in purple/red color
- Names scale with zoom level (visible when zoomed in)

Scenario: Player can see interaction radius around POI
- A subtle circle or glow effect shows interaction range (2-tile radius)
- Visual effect only appears when player is within 4-tile distance
- Helps player know when 'E' is available
- Effect is semi-transparent to not clutter screen

Scenario: Anomaly encounters include narrative lead-in
- Approaching anomaly shows narrative prompt before battle
- LLM generates 1-2 sentence description of the threat
- Example: "A ghostly ship emerges from the fog..."
- Narrative appears for 3 seconds or until player presses 'E' to engage

Feature: Location Data Persistence

All generated location data (names, descriptions, NPC details) is saved and restored with game state.

Scenario: World generation includes location metadata
- For each POI, store: name, coordinates, type, description, NPC details
- Metadata is generated on first world creation
- All metadata is serialized with world save
- Loading a world restores all location data exactly

Scenario: Save file includes POI metadata
- Game save includes entire POI list with names and coords
- Save file format includes location history (visited, looted, etc.)
- File size increase is minimal (metadata is lightweight)
- Save can be inspected/debugged to verify POI data

Scenario: NPC dialogue is generated once per location
- Tavern NPCs have procedurally generated backstories
- NPC names and dialogue are cached with location
- Same NPC appears with same dialogue on revisit
- Multiple NPCs per tavern have different personalities

Feature: NPC System

NPCs populate towns and taverns, generated by LLM and persisted with world state.

Scenario: NPCs are generated during town creation
- When world generates, LLM creates 3-5 NPCs per town
- Each NPC has: name, role, personality, background, quest hook
- NPC data is stored with town data in manifest
- NPCs appear in tavern with consistent details

Scenario: NPC names are thematic to world setting
- LLM generates pirate-themed NPC names
- Examples: "Captain Blackhook", "Rosie the Rigger", "Old Man Teach"
- Names reflect NPC's role (sailor, merchant, innkeeper, quest-giver)
- Names are cached (same NPC on revisit)

Scenario: NPCs have distinct personalities and dialogue
- Each NPC has a personality tag: gruff, cheerful, mysterious, cautious
- NPC dialogue reflects personality (tone, word choice, topics)
- LLM generates 2-3 unique dialogue lines per NPC per topic
- Personality affects which quests they offer

Scenario: NPCs remember player reputation
- Track player actions: quests completed, enemies defeated, gold spent
- NPC dialogue changes based on reputation
- Example: "Word travels fast - I heard you bested the Kraken!"
- Reputation unlocks new dialogue and exclusive quests

Scenario: Quest-giving NPCs are flagged as patrons
- Some NPCs are marked as quest-givers (patrons)
- They appear prominently in tavern UI
- Hovering over patron NPCs shows "Has Quest" indicator
- Patrons generate quests tied to the overarching storyline

Scenario: NPCs have background stories generated by LLM
- Each NPC has a 1-2 paragraph backstory (LLM-generated)
- Backstory influences what quests they offer
- Example: Merchant lost cargo might offer delivery quest
- Backstory is shown when player selects "Learn More" on NPC

Feature: LLM-Driven Quest Generation

Quests are dynamically generated by LLM, tied to NPCs and storyline.

Scenario: LLM generates quests from NPC hooks
- When player talks to quest-giver NPC, LLM generates a quest
- LLM receives: NPC backstory, world manifest, player level, storyline context
- LLM outputs: quest title, objective, reward, success narrative, failure narrative
- Quest is cached and shown to player

Scenario: Quests are narrative-driven with context
- Quest title is thematic and story-relevant
- Objective describes the actual goal (not just "defeat X enemies")
- Example: "Rescue Merchant's Daughter from Pirates" instead of "Defeat 5 enemies"
- Quest destination is a real POI on the map

Scenario: Quest completion triggers LLM narrative continuation
- When player completes quest objective, LLM generates follow-up narrative
- Narrative describes consequence of player action
- Example: "The merchant thanks you profusely, offering rare upgrades"
- Narrative appears in narrative panel before returning to world

Scenario: Failed quests have alternative outcomes
- If player dies before completing quest, LLM generates failure narrative
- Failure narrative reflects what happened
- Example: "The merchant never heard from you again... RIP"
- Failed quests can sometimes be reoffered or replaced

Scenario: Quest rewards are scaled to player level
- LLM-aware of player level when generating quests
- Rewards (XP, gold) scale appropriately
- High-level quests offer more XP/gold
- Difficulty scaling is reflected in quest description

Scenario: Active quest log shows quest-giver NPC
- Quest log lists: quest title, objective, quest-giver NPC name, reward
- Clicking on quest-giver name highlights their location in town
- Player can return to NPC to get more info or abandon quest
- Quest log shows progress toward objective

Feature: World Manifest & POI Metadata

Structured world data that includes all POI details, biomes, and NPC info.

Scenario: World manifest defines all POI locations
- Manifest includes POI array with: id, name, type, coords, biome, difficulty
- Each town has associated NPCs in manifest
- Each island has description seed for LLM generation
- Anomalies have encounter type and difficulty

Scenario: Biome affects NPC types and quests
- Tropical biome: merchant NPCs, pirate quests, trade-focused
- Volcanic biome: explorer NPCs, danger quests, treasure-hunting
- Tundra biome: survivor NPCs, exploration quests, harsh-themed
- NPC generation is biome-aware

Scenario: World manifest persists across saves
- Save file includes full world manifest
- Loading game restores exact same world state
- POI locations, NPC data, quest data all restored
- No re-generation or LLM calls on load (uses cached data)

Scenario: Manifest includes POI discovery tracking
- Manifest tracks which POIs player has discovered
- Manifest tracks which NPCs player has met
- Manifest tracks completed quests per player
- History enables narrative callbacks (NPC mentions past quests)

Feature: Dynamic POI Interaction UI

Visual and mechanical systems for interacting with POIs on the world map.

Scenario: E key triggers interaction when near POI
- Game constantly checks player distance to nearby POIs
- When distance < 2 tiles, display prompt: "[E] Interact with [POI Name]"
- Pressing E calls POI interaction handler
- Different POI types trigger different interactions

Scenario: Hovering over POI shows tooltip info
- Mouse hover over POI displays tooltip
- Tooltip shows: POI name, type (Town/Island/Anomaly), distance
- For towns: shows number of NPCs available
- For islands: shows biome type and danger level
- Tooltip fades after 2 seconds or on mouse move

Scenario: POI names render on world map with zoom scaling
- POI names appear as text labels near their markers
- Text size scales with camera zoom level
- Town names appear in gold color
- Island names appear in green color
- Anomaly names appear in red/purple color
- Names are visible when zoomed in (< 8 units), fade when far

Scenario: Interaction radius is visually indicated
- Subtle glow or ring effect shows 2-tile interaction radius around POI
- Effect only visible when player is 4 tiles away or closer
- Effect fades as player moves away
- Helps player understand when E is available

Scenario: POI interaction handler routes to correct UI
- Town interaction: transition to TownPortal component
- Island interaction: show island description narrative panel
- Anomaly interaction: auto-trigger battle encounter
- Each returns player to world map on completion

Feature: Narrative Display Panel

Unified UI for displaying all LLM-generated narrative to the player.

Scenario: Narrative panel appears when LLM generates text
- Any LLM-generated narrative triggers panel
- Panel slides in from bottom of screen
- Panel includes: speaker label, narrative text, close button
- Panel is semi-transparent with styled background (pirate theme)

Scenario: Narrative text is readable with proper formatting
- Text uses gold/parchment colors matching game theme
- Font size is readable (14-16px)
- Line height is comfortable (1.5-1.8)
- Long text wraps properly in panel
- Maximum visible height is ~40% of screen

Scenario: Speaker label shows narrative source
- Label shows who is narrating: "Game Master", "NPC: [Name]", "Tavern Keeper", etc.
- Label appears above or integrated with text
- Label helps player understand context of narrative
- Multiple NPCs can speak with different labels

Scenario: Player can dismiss narrative panel
- Close button (X or similar) in top-right of panel
- Clicking outside panel also dismisses it
- Pressing ESC dismisses panel (if not conflicting with other keys)
- Dismissing doesn't lose narrative (can view in journal)

Scenario: Narrative panel supports multiple display modes
- **Instant**: text appears all at once
- **Typewriter**: text reveals character by character (1-2s per paragraph)
- **Fade**: text fades in smoothly over 1-2 seconds
- Player can configure speed in settings

Scenario: Narrative is recorded in story journal
- Every narrative generated is logged to story journal
- Journal shows: timestamp, speaker, full narrative text
- Player can open journal from HUD to review past narratives
- Journal is saved with game state
- Journal helps new players catch up on story context

Feature: LLM Integration Hub

Central system for calling LLM and caching responses.

Scenario: LLM is called with full game context
- LLM calls include: world manifest, player stats, completed quests, current storyline
- Context helps LLM generate coherent, world-aware narrative
- Context prevents LLM from suggesting impossible things
- Context enables narrative callbacks to past events

Scenario: LLM responses are cached to prevent redundant calls
- NPC dialogue is generated once per location
- Quest descriptions are cached after generation
- Island descriptions are cached after first visit
- Cache is stored with world manifest

Scenario: LLM calls are queued to prevent spam
- Multiple simultaneous requests are queued
- Queue processes one request at a time
- Prevents rate limiting and API errors
- Players see loading indicator while waiting

Scenario: LLM failures gracefully degrade
- If LLM call fails, show generic fallback text
- Fallback text is thematic but not personalized
- Example fallback: "The tavern is busy tonight. Come back later."
- Error doesn't crash game, allows continued play

Feature: NPC Dialogue Trees

Conversation system with NPCs in taverns.

Scenario: Clicking NPC opens dialogue menu
- Clicking on NPC in tavern opens dialogue UI
- Menu shows NPC name and portrait/description
- Shows dialogue options: "Greet", "Learn More", "Ask About Quests", "Leave"
- Options are presented as clickable buttons

Scenario: "Greet" option shows NPC's greeting dialogue
- LLM-generated greeting reflects NPC personality
- Greeting is unique each time (LLM generates new lines)
- Example: "Ahoy, matey! Looking for work?" (gruff personality)
- Greeting can lead to other dialogue options

Scenario: "Learn More" shows NPC backstory
- Displays NPC's generated backstory (1-2 paragraphs)
- Backstory explains NPC's role and motivation
- Backstory context helps player understand quests
- Player can return to menu after reading

Scenario: "Ask About Quests" shows available quests
- Shows list of quests this NPC can offer
- Each quest shows title and reward
- Clicking quest shows full description (objective, destination, reward)
- Player can accept or decline quest
- Accepting adds quest to active log

Scenario: Dialogue is personalized based on player history
- If player completed NPC's previous quest, greeting changes
- NPC acknowledges past interactions
- Example: "Welcome back, hero! I have another job for you..."
- Dialogue reflects player reputation with that NPC

Feature: Battle Encounter Narrative

LLM narrates battle encounters with atmospheric descriptions.

Scenario: Approaching anomaly shows encounter narrative
- 3-5 seconds before auto-triggering battle, show narrative panel
- LLM generates 1-2 sentence description of threat
- Example: "A ghostly ship emerges from the fog, tattered sails snapping in the wind!"
- Narrative sets mood and tension

Scenario: Battle outcome includes victory/defeat narrative
- After battle ends, display outcome narrative
- Victory: LLM describes how player defeated enemy
- Defeat: LLM describes how player was defeated
- Narrative appears in narrative panel
- Reward screen shows after narrative dismissal

Scenario: Enemy encounters are themed to biome and storyline
- LLM knows biome type when generating encounter
- Encounter type matches biome (tropical=pirates, volcanic=fire creatures)
- Encounter difficulty matches player level
- Encounter description ties into overarching storyline

Feature: Storyline Progression Tracking

System for tracking narrative arc and major plot milestones.

Scenario: Story arc has progression states
- Beginning: intro quests, learning the world
- Middle: major questline, increased stakes
- Late: climactic encounters, story choices matter
- Ending: final confrontation or resolution
- Current state determines available quests

Scenario: Major quests trigger story progression
- Completing major quests advances story arc
- Arc progression unlocks new areas/quests
- Narrative calls back to previous major quests
- Final arc state triggers endgame content

Scenario: Player choices affect story branches
- Some major quests have 2-3 choice options
- Example: "Save the merchant or steal their treasure?"
- Choice is recorded in game state
- NPC dialogue later references player choice
- Different choice paths lead to different endings

Scenario: Story milestones generate commemorative narratives
- Reaching new story arc stage generates narrative
- Example: "Your reputation spreads across the seas..."
- Milestone narrative summarizes progress so far
- Narrative appears prominently in narrative panel and journal

Feature: Enhanced Camera Controls

Improved camera system with zoom and pan controls.

Scenario: Player can scroll to zoom camera in and out
- Mouse scroll wheel changes camera distance from ship
- Zooming in moves camera closer to ship
- Zooming out moves camera further away
- Minimum zoom distance: 2 units behind ship
- Maximum zoom distance: 15 units behind ship

Scenario: Player can right-click to pan camera
- Right-click and drag rotates camera around ship
- Camera maintains height while panning
- Pan movement is smooth and follows mouse position
- Release right-click to stop panning

Scenario: Camera slowly returns to follow mode after manual adjustment
- After zooming or panning, camera gradually returns to default follow position
- Return happens over 3 seconds
- Player can interrupt by moving ship or panning again
- Camera tracks ship position during return animation

Feature: WebRTC Multiplayer (Star Topology)

Players can connect to up to 3 other players using WebRTC with a free NAT/ICE solution.

Scenario: User can join multiplayer session
- A "Join Multiplayer" button appears on the main menu
- User can enter a session code to connect
- Connection uses free WebRTC NAT/ICE (STUN/TURN via public service like Google's)
- Session code is 6-8 alphanumeric characters
- User is assigned a unique player ID (1-4)
- Connection status is displayed while connecting

Scenario: Server/host initiates multiplayer game
- One player acts as host and generates a session code
- Host clicks "Start Multiplayer Game"
- Other players join using the session code
- Max 4 players total (host + 3 guests)
- Game starts when host confirms all players are ready

Scenario: Peer connection uses WebRTC with STUN/TURN
- Uses free public STUN server (e.g., Google's stun:stun.l.google.com:19302)
- Falls back to TURN relay if direct connection fails
- Connection is peer-to-peer when possible
- Data channel used for real-time ship position/state updates
- Connection quality/latency is monitored

Scenario: Player sees other players' ships on world map
- Other players' ships render as distinct silhouettes on the same world map
- Ship color/emblem indicates which player (1=blue, 2=red, 3=green, 4=yellow)
- Ship positions update in real-time (60 updates/second max)
- Player name/captain appears above each ship
- Ships are culled when far away to reduce bandwidth

Scenario: Player can see player list and connection status
- A player panel shows all connected players
- Each player shows: name, ship class, level, connection status
- Connection status: "Connected" (green), "Connecting" (yellow), "Disconnected" (red)
- Ping latency shown for each peer
- Host is clearly marked in the list

Scenario: Disconnect and reconnect logic
- If a player disconnects, their ship fades/disappears
- Player has 30 seconds to reconnect before being removed from game
- Reconnecting player's ship reappears with last known position
- Other players receive disconnect/reconnect notifications
- If host disconnects, control passes to next player

Scenario: Ship positions sync across peers
- Ship position updates broadcast every 100ms
- Updates include: position (x, z), heading (angle), velocity
- Latency compensation: predict ship position based on heading/velocity
- Smooth interpolation between position updates
- Jitter buffer handles out-of-order packets

Scenario: World state remains consistent across peers
- Island locations, towns, anomalies are the same for all players
- World seed is synchronized at connection time
- All players see the same procedurally generated world
- World doesn't change while players are connected

Scenario: Battle encounters with multiplayer
- When any player triggers an encounter, a vote system activates
- Other players see "Battle Incoming" notification with 5-second timer
- Players vote yes/no to engage (majority decides)
- If engaged, all players teleport to battle scene together
- Turn order includes all players (turn-based multi-player ATB)

Scenario: Crew and ship upgrades are per-player
- Each player has their own: level, XP, gold, inventory, upgrades
- Trading between players: Player A can drop item, Player B picks it up
- Gold can be split between players (crew hire, ship upgrades are individual)
- Kills/victories are credited to individual players

Scenario: Chat/emote system for players
- Quick emote wheel (8 emotes): waves, laughs, danger signal, treasure found
- Emotes display above ship and in player list
- In-game text chat (max 100 players, global)
- Chat messages persist in memory (not saved)
- Ping-based latency awareness: high-latency players get marker

Scenario: Session persistence and save/load
- Multiplayer progress saves to localStorage with session code
- Can resume interrupted session within 24 hours
- Progress includes: player positions, treasure found, quests completed
- Save includes all players' data or single player data (can branch)

Feature: LLM Game Master Narrative

Continuous D&D-style storytelling where the LLM Game Master narrates the world, responds to player choices, and drives narrative progression.

Scenario: LLM maintains narrative context across session
- Game state includes: overarching storyline, story arc progress, major events encountered
- Narrative context is saved with game state
- On load, LLM continues story with full awareness of prior events
- Context includes: completed quests, discovered locations, defeated enemies, NPC interactions

Scenario: Story beat appears at major progression milestones
- When player levels up: LLM generates a 1-2 paragraph narrative beat
- When player reaches new area: LLM describes the place and hints at dangers
- When player completes major quest: LLM narrates consequence (world changes)
- Narrative reflects current story arc and player progress

Scenario: LLM generates random world events during exploration
- While sailing, LLM can generate 20-30% chance of random encounter
- Examples: "A merchant vessel signals for aid", "Strange lights on the horizon"
- Player can choose to investigate or ignore (affects story)
- Events are thematic to current story arc and player level

Scenario: Player choices create branching narrative consequences
- Major encounters offer 2-3 choice options (e.g., "Attack or Negotiate?")
- Player's choice is recorded in game state
- LLM generates follow-up narrative based on choice
- Consequences persist: NPCs remember how player treated them

Scenario: NPC reactions change based on player history
- NPCs in taverns reference prior player actions
- Example: "I heard you defeated the Kraken! Buy you a drink?"
- NPC dialogue is generated with awareness of player's quest log
- Relationship values track NPC disposition toward player

Scenario: LLM adjusts narrative tension based on player power level
- Early game: story emphasizes learning and exploration
- Mid game: narrative introduces higher stakes and moral choices
- Late game: LLM builds toward climactic story arc conclusion
- Difficulty scaling recommendations communicated through narrative

Scenario: Major story conclusion generates epilogue
- Reaching max level or completing final quest triggers ending
- LLM generates 3-5 paragraph narrative epilogue
- Epilogue reflects player choices throughout the run
- Examples of endings vary based on: alignment choices, defeated enemies, quests completed

Scenario: Narrative journal logs major story beats
- A story log/journal in game state records all major narrative moments
- Player can review past story beats in a log UI
- Log helps players understand the narrative arc
- Useful for continued playthroughs (remembering story context)
