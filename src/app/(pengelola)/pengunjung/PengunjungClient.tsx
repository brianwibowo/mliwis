'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Plus, Pencil, Trash2, Users, TrendingUp } from 'lucide-react'
import { createPengunjung, updatePengunjung, deletePengunjung } from './actions'
import { formatTanggal } from '@/lib/format'
import { useToast } from '@/hooks/useToast'
import Modal from '@/components/ui/Modal'

const BULAN = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
const HARI = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu']

interface PengunjungData { id: number; tanggal: string; jumlah: number }

interface Props {
  initialData: { data: PengunjungData[]; total: number; rataRata: number; month: number; year: number }
}

export default function PengunjungClient({ initialData }: Props) {
  const router = useRouter()
  const { addToast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [showModal, setShowModal] = useState(false)
  const [editData, setEditData] = useState<PengunjungData | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const { data, total, rataRata, month, year } = initialData

  const chartData = [...data].reverse().map((p) => ({
    tanggal: new Date(p.tanggal).getDate().toString(),
    jumlah: p.jumlah,
  }))

  const navigate = (m: number, y: number) => router.push(`/pengunjung?month=${m}&year=${y}`)

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const r = editData ? await updatePengunjung(editData.id, formData) : await createPengunjung(formData)
      if (r.error) addToast(r.error, 'error')
      else { addToast('Data disimpan', 'success'); setShowModal(false); setEditData(null); router.refresh() }
    })
  }

  const handleDelete = () => {
    if (!deleteId) return
    startTransition(async () => {
      const r = await deletePengunjung(deleteId)
      if (r.error) addToast(r.error, 'error')
      else { addToast('Data dihapus', 'success'); router.refresh() }
      setDeleteId(null)
    })
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left"><h1>Data Pengunjung</h1><p>Jumlah pengunjung harian Pantai Mliwis</p></div>
        <button className="btn btn-primary" onClick={() => { setEditData(null); setShowModal(true) }}><Plus size={18} /> Tambah Data</button>
      </div>

      <div className="grid-2 mb-6" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="stat-card">
          <div className="stat-icon blue"><Users size={24} /></div>
          <div className="stat-content"><div className="stat-value">{total.toLocaleString('id-ID')}</div><div className="stat-label">Total Pengunjung — {BULAN[month - 1]} {year}</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><TrendingUp size={24} /></div>
          <div className="stat-content"><div className="stat-value">{rataRata.toLocaleString('id-ID')}</div><div className="stat-label">Rata-rata Harian</div></div>
        </div>
      </div>

      <div className="filter-bar">
        <select className="filter-select" value={month} onChange={(e) => navigate(Number(e.target.value), year)}>
          {BULAN.map((b, i) => <option key={i} value={i + 1}>{b}</option>)}
        </select>
        <select className="filter-select" value={year} onChange={(e) => navigate(month, Number(e.target.value))}>
          {[2024, 2025, 2026, 2027].map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {chartData.length > 0 && (
        <div className="chart-card mb-6">
          <div className="chart-card-header"><h3>Grafik Pengunjung Harian</h3><p>{BULAN[month - 1]} {year}</p></div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="tanggal" tick={{ fontSize: 12, fill: '#64748b' }} /><YAxis tick={{ fontSize: 12, fill: '#64748b' }} /><Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0' }} /><Bar dataKey="jumlah" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} /></BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="card">
        <div className="table-container" style={{ border: 'none' }}>
          <table className="table">
            <thead><tr><th>No</th><th>Tanggal</th><th>Hari</th><th>Jumlah Pengunjung</th><th>Aksi</th></tr></thead>
            <tbody>
              {data.length === 0 && <tr><td colSpan={5}><div className="empty-state" style={{ padding: 40 }}><p className="empty-state-title">Belum ada data</p></div></td></tr>}
              {data.map((p, i) => (
                <tr key={p.id}>
                  <td>{i + 1}</td>
                  <td>{formatTanggal(p.tanggal)}</td>
                  <td>{HARI[new Date(p.tanggal).getDay()]}</td>
                  <td><strong>{p.jumlah.toLocaleString('id-ID')}</strong> orang</td>
                  <td><div className="table-actions"><button className="btn btn-ghost btn-sm btn-icon" onClick={() => { setEditData(p); setShowModal(true) }}><Pencil size={14} /></button><button className="btn btn-ghost btn-sm btn-icon text-danger" onClick={() => setDeleteId(p.id)}><Trash2 size={14} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditData(null) }} title={editData ? 'Edit Data Pengunjung' : 'Tambah Data Pengunjung'}>
        <form action={handleSubmit}>
          {!editData && <div className="form-group"><label className="form-label">Tanggal <span className="required">*</span></label><input name="tanggal" type="date" className="form-input" required /><p className="form-hint">Jika tanggal sudah ada, data akan diperbarui otomatis.</p></div>}
          <div className="form-group"><label className="form-label">Jumlah Pengunjung <span className="required">*</span></label><input name="jumlah" type="number" className="form-input" defaultValue={editData?.jumlah} placeholder="0" required /></div>
          <div className="flex-end gap-3"><button type="button" className="btn btn-ghost" onClick={() => { setShowModal(false); setEditData(null) }}>Batal</button><button type="submit" className="btn btn-primary" disabled={isPending}>{isPending ? 'Menyimpan...' : 'Simpan'}</button></div>
        </form>
      </Modal>

      <Modal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} title="Hapus Data" size="sm">
        <p>Yakin hapus data pengunjung ini?</p>
        <div className="flex-end gap-3 mt-6"><button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Batal</button><button className="btn btn-danger" onClick={handleDelete} disabled={isPending}>{isPending ? 'Menghapus...' : 'Hapus'}</button></div>
      </Modal>
    </div>
  )
}
