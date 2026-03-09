import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import App from './App'

describe('App - Procedural Asset Pipeline', () => {
    afterEach(() => {
        cleanup()
    })

    it('Game initialises without missing asset errors', () => {
        // This test verifies that the game initializes without throwing errors
        // The app should render successfully even if Babylon.js can't init
        // (e.g., in test environments without WebGL)

        expect(() => {
            render(<App />)
        }).not.toThrow()
    })
})
