'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, Download, Search, FileText, FilePlus2, ArrowLeft, Loader2, Eye } from 'lucide-react'
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

// Nama bulan untuk format tanggal di preview
const NAMA_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

function formatTanggalSurat(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getDate()} ${NAMA_BULAN[d.getMonth()]} ${d.getFullYear()}`
}

// Default values untuk form template surat
interface TemplateSuratForm {
  nomorSurat: string
  lampiran: string
  perihal: string
  tanggalSurat: string
  tempatSurat: string
  tujuan: string
  tujuanAlamat: string
  isiSurat: string
  namaPenandatangan: string
  jabatanPenandatangan: string
}

const defaultTemplateForm: TemplateSuratForm = {
  nomorSurat: '',
  lampiran: '-',
  perihal: '',
  tanggalSurat: new Date().toISOString().split('T')[0],
  tempatSurat: 'Kebumen',
  tujuan: '',
  tujuanAlamat: '',
  isiSurat: '',
  namaPenandatangan: '',
  jabatanPenandatangan: 'Ketua Pokdarwis',
}

export default function SuratKeluarClient({ initialData, currentSearch, currentPage }: Props) {
  const router = useRouter()
  const { addToast, removeToast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [showModal, setShowModal] = useState(false)
  const [editData, setEditData] = useState<SuratData | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [search, setSearch] = useState(currentSearch)

  // Template surat state
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [templateForm, setTemplateForm] = useState<TemplateSuratForm>({ ...defaultTemplateForm })
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

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

  // ==================== TEMPLATE SURAT HANDLERS ====================

  const updateTemplateField = (field: keyof TemplateSuratForm, value: string) => {
    setTemplateForm(prev => ({ ...prev, [field]: value }))
  }

  const handleOpenTemplate = () => {
    setTemplateForm({ ...defaultTemplateForm })
    setShowTemplateModal(true)
  }

  const handleShowPreview = () => {
    // Validasi field wajib
    if (!templateForm.nomorSurat.trim()) { addToast('Nomor surat wajib diisi', 'error'); return }
    if (!templateForm.perihal.trim()) { addToast('Perihal wajib diisi', 'error'); return }
    if (!templateForm.tujuan.trim()) { addToast('Tujuan/Kepada wajib diisi', 'error'); return }
    if (!templateForm.isiSurat.trim()) { addToast('Isi surat wajib diisi', 'error'); return }
    if (!templateForm.namaPenandatangan.trim()) { addToast('Nama penandatangan wajib diisi', 'error'); return }

    setShowTemplateModal(false)
    setShowPreviewModal(true)
  }

  const handleBackToEdit = () => {
    setShowPreviewModal(false)
    setShowTemplateModal(true)
  }

  const handleDownloadPDF = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/arsip-surat/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateForm),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Gagal meng-generate PDF')
      }

      // Buka PDF yang sudah tersimpan di server/cloud di tab baru
      window.open(result.filePath, '_blank')

      addToast('Surat berhasil di-generate dan tersimpan di arsip!', 'success')
      setShowPreviewModal(false)
      setTemplateForm({ ...defaultTemplateForm })
      router.refresh()
    } catch (err: any) {
      console.error('Gagal generate PDF:', err)
      addToast(err.message || 'Gagal meng-generate PDF surat', 'error')
    } finally {
      setIsGenerating(false)
    }
  }

  // ==================== RENDER ====================

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left"><h1>Surat Keluar</h1><p>Kelola arsip surat keluar Pantai Mliwis</p></div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={handleOpenTemplate} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FilePlus2 size={18} /> Buat Surat
          </button>
          <button className="btn btn-outline" onClick={() => { setEditData(null); setShowModal(true) }} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={18} /> Arsipkan Manual
          </button>
        </div>
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

      {/* ==================== MODAL: Arsipkan Manual (existing) ==================== */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditData(null) }} title={editData ? 'Edit Surat Keluar' : 'Arsipkan Surat Keluar'} size="lg">
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

      {/* ==================== MODAL: Hapus Surat ==================== */}
      <Modal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} title="Hapus Surat" size="sm">
        <p>Apakah Anda yakin ingin menghapus surat ini?</p>
        <div className="flex-end gap-3 mt-6"><button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Batal</button><button className="btn btn-danger" onClick={handleDelete} disabled={isPending}>{isPending ? 'Menghapus...' : 'Hapus'}</button></div>
      </Modal>

      {/* ==================== MODAL: Form Template Surat Keluar ==================== */}
      <Modal isOpen={showTemplateModal} onClose={() => setShowTemplateModal(false)} title="Buat Surat Keluar" size="lg">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Nomor Surat <span className="required">*</span></label>
              <input
                className="form-input"
                placeholder="Contoh: 001/POKDARWIS/VII/2026"
                value={templateForm.nomorSurat}
                onChange={(e) => updateTemplateField('nomorSurat', e.target.value)}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Lampiran</label>
              <input
                className="form-input"
                placeholder="Contoh: 1 Berkas"
                value={templateForm.lampiran}
                onChange={(e) => updateTemplateField('lampiran', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Tanggal Surat <span className="required">*</span></label>
              <input
                type="date"
                className="form-input"
                value={templateForm.tanggalSurat}
                onChange={(e) => updateTemplateField('tanggalSurat', e.target.value)}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Tempat Surat</label>
              <input
                className="form-input"
                placeholder="Kebumen"
                value={templateForm.tempatSurat}
                onChange={(e) => updateTemplateField('tempatSurat', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Perihal <span className="required">*</span></label>
            <input
              className="form-input"
              placeholder="Contoh: Undangan Rapat Koordinasi"
              value={templateForm.perihal}
              onChange={(e) => updateTemplateField('perihal', e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Kepada / Tujuan <span className="required">*</span></label>
              <input
                className="form-input"
                placeholder="Contoh: Seluruh Anggota Pokdarwis"
                value={templateForm.tujuan}
                onChange={(e) => updateTemplateField('tujuan', e.target.value)}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Alamat Tujuan</label>
              <input
                className="form-input"
                placeholder="Contoh: Tempat"
                value={templateForm.tujuanAlamat}
                onChange={(e) => updateTemplateField('tujuanAlamat', e.target.value)}
              />
              <p className="form-hint">Opsional. Akan tampil sebagai &ldquo;di [alamat]&rdquo;</p>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Isi Surat <span className="required">*</span></label>
            <textarea
              className="form-textarea"
              rows={8}
              placeholder={"Dengan hormat,\n\nBersama surat ini kami sampaikan bahwa...\n\nDemikian surat ini kami sampaikan, atas perhatian dan kerjasamanya kami ucapkan terima kasih."}
              value={templateForm.isiSurat}
              onChange={(e) => updateTemplateField('isiSurat', e.target.value)}
              style={{ minHeight: '180px', resize: 'vertical' }}
            />
            <p className="form-hint">Gunakan Enter 2 kali untuk membuat paragraf baru. Setiap paragraf akan otomatis diindentasi.</p>
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Nama Penandatangan <span className="required">*</span></label>
              <input
                className="form-input"
                placeholder="Contoh: Warni"
                value={templateForm.namaPenandatangan}
                onChange={(e) => updateTemplateField('namaPenandatangan', e.target.value)}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Jabatan Penandatangan</label>
              <input
                className="form-input"
                placeholder="Contoh: Ketua Pokdarwis"
                value={templateForm.jabatanPenandatangan}
                onChange={(e) => updateTemplateField('jabatanPenandatangan', e.target.value)}
              />
            </div>
          </div>

          <div className="flex-end gap-3" style={{ marginTop: '8px' }}>
            <button type="button" className="btn btn-ghost" onClick={() => setShowTemplateModal(false)}>Batal</button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleShowPreview}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Eye size={16} /> Lihat Preview
            </button>
          </div>
        </div>
      </Modal>

      {/* ==================== MODAL: Preview Surat ==================== */}
      <Modal isOpen={showPreviewModal} onClose={() => setShowPreviewModal(false)} title="Preview Surat Keluar" size="xl">
        <div style={{ maxHeight: '70vh', overflowY: 'auto', padding: '8px' }}>
          <div className="surat-preview">
            {/* Kop Surat */}
            <div className="surat-preview-kop">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo_mliwis.jpg" alt="Logo" />
              <div className="surat-preview-kop-text">
                <h2>Pemerintah Kabupaten Kebumen</h2>
                <h3>Pengelola Obyek Wisata Pantai Mliwis</h3>
                <p>Kecamatan Ambal, Kabupaten Kebumen, Jawa Tengah</p>
              </div>
            </div>

            {/* Detail Surat */}
            <div className="surat-preview-meta">
              <div className="surat-preview-meta-left">
                <table>
                  <tbody>
                    <tr>
                      <td>Nomor</td>
                      <td>:</td>
                      <td>{templateForm.nomorSurat}</td>
                    </tr>
                    <tr>
                      <td>Lampiran</td>
                      <td>:</td>
                      <td>{templateForm.lampiran || '-'}</td>
                    </tr>
                    <tr>
                      <td>Perihal</td>
                      <td>:</td>
                      <td>{templateForm.perihal}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="surat-preview-meta-right">
                {templateForm.tempatSurat}, {formatTanggalSurat(templateForm.tanggalSurat)}
              </div>
            </div>

            {/* Tujuan */}
            <div className="surat-preview-tujuan">
              <p className="tujuan-label">Kepada Yth.</p>
              <p className="tujuan-nama">{templateForm.tujuan}</p>
              {templateForm.tujuanAlamat && (
                <p className="tujuan-tempat">di {templateForm.tujuanAlamat}</p>
              )}
            </div>

            {/* Isi Surat */}
            <div>
              {templateForm.isiSurat
                .split(/\n\s*\n/)
                .map(p => p.trim())
                .filter(p => p.length > 0)
                .map((para, index) => (
                  <div key={index} className="surat-preview-body">
                    {para}
                  </div>
                ))}
            </div>

            {/* Tanda Tangan */}
            <div className="surat-preview-ttd">
              <div className="surat-preview-ttd-box">
                <div className="ttd-tempat-tanggal">
                  {templateForm.tempatSurat}, {formatTanggalSurat(templateForm.tanggalSurat)}
                </div>
                <div className="ttd-jabatan">{templateForm.jabatanPenandatangan}</div>
                <div className="ttd-nama">{templateForm.namaPenandatangan}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--color-border-light)' }}>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={handleBackToEdit}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ArrowLeft size={16} /> Kembali Edit
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleDownloadPDF}
            disabled={isGenerating || isSaving}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {isGenerating ? (
              <><Loader2 size={16} className="animate-spin" /> Membuat PDF...</>
            ) : isSaving ? (
              <><Loader2 size={16} className="animate-spin" /> Menyimpan Arsip...</>
            ) : (
              <><Download size={16} /> Download PDF</>
            )}
          </button>
        </div>
      </Modal>
    </div>
  )
}
