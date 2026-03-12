import { useState, useEffect } from "react";
import type MultiplayerManager from "./MultiplayerManager";
import "./styles.css";

interface BattleVoteState {
  playerVotes: Map<number, boolean | null>;
  timeRemaining: number;
  isActive: boolean;
}

interface MultiplayerBattleProps {
  multiplayerManager: MultiplayerManager | null;
  onBattleStart?: (allPlayersVoted: boolean) => void;
  onBattleCancel?: () => void;
}

export default function MultiplayerBattle({
  multiplayerManager,
  onBattleStart,
  onBattleCancel,
}: MultiplayerBattleProps) {
  const [voteState, setVoteState] = useState<BattleVoteState>({
    playerVotes: new Map(),
    timeRemaining: 5,
    isActive: false,
  });
  const [localVote, setLocalVote] = useState<boolean | null>(null);

  // Simulate battle vote timer
  useEffect(() => {
    if (!voteState.isActive || voteState.timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setVoteState((prev) => ({
        ...prev,
        timeRemaining: Math.max(0, prev.timeRemaining - 0.1),
      }));
    }, 100);

    return () => clearInterval(timer);
  }, [voteState.isActive, voteState.timeRemaining]);

  // Auto-resolve vote when time is up
  useEffect(() => {
    if (voteState.timeRemaining <= 0 && voteState.isActive) {
      resolveBattleVote();
    }
  }, [voteState.timeRemaining, voteState.isActive]);

  const startBattleEncounter = () => {
    setVoteState({
      playerVotes: new Map([[multiplayerManager?.getPlayerId() || 1, null]]),
      timeRemaining: 5,
      isActive: true,
    });
    setLocalVote(null);
  };

  const castVote = (vote: boolean) => {
    setLocalVote(vote);
    const playerId = multiplayerManager?.getPlayerId();
    if (playerId) {
      setVoteState((prev) => {
        const newVotes = new Map(prev.playerVotes);
        newVotes.set(playerId, vote);
        return {
          ...prev,
          playerVotes: newVotes,
        };
      });
    }
  };

  const resolveBattleVote = () => {
    const votes = Array.from(voteState.playerVotes.values()).filter(
      (v) => v !== null,
    );
    const yesVotes = votes.filter((v) => v === true).length;
    const totalVotes = votes.length;

    // Majority decides - more than half voted yes
    const shouldEngage = yesVotes > totalVotes / 2;

    setVoteState((prev) => ({
      ...prev,
      isActive: false,
    }));

    if (shouldEngage) {
      onBattleStart?.(true);
    } else {
      onBattleCancel?.();
    }
  };

  if (!voteState.isActive) {
    return (
      <div className="multiplayer-battle-inactive">
        <button className="btn btn-primary" onClick={startBattleEncounter}>
          Trigger Battle Encounter
        </button>
      </div>
    );
  }

  const yesVotes = Array.from(voteState.playerVotes.values()).filter(
    (v) => v === true,
  ).length;
  const totalVotes = Array.from(voteState.playerVotes.values()).filter(
    (v) => v !== null,
  ).length;

  return (
    <div className="multiplayer-battle-modal">
      <div className="battle-vote-container">
        <div className="battle-header">
          <h2>🚨 Battle Incoming!</h2>
          <p>Other players have encountered an enemy</p>
        </div>

        <div className="battle-countdown">
          <div className="timer">{Math.ceil(voteState.timeRemaining)}s</div>
          <p>Vote to engage in battle</p>
        </div>

        <div className="vote-display">
          <div className="vote-stats">
            <div className="stat">
              <span className="label">Yes Votes:</span>
              <span className="value">{yesVotes}</span>
            </div>
            <div className="stat">
              <span className="label">Votes Cast:</span>
              <span className="value">
                {totalVotes} / {voteState.playerVotes.size}
              </span>
            </div>
          </div>

          <div className="vote-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${(yesVotes / Math.max(1, voteState.playerVotes.size)) * 100}%`,
                }}
              />
            </div>
            <p className="progress-label">
              Majority {yesVotes > voteState.playerVotes.size / 2 ? "✓" : "✗"}
            </p>
          </div>
        </div>

        {localVote === null && (
          <div className="vote-buttons">
            <button className="btn btn-success" onClick={() => castVote(true)}>
              ⚔️ Engage Battle
            </button>
            <button className="btn btn-danger" onClick={() => castVote(false)}>
              🏃 Flee
            </button>
          </div>
        )}

        {localVote !== null && (
          <div className="vote-confirmation">
            <p>Your vote: {localVote ? "⚔️ Engage" : "🏃 Flee"}</p>
            <p className="waiting">Waiting for other players...</p>
          </div>
        )}
      </div>
    </div>
  );
}
