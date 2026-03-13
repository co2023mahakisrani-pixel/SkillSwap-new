import React, { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ThemeContext } from '../context/ThemeContext'
import messageService from '../services/messageService'
import notificationService from '../services/notificationService'

const Messages = () => {
  const { isDark } = useContext(ThemeContext)
  const [searchParams] = useSearchParams()
  const receiverId = searchParams.get('to')

  const [messages, setMessages] = useState([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const loadMessages = async () => {
    if (!receiverId) return
    setLoading(true)
    try {
      const data = await messageService.getMessages(receiverId)
      setMessages(data)
    } catch (error) {
      console.error('Failed to load messages:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMessages()
  }, [receiverId])

  const handleSend = async () => {
    if (!content.trim() || !receiverId) return
    try {
      const message = await messageService.sendMessage(receiverId, content.trim())
      setMessages((prev) => [...prev, message])
      setContent('')
      await notificationService.createNotification({
        userId: receiverId,
        type: 'message',
        title: 'New message',
        body: content.trim().slice(0, 140),
      })
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} py-10`}>
      <div className="max-w-4xl mx-auto px-4">
        <div className={`rounded-2xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
          <h1 className="text-3xl font-bold mb-2">Messages</h1>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Chat with teachers and students in real time.
          </p>

          {!receiverId && (
            <p className="mt-6 text-sm text-gray-500">Select a user to start messaging.</p>
          )}

          {receiverId && (
            <>
              <div className="mt-6 h-80 overflow-auto space-y-3 border border-white/10 rounded-xl p-4">
                {loading ? (
                  <p className="text-sm text-gray-400">Loading messages...</p>
                ) : messages.length === 0 ? (
                  <p className="text-sm text-gray-400">No messages yet.</p>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className="text-sm bg-white/10 rounded-lg p-3">
                      {msg.content}
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(msg.created_at || msg.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <input
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-lg px-3 py-2 border border-gray-300"
                />
                <button
                  onClick={handleSend}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Messages
