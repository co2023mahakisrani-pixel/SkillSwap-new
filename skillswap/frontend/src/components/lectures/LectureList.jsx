import React, { useEffect, useState } from 'react';
import lectureService from '../../services/lectureService';
import LectureCard from './LectureCard';
import LoadingSpinner from '../common/LoadingSpinner';

const LectureList = ({ searchTerm = '' }) => {
    const [lectures, setLectures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLectures = async () => {
            try {
                const data = await lectureService.getAllLectures(1, 20, searchTerm);
                setLectures(data?.lectures || data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchLectures();
    }, [searchTerm]);

    if (loading) return <LoadingSpinner message="Loading lectures..." />;
    if (error) return <div className="text-red-500 text-center py-4">Error: {error}</div>;
    if (lectures.length === 0) return <div className="text-center text-gray-500 py-8">No lectures found.</div>;

    return (
        <div className="lecture-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lectures.map((lecture) => (
                <LectureCard key={lecture.id || lecture._id} lecture={lecture} />
            ))}
        </div>
    );
};

export default LectureList;
