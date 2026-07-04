'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, Shield } from 'lucide-react'
import { createUser, updateUser, deleteUser, getAuditLogs } from './actions'
import { useToast } from '@/hooks/useToast'
import Modal from '@/components/ui/Modal'

interface UserData { id: number; username: string; namaLengkap: string; role: string; createdAt: string }
interface AuditLogData { id: number; username: string; action: string; target: string; createdAt: string }

interface Props { isAdmin: boolean; users: UserData[]; currentUserId: number; auditLogs?: AuditLogData[] }

export default function PengaturanClient({ isAdmin, users, currentUserId, auditLogs = [] }: Props) {
  const router = useRouter()
  const { addToast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [showUserModal, setShowUserModal] = useState(false)
  const [editUser, setEditUser] = useState<UserData | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [showRoleInfo, setShowRoleInfo] = useState(false)

  // Audit Logs pagination state
  const [logs, setLogs] = useState<AuditLogData[]>(auditLogs)
  const [hasMore, setHasMore] = useState(auditLogs.length === 20)
  const [loadingLogs, setLoadingLogs] = useState(false)

  const handleLoadMoreLogs = async () => {
    if (loadingLogs) return
    setLoadingLogs(true)
    try {
      const res = await getAuditLogs(logs.length, 20)
      if (res.data) {
        if (res.data.length > 0) {
          setLogs(prev => [...prev, ...res.data])
          if (res.data.length < 20) {
            setHasMore(false)
          }
        } else {
          setHasMore(false)
        }
      }
    } catch (err) {
      console.error('Gagal mengambil log audit:', err)
      addToast('Gagal mengambil data log', 'error')
    } finally {
      setLoadingLogs(false)
    }
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
        <div className="page-header-left"><h1>Pengaturan</h1><p>Kelola akun pengelola</p></div>
      </div>

      {/* Kelola User (Admin Only) */}
      {isAdmin && (
        <div className="card">
          <div className="card-header">
            <h3>
              <Shield size={18} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
              Kelola Akun Pengelola
              <button
                type="button"
                className="tooltip-icon"
                onClick={() => setShowRoleInfo(!showRoleInfo)}
                aria-label="Info role pengelola"
              >!</button>
            </h3>
            <button className="btn btn-primary btn-sm" onClick={() => { setEditUser(null); setShowUserModal(true) }}><Plus size={16} /> Tambah</button>
          </div>
          {showRoleInfo && (
            <div style={{ padding: '12px 20px', background: 'var(--color-primary-50)', borderBottom: '1px solid var(--color-border-light)', fontSize: '0.82rem', lineHeight: 1.6, color: 'var(--color-text)' }}>
              <strong style={{ color: 'var(--color-primary-700)' }}>Makna Role Pengelola:</strong>
              <ul style={{ margin: '6px 0 0 16px', padding: 0, listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li><strong>Admin:</strong> Memiliki akses penuh termasuk mengelola akun staf, melihat log audit aktivitas, dan mengonfigurasi pengaturan sistem.</li>
                <li><strong>Staff:</strong> Hanya dapat mengelola operasional (booking, surat masuk/keluar, kas, berita) dan tidak dapat mengakses pengaturan pengguna atau log audit.</li>
              </ul>
            </div>
          )}
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

      {/* Log Audit (Admin Only) */}
      {isAdmin && logs.length > 0 && (
        <div className="card" style={{ marginTop: '24px' }}>
          <div className="card-header">
            <h3>Log Audit Aktivitas Pengelola</h3>
          </div>
          <div className="table-container" style={{ border: 'none', borderRadius: 0, maxHeight: '350px', overflowY: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Waktu</th>
                  <th>Pengelola</th>
                  <th>Aksi</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="text-sm text-muted" style={{ whiteSpace: 'nowrap' }}>
                      {new Date(log.createdAt).toLocaleString('id-ID')}
                    </td>
                    <td><strong>{log.username}</strong></td>
                    <td>
                      <span className="badge badge-info" style={{ fontSize: '0.75rem', padding: '4px 8px' }}>
                        {log.action}
                      </span>
                    </td>
                    <td className="text-sm">{log.target}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {hasMore && (
            <div style={{ padding: '16px', display: 'flex', justifyContent: 'center', borderTop: '1px solid var(--color-border-light)' }}>
              <button 
                onClick={handleLoadMoreLogs} 
                className="btn btn-secondary btn-sm" 
                disabled={loadingLogs}
                style={{ minWidth: '160px' }}
              >
                {loadingLogs ? 'Memuat...' : 'Muat Lebih Banyak'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* User Modal */}
      <Modal isOpen={showUserModal} onClose={() => { setShowUserModal(false); setEditUser(null) }} title={editUser ? 'Edit Pengelola' : 'Tambah Pengelola'}>
        <form action={handleUserSubmit}>
          {!editUser && <div className="form-group"><label className="form-label">Username <span className="required">*</span></label><input name="username" className="form-input" required /></div>}
          <div className="form-group"><label className="form-label">Nama Lengkap <span className="required">*</span></label><input name="namaLengkap" className="form-input" defaultValue={editUser?.namaLengkap} required /></div>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center' }}>
              Role <span className="required" style={{ marginRight: 2 }}>*</span>
              <button
                type="button"
                className="tooltip-icon"
                onClick={() => setShowRoleInfo(!showRoleInfo)}
                aria-label="Info role pengelola"
              >!</button>
            </label>
            <select name="role" className="form-select" defaultValue={editUser?.role || 'staff'} required>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
            {showRoleInfo && (
              <div style={{ marginTop: 8, padding: '10px 12px', background: 'var(--color-primary-50)', borderRadius: 8, fontSize: '0.8rem', lineHeight: 1.6, color: 'var(--color-text)', border: '1px solid var(--color-border-light)' }}>
                <strong style={{ color: 'var(--color-primary-700)' }}>Makna Role:</strong>
                <ul style={{ margin: '4px 0 0 16px', padding: 0, listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <li><strong>Admin:</strong> Akses penuh (kelola akun, log audit, pengaturan).</li>
                  <li><strong>Staff:</strong> Operasional saja (booking, surat, kas, berita).</li>
                </ul>
              </div>
            )}
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
