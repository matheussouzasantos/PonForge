/**
 * Returns a 0–1 luminance value for a hex color string.
 * Used to decide whether to use dark or light contrasting elements.
 */
export function luminance(hex: string): number {
  const clean = hex.replace('#', '')
  if (clean.length !== 6) return 0
  const r = parseInt(clean.slice(0, 2), 16) / 255
  const g = parseInt(clean.slice(2, 4), 16) / 255
  const b = parseInt(clean.slice(4, 6), 16) / 255
  return 0.299 * r + 0.587 * g + 0.114 * b
}

export function isLight(hex: string): boolean {
  return luminance(hex) > 0.5
}

/**
 * Given a section background color, returns the ideal
 * primary button background and text colors.
 */
export function primaryBtnColors(bgHex = '#0B0B0C') {
  const light = isLight(bgHex)
  return {
    bg: light ? '#0A0A0A' : '#FFFFFF',
    text: light ? '#FFFFFF' : '#0A0A0A',
  }
}

/**
 * Returns a muted variant of textColor (for subheadlines, descriptions).
 * Simply applies opacity via a wrapper style.
 */
export function muteStyle(textColor = '#FFFFFF'): React.CSSProperties {
  return { color: textColor, opacity: 0.6 }
}

/** Padding values for paddingY tokens */
export const PADDING_Y: Record<string, string> = {
  sm: '56px 0',
  md: '96px 0',
  lg: '128px 0',
  xl: '160px 0',
}

export function sectionPadding(paddingY?: string): string {
  return PADDING_Y[paddingY ?? 'md']
}

/** Star rating helper */
export function stars(count: number): string {
  return '★'.repeat(Math.min(5, Math.max(0, count))) +
         '☆'.repeat(5 - Math.min(5, Math.max(0, count)))
}
