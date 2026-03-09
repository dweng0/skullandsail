import { useState } from 'react'
import { ShipClass } from './Game'

interface CharacterSetupProps {
    onSetup: (captain: string, shipClass: ShipClass) => void
    availableShips: ShipClass[]
}

interface ShipStats {
    speed: number
    trade: number
    combat: number
}

const shipStats: Record<ShipClass, ShipStats> = {
    sloop: { speed: 2, trade: 0, combat: -1 },
    brigantine: { speed: 0, trade: 1, combat: 0 },
    galleon: { speed: -1, trade: 0, combat: 1 },
}

export default function CharacterSetup({
    onSetup,
    availableShips,
}: CharacterSetupProps) {
    const [captainName, setCaptainName] = useState('')
    const [selectedShip, setSelectedShip] = useState<ShipClass>(
        availableShips[0],
    )

    const handleStart = () => {
        if (captainName.trim() && selectedShip) {
            onSetup(captainName, selectedShip)
        }
    }

    const isStartEnabled = captainName.trim().length > 0 && selectedShip

    return (
        <div
            className="ui-panel"
            style={{ maxWidth: '500px', margin: '0 auto' }}
        >
            <h2 className="ui-title">Create Your Captain</h2>

            <div style={{ marginBottom: '20px' }}>
                <label className="ui-highlight">Captain Name:</label>
                <input
                    type="text"
                    placeholder="Enter your captain's name"
                    value={captainName}
                    onChange={(e) => setCaptainName(e.target.value)}
                    maxLength={30}
                    style={{ width: '100%', marginTop: '8px' }}
                />
                <div
                    style={{
                        fontSize: '12px',
                        marginTop: '4px',
                        color: '#999',
                    }}
                >
                    {captainName.length}/30
                </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label className="ui-highlight">Choose Your Ship:</label>
                {availableShips.map((ship) => (
                    <div
                        key={ship}
                        style={{
                            marginTop: '12px',
                            padding: '10px',
                            border:
                                selectedShip === ship
                                    ? '2px solid #ffd700'
                                    : '1px solid #666',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            backgroundColor:
                                selectedShip === ship
                                    ? 'rgba(255, 215, 0, 0.1)'
                                    : 'transparent',
                        }}
                        onClick={() => setSelectedShip(ship)}
                    >
                        <input
                            type="radio"
                            name="ship"
                            value={ship}
                            checked={selectedShip === ship}
                            onChange={(e) =>
                                setSelectedShip(e.target.value as ShipClass)
                            }
                            style={{ marginRight: '8px' }}
                        />
                        <label
                            style={{
                                cursor: 'pointer',
                                textTransform: 'capitalize',
                            }}
                        >
                            {ship}
                        </label>
                        <div
                            style={{
                                fontSize: '12px',
                                marginLeft: '24px',
                                marginTop: '4px',
                                color: '#ccc',
                            }}
                        >
                            Speed:{' '}
                            {shipStats[ship].speed > 0
                                ? '+' + shipStats[ship].speed
                                : shipStats[ship].speed}{' '}
                            | Trade:{' '}
                            {shipStats[ship].trade > 0
                                ? '+' + shipStats[ship].trade
                                : shipStats[ship].trade}{' '}
                            | Combat:{' '}
                            {shipStats[ship].combat > 0
                                ? '+' + shipStats[ship].combat
                                : shipStats[ship].combat}
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={handleStart}
                disabled={!isStartEnabled}
                style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    opacity: isStartEnabled ? 1 : 0.5,
                    cursor: isStartEnabled ? 'pointer' : 'not-allowed',
                }}
            >
                Start Your Voyage
            </button>
        </div>
    )
}
