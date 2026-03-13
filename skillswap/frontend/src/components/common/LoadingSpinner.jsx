import React from 'react';

const LoadingSpinner = ({ size = 'lg', message = '' }) => {
    const sizeMap = { sm: 'h-8 w-8', md: 'h-16 w-16', lg: 'h-32 w-32' };
    return (
        <div className="flex flex-col justify-center items-center py-8">
            <div className={`animate-spin rounded-full border-t-4 border-blue-500 border-opacity-75 ${sizeMap[size] || sizeMap.lg}`} />
            {message && <p className="mt-4 text-gray-500 text-sm">{message}</p>}
        </div>
    );
};

export default LoadingSpinner;
