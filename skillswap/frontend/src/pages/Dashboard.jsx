import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, History, BookOpen, User as UserIcon, Settings, LogOut, Loader2, Plus, Play } from 'lucide-react';
import { db } from '../services/db';

const Dashboard = ({ user, profile, refreshProfile }) => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await db.getUserEnrollments(user.id);
                setEnrollments(data || []);
            } catch (err) {
                console.error('Error fetching enrollments:', err);
            } finally {
                setLoading(false);
            }
        };
        if (user?.id) fetchData();
    }, [user?.id]);

    const completedCourses = enrollments.filter(e => e.is_completed).length;
    const inProgressCourses = enrollments.filter(e => !e.is_completed && e.progress > 0).length;

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Welcome back!</h1>
                    <p className="text-slate-500">{user?.email}</p>
                </div>
                <Link 
                    to="/learn"
                    className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all"
                >
                    Browse Courses
                </Link>
            </header>

            <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-primary-50 dark:bg-primary-900/20">
                        <CreditCard className="w-5 h-5 text-primary-500" />
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Learning Credits</p>
                    <p className="text-3xl font-bold mt-1">{profile?.credits || 0}</p>
                </div>
                <div className="glass p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-emerald-50 dark:bg-emerald-900/20">
                        <BookOpen className="w-5 h-5 text-emerald-500" />
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Enrolled Courses</p>
                    <p className="text-3xl font-bold mt-1">{enrollments.length}</p>
                </div>
                <div className="glass p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-indigo-50 dark:bg-indigo-900/20">
                        <Play className="w-5 h-5 text-indigo-500" />
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Completed</p>
                    <p className="text-3xl font-bold mt-1">{completedCourses}</p>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Your Courses</h2>
                        </div>
                        
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                            </div>
                        ) : enrollments.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {enrollments.map(enrollment => (
                                    <Link
                                        key={enrollment.id}
                                        to={`/learn/${enrollment.course_id}`}
                                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-primary-500 transition-all"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="font-bold text-lg">{enrollment.courses?.title}</h3>
                                            {enrollment.is_completed && (
                                                <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full text-xs font-semibold">
                                                    Completed
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-slate-500">
                                            <span>{enrollment.courses?.categories?.name}</span>
                                            <span>{enrollment.credits_spent} credits</span>
                                        </div>
                                        {!enrollment.is_completed && (
                                            <div className="mt-3">
                                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                                                    <div 
                                                        className="bg-primary-500 h-1.5 rounded-full" 
                                                        style={{ width: `${enrollment.progress || 0}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4">
                                <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <BookOpen className="w-8 h-8 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-bold">Start Your Learning Journey</h3>
                                <p className="text-slate-500 max-w-xs mx-auto">Browse skills to learn or add skills you can teach to the community.</p>
                                <Link 
                                    to="/learn"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all"
                                >
                                    <Plus className="w-4 h-4" />
                                    Browse Courses
                                </Link>
                            </div>
                        )}
                    </section>
                </div>

                <div className="space-y-8">
                    <section className="glass rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/50">
                        <h3 className="font-bold flex items-center gap-2 mb-6">
                            <CreditCard className="w-5 h-5 text-primary-500" />
                            Quick Actions
                        </h3>
                        <div className="space-y-3">
                            <Link 
                                to="/learn"
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <BookOpen className="w-5 h-5 text-primary-500" />
                                <span>Browse Courses</span>
                            </Link>
                            <Link 
                                to="/teach"
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <UserIcon className="w-5 h-5 text-indigo-500" />
                                <span>Teach a Skill</span>
                            </Link>
                            <Link 
                                to="/profile"
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <CreditCard className="w-5 h-5 text-emerald-500" />
                                <span>Buy Credits</span>
                            </Link>
                        </div>
                    </section>

                    <section className="glass rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/50">
                        <h3 className="font-bold flex items-center gap-2 mb-6">
                            <History className="w-5 h-5 text-primary-500" />
                            Recent Activity
                        </h3>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
                                <div>
                                    <p className="text-sm font-bold">Account Created</p>
                                    <p className="text-xs text-slate-500">You joined SkillSwap community</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0" />
                                <div>
                                    <p className="text-sm font-bold">10 Credits Added</p>
                                    <p className="text-xs text-slate-500">Welcome bonus</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
