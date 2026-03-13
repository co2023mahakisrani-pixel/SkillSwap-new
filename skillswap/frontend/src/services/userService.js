import { supabase } from '../lib/supabaseClient'

const PROFILE_BUCKET = import.meta.env.VITE_SUPABASE_PROFILE_BUCKET || 'avatars'

const buildUser = (profile, authUser) => ({
  id: authUser?.id || profile?.id,
  email: authUser?.email || profile?.email,
  name: profile?.name || authUser?.user_metadata?.name || authUser?.user_metadata?.full_name || '',
  surname: profile?.surname || authUser?.user_metadata?.surname || '',
  mobile: profile?.mobile || authUser?.user_metadata?.mobile || '',
  dob: profile?.dob || authUser?.user_metadata?.dob || null,
  location: profile?.location || authUser?.user_metadata?.location || '',
  bio: profile?.bio || '',
  profilePicture: profile?.profile_picture || authUser?.user_metadata?.avatar_url || null,
  tokens: profile?.tokens ?? 0,
  isTeacher: profile?.is_teacher ?? true,
  lecturesCompleted: profile?.lectures_completed ?? 0,
  tasksCompleted: profile?.tasks_completed ?? 0,
  totalHours: profile?.total_hours ?? 0,
  averageRating: profile?.average_rating ?? 0,
  totalReviews: profile?.total_reviews ?? 0,
  skills: profile?.skills ?? [],
  projects: profile?.projects ?? [],
  socialLinks: profile?.social_links ?? {},
  aiInsights: profile?.ai_insights ?? {},
})

const mapProgress = (item) => {
  if (!item) return item
  const completion = item.completion_percentage ?? item.completionPercentage ?? 0
  return {
    ...item,
    lectureId: item.lecture_id || item.lectureId,
    videoId: item.video_id || item.videoId,
    completionPercentage: completion,
    updatedAt: item.updated_at || item.updatedAt,
    type: item.type || (item.video_id || item.videoId ? 'video' : 'lecture'),
    isCompleted: item.is_completed ?? item.isCompleted ?? completion >= 100,
  }
}

const userService = {
  getCurrentUser: async () => {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error
    return data
  },

  updateProfile: async (userData) => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    let updates = {}
    let profilePictureUrl = null

    if (userData instanceof FormData) {
      const entries = Object.fromEntries(userData.entries())
      updates = entries

      if (entries.profilePicture instanceof File) {
        const file = entries.profilePicture
        const extension = file.name.split('.').pop()
        const path = `${authUser.id}/avatar.${extension}`
        const { error: uploadError } = await supabase.storage
          .from(PROFILE_BUCKET)
          .upload(path, file, { upsert: true, contentType: file.type })
        if (uploadError) throw uploadError
        const { data: publicData } = supabase.storage.from(PROFILE_BUCKET).getPublicUrl(path)
        profilePictureUrl = publicData?.publicUrl
      }
    } else {
      updates = { ...userData }
    }

    const payload = {
      name: updates.name,
      surname: updates.surname,
      mobile: updates.mobile,
      dob: updates.dob,
      location: updates.location,
      bio: updates.bio,
      profile_picture: profilePictureUrl || updates.profile_picture,
      skills: updates.skills,
      projects: updates.projects,
      social_links: updates.socialLinks || updates.social_links,
      ai_insights: updates.aiInsights || updates.ai_insights,
    }

    Object.keys(payload).forEach((key) => payload[key] === undefined && delete payload[key])

    const { data, error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', authUser.id)
      .select()
      .single()

    if (error) throw error
    return buildUser(data, authUser)
  },

  getUserProgress: async () => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', authUser.id)

    if (error) throw error
    return { progress: (data || []).map(mapProgress) }
  },

  updateProgress: async ({ lectureId, videoId, completionPercentage }) => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('progress')
      .upsert({
        user_id: authUser.id,
        lecture_id: lectureId || null,
        video_id: videoId || null,
        completion_percentage: completionPercentage,
        is_completed: completionPercentage >= 100,
        updated_at: new Date().toISOString(),
      }, { onConflict: lectureId ? 'user_id,lecture_id' : 'user_id,video_id' })
      .select()
      .single()

    if (error) throw error
    return { progress: data }
  },

  getUserPortfolio: async () => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', authUser.id)

    if (error) throw error
    return { portfolio: data || [] }
  },

  getTokenHistory: async () => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('token_history')
      .select('*')
      .eq('user_id', authUser.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { history: data || [] }
  },

  getProfile: async () => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    const userProfile = buildUser(data || {}, authUser)
    return { data: { user: userProfile }, user: userProfile }
  },
}

export default userService
