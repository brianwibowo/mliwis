'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, Wallet, TrendingDown } from 'lucide-react'
import { createKasKeluar, updateKasKeluar, deleteKasKeluar } from '../actions'
import { formatRupiah, formatTanggal } from '@/lib/format'
import { JENIS_KAS_KELUAR } from '@/lib/constants'
import { useToast } from '@/hooks/useToast'
import Modal from '@/components/ui/Modal'

const BULAN = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']

interface KasData {
  id: number; tanggal: string; jenisTransaksi: string; nominal: number; keterangan: string | null; keteranganLain: string | null
  user: { namaLengkap: string }
}

interface Props {
  initialData: { data: KasData[]; total: number; totalPages: number; totalNominal: number; month: number; year: number }
}

export default function KasKeluarClient({ initialData }: Props) {
  const router = useRouter()
  const { addToast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [showModal, setShowModal] = useState(false)
  const [editData, setEditData] = useState<KasData | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [selectedJenis, setSelectedJenis] = useState('')
  const { data, totalNominal, month, year, totalPages } = initialData

  const navigate = (m: number, y: number, p?: number) => {
    router.push(`/transaksi/kas-keluar?month=${m}&year=${y}${p && p > 1 ? `&page=${p}` : ''}`)
  }

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const r = editData ? await updateKasKeluar(editData.id, formData) : await createKasKeluar(formData)
      if (r.error) addToast(r.error, 'error')
      else { addToast(editData ? 'Data diperbarui' : 'Data ditambahkan', 'success'); setShowModal(false); setEditData(null); router.refresh() }
    })
  }

  const handleDelete = () => {
    if (!deleteId) return
    startTransition(async () => {
      const r = await deleteKasKeluar(deleteId)
      if (r.error) addToast(r.error, 'error')
      else { addToast('Data dihapus', 'success'); router.refresh() }
      setDeleteId(null)
    })
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left"><h1>Kas Keluar</h1><p>Pengeluaran Pantai Mliwis</p></div>
        <button className="btn btn-primary" onClick={() => { setEditData(null); setSelectedJenis(''); setShowModal(true) }}><Plus size={18} /> Tambah Kas Keluar</button>
      </div>

      <div className="stat-card mb-6">
        <div className="stat-icon red"><Wallet size={24} /></div>
        <div className="stat-content">
          <div className="stat-value">{formatRupiah(totalNominal)}</div>
          <div className="stat-label">Total Kas Keluar — {BULAN[month - 1]} {year}</div>
        </div>
        <TrendingDown size={20} className="text-danger" />
      </div>

      <div className="filter-bar">
        <select className="filter-select" value={month} onChange={(e) => navigate(Number(e.target.value), year)}>
          {BULAN.map((b, i) => <option key={i} value={i + 1}>{b}</option>)}
        </select>
        <select className="filter-select" value={year} onChange={(e) => navigate(month, Number(e.target.value))}>
          {[2024, 2025, 2026, 2027].map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <div className="card">
        <div className="table-container" style={{ border: 'none' }}>
          <table className="table">
            <thead><tr><th>No</th><th>Tanggal</th><th>Jenis Transaksi</th><th>Nominal</th><th>Keterangan</th><th>Aksi</th></tr></thead>
            <tbody>
              {data.length === 0 && <tr><td colSpan={6}><div className="empty-state" style={{ padding: 40 }}><p className="empty-state-title">Belum ada data</p></div></td></tr>}
              {data.map((k, i) => (
                <tr key={k.id}>
                  <td>{i + 1}</td>
                  <td>{formatTanggal(k.tanggal)}</td>
                  <td>{k.jenisTransaksi}{k.keteranganLain && <span className="text-muted text-xs block">{k.keteranganLain}</span>}</td>
                  <td className="font-semibold text-danger">{formatRupiah(k.nominal)}</td>
                  <td className="text-sm text-muted">{k.keterangan || '—'}</td>
                  <td><div className="table-actions"><button className="btn btn-ghost btn-sm btn-icon" onClick={() => { setEditData(k); setSelectedJenis(k.jenisTransaksi); setShowModal(true) }}><Pencil size={14} /></button><button className="btn btn-ghost btn-sm btn-icon text-danger" onClick={() => setDeleteId(k.id)}><Trash2 size={14} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="card-footer"><div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (<button key={i} className="pagination-btn" onClick={() => navigate(month, year, i + 1)}>{i + 1}</button>))}
          </div></div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditData(null) }} title={editData ? 'Edit Kas Keluar' : 'Tambah Kas Keluar'}>
        <form action={handleSubmit}>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Tanggal <span className="required">*</span></label><input name="tanggal" type="date" className="form-input" defaultValue={editData?.tanggal?.split('T')[0]} required /></div>
            <div className="form-group"><label className="form-label">Nominal (Rp) <span className="required">*</span></label><input name="nominal" type="number" className="form-input" defaultValue={editData?.nominal} required /></div>
          </div>
          <div className="form-group">
            <label className="form-label">Jenis Transaksi <span className="required">*</span></label>
            <select name="jenisTransaksi" className="form-select" value={selectedJenis} onChange={(e) => setSelectedJenis(e.target.value)} required>
              <option value="">Pilih jenis...</option>
              {JENIS_KAS_KELUAR.map((j) => <option key={j} value={j}>{j}</option>)}
            </select>
          </div>
          {selectedJenis === 'Pengeluaran Lain-lain' && (
            <div className="form-group"><label className="form-label">Keterangan Lain</label><input name="keteranganLain" className="form-input" defaultValue={editData?.keteranganLain || ''} /></div>
          )}
          <div className="form-group"><label className="form-label">Keterangan</label><textarea name="keterangan" className="form-textarea" defaultValue={editData?.keterangan || ''} /></div>
          <div className="flex-end gap-3"><button type="button" className="btn btn-ghost" onClick={() => { setShowModal(false); setEditData(null) }}>Batal</button><button type="submit" className="btn btn-primary" disabled={isPending}>{isPending ? 'Menyimpan...' : 'Simpan'}</button></div>
        </form>
      </Modal>

      <Modal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} title="Hapus Data" size="sm">
        <p>Yakin hapus data kas keluar ini?</p>
        <div className="flex-end gap-3 mt-6"><button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Batal</button><button className="btn btn-danger" onClick={handleDelete} disabled={isPending}>{isPending ? 'Menghapus...' : 'Hapus'}</button></div>
      </Modal>
    </div>
  )
}
