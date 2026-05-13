import { useState } from "react";
import PatientSidebar from "../../components/layout/PatientSidebar";
import Modal from "../../components/ui/Modal";
import { recordApi } from "../../services/api";
import { useApi } from "../../hooks/useApi";
import type { MedicalRecord } from "../../types";

export default function PatientRecords() {
  const { data: records, loading } = useApi<MedicalRecord[]>(() =>
    recordApi.getMine(),
  );
  const [selected, setSelected] = useState<MedicalRecord | null>(null);

  return (
    <div className="flex">
      <PatientSidebar />
      <div className="flex-1 ml-64">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hồ sơ bệnh án</h1>
            <p className="text-sm text-gray-500 mt-1">
              {(records || []).length} hồ sơ
            </p>
          </div>
        </div>

        <div className="space-y-4 p-8">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 bg-gray-200 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : (records || []).length === 0 ? (
            <div className="bg-white rounded-lg shadow text-center py-16">
              <p className="text-4xl mb-3">📋</p>
              <p className="text-gray-500">Không có hồ sơ bệnh án</p>
            </div>
          ) : (
            <div className="space-y-3">
              {(records || []).map((r) => (
                <div
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-all duration-200 cursor-pointer flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 text-xl flex-shrink-0">
                      📋
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{r.diagnosis}</p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Dr. {r.doctorName} • {r.date}
                      </p>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {r.treatment}
                      </p>
                    </div>
                  </div>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-4 h-4 text-surface-400 flex-shrink-0 mt-1"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              ))}
            </div>
          )}
        </div>

        <Modal
          open={!!selected}
          onClose={() => setSelected(null)}
          title="Chi tiết hồ sơ y tế"
          size="lg"
        >
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-gray-700">Ngày</label>
                  <p className="text-sm text-gray-800">{selected.date}</p>
                </div>
                <div>
                  <label className="font-semibold text-gray-700">Bác sĩ</label>
                  <p className="text-sm text-gray-800">
                    Dr. {selected.doctorName}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="font-semibold text-gray-700">
                    Chẩn đoán
                  </label>
                  <p className="text-sm text-gray-800">{selected.diagnosis}</p>
                </div>
                <div className="col-span-2">
                  <label className="font-semibold text-gray-700">
                    Điều trị
                  </label>
                  <p className="text-sm text-gray-800">{selected.treatment}</p>
                </div>
                {selected.prescription && (
                  <div className="col-span-2">
                    <label className="font-semibold text-gray-700">
                      Đơn thuốc
                    </label>
                    <p className="text-sm text-gray-800 font-mono bg-gray-100 p-3 rounded-lg">
                      {selected.prescription}
                    </p>
                  </div>
                )}
                {selected.notes && (
                  <div className="col-span-2">
                    <label className="font-semibold text-gray-700">
                      Ghi chú
                    </label>
                    <p className="text-sm text-gray-600">{selected.notes}</p>
                  </div>
                )}
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-300 transition"
              >
                Đóng
              </button>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
