/**
 * Types used throughout the game
 */

// Story arc states
export type StoryArc = "beginning" | "middle" | "late" | "ending";

// Major quest definition
export interface MajorQuest {
  id: string;
  title: string;
  description: string;
  reward: string;
}

// Player choice record
export interface PlayerChoice {
  eventId: string;
  choice: string;
}

// Story state for serialization
export interface StoryState {
  currentArc: StoryArc;
  majorQuestsCompleted: MajorQuest[];
  playerChoices: PlayerChoice[];
  journalBeat: string[];
  unlockedAreas: string[];
}
