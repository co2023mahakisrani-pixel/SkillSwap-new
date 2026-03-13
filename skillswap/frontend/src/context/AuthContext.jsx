import React, { createContext, useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { logTokenEarned, logTokenUsage } from '../utils/activityStore'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const prevTokensRef = useRef(null)

  useEffect(() => {
    if (!user || typeof user.tokens !== 'number') {
      prevTokensRef.current = null
      return
    }

    if (prevTokensRef.current === null) {
      prevTokensRef.current = user.tokens
      return
    }

    const diff = user.tokens - prevTokensRef.current
    if (diff > 0) {
      logTokenEarned(diff)
    } else if (diff < 0) {
      logTokenUsage(Math.abs(diff))
    }

    prevTokensRef.current = user.tokens
  }, [user?.tokens])

  const buildProfilePayload = (authUser, overrides = {}) => ({
    id: authUser.id,
    email: authUser.email,
    name: authUser.user_metadata?.name || authUser.user_metadata?.full_name || '',
    surname: authUser.user_metadata?.surname || '',
    mobile: authUser.user_metadata?.mobile || '',
    dob: authUser.user_metadata?.dob || null,
    location: authUser.user_metadata?.location || '',
    profile_picture: authUser.user_metadata?.avatar_url || null,
    tokens: 0,
    ...overrides,
  })

  const normalizeUser = (profile, authUser) => ({
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

  const loadProfile = useCallback(async (authUser) => {
    if (!authUser) return
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error loading profile:', error)
      return
    }

    if (!data) {
      const payload = buildProfilePayload(authUser)
      const { data: created, error: insertError } = await supabase
        .from('profiles')
        .insert(payload)
        .select()
        .single()

      if (insertError) {
        console.error('Error creating profile:', insertError)
        return
      }
      setUser(normalizeUser(created, authUser))
      return
    }

    setUser(normalizeUser(data, authUser))
  }, [])

  useEffect(() => {
    let isMounted = true

    const initSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      if (!isMounted) return
      setSession(currentSession)
      setIsAuthenticated(!!currentSession)
      if (currentSession?.user) {
        await loadProfile(currentSession.user)
      }
      setLoading(false)
    }

    initSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession)
      setIsAuthenticated(!!newSession)
      if (newSession?.user) {
        await loadProfile(newSession.user)
      } else {
        setUser(null)
      }
    })

    return () => {
      isMounted = false
      authListener.subscription.unsubscribe()
    }
  }, [loadProfile])

  const register = async ({ email, password, name, surname, mobile, dob, location }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, surname, mobile, dob, location },
      },
    })

    if (error) throw error
    if (data?.user) await loadProfile(data.user)
    return data
  }

  const login = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    if (data?.user) await loadProfile(data.user)
    return data
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setUser(null)
    setIsAuthenticated(false)
  }

  const googleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    if (error) throw error
    return data
  }

  const facebookLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'facebook' })
    if (error) throw error
    return data
  }

  const microsoftLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'azure' })
    if (error) throw error
    return data
  }

  const updateUser = (updatedUser) => {
    setUser(updatedUser)
  }

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isAuthenticated,
      loading,
      register,
      login,
      logout,
      googleLogin,
      facebookLogin,
      microsoftLogin,
      updateUser,
      setUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}
