import { supabase } from '../lib/supabaseClient'

const authService = {
  register: async (userData) => {
    const { email, password, name, surname, mobile, dob, location } = userData
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, surname, mobile, dob, location },
      },
    })
    if (error) throw error
    return data
  },

  login: async (credentials) => {
    const { data, error } = await supabase.auth.signInWithPassword(credentials)
    if (error) throw error
    return data
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return true
  },

  getCurrentUser: async () => {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error
    return data
  },

  googleLogin: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    if (error) throw error
    return data
  },

  facebookLogin: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'facebook' })
    if (error) throw error
    return data
  },

  microsoftLogin: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'azure' })
    if (error) throw error
    return data
  },
}

export default authService
