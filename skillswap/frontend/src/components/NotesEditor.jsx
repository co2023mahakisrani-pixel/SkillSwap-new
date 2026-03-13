import React, { useContext, useState, useEffect } from 'react'
import { ThemeContext } from '../context/ThemeContext'
import notesService from '../services/notesService'

const NotesEditor = ({ lectureId, existingNote = null, onNoteUpdated }) => {
  const { isDark } = useContext(ThemeContext)
  const [notes, setNotes] = useState(existingNote?.content || '')
  const [noteId, setNoteId] = useState(existingNote?.id || null)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [noteCount, setNoteCount] = useState(existingNote ? 1 : 0)

  useEffect(() => {
    if (existingNote) {
      setNotes(existingNote.content)
      setNoteId(existingNote.id)
      setNoteCount(1)
    }
  }, [existingNote])

  const handleSave = async () => {
    if (!notes.trim()) {
      setMessage('Please write something before saving')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    setIsSaving(true)
    try {
      if (noteId) {
        // Update existing note
        await notesService.updateNote(noteId, { content: notes })
        setMessage('✅ Notes updated successfully!')
      } else {
        // Create new note
        const response = await notesService.createNote({ lectureId, content: notes })
        setNoteId(response.note?.id || response.data?.note?.id)
        setNoteCount(1)
        setMessage('✅ Notes saved successfully!')
      }
      setTimeout(() => setMessage(''), 3000)
      if (onNoteUpdated) onNoteUpdated()
    } catch (error) {
      setMessage('❌ Error saving notes')
      console.error(error)
    }
    setIsSaving(false)
  }

  const handleDelete = async () => {
    if (!noteId) return
    if (!window.confirm('Are you sure you want to delete this note?')) return

    try {
      await notesService.deleteNote(noteId)
      setNotes('')
      setNoteId(null)
      setNoteCount(0)
      setMessage('🗑️ Note deleted successfully!')
      setTimeout(() => setMessage(''), 3000)
      if (onNoteUpdated) onNoteUpdated()
    } catch (error) {
      setMessage('❌ Error deleting note')
      console.error(error)
    }
  }

  const handleDownload = () => {
    if (!notes.trim()) return
    const element = document.createElement('a')
    const file = new Blob([notes], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `lecture-${lectureId}-notes.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const wordCount = notes.trim().split(/\s+/).filter(word => word.length > 0).length
  const charCount = notes.length

  return (
    <div
      className={`rounded-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">My Notes</h3>
        <div className={`px-3 py-1 rounded-full ${noteCount > 0 ? 'bg-green-600' : 'bg-gray-600'} text-white text-sm font-bold`}>
          {noteCount} {noteCount === 1 ? 'Note' : 'Notes'}
        </div>
      </div>
      
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Write your notes here... Take notes while watching the lecture!"
        className={`w-full h-80 p-4 rounded-lg border-2 focus:outline-none focus:border-blue-500 resize-none ${
          isDark
            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
            : 'bg-white border-gray-300 text-black placeholder-gray-500'
        }`}
      />

      <div className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} flex justify-between`}>
        <span>📝 {wordCount} words | {charCount} characters</span>
        {noteId && <span className="text-green-600 font-semibold">✓ Saved</span>}
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {isSaving ? '💾 Saving...' : '💾 Save'}
        </button>
        <button
          onClick={handleDownload}
          disabled={!notes.trim()}
          className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
        >
          📥 Download
        </button>
        {noteId && (
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
          >
            🗑️ Delete
          </button>
        )}
      </div>

      {message && (
        <p className={`mt-3 text-center ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </p>
      )}
    </div>
  )
}

export default NotesEditor
