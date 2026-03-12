import { useState } from "react";
import MultiplayerManager from "./MultiplayerManager";
import "./styles.css";

interface MultiplayerSetupProps {
  onSessionCreated: (manager: MultiplayerManager) => void;
  onSessionJoined: (manager: MultiplayerManager, sessionCode: string) => void;
}

export default function MultiplayerSetup({
  onSessionCreated,
  onSessionJoined,
}: MultiplayerSetupProps) {
  const [mode, setMode] = useState<"menu" | "host" | "join">("menu");
  const [sessionCode, setSessionCode] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState("");

  const handleCreateSession = async () => {
    setConnecting(true);
    setError("");
    try {
      const manager = new MultiplayerManager();
      await manager.createMultiplayerSession();
      localStorage.setItem(
        "multiplayerSession",
        JSON.stringify(manager.saveSessionState()),
      );
      onSessionCreated(manager);
    } catch (err) {
      setError("Failed to create multiplayer session");
      setConnecting(false);
    }
  };

  const handleJoinSession = async () => {
    if (!sessionCode.trim()) {
      setError("Please enter a session code");
      return;
    }

    setConnecting(true);
    setError("");
    try {
      const manager = new MultiplayerManager();
      const success = await manager.joinMultiplayerSession(sessionCode);
      if (success) {
        localStorage.setItem(
          "multiplayerSession",
          JSON.stringify(manager.saveSessionState()),
        );
        onSessionJoined(manager, sessionCode);
      } else {
        setError("Failed to join session");
        setConnecting(false);
      }
    } catch (err) {
      setError("Failed to join session");
      setConnecting(false);
    }
  };

  return (
    <div className="multiplayer-setup">
      <div className="multiplayer-container">
        {mode === "menu" && (
          <div className="multiplayer-menu">
            <h2>Multiplayer</h2>
            <p>Play with up to 3 other pirates</p>
            <div className="multiplayer-buttons">
              <button
                className="btn btn-primary"
                onClick={() => {
                  setMode("host");
                  setError("");
                }}
              >
                Start Multiplayer Game
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setMode("join");
                  setError("");
                }}
              >
                Join Multiplayer Session
              </button>
              <button
                className="btn btn-tertiary"
                onClick={() => setMode("menu")}
                style={{ marginTop: "20px" }}
              >
                Back
              </button>
            </div>
          </div>
        )}

        {mode === "host" && (
          <div className="multiplayer-host">
            <h2>Create Multiplayer Game</h2>
            <p>
              You will be the host. Other players can join using the session
              code.
            </p>
            {error && <div className="error-message">{error}</div>}
            <button
              className="btn btn-primary"
              onClick={handleCreateSession}
              disabled={connecting}
            >
              {connecting ? "Creating..." : "Create Session"}
            </button>
            <button
              className="btn btn-tertiary"
              onClick={() => {
                setMode("menu");
                setError("");
              }}
            >
              Back
            </button>
          </div>
        )}

        {mode === "join" && (
          <div className="multiplayer-join">
            <h2>Join Multiplayer Game</h2>
            <p>Enter the session code from the host</p>
            {error && <div className="error-message">{error}</div>}
            <input
              type="text"
              placeholder="Enter session code (e.g., ABC12345)"
              value={sessionCode}
              onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
              disabled={connecting}
              maxLength={8}
              className="session-code-input"
            />
            <button
              className="btn btn-primary"
              onClick={handleJoinSession}
              disabled={connecting || !sessionCode.trim()}
            >
              {connecting ? "Joining..." : "Join Session"}
            </button>
            <button
              className="btn btn-tertiary"
              onClick={() => {
                setMode("menu");
                setError("");
                setSessionCode("");
              }}
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
