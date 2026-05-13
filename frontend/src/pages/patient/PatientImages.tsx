import { useState, useRef } from "react";
import PatientSidebar from "../../components/layout/PatientSidebar";
import { imageApi } from "../../services/api";
import { useApi } from "../../hooks/useApi";
import type { DentalImage } from "../../types";

export default function PatientImages() {
  const {
    data: images,
    loading,
    refetch,
  } = useApi<DentalImage[]>(() => imageApi.getMine());
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<DentalImage | null>(null);
  const [uploadType, setUploadType] = useState<"xray" | "photo" | "scan">(
    "photo",
  );
  const [description, setDescription] = useState("");
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("image", file);
    fd.append("type", uploadType);
    fd.append("description", description);
    try {
      await imageApi.upload(fd);
      refetch();
      setShowUploadPanel(false);
      setDescription("");
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    await imageApi.delete(id);
    refetch();
  };

  const typeIcon: Record<string, string> = {
    xray: "🦴",
    photo: "📷",
    scan: "🔬",
  };
  const typeLabel: Record<string, string> = {
    xray: "X-Ray",
    photo: "Photo",
    scan: "Scan",
  };

  return (
    <div className="flex">
      <PatientSidebar />
      <div className="flex-1 ml-64">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Hình ảnh của tôi
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {(images || []).length} hình ảnh
            </p>
          </div>
          <button
            onClick={() => setShowUploadPanel(!showUploadPanel)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
          >
            {showUploadPanel ? "Hủy" : "+ Tải lên"}
          </button>
        </div>

        <div className="space-y-4 p-8">
          {/* Upload Panel */}
          {showUploadPanel && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">
                Tải lên hình ảnh mới
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Loại hình ảnh
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={uploadType}
                    onChange={(e) => setUploadType(e.target.value as any)}
                  >
                    <option value="photo">📷 Ảnh</option>
                    <option value="xray">🦴 X-Quang</option>
                    <option value="scan">🔬 Quét</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Mô tả (tùy chọn)
                  </label>
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ví dụ: Ảnh răng trước, x-quang hàm trên..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
              <div
                className="border-2 border-dashed border-green-300 rounded-lg p-8 text-center cursor-pointer hover:bg-green-100 transition"
                onClick={() => fileRef.current?.click()}
              >
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-2 border-green-400 border-t-green-600 rounded-full animate-spin" />
                    <p className="text-sm text-green-600 font-medium">
                      Đang tải...
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-3xl mb-2">📁</p>
                    <p className="text-sm font-semibold text-green-700">
                      Nhấp để chọn hình ảnh
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG, WEBP tối đa 10MB
                    </p>
                  </>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
              />
            </div>
          )}

          {/* Gallery */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-200 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : (images || []).length === 0 ? (
            <div className="bg-white rounded-lg shadow text-center py-16">
              <p className="text-5xl mb-3">🖼️</p>
              <p className="font-semibold text-gray-700">Chưa có hình ảnh</p>
              <p className="text-sm text-gray-400 mt-1">
                Tải lên hình ảnh nha khoa đầu tiên của bạn để bắt đầu
              </p>
              <button
                onClick={() => setShowUploadPanel(true)}
                className="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
              >
                Tải lên hình ảnh
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {(images || []).map((img) => (
                <div
                  key={img.id}
                  className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden"
                >
                  <img
                    src={img.url}
                    alt={img.description || "Dental image"}
                    className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300"
                    onClick={() => setPreview(img)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3">
                    <button
                      onClick={() => handleDelete(img.id)}
                      className="self-end w-7 h-7 bg-red-500 text-white rounded flex items-center justify-center text-xs hover:bg-red-600 transition"
                    >
                      ✕
                    </button>
                    <div>
                      <p className="text-white text-xs font-semibold">
                        {typeIcon[img.type]} {typeLabel[img.type]}
                      </p>
                      <p className="text-white/70 text-[10px]">
                        {img.uploadedAt?.split("T")[0]}
                      </p>
                      {img.description && (
                        <p className="text-white/70 text-[10px] truncate">
                          {img.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lightbox Preview */}
        {preview && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/90 backdrop-blur-sm p-4"
            onClick={() => setPreview(null)}
          >
            <div
              className="relative max-w-3xl w-full bg-white rounded-xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={preview.url}
                alt={preview.description}
                className="w-full max-h-[65vh] object-contain bg-gray-900"
              />
              <div className="p-5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">
                    {typeIcon[preview.type]} {typeLabel[preview.type]}
                  </p>
                  <p className="text-sm text-gray-500">
                    {preview.uploadedAt?.split("T")[0]}
                  </p>
                  {preview.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {preview.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setPreview(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-300 transition"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
