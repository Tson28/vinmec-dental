import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Table from '../../components/ui/Table'
import Modal from '../../components/ui/Modal'
import { recordApi } from '../../services/api'
import { useApi } from '../../hooks/useApi'
import type { MedicalRecord } from '../../types'

export default function DoctorRecords() {
  const { data: records, loading, refetch } = useApi<MedicalRecord[]>(() => recordApi.getAll())
  const [selected, setSelected] = useState<MedicalRecord | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = (records || []).filter(r =>
    r.patientName?.toLowerCase().includes(search.toLowerCase()) ||
    r.diagnosis?.toLowerCase().includes(search.toLowerCase())
  )

  const columns = [
    { key: 'patientName', header: 'Patient', render: (r: MedicalRecord) => <span className="font-medium">{r.patientName}</span> },
    { key: 'diagnosis', header: 'Diagnosis', render: (r: MedicalRecord) => <span className="text-surface-600">{r.diagnosis}</span> },
    { key: 'treatment', header: 'Treatment', render: (r: MedicalRecord) => <span className="text-surface-600 truncate max-w-xs block">{r.treatment}</span> },
    { key: 'date', header: 'Date' },
    { key: 'actions', header: '', render: (r: MedicalRecord) => (
      <button onClick={() => { setSelected(r); setShowModal(true) }} className="text-xs text-dental-600 font-medium">View</button>
    )},
  ]

  return (
    <DashboardLayout title="Medical Records">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-xl text-surface-900">Medical Records</h2>
            <p className="text-sm text-surface-500">{filtered.length} records</p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary">+ New Record</button>
        </div>

        <div className="card">
          <div className="mb-4">
            <input className="input max-w-xs" placeholder="Search records..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Table columns={columns} data={filtered} loading={loading} />
        </div>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Medical Record" size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                ['Patient', selected.patientName], ['Doctor', selected.doctorName],
                ['Date', selected.date], ['Diagnosis', selected.diagnosis],
              ].map(([k, v]) => (
                <div key={k}><label className="label">{k}</label><p className="text-sm text-surface-800">{v}</p></div>
              ))}
            </div>
            <div><label className="label">Treatment</label><p className="text-sm text-surface-800">{selected.treatment}</p></div>
            {selected.prescription && <div><label className="label">Prescription</label><p className="text-sm text-surface-800">{selected.prescription}</p></div>}
            {selected.notes && <div><label className="label">Notes</label><p className="text-sm text-surface-800">{selected.notes}</p></div>}
            <button onClick={() => setShowModal(false)} className="btn-secondary w-full">Close</button>
          </div>
        )}
      </Modal>

      <Modal open={showForm} onClose={() => setShowForm(false)} title="New Medical Record" size="lg">
        <RecordForm onClose={() => { setShowForm(false); refetch() }} />
      </Modal>
    </DashboardLayout>
  )
}

function RecordForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ patientId: '', diagnosis: '', treatment: '', prescription: '', notes: '', date: new Date().toISOString().split('T')[0] })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    try { await recordApi.create(form); onClose() } finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className="label">Patient ID</label><input className="input" value={form.patientId} onChange={e => setForm({...form, patientId: e.target.value})} required /></div>
      <div><label className="label">Date</label><input type="date" className="input" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></div>
      <div><label className="label">Diagnosis</label><input className="input" value={form.diagnosis} onChange={e => setForm({...form, diagnosis: e.target.value})} required /></div>
      <div><label className="label">Treatment</label><textarea className="input" rows={3} value={form.treatment} onChange={e => setForm({...form, treatment: e.target.value})} required /></div>
      <div><label className="label">Prescription</label><textarea className="input" rows={2} value={form.prescription} onChange={e => setForm({...form, prescription: e.target.value})} /></div>
      <div><label className="label">Notes</label><textarea className="input" rows={2} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} /></div>
      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary flex-1" disabled={loading}>{loading ? 'Saving...' : 'Save Record'}</button>
        <button type="button" className="btn-secondary flex-1" onClick={onClose}>Cancel</button>
      </div>
    </form>
  )
}