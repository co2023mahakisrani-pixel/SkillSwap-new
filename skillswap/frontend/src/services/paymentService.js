import { supabase } from '../lib/supabaseClient'

export const getSubscriptionPlans = async () => {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .order('price', { ascending: true })
    if (error) throw error
    return { plans: data || [] }
}

export const initiatePayment = async ({ planId, amount, provider = 'razorpay', tokenAmount, metadata = {} }) => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('payments')
      .insert({
        user_id: authUser.id,
        plan_id: planId || null,
        amount,
        currency: 'INR',
        provider,
        status: 'pending',
        metadata,
      })
      .select()
      .single()
    if (error) throw error
    let newBalance = null
    if (tokenAmount && Number.isFinite(tokenAmount)) {
      await supabase.rpc('increment_tokens', { user_id_input: authUser.id, amount_input: tokenAmount })
      await supabase.from('token_history').insert({
        user_id: authUser.id,
        amount: tokenAmount,
        reason: 'token_purchase',
        metadata: { payment_id: data.id },
      })
      const { data: profile } = await supabase
        .from('profiles')
        .select('tokens')
        .eq('id', authUser.id)
        .single()
      newBalance = profile?.tokens ?? null
    }
    return { payment: data, newBalance, success: true }
}

export const verifyPayment = async ({ paymentId, orderId, signature }) => {
    const { data, error } = await supabase
      .from('payments')
      .update({ status: 'paid', provider_reference: paymentId, metadata: { orderId, signature } })
      .eq('id', paymentId)
      .select()
      .single()
    if (error) throw error
    return { payment: data }
}

export const getUserSubscription = async () => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', authUser.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    if (error && error.code !== 'PGRST116') throw error
    return { subscription: data || null }
}

export const getTokenHistory = async () => {
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
}

export const getWalletBalance = async () => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    const authUser = authData?.user
    if (!authUser) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('profiles')
      .select('tokens')
      .eq('id', authUser.id)
      .single()
    if (error) throw error
    return data?.tokens ?? 0
}

export const createSubscription = async ({ planId }) => {
  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError) throw authError
  const authUser = authData?.user
  if (!authUser) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('subscriptions')
    .insert({
      user_id: authUser.id,
      plan_id: planId,
      status: 'active',
    })
    .select()
    .single()
  if (error) throw error
  return { subscription: data }
}

const paymentService = {
  getSubscriptionPlans,
  initiatePayment,
  verifyPayment,
  getUserSubscription,
  createSubscription,
  getTokenHistory,
  getWallet: getWalletBalance,
}

export default paymentService
