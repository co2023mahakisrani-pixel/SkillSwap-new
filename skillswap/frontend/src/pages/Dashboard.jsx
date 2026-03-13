import React from 'react';
import { CreditCard, History, Layout, BookOpen, User as UserIcon, Settings, LogOut } from 'lucide-react';

const Dashboard = ({ user }) => {
    const stats = [
        { label: 'Learning Credits', value: '10', icon: CreditCard, color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-900/20' },
        { label: 'Completed Sessions', value: '0', icon: BookOpen, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
        { label: 'Skills Teaching', value: '0', icon: Layout, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    ];

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Welcome back!</h1>
                    <p className="text-slate-500">{user?.email}</p>
                </div>
            </header>

            <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="glass p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
                        <div className={`${stat.bg} w-10 h-10 rounded-lg flex items-center justify-center mb-4`}>
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                        <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    </div>
                ))}
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Your Skills</h2>
                        </div>
                        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4">
                            <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                <BookOpen className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-bold">Start Your Learning Journey</h3>
                            <p className="text-slate-500 max-w-xs mx-auto">Browse skills to learn or add skills you can teach to the community.</p>
                        </div>
                    </section>
                </div>

                <div className="space-y-8">
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
