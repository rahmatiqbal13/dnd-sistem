import { describe, expect, it } from 'vitest'
import { THEMES, contrastRatio, readableTextOn } from '@/lib/themes'

describe('theme contrast', () => {
  it('matches the WCAG reference values', () => {
    expect(contrastRatio('#ffffff', '#000000')).toBeCloseTo(21, 1)
    expect(contrastRatio('#ffffff', '#d4980a')).toBeCloseTo(2.53, 2)
  })

  it.each(THEMES.map((t) => [t.id, t.colors.gold]))('text on the %s gold fill meets AA', (_, gold) => {
    expect(contrastRatio(readableTextOn(gold), gold)).toBeGreaterThanOrEqual(4.5)
  })
})
