import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Table from '../../components/ui/Table'
import { patientApi } from '../../services/api'
import { useApi } from '../../hooks/useApi'
import type { User } from '../../types'

export default function DoctorPatients() {
  const { data: patients, loading } = useApi<User[]>(() => patientApi.getAll())
  const [search, setSearch] = useState('')

  const filtered = (patients || []).filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  )

  const columns = [
    { key: 'name', header: 'Patient', render: (p: User) => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-mint-400 to-dental-500 flex items-center justify-center text-white text-xs font-bold">{p.name?.charAt(0)}</div>
        <div><p className="font-medium">{p.name}</p><p className="text-xs text-surface-400">{p.email}</p></div>
      </div>
    )},
    { key: 'phone', header: 'Phone', render: (p: User) => p.phone || '—' },
    { key: 'dob', header: 'Date of Birth', render: (p: User) => p.dob || '—' },
    { key: 'status', header: 'Status', render: () => <span className="badge badge-green">Active</span> },
  ]

  return (
    <DashboardLayout title="Patients">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-xl text-surface-900">My Patients</h2>
            <p className="text-sm text-surface-500">{filtered.length} patients</p>
          </div>
        </div>
        <div className="card">
          <div className="mb-4">
            <input className="input max-w-xs" placeholder="Search patients..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Table columns={columns} data={filtered} loading={loading} />
        </div>
      </div>
    </DashboardLayout>
  )
}