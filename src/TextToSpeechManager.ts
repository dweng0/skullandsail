export default class TextToSpeechManager {
  private enabled: boolean = false;
  private speechRate: number = 1.0;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private speaking: boolean = false;

  constructor() {
    this.initializeSpeechSynthesis();
  }

  private initializeSpeechSynthesis(): void {
    if (!("speechSynthesis" in window)) {
      console.warn("Speech Synthesis API not supported in this browser");
    }
  }

  speak(text: string): void {
    if (!this.enabled) {
      return;
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = this.speechRate;

      utterance.onstart = () => {
        this.speaking = true;
      };

      utterance.onend = () => {
        this.speaking = false;
      };

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      this.currentUtterance = utterance;
    }
  }

  stop(): void {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      this.speaking = false;
    }
  }

  pause(): void {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else {
        window.speechSynthesis.pause();
      }
    }
  }

  isSpeaking(): boolean {
    return this.speaking;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) {
      this.stop();
    }
  }

  setSpeechRate(rate: number): void {
    this.speechRate = Math.max(0.5, Math.min(2.0, rate));
  }

  getSpeechRate(): number {
    return this.speechRate;
  }

  getAvailableVoices(): string[] {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return ["Default Voice"];
    }

    const voices = window.speechSynthesis.getVoices();
    return voices.length > 0 ? voices.map((v) => v.name) : ["Default Voice"];
  }

  setVoice(voiceName: string): void {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find((v) => v.name === voiceName);
      if (selectedVoice && this.currentUtterance) {
        this.currentUtterance.voice = selectedVoice;
      }
    }
  }
}
