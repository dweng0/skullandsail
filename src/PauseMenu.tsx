import { useState } from 'react'

interface PauseMenuProps {
    onResume: () => void
    onQuit: () => void
}

export default function PauseMenu({ onResume, onQuit }: PauseMenuProps) {
    const [showSettings, setShowSettings] = useState(false)
    const [confirmClearCache, setConfirmClearCache] = useState(false)

    const handleClearCache = () => {
        localStorage.clear()
        setConfirmClearCache(false)
        setShowSettings(false)
        onQuit()
    }

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
            }}
        >
            <div
                className="ui-panel"
                style={{
                    minWidth: '300px',
                    padding: '32px',
                    textAlign: 'center',
                }}
            >
                {!showSettings ? (
                    <>
                        <h2 className="ui-title" style={{ marginBottom: '24px' }}>
                            ⏸ PAUSED
                        </h2>

                        <button
                            onClick={onResume}
                            style={{
                                width: '100%',
                                marginBottom: '12px',
                                padding: '12px',
                            }}
                        >
                            Resume Game
                        </button>

                        <button
                            onClick={() => setShowSettings(true)}
                            style={{
                                width: '100%',
                                marginBottom: '12px',
                                padding: '12px',
                            }}
                        >
                            Settings
                        </button>

                        <button
                            onClick={onQuit}
                            style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: 'rgba(255, 100, 100, 0.3)',
                                borderColor: '#ff6464',
                            }}
                        >
                            Quit to Menu
                        </button>
                    </>
                ) : !confirmClearCache ? (
                    <>
                        <h3 className="ui-title" style={{ marginBottom: '24px' }}>
                            ⚙️ Settings
                        </h3>

                        <button
                            onClick={() => setConfirmClearCache(true)}
                            style={{
                                width: '100%',
                                marginBottom: '12px',
                                padding: '12px',
                                backgroundColor: 'rgba(255, 150, 0, 0.2)',
                                borderColor: '#ffa500',
                            }}
                        >
                            Clear Cache
                        </button>

                        <button
                            onClick={() => setShowSettings(false)}
                            style={{
                                width: '100%',
                                padding: '12px',
                            }}
                        >
                            Back
                        </button>
                    </>
                ) : (
                    <>
                        <h3
                            className="ui-title"
                            style={{
                                marginBottom: '12px',
                                color: '#ff6464',
                            }}
                        >
                            ⚠️ Clear Cache?
                        </h3>

                        <p
                            style={{
                                marginBottom: '24px',
                                fontSize: '12px',
                                color: '#ccc',
                            }}
                        >
                            This will delete your LLM settings and game saves.
                        </p>

                        <button
                            onClick={handleClearCache}
                            style={{
                                width: '100%',
                                marginBottom: '12px',
                                padding: '12px',
                                backgroundColor: 'rgba(255, 100, 100, 0.5)',
                                borderColor: '#ff6464',
                            }}
                        >
                            Clear
                        </button>

                        <button
                            onClick={() => setConfirmClearCache(false)}
                            style={{
                                width: '100%',
                                padding: '12px',
                            }}
                        >
                            Cancel
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}
