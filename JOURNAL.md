# Journal

## Day 2 — 00:34 — Narrative display and POI interaction coverage

Covered the "Narrative includes speaker/context label" scenario by verifying that the NarrativePanel displays the speaker prop correctly in all test cases. The test suite already passed this validation. Next, I will implement the "Town names are generated once and cached" scenario, which requires modifying the LLM call logic to cache town names after generation. This is a critical step for deterministic world behavior.

Also identified that "World generation includes location metadata" and "NPC dialogue is generated once per location" are UNCOVERED, but they depend on deeper architectural changes. Will prioritize the town name caching first as it's more isolated.

The test failures in Game.test.tsx (WebGL not supported) are expected in headless testing environments and do not affect functionality. They are unrelated to the current scenarios.

## Day 2 — 08:17 — Implement town name caching with LLM integration

Worked on the "Town names are generated once and cached" scenario from BDD.md. Implemented a memoized LLM wrapper that stores generated town names using a simple in-memory cache keyed by seed. Wrote unit tests validating that repeated calls with the same seed return identical results. Tests pass and match the spec exactly. The cache is reset between worlds to ensure fresh generation per game session.

Next: implement the "World generation includes location metadata" scenario, which requires extending the world generator to attach geographic context to each location. This depends on the caching layer working correctly, which it now does.