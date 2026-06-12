import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { notificationsAPI, usersAPI } from '../../services/api'
import { Bell, LogOut, User, Plus, Home, Repeat2, Trophy, Rss, Menu, X, Search, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [unread, setUnread] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchOpen, setSearchOpen] = useState(false)
  const searchRef = useRef(null)
  const searchInputRef = useRef(null)

  useEffect(() => {
    if (user) {
      notificationsAPI.unreadCount()
        .then(({ data }) => setUnread(data.count))
        .catch(() => {})
    }
  }, [user, location.pathname])

  const handleLogout = async () => {
    await logout()
    toast.success('Çıxış edildi')
    navigate('/')
  }

  useEffect(() => {
    if (searchQuery.length < 2) { setSearchResults([]); return }
    const timer = setTimeout(() => {
      usersAPI.search(searchQuery).then(({ data }) => setSearchResults(data.results || data)).catch(() => {})
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const navLink = (to, label, Icon) => (
    <Link
      to={to}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        location.pathname === to
          ? 'bg-blue-50 text-blue-700'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
      onClick={() => setMenuOpen(false)}
    >
      <Icon size={16} />
      {label}
    </Link>
  )

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-blue-600 text-lg">
            <Repeat2 size={22} />
            <span>SkillSwap</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLink('/', 'Ana səhifə', Home)}
            {navLink('/skills', 'Bacarıqlar', Repeat2)}
            {navLink('/leaderboard', 'Reytinq', Trophy)}
            {user && navLink('/feed', 'Lent', Rss)}
            {user && navLink('/swaps', 'Swap-lar', Repeat2)}
          </div>

          {/* Desktop search */}
          <div className="hidden md:block relative" ref={searchRef}>
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-1.5 text-sm">
              <Search size={14} className="text-gray-400 mr-2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true) }}
                onFocus={() => setSearchOpen(true)}
                placeholder="İstifadəçi axtar..."
                className="bg-transparent outline-none w-36 text-gray-700 placeholder-gray-400"
              />
            </div>
            {searchOpen && searchResults.length > 0 && (
              <div className="absolute top-full right-0 mt-1 w-64 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                {searchResults.slice(0, 6).map(u => (
                  <Link key={u.id} to={`/users/${u.id}`} onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                      {u.username?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{u.first_name || u.username}</div>
                      <div className="text-xs text-gray-500">@{u.username}</div>
                    </div>
                  </Link>
                ))}
                <Link to={`/skills?search=${searchQuery}`} onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                  className="flex items-center justify-center gap-1 px-4 py-2.5 text-xs text-blue-600 border-t border-gray-100 hover:bg-blue-50 transition-colors">
                  Bacarıqlarda axtar <ArrowRight size={12} />
                </Link>
              </div>
            )}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Link to="/create-skill" className="btn-primary flex items-center gap-1.5 text-sm py-1.5">
                  <Plus size={16} /> Bacarıq əlavə et
                </Link>
                <Link to="/notifications" className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell size={20} />
                  {unread > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </Link>
                <Link to="/profile" className="flex items-center gap-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <User size={20} />
                  <span className="text-sm font-medium">{user.username}</span>
                </Link>
                <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm py-1.5">Giriş</Link>
                <Link to="/register" className="btn-primary text-sm py-1.5">Qeydiyyat</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-lg text-gray-500" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-1 border-t border-gray-100 pt-2">
            {navLink('/', 'Ana səhifə', Home)}
            {navLink('/skills', 'Bacarıqlar', Repeat2)}
            {navLink('/leaderboard', 'Reytinq', Trophy)}
            {user && navLink('/feed', 'Lent', Rss)}
            {user && navLink('/swaps', 'Swap-lar', Repeat2)}
            {user ? (
              <div className="pt-2 border-t border-gray-100 space-y-1">
                <Link to="/create-skill" className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 font-medium" onClick={() => setMenuOpen(false)}>
                  <Plus size={16} /> Bacarıq əlavə et
                </Link>
                <Link to="/notifications" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600" onClick={() => setMenuOpen(false)}>
                  <Bell size={16} /> Bildirişlər {unread > 0 && <span className="bg-red-500 text-white text-xs px-1.5 rounded-full">{unread}</span>}
                </Link>
                <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600" onClick={() => setMenuOpen(false)}>
                  <User size={16} /> Profil ({user.username})
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 w-full text-left">
                  <LogOut size={16} /> Çıxış
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-gray-100 flex gap-2 px-3">
                <Link to="/login" className="btn-secondary flex-1 text-center text-sm" onClick={() => setMenuOpen(false)}>Giriş</Link>
                <Link to="/register" className="btn-primary flex-1 text-center text-sm" onClick={() => setMenuOpen(false)}>Qeydiyyat</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
