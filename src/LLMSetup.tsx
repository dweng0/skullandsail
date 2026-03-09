import { useState } from 'react'

interface LLMSetupProps {
    onConnect: (config: LLMConfig) => void
}

export interface LLMConfig {
    provider: 'openai' | 'claude' | 'gemini'
    endpoint?: string
    apiKey: string
}

export default function LLMSetup({ onConnect }: LLMSetupProps) {
    const [provider, setProvider] = useState<'openai' | 'claude' | 'gemini'>(
        'openai',
    )
    const [endpoint, setEndpoint] = useState('')
    const [apiKey, setApiKey] = useState('')
    const [error, setError] = useState('')
    const [testing, setTesting] = useState(false)

    const handleTestConnection = async () => {
        setError('')
        setTesting(true)

        try {
            // Simulate API test
            if (!apiKey.trim()) {
                setError('API key is required')
                return
            }

            if (provider === 'openai' && !endpoint.trim()) {
                setError('Endpoint is required for OpenAI-compatible providers')
                return
            }

            // Simulate successful connection test
            await new Promise((resolve) => setTimeout(resolve, 500))

            onConnect({
                provider,
                endpoint: endpoint || undefined,
                apiKey,
            })
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Connection test failed',
            )
        } finally {
            setTesting(false)
        }
    }

    return (
        <div className="ui-panel">
            <h2 className="ui-title">LLM Configuration</h2>

            <div style={{ marginBottom: '12px' }}>
                <label className="ui-highlight">Provider:</label>
                <select
                    value={provider}
                    onChange={(e) =>
                        setProvider(e.target.value as LLMConfig['provider'])
                    }
                    style={{ marginLeft: '8px' }}
                >
                    <option value="openai">OpenAI-compatible</option>
                    <option value="claude">Claude (Anthropic)</option>
                    <option value="gemini">Gemini (Google)</option>
                </select>
            </div>

            {provider === 'openai' && (
                <div style={{ marginBottom: '12px' }}>
                    <label className="ui-highlight">API Endpoint:</label>
                    <input
                        type="text"
                        placeholder="https://api.openai.com/v1"
                        value={endpoint}
                        onChange={(e) => setEndpoint(e.target.value)}
                        style={{ width: '100%', marginTop: '4px' }}
                    />
                </div>
            )}

            <div style={{ marginBottom: '12px' }}>
                <label className="ui-highlight">API Key:</label>
                <input
                    type="password"
                    placeholder="Your API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    style={{ width: '100%', marginTop: '4px' }}
                />
            </div>

            {error && (
                <div
                    style={{
                        color: '#ff6b6b',
                        marginBottom: '12px',
                        padding: '8px',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        borderRadius: '4px',
                    }}
                >
                    {error}
                </div>
            )}

            <button
                onClick={handleTestConnection}
                disabled={testing}
                style={{
                    width: '100%',
                    marginBottom: '8px',
                }}
            >
                {testing ? 'Testing...' : 'Test Connection'}
            </button>
        </div>
    )
}
