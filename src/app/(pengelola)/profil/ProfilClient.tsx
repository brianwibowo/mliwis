'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { User, Lock, Upload, KeyRound } from 'lucide-react'
import { updateProfile } from './actions'
import { useToast } from '@/hooks/useToast'

interface UserData {
  id: number
  username: string
  namaLengkap: string
  role: string
  foto: string | null
}

export default function ProfilClient({ user }: { user: UserData }) {
  const router = useRouter()
  const { addToast, removeToast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [previewUrl, setPreviewUrl] = useState<string | null>(user.foto)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    const file = formData.get('foto') as File | null
    if (file && file.size > 0) {
      if (file.size > 5 * 1024 * 1024) {
        addToast('Ukuran foto profil maksimal 5MB', 'error')
        return
      }
      const ext = file.name.split('.').pop()?.toLowerCase() || ''
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'heif']
      if (!allowedExtensions.includes(ext) && !file.type.startsWith('image/')) {
        addToast('Format foto tidak didukung. Gunakan JPG, PNG, GIF, WEBP, atau HEIC/HEIF.', 'error')
        return
      }
    }

    const toastId = addToast('Menyimpan perubahan profil...', 'info')

    startTransition(async () => {
      try {
        const r = await updateProfile(formData)

        removeToast(toastId)

        if (r.error) {
          addToast(r.error, 'error')
        } else {
          addToast('Profil berhasil diperbarui!', 'success')
          // Reset password fields
          const oldPass = form.querySelector('input[name="oldPassword"]') as HTMLInputElement
          const newPass = form.querySelector('input[name="newPassword"]') as HTMLInputElement
          const confPass = form.querySelector('input[name="confirmPassword"]') as HTMLInputElement
          if (oldPass) oldPass.value = ''
          if (newPass) newPass.value = ''
          if (confPass) confPass.value = ''
          router.refresh()
        }
      } catch (err: any) {
        removeToast(toastId)
        console.error('Client action error:', err)
        addToast(err.message || 'Terjadi kesalahan sistem saat memperbarui profil', 'error')
      }
    })
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Profil Saya</h1>
          <p>Kelola data diri, foto profil, dan keamanan akun Anda</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid-2 align-start">
          
          {/* Card Kiri: Data Diri & Foto */}
          <div className="card">
            <div className="card-header">
              <h3>
                <User size={18} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
                Data Diri & Foto Profil
              </h3>
            </div>
            
            <div className="card-body">
              {/* Avatar Upload Area */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24, gap: 12 }}>
                <div 
                  style={{ 
                    width: 100, 
                    height: 100, 
                    borderRadius: '50%', 
                    overflow: 'hidden', 
                    background: 'var(--color-surface-hover)', 
                    border: '3px solid var(--color-primary-200)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    color: 'var(--color-primary-600)',
                    position: 'relative'
                  }}
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="Pratinjau" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    user.namaLengkap.charAt(0).toUpperCase()
                  )}
                </div>
                
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Upload size={14} />
                  Pilih Foto Baru
                </button>
                <input 
                  type="file" 
                  name="foto" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />
                <p className="form-hint" style={{ textAlign: 'center' }}>Format: JPG, PNG, WEBP. Maksimal 5MB.</p>
              </div>

              {/* Form Fields */}
              <div className="form-group">
                <label className="form-label">Username</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    defaultValue={user.username} 
                    disabled 
                    style={{ background: 'var(--color-surface-hover)', color: 'var(--color-text-muted)', cursor: 'not-allowed', paddingLeft: 36 }}
                  />
                  <Lock size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                </div>
                <p className="form-hint">Username tidak dapat diubah</p>
              </div>

              <div className="form-group">
                <label className="form-label">Nama Lengkap <span className="required">*</span></label>
                <input 
                  type="text" 
                  name="namaLengkap" 
                  className="form-input" 
                  defaultValue={user.namaLengkap} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Hak Akses / Role</label>
                <input 
                  type="text" 
                  className="form-input" 
                  defaultValue={user.role} 
                  disabled 
                  style={{ background: 'var(--color-surface-hover)', color: 'var(--color-text-muted)', cursor: 'not-allowed', textTransform: 'capitalize' }}
                />
              </div>
            </div>
          </div>

          {/* Card Kanan: Ubah Password */}
          <div className="card">
            <div className="card-header">
              <h3>
                <KeyRound size={18} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
                Ubah Keamanan / Password
              </h3>
            </div>
            
            <div className="card-body">
              <p className="text-muted text-sm mb-4">Lengkapi bagian ini hanya jika Anda ingin memperbarui password akun pengelola Anda.</p>
              
              <div className="form-group">
                <label className="form-label">Password Lama</label>
                <input 
                  name="oldPassword" 
                  type="password" 
                  className="form-input" 
                  placeholder="Masukkan password lama"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Password Baru</label>
                <input 
                  name="newPassword" 
                  type="password" 
                  className="form-input" 
                  placeholder="Password baru (min. 6 karakter)"
                  minLength={6} 
                />
                <p className="form-hint">Minimal 6 karakter</p>
              </div>
              
              <div className="form-group">
                <label className="form-label">Konfirmasi Password Baru</label>
                <input 
                  name="confirmPassword" 
                  type="password" 
                  className="form-input" 
                  placeholder="Ketik ulang password baru"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Action Button */}
        <div className="flex-end gap-3 mt-6" style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: 20 }}>
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={isPending}
            style={{ minWidth: 150 }}
          >
            {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  )
}
