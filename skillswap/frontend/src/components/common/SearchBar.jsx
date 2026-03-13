import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm, placeholder = 'Search...' }) => {
    return (
        <div className="relative w-full">
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={placeholder}
                className="w-full p-2 pl-4 pr-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">🔍</span>
        </div>
    );
};

export default SearchBar;
