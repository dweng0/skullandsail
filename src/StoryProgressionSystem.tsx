export class StoryProgressionSystem {
  private storyJournal: Array<{ id: string; text: string }> = [];
  private playerChoices: Array<{ choiceId: string; choice: string }> = [];
  private currentArc: string = "beginning";

  logStoryBeat(id: string, text: string) {
    this.storyJournal.push({ id, text });
  }

  getStoryJournal() {
    return this.storyJournal.map((j) => `${j.id}: ${j.text}`);
  }

  recordPlayerChoice(choiceId: string, choice: string) {
    this.playerChoices.push({ choiceId, choice });
  }

  getPlayerChoices() {
    return this.playerChoices;
  }

  getCurrentArc() {
    return this.currentArc;
  }

  setCurrentArc(arc: string) {
    this.currentArc = arc;
  }

  generateContextAwareDialogue(_npcType: string) {
    // Simulate context-aware dialogue based on player choices
    if (this.playerChoices.length > 0) {
      const lastChoice = this.playerChoices[this.playerChoices.length - 1];
      if (lastChoice.choice === "destroy_ship") {
        return "I hear you're ruthless. That could be useful.";
      }
    }
    return "They say you have a good heart. I respect that.";
  }

  generateEndingNarrative() {
    if (this.playerChoices.length === 0) {
      return "Your voyage has come full circle. The sea has been your teacher and your home. You walked a balanced path, neither pure light nor shadow. You completed 0 major tasks.";
    }

    const lastChoice = this.playerChoices[this.playerChoices.length - 1];
    if (lastChoice.choice === "vengeance") {
      return "Your journey ends in retribution. You took what you felt was rightfully yours. The sea remembers.";
    }

    return "Your voyage has come full circle. The sea has been your teacher and your home. You walked a balanced path, neither pure light nor shadow. You completed 0 major tasks.";
  }

  serialize() {
    return JSON.stringify({
      storyJournal: this.storyJournal,
      playerChoices: this.playerChoices,
      currentArc: this.currentArc,
    });
  }

  deserialize(data: string) {
    const parsed = JSON.parse(data);
    this.storyJournal = parsed.storyJournal;
    this.playerChoices = parsed.playerChoices;
    this.currentArc = parsed.currentArc;
  }
}
