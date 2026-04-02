'use client'

import { useRef } from 'react'

interface ColorFieldProps {
  label: string
  value?: string
  onChange: (value: string) => void
  hint?: string
}

export function ColorField({ label, value, onChange, hint }: ColorFieldProps) {
  const pickerRef = useRef<HTMLInputElement>(null)
  const hex = value || '#ffffff'

  return (
    <div className="pf-edit-group">
      <label className="pf-edit-group__label">{label}</label>
      <div className="pf-color-field">
        <button
          type="button"
          className="pf-color-field__swatch"
          style={{ background: hex }}
          onClick={() => pickerRef.current?.click()}
          title="Abrir seletor de cor"
        />
        <input
          ref={pickerRef}
          type="color"
          value={hex}
          onChange={(e) => onChange(e.target.value)}
          className="pf-color-field__picker"
          tabIndex={-1}
        />
        <input
          className="pf-edit-input pf-color-field__hex"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#ffffff"
          maxLength={9}
          spellCheck={false}
        />
      </div>
      {hint && <p className="pf-edit-group__hint">{hint}</p>}
    </div>
  )
}
