import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ToothIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path d="M12 2C9 2 6 4.5 6 7.5c0 1.5.5 3 1 4.5L8 18c.5 2 1.5 4 4 4s3.5-2 4-4l1-6c.5-1.5 1-3 1-4.5C18 4.5 15 2 12 2z"/>
  </svg>
)

interface NavItem { label: string; path: string; icon: string }

const adminNav: NavItem[] = [
  { label: 'Dashboard', path: '/admin', icon: '🏠' },
  { label: 'Users', path: '/admin/users', icon: '👥' },
  { label: 'Doctors', path: '/admin/doctors', icon: '👨‍⚕️' },
  { label: 'Services', path: '/admin/services', icon: '🦷' },
]
const doctorNav: NavItem[] = [
  { label: 'Dashboard', path: '/doctor', icon: '🏠' },
  { label: 'Patients', path: '/doctor/patients', icon: '🧑‍🤝‍🧑' },
  { label: 'Appointments', path: '/doctor/appointments', icon: '📅' },
  { label: 'Records', path: '/doctor/records', icon: '📋' },
  { label: 'Images', path: '/doctor/images', icon: '🖼️' },
  { label: 'AI Chatbot', path: '/doctor/chat', icon: '🤖' },
  { label: 'Video Call', path: '/video-call', icon: '📹' },
]
const patientNav: NavItem[] = [
  { label: 'Dashboard', path: '/patient', icon: '🏠' },
  { label: 'My Profile', path: '/patient/profile', icon: '👤' },
  { label: 'Appointments', path: '/patient/appointments', icon: '📅' },
  { label: 'Records', path: '/patient/records', icon: '📋' },
  { label: 'Images', path: '/patient/images', icon: '🖼️' },
  { label: 'Dental Score', path: '/patient/score', icon: '⭐' },
  { label: 'AI Chatbot', path: '/patient/chat', icon: '🤖' },
  { label: 'Video Call', path: '/video-call', icon: '📹' },
]

interface Props { collapsed?: boolean; onCollapse?: () => void }

export default function Sidebar({ collapsed, onCollapse }: Props) {
  const { role, user, logout } = useAuth()
  const navigate = useNavigate()

  const nav = role === 'admin' ? adminNav : role === 'doctor' ? doctorNav : patientNav
  const roleLabel = role === 'admin' ? 'Administrator' : role === 'doctor' ? 'Doctor' : 'Patient'
  const roleColor = role === 'admin' ? 'badge-red' : role === 'doctor' ? 'badge-blue' : 'badge-green'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className={`flex flex-col h-screen bg-white border-r border-surface-100 shadow-card transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-surface-100">
        <div className="w-9 h-9 rounded-xl bg-gradient-dental flex items-center justify-center text-white flex-shrink-0">
          <ToothIcon />
        </div>
        {!collapsed && (
          <div>
            <p className="font-display font-bold text-sm text-surface-900 leading-tight">VinaMec</p>
            <p className="text-[10px] text-surface-400 font-medium">Dental Care AI</p>
          </div>
        )}
        <button onClick={onCollapse} className="ml-auto text-surface-400 hover:text-surface-600 transition">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            {collapsed ? <path d="M13 17l5-5-5-5M6 17l5-5-5-5"/> : <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"/>}
          </svg>
        </button>
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="px-4 py-4 border-b border-surface-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-dental flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user?.name?.charAt(0) || '?'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-surface-800 truncate">{user?.name || 'User'}</p>
              <span className={`badge text-[10px] ${roleColor}`}>{roleLabel}</span>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {nav.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin' || item.path === '/doctor' || item.path === '/patient'}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`}
          >
            <span className="text-base">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
        {!collapsed && (
          <NavLink to="/chat/public" className="sidebar-link">
            <span className="text-base">💬</span>
            <span>Public Chat</span>
          </NavLink>
        )}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-surface-100">
        <button
          onClick={handleLogout}
          className={`w-full sidebar-link text-red-400 hover:bg-red-50 hover:text-red-600 ${collapsed ? 'justify-center px-2' : ''}`}
        >
          <span className="text-base">🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}