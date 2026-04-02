import type { HeroProps } from '@/lib/types'
import { primaryBtnColors, isLight, sectionPadding } from './utils'

export function HeroSection({ props }: { props: HeroProps }) {
  const {
    variant = 'centered',
    headline,
    subheadline,
    primaryCtaText,
    primaryCtaUrl,
    secondaryCtaText,
    secondaryCtaUrl,
    imageUrl,
    style,
  } = props

  const bgColor = style?.bgColor ?? '#0B0B0C'
  const textColor = style?.textColor ?? '#FFFFFF'
  const light = isLight(bgColor)
  const btnPrimary = primaryBtnColors(bgColor)

  const sectionStyle: React.CSSProperties = {
    background: bgColor,
    color: textColor,
    padding: sectionPadding(style?.paddingY),
  }

  const Buttons = (
    <div className={`pf-r-btns${variant === 'centered' ? ' pf-r-btns--center' : ''}`}>
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
      <section className="pf-r-section pf-r-hero pf-r-hero--centered" style={sectionStyle}>
        <div className="pf-r-container">
          <div className="pf-r-hero__inner">
            <div className="pf-r-hero__text">
              <h1 className="pf-r-h1" style={{ color: textColor }}>
                {headline}
              </h1>
              <p className="pf-r-sub" style={{ color: textColor, opacity: 0.6 }}>
                {subheadline}
              </p>
              {Buttons}
            </div>
          </div>
        </div>
      </section>
    )
  }

  /* ── Split ────────────────────────────────────────── */
  const imgPlaceholder = (
    <div className="pf-r-hero__img">
      {imageUrl
        ? <img src={imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <span style={{ opacity: 0.15, fontSize: 56 }}>🖼</span>
      }
    </div>
  )

  return (
    <section
      className={`pf-r-section pf-r-hero pf-r-hero--split pf-r-hero--${variant}`}
      style={sectionStyle}
    >
      <div className="pf-r-container">
        <div className="pf-r-hero__inner">
          <div className="pf-r-hero__split-grid">
            <div className="pf-r-hero__text">
              <h1 className="pf-r-h1" style={{ color: textColor }}>
                {headline}
              </h1>
              <p className="pf-r-sub" style={{ color: textColor, opacity: 0.6 }}>
                {subheadline}
              </p>
              {Buttons}
            </div>
            {imgPlaceholder}
          </div>
        </div>
      </div>
    </section>
  )
}
