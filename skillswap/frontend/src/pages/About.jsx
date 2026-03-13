import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Shield, Zap, BookOpen, ArrowRight, Cpu, Heart, Globe, Star } from 'lucide-react';

const About = () => {
    const features = [
        { title: 'Skill Exchange', description: 'Exchange your knowledge for credits and use them to learn something new from others.', icon: Users, color: 'bg-blue-500' },
        { title: 'Expert Mentors', description: 'Learn from experienced professionals in the SkillSwap community.', icon: BookOpen, color: 'bg-indigo-500' },
        { title: 'Secure Platform', description: 'Your payments and data are protected with industry-standard security.', icon: Shield, color: 'bg-emerald-500' },
        { title: 'Live Sessions', description: 'Join live video sessions directly in your browser - no downloads required.', icon: Zap, color: 'bg-amber-500' },
    ];

    const stats = [
        { value: '5,000+', label: 'Active Users' },
        { value: '500+', label: 'Skills Available' },
        { value: '10,000+', label: 'Sessions Completed' },
        { value: '4.8', label: 'Average Rating' },
    ];

    return (
        <div className="space-y-20 py-12">
            <section className="text-center space-y-6 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-bold border border-primary-100 dark:border-primary-800">
                    <Star className="w-4 h-4 fill-current" /><span>About SkillSwap</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">Learn. Share.{' '}<span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-500">Grow Together</span></h1>
                <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed">SkillSwap is a community-driven platform where knowledge is the currency. Teach what you know, learn what you love, and grow together with peers from around the world.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Link to="/auth" className="w-full sm:w-auto px-8 py-4 bg-primary-600 text-white rounded-xl font-bold text-lg hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/25 flex items-center justify-center gap-2">Get Started<ArrowRight className="w-5 h-5" /></Link>
                    <Link to="/learn" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Explore Skills</Link>
                </div>
            </section>

            <section className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {stats.map((stat, i) => (<div key={i} className="text-center p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl"><p className="text-4xl font-bold text-primary-600 mb-2">{stat.value}</p><p className="text-slate-500 dark:text-slate-400">{stat.label}</p></div>))}
            </section>

            <section className="max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">How SkillSwap Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6"><span className="text-2xl font-bold text-primary-600">1</span></div>
                        <h3 className="text-xl font-bold mb-3">Create Your Profile</h3>
                        <p className="text-slate-500 dark:text-slate-400">Sign up and set up your profile. List the skills you can teach and what you want to learn.</p>
                    </div>
                    <div className="text-center p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6"><span className="text-2xl font-bold text-primary-600">2</span></div>
                        <h3 className="text-xl font-bold mb-3">Connect & Learn</h3>
                        <p className="text-slate-500 dark:text-slate-400">Browse skills, find mentors, and request to learn. Schedule sessions and start learning.</p>
                    </div>
                    <div className="text-center p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6"><span className="text-2xl font-bold text-primary-600">3</span></div>
                        <h3 className="text-xl font-bold mb-3">Teach & Earn</h3>
                        <p className="text-slate-500 dark:text-slate-400">Teach others what you know and earn credits. Use credits to learn new skills.</p>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, idx) => (<div key={idx} className="group p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-primary-500/50 dark:hover:border-primary-500/50 transition-all hover:shadow-2xl hover:shadow-primary-500/5"><div className={`${feature.color} w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg shadow-current/20`}><feature.icon className="w-6 h-6" /></div><h3 className="text-xl font-bold mb-3">{feature.title}</h3><p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">{feature.description}</p></div>))}
            </section>

            <section className="bg-slate-950 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
                <div className="relative z-10 space-y-8">
                    <h2 className="text-4xl md:text-5xl font-bold text-white">Ready to join the community?</h2>
                    <p className="text-slate-400 text-lg max-w-xl mx-auto">Join thousands of learners and teachers on SkillSwap.</p>
                    <Link to="/auth" className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-xl font-bold text-lg hover:bg-primary-700 transition-all">Sign Up Now<ArrowRight className="w-5 h-5" /></Link>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-transparent to-indigo-900/20 opacity-50" />
            </section>

            <section className="text-center text-slate-500 dark:text-slate-400">
                <div className="flex items-center justify-center gap-2 mb-4"><Cpu className="w-6 h-6 text-primary-600" /><span className="text-xl font-bold">SkillSwap</span></div>
                <p className="flex items-center justify-center gap-1">Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> for learners everywhere</p>
            </section>
        </div>
    );
};

export default About;
