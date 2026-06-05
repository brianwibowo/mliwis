'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Search, Eye, Newspaper, ExternalLink } from 'lucide-react'
import { deleteBerita } from './actions'
import { formatTanggal } from '@/lib/format'
import { useToast } from '@/hooks/useToast'
import Modal from '@/components/ui/Modal'

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
  createdAt: string
  updatedAt: string
  user: { namaLengkap: string }
}

interface Props {
  initialData: {
    data: BeritaData[]
    total: number
    totalPages: number
  }
  initialSearch: string
  initialStatus: string
}

export default function BeritaAdminClient({ initialData, initialSearch, initialStatus }: Props) {
  const router = useRouter()
  const { addToast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [search, setSearch] = useState(initialSearch)
  const [statusFilter, setStatusFilter] = useState(initialStatus)
  const { data, totalPages } = initialData
  const [currentPage, setCurrentPage] = useState(1)

  const navigate = (s?: string, st?: string, p?: number) => {
    const params = new URLSearchParams()
    if (s) params.set('search', s)
    if (st && st !== 'Semua') params.set('status', st)
    if (p && p > 1) params.set('page', String(p))
    router.push(`/berita-admin?${params.toString()}`)
  }

  const handleSearch = () => navigate(search, statusFilter)

  const handleStatusChange = (s: string) => {
    setStatusFilter(s)
    navigate(search, s)
  }

  const handleDelete = () => {
    if (!deleteId) return
    startTransition(async () => {
      const r = await deleteBerita(deleteId)
      if (r.error) {
        addToast(r.error, 'error')
      } else {
        addToast('Berita berhasil dihapus', 'success')
        router.refresh()
      }
      setDeleteId(null)
    })
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Manajemen Berita</h1>
          <p>Kelola berita dan kegiatan di branding web Pantai Mliwis</p>
        </div>
        <Link href="/berita-admin/new" className="btn btn-primary">
          <Plus size={18} /> Tambah Berita
        </Link>
      </div>

      <div className="stat-card mb-6">
        <div className="stat-icon blue">
          <Newspaper size={24} />
        </div>
        <div className="stat-content">
          <div className="stat-value">{initialData.total}</div>
          <div className="stat-label">Total Berita & Kegiatan</div>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-group">
          <input
            className="form-input"
            placeholder="Cari judul, ringkasan, penulis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="btn btn-primary btn-sm" onClick={handleSearch}>
            <Search size={16} />
          </button>
        </div>
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => handleStatusChange(e.target.value)}
        >
          <option value="Semua">Semua Status</option>
          <option value="true">Published</option>
          <option value="false">Draft</option>
        </select>
      </div>

      <div className="card">
        <div className="table-container" style={{ border: 'none' }}>
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>No</th>
                <th style={{ width: '80px' }}>Gambar</th>
                <th>Judul Berita</th>
                <th>Kategori</th>
                <th>Penulis</th>
                <th>Status</th>
                <th>Tanggal Dibuat</th>
                <th style={{ width: '120px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 && (
                <tr>
                  <td colSpan={8}>
                    <div className="empty-state" style={{ padding: 40 }}>
                      <p className="empty-state-title">Belum ada data berita</p>
                    </div>
                  </td>
                </tr>
              )}
              {data.map((b, i) => (
                <tr key={b.id}>
                  <td>{i + 1}</td>
                  <td>
                    <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--color-surface-alt)', border: '1px solid var(--color-border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {b.gambarUtama ? (
                        <img src={b.gambarUtama} alt={b.judul} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Newspaper size={20} className="text-muted" />
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="font-semibold" style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {b.judul}
                    </div>
                    {b.linkExternal && (
                      <a href={b.linkExternal} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--color-primary-600)', marginTop: 2 }}>
                        <span>Link eksternal</span>
                        <ExternalLink size={10} />
                      </a>
                    )}
                  </td>
                  <td>
                    <span className="badge badge-default">{b.kategori}</span>
                  </td>
                  <td>{b.penulis}</td>
                  <td>
                    <span className={`badge ${b.published ? 'badge-success' : 'badge-warning'}`}>
                      {b.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>{formatTanggal(b.createdAt)}</td>
                  <td>
                    <div className="table-actions">
                      <a href={`/berita-kegiatan/${b.slug}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm btn-icon" title="Pratinjau Publik">
                        <Eye size={14} />
                      </a>
                      <Link href={`/berita-admin/${b.id}`} className="btn btn-ghost btn-sm btn-icon" title="Edit Berita">
                        <Pencil size={14} />
                      </Link>
                      <button className="btn btn-ghost btn-sm btn-icon text-danger" onClick={() => setDeleteId(b.id)} title="Hapus Berita">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="card-footer">
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentPage(i + 1)
                    navigate(search, statusFilter, i + 1)
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal Hapus */}
      <Modal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} title="Hapus Berita" size="sm">
        <p>Yakin ingin menghapus berita ini? Aksi ini tidak dapat dibatalkan.</p>
        <div className="flex-end gap-3 mt-6">
          <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Batal</button>
          <button className="btn btn-danger" onClick={handleDelete} disabled={isPending}>
            {isPending ? 'Menghapus...' : 'Hapus'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
