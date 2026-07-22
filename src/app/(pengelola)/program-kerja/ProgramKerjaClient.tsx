'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Pencil, Trash2, ClipboardList, Search, Eye, Upload, X } from 'lucide-react'
import { createProgramKerja, updateProgramKerja, deleteProgramKerja } from './actions'
import { formatRupiah, formatTanggal } from '@/lib/format'
import { STATUS_PROGRAM_KERJA } from '@/lib/constants'
import { useToast } from '@/hooks/useToast'
import { prepareUploadFile } from '@/lib/uploadHelper'
import Modal from '@/components/ui/Modal'

interface Dokumentasi {
  id: number
  filePath: string
  namaFile: string
}

interface ProgramKerjaData {
  id: number
  namaKegiatan: string
  tanggalKegiatan: string
  jumlahDana: number
  sumberDana: string
  statusKegiatan: string
  dokumentasi: Dokumentasi[]
  user: { namaLengkap: string }
}

interface Props {
  initialData: {
    data: ProgramKerjaData[]
    total: number
    totalPages: number
  }
  initialSearch: string
  initialStatus: string
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'Rencana': return 'badge-warning'
    case 'Berjalan': return 'badge-info'
    case 'Selesai': return 'badge-success'
    default: return 'badge-default'
  }
}

export default function ProgramKerjaClient({ initialData, initialSearch, initialStatus }: Props) {
  const router = useRouter()
  const { addToast, removeToast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [showModal, setShowModal] = useState(false)
  const [editData, setEditData] = useState<ProgramKerjaData | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [search, setSearch] = useState(initialSearch)
  const [statusFilter, setStatusFilter] = useState(initialStatus)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [deletedDocIds, setDeletedDocIds] = useState<number[]>([])
  const [danaRaw, setDanaRaw] = useState('')
  const { data, totalPages } = initialData
  const [currentPage] = useState(1)

  const handleDanaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '')
    setDanaRaw(rawVal)
  }

  const navigate = (s?: string, st?: string, p?: number) => {
    const params = new URLSearchParams()
    if (s) params.set('search', s)
    if (st && st !== 'Semua') params.set('status', st)
    if (p && p > 1) params.set('page', String(p))
    router.push(`/program-kerja?${params.toString()}`)
  }

  const handleSearch = () => navigate(search, statusFilter)

  const handleStatusChange = (s: string) => {
    setStatusFilter(s)
    navigate(search, s)
  }

  const openAddModal = () => {
    setEditData(null)
    setSelectedFiles([])
    setDeletedDocIds([])
    setDanaRaw('')
    setShowModal(true)
  }

  const openEditModal = (pk: ProgramKerjaData) => {
    setEditData(pk)
    setSelectedFiles([])
    setDeletedDocIds([])
    setDanaRaw(pk.jumlahDana.toString())
    setShowModal(true)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const filesArray = Array.from(e.target.files)
    
    const processed: File[] = []
    for (const f of filesArray) {
      const { file, error } = await prepareUploadFile(f, {
        notifyFn: (msg, type) => addToast(msg, type),
        removeNotifyFn: (id) => id && removeToast(id),
      })
      if (error) {
        addToast(error, 'error')
      } else if (file) {
        processed.push(file)
      }
    }

    if (processed.length > 0) {
      setSelectedFiles(prev => [...prev, ...processed])
    }
    e.target.value = ''
  }

  const removeNewFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const markDocForDeletion = (docId: number) => {
    setDeletedDocIds(prev => [...prev, docId])
  }

  const handleSubmit = (formData: FormData) => {
    // Client-side file size and type validation for documentation files
    const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'heic', 'heif', 'webp', 'gif', 'svg', 'bmp', 'tiff']
    for (const file of selectedFiles) {
      if (file.size > 20 * 1024 * 1024) {
        addToast(`Ukuran berkas "${file.name}" maksimal 20MB`, 'error')
        return
      }
      const ext = file.name.split('.').pop()?.toLowerCase() || ''
      if (!allowedExtensions.includes(ext) && !file.type.startsWith('image/')) {
        addToast(`Format berkas "${file.name}" tidak didukung.`, 'error')
        return
      }
    }

    const toastId = addToast('Menyimpan program kerja dan mengunggah dokumentasi...', 'info')

    startTransition(async () => {
      try {
        // Remove default file input entries and append pre-processed files
        formData.delete('dokumentasi')
        selectedFiles.forEach((f: File) => formData.append('dokumentasi', f))

        if (editData && deletedDocIds.length > 0) {
          formData.set('deletedDokumentasiIds', JSON.stringify(deletedDocIds))
        }

        const r = editData
          ? await updateProgramKerja(editData.id, formData)
          : await createProgramKerja(formData)

        removeToast(toastId)

        if (r.error) {
          addToast(r.error, 'error')
        } else {
          addToast(editData ? 'Program kerja berhasil diperbarui!' : 'Program kerja berhasil ditambahkan!', 'success')
          setShowModal(false)
          setEditData(null)
          setSelectedFiles([])
          setDeletedDocIds([])
          router.refresh()
        }
      } catch (err: any) {
        removeToast(toastId)
        console.error('Client action error:', err)
        addToast(err.message || 'Terjadi kesalahan sistem saat menyimpan program kerja', 'error')
      }
    })
  }

  const handleDelete = () => {
    if (!deleteId) return
    startTransition(async () => {
      const r = await deleteProgramKerja(deleteId)
      if (r.error) addToast(r.error, 'error')
      else { addToast('Program kerja dihapus', 'success'); router.refresh() }
      setDeleteId(null)
    })
  }

  // Docs that are still "alive" (not marked for deletion) when editing
  const existingDocs = editData
    ? editData.dokumentasi.filter(d => !deletedDocIds.includes(d.id))
    : []

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Program Kerja</h1>
          <p>Pokdarwis Pantai Mliwis</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} /> Tambah Program Kerja
        </button>
      </div>

      <div className="stat-card mb-6">
        <div className="stat-icon blue">
          <ClipboardList size={24} />
        </div>
        <div className="stat-content">
          <div className="stat-value">{initialData.total}</div>
          <div className="stat-label">Total Program Kerja</div>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-group">
          <input
            className="form-input"
            placeholder="Cari nama kegiatan..."
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
          {STATUS_PROGRAM_KERJA.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="card">
        <div className="table-container" style={{ border: 'none' }}>
          <table className="table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Kegiatan</th>
                <th>Tanggal</th>
                <th>Jumlah Dana</th>
                <th>Sumber Dana</th>
                <th>Status</th>
                <th>Dok.</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 && (
                <tr>
                  <td colSpan={8}>
                    <div className="empty-state" style={{ padding: 40 }}>
                      <p className="empty-state-title">Belum ada data program kerja</p>
                    </div>
                  </td>
                </tr>
              )}
              {data.map((pk, i) => (
                <tr key={pk.id}>
                  <td>{i + 1}</td>
                  <td className="font-semibold">{pk.namaKegiatan}</td>
                  <td>{formatTanggal(pk.tanggalKegiatan)}</td>
                  <td className="font-semibold">{formatRupiah(pk.jumlahDana)}</td>
                  <td>{pk.sumberDana}</td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(pk.statusKegiatan)}`}>
                      {pk.statusKegiatan}
                    </span>
                  </td>
                  <td className="text-center">{pk.dokumentasi.length}</td>
                  <td>
                    <div className="table-actions">
                      <Link href={`/program-kerja/${pk.id}`} className="btn btn-ghost btn-sm btn-icon" title="Lihat Detail">
                        <Eye size={14} />
                      </Link>
                      <button className="btn btn-ghost btn-sm btn-icon" onClick={() => openEditModal(pk)}>
                        <Pencil size={14} />
                      </button>
                      <button className="btn btn-ghost btn-sm btn-icon text-danger" onClick={() => setDeleteId(pk.id)}>
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
                  onClick={() => navigate(search, statusFilter, i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal Form Tambah/Edit */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditData(null); setDanaRaw('') }} title={editData ? 'Edit Program Kerja' : 'Tambah Program Kerja'} size="lg">
        <form action={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nama Kegiatan <span className="required">*</span></label>
              <input name="namaKegiatan" className="form-input" defaultValue={editData?.namaKegiatan} placeholder="Nama kegiatan..." required />
            </div>
            <div className="form-group">
              <label className="form-label">Tanggal Kegiatan <span className="required">*</span></label>
              <input name="tanggalKegiatan" type="date" className="form-input" defaultValue={editData?.tanggalKegiatan?.split('T')[0]} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Jumlah Dana (Rp) <span className="required">*</span></label>
              <input 
                type="text" 
                className="form-input" 
                value={danaRaw ? Number(danaRaw).toLocaleString('id-ID') : ''} 
                onChange={handleDanaChange} 
                placeholder="Contoh: 5.000.000" 
                required 
              />
              <input name="jumlahDana" type="hidden" value={danaRaw} />
            </div>
            <div className="form-group">
              <label className="form-label">Sumber Dana <span className="required">*</span></label>
              <input name="sumberDana" className="form-input" defaultValue={editData?.sumberDana} placeholder="Contoh: APBD, Swadaya, Sponsor..." required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Status Kegiatan <span className="required">*</span></label>
            <select name="statusKegiatan" className="form-select" defaultValue={editData?.statusKegiatan || 'Rencana'} required>
              {STATUS_PROGRAM_KERJA.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Existing documents (edit mode) */}
          {existingDocs.length > 0 && (
            <div className="form-group">
              <label className="form-label">Dokumentasi Saat Ini</label>
              <div className="file-list">
                {existingDocs.map((doc) => (
                  <div key={doc.id} className="file-item">
                    <span className="file-item-name">{doc.namaFile}</span>
                    <button type="button" className="file-item-remove" onClick={() => markDocForDeletion(doc.id)} title="Hapus">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New file uploads */}
          <div className="form-group">
            <label className="form-label">{editData ? 'Tambah Dokumentasi' : 'Upload Dokumentasi'}</label>
            <div className="file-upload-area">
              <label className="file-upload-trigger">
                <Upload size={20} />
                <span>Pilih file gambar...</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  multiple
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
            {selectedFiles.length > 0 && (
              <div className="file-list" style={{ marginTop: 8 }}>
                {selectedFiles.map((f, i) => (
                  <div key={i} className="file-item">
                    <span className="file-item-name">{f.name}</span>
                    <button type="button" className="file-item-remove" onClick={() => removeNewFile(i)} title="Hapus">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex-end gap-3">
            <button type="button" className="btn btn-ghost" onClick={() => { setShowModal(false); setEditData(null) }}>Batal</button>
            <button type="submit" className="btn btn-primary" disabled={isPending}>{isPending ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
        </form>
      </Modal>

      {/* Modal Hapus */}
      <Modal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} title="Hapus Program Kerja" size="sm">
        <p>Yakin hapus program kerja ini? Semua dokumentasi akan ikut terhapus.</p>
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
