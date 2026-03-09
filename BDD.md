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

Feature: World Generation

Each new game creates a unique procedurally generated world from a random seed.

Scenario: Each new game generates unique sea map from random seed
- Game randomly generates a 32x32 (or configurable) grid of sea tiles
- Each tile is either water, island, or empty ocean
- A 64-bit random seed determines all world generation

Scenario: Sea map contains islands, towns, and anomalies
- Islands are scattered across the map based on seed
- Towns are placed on some islands (stable, seed-dependent)
- Anomalies are non-island locations with LLM-generated encounters
- All three element types are visible on the rendered map

Scenario: Towns and anomalies are stable per seed
- Given the same seed, the same islands, towns, and anomalies appear at the same coordinates
- The world is deterministic: seed fully defines it

Scenario: LLM is consulted to place named points of interest
- After base world generation, the LLM is called with the map layout
- The LLM suggests 3-5 named locations (e.g., "Tortuga Bay", "Dead Man's Cove")
- These names are placed at key island/town positions
- Names are stored with the world state

Scenario: World state is saved to localStorage for resumption
- After world generation, all world data (islands, towns, anomalies, names, seed) is serialized
- Data is stored in browser localStorage with a session key
- Closing and reopening the game reloads the exact same world
- Player can resume from last position

Feature: World Map Navigation

Player sails their ship across the sea map in real time.

Scenario: Captain's ship is rendered on sea map
- A ship silhouette (based on chosen class) appears at the starting position
- Ship position updates in real time as the player navigates
- Ship faces the direction it is sailing

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
