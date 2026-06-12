import { useState, useEffect } from 'react'
import { notificationsAPI } from '../services/api'
import { Bell, Check, CheckCheck, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

const TYPE_ICONS = {
  swap_request: '🔄', swap_accepted: '✅', swap_rejected: '❌',
  swap_completed: '🎉', new_review: '⭐', new_follower: '👥',
}

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)

  const load = (unreadOnly) => {
    setLoading(true)
    const req = unreadOnly ? notificationsAPI.unread() : notificationsAPI.list()
    req.then(({ data }) => setNotifs(data.results || data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load(showUnreadOnly) }, [showUnreadOnly])

  const markRead = async (id) => {
    await notificationsAPI.markRead(id)
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
  }

  const markAll = async () => {
    await notificationsAPI.markAllRead()
    setNotifs(prev => prev.map(n => ({ ...n, is_read: true })))
    toast.success('Hamısı oxunmuş işarələndi.')
  }

  const deleteNotif = async (id) => {
    await notificationsAPI.delete(id)
    setNotifs(prev => prev.filter(n => n.id !== id))
  }

  const unreadCount = notifs.filter(n => !n.is_read).length

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Bell size={22} className="text-blue-600" /> Bildirişlər
          {!showUnreadOnly && unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{unreadCount}</span>
          )}
        </h1>
        <div className="flex gap-2">
          <button onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-colors ${showUnreadOnly ? 'bg-blue-600 text-white' : 'btn-secondary'}`}>
            {showUnreadOnly ? 'Bütün bildirişlər' : 'Oxunmamışlar'}
          </button>
          {unreadCount > 0 && (
            <button onClick={markAll} className="btn-secondary flex items-center gap-1.5 text-sm">
              <CheckCheck size={14} /> Hamısını oxu
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="card p-4 animate-pulse h-16" />)}
        </div>
      ) : notifs.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Bell size={40} className="mx-auto mb-3 opacity-30" />
          <p>Bildiriş yoxdur</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifs.map(n => (
            <div key={n.id} className={`card p-4 flex items-start gap-3 transition-colors ${!n.is_read ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''}`}>
              <span className="text-xl flex-shrink-0">{TYPE_ICONS[n.notif_type] || '🔔'}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${!n.is_read ? 'font-medium text-gray-900' : 'text-gray-700'}`}>{n.message}</p>
                <p className="text-xs text-gray-400 mt-0.5">{new Date(n.created_at).toLocaleString('az-AZ')}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {!n.is_read && (
                  <button onClick={() => markRead(n.id)} className="p-1.5 text-blue-500 hover:bg-blue-100 rounded-lg transition-colors" title="Oxunmuş işarələ">
                    <Check size={14} />
                  </button>
                )}
                <button onClick={() => deleteNotif(n.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Sil">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
