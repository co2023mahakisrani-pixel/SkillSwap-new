import { supabase } from '../lib/supabaseClient'

const notificationService = {
  getNotifications: async (limit = 20) => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', authUser.id)
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) throw error
    return data || []
  },

  markRead: async (notificationId) => {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', notificationId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  createNotification: async ({ userId, type, title, body, metadata = {} }) => {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        body,
        metadata,
      })
      .select()
      .single()
    if (error) throw error
    return data
  },
}

export default notificationService
