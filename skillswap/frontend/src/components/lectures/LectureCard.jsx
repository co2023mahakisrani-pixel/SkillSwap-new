import React from 'react';
import { Link } from 'react-router-dom';

const LectureCard = ({ lecture, onWatch }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 m-2 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-bold mb-1">{lecture.title}</h2>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{lecture.description}</p>
            <div className="flex justify-between items-center">
                <span className="text-gray-500 text-xs">{lecture.teacher || lecture.teacherName}</span>
                <button
                    className="bg-blue-500 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-600"
                    onClick={() => onWatch ? onWatch(lecture.id) : null}
                >
                    Watch
                </button>
            </div>
        </div>
    );
};

export default LectureCard;
