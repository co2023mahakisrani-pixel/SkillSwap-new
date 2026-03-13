import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import lectureService from '../../services/lectureService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorBoundary from '../common/ErrorBoundary';

const LecturePlayer = () => {
    const { id } = useParams();
    const [lecture, setLecture] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLecture = async () => {
            try {
                const data = await lectureService.getLectureById(id);
                setLecture(data);
                // Track watch
                await lectureService.watchLecture(id).catch(() => { });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchLecture();
    }, [id]);

    if (loading) return <LoadingSpinner message="Loading lecture..." />;
    if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

    return (
        <ErrorBoundary>
            <div className="lecture-player max-w-4xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">{lecture.title}</h1>
                <video controls className="w-full rounded-lg shadow-md">
                    <source src={lecture.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="lecture-description mt-4 text-gray-700">
                    <p>{lecture.description}</p>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default LecturePlayer;
