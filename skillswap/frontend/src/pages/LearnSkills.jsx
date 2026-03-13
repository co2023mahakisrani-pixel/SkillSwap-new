import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Clock, Star, ChevronRight, Code, Palette, Database, Globe, Smartphone, Cpu, Shield, Cloud, Loader2 } from 'lucide-react';
import { db } from '../services/db';

const iconMap = {
    Code, Palette, Database, Globe, Smartphone, Cpu, Shield, Cloud
};

const colorMap = {
    'bg-blue-500': 'Programming',
    'bg-pink-500': 'UI/UX',
    'bg-green-500': 'Web Development',
    'bg-purple-500': 'Mobile Development',
    'bg-orange-500': 'Data Science',
    'bg-cyan-500': 'DevOps',
    'bg-red-500': 'Cybersecurity',
    'bg-indigo-500': 'AI/ML'
};

const LearnSkills = ({ user }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [coursesData, categoriesData] = await Promise.all([
                    db.getCourses(),
                    db.getCategories()
                ]);
                setCourses(coursesData || []);
                setCategories(categoriesData || []);
            } catch (err) {
                console.error('Error fetching courses:', err);
                setError('Failed to load courses');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredCourses = courses.filter(course => {
        const matchesCategory = selectedCategory === 'All' || course.categories?.name === selectedCategory;
        const matchesSearch = !searchTerm || 
            course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const getCategoryColor = (categoryName) => {
        const cat = categories.find(c => c.name === categoryName);
        return cat?.color || 'bg-gray-500';
    };

    const getCategoryIcon = (categoryName) => {
        const cat = categories.find(c => c.name === categoryName);
        if (cat?.icon && iconMap[cat.icon]) {
            return iconMap[cat.icon];
        }
        return Code;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold">Learn a Tech Skill</h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                    Explore our catalog of tech skills and start learning from expert mentors in the SkillSwap community.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search courses, tutors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="flex flex-wrap gap-3">
                <button
                    onClick={() => setSelectedCategory('All')}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${
                        selectedCategory === 'All' ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary-100 dark:hover:bg-primary-900/30'
                    }`}
                >
                    All
                </button>
                {categories.map(cat => {
                    const Icon = iconMap[cat.icon] || Code;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.name)}
                            className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                                selectedCategory === cat.name ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            {cat.name}
                        </button>
                    );
                })}
            </div>

            <p className="text-slate-500 dark:text-slate-400">Showing {filteredCourses.length} courses</p>

            {filteredCourses.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <p className="text-slate-500">No courses found. Try a different search or category.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map(course => {
                        const Icon = getCategoryIcon(course.categories?.name);
                        const colorClass = getCategoryColor(course.categories?.name);
                        
                        return (
                            <Link
                                key={course.id}
                                to={`/learn/${course.id}`}
                                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-primary-500 dark:hover:border-primary-500 transition-all hover:shadow-xl hover:shadow-primary-500/10"
                            >
                                <div className={`${colorClass} h-32 flex items-center justify-center`}>
                                    <Icon className="w-16 h-16 text-white" />
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300">
                                            {course.categories?.name || 'General'}
                                        </span>
                                        <div className="flex items-center gap-1 text-amber-500">
                                            <Star className="w-4 h-4 fill-current" />
                                            <span className="text-sm font-bold">{course.rating || '0'}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold group-hover:text-primary-600 transition-colors">{course.title}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{course.description}</p>
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                                                <span className="text-primary-600 font-bold text-sm">
                                                    {course.profiles?.full_name?.[0] || 'T'}
                                                </span>
                                            </div>
                                            <span className="text-sm font-medium">{course.profiles?.full_name || 'Tutor'}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-primary-600 font-bold">
                                            {course.credits} credits
                                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default LearnSkills;
