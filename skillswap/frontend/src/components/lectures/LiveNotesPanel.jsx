import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import notificationService from '../../services/notificationService'

const LiveNotesPanel = ({ lecture }) => {
  const [notes, setNotes] = useState([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!lecture?.id) return

    const loadNotes = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('live_notes')
        .select('*, author:profiles(*)')
        .eq('lecture_id', lecture.id)
        .order('created_at', { ascending: true })
      if (!error) setNotes(data || [])
      setLoading(false)
    }

    loadNotes()

    const channel = supabase
      .channel(`live-notes-${lecture.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'live_notes', filter: `lecture_id=eq.${lecture.id}` },
        (payload) => {
          setNotes((prev) => [...prev, payload.new])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [lecture?.id])

  const sendNote = async () => {
    if (!content.trim()) return
    const { data: authData } = await supabase.auth.getUser()
    const authUser = authData?.user
    if (!authUser) return

    const { data, error } = await supabase
      .from('live_notes')
      .insert({
        lecture_id: lecture.id,
        author_id: authUser.id,
        content,
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to send live note:', error)
      return
    }

    setNotes((prev) => [...prev, data])
    setContent('')

    if (lecture.teacherId && lecture.teacherId !== authUser.id) {
      await notificationService.createNotification({
        userId: lecture.teacherId,
        type: 'lecture_note',
        title: `New live note in ${lecture.title}`,
        body: content.slice(0, 120),
        metadata: { lecture_id: lecture.id },
      })
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Live Notes</h3>
        <span className="text-xs text-gray-400">Real-time shared notes</span>
      </div>

      <div className="h-56 overflow-auto space-y-3 mb-3">
        {loading ? (
          <p className="text-sm text-gray-400">Loading notes...</p>
        ) : notes.length === 0 ? (
          <p className="text-sm text-gray-400">No shared notes yet.</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="rounded-lg bg-white/10 p-3">
              <div className="text-xs text-gray-400 mb-1">
                {note.author?.name || 'User'} • {new Date(note.created_at || note.createdAt).toLocaleTimeString()}
              </div>
              <div className="text-sm text-gray-100">{note.content}</div>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share a quick note with the class..."
          className="flex-1 bg-white/10 text-white rounded-lg px-3 py-2 border border-white/10 focus:border-cyan-400 outline-none text-sm"
        />
        <button
          onClick={sendNote}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-semibold"
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default LiveNotesPanel
