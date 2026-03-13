import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Briefcase, Clock, Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const TeachSkill = ({ user }) => {
    const [formData, setFormData] = useState({
        skillName: '',
        category: '',
        experienceLevel: '',
        description: '',
        availability: [],
        credits: 5,
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const categories = ['Programming', 'UI/UX', 'Web Development', 'Mobile Development', 'Data Science', 'DevOps', 'Cybersecurity', 'AI/ML', 'Other'];
    const experienceLevels = [
        { value: 'beginner', label: 'Beginner (1-2 years)' },
        { value: 'intermediate', label: 'Intermediate (2-5 years)' },
        { value: 'advanced', label: 'Advanced (5+ years)' },
        { value: 'expert', label: 'Expert (10+ years)' },
    ];
    const timeSlots = ['Weekday Morning (9AM - 12PM)', 'Weekday Afternoon (12PM - 5PM)', 'Weekday Evening (5PM - 9PM)', 'Weekend Morning (9AM - 12PM)', 'Weekend Afternoon (12PM - 5PM)', 'Weekend Evening (5PM - 9PM)'];

    if (!user) return <Navigate to="/auth" />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setSuccess(true);
        } catch (err) {
            setError('Failed to submit skill. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const toggleAvailability = (slot) => {
        setFormData(prev => ({
            ...prev,
            availability: prev.availability.includes(slot) ? prev.availability.filter(s => s !== slot) : [...prev.availability, slot]
        }));
    };

    if (success) {
        return (
            <div className="max-w-2xl mx-auto py-12">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Skill Submitted Successfully!</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8">Your skill has been listed on SkillSwap. Students can now find you.</p>
                    <button
                        onClick={() => { setSuccess(false); setFormData({ skillName: '', category: '', experienceLevel: '', description: '', availability: [], credits: 5 }); }}
                        className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all"
                    >
                        Add Another Skill
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto">
                    <Briefcase className="w-8 h-8 text-primary-600" />
                </div>
                <h1 className="text-4xl font-bold">Teach a Skill</h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">Share your expertise with the community. Set your availability and earn credits.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-6">
                {error && (
                    <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-semibold">Skill Name *</label>
                    <input type="text" required placeholder="e.g., UI/UX Design" value={formData.skillName} onChange={(e) => setFormData({ ...formData, skillName: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Category *</label>
                        <select required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none">
                            <option value="">Select category</option>
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Experience Level *</label>
                        <select required value={formData.experienceLevel} onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none">
                            <option value="">Select experience</option>
                            {experienceLevels.map(level => <option key={level.value} value={level.value}>{level.label}</option>)}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold">Description *</label>
                    <textarea required rows={4} placeholder="Describe what you'll teach..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none resize-none" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold">Availability *</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {timeSlots.map(slot => (
                            <button key={slot} type="button" onClick={() => toggleAvailability(slot)} className={`p-3 rounded-xl border text-left text-sm font-medium transition-all flex items-center gap-3 ${formData.availability.includes(slot) ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-600' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>
                                <Clock className="w-4 h-4" />
                                {slot}
                            </button>
                        ))}
                    </div>
                </div>

                <button type="submit" disabled={loading} className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2 disabled:opacity-50">
                    {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Submitting...</> : <><Upload className="w-5 h-5" />Submit Skill</>}
                </button>
            </form>
        </div>
    );
};

export default TeachSkill;
