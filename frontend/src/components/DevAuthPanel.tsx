import { useAuth } from "../context/AuthContext";
import type { Role, User } from "../types";

export default function DevAuthPanel() {
  const { login, logout, role, user } = useAuth();

  const mockUsers: Record<Role, { user: User; token: string }> = {
    admin: {
      token: "dev-token-admin",
      user: {
        _id: "1",
        email: "admin@vinamec.vn",
        name: "Admin User",
        role: "admin",
      },
    },
    doctor: {
      token: "dev-token-doctor",
      user: {
        _id: "2",
        email: "doctor@vinamec.vn",
        name: "Doctor User",
        role: "doctor",
      },
    },
    patient: {
      token: "dev-token-patient",
      user: {
        _id: "3",
        email: "patient@vinamec.vn",
        name: "Patient User",
        role: "patient",
      },
    },
  };

  const handleLogin = (r: Role) => {
    const { token, user: mockUser } = mockUsers[r];
    login(token, r, mockUser);
  };

  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50">
      <div className="text-sm font-bold mb-3 border-b pb-2">Dev Auth Panel</div>

      {!user ? (
        <div className="space-y-2">
          <div className="text-xs text-gray-300 mb-2">Quick Login:</div>
          <button
            onClick={() => handleLogin("admin")}
            className="block w-full px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm"
          >
            Login as Admin
          </button>
          <button
            onClick={() => handleLogin("doctor")}
            className="block w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
          >
            Login as Doctor
          </button>
          <button
            onClick={() => handleLogin("patient")}
            className="block w-full px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-sm"
          >
            Login as Patient
          </button>
        </div>
      ) : (
        <div>
          <div className="text-xs mb-3">
            <div>User: {user.name}</div>
            <div>Role: {role}</div>
          </div>
          <div className="space-y-2 border-t pt-2">
            <button
              onClick={() => handleLogin("admin")}
              className="block w-full px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
            >
              Switch to Admin
            </button>
            <button
              onClick={() => handleLogin("doctor")}
              className="block w-full px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
            >
              Switch to Doctor
            </button>
            <button
              onClick={() => handleLogin("patient")}
              className="block w-full px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs"
            >
              Switch to Patient
            </button>
            <button
              onClick={logout}
              className="block w-full px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-xs"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
