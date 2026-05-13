import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const menuItems = [
    { icon: "📊", label: "Tổng quan", path: "/admin" },
    { icon: "📅", label: "Lịch hẹn", path: "/admin/appointments" },
    { icon: "📈", label: "Báo cáo", path: "/admin/reports" },
    { icon: "👥", label: "Người dùng", path: "/admin/users" },
    { icon: "👨‍⚕️", label: "Bác sĩ", path: "/admin/doctors" },
    { icon: "🦷", label: "Dịch vụ", path: "/admin/services" },
    { icon: "⚙️", label: "Cấu hình", path: "/admin/settings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div
      className={`sidebar transition-all duration-300 ${isOpen ? "w-64" : "w-20"} bg-white text-gray-900 h-screen fixed left-0 top-0 flex flex-col border-r border-gray-200`}
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between hover:bg-gray-50 transition-colors">
        <div className={`flex items-center gap-3 ${!isOpen && "hidden"}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg">
            M
          </div>
          <div>
            <span className="font-bold text-lg block text-gray-900">Mec</span>
            <span className="text-xs text-gray-500">Hệ thống quản lý</span>
          </div>
        </div>
        {isOpen && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hover:bg-gray-200 p-2 rounded transition-colors text-gray-600"
            title="Collapse"
          >
            ‹
          </button>
        )}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hover:bg-gray-200 p-2 rounded transition-colors w-full text-gray-600"
            title="Expand"
          >
            ›
          </button>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-6">
        <div className={`space-y-1 ${isOpen ? "px-4" : "px-2"}`}>
          {isOpen && (
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-3">
              Danh mục
            </div>
          )}
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                isActive(item.path)
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
              title={!isOpen ? item.label : undefined}
            >
              <span className="text-lg">{item.icon}</span>
              {isOpen && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className={`border-t border-gray-200 p-4 space-y-2 bg-gray-50`}>
        <button
          onClick={() => navigate("/admin/help")}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors font-medium text-sm ${
            !isOpen && "justify-center"
          }`}
          title={!isOpen ? "Trợ giúp" : undefined}
        >
          <span className="text-lg">❓</span>
          {isOpen && <span>Trợ giúp</span>}
        </button>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors font-medium text-sm ${
            !isOpen && "justify-center"
          }`}
          title={!isOpen ? "Đăng xuất" : undefined}
        >
          <span className="text-lg">🚪</span>
          {isOpen && <span>Đăng xuất</span>}
        </button>
      </div>
    </div>
  );
}
