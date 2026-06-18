'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Plus, Pencil, Trash2, Users, TrendingUp, FileText } from 'lucide-react'
import { createPengunjung, updatePengunjung, deletePengunjung } from './actions'
import { formatTanggal } from '@/lib/format'
import { useToast } from '@/hooks/useToast'
import Modal from '@/components/ui/Modal'

const BULAN = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
const HARI = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu']

interface PengunjungData { 
  id: number
  tanggal: string
  jumlahBalita: number
  jumlahAnak: number
  jumlahDewasa: number
  jumlah: number 
}

interface Props {
  initialData: { 
    data: PengunjungData[]
    total: number
    totalBalita: number
    totalAnak: number
    totalDewasa: number
    rataRata: number
    month: number
    year: number 
  }
}

export default function PengunjungClient({ initialData }: Props) {
  const router = useRouter()
  const { addToast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [showModal, setShowModal] = useState(false)
  const [editData, setEditData] = useState<PengunjungData | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const { data, total, totalBalita, totalAnak, totalDewasa, rataRata, month, year } = initialData

  const chartData = [...data].reverse().map((p) => ({
    tanggal: new Date(p.tanggal).getDate().toString(),
    'Balita (0-5 th)': p.jumlahBalita,
    'Anak-anak (5-17 th)': p.jumlahAnak,
    'Dewasa (17+ th)': p.jumlahDewasa,
  }))

  const navigate = (m: number, y: number) => {
    router.push(`/laporan/pengunjung?month=${m}&year=${y}`)
  }

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const r = editData ? await updatePengunjung(editData.id, formData) : await createPengunjung(formData)
      if (r.error) {
        addToast(r.error, 'error')
      } else { 
        addToast(editData ? 'Data diperbarui' : 'Data ditambahkan', 'success')
        setShowModal(false)
        setEditData(null)
        router.refresh() 
      }
    })
  }

  const handleDelete = () => {
    if (!deleteId) return
    startTransition(async () => {
      const r = await deletePengunjung(deleteId)
      if (r.error) {
        addToast(r.error, 'error')
      } else { 
        addToast('Data dihapus', 'success')
        router.refresh() 
      }
      setDeleteId(null)
    })
  }

  const handleDownloadPDF = () => {
    const params = new URLSearchParams({
      month: String(month),
      year: String(year),
    })
    window.location.href = `/api/laporan/pengunjung/pdf?${params.toString()}`
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Laporan Pengunjung</h1>
          <p>Laporan statistika & pengisian jumlah pengunjung harian Pantai Mliwis</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={() => { setEditData(null); setShowModal(true) }}>
            <Plus size={18} /> Tambah Data
          </button>
          {data.length > 0 && (
            <button className="btn btn-outline" onClick={handleDownloadPDF}>
              <FileText size={18} /> Unduh PDF
            </button>
          )}
        </div>
      </div>

      {/* 5-Column Stats Grid */}
      <div className="stats-grid mb-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        <div className="stat-card">
          <div className="stat-icon blue"><Users size={20} /></div>
          <div className="stat-content">
            <div className="stat-value" style={{ fontSize: '1.25rem' }}>{total.toLocaleString('id-ID')}</div>
            <div className="stat-label">Total Pengunjung</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow" style={{ color: '#fed43e', backgroundColor: 'rgba(254, 212, 62, 0.1)' }}><Users size={20} /></div>
          <div className="stat-content">
            <div className="stat-value" style={{ fontSize: '1.25rem' }}>{totalBalita.toLocaleString('id-ID')}</div>
            <div className="stat-label">Balita (0-5 th)</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon cyan" style={{ color: '#14a2ba', backgroundColor: 'rgba(20, 162, 186, 0.1)' }}><Users size={20} /></div>
          <div className="stat-content">
            <div className="stat-value" style={{ fontSize: '1.25rem' }}>{totalAnak.toLocaleString('id-ID')}</div>
            <div className="stat-label">Anak (5-17 th)</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#0f2556', backgroundColor: 'rgba(15, 37, 86, 0.1)' }}><Users size={20} /></div>
          <div className="stat-content">
            <div className="stat-value" style={{ fontSize: '1.25rem' }}>{totalDewasa.toLocaleString('id-ID')}</div>
            <div className="stat-label">Dewasa (17+ th)</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><TrendingUp size={20} /></div>
          <div className="stat-content">
            <div className="stat-value" style={{ fontSize: '1.25rem' }}>{rataRata.toLocaleString('id-ID')}</div>
            <div className="stat-label">Rata-rata Harian</div>
          </div>
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
          <div className="chart-card-header">
            <h3>Grafik Kategori Usia Pengunjung Harian</h3>
            <p>{BULAN[month - 1]} {year}</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="tanggal" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0' }} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: '12px', marginTop: '10px' }} />
                <Bar dataKey="Balita (0-5 th)" stackId="a" fill="#fed43e" />
                <Bar dataKey="Anak-anak (5-17 th)" stackId="a" fill="#14a2ba" />
                <Bar dataKey="Dewasa (17+ th)" stackId="a" fill="#0f2556" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="card">
        <div className="table-container" style={{ border: 'none' }}>
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>No</th>
                <th>Tanggal</th>
                <th>Hari</th>
                <th>Balita (0-5 th)</th>
                <th>Anak (5-17 th)</th>
                <th>Dewasa (17+ th)</th>
                <th>Total Pengunjung</th>
                <th style={{ width: '100px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 && (
                <tr>
                  <td colSpan={8}>
                    <div className="empty-state" style={{ padding: 40 }}>
                      <p className="empty-state-title">Belum ada data pengunjung bulan ini</p>
                    </div>
                  </td>
                </tr>
              )}
              {data.map((p, i) => (
                <tr key={p.id}>
                  <td>{i + 1}</td>
                  <td>{formatTanggal(p.tanggal)}</td>
                  <td>{HARI[new Date(p.tanggal).getDay()]}</td>
                  <td>{p.jumlahBalita.toLocaleString('id-ID')} orang</td>
                  <td>{p.jumlahAnak.toLocaleString('id-ID')} orang</td>
                  <td>{p.jumlahDewasa.toLocaleString('id-ID')} orang</td>
                  <td><strong style={{ color: 'var(--color-primary-700)' }}>{p.jumlah.toLocaleString('id-ID')}</strong> orang</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn btn-ghost btn-sm btn-icon" onClick={() => { setEditData(p); setShowModal(true) }}>
                        <Pencil size={14} />
                      </button>
                      <button className="btn btn-ghost btn-sm btn-icon text-danger" onClick={() => setDeleteId(p.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal 
        isOpen={showModal} 
        onClose={() => { setShowModal(false); setEditData(null) }} 
        title={editData ? 'Edit Data Pengunjung' : 'Tambah Data Pengunjung'}
      >
        <form action={handleSubmit}>
          {!editData && (
            <div className="form-group">
              <label className="form-label">Tanggal Pengunjung <span className="required">*</span></label>
              <input name="tanggal" type="date" className="form-input" required />
              <p className="form-hint">Jika tanggal sudah ada, data pada tanggal tersebut akan diperbarui.</p>
            </div>
          )}
          
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Balita (0-5 th) <span className="required">*</span></label>
              <input 
                name="jumlahBalita" 
                type="number" 
                min={0}
                className="form-input" 
                defaultValue={editData?.jumlahBalita ?? 0} 
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Anak (5-17 th) <span className="required">*</span></label>
              <input 
                name="jumlahAnak" 
                type="number" 
                min={0}
                className="form-input" 
                defaultValue={editData?.jumlahAnak ?? 0} 
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Dewasa (17+ th) <span className="required">*</span></label>
              <input 
                name="jumlahDewasa" 
                type="number" 
                min={0}
                className="form-input" 
                defaultValue={editData?.jumlahDewasa ?? 0} 
                required 
              />
            </div>
          </div>

          <div className="flex-end gap-3" style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '16px' }}>
            <button type="button" className="btn btn-ghost" onClick={() => { setShowModal(false); setEditData(null) }}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary" disabled={isPending}>
              {isPending ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} title="Hapus Data Pengunjung" size="sm">
        <p>Yakin ingin menghapus data pengunjung harian ini? Tindakan ini tidak dapat dibatalkan.</p>
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
