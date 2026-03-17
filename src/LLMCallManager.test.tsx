import { describe, it, expect } from 'vitest';
import LLMCallManager from './LLMCallManager';

// Test case: LLM maintains narrative context across session
it('maintains narrative context across session', async () => {
  const manager = new LLMCallManager();
  
  // Simulate initial connection and world generation
  await manager.initialize();
  
  // Simulate player actions that affect narrative context
  const context1 = {
    eventType: 'quest_start',
    playerName: 'Captain Blackbeard',
    playerLevel: 5,
    currentBiome: 'tropical',
    previousQuests: ['Rescue the Merchant Ship'],
    reputation: 'friendly'
  };
  
  // Generate first narrative
  const narrative1 = await manager.generateNarrative(context1);
  
  // Verify narrative includes context
  expect(narrative1).toContain('Captain Blackbeard');
  expect(narrative1).toContain('level 5');
  expect(narrative1).toContain('tropical');
  expect(narrative1).toContain('Rescue the Merchant Ship');
  
  // Simulate second action with updated context
  const context2 = {
    eventType: 'battle_outcome',
    playerName: 'Captain Blackbeard',
    playerLevel: 6,
    currentBiome: 'volcanic',
    previousQuests: ['Rescue the Merchant Ship', 'Defeat the Fire Pirates'],
    reputation: 'neutral'
  };
  
  // Generate second narrative
  const narrative2 = await manager.generateNarrative(context2);
  
  // Verify narrative includes updated context
  expect(narrative2).toContain('Captain Blackbeard');
  expect(narrative2).toContain('level 6');
  expect(narrative2).toContain('volcanic');
  expect(narrative2).toContain('Defeat the Fire Pirates');
  
  // Verify that both narratives are distinct and context-aware
  expect(narrative1).not.toEqual(narrative2);
});

// Test case: Player choices create branching narrative consequences
it('creates branching narrative consequences based on player choices', async () => {
  const manager = new LLMCallManager();
  
  // Simulate two different choices
  const choiceA = {
    eventType: 'choice_made',
    playerName: 'Captain Blackbeard',
    playerLevel: 4,
    currentBiome: 'temperate',
    choice: 'help_the_pirates',
    reputation: 'friendly'
  };
  
  const choiceB = {
    eventType: 'choice_made',
    playerName: 'Captain Blackbeard',
    playerLevel: 4,
    currentBiome: 'temperate',
    choice: 'attack_the_pirates',
    reputation: 'hostile'
  };
  
  // Generate narratives for each choice
  const narrativeA = await manager.generateNarrative(choiceA);
  const narrativeB = await manager.generateNarrative(choiceB);
  
  // Verify that narratives are different
  expect(narrativeA).not.toEqual(narrativeB);
  
  // Verify that narratives reflect the choice
  expect(narrativeA).toContain('help');
  expect(narrativeB).toContain('attack');
  
  // Verify that reputation affects narrative tone
  expect(narrativeA).toContain('friendly');
  expect(narrativeB).toContain('hostile');
});

// Test case: LLM adjusts narrative tension based on player power level
it('adjusts narrative tension based on player power level', async () => {
  const manager = new LLMCallManager();
  
  // Simulate low-level player
  const lowLevelContext = {
    eventType: 'encounter',
    playerName: 'Captain Blackbeard',
    playerLevel: 1,
    currentBiome: 'tropical',
    reputation: 'neutral'
  };
  
  // Simulate mid-level player
  const midLevelContext = {
    eventType: 'encounter',
    playerName: 'Captain Blackbeard',
    playerLevel: 5,
    currentBiome: 'volcanic',
    reputation: 'neutral'
  };
  
  // Simulate high-level player
  const highLevelContext = {
    eventType: 'encounter',
    playerName: 'Captain Blackbeard',
    playerLevel: 10,
    currentBiome: 'arctic',
    reputation: 'neutral'
  };
  
  // Generate narratives
  const narrativeLow = await manager.generateNarrative(lowLevelContext);
  const narrativeMid = await manager.generateNarrative(midLevelContext);
  const narrativeHigh = await manager.generateNarrative(highLevelContext);
  
  // Verify that higher levels have more intense narratives
  // This is a qualitative check - we verify that the narrative reflects increasing stakes
  expect(narrativeLow).toContain('small threat');
  expect(narrativeMid).toContain('significant challenge');
  expect(narrativeHigh).toContain('great danger');
  
  // Verify that the narrative scales appropriately with biome
  expect(narrativeLow).toContain('tropical');
  expect(narrativeMid).toContain('volcanic');
  expect(narrativeHigh).toContain('arctic');
});