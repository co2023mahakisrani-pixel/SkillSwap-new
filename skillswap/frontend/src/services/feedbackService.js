import { supabase } from '../lib/supabaseClient'

const feedbackService = {
  submitFeedback: async (feedbackData) => {
    const { data: authData } = await supabase.auth.getUser()
    const authUser = authData?.user
    const { data, error } = await supabase
      .from('feedback')
      .insert({
        ...feedbackData,
        user_id: authUser?.id || null,
        email: feedbackData.email || authUser?.email || null,
      })
      .select()
      .single()
    if (error) throw error
    return { feedback: data }
  },

  getFeedback: async (page = 1, limit = 10) => {
    const { data, error, count } = await supabase
      .from('feedback')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)
    if (error) throw error
    const payload = { feedback: data || [], total: count || 0 }
    return { ...payload, data: payload }
  },

  contactForm: async (contactData) => {
    const { data: authData } = await supabase.auth.getUser()
    const authUser = authData?.user
    const { data, error } = await supabase
      .from('contacts')
      .insert({
        ...contactData,
        user_id: authUser?.id || null,
        email: contactData.email || authUser?.email || null,
      })
      .select()
      .single()
    if (error) throw error
    return { contact: data }
  },
}

export default feedbackService
