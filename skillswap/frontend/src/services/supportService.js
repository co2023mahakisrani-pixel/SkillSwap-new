import { supabase } from '../lib/supabaseClient'

const supportService = {
  // Create new support ticket
  createTicket: async (data) => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    const { data: ticket, error } = await supabase
      .from('support_tickets')
      .insert({ ...data, user_id: authUser.id, status: 'open' })
      .select()
      .single()
    if (error) throw error
    return { ticket }
  },

  // Send message in support ticket
  sendMessage: async (supportId, message) => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('support_messages')
      .insert({ ticket_id: supportId, message, sender_id: authUser.id })
      .select()
      .single()
    if (error) throw error
    return { message: data }
  },

  // Get user's support tickets
  getUserTickets: async (page = 1, limit = 10, status = 'all') => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    let query = supabase
      .from('support_tickets')
      .select('*', { count: 'exact' })
      .eq('user_id', authUser.id)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)
    if (status !== 'all') query = query.eq('status', status)

    const { data, error, count } = await query
    if (error) throw error
    return { tickets: data || [], total: count || 0 }
  },

  // Get support stats
  getSupportStats: async () => {
    const { data, error } = await supabase
      .from('support_tickets')
      .select('status')
    if (error) throw error
    const stats = (data || []).reduce((acc, row) => {
      acc[row.status] = (acc[row.status] || 0) + 1
      return acc
    }, {})
    return { stats }
  },

  // Get ticket details with messages
  getTicketDetails: async (ticketId) => {
    const { data: ticket, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('id', ticketId)
      .single()
    if (error) throw error

    const { data: messages, error: messageError } = await supabase
      .from('support_messages')
      .select('*, sender:profiles(*)')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true })
    if (messageError) throw messageError

    return { ticket, messages: messages || [] }
  },

  // Close ticket
  closeTicket: async (ticketId, resolution) => {
    const { data, error } = await supabase
      .from('support_tickets')
      .update({ status: 'closed', resolution })
      .eq('id', ticketId)
      .select()
      .single()
    if (error) throw error
    return { ticket: data }
  },

  // Reopen ticket
  reopenTicket: async (ticketId) => {
    const { data, error } = await supabase
      .from('support_tickets')
      .update({ status: 'open' })
      .eq('id', ticketId)
      .select()
      .single()
    if (error) throw error
    return { ticket: data }
  },
}

export default supportService
