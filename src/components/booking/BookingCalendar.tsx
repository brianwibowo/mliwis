'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Tent, TreePine, Info } from 'lucide-react'

// Mock schedules for a premium realistic visual representation
interface Schedule {
  id: number
  tanggalMulai: number // day of current month
  tanggalSelesai: number // day of current month
  nama: string
  tipe: 'camping' | 'outbound' | 'event'
}

const NAMA_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

const HARI_MINGGU = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

export default function BookingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Generate some premium realistic mock schedules specific to the month
  // To keep it clean and mostly empty, we only have 2 mock events
  const mockSchedules: Schedule[] = [
    { id: 1, tanggalMulai: 12, tanggalSelesai: 14, nama: 'Camping Ceria Mandiri', tipe: 'camping' },
    { id: 2, tanggalMulai: 22, tanggalSelesai: 22, nama: 'Outbound Gathering BNI', tipe: 'outbound' },
  ]

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
    return mockSchedules.filter(s => day >= s.tanggalMulai && day <= s.tanggalSelesai)
  }

  return (
    <div className="calendar-card card">
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
              <div key={`day-${day}`} className={`calendar-day ${isToday ? 'today' : ''} ${daySchedules.length > 0 ? 'has-event' : 'available'}`}>
                <div className="day-number">{day}</div>
                <div className="day-events">
                  {daySchedules.map(sched => (
                    <div key={sched.id} className={`day-event-tag ${sched.tipe}`} title={sched.nama}>
                      {sched.tipe === 'camping' ? <Tent size={10} /> : <TreePine size={10} />}
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
            <span className="legend-color camping"></span>
            <span>Area Camping Terisi</span>
          </div>
          <div className="legend-item">
            <span className="legend-color outbound"></span>
            <span>Area Outbound Terisi</span>
          </div>
        </div>
        <div className="calendar-notice">
          <Info size={14} className="text-muted" />
          <p className="text-xs text-muted">
            Kalender di atas menunjukkan jadwal utama. Tanggal yang ditandai masih mungkin memiliki area lain yang kosong. Hubungi pengelola untuk konfirmasi.
          </p>
        </div>
      </div>
    </div>
  )
}
