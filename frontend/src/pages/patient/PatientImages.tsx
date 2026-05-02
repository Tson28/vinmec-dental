import { useState, useRef } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { imageApi } from '../../services/api'
import { useApi } from '../../hooks/useApi'
import type { DentalImage } from '../../types'

export default function PatientImages() {
  const { data: images, loading, refetch } = useApi<DentalImage[]>(() => imageApi.getMine())
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<DentalImage | null>(null)
  const [uploadType, setUploadType] = useState<'xray' | 'photo' | 'scan'>('photo')
  const [description, setDescription] = useState('')
  const [showUploadPanel, setShowUploadPanel] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('image', file)
    fd.append('type', uploadType)
    fd.append('description', description)
    try {
      await imageApi.upload(fd)
      refetch()
      setShowUploadPanel(false)
      setDescription('')
    } catch (err) {
      console.error(err)
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return
    await imageApi.delete(id)
    refetch()
  }

  const typeIcon: Record<string, string> = { xray: '🦴', photo: '📷', scan: '🔬' }
  const typeLabel: Record<string, string> = { xray: 'X-Ray', photo: 'Photo', scan: 'Scan' }

  return (
    <DashboardLayout title="My Images">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-xl text-surface-900">My Dental Images</h2>
            <p className="text-sm text-surface-500">{(images || []).length} images uploaded</p>
          </div>
          <button onClick={() => setShowUploadPanel(!showUploadPanel)} className="btn-primary">
            {showUploadPanel ? 'Cancel' : '+ Upload Image'}
          </button>
        </div>

        {/* Upload Panel */}
        {showUploadPanel && (
          <div className="card border-dental-200 bg-dental-50 animate-slide-up">
            <h3 className="font-bold text-surface-800 mb-4">Upload New Image</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="label">Image Type</label>
                <select className="input" value={uploadType} onChange={e => setUploadType(e.target.value as any)}>
                  <option value="photo">📷 Photo</option>
                  <option value="xray">🦴 X-Ray</option>
                  <option value="scan">🔬 Scan</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="label">Description (optional)</label>
                <input className="input" placeholder="e.g. Front teeth photo, upper jaw x-ray..." value={description} onChange={e => setDescription(e.target.value)} />
              </div>
            </div>
            <div
              className="border-2 border-dashed border-dental-300 rounded-xl p-8 text-center cursor-pointer hover:bg-dental-100 transition"
              onClick={() => fileRef.current?.click()}
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-2 border-dental-400 border-t-dental-600 rounded-full animate-spin" />
                  <p className="text-sm text-dental-600 font-medium">Uploading...</p>
                </div>
              ) : (
                <>
                  <p className="text-3xl mb-2">📁</p>
                  <p className="text-sm font-semibold text-dental-700">Click to select image</p>
                  <p className="text-xs text-surface-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </div>
        )}

        {/* Gallery */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton aspect-square rounded-xl" />
            ))}
          </div>
        ) : (images || []).length === 0 ? (
          <div className="card text-center py-16">
            <p className="text-5xl mb-3">🖼️</p>
            <p className="font-semibold text-surface-700">No images yet</p>
            <p className="text-sm text-surface-400 mt-1">Upload your first dental image to get started</p>
            <button onClick={() => setShowUploadPanel(true)} className="btn-primary mt-4">Upload Image</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {(images || []).map(img => (
              <div key={img.id} className="group relative aspect-square bg-surface-100 rounded-xl overflow-hidden">
                <img
                  src={img.url}
                  alt={img.description || 'Dental image'}
                  className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300"
                  onClick={() => setPreview(img)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3">
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="self-end w-7 h-7 bg-red-500 text-white rounded-lg flex items-center justify-center text-xs hover:bg-red-600 transition"
                  >✕</button>
                  <div>
                    <p className="text-white text-xs font-semibold">{typeIcon[img.type]} {typeLabel[img.type]}</p>
                    <p className="text-white/70 text-[10px]">{img.uploadedAt?.split('T')[0]}</p>
                    {img.description && <p className="text-white/70 text-[10px] truncate">{img.description}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Preview */}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-surface-900/90 backdrop-blur-sm p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={preview.url}
              alt={preview.description}
              className="w-full max-h-[65vh] object-contain bg-surface-900"
            />
            <div className="p-5 flex items-center justify-between">
              <div>
                <p className="font-bold text-surface-800">{typeIcon[preview.type]} {typeLabel[preview.type]}</p>
                <p className="text-sm text-surface-500">{preview.uploadedAt?.split('T')[0]}</p>
                {preview.description && <p className="text-sm text-surface-600 mt-1">{preview.description}</p>}
              </div>
              <button onClick={() => setPreview(null)} className="btn-secondary">Close</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}