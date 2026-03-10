import { useEffect, useState } from 'react'
import './NarrativePanel.css'

interface NarrativePanelProps {
    narrative: string
    speaker: string
    isVisible: boolean
    onClose: () => void
    displayMode?: 'instant' | 'typewriter' | 'fade'
    displaySpeed?: number // ms per character for typewriter mode
}

export default function NarrativePanel({
    narrative,
    speaker,
    isVisible,
    onClose,
    displayMode = 'fade',
    displaySpeed = 30,
}: NarrativePanelProps) {
    const [displayedText, setDisplayedText] = useState('')
    const [isAnimating, setIsAnimating] = useState(false)

    // Handle ESC key
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isVisible) {
                onClose()
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [isVisible, onClose])

    // Handle typewriter animation
    useEffect(() => {
        if (!isVisible) {
            setDisplayedText('')
            return
        }

        if (displayMode === 'instant') {
            setDisplayedText(narrative)
            setIsAnimating(false)
            return
        }

        if (displayMode === 'typewriter') {
            setIsAnimating(true)
            let currentIndex = 0
            setDisplayedText('')

            const interval = setInterval(() => {
                if (currentIndex < narrative.length) {
                    setDisplayedText(narrative.substring(0, currentIndex + 1))
                    currentIndex++
                } else {
                    clearInterval(interval)
                    setIsAnimating(false)
                }
            }, displaySpeed)

            return () => clearInterval(interval)
        }

        // Fade mode
        setDisplayedText(narrative)
        setIsAnimating(true)
    }, [isVisible, narrative, displayMode, displaySpeed])

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    return (
        <>
            {isVisible && (
                <div className="narrative-overlay" onClick={handleOverlayClick}>
                    <div
                        className={`narrative-panel mode-${displayMode} ${
                            isVisible && !isAnimating ? 'fade-in' : ''
                        } ${!isVisible ? 'hidden' : ''}`}
                    >
                        <div className="narrative-header">
                            <div className="narrative-speaker">{speaker}</div>
                            <button
                                className="narrative-close-btn"
                                onClick={onClose}
                                aria-label="Close narrative"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="narrative-content">
                            <p className="narrative-text">
                                {displayedText}
                                {isAnimating &&
                                    displayMode === 'typewriter' && (
                                        <span className="narrative-cursor">
                                            |
                                        </span>
                                    )}
                            </p>
                        </div>

                        <div className="narrative-footer">
                            <small>
                                {displayMode === 'typewriter' && isAnimating
                                    ? 'Typing...'
                                    : 'Click to close or press ESC'}
                            </small>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
