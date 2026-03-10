import { useState, useRef, useEffect } from 'react'
import type MultiplayerManager from './MultiplayerManager'
import './styles.css'

interface ChatMessage {
    playerId: number
    text: string
    timestamp: number
    isLocal: boolean
}

interface ChatProps {
    manager: MultiplayerManager | null
    isOpen: boolean
    onToggle: () => void
}

const EMOTES = [
    { type: 'wave', symbol: '👋', label: 'Wave' },
    { type: 'laugh', symbol: '😂', label: 'Laugh' },
    { type: 'danger', symbol: '⚠️', label: 'Danger!' },
    { type: 'treasure', symbol: '💰', label: 'Treasure!' },
    { type: 'confused', symbol: '🤔', label: 'Confused' },
    { type: 'sad', symbol: '😢', label: 'Sad' },
    { type: 'happy', symbol: '😄', label: 'Happy' },
    { type: 'angry', symbol: '😡', label: 'Angry' },
]

export default function MultiplayerChat({ manager, isOpen, onToggle }: ChatProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [chatInput, setChatInput] = useState('')
    const [showEmotes, setShowEmotes] = useState(false)
    const messageEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSendMessage = () => {
        if (!chatInput.trim() || !manager) return

        const message: ChatMessage = {
            playerId: manager.getPlayerId() || 0,
            text: chatInput,
            timestamp: Date.now(),
            isLocal: true,
        }

        setMessages((prev) => [...prev, message])
        manager.sendChatMessage(chatInput)
        setChatInput('')
    }

    const handleEmote = (emoteType: string) => {
        if (!manager) return

        manager.sendEmote(emoteType)
        setShowEmotes(false)

        // Add local emote message for visual feedback
        const emote = EMOTES.find((e) => e.type === emoteType)
        if (emote) {
            const message: ChatMessage = {
                playerId: manager.getPlayerId() || 0,
                text: `[${emote.label}]`,
                timestamp: Date.now(),
                isLocal: true,
            }
            setMessages((prev) => [...prev, message])
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    return (
        <div className="multiplayer-chat">
            <div className="chat-toggle-btn" onClick={onToggle}>
                <span className="chat-icon">💬</span>
                <span className="message-count">{messages.length}</span>
            </div>

            {isOpen && (
                <div className="chat-panel">
                    <div className="chat-header">
                        <h3>Global Chat</h3>
                        <button className="close-btn" onClick={onToggle}>
                            ✕
                        </button>
                    </div>

                    <div className="chat-messages">
                        {messages.length === 0 && (
                            <div className="no-messages">No messages yet</div>
                        )}
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`chat-message ${msg.isLocal ? 'local' : 'remote'}`}
                            >
                                <span className="timestamp">
                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                </span>
                                <span className="player-id">Player {msg.playerId}:</span>
                                <span className="message-text">{msg.text}</span>
                            </div>
                        ))}
                        <div ref={messageEndRef} />
                    </div>

                    <div className="chat-input-area">
                        <div className="emote-section">
                            <button
                                className="emote-toggle"
                                onClick={() => setShowEmotes(!showEmotes)}
                                title="Quick Emotes"
                            >
                                😊
                            </button>
                            {showEmotes && (
                                <div className="emote-wheel">
                                    {EMOTES.map((emote) => (
                                        <button
                                            key={emote.type}
                                            className="emote-btn"
                                            onClick={() => handleEmote(emote.type)}
                                            title={emote.label}
                                        >
                                            {emote.symbol}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <textarea
                            className="chat-input"
                            placeholder="Type message... (max 100 chars)"
                            value={chatInput}
                            onChange={(e) =>
                                setChatInput(e.target.value.slice(0, 100))
                            }
                            onKeyPress={handleKeyPress}
                            disabled={!manager}
                        />

                        <button
                            className="send-btn"
                            onClick={handleSendMessage}
                            disabled={!chatInput.trim() || !manager}
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
