import { supabase } from '../lib/supabaseClient'

const mapLecture = (lecture) => {
  if (!lecture) return lecture
  return {
    ...lecture,
    videoUrl: lecture.video_url || lecture.videoUrl,
    teacherId: lecture.teacher_id || lecture.teacherId,
    teacherName: lecture.teacher_name || lecture.teacherName,
    tokens: lecture.token_cost ?? lecture.tokens,
    fullDescription: lecture.full_description || lecture.fullDescription,
  }
}

const lectureService = {
  getAllLectures: async (page = 1, limit = 10, search = '') => {
    let query = supabase
      .from('lectures')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data, error, count } = await query
    if (error) throw error
    const payload = { lectures: (data || []).map(mapLecture), total: count || 0, page, limit }
    return { ...payload, data: payload }
  },

  getLectureById: async (id) => {
    const { data, error } = await supabase
      .from('lectures')
      .select('*, teacher:profiles(*)')
      .eq('id', id)
      .single()
    if (error) throw error
    const payload = { lecture: { ...mapLecture(data), teacher: data?.teacher } }
    return { ...payload, data: payload }
  },

  createLecture: async (lectureData) => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    const insertPayload = {
      title: lectureData.title,
      description: lectureData.description,
      video_url: lectureData.videoUrl || lectureData.video_url,
      token_cost: lectureData.tokens || lectureData.token_cost || 1,
      duration: lectureData.duration || null,
      full_description: lectureData.fullDescription || lectureData.full_description,
      teacher_name: lectureData.teacherName || lectureData.teacher_name,
    }

    const { data, error } = await supabase
      .from('lectures')
      .insert({ ...insertPayload, teacher_id: authUser.id })
      .select()
      .single()
    if (error) throw error
    const responsePayload = { lecture: mapLecture(data) }
    return { ...responsePayload, data: responsePayload }
  },

  updateLecture: async (id, lectureData) => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    const updatePayload = {
      title: lectureData.title,
      description: lectureData.description,
      video_url: lectureData.videoUrl || lectureData.video_url,
      token_cost: lectureData.tokens || lectureData.token_cost,
      duration: lectureData.duration,
      full_description: lectureData.fullDescription || lectureData.full_description,
      teacher_name: lectureData.teacherName || lectureData.teacher_name,
    }

    Object.keys(updatePayload).forEach((key) => updatePayload[key] === undefined && delete updatePayload[key])

    const { data, error } = await supabase
      .from('lectures')
      .update(updatePayload)
      .eq('id', id)
      .eq('teacher_id', authUser.id)
      .select()
      .single()
    if (error) throw error
    const responsePayload = { lecture: mapLecture(data) }
    return { ...responsePayload, data: responsePayload }
  },

  deleteLecture: async (id) => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('lectures')
      .delete()
      .eq('id', id)
      .eq('teacher_id', authUser.id)
    if (error) throw error
    return { success: true }
  },

  watchLecture: async (id) => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    const { data: lecture, error: lectureError } = await supabase
      .from('lectures')
      .select('id, token_cost')
      .eq('id', id)
      .single()
    if (lectureError) throw lectureError

    const tokenCost = lecture?.token_cost || 1
    await supabase.rpc('decrement_tokens', { user_id_input: authUser.id, amount_input: tokenCost })
    await supabase.from('token_history').insert({
      user_id: authUser.id,
      amount: -tokenCost,
      reason: 'lecture_watch',
      metadata: { lecture_id: id },
    })

    return { success: true }
  },

  getTeacherLectures: async () => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('lectures')
      .select('*')
      .eq('teacher_id', authUser.id)
      .order('created_at', { ascending: false })
    if (error) throw error
    const payload = { lectures: (data || []).map(mapLecture) }
    return { ...payload, data: payload }
  },
}

export default lectureService
