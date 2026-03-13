import React, { createContext, useContext, useState, useEffect } from 'react';
import { getWalletBalance } from '../services/paymentService';

const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
    const [tokenBalance, setTokenBalance] = useState(0);
    const [tokenHistory, setTokenHistory] = useState([]);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const balance = await getWalletBalance();
                setTokenBalance(balance);
            } catch (err) {
                console.error('Failed to fetch token balance:', err);
            }
        };
        fetchBalance();
    }, []);

    const addTokens = (amount) => {
        setTokenBalance((prev) => prev + amount);
    };

    const deductTokens = (amount) => {
        setTokenBalance((prev) => prev - amount);
    };

    const updateTokenBalance = (newBalance) => {
        setTokenBalance(newBalance);
    };

    return (
        <TokenContext.Provider value={{ tokenBalance, tokenHistory, setTokenHistory, addTokens, deductTokens, updateTokenBalance }}>
            {children}
        </TokenContext.Provider>
    );
};

export const useToken = () => useContext(TokenContext);

export { TokenContext };
