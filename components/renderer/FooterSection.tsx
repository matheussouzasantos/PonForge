import type { FooterProps } from '@/lib/types'
import { isLight, sectionPadding } from './utils'

export function FooterSection({ props }: { props: FooterProps }) {
  const { logo, tagline, columns, copyright, bottomLinks, style } = props

  const bgColor = style?.bgColor ?? '#0B0B0C'
  const textColor = style?.textColor ?? '#FFFFFF'
  const light = isLight(bgColor)

  const sectionStyle: React.CSSProperties = {
    background: bgColor,
    color: textColor,
    padding: sectionPadding(style?.paddingY),
  }

  return (
    <footer
      className={`pf-r-section pf-r-footer${light ? ' pf-r-footer--light' : ''}`}
      style={sectionStyle}
    >
      <div className="pf-r-container">
        <div className="pf-r-footer__inner">
          {/* Top: brand + columns */}
          <div className="pf-r-footer__top">
            <div>
              {logo
                ? <img src={logo} alt="logo" className="pf-r-footer__brand-logo" />
                : <p className="pf-r-footer__brand-logo" style={{ color: textColor }}>●</p>
              }
              {tagline && (
                <p className="pf-r-footer__brand-tagline" style={{ color: textColor }}>
                  {tagline}
                </p>
              )}
            </div>

            <div className="pf-r-footer__cols">
              {columns.map((col, i) => (
                <div key={i} className="pf-r-footer__col">
                  <p className="pf-r-footer__col-title" style={{ color: textColor }}>
                    {col.title}
                  </p>
                  <ul className="pf-r-footer__col-links">
                    {col.links.map((link, j) => (
                      <li key={j}>
                        <a
                          href={link.href}
                          className="pf-r-footer__link"
                          style={{ color: textColor }}
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom: copyright + links */}
          <div className="pf-r-footer__bottom">
            <p className="pf-r-footer__copyright" style={{ color: textColor }}>
              {copyright}
            </p>
            {bottomLinks && bottomLinks.length > 0 && (
              <div className="pf-r-footer__bottom-links">
                {bottomLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.href}
                    className="pf-r-footer__bottom-link"
                    style={{ color: textColor }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
