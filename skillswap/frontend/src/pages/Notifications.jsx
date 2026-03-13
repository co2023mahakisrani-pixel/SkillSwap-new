import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Bell, Check, X, Video, User, Calendar, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const Notifications = ({ user }) => {
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'request', title: 'New Learning Request', message: 'Mahak wants to learn Java from you.', from: 'Mahak', skill: 'Java Programming', timestamp: new Date(Date.now() - 1000 * 60 * 5), read: false, status: 'pending' },
        { id: 2, type: 'request', title: 'Learning Request Accepted', message: 'Suraj accepted your request to learn UI/UX.', from: 'Suraj', skill: 'UI/UX Design', timestamp: new Date(Date.now() - 1000 * 60 * 30), read: false, status: 'accepted' },
        { id: 3, type: 'session', title: 'Upcoming Session', message: 'Your session on Python is scheduled for tomorrow.', skill: 'Python Programming', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), read: true, status: 'scheduled' },
        { id: 4, type: 'credit', title: 'Credits Earned', message: 'You earned 5 credits for teaching Java.', amount: 5, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), read: true, status: 'completed' },
    ]);
    const [loading, setLoading] = useState(null);

    if (!user) return <Navigate to="/auth" />;

    const formatTime = (date) => {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 1000 / 60);
        const hours = Math.floor(diff / 1000 / 60 / 60);
        const days = Math.floor(diff / 1000 / 60 / 60 / 24);
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    const handleAction = async (id, action) => {
        setLoading(id);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: action, read: true } : n));
        setLoading(null);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Notifications</h1>
                    <p className="text-slate-500 dark:text-slate-400">{unreadCount > 0 ? `You have ${unreadCount} unread notifications` : 'All caught up!'}</p>
                </div>
            </div>

            <div className="space-y-4">
                {notifications.map(notification => (
                    <div key={notification.id} className={`bg-white dark:bg-slate-900 border rounded-2xl p-6 transition-all ${notification.read ? 'border-slate-200 dark:border-slate-800' : 'border-primary-500 dark:border-primary-500 bg-primary-50/50 dark:bg-primary-900/10'}`}>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
                                {notification.type === 'request' && notification.status === 'pending' && <User className="w-5 h-5 text-amber-500" />}
                                {notification.type === 'request' && notification.status === 'accepted' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                                {notification.type === 'session' && <Video className="w-5 h-5 text-primary-500" />}
                                {notification.type === 'credit' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="font-bold">{notification.title}</h3>
                                        <p className="text-slate-600 dark:text-slate-300 mt-1">{notification.message}</p>
                                        {notification.skill && <p className="text-sm text-primary-600 mt-2 font-medium">{notification.skill}</p>}
                                    </div>
                                    <span className="text-xs text-slate-500 whitespace-nowrap">{formatTime(notification.timestamp)}</span>
                                </div>

                                {notification.type === 'request' && notification.status === 'pending' && (
                                    <div className="flex gap-3 mt-4">
                                        <button onClick={() => handleAction(notification.id, 'accepted')} disabled={loading === notification.id} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50">
                                            {loading === notification.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}Accept
                                        </button>
                                        <button onClick={() => handleAction(notification.id, 'declined')} disabled={loading === notification.id} className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50">
                                            <X className="w-4 h-4" />Decline
                                        </button>
                                    </div>
                                )}

                                {notification.status === 'accepted' && <Link to={`/live/${notification.id}`} className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors mt-4"><Video className="w-4 h-4" />Join Class</Link>}
                                {notification.status === 'scheduled' && <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg font-medium mt-4"><Calendar className="w-4 h-4" />Session Scheduled</div>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notifications;
