'use client'

import { useState, useTransition, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Banknote, Landmark, User, ChevronLeft, ChevronRight, X, Trash2, Upload } from 'lucide-react'
import { formatRupiah, formatTanggal } from '@/lib/format'
import { deleteProgramKerja, deleteDokumentasi } from '../actions'
import { useToast } from '@/hooks/useToast'
import Modal from '@/components/ui/Modal'

interface Dokumentasi {
  id: number
  filePath: string
  namaFile: string
  createdAt: string
}

interface ProgramKerjaDetail {
  id: number
  namaKegiatan: string
  tanggalKegiatan: string
  jumlahDana: number
  sumberDana: string
  statusKegiatan: string
  dokumentasi: Dokumentasi[]
  user: { namaLengkap: string }
  createdAt: string
  updatedAt: string
}

interface Props {
  data: ProgramKerjaDetail
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'Rencana': return 'badge-warning'
    case 'Berjalan': return 'badge-info'
    case 'Selesai': return 'badge-success'
    default: return 'badge-default'
  }
}

function isImageFile(filePath: string): boolean {
  const lower = filePath.toLowerCase()
  return lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png') || lower.endsWith('.webp') || lower.endsWith('.gif') || lower.endsWith('.heic') || lower.endsWith('.heif') || lower.includes('image')
}

export default function DetailClient({ data }: Props) {
  const router = useRouter()
  const { addToast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showLightbox, setShowLightbox] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [deleteDocId, setDeleteDocId] = useState<number | null>(null)

  // Filter only image dokumentasi for carousel
  const images = data.dokumentasi.filter(d => isImageFile(d.filePath) || isImageFile(d.namaFile))
  const nonImages = data.dokumentasi.filter(d => !isImageFile(d.filePath) && !isImageFile(d.namaFile))

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index)
    setShowLightbox(true)
  }, [])

  const prevImage = useCallback(() => {
    setLightboxIndex(prev => (prev - 1 + images.length) % images.length)
  }, [images.length])

  const nextImage = useCallback(() => {
    setLightboxIndex(prev => (prev + 1) % images.length)
  }, [images.length])

  const handleDelete = () => {
    startTransition(async () => {
      const r = await deleteProgramKerja(data.id)
      if (r.error) addToast(r.error, 'error')
      else {
        addToast('Program kerja dihapus', 'success')
        router.push('/program-kerja')
      }
    })
  }

  const handleDeleteDoc = () => {
    if (!deleteDocId) return
    startTransition(async () => {
      const r = await deleteDokumentasi(deleteDocId)
      if (r.error) addToast(r.error, 'error')
      else {
        addToast('Dokumentasi dihapus', 'success')
        router.refresh()
      }
      setDeleteDocId(null)
    })
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <div>
            <h1>{data.namaKegiatan}</h1>
            <p>Detail Program Kerja Pokdarwis</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/program-kerja" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={16} />
            <span>Kembali</span>
          </Link>
          <button className="btn btn-danger" onClick={() => setShowDeleteModal(true)}>
            <Trash2 size={16} /> Hapus
          </button>
        </div>
      </div>

      {/* Detail Info Cards */}
      <div className="detail-grid">
        <div className="detail-card">
          <div className="detail-card-icon blue"><Calendar size={20} /></div>
          <div>
            <div className="detail-card-label">Tanggal Kegiatan</div>
            <div className="detail-card-value">{formatTanggal(data.tanggalKegiatan)}</div>
          </div>
        </div>
        <div className="detail-card">
          <div className="detail-card-icon green"><Banknote size={20} /></div>
          <div>
            <div className="detail-card-label">Jumlah Dana</div>
            <div className="detail-card-value">{formatRupiah(data.jumlahDana)}</div>
          </div>
        </div>
        <div className="detail-card">
          <div className="detail-card-icon purple"><Landmark size={20} /></div>
          <div>
            <div className="detail-card-label">Sumber Dana</div>
            <div className="detail-card-value">{data.sumberDana}</div>
          </div>
        </div>
        <div className="detail-card">
          <div className="detail-card-icon gray"><User size={20} /></div>
          <div>
            <div className="detail-card-label">Dicatat oleh</div>
            <div className="detail-card-value">{data.user.namaLengkap}</div>
          </div>
        </div>
      </div>

      <div className="card mb-6" style={{ padding: '1.25rem' }}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-sm text-muted">Status Kegiatan:</span>
          <span className={`badge ${getStatusBadgeClass(data.statusKegiatan)}`} style={{ fontSize: '0.875rem' }}>
            {data.statusKegiatan}
          </span>
        </div>
      </div>

      {/* Dokumentasi Section */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>
            Dokumentasi ({data.dokumentasi.length})
          </h3>
        </div>

        {data.dokumentasi.length === 0 ? (
          <div className="empty-state" style={{ padding: 40 }}>
            <Upload size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
            <p className="empty-state-title">Belum ada dokumentasi</p>
            <p className="text-sm text-muted">Upload dokumentasi melalui menu edit program kerja</p>
          </div>
        ) : (
          <>
            {/* Image Gallery/Carousel */}
            {images.length > 0 && (
              <div className="image-gallery">
                {images.map((img, index) => (
                  <div
                    key={img.id}
                    className="image-gallery-item"
                    onClick={() => openLightbox(index)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && openLightbox(index)}
                  >
                    <img
                      src={img.filePath}
                      alt={img.namaFile}
                      loading="lazy"
                    />
                    <div className="image-gallery-overlay">
                      <span>{img.namaFile}</span>
                    </div>
                    <button
                      className="image-gallery-delete"
                      onClick={(e) => { e.stopPropagation(); setDeleteDocId(img.id) }}
                      title="Hapus"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Non-image files */}
            {nonImages.length > 0 && (
              <div className="file-list" style={{ marginTop: images.length > 0 ? 16 : 0 }}>
                {nonImages.map((doc) => (
                  <div key={doc.id} className="file-item">
                    <a href={doc.filePath} target="_blank" rel="noopener noreferrer" className="file-item-name">
                      {doc.namaFile}
                    </a>
                    <button className="file-item-remove" onClick={() => setDeleteDocId(doc.id)} title="Hapus">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox / Image Carousel */}
      {showLightbox && images.length > 0 && (
        <div className="lightbox-overlay" onClick={() => setShowLightbox(false)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setShowLightbox(false)}>
              <X size={24} />
            </button>

            {images.length > 1 && (
              <button className="lightbox-nav lightbox-prev" onClick={prevImage}>
                <ChevronLeft size={32} />
              </button>
            )}

            <div className="lightbox-image-wrapper">
              <img
                src={images[lightboxIndex].filePath}
                alt={images[lightboxIndex].namaFile}
              />
            </div>

            {images.length > 1 && (
              <button className="lightbox-nav lightbox-next" onClick={nextImage}>
                <ChevronRight size={32} />
              </button>
            )}

            <div className="lightbox-info">
              <span className="lightbox-counter">{lightboxIndex + 1} / {images.length}</span>
              <span className="lightbox-filename">{images[lightboxIndex].namaFile}</span>
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="lightbox-thumbnails">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    className={`lightbox-thumb ${i === lightboxIndex ? 'active' : ''}`}
                    onClick={() => setLightboxIndex(i)}
                  >
                    <img src={img.filePath} alt={img.namaFile} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Hapus Program Kerja */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Hapus Program Kerja" size="sm">
        <p>Yakin hapus program kerja <strong>{data.namaKegiatan}</strong>? Semua dokumentasi akan ikut terhapus.</p>
        <div className="flex-end gap-3 mt-6">
          <button className="btn btn-ghost" onClick={() => setShowDeleteModal(false)}>Batal</button>
          <button className="btn btn-danger" onClick={handleDelete} disabled={isPending}>
            {isPending ? 'Menghapus...' : 'Hapus'}
          </button>
        </div>
      </Modal>

      {/* Modal Hapus Dokumentasi */}
      <Modal isOpen={deleteDocId !== null} onClose={() => setDeleteDocId(null)} title="Hapus Dokumentasi" size="sm">
        <p>Yakin hapus file dokumentasi ini?</p>
        <div className="flex-end gap-3 mt-6">
          <button className="btn btn-ghost" onClick={() => setDeleteDocId(null)}>Batal</button>
          <button className="btn btn-danger" onClick={handleDeleteDoc} disabled={isPending}>
            {isPending ? 'Menghapus...' : 'Hapus'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
