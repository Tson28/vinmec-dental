import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Modal from '../../components/ui/Modal'
import { recordApi } from '../../services/api'
import { useApi } from '../../hooks/useApi'
import type { MedicalRecord } from '../../types'

export default function PatientRecords() {
  const { data: records, loading } = useApi<MedicalRecord[]>(() => recordApi.getMine())
  const [selected, setSelected] = useState<MedicalRecord | null>(null)

  return (
    <DashboardLayout title="My Medical Records">
      <div className="space-y-4">
        <div>
          <h2 className="font-display font-bold text-xl text-surface-900">Medical History</h2>
          <p className="text-sm text-surface-500">{(records || []).length} records</p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({length: 4}).map((_,i) => <div key={i} className="skeleton h-24 rounded-xl" />)}
          </div>
        ) : (records || []).length === 0 ? (
          <div className="card text-center py-16">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-surface-500">No medical records yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {(records || []).map(r => (
              <div key={r.id} onClick={() => setSelected(r)}
                className="card hover:shadow-card-hover transition-all duration-200 cursor-pointer flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-dental-100 flex items-center justify-center text-dental-600 text-xl flex-shrink-0">📋</div>
                  <div>
                    <p className="font-bold text-surface-800">{r.diagnosis}</p>
                    <p className="text-sm text-surface-500 mt-0.5">Dr. {r.doctorName} • {r.date}</p>
                    <p className="text-sm text-surface-600 mt-1 line-clamp-2">{r.treatment}</p>
                  </div>
                </div>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-surface-400 flex-shrink-0 mt-1">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Medical Record Details" size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Date</label><p className="text-sm text-surface-800">{selected.date}</p></div>
              <div><label className="label">Doctor</label><p className="text-sm text-surface-800">Dr. {selected.doctorName}</p></div>
              <div className="col-span-2"><label className="label">Diagnosis</label><p className="text-sm text-surface-800">{selected.diagnosis}</p></div>
              <div className="col-span-2"><label className="label">Treatment</label><p className="text-sm text-surface-800">{selected.treatment}</p></div>
              {selected.prescription && <div className="col-span-2"><label className="label">Prescription</label><p className="text-sm text-surface-800 font-mono bg-surface-50 p-3 rounded-lg">{selected.prescription}</p></div>}
              {selected.notes && <div className="col-span-2"><label className="label">Notes</label><p className="text-sm text-surface-600">{selected.notes}</p></div>}
            </div>
            <button onClick={() => setSelected(null)} className="btn-secondary w-full">Close</button>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  )
}