import React, { useContext } from 'react';
import { TokenContext } from '../../context/TokenContext';
import { AuthContext } from '../../context/AuthContext';

const DashboardStats = () => {
    const { tokenBalance } = useContext(TokenContext);
    const { user } = useContext(AuthContext);

    const stats = [
        { label: 'Token Balance', value: tokenBalance ?? 0 },
        { label: 'Name', value: user?.name || user?.displayName || 'N/A' },
        { label: 'Email', value: user?.email || 'N/A' },
    ];

    return (
        <div className="dashboard-stats">
            <h2 className="text-xl font-bold mb-4">Dashboard Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map(({ label, value }) => (
                    <div key={label} className="bg-white shadow-md p-4 rounded-lg text-center">
                        <h3 className="text-sm text-gray-500 uppercase tracking-wide">{label}</h3>
                        <p className="text-2xl font-semibold mt-1">{value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardStats;
