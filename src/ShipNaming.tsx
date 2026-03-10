import { useState, useEffect } from 'react'
import type { ShipClass } from './Game'

interface ShipNamingProps {
    shipClass: ShipClass
    onSetName: (name: string) => void
}

const SHIP_SUGGESTIONS: Record<ShipClass, string[]> = {
    sloop: [
        'Swift Justice',
        'Wind Dancer',
        'Phantom Runner',
        'Morning Mist',
        'Daring Corsair',
    ],
    brigantine: [
        'The Crimson Tide',
        'Sea Serpent',
        'Ocean Trader',
        'Fortune\'s Favor',
        'Iron Brigand',
    ],
    galleon: [
        'King of the Seas',
        'Golden Horizon',
        'Leviathan',
        'Treasure Hoard',
        'Admiral\'s Pride',
    ],
}

export default function ShipNaming({
    shipClass,
    onSetName,
}: ShipNamingProps) {
    const [shipName, setShipName] = useState('')
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Simulate LLM generating suggestions
        setLoading(true)
        setTimeout(() => {
            setSuggestions(SHIP_SUGGESTIONS[shipClass])
            setLoading(false)
        }, 500)
    }, [shipClass])

    const handleSuggestionClick = (suggestion: string) => {
        setShipName(suggestion)
        onSetName(suggestion)
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value.slice(0, 50)
        setShipName(name)
        if (name.trim()) {
            onSetName(name)
        }
    }

    return (
        <div style={{ marginBottom: '20px' }}>
            <h3 className="ui-highlight" style={{ marginBottom: '12px' }}>
                Name Your Ship
            </h3>

            {loading && (
                <div style={{ marginBottom: '12px', fontSize: '12px', color: '#999' }}>
                    Consulting the spirits for names...
                </div>
            )}

            {!loading && suggestions.length > 0 && (
                <div style={{ marginBottom: '12px' }}>
                    <p style={{ fontSize: '12px', color: '#ccc', marginBottom: '8px' }}>
                        Suggested names:
                    </p>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                        }}
                    >
                        {suggestions.map((suggestion) => (
                            <button
                                key={suggestion}
                                onClick={() => handleSuggestionClick(suggestion)}
                                style={{
                                    padding: '8px 12px',
                                    textAlign: 'left',
                                    backgroundColor:
                                        shipName === suggestion
                                            ? 'rgba(212, 165, 116, 0.3)'
                                            : 'transparent',
                                    border:
                                        shipName === suggestion
                                            ? '1px solid #d4a574'
                                            : '1px solid #444',
                                    borderRadius: '4px',
                                    color: '#e8dcc8',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    fontSize: '14px',
                                }}
                                onMouseOver={(e) => {
                                    ;(e.target as HTMLButtonElement).style.backgroundColor =
                                        'rgba(212, 165, 116, 0.2)'
                                }}
                                onMouseOut={(e) => {
                                    ;(e.target as HTMLButtonElement).style.backgroundColor =
                                        shipName === suggestion
                                            ? 'rgba(212, 165, 116, 0.3)'
                                            : 'transparent'
                                }}
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div>
                <label className="ui-highlight" style={{ fontSize: '12px' }}>
                    Or enter a custom name:
                </label>
                <input
                    type="text"
                    placeholder="Enter your ship's name"
                    value={shipName}
                    onChange={handleNameChange}
                    maxLength={50}
                    style={{
                        width: '100%',
                        marginTop: '8px',
                        marginBottom: '4px',
                    }}
                />
                <div
                    style={{
                        fontSize: '11px',
                        color: '#999',
                    }}
                >
                    {shipName.length}/50
                </div>
            </div>
        </div>
    )
}
