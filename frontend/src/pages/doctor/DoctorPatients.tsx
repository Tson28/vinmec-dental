import { useState } from "react";
import DoctorSidebar from "../../components/layout/DoctorSidebar";
import DentalScoreModal from "../../components/DentalScoreModal";
import Table from "../../components/ui/Table";
import { patientApi } from "../../services/api";
import { useApi } from "../../hooks/useApi";
import type { User } from "../../types";

export default function DoctorPatients() {
  const { data: patients, loading } = useApi<User[]>(() => patientApi.getAll());
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<User | null>(null);
  const [showScoreModal, setShowScoreModal] = useState(false);

  const filtered = (patients || []).filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase()),
  );

  const columns = [
    {
      key: "name",
      header: "Patient",
      render: (p: User) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-mint-400 to-dental-500 flex items-center justify-center text-white text-xs font-bold">
            {p.name?.charAt(0)}
          </div>
          <div>
            <p className="font-medium">{p.name}</p>
            <p className="text-xs text-surface-400">{p.email}</p>
          </div>
        </div>
      ),
    },
    { key: "phone", header: "Phone", render: (p: User) => p.phone || "—" },
    { key: "dob", header: "Date of Birth", render: (p: User) => p.dob || "—" },
    {
      key: "status",
      header: "Status",
      render: () => <span className="badge badge-green">Active</span>,
    },
    {
      key: "actions",
      header: "Actions",
      render: (p: User) => (
        <button
          onClick={() => {
            setSelectedPatient(p);
            setShowScoreModal(true);
          }}
          className="px-3 py-1.5 text-sm bg-gradient-dental text-white rounded-lg hover:opacity-90 transition font-medium"
        >
          Dental Score
        </button>
      ),
    },
  ];

  return (
    <div className="flex">
      <DoctorSidebar />
      <div className="flex-1 ml-64">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bệnh nhân</h1>
            <p className="text-sm text-gray-500 mt-1">
              {filtered.length} bệnh nhân
            </p>
          </div>
        </div>

        <div className="space-y-4 p-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="mb-4">
              <input
                className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Tìm kiếm bệnh nhân..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Table columns={columns} data={filtered} loading={loading} />
          </div>
        </div>
      </div>

      {/* Dental Score Modal */}
      {selectedPatient && (
        <DentalScoreModal
          patient={selectedPatient}
          isOpen={showScoreModal}
          onClose={() => {
            setShowScoreModal(false);
            setSelectedPatient(null);
          }}
        />
      )}
    </div>
  );
}
