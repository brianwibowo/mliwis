'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Trash2, Eye, CalendarCheck } from 'lucide-react'
import { deleteBooking } from './actions'
import { formatTanggal } from '@/lib/format'
import { useToast } from '@/hooks/useToast'
import Modal from '@/components/ui/Modal'

interface BookingData {
  id: number; kodeBooking: string; namaCustomer: string; nomorHP: string
  jenisAcara: string; status: string; tanggalMulai: string; tanggalSelesai: string
  catatanPengelola: string | null; fasilitas: string[]; createdAt: string
}

interface Props {
  initialData: { data: BookingData[]; total: number; totalPages: number }
  currentSearch: string; currentStatus: string; currentPage: number
}

export default function BookingAdminClient({ initialData, currentSearch, currentStatus, currentPage }: Props) {
  const router = useRouter()
  const { addToast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState(currentSearch)
  const [status, setStatus] = useState(currentStatus)
  const [detail, setDetail] = useState<BookingData | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const navigate = (s?: string, st?: string, p?: number) => {
    const params = new URLSearchParams()
    if (s) params.set('search', s)
    if (st) params.set('status', st)
    if (p && p > 1) params.set('page', String(p))
    router.push(`/booking-admin?${params.toString()}`)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    startTransition(async () => {
      const r = await deleteBooking(deleteId)
      if (r.error) addToast(r.error, 'error')
      else { addToast('Booking dihapus', 'success'); router.refresh() }
      setDeleteId(null)
    })
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left"><h1>Data Booking</h1><p>Semua data booking acara Pantai Mliwis</p></div>
      </div>

      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input className="search-input" placeholder="Cari kode, nama, jenis acara..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && navigate(search, status)} />
        </div>
        <select className="filter-select" value={status} onChange={(e) => { setStatus(e.target.value); navigate(search, e.target.value) }}>
          <option value="">Semua Status</option>
          <option value="menunggu">Menunggu</option>
          <option value="disetujui">Disetujui</option>
          <option value="ditolak">Ditolak</option>
        </select>
        <button className="btn btn-primary" onClick={() => navigate(search, status)}>Cari</button>
      </div>

      <div className="card">
        <div className="table-container" style={{ border: 'none' }}>
          <table className="table">
            <thead><tr><th>Kode</th><th>Customer</th><th>No HP</th><th>Tanggal</th><th>Jenis Acara</th><th>Fasilitas</th><th>Status</th><th>Aksi</th></tr></thead>
            <tbody>
              {initialData.data.length === 0 && (
                <tr><td colSpan={8}><div className="empty-state"><CalendarCheck size={48} className="empty-state-icon" /><p className="empty-state-title">Belum ada booking</p></div></td></tr>
              )}
              {initialData.data.map((b) => (
                <tr key={b.id}>
                  <td><strong className="font-mono">{b.kodeBooking}</strong></td>
                  <td>{b.namaCustomer}</td>
                  <td>{b.nomorHP}</td>
                  <td className="text-sm">{formatTanggal(b.tanggalMulai)}{b.tanggalMulai !== b.tanggalSelesai && <><br /><span className="text-muted">s/d {formatTanggal(b.tanggalSelesai)}</span></>}</td>
                  <td>{b.jenisAcara}</td>
                  <td><div className="flex flex-wrap gap-1">{b.fasilitas.map((f) => <span key={f} className="badge badge-info badge-sm">{f}</span>)}</div></td>
                  <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                  <td>
                    <div className="table-actions">
                      <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setDetail(b)} title="Detail"><Eye size={14} /></button>
                      <button className="btn btn-ghost btn-sm btn-icon text-danger" onClick={() => setDeleteId(b.id)} title="Hapus"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {initialData.totalPages > 1 && (
          <div className="card-footer"><div className="pagination">
            <button className="pagination-btn" disabled={currentPage <= 1} onClick={() => navigate(search, status, currentPage - 1)}>←</button>
            {Array.from({ length: initialData.totalPages }, (_, i) => (<button key={i} className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`} onClick={() => navigate(search, status, i + 1)}>{i + 1}</button>))}
            <button className="pagination-btn" disabled={currentPage >= initialData.totalPages} onClick={() => navigate(search, status, currentPage + 1)}>→</button>
          </div></div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal isOpen={detail !== null} onClose={() => setDetail(null)} title="Detail Booking" size="lg">
        {detail && (
          <div>
            <div className="grid-2 gap-4 mb-4">
              <div><p className="text-muted text-xs">Kode Booking</p><p className="font-bold font-mono">{detail.kodeBooking}</p></div>
              <div><p className="text-muted text-xs">Status</p><span className={`badge badge-${detail.status}`}>{detail.status}</span></div>
              <div><p className="text-muted text-xs">Nama Customer</p><p className="font-semibold">{detail.namaCustomer}</p></div>
              <div><p className="text-muted text-xs">Nomor HP</p><p>{detail.nomorHP}</p></div>
              <div><p className="text-muted text-xs">Tanggal Mulai</p><p>{formatTanggal(detail.tanggalMulai)}</p></div>
              <div><p className="text-muted text-xs">Tanggal Selesai</p><p>{formatTanggal(detail.tanggalSelesai)}</p></div>
              <div><p className="text-muted text-xs">Jenis Acara</p><p>{detail.jenisAcara}</p></div>
              <div><p className="text-muted text-xs">Tanggal Dibuat</p><p>{formatTanggal(detail.createdAt)}</p></div>
            </div>
            <div className="mb-4"><p className="text-muted text-xs mb-2">Fasilitas</p><div className="flex flex-wrap gap-2">{detail.fasilitas.map((f) => <span key={f} className="badge badge-info">{f}</span>)}</div></div>
            {detail.catatanPengelola && <div><p className="text-muted text-xs mb-1">Catatan Pengelola</p><p className="p-3" style={{ background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-lg)' }}>{detail.catatanPengelola}</p></div>}
          </div>
        )}
      </Modal>

      <Modal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} title="Hapus Booking" size="sm">
        <p>Yakin ingin menghapus booking ini?</p>
        <div className="flex-end gap-3 mt-6"><button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Batal</button><button className="btn btn-danger" onClick={handleDelete} disabled={isPending}>{isPending ? 'Menghapus...' : 'Hapus'}</button></div>
      </Modal>
    </div>
  )
}
