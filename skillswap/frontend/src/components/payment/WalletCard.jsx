import React, { useContext } from 'react';
import { TokenContext } from '../../context/TokenContext';

const WalletCard = () => {
    const { tokenBalance, tokenHistory } = useContext(TokenContext);

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-1">Wallet Balance</h2>
            <p className="text-4xl font-bold text-blue-600 mb-6">{tokenBalance} <span className="text-base font-normal text-gray-500">Tokens</span></p>
            <h3 className="text-base font-semibold mb-2">Transaction History</h3>
            <ul className="space-y-2 max-h-48 overflow-y-auto">
                {(!tokenHistory || tokenHistory.length === 0) && (
                    <li className="text-sm text-gray-500">No transactions yet.</li>
                )}
                {tokenHistory?.map((tx, index) => (
                    <li key={index} className="flex justify-between text-sm py-1 border-b">
                        <span className="text-gray-600">{tx.description}</span>
                        <span className={tx.amount > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                            {tx.amount > 0 ? `+${tx.amount}` : tx.amount} Tokens
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WalletCard;
