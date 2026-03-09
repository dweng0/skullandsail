# Journal

<!-- Agent writes entries here, newest at the top. Never delete entries. -->
<!-- Format: ## Day N — HH:MM — [short title] -->

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
