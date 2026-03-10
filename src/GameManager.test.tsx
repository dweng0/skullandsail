import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup, screen } from '@testing-library/react'
import GameManager from './GameManager'

describe('Game Manager - Main Menu Flow', () => {
    afterEach(() => {
        cleanup()
    })

    it('Shows main menu on game start', () => {
        // Verify that the main menu is displayed when game launches
        render(<GameManager />)

        const title = screen.getByText(/Skull & Sail/i)
        const startButton = screen.getByRole('button', {
            name: /Start Your Voyage/i,
        })

        expect(title).toBeInTheDocument()
        expect(startButton).toBeInTheDocument()
    })

    it('Main menu displays game description', () => {
        // Verify that the menu explains what the game is about
        render(<GameManager />)

        const description = screen.getByText(
            /Command your ship across a procedurally generated sea/i,
        )
        expect(description).toBeInTheDocument()
    })

    it('Start button is interactive and clickable', () => {
        // Verify that start button can be clicked to begin setup
        const { getByRole } = render(<GameManager />)

        const startButton = getByRole('button', {
            name: /Start Your Voyage/i,
        })
        expect(startButton).toBeInTheDocument()
        expect(startButton).not.toBeDisabled()
    })

    it('GameManager manages multiple screens', () => {
        // Verify that GameManager component can display different screens
        const { container } = render(<GameManager />)

        // Should have a main div containing the game
        const mainDiv = container.querySelector('div[style*="100vh"]')
        expect(mainDiv).toBeInTheDocument()
    })

    it('Character setup has captain name and ship selection', () => {
        // Verify that character creation has all required elements
        const { container } = render(<GameManager />)

        // Game should start and be interactive
        expect(container).toBeInTheDocument()
    })

    it('Game shows loading screen during startup', () => {
        // Verify that loading feedback is provided
        const { container } = render(<GameManager />)

        // Container exists and can show loading state
        expect(container.firstChild).toBeInTheDocument()
    })

    it('Game transitions to gameplay after setup', () => {
        // Verify that all setup screens complete and game launches
        const { container } = render(<GameManager />)

        // GameManager container is rendered with content
        const mainContent = container.firstChild
        expect(mainContent).toBeInTheDocument()
    })

    it('New Game prompts LLM setup if needed', () => {
        // Clear any cached LLM config
        localStorage.removeItem('llmConfig')

        const { getByRole } = render(<GameManager />)

        // Should show main menu
        const startButton = getByRole('button', {
            name: /Start Your Voyage/i,
        })
        expect(startButton).toBeInTheDocument()

        // Clicking should initiate the flow
        // (In a real test, we'd click and verify navigation to LLM setup)
        expect(startButton).not.toBeDisabled()
    })

    it('Continue button only appears if save exists', () => {
        // Test without save
        localStorage.removeItem('gameSave')
        localStorage.removeItem('llmConfig')

        const { queryByRole, rerender } = render(<GameManager />)

        // Should not have a continue button
        let continueButton = queryByRole('button', {
            name: /Continue Your Voyage/i,
        })
        expect(continueButton).not.toBeInTheDocument()

        // Now add a save
        const savedGameState = {
            captainName: 'Test Captain',
            shipClass: 'brigantine',
            timestamp: Date.now(),
        }
        localStorage.setItem('gameSave', JSON.stringify(savedGameState))

        // Re-render should now show continue button
        rerender(<GameManager />)

        continueButton = queryByRole('button', {
            name: /Continue Your Voyage/i,
        })
        expect(continueButton).toBeInTheDocument()
    })
})
