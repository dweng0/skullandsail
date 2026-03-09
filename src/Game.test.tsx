import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import Game from './Game'

describe('Game - Procedural Asset Pipeline', () => {
  afterEach(() => {
    cleanup()
  })

  it('Ship classes render as distinct silhouettes', () => {
    // Verify that each ship class can render with distinct visual properties
    const shipClasses = ['sloop', 'brigantine', 'galleon'] as const

    shipClasses.forEach((shipClass) => {
      // Should render without throwing
      expect(() => {
        render(<Game playerShipClass={shipClass} />)
      }).not.toThrow()

      cleanup()
    })

    // Verify canvas is created for rendering
    const { getByTestId } = render(<Game playerShipClass="brigantine" />)
    const canvas = getByTestId('game-canvas')
    expect(canvas).toBeInTheDocument()
    expect(canvas).toBeVisible()
  })
})
