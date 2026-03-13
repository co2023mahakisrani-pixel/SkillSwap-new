import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Shield, Zap, Star, Users } from 'lucide-react';

const LandingPage = () => {
    const features = [
        {
            title: 'Skill Exchange',
            description: 'Exchange your knowledge for tokens and use them to learn something new from others.',
            icon: Users,
            color: 'bg-blue-500',
        },
        {
            title: 'Expert Lectures',
            description: 'Access high-quality pre-recorded lectures from industry experts and teachers.',
            icon: BookOpen,
            color: 'bg-indigo-500',
        },
        {
            title: 'Secure Payments',
            description: 'Integrated Razorpay for seamless subscription and token refills.',
            icon: Shield,
            color: 'bg-emerald-500',
        },
        {
            title: 'Real-time Progress',
            description: 'Track your learning journey and token history with our intuitive dashboard.',
            icon: Zap,
            color: 'bg-amber-500',
        },
    ];

    return (
        <div className="space-y-32 py-12">
            <section className="relative text-center space-y-8 max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-bold border border-primary-100 dark:border-primary-800 mb-4">
                    <Star className="w-4 h-4 fill-current" />
                    <span>New: Premium React Lectures available</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
                    Master Any Skill Through{' '}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-500">
                        Exchange
                    </span>
                </h1>
                <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                    SkillSwap is the community-driven platform where knowledge is the currency. Teach what you know, learn what you love.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Link
                        to="/auth"
                        className="w-full sm:w-auto px-8 py-4 bg-primary-600 text-white rounded-xl font-bold text-lg hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/25 flex items-center justify-center gap-2 group"
                    >
                        Get Started Free
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        to="/learn"
                        className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    >
                        Explore Courses
                    </Link>
                </div>
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -z-10 animate-pulse" />
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10 animate-pulse delay-700" />
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, idx) => (
                    <div
                        key={idx}
                        className="group p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-primary-500/50 dark:hover:border-primary-500/50 transition-all hover:shadow-2xl hover:shadow-primary-500/5"
                    >
                        <div className={`${feature.color} w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg shadow-current/20`}>
                            <feature.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </section>

            <section className="bg-slate-950 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
                <div className="relative z-10 space-y-8">
                    <h2 className="text-4xl md:text-5xl font-bold text-white">Ready to join the revolution?</h2>
                    <p className="text-slate-400 text-lg max-w-xl mx-auto">
                        Join 5,000+ learners and teachers today. Start with 10 free tokens on registration.
                    </p>
                    <Link
                        to="/auth"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-xl font-bold text-lg hover:bg-primary-700 transition-all"
                    >
                        Sign Up Now
                    </Link>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-transparent to-indigo-900/20 opacity-50" />
            </section>
        </div>
    );
};

export default LandingPage;
