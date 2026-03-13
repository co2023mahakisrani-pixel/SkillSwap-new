import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Clock, Users, Star, ChevronRight, Code, Palette, Database, Globe, Smartphone, Cpu, Shield, Cloud } from 'lucide-react';

const categories = [
    { name: 'Programming', icon: Code, color: 'bg-blue-500' },
    { name: 'UI/UX', icon: Palette, color: 'bg-pink-500' },
    { name: 'Web Development', icon: Globe, color: 'bg-green-500' },
    { name: 'Mobile Development', icon: Smartphone, color: 'bg-purple-500' },
    { name: 'Data Science', icon: Database, color: 'bg-orange-500' },
    { name: 'DevOps', icon: Cloud, color: 'bg-cyan-500' },
    { name: 'Cybersecurity', icon: Shield, color: 'bg-red-500' },
    { name: 'AI/ML', icon: Cpu, color: 'bg-indigo-500' },
];

const courses = [
    { id: 1, title: 'Java Programming', category: 'Programming', tutor: 'Suraj', duration: '8 weeks', credits: 5, rating: 4.8, students: 234, description: 'Learn Java from basics to advanced concepts including OOP, collections, and multithreading.' },
    { id: 2, title: 'Python Programming', category: 'Programming', tutor: 'Mahak', duration: '10 weeks', credits: 6, rating: 4.9, students: 456, description: 'Master Python programming with focus on data science and machine learning basics.' },
    { id: 3, title: 'UI/UX Design', category: 'UI/UX', tutor: 'Mahak', duration: '6 weeks', credits: 4, rating: 4.7, students: 189, description: 'Design beautiful user interfaces using Figma and understand user experience principles.' },
    { id: 4, title: 'React.js Development', category: 'Web Development', tutor: 'Alex', duration: '8 weeks', credits: 5, rating: 4.8, students: 312, description: 'Build modern web applications with React, hooks, and state management.' },
    { id: 5, title: 'Node.js Backend', category: 'Web Development', tutor: 'Jordan', duration: '7 weeks', credits: 5, rating: 4.6, students: 178, description: 'Create scalable backend services with Node.js, Express, and MongoDB.' },
    { id: 6, title: 'Flutter Mobile Apps', category: 'Mobile Development', tutor: 'Sam', duration: '9 weeks', credits: 6, rating: 4.7, students: 145, description: 'Build cross-platform mobile apps with Flutter and Dart.' },
    { id: 7, title: 'Data Science with Python', category: 'Data Science', tutor: 'Priya', duration: '12 weeks', credits: 8, rating: 4.9, students: 567, description: 'Analyze data using Python, Pandas, NumPy and create visualizations.' },
    { id: 8, title: 'AWS Cloud Computing', category: 'DevOps', tutor: 'Mike', duration: '8 weeks', credits: 6, rating: 4.5, students: 234, description: 'Learn cloud computing fundamentals with AWS services.' },
    { id: 9, title: 'Cybersecurity Fundamentals', category: 'Cybersecurity', tutor: 'Sarah', duration: '10 weeks', credits: 7, rating: 4.8, students: 198, description: 'Understand security principles, ethical hacking, and network protection.' },
    { id: 10, title: 'Machine Learning Basics', category: 'AI/ML', tutor: 'David', duration: '12 weeks', credits: 8, rating: 4.9, students: 423, description: 'Introduction to ML algorithms, neural networks, and TensorFlow.' },
    { id: 11, title: 'JavaScript Essentials', category: 'Programming', tutor: 'Emma', duration: '6 weeks', credits: 4, rating: 4.7, students: 389, description: 'Master JavaScript from fundamentals to ES6+ features.' },
    { id: 12, title: 'TypeScript Development', category: 'Programming', tutor: 'Chris', duration: '5 weeks', credits: 4, rating: 4.6, students: 167, description: 'Add type safety to your JavaScript projects with TypeScript.' },
    { id: 13, title: 'Figma Design Mastery', category: 'UI/UX', tutor: 'Lisa', duration: '7 weeks', credits: 5, rating: 4.8, students: 256, description: 'Complete Figma course from basics to advanced prototyping.' },
    { id: 14, title: 'Next.js Full Stack', category: 'Web Development', tutor: 'Tom', duration: '10 weeks', credits: 7, rating: 4.8, students: 278, description: 'Build full-stack React applications with Next.js and API routes.' },
    { id: 15, title: 'Docker & Kubernetes', category: 'DevOps', tutor: 'Kevin', duration: '8 weeks', credits: 6, rating: 4.7, students: 198, description: 'Container orchestration with Docker and Kubernetes.' },
    { id: 16, title: 'iOS Development Swift', category: 'Mobile Development', tutor: 'Anna', duration: '10 weeks', credits: 7, rating: 4.6, students: 134, description: 'Create native iOS apps with Swift and SwiftUI.' },
    { id: 17, title: 'SQL Database Design', category: 'Data Science', tutor: 'Robert', duration: '6 weeks', credits: 4, rating: 4.5, students: 289, description: 'Design efficient databases and write complex SQL queries.' },
    { id: 18, title: 'GraphQL API Development', category: 'Web Development', tutor: 'Nina', duration: '5 weeks', credits: 4, rating: 4.6, students: 145, description: 'Build modern APIs with GraphQL and Apollo.' },
    { id: 19, title: 'Blockchain Development', category: 'Programming', tutor: 'Paul', duration: '10 weeks', credits: 7, rating: 4.4, students: 178, description: 'Create smart contracts and decentralized apps with Solidity.' },
    { id: 20, title: 'Vue.js Framework', category: 'Web Development', tutor: 'Amy', duration: '7 weeks', credits: 5, rating: 4.7, students: 167, description: 'Build reactive web apps with Vue 3 and Composition API.' },
];

const LearnSkills = ({ user }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [filteredCourses, setFilteredCourses] = useState(courses);

    useEffect(() => {
        let filtered = courses;
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(course => course.category === selectedCategory);
        }
        if (searchTerm) {
            filtered = filtered.filter(course => 
                course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.tutor.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredCourses(filtered);
    }, [searchTerm, selectedCategory]);

    const getCategoryColor = (categoryName) => {
        const cat = categories.find(c => c.name === categoryName);
        return cat ? cat.color : 'bg-gray-500';
    };

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
                <div className="relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="pl-12 pr-10 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none appearance-none cursor-pointer min-w-[200px]"
                    >
                        <option value="All">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.name} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
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
                {categories.map(cat => (
                    <button
                        key={cat.name}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                            selectedCategory === cat.name ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                    >
                        <cat.icon className="w-4 h-4" />
                        {cat.name}
                    </button>
                ))}
            </div>

            <p className="text-slate-500 dark:text-slate-400">Showing {filteredCourses.length} courses</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map(course => (
                    <Link
                        key={course.id}
                        to={`/learn/${course.id}`}
                        className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-primary-500 dark:hover:border-primary-500 transition-all hover:shadow-xl hover:shadow-primary-500/10"
                    >
                        <div className={`${getCategoryColor(course.category)} h-32 flex items-center justify-center`}>
                            <Code className="w-16 h-16 text-white" />
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300">
                                    {course.category}
                                </span>
                                <div className="flex items-center gap-1 text-amber-500">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="text-sm font-bold">{course.rating}</span>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold group-hover:text-primary-600 transition-colors">{course.title}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{course.description}</p>
                            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                                        <span className="text-primary-600 font-bold text-sm">{course.tutor[0]}</span>
                                    </div>
                                    <span className="text-sm font-medium">{course.tutor}</span>
                                </div>
                                <div className="flex items-center gap-1 text-primary-600 font-bold">
                                    {course.credits} credits
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default LearnSkills;
