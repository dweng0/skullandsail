# BDD Status

Checked 68 scenario(s) across 14 test file(s).


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

## Feature: Character & Ship Selection

- [x] User can enter captain name
- [x] User can choose ship class
- [x] Each ship class has different starting stats
- [x] User cannot start game without name and ship selected
- [x] LLM suggests ship names based on ship class
- [x] Player can pick from suggested ship names
- [x] Player can manually enter custom ship name
- [x] Ship name is displayed on HUD during gameplay

## Feature: World Generation

- [x] Each new game generates unique sea map from random seed
- [x] Sea map contains islands, towns, and anomalies
- [x] Towns and anomalies are stable per seed
- [x] LLM is consulted to place named points of interest
- [x] World state is saved to localStorage for resumption

## Feature: World Map Navigation

- [x] Captain's ship is rendered on sea map
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

---
**68/68 scenarios covered.**
