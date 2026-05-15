import { useState } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "Làm cách nào để tạo một lịch hẹn mới?",
    answer:
      "Bạn có thể tạo lịch hẹn bằng cách vào mục 'Lịch hẹn' và nhấp nút 'Thêm lịch hẹn'. Sau đó điền các thông tin bắt buộc như bệnh nhân, bác sĩ, ngày giờ và dịch vụ.",
  },
  {
    id: 2,
    question: "Cách thay đổi trạng thái lịch hẹn?",
    answer:
      "Trong mục 'Lịch hẹn', bạn có thể nhấp vào trạng thái của lịch hẹn (Chờ, Xác nhận, Hoàn tất, Hủy) để thay đổi. Hệ thống sẽ tự động gửi thông báo đến bệnh nhân.",
  },
  {
    id: 3,
    question: "Làm sao để xuất báo cáo?",
    answer:
      "Vào mục 'Báo cáo', chọn kỳ báo cáo (Tháng/Năm) rồi nhấp 'Xuất Excel', 'Xuất PDF' hoặc 'In' để tải báo cáo.",
  },
  {
    id: 4,
    question: "Làm cách nào quản lý người dùng?",
    answer:
      "Trong mục 'Người dùng', bạn có thể xem danh sách tất cả người dùng, thêm mới, chỉnh sửa thông tin hoặc xóa tài khoản.",
  },
  {
    id: 5,
    question: "Cách cập nhật thông tin bác sĩ?",
    answer:
      "Vào mục 'Bác sĩ', chọn bác sĩ cần cập nhật, nhấp 'Chỉnh sửa' và thay đổi các thông tin cần thiết.",
  },
  {
    id: 6,
    question: "Làm sao thêm dịch vụ mới?",
    answer:
      "Trong mục 'Dịch vụ', nhấp nút 'Thêm dịch vụ' và nhập tên dịch vụ, mô tả, giá cả. Dịch vụ sẽ được kích hoạt ngay.",
  },
  {
    id: 7,
    question: "Chế độ bảo trì là gì?",
    answer:
      "Chế độ bảo trì cho phép bạn tạm thời ẩn website khỏi người dùng khi cần cập nhật hoặc bảo trì hệ thống. Bạn có thể bật nó trong mục 'Cấu hình'.",
  },
  {
    id: 8,
    question: "Làm cách nào đặt lại mật khẩu?",
    answer:
      "Liên hệ với quản trị viên hệ thống hoặc sử dụng chức năng 'Quên mật khẩu' trên trang đăng nhập.",
  },
];

export default function AdminHelp() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFAQ = faqData.filter(
    (item) =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 ml-64 overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
          <h1 className="text-3xl font-bold mb-2">Trợ giúp & Hỗ trợ</h1>
          <p className="text-blue-100">
            Tìm hiểu cách sử dụng hệ thống quản lý phòng khám
          </p>
        </div>

        {/* Content */}
        <div className="p-8 max-w-4xl mx-auto">
          {/* Search */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Tìm kiếm câu hỏi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* FAQ */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Câu hỏi thường gặp
            </h2>

            {filteredFAQ.length > 0 ? (
              filteredFAQ.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === item.id ? null : item.id)
                    }
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 text-left">
                      {item.question}
                    </h3>
                    <span
                      className={`text-2xl text-gray-500 transition-transform ${
                        expandedId === item.id ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  </button>

                  {expandedId === item.id && (
                    <div className="px-4 py-4 border-t border-gray-200 bg-gray-50">
                      <p className="text-gray-700 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-600">
                  Không tìm thấy câu hỏi phù hợp. Hãy thử với từ khóa khác.
                </p>
              </div>
            )}
          </div>

          {/* Contact Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-4xl mb-4">📧</div>
              <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
              <p className="text-gray-600 text-sm">support@vinamec.com</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-4xl mb-4">📞</div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Hotline hỗ trợ
              </h4>
              <p className="text-gray-600 text-sm">0243 123 456 789</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-4xl mb-4">⏰</div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Thời gian làm việc
              </h4>
              <p className="text-gray-600 text-sm">08:00 - 18:00, T2-T7</p>
            </div>
          </div>

          {/* Documentation */}
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-8">
            <h3 className="text-xl font-bold text-blue-900 mb-4">
              📚 Tài liệu hướng dẫn
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  → Hướng dẫn sử dụng cho quản trị viên
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  → Hướng dẫn quản lý lịch hẹn
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  → Video hướng dẫn trực tuyến
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  → Chính sách bảo mật và điều khoản dịch vụ
                </a>
              </li>
            </ul>
          </div>

          {/* Feedback */}
          <div className="mt-12 bg-white rounded-lg shadow p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              💬 Gửi phản hồi
            </h3>
            <form className="space-y-4">
              <textarea
                placeholder="Nhập phản hồi của bạn..."
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Gửi phản hồi
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
