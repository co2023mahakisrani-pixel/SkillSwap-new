import React from 'react';

const ProgressTracker = ({ progress = 0, label = 'Learning Progress' }) => {
    const pct = Math.min(100, Math.max(0, progress));
    return (
        <div className="progress-tracker w-full">
            <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <span className="text-sm font-medium text-gray-700">{pct}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                    className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
};

export default ProgressTracker;
