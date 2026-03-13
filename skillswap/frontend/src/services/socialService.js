import { supabase } from '../lib/supabaseClient'

const socialService = {
  followUser: async (targetUserId) => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('follows')
      .insert({ follower_id: authUser.id, following_id: targetUserId })
      .select()
      .single()
    if (error) throw error
    return data
  },

  unfollowUser: async (targetUserId) => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', authUser.id)
      .eq('following_id', targetUserId)
    if (error) throw error
    return true
  },

  bookmarkItem: async (itemType, itemId) => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('bookmarks')
      .insert({ user_id: authUser.id, item_type: itemType, item_id: itemId })
      .select()
      .single()
    if (error) throw error
    return data
  },

  removeBookmark: async (itemType, itemId) => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', authUser.id)
      .eq('item_type', itemType)
      .eq('item_id', itemId)
    if (error) throw error
    return true
  },

  getBookmarks: async (itemType = '') => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    let query = supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', authUser.id)
      .order('created_at', { ascending: false })

    if (itemType) {
      query = query.eq('item_type', itemType)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  },
}

export default socialService
