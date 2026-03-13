import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TokenContext } from '../../context/TokenContext';
import { initiatePayment } from '../../services/paymentService';

const PaymentForm = () => {
    const TOKEN_PRICE_RUPEES = 8;
    const [tokenCount, setTokenCount] = useState('');
    const [upiId, setUpiId] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [loading, setLoading] = useState(false);
    const { updateTokenBalance } = useContext(TokenContext);
    const navigate = useNavigate();

    const rupeesAmount = Number(tokenCount || 0) * TOKEN_PRICE_RUPEES;
    const upiLink = upiId
        ? `upi://pay?pa=${encodeURIComponent(upiId)}&pn=SkillSwap&am=${encodeURIComponent(rupeesAmount)}&cu=INR&tn=Token%20Purchase`
        : '';

    const handleUpiIntent = () => {
        if (!upiId || !tokenCount) return;
        window.location.href = upiLink;
    };

    const handleRazorpay = async () => {
        if (!tokenCount) return;
        setLoading(true);
        try {
            const orderRes = await fetch('/api/razorpay-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: Math.round(rupeesAmount * 100),
                    currency: 'INR',
                    receipt: `tokens_${Date.now()}`
                })
            });

            const orderData = await orderRes.json();
            if (!orderRes.ok) throw new Error(orderData.error || 'Order creation failed');

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'SkillSwap',
                description: 'Token Purchase',
                order_id: orderData.id,
                handler: async (response) => {
                    const verifyRes = await fetch('/api/razorpay-verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(response),
                    });
                    const verifyData = await verifyRes.json();
                    if (!verifyData.verified) {
                        alert('Payment verification failed');
                        return;
                    }

                    const payRes = await initiatePayment({
                        amount: rupeesAmount,
                        tokenAmount: Number(tokenCount),
                        provider: 'razorpay',
                        metadata: { order_id: orderData.id, payment_id: response.razorpay_payment_id }
                    });
                    if (payRes.success && payRes.newBalance !== null) {
                        updateTokenBalance(payRes.newBalance);
                        navigate('/subscription');
                    }
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error('Razorpay error:', error);
            alert(error.message || 'Payment failed');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmUpi = async () => {
        if (!tokenCount) return;
        setLoading(true);
        try {
            const response = await initiatePayment({
                amount: rupeesAmount,
                tokenAmount: Number(tokenCount),
                provider: 'upi',
                metadata: { upi_id: upiId }
            });
            if (response.success && response.newBalance !== null) {
                updateTokenBalance(response.newBalance);
                navigate('/subscription');
            }
        } catch (error) {
            console.error('Payment error:', error);
            alert('An error occurred while processing your payment.');
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        if (paymentMethod === 'upi') {
            handleUpiIntent();
        } else {
            handleRazorpay();
        }
    };

    return (
        <div className="payment-form max-w-md mx-auto p-4 bg-white shadow rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Buy Tokens</h2>
            <p className="text-sm text-gray-500 mb-4">1 token = ₹{TOKEN_PRICE_RUPEES}</p>
            <form onSubmit={handlePayment} className="space-y-4">
                <div>
                    <label htmlFor="tokenCount" className="block text-sm font-medium mb-1">Tokens</label>
                    <input
                        type="number"
                        id="tokenCount"
                        value={tokenCount}
                        onChange={(e) => setTokenCount(e.target.value)}
                        min="1"
                        required
                        className="w-full border rounded p-2"
                    />
                </div>

                <div className="text-sm text-gray-600">Payable: ₹{rupeesAmount}</div>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setPaymentMethod('upi')}
                        className={`flex-1 px-3 py-2 rounded ${paymentMethod === 'upi' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                    >
                        UPI Apps
                    </button>
                    <button
                        type="button"
                        onClick={() => setPaymentMethod('razorpay')}
                        className={`flex-1 px-3 py-2 rounded ${paymentMethod === 'razorpay' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                    >
                        Card / UPI (Razorpay)
                    </button>
                </div>

                {paymentMethod === 'upi' && (
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">UPI ID</label>
                            <input
                                type="text"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                placeholder="name@bank"
                                className="w-full border rounded p-2"
                            />
                        </div>
                        <div className="flex gap-2">
                            {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                                <button
                                    key={app}
                                    type="button"
                                    onClick={handleUpiIntent}
                                    className="flex-1 bg-gray-100 rounded py-2 text-sm"
                                >
                                    {app}
                                </button>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={handleConfirmUpi}
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : 'I have paid via UPI'}
                        </button>
                    </div>
                )}

                {paymentMethod === 'razorpay' && (
                    <button
                        type="button"
                        onClick={handleRazorpay}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Pay with Razorpay'}
                    </button>
                )}
            </form>
        </div>
    );
};

export default PaymentForm;
