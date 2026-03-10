import { useState } from 'react'
import type { NPC } from './NPCManager'
import './NPCDialogueUI.css'

export interface Quest {
    id: string
    title: string
    reward: { xp: number; gold: number }
}

interface NPCDialogueUIProps {
    npc: NPC
    isOpen: boolean
    onClose: () => void
    onSelectQuest: (quest: Quest) => void
    availableQuests?: Quest[]
}

type DialogueState = 'menu' | 'greet' | 'backstory' | 'quests'

export default function NPCDialogueUI({
    npc,
    isOpen,
    onClose,
    onSelectQuest,
    availableQuests = [],
}: NPCDialogueUIProps) {
    const [state, setState] = useState<DialogueState>('menu')
    const [greeting, setGreeting] = useState('')

    const handleGreet = () => {
        const greetings = npc.dialogue
        const randomGreeting =
            greetings[Math.floor(Math.random() * greetings.length)]
        setGreeting(randomGreeting)
        setState('greet')
    }

    const handleLearnMore = () => {
        setState('backstory')
    }

    const handleAskQuests = () => {
        setState('quests')
    }

    const handleBack = () => {
        setState('menu')
        setGreeting('')
    }

    const handleQuestSelect = (quest: Quest) => {
        onSelectQuest(quest)
        onClose()
    }

    const getRepuationMessage = (): string => {
        if (npc.reputation > 75) {
            return `${npc.name} considers you a trusted friend.`
        } else if (npc.reputation > 50) {
            return `${npc.name} regards you with favor.`
        } else if (npc.reputation > 0) {
            return `${npc.name} is warming up to you.`
        } else if (npc.reputation === 0) {
            return `${npc.name} is neutral toward you.`
        } else {
            return `${npc.name} views you with suspicion.`
        }
    }

    if (!isOpen) {
        return null
    }

    return (
        <div className="npc-dialogue-overlay" onClick={onClose}>
            <div
                className="npc-dialogue-menu"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="dialogue-header">
                    <h2 className="npc-name">{npc.name}</h2>
                    <div className="npc-role">
                        {npc.role.charAt(0).toUpperCase() + npc.role.slice(1)}
                    </div>
                    <button
                        className="dialogue-close"
                        onClick={onClose}
                        aria-label="Close dialogue"
                    >
                        ✕
                    </button>
                </div>

                <div className="dialogue-content">
                    {state === 'menu' && (
                        <div className="dialogue-menu-options">
                            <p className="reputation-text">
                                {getRepuationMessage()}
                            </p>
                            <div className="dialogue-buttons">
                                <button
                                    className="dialogue-btn"
                                    onClick={handleGreet}
                                >
                                    Greet
                                </button>
                                <button
                                    className="dialogue-btn"
                                    onClick={handleLearnMore}
                                >
                                    Learn More
                                </button>
                                {npc.isQuestGiver && (
                                    <button
                                        className="dialogue-btn quest-btn"
                                        onClick={handleAskQuests}
                                    >
                                        Ask About Quests
                                    </button>
                                )}
                                <button
                                    className="dialogue-btn cancel-btn"
                                    onClick={onClose}
                                >
                                    Leave
                                </button>
                            </div>
                        </div>
                    )}

                    {state === 'greet' && (
                        <div className="dialogue-text-view">
                            <p className="dialogue-text">{greeting}</p>
                            <button
                                className="dialogue-btn"
                                onClick={handleBack}
                            >
                                Back
                            </button>
                        </div>
                    )}

                    {state === 'backstory' && (
                        <div className="dialogue-text-view">
                            <p className="dialogue-text backstory">
                                {npc.backstory}
                            </p>
                            <button
                                className="dialogue-btn"
                                onClick={handleBack}
                            >
                                Back
                            </button>
                        </div>
                    )}

                    {state === 'quests' && (
                        <div className="quests-view">
                            <h3>Available Quests</h3>
                            {availableQuests.length === 0 ? (
                                <p className="no-quests">
                                    No quests available right now.
                                </p>
                            ) : (
                                <div className="quests-list">
                                    {availableQuests.map((quest) => (
                                        <div
                                            key={quest.id}
                                            className="quest-item"
                                        >
                                            <div className="quest-title">
                                                {quest.title}
                                            </div>
                                            <div className="quest-reward">
                                                XP: {quest.reward.xp} | Gold:{' '}
                                                {quest.reward.gold}
                                            </div>
                                            <button
                                                className="quest-accept-btn"
                                                onClick={() =>
                                                    handleQuestSelect(quest)
                                                }
                                            >
                                                Accept
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <button
                                className="dialogue-btn"
                                onClick={handleBack}
                            >
                                Back
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
