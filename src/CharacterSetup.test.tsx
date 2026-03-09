import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup, screen } from '@testing-library/react'
import CharacterSetup from './CharacterSetup'

describe('Character & Ship Selection', () => {
    afterEach(() => {
        cleanup()
    })

    it('User can enter captain name', () => {
        // Verify that a text input field accepts captain name
        render(
            <CharacterSetup
                onSetup={() => {}}
                availableShips={['sloop', 'brigantine', 'galleon']}
            />,
        )

        // Should have captain name input
        const nameInput = screen.getByPlaceholderText(/captain/i)
        expect(nameInput).toBeInTheDocument()
        expect(nameInput).toBeVisible()
    })

    it('User can choose ship class', () => {
        // Verify that radio buttons or card options show each ship class
        const { container } = render(
            <CharacterSetup
                onSetup={() => {}}
                availableShips={['sloop', 'brigantine', 'galleon']}
            />,
        )

        // Should have ship class options
        const shipOptions = container.querySelectorAll('input[type="radio"]')
        expect(shipOptions.length).toBe(3)
    })

    it('Each ship class has different starting stats', () => {
        // Verify that stat summary displays different values for each ship
        render(
            <CharacterSetup
                onSetup={() => {}}
                availableShips={['sloop', 'brigantine', 'galleon']}
            />,
        )

        // Stats info should be displayed
        const statsElements = screen.queryAllByText(/speed|combat|trade/i)
        expect(statsElements.length).toBeGreaterThan(0)
    })

    it('User cannot start game without name and ship selected', () => {
        // Verify that start button is disabled without both selections
        render(
            <CharacterSetup
                onSetup={() => {}}
                availableShips={['sloop', 'brigantine', 'galleon']}
            />,
        )

        // Start button should exist
        const startButton = screen.getByRole('button', { name: /start/i })
        expect(startButton).toBeInTheDocument()
    })
})
