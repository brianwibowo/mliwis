'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Tent, TreePine, Info, X, Clock, MapPin, AlignLeft } from 'lucide-react'
import { getApprovedBookings } from '@/app/booking/actions'

// Mock schedules for a premium realistic visual representation
interface Schedule {
  id: number
  tanggalMulai: number // day of current month
  tanggalSelesai: number // day of current month
  nama: string
  tipe: 'camping' | 'outbound' | 'event'
  fasilitas: string
  jam: string
  deskripsi: string
}

const NAMA_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

const HARI_MINGGU = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

export default function BookingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  useEffect(() => {
    async function loadBookings() {
      try {
        const res = await getApprovedBookings()
        if (res.data) {
          setBookings(res.data)
        }
      } catch (e) {
        console.error("Gagal memuat booking:", e)
      } finally {
        setLoading(false)
      }
    }
    loadBookings()
  }, [])

  // Get first day of the month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

  // Get total days in the month
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate()

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }

  // Calculate calendar days grid
  const daysGrid = []
  // Add offset empty slots for the first week
  for (let i = 0; i < firstDayOfMonth; i++) {
    daysGrid.push(null)
  }
  // Add the actual days of the month
  for (let d = 1; d <= totalDays; d++) {
    daysGrid.push(d)
  }

  // Helper to find if a day has a schedule
  const getSchedulesForDay = (day: number) => {
    const targetDate = new Date(currentYear, currentMonth, day)
    targetDate.setHours(0, 0, 0, 0)

    return bookings.map(b => {
      const hasCamping = b.fasilitas.some((f: string) => f.toLowerCase().includes('camping'))
      const hasOutbound = b.fasilitas.some((f: string) => 
        f.toLowerCase().includes('outbound') || 
        f.toLowerCase().includes('atv') || 
        f.toLowerCase().includes('kuda') || 
        f.toLowerCase().includes('ayunan') ||
        f.toLowerCase().includes('cemara')
      )
      const tipe: 'camping' | 'outbound' | 'event' = hasCamping ? 'camping' : (hasOutbound ? 'outbound' : 'event')

      const formatTime = (date: Date) => {
        return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
      }

      const start = new Date(b.tanggalMulai)
      const end = new Date(b.tanggalSelesai)

      const isSameDay = start.getDate() === end.getDate() && 
                        start.getMonth() === end.getMonth() && 
                        start.getFullYear() === end.getFullYear()

      let jam = ''
      if (isSameDay) {
        jam = `${formatTime(start)} - ${formatTime(end)} WIB`
      } else {
        const formatDay = (d: Date) => `${d.getDate()} ${NAMA_BULAN[d.getMonth()].substring(0, 3)}`
        jam = `${formatTime(start)} (${formatDay(start)}) - ${formatTime(end)} (${formatDay(end)})`
      }

      return {
        id: b.id,
        tanggalMulai: b.tanggalMulai,
        tanggalSelesai: b.tanggalSelesai,
        nama: `${b.jenisAcara} (${b.namaCustomer})`,
        tipe,
        fasilitas: b.fasilitas.join(', '),
        jam,
        deskripsi: b.catatanPengelola || 'Acara telah disetujui oleh pengelola Pantai Mliwis.'
      } as Schedule
    }).filter(s => {
      const startDate = new Date(s.tanggalMulai)
      startDate.setHours(0, 0, 0, 0)
      const endDate = new Date(s.tanggalSelesai)
      endDate.setHours(0, 0, 0, 0)

      return targetDate >= startDate && targetDate <= endDate
    })
  }

  return (
    <div className="calendar-card card" style={{ position: 'relative' }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      <div className="calendar-header">
        <div className="calendar-title-wrapper">
          <CalendarIcon size={22} className="text-primary" />
          <h3>Jadwal Penggunaan Area</h3>
        </div>
        <div className="calendar-nav">
          <button onClick={handlePrevMonth} className="btn-calendar-nav" aria-label="Bulan Sebelumnya">
            <ChevronLeft size={18} />
          </button>
          <span className="calendar-current-month">
            {NAMA_BULAN[currentMonth]} {currentYear}
          </span>
          <button onClick={handleNextMonth} className="btn-calendar-nav" aria-label="Bulan Berikutnya">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="calendar-body-grid">
        {/* Days of week header */}
        <div className="calendar-weekdays">
          {HARI_MINGGU.map((day, idx) => (
            <div key={day} className={`calendar-weekday ${idx === 0 ? 'text-danger' : ''}`}>
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="calendar-days">
          {daysGrid.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="calendar-day empty"></div>
            }

            const daySchedules = getSchedulesForDay(day)
            const isToday = new Date().getDate() === day && new Date().getMonth() === currentMonth && new Date().getFullYear() === currentYear
            
            return (
              <div
                key={`day-${day}`}
                className={`calendar-day ${isToday ? 'today' : ''} ${daySchedules.length > 0 ? 'has-event' : 'available'}`}
                onClick={() => {
                  if (daySchedules.length > 0) {
                    setSelectedSchedule(daySchedules[0])
                  }
                }}
                style={{ cursor: daySchedules.length > 0 ? 'pointer' : 'default' }}
              >
                <div className="day-number">{day}</div>
                <div className="day-events">
                  {daySchedules.map(sched => (
                    <div
                      key={sched.id}
                      className={`day-event-tag ${sched.tipe}`}
                      title={sched.nama}
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedSchedule(sched)
                      }}
                      style={{ 
                        cursor: 'pointer',
                        backgroundColor: sched.tipe === 'camping' ? '#f59e0b' : (sched.tipe === 'outbound' ? '#10b981' : '#3b82f6')
                      }}
                    >
                      {sched.tipe === 'camping' ? (
                        <Tent size={10} />
                      ) : sched.tipe === 'outbound' ? (
                        <TreePine size={10} />
                      ) : (
                        <CalendarIcon size={10} />
                      )}
                      <span className="event-name">{sched.nama}</span>
                    </div>
                  ))}
                  {daySchedules.length === 0 && (
                    <span className="available-indicator">Tersedia</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="calendar-footer-info">
        <div className="calendar-legend">
          <div className="legend-item">
            <span className="legend-color available"></span>
            <span>Tersedia / Kosong</span>
          </div>
          <div className="legend-item">
            <span className="legend-color camping" style={{ backgroundColor: '#f59e0b' }}></span>
            <span>Area Camping Terisi</span>
          </div>
          <div className="legend-item">
            <span className="legend-color outbound" style={{ backgroundColor: '#10b981' }}></span>
            <span>Area Outbound Terisi</span>
          </div>
          <div className="legend-item">
            <span className="legend-color event" style={{ backgroundColor: '#3b82f6' }}></span>
            <span>Area Lainnya Terisi</span>
          </div>
        </div>
        <div className="calendar-notice">
          <Info size={14} className="text-muted" />
          <p className="text-xs text-muted">
            Kalender di atas menunjukkan jadwal utama. Tanggal yang ditandai masih mungkin memiliki area lain yang kosong. Hubungi pengelola untuk konfirmasi.
          </p>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedSchedule && (
        <div
          className="calendar-modal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            animation: 'fadeIn 0.2s ease-out',
          }}
          onClick={() => setSelectedSchedule(null)}
        >
          <div
            className="calendar-modal-card"
            style={{
              backgroundColor: 'white',
              borderRadius: '24px',
              width: '90%',
              maxWidth: '480px',
              padding: '32px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              border: '1px solid var(--color-border-subtle)',
              position: 'relative',
              animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedSchedule(null)}
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-text-muted)',
                padding: '4px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-alt)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <X size={20} />
            </button>

            {/* Header / Event Type */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span
                className={`badge ${
                  selectedSchedule.tipe === 'camping' 
                    ? 'badge-success' 
                    : selectedSchedule.tipe === 'outbound' 
                      ? 'badge-info' 
                      : 'badge-warning'
                }`}
                style={{
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  letterSpacing: '0.05em',
                  padding: '6px 12px',
                  borderRadius: '20px',
                }}
              >
                {selectedSchedule.tipe === 'camping' 
                  ? 'Camping Ground' 
                  : selectedSchedule.tipe === 'outbound' 
                    ? 'Outbound Area' 
                    : 'Event / Area Lainnya'}
              </span>
            </div>

            {/* Event Title */}
            <h3
              style={{
                fontSize: '1.4rem',
                fontWeight: 800,
                color: 'var(--color-primary-950)',
                lineHeight: '1.3',
                marginBottom: '24px',
                letterSpacing: '-0.01em',
              }}
            >
              {selectedSchedule.nama}
            </h3>

            {/* Details List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '28px', textAlign: 'left' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                <CalendarIcon size={18} className="text-primary" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Rentang Tanggal</div>
                  <div style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--color-primary-950)', marginTop: '2px' }}>
                    {(() => {
                      const start = new Date(selectedSchedule.tanggalMulai)
                      const end = new Date(selectedSchedule.tanggalSelesai)
                      const isSameDayStr = start.getDate() === end.getDate() && 
                                          start.getMonth() === end.getMonth() && 
                                          start.getFullYear() === end.getFullYear()
                      if (isSameDayStr) {
                        return `${start.getDate()} ${NAMA_BULAN[start.getMonth()]} ${start.getFullYear()}`
                      } else {
                        return `${start.getDate()} ${NAMA_BULAN[start.getMonth()].substring(0, 3)} - ${end.getDate()} ${NAMA_BULAN[end.getMonth()]} ${end.getFullYear()}`
                      }
                    })()}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                <Clock size={18} className="text-primary" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Rentang Waktu / Jam</div>
                  <div style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--color-primary-950)', marginTop: '2px' }}>
                    {selectedSchedule.jam}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                <MapPin size={18} className="text-primary" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Fasilitas Yang Disewa</div>
                  <div style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--color-primary-950)', marginTop: '2px' }}>
                    {selectedSchedule.fasilitas}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                <AlignLeft size={18} className="text-primary" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Keterangan Acara</div>
                  <div style={{ fontSize: '0.925rem', color: 'var(--color-text)', lineHeight: '1.5', marginTop: '4px' }}>
                    {selectedSchedule.deskripsi}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Close Button */}
            <button
              onClick={() => setSelectedSchedule(null)}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                justifyContent: 'center',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Tutup Detail
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
