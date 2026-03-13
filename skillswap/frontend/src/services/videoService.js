import { supabase } from '../lib/supabaseClient'

const VIDEO_BUCKET = import.meta.env.VITE_SUPABASE_VIDEO_BUCKET || 'videos'

const mapVideo = (video) => {
  if (!video) return video
  return {
    ...video,
    videoUrl: video.video_url || video.videoUrl,
    uploaderId: video.uploader_id || video.uploaderId,
    skillTag: video.skill_tag || video.skillTag,
    tokensRequired: video.tokens_required || video.tokensRequired,
  }
}

const videoService = {
  // Get all videos with filters
  getAllVideos: async (params = {}) => {
    let query = supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false })
    if (params.limit) {
      const page = params.page || 1
      query = query.range((page - 1) * params.limit, page * params.limit - 1)
    }
    if (params.category) query = query.eq('category', params.category)
    if (params.skillTag) query = query.eq('skill_tag', params.skillTag)
    if (params.level) query = query.eq('level', params.level)
    if (params.visibility) query = query.eq('visibility', params.visibility)
    if (params.search) query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%`)
    const { data, error } = await query
    if (error) throw error
    return { videos: (data || []).map(mapVideo) }
  },

  // Get single video by ID
  getVideoById: async (id) => {
    const { data, error } = await supabase.from('videos').select('*').eq('id', id).single()
    if (error) throw error
    return { video: mapVideo(data) }
  },

  // Get current user's videos
  getMyVideos: async () => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    const { data, error } = await supabase.from('videos').select('*').eq('uploader_id', authUser.id)
    if (error) throw error
    return { videos: (data || []).map(mapVideo) }
  },

  // Upload video with extended timeout (10 minutes for large files)
  uploadVideo: async (formData) => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    const file = formData.get('video')
    if (!file) throw new Error('Missing video file')
    const extension = file.name.split('.').pop()
    const path = `${authUser.id}/${Date.now()}.${extension}`

    const { error: uploadError } = await supabase.storage
      .from(VIDEO_BUCKET)
      .upload(path, file, { upsert: true, contentType: file.type })
    if (uploadError) throw uploadError

    const { data: publicData } = supabase.storage.from(VIDEO_BUCKET).getPublicUrl(path)
    return { url: publicData?.publicUrl, path }
  },

  // Create video metadata
  createVideo: async (videoData) => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('videos')
      .insert({ ...videoData, uploader_id: authUser.id })
      .select()
      .single()
    if (error) throw error
    return { video: mapVideo(data) }
  },

  // Update video
  updateVideo: async (id, videoData) => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('videos')
      .update(videoData)
      .eq('id', id)
      .eq('uploader_id', authUser.id)
      .select()
      .single()
    if (error) throw error
    return { video: mapVideo(data) }
  },

  // Delete video
  deleteVideo: async (id) => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', id)
      .eq('uploader_id', authUser.id)
    if (error) throw error
    return { success: true }
  },

  // Like video
  likeVideo: async (id) => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('video_likes')
      .insert({ video_id: id, user_id: authUser.id })
      .select()
      .single()
    if (error) throw error
    return { like: data }
  },

  // Watch premium video (deduct tokens)
  watchVideo: async (id) => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    await supabase.rpc('decrement_tokens', { user_id_input: authUser.id, amount_input: 1 })
    await supabase.from('token_history').insert({
      user_id: authUser.id,
      amount: -1,
      reason: 'video_watch',
      metadata: { video_id: id },
    })

    const { data: profile } = await supabase
      .from('profiles')
      .select('tokens')
      .eq('id', authUser.id)
      .single()

    return { success: true, tokensDeducted: 1, viewerTokens: profile?.tokens }
  },
}

export default videoService
