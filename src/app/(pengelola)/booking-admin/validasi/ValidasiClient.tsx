'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarCheck, Phone, Check, X, Clock } from 'lucide-react'
import { validateBooking } from '../actions'
import { formatTanggal } from '@/lib/format'
import { useToast } from '@/hooks/useToast'
import Modal from '@/components/ui/Modal'

interface BookingData {
  id: number; kodeBooking: string; namaCustomer: string; nomorHP: string
  jenisAcara: string; status: string; tanggalMulai: string; tanggalSelesai: string
  fasilitas: string[]; createdAt: string
}

export default function ValidasiClient({ bookings }: { bookings: BookingData[] }) {
  const router = useRouter()
  const { addToast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [actionModal, setActionModal] = useState<{ booking: BookingData; action: 'disetujui' | 'ditolak' } | null>(null)
  const [catatan, setCatatan] = useState('')

  const handleValidate = () => {
    if (!actionModal) return
    startTransition(async () => {
      const r = await validateBooking(actionModal.booking.id, actionModal.action, catatan)
      if (r.error) addToast(r.error, 'error')
      else {
        addToast(`Booking ${actionModal.action === 'disetujui' ? 'disetujui' : 'ditolak'}`, 'success')
        router.refresh()
      }
      setActionModal(null); setCatatan('')
    })
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left"><h1>Validasi Booking</h1><p>Setujui atau tolak booking yang masuk</p></div>
        <span className="badge badge-menunggu" style={{ fontSize: '14px', padding: '8px 16px' }}><Clock size={16} /> {bookings.length} menunggu</span>
      </div>

      {bookings.length === 0 && (
        <div className="card"><div className="empty-state"><CalendarCheck size={64} className="empty-state-icon" /><p className="empty-state-title">Tidak ada booking menunggu</p><p className="empty-state-text">Semua booking sudah diproses</p></div></div>
      )}

      <div className="grid-2">
        {bookings.map((b) => (
          <div key={b.id} className="card" style={{ cursor: 'default' }}>
            <div className="card-header">
              <div>
                <span className="font-mono font-bold text-primary">{b.kodeBooking}</span>
                <p className="text-muted text-xs mt-1">Dibuat {formatTanggal(b.createdAt)}</p>
              </div>
              <span className="badge badge-menunggu">Menunggu</span>
            </div>
            <div className="card-body">
              <h4 className="mb-2">{b.namaCustomer}</h4>
              <div className="flex items-center gap-2 mb-3 text-muted text-sm"><Phone size={14} /> {b.nomorHP}</div>
              <div className="grid-2 gap-3 mb-3">
                <div><p className="text-xs text-muted">Jenis Acara</p><p className="font-semibold text-sm">{b.jenisAcara}</p></div>
                <div><p className="text-xs text-muted">Tanggal</p><p className="text-sm">{formatTanggal(b.tanggalMulai)}{b.tanggalMulai !== b.tanggalSelesai && ` - ${formatTanggal(b.tanggalSelesai)}`}</p></div>
              </div>
              <div className="mb-4"><p className="text-xs text-muted mb-1">Fasilitas</p><div className="flex flex-wrap gap-1">{b.fasilitas.map((f) => <span key={f} className="badge badge-info badge-sm">{f}</span>)}</div></div>
              <div className="flex gap-3">
                <button className="btn btn-success flex-1" onClick={() => setActionModal({ booking: b, action: 'disetujui' })}><Check size={16} /> Setujui</button>
                <button className="btn btn-danger flex-1" onClick={() => setActionModal({ booking: b, action: 'ditolak' })}><X size={16} /> Tolak</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={actionModal !== null} onClose={() => { setActionModal(null); setCatatan('') }} title={actionModal?.action === 'disetujui' ? 'Setujui Booking' : 'Tolak Booking'} size="md">
        {actionModal && (
          <div>
            <p className="mb-4">Booking <strong>{actionModal.booking.kodeBooking}</strong> dari <strong>{actionModal.booking.namaCustomer}</strong></p>
            <div className="form-group">
              <label className="form-label">Catatan untuk Customer</label>
              <textarea className="form-textarea" value={catatan} onChange={(e) => setCatatan(e.target.value)} placeholder={actionModal.action === 'disetujui' ? 'Contoh: Silakan datang 1 jam sebelumnya...' : 'Contoh: Maaf, tanggal sudah penuh...'} />
            </div>
            <div className="flex-end gap-3">
              <button className="btn btn-ghost" onClick={() => { setActionModal(null); setCatatan('') }}>Batal</button>
              <button className={`btn ${actionModal.action === 'disetujui' ? 'btn-success' : 'btn-danger'}`} onClick={handleValidate} disabled={isPending}>
                {isPending ? 'Memproses...' : actionModal.action === 'disetujui' ? 'Setujui' : 'Tolak'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
