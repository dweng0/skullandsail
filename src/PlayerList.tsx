import { useEffect, useState } from 'react'
import type { RemotePlayer } from './MultiplayerManager'
import './styles.css'

interface PlayerListProps {
    players: RemotePlayer[]
    localPlayerId: number | null
    isHost: boolean
}

const getStatusColor = (status: string): string => {
    switch (status) {
        case 'Connected':
            return '#4ade80'
        case 'Connecting':
            return '#eab308'
        case 'Disconnected':
            return '#ef4444'
        default:
            return '#999'
    }
}

const getPlayerColor = (playerId: number): string => {
    const colors = ['#60a5fa', '#f87171', '#34d399', '#fbbf24']
    return colors[playerId - 1] || '#999'
}

export default function PlayerList({
    players,
    localPlayerId,
    isHost,
}: PlayerListProps) {
    const [displayPlayers, setDisplayPlayers] = useState<RemotePlayer[]>([])

    useEffect(() => {
        setDisplayPlayers(players)
    }, [players])

    return (
        <div className="player-list">
            <div className="player-list-header">
                <h3>Players</h3>
                <span className="player-count">
                    {displayPlayers.length + 1}/4
                </span>
            </div>
            <div className="player-list-container">
                {/* Local player */}
                <div className="player-item local-player">
                    <div
                        className="player-color"
                        style={{
                            backgroundColor: getPlayerColor(localPlayerId || 1),
                        }}
                    />
                    <div className="player-info">
                        <div className="player-name">You</div>
                        <div className="player-meta">
                            {isHost && <span className="host-badge">Host</span>}
                        </div>
                    </div>
                    <div className="player-status connected">Connected</div>
                </div>

                {/* Remote players */}
                {displayPlayers.map((player) => (
                    <div key={player.playerId} className="player-item">
                        <div
                            className="player-color"
                            style={{
                                backgroundColor: getPlayerColor(
                                    player.playerId,
                                ),
                            }}
                        />
                        <div className="player-info">
                            <div className="player-name">
                                {player.captainName}
                            </div>
                            <div className="player-meta">
                                <span className="ship-class">
                                    {player.shipClass}
                                </span>
                                <span className="level">
                                    Lvl {player.level}
                                </span>
                            </div>
                        </div>
                        <div className="player-status">
                            <span
                                className={`status-indicator ${player.status.toLowerCase()}`}
                                style={{
                                    backgroundColor: getStatusColor(
                                        player.status,
                                    ),
                                }}
                            />
                            <span className="status-text">{player.status}</span>
                            {player.ping !== undefined && (
                                <span className="ping">{player.ping}ms</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
