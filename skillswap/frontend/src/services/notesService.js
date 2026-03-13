import { supabase } from '../lib/supabaseClient'

const mapNote = (note) => {
  if (!note) return note
  return {
    ...note,
    lectureId: note.lecture_id || note.lectureId,
    videoId: note.video_id || note.videoId,
    createdAt: note.created_at || note.createdAt,
    updatedAt: note.updated_at || note.updatedAt,
  }
}

const notesService = {
  getAllNotes: async () => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', authUser.id)
      .order('updated_at', { ascending: false })
    if (error) throw error
    const payload = { notes: (data || []).map(mapNote) }
    return { ...payload, data: payload }
  },
  getNotes: async (lectureId) => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('lecture_id', lectureId)
      .eq('user_id', authUser.id)
      .order('updated_at', { ascending: false })
    if (error) throw error
    const payload = { notes: data || [] }
    return { ...payload, data: payload }
  },

  createNote: async (noteData) => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    const payload = {
      ...noteData,
      lecture_id: noteData.lectureId ?? noteData.lecture_id,
      user_id: authUser.id,
    }
    delete payload.lectureId

    const { data, error } = await supabase
      .from('notes')
      .insert(payload)
      .select()
      .single()
    if (error) throw error
    const result = { note: mapNote(data) }
    return { ...result, data: result }
  },

  updateNote: async (noteId, noteData) => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('notes')
      .update(noteData)
      .eq('id', noteId)
      .eq('user_id', authUser.id)
      .select()
      .single()
    if (error) throw error
    const payload = { note: mapNote(data) }
    return { ...payload, data: payload }
  },

  deleteNote: async (noteId) => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId)
      .eq('user_id', authUser.id)
    if (error) throw error
    return { success: true }
  },

  downloadNote: async (lectureId) => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('notes')
      .select('content')
      .eq('lecture_id', lectureId)
      .eq('user_id', authUser.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()
    if (error) throw error
    return data?.content || ''
  },
}

export default notesService
