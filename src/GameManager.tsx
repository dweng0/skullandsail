import { useState, useEffect } from 'react'
import Game from './Game'
import LLMSetup from './LLMSetup'
import CharacterSetup from './CharacterSetup'
import type { ShipClass } from './Game'

type GameState =
    | 'menu'
    | 'llm-setup'
    | 'character-setup'
    | 'loading'
    | 'playing'

interface GameConfig {
    llmProvider?: string
    llmKey?: string
    captainName?: string
    shipClass?: ShipClass
}

interface SavedGameState {
    captainName: string
    shipClass: ShipClass
    shipName?: string
    shipPosition?: { x: number; z: number }
    heading?: number
    velocity?: number
    level?: number
    xp?: number
    gold?: number
    inventory?: string[]
    upgrades?: {
        cannons?: number
        hull?: number
        sails?: number
    }
    crew?: string[]
    timestamp: number
}

export default function GameManager() {
    const [gameState, setGameState] = useState<GameState>('menu')
    const [config, setConfig] = useState<GameConfig>({})

    // Auto-connect with cached LLM config on mount
    useEffect(() => {
        const cachedLLMConfig = localStorage.getItem('llmConfig')
        if (cachedLLMConfig) {
            try {
                const parsed = JSON.parse(cachedLLMConfig)
                // Auto-connect with cached config
                setConfig({
                    llmProvider: parsed.provider,
                    llmKey: parsed.apiKey,
                })
                setGameState('character-setup')
            } catch (e) {
                // Invalid cached config, proceed to setup
                setGameState('menu')
            }
        }
    }, [])

    const handleLLMConnect = (llmConfig: any) => {
        setConfig({
            ...config,
            llmProvider: llmConfig.provider,
            llmKey: llmConfig.apiKey,
        })
        setGameState('character-setup')
    }

    const handleCharacterSetup = (
        captainName: string,
        shipClass: ShipClass,
    ) => {
        setConfig({
            ...config,
            captainName,
            shipClass,
        })
        setGameState('loading')
        // Simulate loading
        setTimeout(() => {
            setGameState('playing')
        }, 500)
    }

    const handleStartNewGame = () => {
        setGameState('llm-setup')
    }

    const handleLoadGame = () => {
        const savedData = localStorage.getItem('gameSave')
        if (savedData) {
            try {
                const save: SavedGameState = JSON.parse(savedData)
                setConfig({
                    llmProvider: config.llmProvider,
                    llmKey: config.llmKey,
                    captainName: save.captainName,
                    shipClass: save.shipClass,
                })
                setGameState('loading')
                setTimeout(() => {
                    setGameState('playing')
                }, 500)
            } catch (e) {
                // Invalid save, proceed to menu
                console.error('Failed to load saved game:', e)
            }
        }
    }

    return (
        <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
            {gameState === 'menu' && (
                <MainMenu onStart={handleStartNewGame} onLoad={handleLoadGame} />
            )}

            {gameState === 'llm-setup' && (
                <LLMSetup onConnect={handleLLMConnect} />
            )}

            {gameState === 'character-setup' && (
                <CharacterSetup
                    onSetup={handleCharacterSetup}
                    availableShips={['sloop', 'brigantine', 'galleon']}
                />
            )}

            {gameState === 'loading' && <LoadingScreen />}

            {gameState === 'playing' && (
                <Game playerShipClass={config.shipClass || 'brigantine'} />
            )}
        </div>
    )
}

function MainMenu({
    onStart,
    onLoad,
}: {
    onStart: () => void
    onLoad: () => void
}) {
    const hasSavedGame = !!localStorage.getItem('gameSave')

    const buttonStyle = {
        padding: '16px 48px',
        fontSize: '18px',
        fontWeight: 'bold',
        backgroundColor: '#d4a574',
        color: '#0a0e27',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'all 0.3s',
        marginBottom: '12px',
    }

    const handleButtonHover = (e: React.MouseEvent<HTMLButtonElement>) => {
        ;(e.target as HTMLButtonElement).style.backgroundColor = '#ffd700'
        ;(e.target as HTMLButtonElement).style.transform = 'scale(1.05)'
    }

    const handleButtonOut = (e: React.MouseEvent<HTMLButtonElement>) => {
        ;(e.target as HTMLButtonElement).style.backgroundColor = '#d4a574'
        ;(e.target as HTMLButtonElement).style.transform = 'scale(1)'
    }

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
                color: '#e8dcc8',
                textAlign: 'center',
            }}
        >
            <h1
                style={{
                    fontSize: '64px',
                    marginBottom: '12px',
                    textShadow: '0 0 20px rgba(212, 165, 116, 0.5)',
                    color: '#ffd700',
                }}
            >
                ⚓ Skull & Sail ⚓
            </h1>

            <p
                style={{
                    fontSize: '20px',
                    marginBottom: '32px',
                    color: '#d4a574',
                    fontStyle: 'italic',
                }}
            >
                A Pirate Roguelike RPG
            </p>

            <div style={{ marginBottom: '24px', maxWidth: '600px' }}>
                <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    Command your ship across a procedurally generated sea. Trade
                    at ports, engage in turn-based battles, and follow an
                    LLM-crafted storyline. Every voyage is unique.
                </p>
            </div>

            <div>
                {hasSavedGame && (
                    <button
                        onClick={onLoad}
                        style={buttonStyle}
                        onMouseOver={handleButtonHover}
                        onMouseOut={handleButtonOut}
                    >
                        Continue Your Voyage
                    </button>
                )}

                <button
                    onClick={onStart}
                    style={buttonStyle}
                    onMouseOver={handleButtonHover}
                    onMouseOut={handleButtonOut}
                >
                    {hasSavedGame ? 'New Game' : 'Start Your Voyage'}
                </button>
            </div>

            <div
                style={{
                    marginTop: '48px',
                    fontSize: '12px',
                    color: '#999',
                    borderTop: '1px solid #444',
                    paddingTop: '16px',
                    maxWidth: '400px',
                }}
            >
                <p>⚠️ WebGL and modern browser required</p>
                <p>🤖 Requires OpenAI-compatible, Claude, or Gemini API key</p>
            </div>
        </div>
    )
}

function LoadingScreen() {
    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
                color: '#e8dcc8',
            }}
        >
            <div
                style={{
                    fontSize: '32px',
                    marginBottom: '24px',
                    animation: 'spin 2s linear infinite',
                }}
            >
                ⚓
            </div>
            <p style={{ fontSize: '18px', marginBottom: '12px' }}>
                Preparing your voyage...
            </p>
            <p style={{ fontSize: '12px', color: '#999' }}>
                Generating world...
            </p>

            <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    )
}
