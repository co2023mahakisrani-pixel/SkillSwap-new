import React, { useContext, useEffect, useState } from 'react'
import { ThemeContext } from '../context/ThemeContext'
import socialService from '../services/socialService'

const Bookmarks = () => {
  const { isDark } = useContext(ThemeContext)
  const [items, setItems] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const data = await socialService.getBookmarks()
        setItems(data)
      } catch (error) {
        console.error('Failed to load bookmarks:', error)
      }
    }
    load()
  }, [])

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} py-10`}>
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Bookmarks & Wishlist</h1>
        {items.length === 0 ? (
          <p className="text-gray-500">No bookmarks yet.</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className={`rounded-xl p-4 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow`}>
                <p className="font-semibold">{item.item_type.toUpperCase()}</p>
                <p className="text-sm text-gray-500">Item ID: {item.item_id}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Bookmarks
