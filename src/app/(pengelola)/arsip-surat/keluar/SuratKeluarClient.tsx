'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, Download, Search, FileText } from 'lucide-react'
import { createSuratKeluar, updateSuratKeluar, deleteSuratKeluar } from '../actions'
import { formatTanggal } from '@/lib/format'
import { useToast } from '@/hooks/useToast'
import { compressImageIfNeeded } from '@/lib/utils'
import Modal from '@/components/ui/Modal'

interface SuratData {
  id: number; nomorSurat: string; tanggalSurat: string; pengirim: string; tujuan: string; perihal: string
  filePath: string | null; namaFile: string | null; user: { namaLengkap: string }
}

interface Props {
  initialData: { data: SuratData[]; total: number; totalPages: number }
  currentSearch: string; currentPage: number
}

export default function SuratKeluarClient({ initialData, currentSearch, currentPage }: Props) {
  const router = useRouter()
  const { addToast, removeToast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [showModal, setShowModal] = useState(false)
  const [editData, setEditData] = useState<SuratData | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [search, setSearch] = useState(currentSearch)

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    router.push(`/arsip-surat/keluar?${params.toString()}`)
  }

  const handleSubmit = async (formData: FormData) => {
    // Client-side file size and type validation
    const file = formData.get('file') as File | null
    if (file && file.size > 0) {
      if (file.size > 20 * 1024 * 1024) {
        addToast('Ukuran file lampiran maksimal 20MB', 'error')
        return
      }
      const ext = file.name.split('.').pop()?.toLowerCase() || ''
      const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'heic', 'heif', 'webp', 'gif', 'svg', 'bmp', 'tiff']
      if (!allowedExtensions.includes(ext) && !file.type.startsWith('image/') && file.type !== 'application/pdf') {
        addToast('Format file lampiran tidak didukung. Gunakan PDF, JPG, PNG, HEIC, HEIF, dll.', 'error')
        return
      }
    }

    const toastId = addToast('Menyimpan surat keluar dan mengunggah lampiran...', 'info')

    startTransition(async () => {
      try {
        // Compress file if it is an image
        if (file && file.size > 0) {
          const compressedFile = await compressImageIfNeeded(file, 1 * 1024 * 1024)
          formData.set('file', compressedFile)
        }

        const result = editData ? await updateSuratKeluar(editData.id, formData) : await createSuratKeluar(formData)

        removeToast(toastId)

        if (result.error) {
          addToast(result.error, 'error')
        } else {
          addToast(editData ? 'Surat berhasil diperbarui!' : 'Surat berhasil ditambahkan!', 'success')
          setShowModal(false)
          setEditData(null)
          router.refresh()
        }
      } catch (err: any) {
        removeToast(toastId)
        console.error('Client action error:', err)
        addToast(err.message || 'Terjadi kesalahan sistem saat menyimpan surat', 'error')
      }
    })
  }

  const handleDelete = async () => {
    if (!deleteId) return
    startTransition(async () => {
      const result = await deleteSuratKeluar(deleteId)
      if (result.error) addToast(result.error, 'error')
      else { addToast('Surat berhasil dihapus', 'success'); router.refresh() }
      setDeleteId(null)
    })
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left"><h1>Surat Keluar</h1><p>Kelola arsip surat keluar Pantai Mliwis</p></div>
        <button className="btn btn-primary" onClick={() => { setEditData(null); setShowModal(true) }}><Plus size={18} /> Tambah Surat</button>
      </div>

      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input className="search-input" placeholder="Cari nomor surat, tujuan, perihal..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
        </div>
        <button className="btn btn-primary" onClick={handleSearch}>Cari</button>
      </div>

      <div className="card">
        <div className="table-container" style={{ border: 'none' }}>
          <table className="table">
            <thead><tr><th>No</th><th>Nomor Surat</th><th>Tanggal</th><th>Tujuan</th><th>Perihal</th><th>File</th><th>Aksi</th></tr></thead>
            <tbody>
              {initialData.data.length === 0 && (
                <tr><td colSpan={7}><div className="empty-state"><FileText size={48} className="empty-state-icon" /><p className="empty-state-title">Belum ada surat keluar</p></div></td></tr>
              )}
              {initialData.data.map((s, i) => (
                <tr key={s.id}>
                  <td>{(currentPage - 1) * 10 + i + 1}</td>
                  <td><strong>{s.nomorSurat}</strong></td>
                  <td>{formatTanggal(s.tanggalSurat)}</td>
                  <td>{s.tujuan}</td>
                  <td className="truncate" style={{ maxWidth: 200 }}>{s.perihal}</td>
                  <td>{s.filePath ? <a href={s.filePath} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm"><Download size={14} /></a> : <span className="text-muted text-xs">—</span>}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn btn-ghost btn-sm btn-icon" onClick={() => { setEditData(s); setShowModal(true) }}><Pencil size={14} /></button>
                      <button className="btn btn-ghost btn-sm btn-icon text-danger" onClick={() => setDeleteId(s.id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {initialData.totalPages > 1 && (
          <div className="card-footer"><div className="pagination">
            <button className="pagination-btn" disabled={currentPage <= 1} onClick={() => router.push(`/arsip-surat/keluar?page=${currentPage - 1}&search=${search}`)}>←</button>
            {Array.from({ length: initialData.totalPages }, (_, i) => (<button key={i} className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`} onClick={() => router.push(`/arsip-surat/keluar?page=${i + 1}&search=${search}`)}>{i + 1}</button>))}
            <button className="pagination-btn" disabled={currentPage >= initialData.totalPages} onClick={() => router.push(`/arsip-surat/keluar?page=${currentPage + 1}&search=${search}`)}>→</button>
          </div></div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditData(null) }} title={editData ? 'Edit Surat Keluar' : 'Tambah Surat Keluar'} size="lg">
        <form action={handleSubmit}>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Nomor Surat <span className="required">*</span></label><input name="nomorSurat" className="form-input" defaultValue={editData?.nomorSurat} required /></div>
            <div className="form-group"><label className="form-label">Tanggal Surat <span className="required">*</span></label><input name="tanggalSurat" type="date" className="form-input" defaultValue={editData?.tanggalSurat?.split('T')[0]} required /></div>
          </div>
          <div className="form-group"><label className="form-label">Pengirim <span className="required">*</span></label><input name="pengirim" className="form-input" defaultValue={editData?.pengirim || 'Pengelola Pantai Mliwis'} required /></div>
          <div className="form-group"><label className="form-label">Tujuan <span className="required">*</span></label><input name="tujuan" className="form-input" defaultValue={editData?.tujuan} required /></div>
          <div className="form-group"><label className="form-label">Perihal <span className="required">*</span></label><textarea name="perihal" className="form-textarea" defaultValue={editData?.perihal} required /></div>
          <div className="form-group"><label className="form-label">File Lampiran</label><input name="file" type="file" className="form-input" accept=".pdf,.jpg,.jpeg,.png,.heic,.heif" /><p className="form-hint">Format: PDF, JPG, PNG, HEIC, HEIF. Maks 10MB.</p>{editData?.namaFile && <p className="form-hint">File saat ini: {editData.namaFile}</p>}</div>
          <div className="flex-end gap-3"><button type="button" className="btn btn-ghost" onClick={() => { setShowModal(false); setEditData(null) }}>Batal</button><button type="submit" className="btn btn-primary" disabled={isPending}>{isPending ? 'Menyimpan...' : 'Simpan'}</button></div>
        </form>
      </Modal>

      <Modal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} title="Hapus Surat" size="sm">
        <p>Apakah Anda yakin ingin menghapus surat ini?</p>
        <div className="flex-end gap-3 mt-6"><button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Batal</button><button className="btn btn-danger" onClick={handleDelete} disabled={isPending}>{isPending ? 'Menghapus...' : 'Hapus'}</button></div>
      </Modal>
    </div>
  )
}
