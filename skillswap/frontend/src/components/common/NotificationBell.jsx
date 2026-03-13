import React, { useEffect, useState } from 'react'
import notificationService from '../../services/notificationService'

const NotificationBell = () => {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const data = await notificationService.getNotifications(15)
        setItems(data)
      } catch (error) {
        console.error('Failed to load notifications:', error)
      }
    }
    load()
  }, [])

  const unreadCount = items.filter((n) => !n.read_at).length

  const markRead = async (id) => {
    try {
      await notificationService.markRead(id)
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)))
    } catch (error) {
      console.error('Failed to mark read:', error)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 rounded-full hover:bg-white/10 transition"
        aria-label="Notifications"
      >
        <span className="text-lg">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white text-black shadow-xl rounded-xl border border-gray-200 z-50">
          <div className="px-4 py-3 border-b border-gray-200 font-semibold">Notifications</div>
          {items.length === 0 ? (
            <div className="px-4 py-4 text-sm text-gray-500">No notifications yet.</div>
          ) : (
            <div className="max-h-96 overflow-auto">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => markRead(item.id)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 ${
                    item.read_at ? 'opacity-60' : ''
                  }`}
                >
                  <div className="text-sm font-semibold">{item.title || 'Update'}</div>
                  <div className="text-xs text-gray-600 mt-1">{item.body || item.type}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationBell
