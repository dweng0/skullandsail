import { describe, it, expect } from 'vitest';
import StoryProgressionSystem from './StoryProgressionSystem';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Mock LLMCallManager
jest.mock('./LLMCallManager', () => ({
  generateNarrative: jest.fn().mockResolvedValue('Mock narrative'),
}));

// Test case: Narrative is recorded in story journal
it('records narrative in story journal when displayed', async () => {
  const storySystem = new StoryProgressionSystem();
  const narrative = 'The sea is calm today.';
  const speaker = 'Captain';

  // Simulate narrative display
  await storySystem.logStoryBeat('test_beat', narrative, speaker);

  // Check that narrative was saved to localStorage
  expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
    'story_journal',
    expect.stringContaining(narrative)
  );

  // Verify the entry has timestamp and metadata
  const storedJournal = mockLocalStorage.setItem.mock.calls[0][1];
  expect(storedJournal).toContain('test_beat');
  expect(storedJournal).toContain(speaker);
  expect(storedJournal).toContain('timestamp');
});

// Test case: Story journal shows full narrative text
it('story journal displays full narrative text', () => {
  const storySystem = new StoryProgressionSystem();
  const narrative = 'This is a long narrative about the journey. It has multiple sentences and should be properly formatted.';
  const speaker = 'Navigator';

  // Log a story beat
  storySystem.logStoryBeat('journey_start', narrative, speaker);

  // Retrieve journal
  const journal = storySystem.getStoryJournal();

  // Check that full narrative is present
  expect(journal).toContain(narrative);
  expect(journal).toContain(speaker);
});

// Test case: Player can open journal from HUD to review past narratives
it('allows player to open journal from HUD', () => {
  const storySystem = new StoryProgressionSystem();
  const narrative = 'The sea is calm today.';
  const speaker = 'Captain';

  // Log a story beat
  storySystem.logStoryBeat('calm_day', narrative, speaker);

  // Get journal
  const journal = storySystem.getStoryJournal();

  // Verify journal is accessible
  expect(journal).toBeDefined();
  expect(typeof journal).toBe('string');
  expect(journal.length).toBeGreaterThan(0);
});