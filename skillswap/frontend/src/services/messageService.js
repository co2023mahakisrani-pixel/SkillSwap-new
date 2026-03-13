import { supabase } from '../lib/supabaseClient'

const messageService = {
  getMessages: async (otherUserId) => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${authUser.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${authUser.id})`)
      .order('created_at', { ascending: true })
    if (error) throw error
    return data || []
  },

  sendMessage: async (receiverId, content) => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('messages')
      .insert({ sender_id: authUser.id, receiver_id: receiverId, content })
      .select()
      .single()
    if (error) throw error
    return data
  },
}

export default messageService
