import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import DoctorSidebar from "../../components/layout/DoctorSidebar";
import { imageApi, patientApi } from "../../services/api";
import { useApi } from "../../hooks/useApi";
import { useToast } from "../../hooks/useToast";
export default function DoctorImages() {
    const { data: images, loading, refetch, } = useApi(() => imageApi.getAll());
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);
    const fileRef = useRef(null);
    const [filter] = useState("all");
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState("");
    const [loadingPatients, setLoadingPatients] = useState(false);
    const { toast } = useToast();
    const filtered = (images || []).filter((i) => filter === "all" || i.type === filter);
    useEffect(() => {
        if (showUploadForm) {
            const fetchPatients = async () => {
                setLoadingPatients(true);
                try {
                    const res = await patientApi.getAll();
                    setPatients(res.data.data || []);
                }
                catch (err) {
                    console.error("Failed to load patients:", err);
                    toast.error("Failed to load patients");
                }
                finally {
                    setLoadingPatients(false);
                }
            };
            fetchPatients();
        }
    }, [showUploadForm]);
    const handleUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
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
            if (fileRef.current)
                fileRef.current.value = "";
        }
        catch (err) {
            toast.error(err.response?.data?.message || "Upload failed");
        }
        finally {
            setUploading(false);
        }
    };
    const typeIcon = {
        xray: "🦴",
        photo: "📷",
        scan: "🔬",
    };
    return (_jsxs("div", { className: "flex", children: [_jsx(DoctorSidebar, {}), _jsxs("div", { className: "flex-1 ml-64", children: [_jsxs("div", { className: "sticky top-0 z-10 bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "H\u00ECnh \u1EA3nh" }), _jsxs("p", { className: "text-sm text-gray-500 mt-1", children: [filtered.length, " h\u00ECnh \u1EA3nh"] })] }), _jsx("button", { onClick: () => setShowUploadForm(true), disabled: uploading, className: "px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50", children: uploading ? "Đang tải..." : "+ Tải lên" })] }), _jsxs("div", { className: "space-y-4 p-8", children: [_jsx("input", { ref: fileRef, type: "file", accept: "image/*", className: "hidden", onChange: handleUpload }), showUploadForm && (_jsx("div", { className: "card border-2 border-dental-400 p-4 bg-dental-50", children: _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "label", children: "Select Patient" }), _jsxs("select", { className: "input", value: selectedPatient, onChange: (e) => setSelectedPatient(e.target.value), disabled: loadingPatients, children: [_jsx("option", { value: "", children: "Choose a patient..." }), patients.map((p) => (_jsxs("option", { value: p.id || p._id, children: [p.name, " - ", p.email] }, p.id || p._id)))] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => fileRef.current?.click(), disabled: !selectedPatient || uploading, className: "btn-primary flex-1", children: uploading ? "Uploading..." : "Select Image" }), _jsx("button", { onClick: () => {
                                                        setShowUploadForm(false);
                                                        setSelectedPatient("");
                                                        if (fileRef.current)
                                                            fileRef.current.value = "";
                                                    }, className: "btn-secondary", children: "Cancel" })] })] }) })), loading ? (_jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4", children: Array.from({ length: 8 }).map((_, i) => (_jsx("div", { className: "skeleton aspect-square rounded-xl" }, i))) })) : filtered.length === 0 ? (_jsxs("div", { className: "card text-center py-16", children: [_jsx("p", { className: "text-4xl mb-3", children: "\uD83D\uDDBC\uFE0F" }), _jsx("p", { className: "text-surface-500", children: "No images found" })] })) : (_jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4", children: filtered.map((img) => (_jsxs("div", { onClick: () => setPreview(img), className: "group relative aspect-square bg-surface-100 rounded-xl overflow-hidden cursor-pointer hover:shadow-card-hover transition-all duration-200", children: [_jsx("img", { src: img.url, alt: img.description || "Dental image", className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" }), _jsxs("div", { className: "absolute inset-0 bg-gradient-to-t from-surface-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3", children: [_jsx("p", { className: "text-white text-xs font-semibold", children: img.patientName }), _jsxs("p", { className: "text-white/70 text-[10px]", children: [typeIcon[img.type], " ", img.type, " \u2022", " ", img.uploadedAt?.split("T")[0]] })] })] }, img.id))) }))] })] }), preview && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-surface-900/80 backdrop-blur-sm p-4", onClick: () => setPreview(null), children: _jsxs("div", { className: "relative max-w-3xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl", onClick: (e) => e.stopPropagation(), children: [_jsx("img", { src: preview.url, alt: preview.description ?? "Dental image", className: "w-full max-h-[70vh] object-contain bg-surface-900" }), _jsxs("div", { className: "p-4 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "font-semibold text-surface-800", children: preview.patientName }), _jsxs("p", { className: "text-sm text-surface-500", children: [typeIcon[preview.type], " ", preview.type, " \u2022", " ", preview.uploadedAt?.split("T")[0]] }), preview.description && (_jsx("p", { className: "text-xs text-surface-400 mt-1", children: preview.description }))] }), _jsx("button", { onClick: () => setPreview(null), className: "btn-secondary", children: "Close" })] })] }) }))] }));
}
