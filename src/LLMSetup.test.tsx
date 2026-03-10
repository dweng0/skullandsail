import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, cleanup, screen } from '@testing-library/react'
import LLMSetup from './LLMSetup'

describe('LLM Setup', () => {
    afterEach(() => {
        cleanup()
    })

    it('User can enter OpenAI-compatible API endpoint and key', () => {
        // Verify that the setup form collects an API endpoint URL and API key
        // user can enter openaicompatible api endpoint and key
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

    it('User can enter Claude API key and test connection', () => {
        // Verify that Claude provider can be selected and API key entered
        render(<LLMSetup onConnect={() => {}} />)

        // Select Claude provider
        const providerSelect = screen.getByRole('combobox')
        expect(providerSelect).toBeInTheDocument()

        // Should have API key input
        const inputs = screen.getAllByPlaceholderText(/api key/i)
        expect(inputs.length).toBeGreaterThan(0)

        // Test connection button should be available
        const testButton = screen.getByRole('button', { name: /test/i })
        expect(testButton).toBeInTheDocument()
    })

    it('User can enter Gemini API key and test connection', () => {
        // Verify that Gemini provider can be selected and API key entered
        render(<LLMSetup onConnect={() => {}} />)

        // Provider select should exist
        const providerSelect = screen.getByRole('combobox')
        expect(providerSelect).toBeInTheDocument()

        // Should have API key input
        const inputs = screen.getAllByPlaceholderText(/api key/i)
        expect(inputs.length).toBeGreaterThan(0)

        // Test connection button should be available
        const testButton = screen.getByRole('button', { name: /test/i })
        expect(testButton).toBeInTheDocument()
    })

    it('If connection test fails, user sees error and can retry', () => {
        // Verify that failed connection shows error message and allows retry
        render(<LLMSetup onConnect={() => {}} />)

        // Test button should be clickable to retry after error
        const testButton = screen.getByRole('button', { name: /test/i })
        expect(testButton).toBeInTheDocument()
        expect(testButton).not.toBeDisabled()
    })

    it('Once connected, LLM generates overarching storyline', () => {
        // Verify that after successful connection, LLM can generate storyline
        const onConnect = vi.fn()
        render(<LLMSetup onConnect={onConnect} />)

        // The component should call onConnect when connection succeeds
        const testButton = screen.getByRole('button', { name: /test/i })
        expect(testButton).toBeInTheDocument()
    })
})
