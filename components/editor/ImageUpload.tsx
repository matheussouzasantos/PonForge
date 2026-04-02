'use client'

import { useRef, useState } from 'react'
import { Upload, X, ImageIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const BUCKET = 'section-images'

interface ImageUploadProps {
  label: string
  value?: string
  onChange: (url: string) => void
  projectId: string
  /** Identificador do campo, ex: 'hero-image'. Compõe o path no Storage. */
  fieldKey: string
  hint?: string
}

export function ImageUpload({ label, value, onChange, projectId, fieldKey, hint }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setUploading(true)
    setError(null)
    try {
      const ext = file.name.split('.').pop() ?? 'jpg'
      const path = `${projectId}/${fieldKey}-${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: true, contentType: file.type })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
      onChange(data.publicUrl)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro ao enviar imagem')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="pf-edit-group">
      <label className="pf-edit-group__label">{label}</label>

      <div className="pf-img-upload">
        {value ? (
          <div className="pf-img-upload__preview">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="preview" className="pf-img-upload__img" />
            <div className="pf-img-upload__overlay">
              <button
                type="button"
                className="pf-img-upload__action"
                onClick={() => inputRef.current?.click()}
                title="Trocar imagem"
              >
                <Upload size={13} />
                <span>Trocar</span>
              </button>
              <button
                type="button"
                className="pf-img-upload__action pf-img-upload__action--danger"
                onClick={() => onChange('')}
                title="Remover imagem"
              >
                <X size={13} />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="pf-img-upload__dropzone"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <span className="pf-img-upload__uploading">Enviando…</span>
            ) : (
              <>
                <ImageIcon size={18} className="pf-img-upload__icon" />
                <span className="pf-img-upload__label">Clique para enviar</span>
                <span className="pf-img-upload__hint-sm">PNG, JPG, WEBP até 5 MB</span>
              </>
            )}
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="pf-img-upload__input"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
            e.target.value = ''
          }}
        />
      </div>

      {error && <p className="pf-edit-group__hint" style={{ color: '#EF4444' }}>{error}</p>}
      {hint && <p className="pf-edit-group__hint">{hint}</p>}
    </div>
  )
}
