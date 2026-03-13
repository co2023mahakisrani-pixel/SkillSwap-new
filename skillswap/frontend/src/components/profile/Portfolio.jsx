import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import userService from '../../services/userService';
import LoadingSpinner from '../common/LoadingSpinner';

const Portfolio = () => {
    const { user } = useContext(AuthContext);
    const [portfolio, setPortfolio] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const data = await userService.getUserPortfolio();
                setPortfolio(Array.isArray(data) ? data : data?.items || []);
            } catch (err) {
                setError('Failed to load portfolio');
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchPortfolio();
    }, [user]);

    if (loading) return <LoadingSpinner size="sm" />;
    if (error) return <div className="text-red-500">{error}</div>;
    if (portfolio.length === 0) return <div className="text-gray-500 text-sm">No portfolio items yet.</div>;

    return (
        <div className="portfolio">
            <h2 className="text-lg font-semibold mb-3">{user?.name}'s Portfolio</h2>
            <ul className="space-y-3">
                {portfolio.map((item) => (
                    <li key={item.id || item._id} className="border rounded-lg p-4">
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Portfolio;
