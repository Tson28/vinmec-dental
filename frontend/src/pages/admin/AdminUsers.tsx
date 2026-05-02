import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Table from '../../components/ui/Table'
import Modal from '../../components/ui/Modal'
import { userApi } from '../../services/api'
import { useApi } from '../../hooks/useApi'
import type { User } from '../../types'

export default function AdminUsers() {
  const { data: users, loading, refetch } = useApi<User[]>(() => userApi.getAll())
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<User | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const filtered = (users || []).filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user?')) return
    setDeleting(id)
    try { await userApi.delete(id); refetch() } finally { setDeleting(null) }
  }

  const columns = [
    { key: 'name', header: 'Name', render: (u: User) => (
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-gradient-dental flex items-center justify-center text-white text-xs font-bold">{u.name?.charAt(0)}</div>
        <span className="font-medium">{u.name}</span>
      </div>
    )},
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role', render: (u: User) => (
      <span className={`badge ${u.role === 'admin' ? 'badge-red' : u.role === 'doctor' ? 'badge-blue' : 'badge-green'}`}>{u.role}</span>
    )},
    { key: 'phone', header: 'Phone', render: (u: User) => u.phone || '—' },
    { key: 'actions', header: 'Actions', render: (u: User) => (
      <div className="flex gap-2">
        <button onClick={() => { setSelected(u); setShowModal(true) }}
          className="text-xs text-dental-600 hover:text-dental-700 font-medium">Edit</button>
        <button onClick={() => handleDelete(u.id)} disabled={deleting === u.id}
          className="text-xs text-red-500 hover:text-red-700 font-medium disabled:opacity-50">
          {deleting === u.id ? '...' : 'Delete'}
        </button>
      </div>
    )},
  ]

  return (
    <DashboardLayout title="User Management">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-xl text-surface-900">All Users</h2>
            <p className="text-sm text-surface-500">{filtered.length} users found</p>
          </div>
          <button onClick={() => { setSelected(null); setShowModal(true) }} className="btn-primary">+ Add User</button>
        </div>

        <div className="card">
          <div className="mb-4">
            <input className="input max-w-xs" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Table columns={columns} data={filtered} loading={loading} />
        </div>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={selected ? 'Edit User' : 'Add User'}>
        <UserForm user={selected} onClose={() => { setShowModal(false); refetch() }} />
      </Modal>
    </DashboardLayout>
  )
}

function UserForm({ user, onClose }: { user: User | null; onClose: () => void }) {
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', role: user?.role || 'patient', phone: user?.phone || '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (user) await userApi.update(user.id, form)
      else await userApi.create(form)
      onClose()
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className="label">Name</label><input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
      <div><label className="label">Email</label><input type="email" className="input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
      <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
      <div><label className="label">Role</label>
        <select className="input" value={form.role} onChange={e => setForm({...form, role: e.target.value as any})}>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary flex-1" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
        <button type="button" className="btn-secondary flex-1" onClick={onClose}>Cancel</button>
      </div>
    </form>
  )
}