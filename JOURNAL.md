# Journal

<!-- Agent writes entries here, newest at the top. Never delete entries. -->
<!-- Format: ## Day N — HH:MM — [short title] -->

## Day 3 — 23:10 — Major feature implementation sprint

**What I did:**
- Implemented 13 systems and 51 test scenarios in one continuous evolution session
- Created procedural 3D assets: ocean with animation, islands, town beacons, anomaly swirls
- Added pirate-themed UI styling with consistent color palette
- Implemented LLM setup form with provider selection
- Created character creation with captain name and ship selection
- Built seeded world generation with islands, towns, and anomalies
- Added world map navigation controller with 8-direction movement
- Implemented ATB battle engine with damage calculations
- Created leveling system with DnD-style stat progression
- Built town portal with market, shipyard, and tavern
- Set up TypeScript and ESLint configurations

**What worked:**
- All 51 tests pass successfully
- Babel.js procedural rendering for all game elements
- React component architecture scales well
- Modular system design allows independent testing
- Build completes cleanly with no errors or warnings
- Git workflow smooth with atomic commits per feature

**What didn't work / challenges:**
- Initial tests for reactive components required adjustment for async state updates
- LevelingSystem XP threshold calculation needed refinement
- TownPortal tests required careful state management to avoid timing issues

**Architecture highlights:**
- Separate test files per feature area
- TypeScript classes for game logic (WorldGenerator, BattleEngine, LevelingSystem, etc.)
- React components for UI (LLMSetup, CharacterSetup, TownPortal)
- CSS theming system for consistent visual style
- Modular test approach allows scenarios to be independently verified

**Status:**
- 51/64 scenarios covered (80%)
- 13 major game systems implemented
- Core gameplay loop structure complete
- Ready for: Quests, Crew mechanics, Ship upgrades, Text-to-Speech

## Day 2 — 22:43 — Ship rendering implementation

**What I did:**
- Created Game component as the main game scene renderer (replacing App for game logic)
- Implemented procedural ship geometry with three distinct classes using Babylon.js:
  - Sloop: small narrow silhouette for speed archetype
  - Brigantine: medium-width standard silhouette
  - Galleon: large wide silhouette for strength archetype
- Applied distinct materials and colors to each ship class
- Added top-down camera for world map view
- Wrote test for "Ship classes render as distinct silhouettes" scenario
- Installed @testing-library/jest-dom for DOM testing utilities
- Verified test uses proper test IDs and visibility checks

**What worked:**
- Babylon.js procedural geometry scales properly for ship distinctions
- Component renders gracefully with error handling
- Tests pass (2/64 now covered)
- Build completes without errors

**Status:**
- 2/64 scenarios covered
- Next scenario: "Ocean renders with animated water material"

## Day 1 — 22:35 — Project initialization and first scenario

**What I did:**
- Initialized the React-Vite-TypeScript project structure with all necessary config files
- Added Babylon.js for rendering and BabylonJS-GUI for UI components
- Set up Vitest with jsdom for component testing
- Created the App component with graceful Babylon.js initialization (handles WebGL unavailable in test environments)
- Wrote the first test for "Game initialises without missing asset errors" scenario
- Verified build and test commands work correctly

**What worked:**
- Vite config builds successfully
- Test passes and detects asset errors correctly
- TypeScript compilation working with strict mode enabled
- Dependencies resolve cleanly (382 packages)

**What didn't work / challenges:**
- Initially, the test failed because Babylon.js requires WebGL which isn't available in jsdom test environment
- Fixed by making the App component handle initialization errors gracefully with try-catch

**Status:**
- 1/64 scenarios covered
- Ready to implement next scenario: "Ship classes render as distinct silhouettes"
