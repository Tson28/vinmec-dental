import { useState, useRef, useEffect } from "react";
import DoctorSidebar from "../../components/layout/DoctorSidebar";
import { imageApi, patientApi } from "../../services/api";
import { useApi } from "../../hooks/useApi";
import { useToast } from "../../hooks/useToast";
import type { DentalImage } from "../../types";

interface Patient {
  id: string;
  _id: string;
  name: string;
  email: string;
}

export default function DoctorImages() {
  const {
    data: images,
    loading,
    refetch,
  } = useApi<DentalImage[]>(() => imageApi.getAll());
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<DentalImage | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [filter, setFilter] = useState("all");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [loadingPatients, setLoadingPatients] = useState(false);
  const { toast } = useToast();

  const filtered = (images || []).filter(
    (i) => filter === "all" || i.type === filter,
  );

  useEffect(() => {
    if (showUploadForm) {
      const fetchPatients = async () => {
        setLoadingPatients(true);
        try {
          const res = await patientApi.getAll();
          setPatients(res.data.data || []);
        } catch (err) {
          console.error("Failed to load patients:", err);
          toast.error("Failed to load patients");
        } finally {
          setLoadingPatients(false);
        }
      };
      fetchPatients();
    }
  }, [showUploadForm]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!selectedPatient) {
      toast.error("Please select a patient");
      return;
    }

    setUploading(true);
    const fd = new FormData();
    fd.append("image", file);
    fd.append("type", "photo");
    fd.append("patientId", selectedPatient);

    try {
      await imageApi.upload(fd);
      toast.success("Image uploaded successfully");
      refetch();
      setShowUploadForm(false);
      setSelectedPatient("");
      if (fileRef.current) fileRef.current.value = "";
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const typeIcon: Record<string, string> = {
    xray: "🦴",
    photo: "📷",
    scan: "🔬",
  };

  return (
    <div className="flex">
      <DoctorSidebar />
      <div className="flex-1 ml-64">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hình ảnh</h1>
            <p className="text-sm text-gray-500 mt-1">{filtered.length} hình ảnh</p>
          </div>
          <button
            onClick={() => setShowUploadForm(true)}
            disabled={uploading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50"
          >
            {uploading ? "Đang tải..." : "+ Tải lên"}
          </button>
        </div>

        <div className="space-y-4 p-8">
          {/* Hidden file input */}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />

          {showUploadForm && (
            <div className="card border-2 border-dental-400 p-4 bg-dental-50">
              <div className="space-y-3">
                <div>
                  <label className="label">Select Patient</label>
                  <select
                    className="input"
                    value={selectedPatient}
                    onChange={(e) => setSelectedPatient(e.target.value)}
                    disabled={loadingPatients}
                  >
                    <option value="">Choose a patient...</option>
                    {patients.map((p) => (
                      <option key={p.id || p._id} value={p.id || p._id}>
                        {p.name} - {p.email}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => fileRef.current?.click()}
                    disabled={!selectedPatient || uploading}
                    className="btn-primary flex-1"
                  >
                    {uploading ? "Uploading..." : "Select Image"}
                  </button>
                  <button
                    onClick={() => {
                      setShowUploadForm(false);
                      setSelectedPatient("");
                      if (fileRef.current) fileRef.current.value = "";
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton aspect-square rounded-xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="card text-center py-16">
              <p className="text-4xl mb-3">🖼️</p>
              <p className="text-surface-500">No images found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((img) => (
                <div
                  key={img.id}
                  onClick={() => setPreview(img)}
                  className="group relative aspect-square bg-surface-100 rounded-xl overflow-hidden cursor-pointer hover:shadow-card-hover transition-all duration-200"
                >
                  <img
                    src={img.url}
                    alt={img.description || "Dental image"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3">
                    <p className="text-white text-xs font-semibold">
                      {img.patientName}
                    </p>
                    <p className="text-white/70 text-[10px]">
                      {typeIcon[img.type]} {img.type} •{" "}
                      {img.uploadedAt?.split("T")[0]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-surface-900/80 backdrop-blur-sm p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={preview.url}
              alt={preview.description ?? "Dental image"}
              className="w-full max-h-[70vh] object-contain bg-surface-900"
            />
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-surface-800">
                  {preview.patientName}
                </p>
                <p className="text-sm text-surface-500">
                  {typeIcon[preview.type]} {preview.type} •{" "}
                  {preview.uploadedAt?.split("T")[0]}
                </p>
                {preview.description && (
                  <p className="text-xs text-surface-400 mt-1">
                    {preview.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => setPreview(null)}
                className="btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}