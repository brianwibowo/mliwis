'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, ArrowUp, ArrowDown, Upload, FileText, Image as ImageIcon, Check } from 'lucide-react'
import { createBerita, updateBerita } from './actions'
import { compressImageIfNeeded, convertHeicToJpeg } from '@/lib/utils'
import { useToast } from '@/hooks/useToast'

interface Block {
  id: string
  type: 'text' | 'image'
  value: string
  file?: File
  previewUrl?: string
  fileKey?: string
}

interface BeritaData {
  id: number
  judul: string
  slug: string
  ringkasan: string
  gambarUtama: string | null
  kategori: string
  linkExternal: string | null
  penulis: string
  published: boolean
  konten: Array<{ type: string; value: string }>
}

interface Props {
  initialBerita: BeritaData | null
}

const KATEGORI_OPTIONS = [
  'Kegiatan Pokdarwis',
  'Pengumuman Wisata',
  'Kabar Mliwis',
  'Event & Festival',
  'Lain-lain',
]

export default function BeritaFormClient({ initialBerita }: Props) {
  const router = useRouter()
  const { addToast, removeToast } = useToast()
  const [isPending, startTransition] = useTransition()

  const isEditMode = !!initialBerita

  // Form Fields State
  const [judul, setJudul] = useState(initialBerita?.judul || '')
  const [kategori, setKategori] = useState(initialBerita?.kategori || KATEGORI_OPTIONS[0])
  const [ringkasan, setRingkasan] = useState(initialBerita?.ringkasan || '')
  const [penulis, setPenulis] = useState(initialBerita?.penulis || '')
  const [published, setPublished] = useState(initialBerita?.published || false)
  const [linkExternal, setLinkExternal] = useState(initialBerita?.linkExternal || '')

  // Cover Image State
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string>(initialBerita?.gambarUtama || '')
  const [keepCover, setKeepCover] = useState(true)

  // Dynamic Content Blocks State
  const [blocks, setBlocks] = useState<Block[]>(() => {
    if (initialBerita?.konten) {
      return initialBerita.konten.map((block, index) => ({
        id: `block-${index}-${Date.now()}`,
        type: block.type as 'text' | 'image',
        value: block.value,
      }))
    }
    return [{ id: 'init-0', type: 'text', value: '' }]
  })

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const ext = file.name.split('.').pop()?.toLowerCase()
      const isHeic = ext === 'heic' || ext === 'heif' || file.size > 3 * 1024 * 1024
      let toastId: string | undefined
      if (isHeic) {
        toastId = addToast('Memproses & mengompresi foto dari HP...', 'info')
      }
      try {
        const converted = await convertHeicToJpeg(file)
        setCoverFile(converted)
        setCoverPreview(URL.createObjectURL(converted))
        setKeepCover(true)
        if (toastId) removeToast(toastId)
      } catch {
        if (toastId) removeToast(toastId)
        addToast('Gagal memproses gambar, silakan pilih foto lain', 'error')
      }
    }
  }

  const handleRemoveCover = () => {
    setCoverFile(null)
    setCoverPreview('')
    setKeepCover(false)
  }

  // Block management
  const addTextBlock = () => {
    const newId = `text-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    setBlocks((prev) => [...prev, { id: newId, type: 'text', value: '' }])
  }

  const addImageBlock = () => {
    const rand = Math.random().toString(36).substring(2, 7)
    const newId = `image-${Date.now()}-${rand}`
    setBlocks((prev) => [
      ...prev,
      { id: newId, type: 'image', value: '', fileKey: `block_image_${rand}` },
    ])
  }

  const updateTextBlockValue = (id: string, val: string) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, value: val } : b))
    )
  }

  const handleBlockImageChange = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const ext = file.name.split('.').pop()?.toLowerCase()
      const isHeic = ext === 'heic' || ext === 'heif' || file.size > 3 * 1024 * 1024
      let toastId: string | undefined
      if (isHeic) {
        toastId = addToast('Memproses foto dari HP...', 'info')
      }
      try {
        const converted = await convertHeicToJpeg(file)
        const preview = URL.createObjectURL(converted)
        setBlocks((prev) =>
          prev.map((b) =>
            b.id === id
              ? { ...b, file: converted, previewUrl: preview, value: converted.name }
              : b
          )
        )
        if (toastId) removeToast(toastId)
      } catch {
        if (toastId) removeToast(toastId)
        addToast('Gagal memproses gambar blok', 'error')
      }
    }
  }

  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id))
  }

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === blocks.length - 1) return

    const targetIndex = direction === 'up' ? index - 1 : index + 1
    const newBlocks = [...blocks]
    const temp = newBlocks[index]
    newBlocks[index] = newBlocks[targetIndex]
    newBlocks[targetIndex] = temp
    setBlocks(newBlocks)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!judul || !ringkasan || !penulis) {
      addToast('Harap isi Judul, Ringkasan, dan Penulis', 'error')
      return
    }

    // Client-side file size and type validation
    const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'heic', 'heif', 'webp', 'gif', 'svg', 'bmp', 'tiff']

    if (coverFile) {
      if (coverFile.size > 20 * 1024 * 1024) {
        addToast('Ukuran gambar cover maksimal 20MB', 'error')
        return
      }
      const ext = coverFile.name.split('.').pop()?.toLowerCase() || ''
      if (!allowedExtensions.includes(ext) && !coverFile.type.startsWith('image/')) {
        addToast('Format gambar cover tidak didukung. Gunakan JPG, PNG, WEBP, HEIC, HEIF, dll.', 'error')
        return
      }
    }

    for (let index = 0; index < blocks.length; index++) {
      const b = blocks[index]
      if (b.type === 'image' && b.file) {
        if (b.file.size > 20 * 1024 * 1024) {
          addToast(`Ukuran gambar pada Blok ${index + 1} maksimal 20MB`, 'error')
          return
        }
        const ext = b.file.name.split('.').pop()?.toLowerCase() || ''
        if (!allowedExtensions.includes(ext) && !b.file.type.startsWith('image/')) {
          addToast(`Format gambar pada Blok ${index + 1} tidak didukung.`, 'error')
          return
        }
      }
    }

    const toastId = addToast('Menyimpan berita dan mengunggah gambar...', 'info')

    startTransition(async () => {
      try {
        // Compress cover image if needed (target 800KB limit)
        let finalCoverFile = coverFile
        if (coverFile) {
          finalCoverFile = await compressImageIfNeeded(coverFile, 800 * 1024)
        }

        // Compress block image files if needed (target 800KB limit)
        const finalBlocks = await Promise.all(
          blocks.map(async (b) => {
            if (b.type === 'image' && b.file) {
              const compressed = await compressImageIfNeeded(b.file, 800 * 1024)
              return { ...b, file: compressed }
            }
            return b
          })
        )

        const formData = new FormData()
        formData.append('judul', judul)
        formData.append('kategori', kategori)
        formData.append('ringkasan', ringkasan)
        formData.append('penulis', penulis)
        formData.append('published', String(published))
        formData.append('linkExternal', linkExternal)

        // Handle Cover Image
        if (finalCoverFile) {
          formData.append('gambarUtama', finalCoverFile)
        }
        formData.append('keepGambarUtama', String(keepCover))

        // Serialize Blocks metadata
        const blocksMeta = finalBlocks.map((b) => {
          if (b.type === 'text') {
            return { type: 'text', value: b.value }
          } else {
            return {
              type: 'image',
              value: b.previewUrl ? '' : b.value, // Send old value if no new previewUrl
              fileKey: b.file ? b.fileKey : undefined,
            }
          }
        })

        formData.append('blocksMeta', JSON.stringify(blocksMeta))

        // Append block files using their respective fileKeys
        finalBlocks.forEach((b) => {
          if (b.type === 'image' && b.file && b.fileKey) {
            formData.append(b.fileKey, b.file)
          }
        })

        const res = isEditMode
          ? await updateBerita(initialBerita!.id, formData)
          : await createBerita(formData)

        removeToast(toastId)

        if (res?.error) {
          addToast(res.error, 'error')
        } else {
          addToast(
            isEditMode ? 'Berita berhasil diperbarui dan gambar diunggah!' : 'Berita berhasil dibuat dan gambar diunggah!',
            'success'
          )
          router.push('/berita-admin')
          router.refresh()
        }
      } catch (err: any) {
        removeToast(toastId)
        console.error('Client action error:', err)
        addToast(err.message || 'Terjadi kesalahan jaringan atau sistem saat menyimpan berita', 'error')
      }
    })
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div className="page-header-left" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/berita-admin" className="btn btn-ghost btn-sm btn-icon" style={{ borderRadius: '50%' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1>{isEditMode ? 'Edit Berita' : 'Tulis Berita Baru'}</h1>
            <p>{isEditMode ? 'Sunting konten berita yang sudah ada' : 'Buat postingan berita atau kegiatan baru'}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'start' }}>
          
          {/* Main Content Side */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Basic Info Card */}
            <div className="card" style={{ borderRadius: '16px', border: '1px solid var(--color-border-subtle)' }}>
              <div className="card-body" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--color-primary-900)' }}>Informasi Utama</h3>
                
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Judul Berita <span className="required">*</span></label>
                  <input
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                    className="form-input"
                    placeholder="Masukkan judul berita yang menarik..."
                    required
                  />
                </div>

                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Kategori <span className="required">*</span></label>
                    <select
                      value={kategori}
                      onChange={(e) => setKategori(e.target.value)}
                      className="form-select"
                      required
                    >
                      {KATEGORI_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Penulis <span className="required">*</span></label>
                    <input
                      value={penulis}
                      onChange={(e) => setPenulis(e.target.value)}
                      className="form-input"
                      placeholder="Nama penulis..."
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Ringkasan Singkat <span className="required">*</span></label>
                  <textarea
                    value={ringkasan}
                    onChange={(e) => setRingkasan(e.target.value)}
                    className="form-input"
                    placeholder="Tulis ringkasan berita satu atau dua kalimat untuk kartu halaman utama..."
                    rows={3}
                    style={{ resize: 'vertical' }}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Content Builder Card */}
            <div className="card" style={{ borderRadius: '16px', border: '1px solid var(--color-border-subtle)' }}>
              <div className="card-body" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary-900)', margin: 0 }}>Isi Konten Berita (Dinamis)</h3>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="button" className="btn btn-outline btn-sm" onClick={addTextBlock} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Plus size={14} /> Teks
                    </button>
                    <button type="button" className="btn btn-outline btn-sm" onClick={addImageBlock} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Plus size={14} /> Gambar
                    </button>
                  </div>
                </div>

                {blocks.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', border: '2px dashed var(--color-border)', borderRadius: '12px', color: 'var(--color-text-muted)' }}>
                    Belum ada blok konten. Tambahkan blok teks atau gambar untuk memulai menulis konten berita.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {blocks.map((block, index) => (
                      <div
                        key={block.id}
                        style={{
                          border: '1px solid var(--color-border-subtle)',
                          borderRadius: '12px',
                          padding: '16px',
                          backgroundColor: 'var(--color-surface-alt)',
                          position: 'relative',
                        }}
                      >
                        {/* Block Controls Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase' }}>
                            {block.type === 'text' ? <FileText size={14} /> : <ImageIcon size={14} />}
                            <span>Blok {index + 1}: {block.type === 'text' ? 'Teks' : 'Gambar'}</span>
                          </span>
                          
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                              type="button"
                              onClick={() => moveBlock(index, 'up')}
                              disabled={index === 0}
                              className="btn btn-ghost btn-sm btn-icon"
                              title="Pindahkan ke atas"
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveBlock(index, 'down')}
                              disabled={index === blocks.length - 1}
                              className="btn btn-ghost btn-sm btn-icon"
                              title="Pindahkan ke bawah"
                            >
                              <ArrowDown size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeBlock(block.id)}
                              className="btn btn-ghost btn-sm btn-icon text-danger"
                              title="Hapus blok"
                              style={{ marginLeft: '8px' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Block Body */}
                        {block.type === 'text' ? (
                          <textarea
                            value={block.value}
                            onChange={(e) => updateTextBlockValue(block.id, e.target.value)}
                            placeholder="Tulis paragraf berita di sini..."
                            className="form-input"
                            rows={4}
                            style={{ resize: 'vertical', backgroundColor: 'white' }}
                          />
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {(block.previewUrl || block.value) ? (
                              <div style={{ position: 'relative', width: '100%', maxHeight: '240px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                                <img
                                  src={block.previewUrl || block.value}
                                  alt="Preview block"
                                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                />
                              </div>
                            ) : null}
                            
                            <label
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                padding: '12px',
                                border: '1px dashed var(--color-primary-300)',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                backgroundColor: 'white',
                                color: 'var(--color-primary-700)',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                              }}
                            >
                              <Upload size={16} />
                              <span>{block.value ? 'Ganti Gambar Blok' : 'Pilih Gambar Blok'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleBlockImageChange(block.id, e)}
                                style={{ display: 'none' }}
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Status & Settings Card */}
            <div className="card" style={{ borderRadius: '16px', border: '1px solid var(--color-border-subtle)' }}>
              <div className="card-body" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--color-primary-900)' }}>Pengaturan Publikasi</h3>

                <div className="form-group" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <label className="form-label" style={{ marginBottom: 2 }}>Publikasikan Segera</label>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Berita langsung terlihat di web publik</span>
                  </div>
                  <label className="switch" style={{ position: 'relative', display: 'inline-block', width: 44, height: 24 }}>
                    <input
                      type="checkbox"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: published ? 'var(--color-primary-600)' : '#ccc',
                        borderRadius: 24,
                        transition: '0.3s',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          content: '""',
                          height: 18, width: 18,
                          left: published ? 22 : 4,
                          bottom: 3,
                          backgroundColor: 'white',
                          borderRadius: '50%',
                          transition: '0.3s',
                        }}
                      />
                    </span>
                  </label>
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Link Eksternal (Opsional)</label>
                  <input
                    value={linkExternal}
                    onChange={(e) => setLinkExternal(e.target.value)}
                    className="form-input"
                    placeholder="Contoh: https://youtube.com/..."
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 4, display: 'block' }}>
                    Tautkan ke video liputan Youtube atau berita media luar jika ada.
                  </span>
                </div>
              </div>
            </div>

            {/* Cover Image Card */}
            <div className="card" style={{ borderRadius: '16px', border: '1px solid var(--color-border-subtle)' }}>
              <div className="card-body" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--color-primary-900)' }}>Gambar Utama / Cover</h3>

                {coverPreview ? (
                  <div style={{ position: 'relative', marginBottom: '16px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                    <img src={coverPreview} alt="Cover preview" style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={handleRemoveCover}
                      className="btn btn-ghost btn-sm btn-icon text-danger"
                      style={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'white', borderRadius: '50%', boxShadow: 'var(--shadow-sm)' }}
                      title="Hapus Cover"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ) : (
                  <div style={{ height: '160px', border: '2px dashed var(--color-border)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                    <ImageIcon size={32} />
                    <span style={{ fontSize: '0.8rem' }}>Belum ada cover</span>
                  </div>
                )}

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px',
                    border: '1px solid var(--color-primary-600)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    color: 'var(--color-primary-700)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    textAlign: 'center',
                  }}
                >
                  <Upload size={16} />
                  <span>Pilih Gambar Cover</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverChange}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>

            {/* Save Button Card */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <Link href="/berita-admin" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>
                Batal
              </Link>
              <button
                type="submit"
                disabled={isPending}
                className="btn btn-primary"
                style={{ flex: 2, justifyContent: 'center' }}
              >
                {isPending ? 'Menyimpan...' : 'Simpan Postingan'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
