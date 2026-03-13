import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, CreditCard, Settings, LogOut, Edit2, Save, Camera, BookMarked, GraduationCap, Briefcase, Star, TrendingUp, Loader2, Check } from 'lucide-react';
import { db } from '../services/db';

const creditPackages = [
    { credits: 10, price: 99, popular: false },
    { credits: 25, price: 199, popular: true },
    { credits: 50, price: 349, popular: false },
    { credits: 100, price: 599, popular: false },
];

const Profile = ({ user, profile: dbProfile, onSignOut, refreshProfile }) => {
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [purchasing, setPurchasing] = useState(null);
    const [profile, setProfile] = useState({
        fullName: user?.user_metadata?.full_name || 'User',
        bio: 'Passionate learner and teacher in the SkillSwap community.',
        credits: dbProfile?.credits || 0,
    });
    const [formData, setFormData] = useState(profile);

    useEffect(() => {
        setProfile(prev => ({ ...prev, credits: dbProfile?.credits || 0 }));
    }, [dbProfile]);

    if (!user) return <Navigate to="/auth" />;

    const handleSave = async () => {
        try {
            await db.updateProfile(user.id, {
                full_name: formData.fullName,
            });
            setProfile({ ...formData });
            setEditing(false);
            if (refreshProfile) refreshProfile();
        } catch (err) {
            console.error('Error updating profile:', err);
        }
    };

    const handlePurchase = async (pkg) => {
        setPurchasing(pkg.credits);
        
        try {
            const purchase = await db.createCreditPurchase(user.id, pkg.credits, pkg.price);
            
            const mockPaymentSuccess = await new Promise(resolve => setTimeout(resolve, 1500));
            
            await db.updatePurchaseStatus(purchase.id, 'mock_order_id', 'completed');
            await db.addCreditsToUser(user.id, pkg.credits);
            
            if (refreshProfile) refreshProfile();
            
            setProfile(prev => ({ ...prev, credits: prev.credits + pkg.credits }));
            
            alert(`Successfully purchased ${pkg.credits} credits!`);
        } catch (err) {
            console.error('Purchase error:', err);
            alert('Failed to complete purchase. Please try again.');
        } finally {
            setPurchasing(null);
        }
    };

    const stats = [
        { label: 'Learning Credits', value: profile.credits, icon: CreditCard, color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-900/20' },
        { label: 'Enrolled Courses', value: 0, icon: BookMarked, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
        { label: 'Skills Teaching', value: 0, icon: Briefcase, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
        { label: 'Completed', value: 0, icon: GraduationCap, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden">
                <div className="bg-gradient-to-r from-primary-600 to-indigo-600 h-32"></div>
                
                <div className="px-8 pb-8">
                    <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16">
                        <div className="relative">
                            <div className="w-32 h-32 bg-white dark:bg-slate-900 rounded-2xl border-4 border-white dark:border-slate-900 flex items-center justify-center overflow-hidden">
                                <User className="w-16 h-16 text-slate-400" />
                            </div>
                            <button className="absolute bottom-2 right-2 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700"><Camera className="w-4 h-4" /></button>
                        </div>

                        <div className="flex-1">
                            {editing ? (
                                <input 
                                    type="text" 
                                    value={formData.fullName} 
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} 
                                    className="text-3xl font-bold bg-transparent border-b-2 border-primary-500 outline-none w-full" 
                                /> 
                            ) : <h1 className="text-3xl font-bold">{profile.fullName}</h1>}
                            <p className="text-slate-500 dark:text-slate-400 mt-1">{user.email}</p>
                        </div>

                        <div className="flex gap-3">
                            {editing ? (
                                <>
                                    <button onClick={() => setEditing(false)} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-xl font-medium">Cancel</button>
                                    <button onClick={handleSave} className="px-4 py-2 bg-primary-600 text-white rounded-xl font-medium flex items-center gap-2">
                                        <Save className="w-4 h-4" />Save
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => setEditing(true)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-medium flex items-center gap-2">
                                    <Edit2 className="w-4 h-4" />Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="mt-8">
                        {editing ? (
                            <textarea 
                                value={formData.bio} 
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })} 
                                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl resize-none" 
                                rows={3} 
                            />
                        ) : <p className="text-slate-600 dark:text-slate-300">{profile.bio}</p>}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center">
                        <div className={`${stat.bg} w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <p className="text-3xl font-bold">{stat.value}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary-500" />
                    Buy Credits
                </h3>
                <p className="text-slate-500 mb-6">Purchase credits to enroll in courses and start learning.</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {creditPackages.map((pkg) => (
                        <div 
                            key={pkg.credits}
                            className={`relative border-2 rounded-xl p-4 text-center transition-all ${
                                pkg.popular 
                                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                                    : 'border-slate-200 dark:border-slate-700 hover:border-primary-300'
                            }`}
                        >
                            {pkg.popular && (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-600 text-white text-xs font-bold rounded-full">
                                    Popular
                                </span>
                            )}
                            <p className="text-3xl font-bold text-primary-600">{pkg.credits}</p>
                            <p className="text-sm text-slate-500 mb-3">credits</p>
                            <p className="text-xl font-bold mb-3">₹{pkg.price}</p>
                            <button
                                onClick={() => handlePurchase(pkg)}
                                disabled={purchasing === pkg.credits}
                                className="w-full py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {purchasing === pkg.credits ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    'Buy Now'
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-indigo-500" />
                        Skills I'm Teaching
                    </h3>
                    <div className="space-y-3">
                        <p className="text-slate-500">No skills added yet.</p>
                    </div>
                    <Link to="/teach" className="block mt-4 text-center text-primary-600 font-medium hover:underline">
                        + Add new skill
                    </Link>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <BookMarked className="w-5 h-5 text-amber-500" />
                        Skills I'm Learning
                    </h3>
                    <div className="space-y-3">
                        <p className="text-slate-500">No skills added yet.</p>
                    </div>
                    <Link to="/learn" className="block mt-4 text-center text-primary-600 font-medium hover:underline">
                        + Browse more skills
                    </Link>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-slate-500" />
                    Account Settings
                </h3>
                <div className="space-y-3">
                    <button 
                        onClick={onSignOut} 
                        className="w-full flex items-center gap-3 p-3 text-left rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <div>
                            <p className="font-medium">Sign Out</p>
                            <p className="text-sm text-red-400">Sign out of your account</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
