import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Clock, Star, ArrowLeft, CheckCircle, Loader2, Video, Play, Lock, BookOpen } from 'lucide-react';
import { db } from '../services/db';

const CourseDetail = ({ user, profile, refreshProfile }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [lectures, setLectures] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [lectureProgress, setLectureProgress] = useState([]);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [courseData, lecturesData, enrollmentsData] = await Promise.all([
                    db.getCourseById(id),
                    db.getLectures(id),
                    db.getUserEnrollments(user.id)
                ]);
                setCourse(courseData);
                setLectures(lecturesData || []);
                setEnrollments(enrollmentsData || []);
                
                if (lecturesData?.length) {
                    const progress = await db.getLectureProgress(
                        user.id,
                        lecturesData.map(l => l.id)
                    );
                    setLectureProgress(progress || []);
                }
            } catch (err) {
                console.error('Error fetching course:', err);
                setError('Failed to load course');
            } finally {
                setLoading(false);
            }
        };
        if (user?.id) fetchData();
    }, [id, user?.id]);

    const isEnrolled = enrollments.some(e => e.course_id === id);
    const enrollment = enrollments.find(e => e.course_id === id);

    const handleEnroll = async () => {
        if (!course) return;
        
        if (profile?.credits < course.credits) {
            alert('Insufficient credits. Please purchase more credits.');
            navigate('/dashboard');
            return;
        }

        try {
            setEnrolling(true);
            await db.enrollInCourse(user.id, course.id, course.credits);
            
            const [enrollmentsData, profileData] = await Promise.all([
                db.getUserEnrollments(user.id),
                db.getProfile(user.id)
            ]);
            
            setEnrollments(enrollmentsData || []);
            if (refreshProfile) refreshProfile();
            alert(`Successfully enrolled! ${course.credits} credits deducted.`);
        } catch (err) {
            console.error('Error enrolling:', err);
            alert(err.message || 'Failed to enroll');
        } finally {
            setEnrolling(false);
        }
    };

    const getLectureCompletionStatus = (lectureId) => {
        const progress = lectureProgress.find(p => p.lecture_id === lectureId);
        return progress?.is_completed || false;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="text-center py-16">
                <h2 className="text-2xl font-bold mb-4">Course not found</h2>
                <Link to="/learn" className="text-primary-600 hover:underline">Back to courses</Link>
            </div>
        );
    }

    const completedLectures = lectureProgress.filter(p => p.is_completed).length;
    const progressPercent = lectures.length > 0 ? Math.round((completedLectures / lectures.length) * 100) : 0;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors">
                <ArrowLeft className="w-4 h-4" />Back to courses
            </button>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden">
                <div className="bg-gradient-to-r from-primary-600 to-indigo-600 h-48 flex items-center justify-center">
                    <h1 className="text-4xl font-bold text-white px-4 text-center">{course.title}</h1>
                </div>

                <div className="p-8">
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                        <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full text-sm font-semibold">
                            {course.categories?.name || 'General'}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500">
                            <Star className="w-5 h-5 fill-current" />
                            <span className="font-bold">{course.rating || '0'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-500">
                            <Clock className="w-5 h-5" />
                            {course.duration || 'N/A'}
                        </div>
                        <div className="flex items-center gap-1 text-slate-500">
                            <Video className="w-5 h-5" />
                            {lectures.length} lectures
                        </div>
                    </div>

                    <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                        {course.full_description || course.description}
                    </p>

                    {isEnrolled && (
                        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold">Course Progress</span>
                                <span className="text-emerald-600 font-bold">{progressPercent}%</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                <div 
                                    className="bg-emerald-500 h-2 rounded-full transition-all" 
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                            <p className="text-sm text-slate-500 mt-2">
                                {completedLectures} of {lectures.length} lectures completed
                            </p>
                        </div>
                    )}

                    <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                                    <span className="text-primary-600 font-bold text-xl">
                                        {course.profiles?.full_name?.[0] || 'T'}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{course.profiles?.full_name || 'Tutor'}</h3>
                                    <p className="text-slate-500">Your Mentor</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-primary-600">{course.credits}</p>
                                    <p className="text-sm text-slate-500">Credits</p>
                                </div>

                                {isEnrolled ? (
                                    <Link 
                                        to={`/live/${course.id}`}
                                        className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2"
                                    >
                                        <Play className="w-5 h-5" />
                                        Continue Learning
                                    </Link>
                                ) : (
                                    <button 
                                        onClick={handleEnroll} 
                                        disabled={enrolling}
                                        className="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/25 flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {enrolling ? (
                                            <><Loader2 className="w-5 h-5 animate-spin" />Enrolling...</>
                                        ) : (
                                            <>Enroll Now</>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {lectures.length > 0 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <BookOpen className="w-6 h-6" />
                        Course Content
                    </h2>
                    <div className="space-y-3">
                        {lectures.map((lecture, index) => {
                            const isCompleted = getLectureCompletionStatus(lecture.id);
                            return (
                                <div 
                                    key={lecture.id}
                                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                                        isEnrolled 
                                            ? 'border-slate-200 dark:border-slate-700 hover:border-primary-500' 
                                            : 'border-slate-100 dark:border-slate-800 opacity-60'
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                        isCompleted ? 'bg-emerald-500' : isEnrolled ? 'bg-primary-100 dark:bg-primary-900/30' : 'bg-slate-100 dark:bg-slate-800'
                                    }`}>
                                        {isCompleted ? (
                                            <CheckCircle className="w-5 h-5 text-white" />
                                        ) : isEnrolled ? (
                                            <Play className="w-5 h-5 text-primary-600" />
                                        ) : (
                                            <Lock className="w-5 h-5 text-slate-400" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{lecture.title}</h3>
                                        <p className="text-sm text-slate-500">{lecture.description}</p>
                                    </div>
                                    <div className="text-sm text-slate-500">
                                        {lecture.duration || '0:00'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseDetail;
