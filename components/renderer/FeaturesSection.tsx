import type { FeaturesProps } from '@/lib/types'
import { isLight, sectionPadding } from './utils'

export function FeaturesSection({ props }: { props: FeaturesProps }) {
  const {
    variant = 'grid-3',
    label,
    title,
    subtitle,
    items,
    style,
  } = props

  const bgColor = style?.bgColor ?? '#111113'
  const textColor = style?.textColor ?? '#FFFFFF'
  const light = isLight(bgColor)

  const sectionStyle: React.CSSProperties = {
    background: bgColor,
    color: textColor,
    padding: sectionPadding(style?.paddingY),
  }

  const gridClass =
    variant === 'grid-2'
      ? 'pf-r-features__grid--2'
      : variant === 'list'
        ? 'pf-r-features__grid--list'
        : 'pf-r-features__grid--3'

  return (
    <section
      className={`pf-r-section pf-r-features${light ? ' pf-r-features--light' : ''}`}
      style={sectionStyle}
    >
      <div className="pf-r-container">
        {/* Header */}
        <div className="pf-r-features__head">
          {label && (
            <p className="pf-r-label" style={{ color: textColor }}>
              {label}
            </p>
          )}
          <h2 className="pf-r-h2" style={{ color: textColor }}>
            {title}
          </h2>
          {subtitle && (
            <p className="pf-r-sub" style={{ color: textColor, opacity: 0.55 }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Grid */}
        <div className={gridClass}>
          {items.map((item, i) => (
            <div key={i} className="pf-r-feature-card">
              <div className="pf-r-feature-icon">{item.icon}</div>
              <div>
                <h3 className="pf-r-h3" style={{ color: textColor }}>
                  {item.title}
                </h3>
                <p className="pf-r-body" style={{ color: textColor }}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
