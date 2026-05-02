import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Table from '../../components/ui/Table'
import Modal from '../../components/ui/Modal'
import { serviceApi } from '../../services/api'
import { useApi } from '../../hooks/useApi'
import type { Service } from '../../types'

export default function AdminServices() {
  const { data: services, loading, refetch } = useApi<Service[]>(() => serviceApi.getAll())
  const [selected, setSelected] = useState<Service | null>(null)
  const [showModal, setShowModal] = useState(false)

  const columns = [
    { key: 'name', header: 'Service', render: (s: Service) => <span className="font-semibold text-surface-800">{s.name}</span> },
    { key: 'category', header: 'Category', render: (s: Service) => (
      <span className="badge badge-blue">{s.category || 'General'}</span>
    )},
    { key: 'duration', header: 'Duration', render: (s: Service) => `${s.duration || 30} min` },
    { key: 'price', header: 'Price', render: (s: Service) => (
      <span className="font-mono font-semibold text-dental-700">{Number(s.price || 0).toLocaleString('vi-VN')} ₫</span>
    )},
    { key: 'active', header: 'Status', render: (s: Service) => (
      <span className={s.active !== false ? 'badge-green badge' : 'badge-red badge'}>{s.active !== false ? 'Active' : 'Inactive'}</span>
    )},
    { key: 'actions', header: 'Actions', render: (s: Service) => (
      <div className="flex gap-2">
        <button onClick={() => { setSelected(s); setShowModal(true) }} className="text-xs text-dental-600 font-medium">Edit</button>
        <button onClick={async () => { if(confirm('Delete service?')) { await serviceApi.delete(s.id); refetch() }}}
          className="text-xs text-red-500 font-medium">Delete</button>
      </div>
    )},
  ]

  return (
    <DashboardLayout title="Service Management">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-xl text-surface-900">Dental Services</h2>
            <p className="text-sm text-surface-500">{(services || []).length} services available</p>
          </div>
          <button onClick={() => { setSelected(null); setShowModal(true) }} className="btn-primary">+ Add Service</button>
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {['Preventive', 'Restorative', 'Cosmetic', 'Emergency'].map((cat, i) => {
            const icons = ['🛡️', '🔧', '✨', '🚨']
            const count = (services || []).filter(s => s.category === cat).length
            return (
              <div key={cat} className="card text-center hover:shadow-card-hover transition-all">
                <div className="text-2xl mb-1">{icons[i]}</div>
                <p className="font-bold text-lg text-surface-800">{count}</p>
                <p className="text-xs text-surface-500">{cat}</p>
              </div>
            )
          })}
        </div>

        <div className="card">
          <Table columns={columns} data={services || []} loading={loading} />
        </div>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={selected ? 'Edit Service' : 'Add Service'}>
        <ServiceForm service={selected} onClose={() => { setShowModal(false); refetch() }} />
      </Modal>
    </DashboardLayout>
  )
}

function ServiceForm({ service, onClose }: { service: Service | null; onClose: () => void }) {
  const [form, setForm] = useState({
    name: service?.name || '', description: service?.description || '',
    duration: service?.duration || 30, price: service?.price || 0,
    category: service?.category || 'Preventive', active: service?.active !== false,
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    try {
      if (service) await serviceApi.update(service.id, form)
      else await serviceApi.create(form)
      onClose()
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className="label">Service Name</label><input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
      <div><label className="label">Description</label><input className="input" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="label">Duration (min)</label><input type="number" className="input" value={form.duration} onChange={e => setForm({...form, duration: Number(e.target.value)})} /></div>
        <div><label className="label">Price (VND)</label><input type="number" className="input" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} /></div>
      </div>
      <div><label className="label">Category</label>
        <select className="input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
          {['Preventive', 'Restorative', 'Cosmetic', 'Emergency', 'General'].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={form.active} onChange={e => setForm({...form, active: e.target.checked})} className="rounded" />
        <span className="text-sm font-medium text-surface-700">Active</span>
      </label>
      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary flex-1" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
        <button type="button" className="btn-secondary flex-1" onClick={onClose}>Cancel</button>
      </div>
    </form>
  )
}