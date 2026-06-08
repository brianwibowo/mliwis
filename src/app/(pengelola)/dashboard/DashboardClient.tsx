'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from 'recharts'
import { Users, Wallet, CalendarCheck, TrendingUp } from 'lucide-react'
import { formatRupiah, formatTanggal } from '@/lib/format'

interface DashboardData {
  stats: {
    totalPengunjung: number
    totalPendapatan: number
    bookingMenunggu: number
  }
  pengunjung7Hari: { tanggal: string; jumlah: number }[]
  monthlyKasMasuk: { bulan: string; total: number }[]
  bookingByStatus: { menunggu: number; disetujui: number; ditolak: number }
  recentBookings: {
    id: number
    kodeBooking: string
    namaCustomer: string
    jenisAcara: string
    status: string
    tanggalMulai: string
    fasilitas: string[]
    createdAt: string
  }[]
}

const COLORS = ['#f59e0b', '#10b981', '#ef4444']

export default function DashboardClient({ data }: { data: DashboardData }) {
  const { stats, pengunjung7Hari, monthlyKasMasuk, bookingByStatus, recentBookings } = data

  const pieData = [
    { name: 'Menunggu', value: bookingByStatus.menunggu },
    { name: 'Disetujui', value: bookingByStatus.disetujui },
    { name: 'Ditolak', value: bookingByStatus.ditolak },
  ]

  const pengunjungData = pengunjung7Hari.map((p) => ({
    hari: new Date(p.tanggal).toLocaleDateString('id-ID', { weekday: 'short' }),
    jumlah: p.jumlah,
  }))

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Dashboard</h1>
          <p>Ringkasan data Pantai Mliwis bulan ini</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalPengunjung.toLocaleString('id-ID')}</div>
            <div className="stat-label">Pengunjung Bulan Ini</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <Wallet size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{formatRupiah(stats.totalPendapatan)}</div>
            <div className="stat-label">Pendapatan Bulan Ini</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon yellow">
            <CalendarCheck size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.bookingMenunggu}</div>
            <div className="stat-label">Booking Menunggu</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Pendapatan Chart */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3>Tren Pendapatan</h3>
            <p>6 bulan terakhir</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthlyKasMasuk}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="bulan" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickFormatter={(v) => `${(v / 1000000).toFixed(0)}jt`}
                />
                <Tooltip
                  formatter={(value) => [formatRupiah(Number(value ?? 0)), 'Pendapatan']}
                  contentStyle={{
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 7, fill: '#2563eb' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Booking Status Pie */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3>Status Booking</h3>
            <p>Semua booking</p>
          </div>
          <div className="chart-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Pengunjung Bar Chart */}
      <div className="grid-2 mb-6">
        <div className="chart-card">
          <div className="chart-card-header">
            <h3>Pengunjung Harian</h3>
            <p>7 hari terakhir</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={pengunjungData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="hari" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                />
                <Bar
                  dataKey="jumlah"
                  fill="#3b82f6"
                  radius={[6, 6, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3>Booking Terbaru</h3>
            <p>5 Booking Terakhir</p>
          </div>
          <ul className="recent-list">
            {recentBookings.length === 0 && (
              <li className="empty-state" style={{ padding: '40px 20px' }}>
                <p className="text-muted text-sm">Belum ada data booking</p>
              </li>
            )}
            {recentBookings.map((booking) => (
              <li key={booking.id} className="recent-list-item">
                <div
                  className="recent-list-icon"
                  style={{
                    background: booking.status === 'menunggu' ? '#fef3c7' : booking.status === 'disetujui' ? '#d1fae5' : '#fee2e2',
                    color: booking.status === 'menunggu' ? '#92400e' : booking.status === 'disetujui' ? '#065f46' : '#991b1b',
                  }}
                >
                  <CalendarCheck size={18} />
                </div>
                <div className="recent-list-content">
                  <div className="recent-list-title">{booking.namaCustomer}</div>
                  <div className="recent-list-meta">
                    {booking.jenisAcara} · {formatTanggal(booking.tanggalMulai)}
                  </div>
                </div>
                <span className={`badge badge-${booking.status}`}>
                  {booking.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
