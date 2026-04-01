import type { CTAProps } from '@/lib/types'
import { primaryBtnColors, isLight, sectionPadding } from './utils'

export function CTASection({ props }: { props: CTAProps }) {
  const {
    variant = 'centered',
    headline,
    subheadline,
    primaryCtaText,
    primaryCtaUrl,
    secondaryCtaText,
    secondaryCtaUrl,
    style,
  } = props

  const bgColor = style?.bgColor ?? '#7F77DD'
  const textColor = style?.textColor ?? '#FFFFFF'
  const light = isLight(bgColor)
  const btnPrimary = primaryBtnColors(bgColor)

  const sectionStyle: React.CSSProperties = {
    background: bgColor,
    color: textColor,
    padding: sectionPadding(style?.paddingY),
  }

  const Buttons = (
    <div className="pf-r-btns pf-r-btns--center">
      <a
        href={primaryCtaUrl}
        className="pf-r-btn pf-r-btn--primary"
        style={{ background: btnPrimary.bg, color: btnPrimary.text }}
      >
        {primaryCtaText}
      </a>
      {secondaryCtaText && (
        <a
          href={secondaryCtaUrl ?? '#'}
          className="pf-r-btn pf-r-btn--secondary"
          style={{ color: textColor }}
        >
          {secondaryCtaText}
        </a>
      )}
    </div>
  )

  /* ── Centered ─────────────────────────────────────── */
  if (variant === 'centered') {
    return (
      <section className="pf-r-section pf-r-cta" style={sectionStyle}>
        <div className="pf-r-container pf-r-container--mid">
          <div className="pf-r-cta__inner">
            <h2 className="pf-r-h2" style={{ color: textColor }}>
              {headline}
            </h2>
            {subheadline && (
              <p className="pf-r-sub" style={{ color: textColor, opacity: 0.65 }}>
                {subheadline}
              </p>
            )}
            {Buttons}
          </div>
        </div>
      </section>
    )
  }

  /* ── Card ─────────────────────────────────────────── */
  // The outer section has the page bg; inner card has the accent bg
  const outerBg = light ? '#F8F8F8' : '#0B0B0C'

  return (
    <section
      className={`pf-r-section pf-r-cta pf-r-cta--card${light ? ' pf-r-cta--card-light' : ''}`}
      style={{ background: outerBg, color: textColor, padding: sectionPadding(style?.paddingY) }}
    >
      <div className="pf-r-container pf-r-container--mid">
        <div className="pf-r-cta__inner">
          <div className="pf-r-cta__card" style={{ background: bgColor }}>
            <h2 className="pf-r-h2" style={{ color: textColor }}>
              {headline}
            </h2>
            {subheadline && (
              <p className="pf-r-sub" style={{ color: textColor, opacity: 0.65 }}>
                {subheadline}
              </p>
            )}
            {Buttons}
          </div>
        </div>
      </div>
    </section>
  )
}
