import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { scoreApi } from "../services/api";
import { useToast } from "../hooks/useToast";
export default function DentalScoreModal({ patient, isOpen, onClose }) {
    const { toast } = useToast();
    const [score, setScore] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [formData, setFormData] = useState({
        overall: 70,
        gumHealth: 70,
        toothDecay: 70,
        alignment: 70,
        cleanliness: 70,
        recommendations: "",
        nextCheckupDate: "",
        reason: "",
    });
    useEffect(() => {
        if (isOpen && patient._id) {
            loadScore();
        }
    }, [isOpen, patient._id]);
    const loadScore = async () => {
        setLoading(true);
        try {
            const res = await scoreApi.getByPatient(patient._id);
            const scoreData = res.data?.data;
            setScore(scoreData);
            // Initialize form with current values
            if (scoreData) {
                setFormData({
                    overall: scoreData.overall || 70,
                    gumHealth: scoreData.gumHealth || 70,
                    toothDecay: scoreData.toothDecay || 70,
                    alignment: scoreData.alignment || 70,
                    cleanliness: scoreData.cleanliness || 70,
                    recommendations: scoreData.recommendations?.join(", ") || "",
                    nextCheckupDate: scoreData.nextCheckupDate || "",
                    reason: "",
                });
            }
        }
        catch (err) {
            toast.error("Failed to load dental score");
        }
        finally {
            setLoading(false);
        }
    };
    const handleSave = async () => {
        if (!score)
            return;
        if (isEditing && !formData.reason.trim()) {
            toast.error("Please provide a reason for the edit");
            return;
        }
        setLoading(true);
        try {
            const payload = {
                overall: Number(formData.overall),
                gumHealth: Number(formData.gumHealth),
                toothDecay: Number(formData.toothDecay),
                alignment: Number(formData.alignment),
                cleanliness: Number(formData.cleanliness),
                recommendations: formData.recommendations
                    .split(",")
                    .map((r) => r.trim())
                    .filter((r) => r),
                nextCheckupDate: formData.nextCheckupDate || null,
                reason: formData.reason,
            };
            const res = await scoreApi.editScore(patient._id, payload);
            const updatedScore = res.data?.data;
            setScore(updatedScore);
            setIsEditing(false);
            setFormData((prev) => ({ ...prev, reason: "" }));
            toast.success("Dental score updated successfully");
        }
        catch (err) {
            toast.error(err.response?.data?.message || "Failed to update score");
        }
        finally {
            setLoading(false);
        }
    };
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "sticky top-0 bg-gradient-to-r from-dental-50 to-mint-50 px-6 py-4 border-b border-surface-100 flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-xl font-bold text-surface-900", children: ["Dental Score - ", patient.name] }), _jsx("p", { className: "text-sm text-surface-500 mt-1", children: patient.email })] }), _jsx("button", { onClick: onClose, className: "text-surface-400 hover:text-surface-600 text-2xl", children: "\u2715" })] }), _jsx("div", { className: "p-6", children: loading && !score ? (_jsx("div", { className: "flex items-center justify-center py-12", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-8 h-8 border-2 border-dental-400 border-t-dental-600 rounded-full animate-spin mx-auto mb-2" }), _jsx("p", { className: "text-surface-500", children: "Loading..." })] }) })) : score ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4 mb-6", children: [_jsxs("div", { className: "bg-gradient-dental/10 p-4 rounded-lg", children: [_jsx("p", { className: "text-xs text-surface-500 mb-1", children: "Overall" }), isEditing ? (_jsx("input", { type: "number", min: "0", max: "100", value: formData.overall, onChange: (e) => setFormData({
                                                    ...formData,
                                                    overall: Number(e.target.value),
                                                }), className: "input w-full text-lg font-bold" })) : (_jsx("p", { className: "text-2xl font-bold text-dental-600", children: score.overall }))] }), _jsxs("div", { className: "bg-mint-50 p-4 rounded-lg", children: [_jsx("p", { className: "text-xs text-surface-500 mb-1", children: "Gum Health" }), isEditing ? (_jsx("input", { type: "number", min: "0", max: "100", value: formData.gumHealth, onChange: (e) => setFormData({
                                                    ...formData,
                                                    gumHealth: Number(e.target.value),
                                                }), className: "input w-full text-lg font-bold" })) : (_jsx("p", { className: "text-2xl font-bold text-mint-600", children: score.gumHealth }))] }), _jsxs("div", { className: "bg-blue-50 p-4 rounded-lg", children: [_jsx("p", { className: "text-xs text-surface-500 mb-1", children: "Tooth Decay" }), isEditing ? (_jsx("input", { type: "number", min: "0", max: "100", value: formData.toothDecay, onChange: (e) => setFormData({
                                                    ...formData,
                                                    toothDecay: Number(e.target.value),
                                                }), className: "input w-full text-lg font-bold" })) : (_jsx("p", { className: "text-2xl font-bold text-blue-600", children: score.toothDecay }))] }), _jsxs("div", { className: "bg-purple-50 p-4 rounded-lg", children: [_jsx("p", { className: "text-xs text-surface-500 mb-1", children: "Alignment" }), isEditing ? (_jsx("input", { type: "number", min: "0", max: "100", value: formData.alignment, onChange: (e) => setFormData({
                                                    ...formData,
                                                    alignment: Number(e.target.value),
                                                }), className: "input w-full text-lg font-bold" })) : (_jsx("p", { className: "text-2xl font-bold text-purple-600", children: score.alignment }))] }), _jsxs("div", { className: "bg-amber-50 p-4 rounded-lg", children: [_jsx("p", { className: "text-xs text-surface-500 mb-1", children: "Cleanliness" }), isEditing ? (_jsx("input", { type: "number", min: "0", max: "100", value: formData.cleanliness, onChange: (e) => setFormData({
                                                    ...formData,
                                                    cleanliness: Number(e.target.value),
                                                }), className: "input w-full text-lg font-bold" })) : (_jsx("p", { className: "text-2xl font-bold text-amber-600", children: score.cleanliness }))] })] }), score.lastAssessedAt && (_jsx("div", { className: "bg-surface-50 p-4 rounded-lg mb-6", children: _jsxs("p", { className: "text-sm text-surface-600", children: [_jsx("span", { className: "font-medium", children: "Last Assessed:" }), " ", new Date(score.lastAssessedAt).toLocaleDateString(), score.lastAssessedBy && (_jsxs(_Fragment, { children: [" by ", score.lastAssessedBy.name] }))] }) })), isEditing && (_jsxs("div", { className: "bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-surface-900 mb-2", children: "Next Checkup Date" }), _jsx("input", { type: "date", value: formData.nextCheckupDate, onChange: (e) => setFormData({
                                                    ...formData,
                                                    nextCheckupDate: e.target.value,
                                                }), className: "input w-full" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-surface-900 mb-2", children: "Recommendations (comma-separated)" }), _jsx("textarea", { value: formData.recommendations, onChange: (e) => setFormData({
                                                    ...formData,
                                                    recommendations: e.target.value,
                                                }), placeholder: "e.g., Brush twice daily, Floss regularly", className: "input w-full h-20 resize-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-surface-900 mb-2", children: "Reason for Edit *" }), _jsx("textarea", { value: formData.reason, onChange: (e) => setFormData({ ...formData, reason: e.target.value }), placeholder: "Why are you editing this score?", className: "input w-full h-20 resize-none", required: true })] })] })), !isEditing && score.recommendations?.length > 0 && (_jsxs("div", { className: "bg-green-50 p-4 rounded-lg mb-6 border border-green-200", children: [_jsx("p", { className: "font-medium text-surface-900 mb-2", children: "Recommendations:" }), _jsx("ul", { className: "space-y-1", children: score.recommendations.map((rec, idx) => (_jsxs("li", { className: "text-sm text-surface-700 flex items-start gap-2", children: [_jsx("span", { className: "text-green-600 mt-1", children: "\u2713" }), rec] }, idx))) })] })), !isEditing && score.nextCheckupDate && (_jsx("div", { className: "bg-amber-50 p-4 rounded-lg mb-6 border border-amber-200", children: _jsxs("p", { className: "text-sm text-surface-900", children: [_jsx("span", { className: "font-medium", children: "Next Checkup:" }), " ", score.nextCheckupDate] }) })), score.editHistory && score.editHistory.length > 0 && (_jsxs("div", { className: "mb-6", children: [_jsxs("button", { onClick: () => setShowHistory(!showHistory), className: "text-sm text-dental-600 hover:text-dental-700 font-medium", children: [showHistory ? "Hide" : "Show", " Edit History (", score.editHistory.length, ")"] }), showHistory && (_jsx("div", { className: "mt-4 space-y-3 bg-gray-50 p-4 rounded-lg", children: score.editHistory.map((edit, idx) => (_jsxs("div", { className: "text-sm border-l-2 border-dental-400 pl-3", children: [_jsxs("p", { className: "font-medium text-surface-900", children: [edit.doctorName, " -", " ", new Date(edit.editedAt).toLocaleDateString()] }), _jsx("p", { className: "text-surface-600 text-xs mt-1", children: edit.reason })] }, idx))) }))] })), _jsx("div", { className: "flex gap-3", children: !isEditing ? (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => setIsEditing(true), className: "flex-1 btn-primary", children: "Edit Score" }), _jsx("button", { onClick: onClose, className: "flex-1 btn-secondary", children: "Close" })] })) : (_jsxs(_Fragment, { children: [_jsx("button", { onClick: handleSave, disabled: loading, className: "flex-1 btn-primary", children: loading ? "Saving..." : "Save Changes" }), _jsx("button", { onClick: () => {
                                                setIsEditing(false);
                                                setFormData((prev) => ({ ...prev, reason: "" }));
                                            }, className: "flex-1 btn-secondary", children: "Cancel" })] })) })] })) : (_jsxs("div", { className: "text-center py-12", children: [_jsx("p", { className: "text-surface-500", children: "No dental score found for this patient" }), _jsx("button", { onClick: () => setIsEditing(true), className: "btn-primary mt-4", children: "Create Score" })] })) })] }) }));
}
