import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup, screen } from '@testing-library/react'
import LLMSetup from './LLMSetup'

describe('LLM Setup', () => {
    afterEach(() => {
        cleanup()
    })

    it('User can enter OpenAI-compatible API endpoint and key', () => {
        // Verify that the setup form collects an API endpoint URL and API key
        const { container } = render(<LLMSetup onConnect={() => {}} />)

        // Should have input fields for endpoint and key
        const inputs = container.querySelectorAll('input')
        expect(inputs.length).toBeGreaterThanOrEqual(2)

        // Should have a test connection button
        const testButton = screen.getByRole('button', { name: /test/i })
        expect(testButton).toBeInTheDocument()

        // Provider select should exist and show OpenAI option
        const providerSelect = screen.getByRole('combobox')
        expect(providerSelect).toBeInTheDocument()
    })
})
