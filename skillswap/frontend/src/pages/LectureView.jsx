import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, CheckCircle, Lock, Clock, ChevronRight, Loader2 } from 'lucide-react';
import { db } from '../services/db';

const LectureView = ({ user, profile }) => {
    const { id: courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [lectures, setLectures] = useState([]);
    const [currentLecture, setCurrentLecture] = useState(null);
    const [lectureProgress, setLectureProgress] = useState([]);
    const [loading, setLoading] = useState(true);
    const [completing, setCompleting] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [courseData, lecturesData, enrollmentsData] = await Promise.all([
                    db.getCourseById(courseId),
                    db.getLectures(courseId),
                    db.getUserEnrollments(user.id)
                ]);
                
                const isEnrolled = enrollmentsData.some(e => e.course_id === courseId);
                if (!isEnrolled) {
                    navigate(`/learn/${courseId}`);
                    return;
                }

                setCourse(courseData);
                setLectures(lecturesData || []);
                
                if (lecturesData?.length) {
                    const progress = await db.getLectureProgress(
                        user.id,
                        lecturesData.map(l => l.id)
                    );
                    setLectureProgress(progress || []);
                    
                    const firstIncomplete = progress.find(p => !p.is_completed);
                    if (firstIncomplete) {
                        const lecture = lecturesData.find(l => l.id === firstIncomplete.lecture_id);
                        if (lecture) setCurrentLecture(lecture);
                    } else {
                        setCurrentLecture(lecturesData[0]);
                    }
                }
            } catch (err) {
                console.error('Error fetching course:', err);
            } finally {
                setLoading(false);
            }
        };
        if (user?.id) fetchData();
    }, [courseId, user?.id]);

    const handleVideoTimeUpdate = async () => {
        if (!currentLecture || !videoRef.current) return;
        
        const currentTime = Math.floor(videoRef.current.currentTime);
        const duration = Math.floor(videoRef.current.duration);
        
        if (currentTime > 0 && duration > 0) {
            const progressPercent = (currentTime / duration) * 100;
            
            if (progressPercent >= 90 && !isCurrentCompleted) {
                await db.updateLectureProgress(user.id, currentLecture.id, currentTime, true);
                const updated = await db.getLectureProgress(user.id, lectures.map(l => l.id));
                setLectureProgress(updated || []);
                
                await checkCourseCompletion();
            }
        }
    };

    const checkCourseCompletion = async () => {
        const completedCount = lectureProgress.filter(p => p.is_completed).length;
        if (completedCount >= lectures.length - 1 && lectures.length > 0) {
            await db.completeCourse(user.id, courseId);
        }
    };

    const isCurrentCompleted = currentLecture ? lectureProgress.some(p => p.lecture_id === currentLecture.id && p.is_completed) : false;

    const getLectureCompletionStatus = (lectureId) => {
        return lectureProgress.some(p => p.lecture_id === lectureId && p.is_completed);
    };

    const handleMarkComplete = async () => {
        if (!currentLecture) return;
        
        try {
            setCompleting(true);
            await db.updateLectureProgress(user.id, currentLecture.id, 0, true);
            const progress = await db.getLectureProgress(user.id, lectures.map(l => l.id));
            setLectureProgress(progress || []);
            
            await checkCourseCompletion();
            
            const currentIndex = lectures.findIndex(l => l.id === currentLecture.id);
            if (currentIndex < lectures.length - 1) {
                setCurrentLecture(lectures[currentIndex + 1]);
            }
        } catch (err) {
            console.error('Error marking complete:', err);
        } finally {
            setCompleting(false);
        }
    };

    const handleNextLecture = () => {
        if (!currentLecture) return;
        const currentIndex = lectures.findIndex(l => l.id === currentLecture.id);
        if (currentIndex < lectures.length - 1) {
            setCurrentLecture(lectures[currentIndex + 1]);
        }
    };

    const completedCount = lectureProgress.filter(p => p.is_completed).length;
    const progressPercent = lectures.length > 0 ? Math.round((completedCount / lectures.length) * 100) : 0;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <button onClick={() => navigate(`/learn/${courseId}`)} className="flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors mb-4">
                <ArrowLeft className="w-4 h-4" />Back to Course
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-black rounded-2xl overflow-hidden aspect-video relative">
                        {currentLecture?.video_url ? (
                            <video
                                ref={videoRef}
                                src={currentLecture.video_url}
                                className="w-full h-full"
                                controls
                                onTimeUpdate={handleVideoTimeUpdate}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white">
                                <div className="text-center">
                                    <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <p>No video available for this lecture</p>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h2 className="text-2xl font-bold">{currentLecture?.title || 'Select a lecture'}</h2>
                                <p className="text-slate-500 mt-1">{currentLecture?.description}</p>
                            </div>
                            {isCurrentCompleted && (
                                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full text-sm font-semibold flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" />Completed
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            {!isCurrentCompleted && currentLecture && (
                                <button 
                                    onClick={handleMarkComplete}
                                    disabled={completing}
                                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    {completing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                    Mark as Complete
                                </button>
                            )}
                            {currentLecture && lectures.findIndex(l => l.id === currentLecture.id) < lectures.length - 1 && (
                                <button 
                                    onClick={handleNextLecture}
                                    className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all flex items-center gap-2"
                                >
                                    Next Lecture
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
                        <h3 className="font-bold mb-3">{course?.title}</h3>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-2">
                            <div className="bg-primary-500 h-2 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
                        </div>
                        <p className="text-sm text-slate-500">{completedCount} of {lectures.length} completed</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 max-h-[400px] overflow-y-auto">
                        <h3 className="font-bold mb-3">Lectures</h3>
                        <div className="space-y-2">
                            {lectures.map((lecture, index) => {
                                const isCompleted = getLectureCompletionStatus(lecture.id);
                                const isCurrent = currentLecture?.id === lecture.id;
                                
                                return (
                                    <button
                                        key={lecture.id}
                                        onClick={() => setCurrentLecture(lecture)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                                            isCurrent 
                                                ? 'bg-primary-100 dark:bg-primary-900/30 border border-primary-500' 
                                                : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                            isCompleted ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                                        }`}>
                                            {isCompleted ? (
                                                <CheckCircle className="w-4 h-4 text-white" />
                                            ) : (
                                                <span className="text-sm font-semibold">{index + 1}</span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-medium text-sm truncate ${isCurrent ? 'text-primary-600' : ''}`}>
                                                {lecture.title}
                                            </p>
                                            <p className="text-xs text-slate-500">{lecture.duration || '0:00'}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LectureView;
