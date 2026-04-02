import type { TestimonialsProps } from '@/lib/types'
import { isLight, sectionPadding, stars } from './utils'

function initials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function TestimonialsSection({ props }: { props: TestimonialsProps }) {
  const { variant = 'grid', label, title, items, style } = props

  const bgColor = style?.bgColor ?? '#0B0B0C'
  const textColor = style?.textColor ?? '#FFFFFF'
  const light = isLight(bgColor)

  const sectionStyle: React.CSSProperties = {
    background: bgColor,
    color: textColor,
    padding: sectionPadding(style?.paddingY),
  }

  /* ── Grid variant ─────────────────────────────────── */
  if (variant === 'grid') {
    return (
      <section
        className={`pf-r-section pf-r-testimonials${light ? ' pf-r-testimonials--light' : ''}`}
        style={sectionStyle}
      >
        <div className="pf-r-container">
          {(label || title) && (
            <div className="pf-r-testimonials__head">
              {label && (
                <p className="pf-r-label" style={{ color: textColor }}>
                  {label}
                </p>
              )}
              {title && (
                <h2 className="pf-r-h2" style={{ color: textColor }}>
                  {title}
                </h2>
              )}
            </div>
          )}

          <div className="pf-r-testimonials__grid">
            {items.map((item, i) => (
              <div key={i} className="pf-r-quote-card">
                {item.rating != null && (
                  <div className="pf-r-quote-card__stars">
                    {stars(item.rating)}
                  </div>
                )}

                <p className="pf-r-quote-card__quote" style={{ color: textColor }}>
                  &ldquo;{item.quote}&rdquo;
                </p>

                <div className="pf-r-quote-card__author">
                  <div
                    className="pf-r-quote-card__avatar"
                    style={{ color: textColor }}
                    aria-hidden="true"
                  >
                    {item.avatarUrl
                      ? <img src={item.avatarUrl} alt={item.authorName} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                      : initials(item.authorName)
                    }
                  </div>
                  <div>
                    <p className="pf-r-quote-card__name" style={{ color: textColor }}>
                      {item.authorName}
                    </p>
                    <p className="pf-r-quote-card__role" style={{ color: textColor }}>
                      {item.authorRole}
                      {item.authorCompany && ` · ${item.authorCompany}`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  /* ── Single variant ───────────────────────────────── */
  const item = items[0]
  if (!item) return null

  return (
    <section
      className={`pf-r-section pf-r-testimonials${light ? ' pf-r-testimonials--light' : ''}`}
      style={sectionStyle}
    >
      <div className="pf-r-container">
        {(label || title) && (
          <div className="pf-r-testimonials__head">
            {label && (
              <p className="pf-r-label" style={{ color: textColor }}>
                {label}
              </p>
            )}
            {title && (
              <h2 className="pf-r-h2" style={{ color: textColor }}>
                {title}
              </h2>
            )}
          </div>
        )}

        <div className="pf-r-testimonials__single">
          <span className="pf-r-testimonials__single-mark" style={{ color: textColor }}>
            &ldquo;
          </span>

          <p
            className="pf-r-testimonials__single-quote"
            style={{ color: textColor }}
          >
            {item.quote}
          </p>

          <div className="pf-r-testimonials__single-author">
            <div
              className="pf-r-testimonials__single-avatar"
              style={{ color: textColor }}
              aria-hidden="true"
            >
              {item.avatarUrl
                ? <img src={item.avatarUrl} alt={item.authorName} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                : initials(item.authorName)
              }
            </div>
            <div className="pf-r-testimonials__single-info">
              <p className="pf-r-quote-card__name" style={{ color: textColor }}>
                {item.authorName}
              </p>
              <p className="pf-r-quote-card__role" style={{ color: textColor }}>
                {item.authorRole}
                {item.authorCompany && ` · ${item.authorCompany}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
