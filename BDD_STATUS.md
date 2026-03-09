# BDD Status

Checked 64 scenario(s) across 2 test file(s).


## Feature: Procedural Asset Pipeline

- [x] Game initialises without missing asset errors
- [x] Ship classes render as distinct silhouettes
- [x] Ocean renders with animated water material
- [ ] UNCOVERED: Island tiles render as raised terrain
- [ ] UNCOVERED: Town markers render as gold beacons
- [ ] UNCOVERED: Anomaly markers render as purple/red swirls
- [ ] UNCOVERED: Battle scene renders distinct ship silhouettes
- [ ] UNCOVERED: Game uses consistent pirate-themed UI palette

## Feature: LLM Setup

- [ ] UNCOVERED: User can enter OpenAI-compatible API endpoint and key
- [ ] UNCOVERED: User can enter Claude API key and test connection
- [ ] UNCOVERED: User can enter Gemini API key and test connection
- [ ] UNCOVERED: If connection test fails, user sees error and can retry
- [ ] UNCOVERED: Once connected, LLM generates overarching storyline

## Feature: Character & Ship Selection

- [ ] UNCOVERED: User can enter captain name
- [ ] UNCOVERED: User can choose ship class
- [ ] UNCOVERED: Each ship class has different starting stats
- [ ] UNCOVERED: User cannot start game without name and ship selected

## Feature: World Generation

- [ ] UNCOVERED: Each new game generates unique sea map from random seed
- [ ] UNCOVERED: Sea map contains islands, towns, and anomalies
- [ ] UNCOVERED: Towns and anomalies are stable per seed
- [ ] UNCOVERED: LLM is consulted to place named points of interest
- [ ] UNCOVERED: World state is saved to localStorage for resumption

## Feature: World Map Navigation

- [ ] UNCOVERED: Captain's ship is rendered on sea map
- [ ] UNCOVERED: Player can sail in eight directions with keyboard input
- [ ] UNCOVERED: Ship speed on map varies by ship class
- [ ] UNCOVERED: When ship enters town proximity, transition prompt appears
- [ ] UNCOVERED: When ship enters anomaly proximity, encounter is triggered
- [ ] UNCOVERED: LLM narrates each anomaly encounter

## Feature: Sea Battle (ATB Combat)

- [ ] UNCOVERED: Random encounter or anomaly triggers battle scene
- [ ] UNCOVERED: Each combatant has ATB time bar that fills in real time
- [ ] UNCOVERED: When player's ATB bar is full, player can choose action
- [ ] UNCOVERED: Special skills have separate charge bar
- [ ] UNCOVERED: Fire Cannons deals standard damage
- [ ] UNCOVERED: Broadside deals AoE damage with longer reset
- [ ] UNCOVERED: Defeating all enemies ends battle and awards XP
- [ ] UNCOVERED: If player's ship HP reaches 0, the run ends
- [ ] UNCOVERED: Battle difficulty is influenced by player level and LLM
- [ ] UNCOVERED: LLM provides one-line narrative for battle outcome

## Feature: Experience & Leveling (DnD-style)

- [ ] UNCOVERED: Defeating enemies in battle awards XP
- [ ] UNCOVERED: When XP reaches threshold, captain levels up
- [ ] UNCOVERED: Each level-up increases stats (HP, STR, DEX, CON)
- [ ] UNCOVERED: Stat increases vary by ship class
- [ ] UNCOVERED: Level and stats are displayed on HUD

## Feature: Towns & Ports

- [ ] UNCOVERED: Entering town loads side-scrolling port view
- [ ] UNCOVERED: Town has Market, Shipyard, and Tavern
- [ ] UNCOVERED: In Market, player can buy and sell trade goods
- [ ] UNCOVERED: Trade prices vary between towns
- [ ] UNCOVERED: In Tavern, player can rest to restore HP
- [ ] UNCOVERED: Tavern displays LLM-generated NPC dialogue and quests
- [ ] UNCOVERED: In Shipyard, player can upgrade cannons, hull, or sails
- [ ] UNCOVERED: In Shipyard, player can hire crew members

## Feature: Quests (LLM Game Master)

- [ ] UNCOVERED: At game start, LLM generates 3 initial quests
- [ ] UNCOVERED: Completing quest awards XP, gold, and triggers narrative
- [ ] UNCOVERED: New quests can be generated dynamically by LLM
- [ ] UNCOVERED: Quest objectives appear in HUD log
- [ ] UNCOVERED: LLM narrates major story milestones

## Feature: Ship Upgrades & Crew

- [ ] UNCOVERED: Cannon upgrades increase battle damage output
- [ ] UNCOVERED: Hull upgrades increase max HP
- [ ] UNCOVERED: Sail upgrades increase world map speed
- [ ] UNCOVERED: Crew members can be assigned roles
- [ ] UNCOVERED: Max crew capacity depends on ship class

## Feature: Text-to-Speech Narration (Low Priority)

- [ ] UNCOVERED: LLM narrative text can be read aloud
- [ ] UNCOVERED: Player can toggle TTS on/off in settings
- [ ] UNCOVERED: Each spoken line uses configurable voice and rate

---
**3/64 scenarios covered.**

61 scenario(s) need tests:
- Island tiles render as raised terrain
- Town markers render as gold beacons
- Anomaly markers render as purple/red swirls
- Battle scene renders distinct ship silhouettes
- Game uses consistent pirate-themed UI palette
- User can enter OpenAI-compatible API endpoint and key
- User can enter Claude API key and test connection
- User can enter Gemini API key and test connection
- If connection test fails, user sees error and can retry
- Once connected, LLM generates overarching storyline
- User can enter captain name
- User can choose ship class
- Each ship class has different starting stats
- User cannot start game without name and ship selected
- Each new game generates unique sea map from random seed
- Sea map contains islands, towns, and anomalies
- Towns and anomalies are stable per seed
- LLM is consulted to place named points of interest
- World state is saved to localStorage for resumption
- Captain's ship is rendered on sea map
- Player can sail in eight directions with keyboard input
- Ship speed on map varies by ship class
- When ship enters town proximity, transition prompt appears
- When ship enters anomaly proximity, encounter is triggered
- LLM narrates each anomaly encounter
- Random encounter or anomaly triggers battle scene
- Each combatant has ATB time bar that fills in real time
- When player's ATB bar is full, player can choose action
- Special skills have separate charge bar
- Fire Cannons deals standard damage
- Broadside deals AoE damage with longer reset
- Defeating all enemies ends battle and awards XP
- If player's ship HP reaches 0, the run ends
- Battle difficulty is influenced by player level and LLM
- LLM provides one-line narrative for battle outcome
- Defeating enemies in battle awards XP
- When XP reaches threshold, captain levels up
- Each level-up increases stats (HP, STR, DEX, CON)
- Stat increases vary by ship class
- Level and stats are displayed on HUD
- Entering town loads side-scrolling port view
- Town has Market, Shipyard, and Tavern
- In Market, player can buy and sell trade goods
- Trade prices vary between towns
- In Tavern, player can rest to restore HP
- Tavern displays LLM-generated NPC dialogue and quests
- In Shipyard, player can upgrade cannons, hull, or sails
- In Shipyard, player can hire crew members
- At game start, LLM generates 3 initial quests
- Completing quest awards XP, gold, and triggers narrative
- New quests can be generated dynamically by LLM
- Quest objectives appear in HUD log
- LLM narrates major story milestones
- Cannon upgrades increase battle damage output
- Hull upgrades increase max HP
- Sail upgrades increase world map speed
- Crew members can be assigned roles
- Max crew capacity depends on ship class
- LLM narrative text can be read aloud
- Player can toggle TTS on/off in settings
- Each spoken line uses configurable voice and rate
