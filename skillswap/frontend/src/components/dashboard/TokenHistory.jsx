import React, { useContext, useEffect, useState } from 'react';
import { TokenContext } from '../../context/TokenContext';
import { getTokenHistory } from '../../services/paymentService';

const TokenHistory = () => {
    const { tokenBalance } = useContext(TokenContext);
    const [tokenHistory, setTokenHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTokenHistory = async () => {
            try {
                const history = await getTokenHistory();
                setTokenHistory(history.history || []);
            } catch (err) {
                setError('Failed to fetch token history');
            } finally {
                setLoading(false);
            }
        };
        fetchTokenHistory();
    }, []);

    if (loading) return <div className="text-center py-4">Loading...</div>;
    if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

    return (
        <div className="token-history">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Token History</h2>
                <span className="font-bold text-blue-600">Balance: {tokenBalance}</span>
            </div>
            <ul className="space-y-2">
                {tokenHistory.length === 0 && <li className="text-gray-500 text-sm">No transactions yet.</li>}
                {tokenHistory.map((entry, index) => (
                    <li key={index} className="flex justify-between py-2 border-b text-sm">
                        <span className="text-gray-600">{entry.date || entry.created_at}</span>
                        <span className="capitalize">{entry.reason || 'activity'}</span>
                        <span className={entry.amount > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                            {entry.amount > 0 ? '+' : ''}{entry.amount} tokens
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TokenHistory;
