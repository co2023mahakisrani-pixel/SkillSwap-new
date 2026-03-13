import { supabase } from '../lib/supabaseClient'
import notificationService from './notificationService'

const mapProfile = (profile) => {
  if (!profile) return profile
  return {
    ...profile,
    profilePicture: profile.profile_picture || profile.profilePicture,
  }
}

const skillService = {
  getAllSkills: async (page = 1, limit = 12, search = '', category = '') => {
    let query = supabase
      .from('skills')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }
    if (category) {
      query = query.eq('category', category)
    }

    const { data, error, count } = await query
    if (error) throw error
    const payload = { skills: data || [], total: count || 0 }
    return { ...payload, data: payload }
  },

  getSkillById: async (id) => {
    const { data, error } = await supabase
      .from('skills')
      .select('*, user_skills: user_skills(*, profile:profiles(*))')
      .eq('id', id)
      .single()
    if (error) throw error

    const userSkills = (data.user_skills || []).map((skill) => ({
      ...skill,
      proficiencyLevel: skill.proficiency_level || skill.proficiencyLevel,
      sessionsCompleted: skill.sessions_completed || skill.sessionsCompleted,
      User: mapProfile(skill.profile),
    }))

    const payload = { skill: { ...data, UserSkills: userSkills } }
    return { ...payload, data: payload }
  },

  getCategories: async () => {
    const { data, error } = await supabase.from('skills').select('category')
    if (error) throw error
    const categories = Array.from(new Set((data || []).map((row) => row.category).filter(Boolean)))
    return { categories }
  },

  getTrendingSkills: async () => {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('average_rating', { ascending: false })
      .limit(10)
    if (error) throw error
    return { skills: data || [] }
  },

  addSkillToUser: async (skillId, type, proficiencyLevel = 'Intermediate') => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('user_skills')
      .insert({
        user_id: authUser.id,
        skill_id: skillId,
        type,
        proficiency_level: proficiencyLevel,
      })
      .select()
      .single()
    if (error) throw error
    return { userSkill: data }
  },

  getUserTeachingSkills: async (userId) => {
    const { data, error } = await supabase
      .from('user_skills')
      .select('*, skill:skills(*)')
      .eq('user_id', userId)
      .eq('type', 'teaching')
    if (error) throw error
    return { skills: data || [] }
  },

  getUserLearningSkills: async () => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('user_skills')
      .select('*, skill:skills(*)')
      .eq('user_id', authUser.id)
      .eq('type', 'learning')
    if (error) throw error
    return { skills: data || [] }
  },
}

const sessionService = {
  createSessionRequest: async (mentorId, skillId, title, description, scheduleDate, duration = 60) => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('sessions')
      .insert({
        mentor_id: mentorId,
        learner_id: authUser.id,
        skill_id: skillId,
        title,
        description,
        schedule_date: scheduleDate,
        duration,
        status: 'Pending',
      })
      .select()
      .single()
    if (error) throw error
    await notificationService.createNotification({
      userId: mentorId,
      type: 'session_request',
      title: 'New session request',
      body: `${title} • ${new Date(scheduleDate).toLocaleString()}`,
      metadata: { session_id: data.id, skill_id: skillId },
    })
    return { session: data }
  },

  getMentorSessions: async (status = 'Pending') => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    let query = supabase
      .from('sessions')
      .select('*, skill:skills(*), learner:profiles(*)')
      .eq('mentor_id', authUser.id)
      .order('created_at', { ascending: false })
    if (status) query = query.eq('status', status)

    const { data, error } = await query
    if (error) throw error
    return { sessions: data || [] }
  },

  getLearnerSessions: async (status = '') => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    let query = supabase
      .from('sessions')
      .select('*, skill:skills(*), mentor:profiles(*)')
      .eq('learner_id', authUser.id)
      .order('created_at', { ascending: false })
    if (status) query = query.eq('status', status)

    const { data, error } = await query
    if (error) throw error
    return { sessions: data || [] }
  },

  getAllSessions: async () => {
    const { data, error } = await supabase
      .from('sessions')
      .select('*, skill:skills(*), mentor:profiles(*), learner:profiles(*)')
      .order('created_at', { ascending: false })
    if (error) throw error
    return { sessions: data || [] }
  },

  approveSession: async (sessionId) => {
    const { data, error } = await supabase
      .from('sessions')
      .update({ status: 'Approved' })
      .eq('id', sessionId)
      .select()
      .single()
    if (error) throw error
    return { session: data }
  },

  rejectSession: async (sessionId, reason) => {
    const { data, error } = await supabase
      .from('sessions')
      .update({ status: 'Rejected', rejection_reason: reason })
      .eq('id', sessionId)
      .select()
      .single()
    if (error) throw error
    return { session: data }
  },

  completeSession: async (sessionId, mentorRating, learnerRating) => {
    const { data, error } = await supabase
      .from('sessions')
      .update({ status: 'Completed', mentor_rating: mentorRating, learner_rating: learnerRating })
      .eq('id', sessionId)
      .select()
      .single()
    if (error) throw error
    return { session: data }
  },

  cancelSession: async (sessionId) => {
    const { data, error } = await supabase
      .from('sessions')
      .update({ status: 'Cancelled' })
      .eq('id', sessionId)
      .select()
      .single()
    if (error) throw error
    return { session: data }
  },
}

const reviewService = {
  createReview: async (mentorId, skillId, rating, title, comment, category = 'Overall') => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        mentor_id: mentorId,
        reviewer_id: authUser.id,
        skill_id: skillId,
        rating,
        title,
        comment,
        category,
      })
      .select()
      .single()
    if (error) throw error
    await notificationService.createNotification({
      userId: mentorId,
      type: 'review',
      title: 'New review received',
      body: `${title || 'Review'} • Rating: ${rating}`,
      metadata: { skill_id: skillId },
    })
    return { review: data }
  },

  getMentorReviews: async (mentorId, skillId = '') => {
    let query = supabase
      .from('reviews')
      .select('*, reviewer:profiles(*)')
      .eq('mentor_id', mentorId)
      .order('created_at', { ascending: false })
    if (skillId) query = query.eq('skill_id', skillId)
    const { data, error } = await query
    if (error) throw error
    return { reviews: data || [] }
  },

  getMentorProfile: async (mentorId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', mentorId)
      .single()
    if (error) throw error
    return { profile: data }
  },

  getTopMentors: async (skillId = '', limit = 10) => {
    let query = supabase
      .from('profiles')
      .select('*')
      .order('average_rating', { ascending: false })
      .limit(limit)
    if (skillId) {
      query = supabase
        .from('user_skills')
        .select('profile:profiles(*)')
        .eq('skill_id', skillId)
        .eq('type', 'teaching')
        .limit(limit)
    }
    const { data, error } = await query
    if (error) throw error
    const mentors = skillId
      ? (data || []).map((row) => row.profile)
      : data || []
    return { mentors }
  },

  createRating: async (mentorId, userSkillId, rating, feedback, isAnonymous = false) => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('ratings')
      .insert({
        mentor_id: mentorId,
        reviewer_id: authUser.id,
        user_skill_id: userSkillId,
        rating,
        feedback,
        is_anonymous: isAnonymous,
      })
      .select()
      .single()
    if (error) throw error
    return { rating: data }
  },
}

export { skillService, sessionService, reviewService }
