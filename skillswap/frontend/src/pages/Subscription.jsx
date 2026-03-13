import React, { useContext, useState, useEffect } from 'react'
import { ThemeContext } from '../context/ThemeContext'
import SubscriptionPlanCard from '../components/SubscriptionPlanCard'
import paymentService from '../services/paymentService'
import { useNavigate } from 'react-router-dom'

const Subscription = () => {
  const { isDark } = useContext(ThemeContext)
  const navigate = useNavigate()
  const [plans, setPlans] = useState([])
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await paymentService.getSubscriptionPlans()
      setPlans(response.plans || response.data?.plans || [])
    } catch (error) {
      console.error('Error fetching plans:', error)
    }
    setLoading(false)
  }

  const handleSelectPlan = async (plan) => {
    try {
      const orderRes = await fetch('/api/razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(plan.price * 100),
          currency: 'INR',
          receipt: `sub_${Date.now()}`,
        }),
      })
      const orderData = await orderRes.json()
      if (!orderRes.ok) throw new Error(orderData.error || 'Order creation failed')

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'SkillSwap',
        description: `Subscription: ${plan.name}`,
        order_id: orderData.id,
        handler: async (response) => {
          const verifyRes = await fetch('/api/razorpay-verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          })
          const verifyData = await verifyRes.json()
          if (!verifyData.verified) {
            alert('Payment verification failed')
            return
          }

          await paymentService.initiatePayment({
            planId: plan.id,
            amount: plan.price,
            provider: 'razorpay',
            metadata: { order_id: orderData.id, payment_id: response.razorpay_payment_id },
          })
          await paymentService.createSubscription({ planId: plan.id })
          alert('Subscription activated!')
          navigate('/dashboard')
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      console.error('Error initiating payment:', error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} py-12`}>
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4">Choose Your Plan</h1>
        <p className="text-center mb-12 text-gray-600">
          Unlock unlimited learning with our flexible subscription plans
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <SubscriptionPlanCard
              key={plan.id}
              plan={plan}
              onSelect={handleSelectPlan}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Subscription
