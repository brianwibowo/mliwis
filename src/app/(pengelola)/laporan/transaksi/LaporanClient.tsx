'use client'

import { useState, useTransition } from 'react'
import { Wallet, TrendingUp, TrendingDown, Users, FileText, Printer } from 'lucide-react'
import { getLaporanData } from './actions'
import { formatRupiah } from '@/lib/format'
import { useToast } from '@/hooks/useToast'

const BULAN = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']

interface LaporanResult {
  period: string; type: string; month: number; year: number; week?: number
  kasMasuk: { grouped: { jenis: string; total: number }[]; total: number }
  kasKeluar: { grouped: { jenis: string; total: number }[]; total: number }
  saldo: number; totalPengunjung: number; totalBooking: number
}

export default function LaporanClient({ initialData }: { initialData: LaporanResult | null }) {
  const { addToast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [activeTab, setActiveTab] = useState<'bulanan' | 'mingguan'>('bulanan')
  const now = new Date()
  const [month, setMonth] = useState(initialData?.month ?? now.getMonth() + 1)
  const [year, setYear] = useState(initialData?.year ?? now.getFullYear())
  const [week, setWeek] = useState(1)
  const [data, setData] = useState<LaporanResult | null>(initialData)

  const fetchData = () => {
    startTransition(async () => {
      const r = await getLaporanData(activeTab, month, year, activeTab === 'mingguan' ? week : undefined)
      if (r && !('error' in r)) setData(r)
      else addToast('Gagal memuat data', 'error')
    })
  }

  const handlePrint = () => window.print()

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left"><h1>Laporan Transaksi</h1><p>Rekap pemasukan dan pengeluaran</p></div>
        {data && <button className="btn btn-outline" onClick={handlePrint}><Printer size={18} /> Cetak</button>}
      </div>

      <div className="card mb-6">
        <div className="card-body">
          <div className="tabs mb-4">
            <button className={`tab ${activeTab === 'bulanan' ? 'active' : ''}`} onClick={() => setActiveTab('bulanan')}>Rekap Bulanan</button>
            <button className={`tab ${activeTab === 'mingguan' ? 'active' : ''}`} onClick={() => setActiveTab('mingguan')}>Rekap Mingguan</button>
          </div>
          <div className="flex gap-3 flex-wrap items-center">
            <select className="filter-select" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
              {BULAN.map((b, i) => <option key={i} value={i + 1}>{b}</option>)}
            </select>
            <select className="filter-select" value={year} onChange={(e) => setYear(Number(e.target.value))}>
              {[2024, 2025, 2026, 2027].map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
            {activeTab === 'mingguan' && (
              <select className="filter-select" value={week} onChange={(e) => setWeek(Number(e.target.value))}>
                {[1, 2, 3, 4, 5].map((w) => <option key={w} value={w}>Minggu {w}</option>)}
              </select>
            )}
            <button className="btn btn-primary" onClick={fetchData} disabled={isPending}>{isPending ? 'Memuat...' : 'Tampilkan'}</button>
          </div>
        </div>
      </div>

      {data && (
        <>
          <div className="text-center mb-4"><p className="font-heading font-bold text-lg">{data.period}</p></div>

          <div className="stats-grid mb-6">
            <div className="stat-card"><div className="stat-icon green"><TrendingUp size={24} /></div><div className="stat-content"><div className="stat-value text-success" style={{ fontSize: 'var(--text-xl)' }}>{formatRupiah(data.kasMasuk.total)}</div><div className="stat-label">Total Pemasukan</div></div></div>
            <div className="stat-card"><div className="stat-icon red"><TrendingDown size={24} /></div><div className="stat-content"><div className="stat-value text-danger" style={{ fontSize: 'var(--text-xl)' }}>{formatRupiah(data.kasKeluar.total)}</div><div className="stat-label">Total Pengeluaran</div></div></div>
            <div className="stat-card"><div className="stat-icon blue"><Wallet size={24} /></div><div className="stat-content"><div className="stat-value" style={{ fontSize: 'var(--text-xl)', color: data.saldo >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>{formatRupiah(data.saldo)}</div><div className="stat-label">Saldo</div></div></div>
            <div className="stat-card"><div className="stat-icon yellow"><Users size={24} /></div><div className="stat-content"><div className="stat-value" style={{ fontSize: 'var(--text-xl)' }}>{data.totalPengunjung.toLocaleString('id-ID')}</div><div className="stat-label">Total Pengunjung</div></div></div>
          </div>

          <div className="grid-2 mb-6">
            <div className="card">
              <div className="card-header"><h3 className="text-success">Rincian Pemasukan</h3></div>
              <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
                <table className="table">
                  <thead><tr><th>Jenis Transaksi</th><th style={{ textAlign: 'right' }}>Jumlah</th></tr></thead>
                  <tbody>
                    {data.kasMasuk.grouped.map((g) => (<tr key={g.jenis}><td>{g.jenis}</td><td style={{ textAlign: 'right' }} className="font-semibold">{formatRupiah(g.total)}</td></tr>))}
                    {data.kasMasuk.grouped.length === 0 && <tr><td colSpan={2} className="text-center text-muted">Tidak ada data</td></tr>}
                  </tbody>
                  <tfoot><tr style={{ fontWeight: 700, background: 'var(--color-success-light)' }}><td>TOTAL PEMASUKAN</td><td style={{ textAlign: 'right' }}>{formatRupiah(data.kasMasuk.total)}</td></tr></tfoot>
                </table>
              </div>
            </div>

            <div className="card">
              <div className="card-header"><h3 className="text-danger">Rincian Pengeluaran</h3></div>
              <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
                <table className="table">
                  <thead><tr><th>Jenis Transaksi</th><th style={{ textAlign: 'right' }}>Jumlah</th></tr></thead>
                  <tbody>
                    {data.kasKeluar.grouped.map((g) => (<tr key={g.jenis}><td>{g.jenis}</td><td style={{ textAlign: 'right' }} className="font-semibold">{formatRupiah(g.total)}</td></tr>))}
                    {data.kasKeluar.grouped.length === 0 && <tr><td colSpan={2} className="text-center text-muted">Tidak ada data</td></tr>}
                  </tbody>
                  <tfoot><tr style={{ fontWeight: 700, background: 'var(--color-danger-light)' }}><td>TOTAL PENGELUARAN</td><td style={{ textAlign: 'right' }}>{formatRupiah(data.kasKeluar.total)}</td></tr></tfoot>
                </table>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body" style={{ textAlign: 'center', padding: 24 }}>
              <div className="grid-3 gap-6">
                <div><p className="text-muted text-sm">Total Pemasukan</p><p className="font-bold text-lg text-success">{formatRupiah(data.kasMasuk.total)}</p></div>
                <div><p className="text-muted text-sm">Total Pengeluaran</p><p className="font-bold text-lg text-danger">{formatRupiah(data.kasKeluar.total)}</p></div>
                <div><p className="text-muted text-sm">Saldo Bersih</p><p className="font-bold text-lg" style={{ color: data.saldo >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>{formatRupiah(data.saldo)}</p></div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
