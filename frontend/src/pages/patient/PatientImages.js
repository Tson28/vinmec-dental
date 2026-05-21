import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef } from "react";
import PatientSidebar from "../../components/layout/PatientSidebar";
import { imageApi } from "../../services/api";
import { useApi } from "../../hooks/useApi";
export default function PatientImages() {
    const { data: images, loading, refetch, } = useApi(() => imageApi.getMine());
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [uploadType, setUploadType] = useState("photo");
    const [description, setDescription] = useState("");
    const [showUploadPanel, setShowUploadPanel] = useState(false);
    const fileRef = useRef(null);
    const handleUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
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
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setUploading(false);
            if (fileRef.current)
                fileRef.current.value = "";
        }
    };
    const handleDelete = async (id) => {
        if (!confirm("Delete this image?"))
            return;
        await imageApi.delete(id);
        refetch();
    };
    const typeIcon = {
        xray: "🦴",
        photo: "📷",
        scan: "🔬",
    };
    const typeLabel = {
        xray: "X-Ray",
        photo: "Photo",
        scan: "Scan",
    };
    return (_jsxs("div", { className: "flex", children: [_jsx(PatientSidebar, {}), _jsxs("div", { className: "flex-1 ml-64", children: [_jsxs("div", { className: "sticky top-0 z-10 bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "H\u00ECnh \u1EA3nh c\u1EE7a t\u00F4i" }), _jsxs("p", { className: "text-sm text-gray-500 mt-1", children: [(images || []).length, " h\u00ECnh \u1EA3nh"] })] }), _jsx("button", { onClick: () => setShowUploadPanel(!showUploadPanel), className: "px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition", children: showUploadPanel ? "Hủy" : "+ Tải lên" })] }), _jsxs("div", { className: "space-y-4 p-8", children: [showUploadPanel && (_jsxs("div", { className: "bg-green-50 border border-green-200 rounded-lg p-6", children: [_jsx("h3", { className: "font-bold text-gray-900 mb-4", children: "T\u1EA3i l\u00EAn h\u00ECnh \u1EA3nh m\u1EDBi" }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-1", children: "Lo\u1EA1i h\u00ECnh \u1EA3nh" }), _jsxs("select", { className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500", value: uploadType, onChange: (e) => setUploadType(e.target.value), children: [_jsx("option", { value: "photo", children: "\uD83D\uDCF7 \u1EA2nh" }), _jsx("option", { value: "xray", children: "\uD83E\uDDB4 X-Quang" }), _jsx("option", { value: "scan", children: "\uD83D\uDD2C Qu\u00E9t" })] })] }), _jsxs("div", { className: "sm:col-span-2", children: [_jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-1", children: "M\u00F4 t\u1EA3 (t\u00F9y ch\u1ECDn)" }), _jsx("input", { className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500", placeholder: "V\u00ED d\u1EE5: \u1EA2nh r\u0103ng tr\u01B0\u1EDBc, x-quang h\u00E0m tr\u00EAn...", value: description, onChange: (e) => setDescription(e.target.value) })] })] }), _jsx("div", { className: "border-2 border-dashed border-green-300 rounded-lg p-8 text-center cursor-pointer hover:bg-green-100 transition", onClick: () => fileRef.current?.click(), children: uploading ? (_jsxs("div", { className: "flex flex-col items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 border-2 border-green-400 border-t-green-600 rounded-full animate-spin" }), _jsx("p", { className: "text-sm text-green-600 font-medium", children: "\u0110ang t\u1EA3i..." })] })) : (_jsxs(_Fragment, { children: [_jsx("p", { className: "text-3xl mb-2", children: "\uD83D\uDCC1" }), _jsx("p", { className: "text-sm font-semibold text-green-700", children: "Nh\u1EA5p \u0111\u1EC3 ch\u1ECDn h\u00ECnh \u1EA3nh" }), _jsx("p", { className: "text-xs text-gray-400 mt-1", children: "PNG, JPG, WEBP t\u1ED1i \u0111a 10MB" })] })) }), _jsx("input", { ref: fileRef, type: "file", accept: "image/*", className: "hidden", onChange: handleUpload })] })), loading ? (_jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4", children: Array.from({ length: 6 }).map((_, i) => (_jsx("div", { className: "aspect-square bg-gray-200 rounded-lg animate-pulse" }, i))) })) : (images || []).length === 0 ? (_jsxs("div", { className: "bg-white rounded-lg shadow text-center py-16", children: [_jsx("p", { className: "text-5xl mb-3", children: "\uD83D\uDDBC\uFE0F" }), _jsx("p", { className: "font-semibold text-gray-700", children: "Ch\u01B0a c\u00F3 h\u00ECnh \u1EA3nh" }), _jsx("p", { className: "text-sm text-gray-400 mt-1", children: "T\u1EA3i l\u00EAn h\u00ECnh \u1EA3nh nha khoa \u0111\u1EA7u ti\u00EAn c\u1EE7a b\u1EA1n \u0111\u1EC3 b\u1EAFt \u0111\u1EA7u" }), _jsx("button", { onClick: () => setShowUploadPanel(true), className: "inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition", children: "T\u1EA3i l\u00EAn h\u00ECnh \u1EA3nh" })] })) : (_jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4", children: (images || []).map((img) => (_jsxs("div", { className: "group relative aspect-square bg-gray-100 rounded-lg overflow-hidden", children: [_jsx("img", { src: img.url, alt: img.description || "Dental image", className: "w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300", onClick: () => setPreview(img) }), _jsxs("div", { className: "absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3", children: [_jsx("button", { onClick: () => handleDelete(img.id), className: "self-end w-7 h-7 bg-red-500 text-white rounded flex items-center justify-center text-xs hover:bg-red-600 transition", children: "\u2715" }), _jsxs("div", { children: [_jsxs("p", { className: "text-white text-xs font-semibold", children: [typeIcon[img.type], " ", typeLabel[img.type]] }), _jsx("p", { className: "text-white/70 text-[10px]", children: img.uploadedAt?.split("T")[0] }), img.description && (_jsx("p", { className: "text-white/70 text-[10px] truncate", children: img.description }))] })] })] }, img.id))) }))] }), preview && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-gray-900/90 backdrop-blur-sm p-4", onClick: () => setPreview(null), children: _jsxs("div", { className: "relative max-w-3xl w-full bg-white rounded-xl overflow-hidden shadow-2xl", onClick: (e) => e.stopPropagation(), children: [_jsx("img", { src: preview.url, alt: preview.description, className: "w-full max-h-[65vh] object-contain bg-gray-900" }), _jsxs("div", { className: "p-5 flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("p", { className: "font-bold text-gray-900", children: [typeIcon[preview.type], " ", typeLabel[preview.type]] }), _jsx("p", { className: "text-sm text-gray-500", children: preview.uploadedAt?.split("T")[0] }), preview.description && (_jsx("p", { className: "text-sm text-gray-600 mt-1", children: preview.description }))] }), _jsx("button", { onClick: () => setPreview(null), className: "px-4 py-2 bg-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-300 transition", children: "\u0110\u00F3ng" })] })] }) }))] })] }));
}
