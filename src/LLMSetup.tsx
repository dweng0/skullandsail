import { useState, useEffect } from "react";

interface LLMSetupProps {
  onConnect: (config: LLMConfig) => void;
}

export interface LLMConfig {
  provider: "openai" | "claude" | "gemini";
  model: string;
  endpoint?: string;
  apiKey: string;
}

export default function LLMSetup({ onConnect }: LLMSetupProps) {
  const [provider, setProvider] = useState<"openai" | "claude" | "gemini">(
    "openai",
  );
  const [model, setModel] = useState("gpt-4-turbo");
  const [endpoint, setEndpoint] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  const [testing, setTesting] = useState(false);

  // Load saved config from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("llmConfig");
    if (saved) {
      try {
        const config = JSON.parse(saved);
        setProvider(config.provider);
        setModel(config.model);
        setEndpoint(config.endpoint || "");
        setApiKey(config.apiKey);
      } catch (e) {
        // Invalid saved config, ignore
      }
    }
  }, []);

  const handleTestConnection = async () => {
    setError("");
    setTesting(true);

    try {
      // Simulate API test
      if (!apiKey.trim()) {
        setError("API key is required");
        return;
      }

      if (provider === "openai" && !endpoint.trim()) {
        setError("Endpoint is required for OpenAI-compatible providers");
        return;
      }

      // Simulate successful connection test
      await new Promise((resolve) => setTimeout(resolve, 500));

      const config = {
        provider,
        model,
        endpoint: endpoint || undefined,
        apiKey,
      };

      // Save config to localStorage
      localStorage.setItem("llmConfig", JSON.stringify(config));

      onConnect(config);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection test failed");
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="ui-panel">
      <h2 className="ui-title">LLM Configuration</h2>

      <div style={{ marginBottom: "12px" }}>
        <label className="ui-highlight">Provider:</label>
        <select
          value={provider}
          onChange={(e) =>
            setProvider(e.target.value as "openai" | "claude" | "gemini")
          }
          style={{
            marginLeft: "8px",
            width: "100%",
            marginTop: "4px",
          }}
        >
          <option value="openai">OpenAI-compatible</option>
          <option value="claude">Claude (Anthropic)</option>
          <option value="gemini">Gemini (Google)</option>
        </select>
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label className="ui-highlight">Model:</label>
        <input
          type="text"
          placeholder="e.g., gpt-4-turbo, claude-3-opus, qwen3.5-plus"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          style={{ width: "100%", marginTop: "4px" }}
        />
      </div>

      {provider === "openai" && (
        <div style={{ marginBottom: "12px" }}>
          <label className="ui-highlight">API Endpoint:</label>
          <input
            type="text"
            placeholder="https://api.openai.com/v1"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            style={{ width: "100%", marginTop: "4px" }}
          />
        </div>
      )}

      <div style={{ marginBottom: "12px" }}>
        <label className="ui-highlight">API Key:</label>
        <input
          type="password"
          placeholder="Your API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          style={{ width: "100%", marginTop: "4px" }}
        />
      </div>

      {error && (
        <div
          style={{
            color: "#ff6b6b",
            marginBottom: "12px",
            padding: "8px",
            backgroundColor: "rgba(255, 107, 107, 0.1)",
            borderRadius: "4px",
          }}
        >
          {error}
        </div>
      )}

      <button
        onClick={handleTestConnection}
        disabled={testing}
        style={{
          width: "100%",
          marginBottom: "8px",
        }}
      >
        {testing ? "Testing..." : "Test Connection"}
      </button>
    </div>
  );
}
