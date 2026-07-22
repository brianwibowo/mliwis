'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, Download, Search, FileText, FilePlus2, ArrowLeft, Loader2, Eye, FileDown } from 'lucide-react'
import { createSuratKeluar, updateSuratKeluar, deleteSuratKeluar } from '../actions'
import { formatTanggal } from '@/lib/format'
import { useToast } from '@/hooks/useToast'
import { prepareUploadFile } from '@/lib/uploadHelper'
import Modal from '@/components/ui/Modal'

interface SuratData {
  id: number; nomorSurat: string; tanggalSurat: string; pengirim: string; tujuan: string; perihal: string
  filePath: string | null; namaFile: string | null; user: { namaLengkap: string }
  isiSurat?: string | null;
  tempatSurat?: string | null;
  tujuanAlamat?: string | null;
  lampiran?: string | null;
  namaPenandatangan?: string | null;
  jabatanPenandatangan?: string | null;
  namaPenandatangan2?: string | null;
  jabatanPenandatangan2?: string | null;
  namaPenandatangan3?: string | null;
  jabatanPenandatangan3?: string | null;
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

function parseParagraphContent(text: string) {
  const lines = text.split('\n');
  const blocks: any[] = [];
  let currentDetails: any[] = [];

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    let isDetail = false;
    let key = '';
    let val = '';

    if (colonIndex > 0) {
      key = line.substring(0, colonIndex).trim();
      val = line.substring(colonIndex + 1).trim();
      if (key.length > 0 && key.length <= 25 && val.length > 0) {
        const firstWord = key.split(' ')[0].toLowerCase();
        const commonParagraphWords = ['dengan', 'bahwa', 'sehubungan', 'kami', 'saya', 'adalah'];
        if (!commonParagraphWords.includes(firstWord)) {
          isDetail = true;
        }
      }
    }

    if (isDetail) {
      currentDetails.push({ key, value: val });
    } else {
      if (currentDetails.length > 0) {
        blocks.push({ type: 'details', items: currentDetails });
        currentDetails = [];
      }
      blocks.push({ type: 'text', content: line });
    }
  }

  if (currentDetails.length > 0) {
    blocks.push({ type: 'details', items: currentDetails });
  }

  return blocks;
}

function capitalizeWords(str: string): string {
  if (!str) return ''
  const prepositions = ['di', 'ke', 'yang', 'dan', 'untuk', 'dari', 'pada', 'dengan']
  return str
    .split(' ')
    .map((word, index) => {
      if (!word) return ''
      const cleanedWord = word.toLowerCase()
      if (index > 0 && prepositions.includes(cleanedWord)) {
        return cleanedWord
      }
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

function capitalizeParagraph(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Default values untuk form template surat
interface TemplateSuratForm {
  id?: number
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
  namaPenandatangan2: string
  jabatanPenandatangan2: string
  namaPenandatangan3: string
  jabatanPenandatangan3: string
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
  namaPenandatangan2: '',
  jabatanPenandatangan2: '',
  namaPenandatangan3: '',
  jabatanPenandatangan3: '',
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
  const [activeSignaturesCount, setActiveSignaturesCount] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    router.push(`/arsip-surat/keluar?${params.toString()}`)
  }

  const handleSubmit = async (formData: FormData) => {
    // Client-side file size and type validation
    // Capitalize fields in manual archive form
    const tujuanManual = formData.get('tujuan') as string
    const perihalManual = formData.get('perihal') as string
    const pengirimManual = formData.get('pengirim') as string
    
    if (tujuanManual) formData.set('tujuan', capitalizeWords(tujuanManual))
    if (perihalManual) formData.set('perihal', capitalizeWords(perihalManual))
    if (pengirimManual) formData.set('pengirim', capitalizeWords(pengirimManual))

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
        if (file && file.size > 0) {
          const { file: processed, error } = await prepareUploadFile(file, {
            notifyFn: (msg, type) => addToast(msg, type),
            removeNotifyFn: (id) => id && removeToast(id),
          })
          if (error) {
            removeToast(toastId)
            addToast(error, 'error')
            return
          }
          if (processed) {
            formData.set('file', processed)
          }
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
    let formattedValue = value
    if (field === 'isiSurat') {
      formattedValue = capitalizeParagraph(value)
    } else if (
      field !== 'tanggalSurat' && 
      field !== 'id'
    ) {
      formattedValue = capitalizeWords(value)
    }
    setTemplateForm(prev => ({ ...prev, [field]: formattedValue }))
  }

  const handleOpenTemplate = () => {
    setTemplateForm({ ...defaultTemplateForm })
    setActiveSignaturesCount(1)
    setShowTemplateModal(true)
  }

  const handleShowPreview = () => {
    // Validasi field wajib
    if (!templateForm.nomorSurat.trim()) { addToast('Nomor surat wajib diisi', 'error'); return }
    if (!templateForm.perihal.trim()) { addToast('Perihal wajib diisi', 'error'); return }
    if (!templateForm.tujuan.trim()) { addToast('Tujuan/Kepada wajib diisi', 'error'); return }
    if (!templateForm.isiSurat.trim()) { addToast('Isi surat wajib diisi', 'error'); return }
    if (!templateForm.namaPenandatangan.trim()) { addToast('Nama penandatangan 1 wajib diisi', 'error'); return }
    if (!templateForm.jabatanPenandatangan.trim()) { addToast('Jabatan penandatangan 1 wajib diisi', 'error'); return }

    if (activeSignaturesCount >= 2) {
      if (!templateForm.namaPenandatangan2.trim()) { addToast('Nama penandatangan 2 wajib diisi', 'error'); return }
      if (!templateForm.jabatanPenandatangan2.trim()) { addToast('Jabatan penandatangan 2 wajib diisi', 'error'); return }
    }
    if (activeSignaturesCount === 3) {
      if (!templateForm.namaPenandatangan3.trim()) { addToast('Nama penandatangan 3 wajib diisi', 'error'); return }
      if (!templateForm.jabatanPenandatangan3.trim()) { addToast('Jabatan penandatangan 3 wajib diisi', 'error'); return }
    }

    // Capitalize inputs automatically
    setTemplateForm(prev => ({
      ...prev,
      perihal: capitalizeWords(prev.perihal),
      tujuan: capitalizeWords(prev.tujuan),
      tujuanAlamat: capitalizeWords(prev.tujuanAlamat),
      tempatSurat: capitalizeWords(prev.tempatSurat),
      lampiran: capitalizeWords(prev.lampiran),
      namaPenandatangan: capitalizeWords(prev.namaPenandatangan),
      jabatanPenandatangan: capitalizeWords(prev.jabatanPenandatangan),
      namaPenandatangan2: prev.namaPenandatangan2 ? capitalizeWords(prev.namaPenandatangan2) : '',
      jabatanPenandatangan2: prev.jabatanPenandatangan2 ? capitalizeWords(prev.jabatanPenandatangan2) : '',
      namaPenandatangan3: prev.namaPenandatangan3 ? capitalizeWords(prev.namaPenandatangan3) : '',
      jabatanPenandatangan3: prev.jabatanPenandatangan3 ? capitalizeWords(prev.jabatanPenandatangan3) : '',
    }))

    setShowTemplateModal(false)
    setShowPreviewModal(true)
  }

  const handleBackToEdit = () => {
    setShowPreviewModal(false)
    setShowTemplateModal(true)
  }

  const handleSaveLetter = async (openNewTab = true) => {
    setIsGenerating(true)
    try {
      // Filter payload based on active signatures count
      const payload = {
        ...templateForm,
        namaPenandatangan2: activeSignaturesCount >= 2 ? templateForm.namaPenandatangan2 : '',
        jabatanPenandatangan2: activeSignaturesCount >= 2 ? templateForm.jabatanPenandatangan2 : '',
        namaPenandatangan3: activeSignaturesCount === 3 ? templateForm.namaPenandatangan3 : '',
        jabatanPenandatangan3: activeSignaturesCount === 3 ? templateForm.jabatanPenandatangan3 : '',
      }

      const response = await fetch('/api/arsip-surat/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Gagal menyimpan surat')
      }

      if (openNewTab) {
        // Buka PDF yang sudah tersimpan di server/cloud di tab baru
        window.open(result.filePath, '_blank')
        addToast('Surat berhasil disimpan ke arsip dan diunduh!', 'success')
      } else {
        addToast('Surat berhasil disimpan ke arsip!', 'success')
      }

      setShowPreviewModal(false)
      setTemplateForm({ ...defaultTemplateForm })
      setEditData(null)
      setActiveSignaturesCount(1)
      router.refresh()
    } catch (err: any) {
      console.error('Gagal menyimpan surat:', err)
      addToast(err.message || 'Gagal menyimpan surat', 'error')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadDocx = async () => {
    try {
      const { generateAndDownloadDocx } = await import('./docxGenerator')
      await generateAndDownloadDocx(templateForm, activeSignaturesCount)
      addToast('File Word (DOCX) berhasil diunduh!', 'success')
    } catch (err: any) {
      console.error('Gagal generate Word:', err)
      addToast('Gagal men-generate file Word (DOCX)', 'error')
    }
  }

  const handleEditClick = (s: SuratData) => {
    if (s.isiSurat) {
      setEditData(s)
      setTemplateForm({
        id: s.id,
        nomorSurat: s.nomorSurat,
        lampiran: s.lampiran || '-',
        perihal: s.perihal,
        tanggalSurat: s.tanggalSurat.substring(0, 10),
        tempatSurat: s.tempatSurat || 'Kebumen',
        tujuan: s.tujuan,
        tujuanAlamat: s.tujuanAlamat || '',
        isiSurat: s.isiSurat || '',
        namaPenandatangan: s.namaPenandatangan || '',
        jabatanPenandatangan: s.jabatanPenandatangan || '',
        namaPenandatangan2: s.namaPenandatangan2 || '',
        jabatanPenandatangan2: s.jabatanPenandatangan2 || '',
        namaPenandatangan3: s.namaPenandatangan3 || '',
        jabatanPenandatangan3: s.jabatanPenandatangan3 || '',
      })
      
      if (s.namaPenandatangan3) {
        setActiveSignaturesCount(3)
      } else if (s.namaPenandatangan2) {
        setActiveSignaturesCount(2)
      } else {
        setActiveSignaturesCount(1)
      }
      setShowTemplateModal(true)
    } else {
      setEditData(s)
      setShowModal(true)
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
                      <button className="btn btn-ghost btn-sm btn-icon" onClick={() => handleEditClick(s)}><Pencil size={14} /></button>
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
          <div className="form-group"><label className="form-label">Pengirim <span className="required">*</span></label><input name="pengirim" className="form-input" defaultValue={editData?.pengirim || 'Pengelola Pantai Mliwis'} style={{ textTransform: 'capitalize' }} required /></div>
          <div className="form-group"><label className="form-label">Tujuan <span className="required">*</span></label><input name="tujuan" className="form-input" defaultValue={editData?.tujuan} style={{ textTransform: 'capitalize' }} required /></div>
          <div className="form-group"><label className="form-label">Perihal <span className="required">*</span></label><textarea name="perihal" className="form-textarea" defaultValue={editData?.perihal} style={{ textTransform: 'capitalize', minHeight: '80px' }} required /></div>
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
                style={{ textTransform: 'capitalize' }}
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
                style={{ textTransform: 'capitalize' }}
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
              style={{ textTransform: 'capitalize' }}
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
                style={{ textTransform: 'capitalize' }}
                onChange={(e) => updateTemplateField('tujuan', e.target.value)}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Alamat Tujuan</label>
              <input
                className="form-input"
                placeholder="Contoh: Tempat"
                value={templateForm.tujuanAlamat}
                style={{ textTransform: 'capitalize' }}
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

          {/* Tanda Tangan Section */}
          <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '16px', marginTop: '16px' }}>
            <h4 style={{ color: 'var(--color-primary-950)', marginBottom: '12px', fontWeight: 600 }}>Pengaturan Tanda Tangan</h4>
            
            {/* TTD 1 (Wajib) */}
            <div className="form-row" style={{ marginBottom: '16px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Nama Penandatangan 1 <span className="required">*</span></label>
                <input
                  className="form-input"
                  placeholder="Contoh: Warni"
                  value={templateForm.namaPenandatangan}
                  style={{ textTransform: 'capitalize' }}
                  onChange={(e) => updateTemplateField('namaPenandatangan', e.target.value)}
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Jabatan Penandatangan 1 <span className="required">*</span></label>
                <input
                  className="form-input"
                  placeholder="Contoh: Ketua Pokdarwis"
                  value={templateForm.jabatanPenandatangan}
                  style={{ textTransform: 'capitalize' }}
                  onChange={(e) => updateTemplateField('jabatanPenandatangan', e.target.value)}
                />
              </div>
            </div>

            {/* TTD 2 (Opsional) */}
            {activeSignaturesCount >= 2 && (
              <div className="form-row" style={{ marginBottom: '16px', padding: '12px', backgroundColor: 'var(--color-surface-alt)', borderRadius: '12px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Nama Penandatangan 2 <span className="required">*</span></label>
                  <input
                    className="form-input"
                    placeholder="Contoh: Budi"
                    value={templateForm.namaPenandatangan2}
                    style={{ textTransform: 'capitalize' }}
                    onChange={(e) => updateTemplateField('namaPenandatangan2', e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Jabatan Penandatangan 2 <span className="required">*</span></label>
                  <input
                    className="form-input"
                    placeholder="Contoh: Sekretaris"
                    value={templateForm.jabatanPenandatangan2}
                    style={{ textTransform: 'capitalize' }}
                    onChange={(e) => updateTemplateField('jabatanPenandatangan2', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* TTD 3 (Opsional) */}
            {activeSignaturesCount === 3 && (
              <div className="form-row" style={{ marginBottom: '16px', padding: '12px', backgroundColor: 'var(--color-surface-alt)', borderRadius: '12px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Nama Penandatangan 3 <span className="required">*</span></label>
                  <input
                    className="form-input"
                    placeholder="Contoh: Surip"
                    value={templateForm.namaPenandatangan3}
                    style={{ textTransform: 'capitalize' }}
                    onChange={(e) => updateTemplateField('namaPenandatangan3', e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Jabatan Penandatangan 3 <span className="required">*</span></label>
                  <input
                    className="form-input"
                    placeholder="Contoh: Kepala Desa Kenoyojayan"
                    value={templateForm.jabatanPenandatangan3}
                    style={{ textTransform: 'capitalize' }}
                    onChange={(e) => updateTemplateField('jabatanPenandatangan3', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Add / Remove Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              {activeSignaturesCount < 3 && (
                <button
                  type="button"
                  className="btn btn-sm btn-ghost"
                  onClick={() => setActiveSignaturesCount(prev => prev + 1)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary-600)', padding: '4px 8px', fontSize: '0.825rem' }}
                >
                  + Tambah Tanda Tangan ({activeSignaturesCount}/3)
                </button>
              )}
              {activeSignaturesCount > 1 && (
                <button
                  type="button"
                  className="btn btn-sm btn-ghost"
                  onClick={() => {
                    setActiveSignaturesCount(prev => prev - 1);
                    // Reset field of removed signature
                    if (activeSignaturesCount === 3) {
                      updateTemplateField('namaPenandatangan3', '');
                      updateTemplateField('jabatanPenandatangan3', '');
                    } else if (activeSignaturesCount === 2) {
                      updateTemplateField('namaPenandatangan2', '');
                      updateTemplateField('jabatanPenandatangan2', '');
                    }
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-danger)', padding: '4px 8px', fontSize: '0.825rem' }}
                >
                  - Hapus Tanda Tangan Terakhir
                </button>
              )}
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
                <h2>PEMERINTAH DESA KENOYOJAYAN</h2>
                <h3>KELOMPOK SADAR WISATA (POKDARWIS) “PANTAI MLIWIS”</h3>
                <p style={{ fontWeight: 'bold', color: '#1a1a1a', margin: '2px 0 0' }}>Desa Kenoyojayan Kecamatan Ambal</p>
                <p style={{ fontWeight: 'bold', color: '#1a1a1a', margin: '2px 0 0' }}>Kabupaten Kebumen Provinsi Jawa Tengah</p>
                <p style={{ fontSize: '8.5pt', color: '#1a1a1a', margin: '3px 0 0' }}>Sekretariat: Kawasan Wisata Pantai Mliwis, Desa Kenoyojayan, Ambal, Kebumen 54392</p>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {templateForm.isiSurat
                .split(/\n\s*\n/)
                .map(p => p.trim())
                .filter(p => p.length > 0)
                .map((para, index) => {
                  const blocks = parseParagraphContent(para)
                  return (
                    <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {blocks.map((block: any, bIdx: number) => {
                        if (block.type === 'text') {
                          return (
                            <div 
                              key={bIdx} 
                              style={{ 
                                textAlign: 'justify', 
                                fontSize: '12pt', 
                                lineHeight: '1.8',
                                textIndent: bIdx === 0 ? '48px' : '0px',
                                whiteSpace: 'pre-wrap',
                                wordWrap: 'break-word',
                                overflowWrap: 'break-word'
                              }}
                            >
                              {block.content}
                            </div>
                          )
                        } else {
                          return (
                            <div 
                              key={bIdx} 
                              style={{ 
                                margin: '6px 0 6px 48px', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: '2px' 
                              }}
                            >
                              {block.items.map((item: any, idx: number) => (
                                <div key={idx} style={{ display: 'flex', fontSize: '12pt', lineHeight: '1.8' }}>
                                  <div style={{ width: '110px', flexShrink: 0 }}>{item.key}</div>
                                  <div style={{ width: '15px', flexShrink: 0 }}>:</div>
                                  <div style={{ flex: 1 }}>{item.value}</div>
                                </div>
                              ))}
                            </div>
                          )
                        }
                      })}
                    </div>
                  )
                })}
            </div>

            {/* Tanda Tangan */}
            <div>
              {activeSignaturesCount === 1 ? (
                // Kasus 1: Hanya 1 Tanda Tangan (Rata Kanan)
                <div className="surat-preview-ttd">
                  <div className="surat-preview-ttd-box">
                    <div className="ttd-tempat-tanggal">
                      {templateForm.tempatSurat}, {formatTanggalSurat(templateForm.tanggalSurat)}
                    </div>
                    <div className="ttd-jabatan">{templateForm.jabatanPenandatangan}</div>
                    <div className="ttd-nama">{templateForm.namaPenandatangan}</div>
                  </div>
                </div>
              ) : activeSignaturesCount === 2 ? (
                // Kasus 2: 2 Tanda Tangan (Sejajar Kiri & Kanan)
                <div className="surat-preview-ttd-double">
                  <div className="surat-preview-ttd-box">
                    <div className="ttd-tempat-tanggal" style={{ visibility: 'hidden' }}>&nbsp;</div>
                    <div className="ttd-jabatan">{templateForm.jabatanPenandatangan2}</div>
                    <div className="ttd-nama">{templateForm.namaPenandatangan2}</div>
                  </div>
                  <div className="surat-preview-ttd-box">
                    <div className="ttd-tempat-tanggal">
                      {templateForm.tempatSurat}, {formatTanggalSurat(templateForm.tanggalSurat)}
                    </div>
                    <div className="ttd-jabatan">{templateForm.jabatanPenandatangan}</div>
                    <div className="ttd-nama">{templateForm.namaPenandatangan}</div>
                  </div>
                </div>
              ) : (
                // Kasus 3: 3 Tanda Tangan (Baris 1: Kiri & Kanan, Baris 2: Tengah Bawah)
                <div>
                  <div className="surat-preview-ttd-double">
                    <div className="surat-preview-ttd-box">
                      <div className="ttd-tempat-tanggal" style={{ visibility: 'hidden' }}>&nbsp;</div>
                      <div className="ttd-jabatan">{templateForm.jabatanPenandatangan2}</div>
                      <div className="ttd-nama">{templateForm.namaPenandatangan2}</div>
                    </div>
                    <div className="surat-preview-ttd-box">
                      <div className="ttd-tempat-tanggal">
                        {templateForm.tempatSurat}, {formatTanggalSurat(templateForm.tanggalSurat)}
                      </div>
                      <div className="ttd-jabatan">{templateForm.jabatanPenandatangan}</div>
                      <div className="ttd-nama">{templateForm.namaPenandatangan}</div>
                    </div>
                  </div>
                  <div className="surat-preview-ttd-center">
                    <div className="surat-preview-ttd-box">
                      <div className="ttd-jabatan">{templateForm.jabatanPenandatangan3}</div>
                      <div className="ttd-nama">{templateForm.namaPenandatangan3}</div>
                    </div>
                  </div>
                </div>
              )}
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
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleDownloadDocx}
              style={{ borderColor: 'var(--color-border-subtle)', color: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <FileDown size={16} /> Download Word (DOCX)
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => handleSaveLetter(false)}
              disabled={isGenerating || isSaving}
              style={{ borderColor: 'var(--color-border-subtle)' }}
            >
              {isGenerating ? 'Memproses...' : 'Simpan saja'}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleSaveLetter(true)}
              disabled={isGenerating || isSaving}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {isGenerating ? (
                <><Loader2 size={16} className="animate-spin" /> Menyimpan...</>
              ) : (
                <><Download size={16} /> Simpan & Buka PDF</>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
