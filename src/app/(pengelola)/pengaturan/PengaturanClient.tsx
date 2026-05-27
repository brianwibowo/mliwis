'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, Lock, Shield, User } from 'lucide-react'
import { createUser, updateUser, deleteUser, changePassword } from './actions'
import { useToast } from '@/hooks/useToast'
import Modal from '@/components/ui/Modal'

interface UserData { id: number; username: string; namaLengkap: string; role: string; createdAt: string }

interface Props { isAdmin: boolean; users: UserData[]; currentUserId: number }

export default function PengaturanClient({ isAdmin, users, currentUserId }: Props) {
  const router = useRouter()
  const { addToast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [showUserModal, setShowUserModal] = useState(false)
  const [editUser, setEditUser] = useState<UserData | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const handleChangePassword = (formData: FormData) => {
    startTransition(async () => {
      const r = await changePassword(formData)
      if (r.error) addToast(r.error, 'error')
      else addToast('Password berhasil diubah', 'success')
    })
  }

  const handleUserSubmit = (formData: FormData) => {
    startTransition(async () => {
      const r = editUser ? await updateUser(editUser.id, formData) : await createUser(formData)
      if (r.error) addToast(r.error, 'error')
      else { addToast(editUser ? 'User diperbarui' : 'User ditambahkan', 'success'); setShowUserModal(false); setEditUser(null); router.refresh() }
    })
  }

  const handleDeleteUser = () => {
    if (!deleteId) return
    startTransition(async () => {
      const r = await deleteUser(deleteId)
      if (r.error) addToast(r.error, 'error')
      else { addToast('User dihapus', 'success'); router.refresh() }
      setDeleteId(null)
    })
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left"><h1>Pengaturan</h1><p>Kelola akun dan keamanan</p></div>
      </div>

      {/* Ubah Password */}
      <div className="card mb-6">
        <div className="card-header"><h3><Lock size={18} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />Ubah Password</h3></div>
        <div className="card-body">
          <form action={handleChangePassword} style={{ maxWidth: 400 }}>
            <div className="form-group"><label className="form-label">Password Lama</label><input name="oldPassword" type="password" className="form-input" required /></div>
            <div className="form-group"><label className="form-label">Password Baru</label><input name="newPassword" type="password" className="form-input" minLength={6} required /><p className="form-hint">Minimal 6 karakter</p></div>
            <div className="form-group"><label className="form-label">Konfirmasi Password Baru</label><input name="confirmPassword" type="password" className="form-input" required /></div>
            <button type="submit" className="btn btn-primary" disabled={isPending}>{isPending ? 'Menyimpan...' : 'Ubah Password'}</button>
          </form>
        </div>
      </div>

      {/* Kelola User (Admin Only) */}
      {isAdmin && (
        <div className="card">
          <div className="card-header">
            <h3><Shield size={18} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />Kelola Akun Pengelola</h3>
            <button className="btn btn-primary btn-sm" onClick={() => { setEditUser(null); setShowUserModal(true) }}><Plus size={16} /> Tambah</button>
          </div>
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead><tr><th>Username</th><th>Nama Lengkap</th><th>Role</th><th>Aksi</th></tr></thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td><strong>{u.username}</strong></td>
                    <td>{u.namaLengkap}</td>
                    <td><span className={`badge ${u.role === 'admin' ? 'badge-info' : 'badge-disetujui'}`}>{u.role}</span></td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-ghost btn-sm btn-icon" onClick={() => { setEditUser(u); setShowUserModal(true) }}><Pencil size={14} /></button>
                        {u.id !== currentUserId && <button className="btn btn-ghost btn-sm btn-icon text-danger" onClick={() => setDeleteId(u.id)}><Trash2 size={14} /></button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Modal */}
      <Modal isOpen={showUserModal} onClose={() => { setShowUserModal(false); setEditUser(null) }} title={editUser ? 'Edit Pengelola' : 'Tambah Pengelola'}>
        <form action={handleUserSubmit}>
          {!editUser && <div className="form-group"><label className="form-label">Username <span className="required">*</span></label><input name="username" className="form-input" required /></div>}
          <div className="form-group"><label className="form-label">Nama Lengkap <span className="required">*</span></label><input name="namaLengkap" className="form-input" defaultValue={editUser?.namaLengkap} required /></div>
          <div className="form-group">
            <label className="form-label">Role <span className="required">*</span></label>
            <select name="role" className="form-select" defaultValue={editUser?.role || 'staff'} required>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="form-group"><label className="form-label">Password {editUser ? '(kosongkan jika tidak diubah)' : <span className="required">*</span>}</label><input name="password" type="password" className="form-input" required={!editUser} minLength={6} />{!editUser && <p className="form-hint">Minimal 6 karakter</p>}</div>
          <div className="flex-end gap-3"><button type="button" className="btn btn-ghost" onClick={() => { setShowUserModal(false); setEditUser(null) }}>Batal</button><button type="submit" className="btn btn-primary" disabled={isPending}>{isPending ? 'Menyimpan...' : 'Simpan'}</button></div>
        </form>
      </Modal>

      <Modal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} title="Hapus Pengelola" size="sm">
        <p>Yakin hapus pengelola ini? Semua data terkait akan tetap tersimpan.</p>
        <div className="flex-end gap-3 mt-6"><button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Batal</button><button className="btn btn-danger" onClick={handleDeleteUser} disabled={isPending}>{isPending ? 'Menghapus...' : 'Hapus'}</button></div>
      </Modal>
    </div>
  )
}
