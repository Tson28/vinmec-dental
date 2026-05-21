import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
const faqData = [
    {
        id: 1,
        question: "Làm cách nào để tạo một lịch hẹn mới?",
        answer: "Bạn có thể tạo lịch hẹn bằng cách vào mục 'Lịch hẹn' và nhấp nút 'Thêm lịch hẹn'. Sau đó điền các thông tin bắt buộc như bệnh nhân, bác sĩ, ngày giờ và dịch vụ.",
    },
    {
        id: 2,
        question: "Cách thay đổi trạng thái lịch hẹn?",
        answer: "Trong mục 'Lịch hẹn', bạn có thể nhấp vào trạng thái của lịch hẹn (Chờ, Xác nhận, Hoàn tất, Hủy) để thay đổi. Hệ thống sẽ tự động gửi thông báo đến bệnh nhân.",
    },
    {
        id: 3,
        question: "Làm sao để xuất báo cáo?",
        answer: "Vào mục 'Báo cáo', chọn kỳ báo cáo (Tháng/Năm) rồi nhấp 'Xuất Excel', 'Xuất PDF' hoặc 'In' để tải báo cáo.",
    },
    {
        id: 4,
        question: "Làm cách nào quản lý người dùng?",
        answer: "Trong mục 'Người dùng', bạn có thể xem danh sách tất cả người dùng, thêm mới, chỉnh sửa thông tin hoặc xóa tài khoản.",
    },
    {
        id: 5,
        question: "Cách cập nhật thông tin bác sĩ?",
        answer: "Vào mục 'Bác sĩ', chọn bác sĩ cần cập nhật, nhấp 'Chỉnh sửa' và thay đổi các thông tin cần thiết.",
    },
    {
        id: 6,
        question: "Làm sao thêm dịch vụ mới?",
        answer: "Trong mục 'Dịch vụ', nhấp nút 'Thêm dịch vụ' và nhập tên dịch vụ, mô tả, giá cả. Dịch vụ sẽ được kích hoạt ngay.",
    },
    {
        id: 7,
        question: "Chế độ bảo trì là gì?",
        answer: "Chế độ bảo trì cho phép bạn tạm thời ẩn website khỏi người dùng khi cần cập nhật hoặc bảo trì hệ thống. Bạn có thể bật nó trong mục 'Cấu hình'.",
    },
    {
        id: 8,
        question: "Làm cách nào đặt lại mật khẩu?",
        answer: "Liên hệ với quản trị viên hệ thống hoặc sử dụng chức năng 'Quên mật khẩu' trên trang đăng nhập.",
    },
];
export default function AdminHelp() {
    const [expandedId, setExpandedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const filteredFAQ = faqData.filter((item) => item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase()));
    return (_jsxs("div", { className: "flex h-screen bg-gray-50", children: [_jsx(AdminSidebar, {}), _jsxs("div", { className: "flex-1 ml-64 overflow-y-auto", children: [_jsxs("div", { className: "bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8", children: [_jsx("h1", { className: "text-3xl font-bold mb-2", children: "Tr\u1EE3 gi\u00FAp & H\u1ED7 tr\u1EE3" }), _jsx("p", { className: "text-blue-100", children: "T\u00ECm hi\u1EC3u c\u00E1ch s\u1EED d\u1EE5ng h\u1EC7 th\u1ED1ng qu\u1EA3n l\u00FD ph\u00F2ng kh\u00E1m" })] }), _jsxs("div", { className: "p-8 max-w-4xl mx-auto", children: [_jsx("div", { className: "mb-8", children: _jsx("input", { type: "text", placeholder: "T\u00ECm ki\u1EBFm c\u00E2u h\u1ECFi...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" }) }), _jsxs("div", { className: "space-y-4", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-6", children: "C\u00E2u h\u1ECFi th\u01B0\u1EDDng g\u1EB7p" }), filteredFAQ.length > 0 ? (filteredFAQ.map((item) => (_jsxs("div", { className: "bg-white rounded-lg shadow border border-gray-200 overflow-hidden", children: [_jsxs("button", { onClick: () => setExpandedId(expandedId === item.id ? null : item.id), className: "w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 text-left", children: item.question }), _jsx("span", { className: `text-2xl text-gray-500 transition-transform ${expandedId === item.id ? "rotate-180" : ""}`, children: "\u25BC" })] }), expandedId === item.id && (_jsx("div", { className: "px-4 py-4 border-t border-gray-200 bg-gray-50", children: _jsx("p", { className: "text-gray-700 leading-relaxed", children: item.answer }) }))] }, item.id)))) : (_jsx("div", { className: "bg-white rounded-lg shadow p-8 text-center", children: _jsx("p", { className: "text-gray-600", children: "Kh\u00F4ng t\u00ECm th\u1EA5y c\u00E2u h\u1ECFi ph\u00F9 h\u1EE3p. H\u00E3y th\u1EED v\u1EDBi t\u1EEB kh\u00F3a kh\u00E1c." }) }))] }), _jsxs("div", { className: "mt-12 grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { className: "bg-white rounded-lg shadow p-6 text-center", children: [_jsx("div", { className: "text-4xl mb-4", children: "\uD83D\uDCE7" }), _jsx("h4", { className: "font-semibold text-gray-900 mb-2", children: "Email" }), _jsx("p", { className: "text-gray-600 text-sm", children: "support@vinamec.com" })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6 text-center", children: [_jsx("div", { className: "text-4xl mb-4", children: "\uD83D\uDCDE" }), _jsx("h4", { className: "font-semibold text-gray-900 mb-2", children: "Hotline h\u1ED7 tr\u1EE3" }), _jsx("p", { className: "text-gray-600 text-sm", children: "0243 123 456 789" })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6 text-center", children: [_jsx("div", { className: "text-4xl mb-4", children: "\u23F0" }), _jsx("h4", { className: "font-semibold text-gray-900 mb-2", children: "Th\u1EDDi gian l\u00E0m vi\u1EC7c" }), _jsx("p", { className: "text-gray-600 text-sm", children: "08:00 - 18:00, T2-T7" })] })] }), _jsxs("div", { className: "mt-12 bg-blue-50 border border-blue-200 rounded-lg p-8", children: [_jsx("h3", { className: "text-xl font-bold text-blue-900 mb-4", children: "\uD83D\uDCDA T\u00E0i li\u1EC7u h\u01B0\u1EDBng d\u1EABn" }), _jsxs("ul", { className: "space-y-3", children: [_jsx("li", { children: _jsx("a", { href: "#", className: "text-blue-600 hover:text-blue-800 font-medium", children: "\u2192 H\u01B0\u1EDBng d\u1EABn s\u1EED d\u1EE5ng cho qu\u1EA3n tr\u1ECB vi\u00EAn" }) }), _jsx("li", { children: _jsx("a", { href: "#", className: "text-blue-600 hover:text-blue-800 font-medium", children: "\u2192 H\u01B0\u1EDBng d\u1EABn qu\u1EA3n l\u00FD l\u1ECBch h\u1EB9n" }) }), _jsx("li", { children: _jsx("a", { href: "#", className: "text-blue-600 hover:text-blue-800 font-medium", children: "\u2192 Video h\u01B0\u1EDBng d\u1EABn tr\u1EF1c tuy\u1EBFn" }) }), _jsx("li", { children: _jsx("a", { href: "#", className: "text-blue-600 hover:text-blue-800 font-medium", children: "\u2192 Ch\u00EDnh s\u00E1ch b\u1EA3o m\u1EADt v\u00E0 \u0111i\u1EC1u kho\u1EA3n d\u1ECBch v\u1EE5" }) })] })] }), _jsxs("div", { className: "mt-12 bg-white rounded-lg shadow p-8", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900 mb-4", children: "\uD83D\uDCAC G\u1EEDi ph\u1EA3n h\u1ED3i" }), _jsxs("form", { className: "space-y-4", children: [_jsx("textarea", { placeholder: "Nh\u1EADp ph\u1EA3n h\u1ED3i c\u1EE7a b\u1EA1n...", rows: 5, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" }), _jsx("button", { type: "submit", className: "bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors", children: "G\u1EEDi ph\u1EA3n h\u1ED3i" })] })] })] })] })] }));
}
