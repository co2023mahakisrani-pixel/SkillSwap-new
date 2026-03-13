import React from 'react';
import { SUBSCRIPTION_PLANS } from '../../utils/constants';

const SubscriptionPlans = ({ onSubscribe }) => {
    return (
        <div className="subscription-plans">
            <h2 className="text-2xl font-bold mb-6 text-center">Subscription Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {SUBSCRIPTION_PLANS.map((plan) => (
                    <div key={plan.id} className="border rounded-xl shadow-md p-6 flex flex-col items-center hover:shadow-lg transition-shadow">
                        <h3 className="text-xl font-semibold mb-1">{plan.name}</h3>
                        <p className="text-3xl font-bold text-blue-600 mb-4">₹{plan.price}</p>
                        <ul className="text-sm text-gray-600 space-y-1 mb-6 w-full">
                            {plan.features.map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span> {feature}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => onSubscribe?.(plan)}
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        >
                            Choose {plan.name}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SubscriptionPlans;
