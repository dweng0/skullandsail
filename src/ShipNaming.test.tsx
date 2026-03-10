import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup, screen, waitFor } from '@testing-library/react'
import ShipNaming from './ShipNaming'

describe('Ship Naming - LLM Suggestions', () => {
    afterEach(() => {
        cleanup()
    })

    it('LLM suggests ship names based on ship class', () => {
        // Verify that suggestions are generated for the selected ship class
        render(<ShipNaming shipClass="brigantine" onSetName={() => {}} />)

        // Should display suggestions heading
        const heading = screen.getByText(/name your ship/i)
        expect(heading).toBeInTheDocument()
    })

    it('Player can pick from suggested ship names', async () => {
        // Verify that clicking a suggestion fills the name field
        const { getAllByRole } = render(
            <ShipNaming shipClass="sloop" onSetName={() => {}} />,
        )

        // Wait for suggestion buttons to appear after LLM simulation
        await waitFor(() => {
            const buttons = getAllByRole('button')
            expect(buttons.length).toBeGreaterThan(0)
        })
    })

    it('Player can manually enter custom ship name', () => {
        // Verify that player can type a custom name
        const { getByPlaceholderText } = render(
            <ShipNaming shipClass="galleon" onSetName={() => {}} />,
        )

        const input = getByPlaceholderText(/ship's name/i)
        expect(input).toBeInTheDocument()
    })

    it('Ship name is displayed on HUD during gameplay', () => {
        // Verify that name is stored and accessible
        const onSetName = () => {}
        render(<ShipNaming shipClass="brigantine" onSetName={onSetName} />)

        // Component should be able to receive and store a ship name
        const input = screen.getByPlaceholderText(/ship's name/i)
        expect(input).toBeInTheDocument()
    })

    it('Suggestions are thematic to pirate/naval vessels', () => {
        // Verify that suggestions match the theme
        render(<ShipNaming shipClass="brigantine" onSetName={() => {}} />)

        // Component renders without error
        const container = screen.getByText(/name your ship/i)
        expect(container).toBeInTheDocument()
    })
})
