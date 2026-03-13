import React, { useState } from 'react';
import { useParams, useNavigate, Navigate, Link } from 'react-router-dom';
import { Clock, Users, Star, Calendar, ArrowLeft, CheckCircle, Loader2, Video, MessageSquare } from 'lucide-react';

const coursesData = [
    { id: 1, title: 'Java Programming', category: 'Programming', tutor: 'Suraj', duration: '8 weeks', credits: 5, rating: 4.8, students: 234, description: 'Learn Java from basics to advanced concepts including OOP, collections, and multithreading.', fullDescription: 'This comprehensive Java course takes you from the fundamentals of programming to advanced concepts used in industry.' },
    { id: 2, title: 'Python Programming', category: 'Programming', tutor: 'Mahak', duration: '10 weeks', credits: 6, rating: 4.9, students: 456, description: 'Master Python programming with focus on data science and machine learning basics.', fullDescription: 'Dive into the world of Python programming with this hands-on course.' },
    { id: 3, title: 'UI/UX Design', category: 'UI/UX', tutor: 'Mahak', duration: '6 weeks', credits: 4, rating: 4.7, students: 189, description: 'Design beautiful user interfaces using Figma.', fullDescription: 'Learn the fundamentals of UI/UX design using Figma.' },
    { id: 4, title: 'React.js Development', category: 'Web Development', tutor: 'Alex', duration: '8 weeks', credits: 5, rating: 4.8, students: 312, description: 'Build modern web applications with React.', fullDescription: 'Master React.js from scratch and build production-ready web applications.' },
    { id: 5, title: 'Node.js Backend', category: 'Web Development', tutor: 'Jordan', duration: '7 weeks', credits: 5, rating: 4.6, students: 178, description: 'Create scalable backend services with Node.js.', fullDescription: 'Build powerful backend applications with Node.js.' },
    { id: 6, title: 'Flutter Mobile Apps', category: 'Mobile Development', tutor: 'Sam', duration: '9 weeks', credits: 6, rating: 4.7, students: 145, description: 'Build cross-platform mobile apps with Flutter.', fullDescription: 'Create beautiful, natively compiled mobile applications.' },
    { id: 7, title: 'Data Science with Python', category: 'Data Science', tutor: 'Priya', duration: '12 weeks', credits: 8, rating: 4.9, students: 567, description: 'Analyze data using Python and Pandas.', fullDescription: 'Master data science with Python.' },
    { id: 8, title: 'AWS Cloud Computing', category: 'DevOps', tutor: 'Mike', duration: '8 weeks', credits: 6, rating: 4.5, students: 234, description: 'Learn cloud computing with AWS.', fullDescription: 'Get hands-on experience with AWS cloud services.' },
    { id: 9, title: 'Cybersecurity Fundamentals', category: 'Cybersecurity', tutor: 'Sarah', duration: '10 weeks', credits: 7, rating: 4.8, students: 198, description: 'Understand security principles.', fullDescription: 'Learn essential cybersecurity concepts.' },
    { id: 10, title: 'Machine Learning Basics', category: 'AI/ML', tutor: 'David', duration: '12 weeks', credits: 8, rating: 4.9, students: 423, description: 'Introduction to ML algorithms.', fullDescription: 'Start your journey into machine learning.' },
    { id: 11, title: 'JavaScript Essentials', category: 'Programming', tutor: 'Emma', duration: '6 weeks', credits: 4, rating: 4.7, students: 389, description: 'Master JavaScript fundamentals.', fullDescription: 'Master JavaScript from the ground up.' },
    { id: 12, title: 'TypeScript Development', category: 'Programming', tutor: 'Chris', duration: '5 weeks', credits: 4, rating: 4.6, students: 167, description: 'Add type safety with TypeScript.', fullDescription: 'Level up your JavaScript with TypeScript.' },
    { id: 13, title: 'Figma Design Mastery', category: 'UI/UX', tutor: 'Lisa', duration: '7 weeks', credits: 5, rating: 4.8, students: 256, description: 'Complete Figma course.', fullDescription: 'Become a Figma expert.' },
    { id: 14, title: 'Next.js Full Stack', category: 'Web Development', tutor: 'Tom', duration: '10 weeks', credits: 7, rating: 4.8, students: 278, description: 'Build full-stack React apps.', fullDescription: 'Build production-ready full-stack applications.' },
    { id: 15, title: 'Docker & Kubernetes', category: 'DevOps', tutor: 'Kevin', duration: '8 weeks', credits: 6, rating: 4.7, students: 198, description: 'Container orchestration.', fullDescription: 'Master containerization with Docker and Kubernetes.' },
    { id: 16, title: 'iOS Development Swift', category: 'Mobile Development', tutor: 'Anna', duration: '10 weeks', credits: 7, rating: 4.6, students: 134, description: 'Create native iOS apps.', fullDescription: 'Build beautiful iOS applications with Swift.' },
    { id: 17, title: 'SQL Database Design', category: 'Data Science', tutor: 'Robert', duration: '6 weeks', credits: 4, rating: 4.5, students: 289, description: 'Design efficient databases.', fullDescription: 'Master database design and SQL.' },
    { id: 18, title: 'GraphQL API Development', category: 'Web Development', tutor: 'Nina', duration: '5 weeks', credits: 4, rating: 4.6, students: 145, description: 'Build modern APIs.', fullDescription: 'Build modern APIs with GraphQL.' },
    { id: 19, title: 'Blockchain Development', category: 'Programming', tutor: 'Paul', duration: '10 weeks', credits: 7, rating: 4.4, students: 178, description: 'Create smart contracts.', fullDescription: 'Enter the world of blockchain.' },
    { id: 20, title: 'Vue.js Framework', category: 'Web Development', tutor: 'Amy', duration: '7 weeks', credits: 5, rating: 4.7, students: 167, description: 'Build reactive web apps.', fullDescription: 'Master Vue.js 3 with Composition API.' },
];

const CourseDetail = ({ user }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [requesting, setRequesting] = useState(false);
    const [requested, setRequested] = useState(false);

    const course = coursesData.find(c => c.id === parseInt(id));

    if (!course) return <div className="text-center py-16"><h2 className="text-2xl font-bold mb-4">Course not found</h2><Link to="/learn" className="text-primary-600 hover:underline">Back to courses</Link></div>;
    if (!user) return <Navigate to="/auth" />;

    const handleRequest = async () => {
        setRequesting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setRequested(true);
        setRequesting(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors"><ArrowLeft className="w-4 h-4" />Back to courses</button>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden">
                <div className="bg-gradient-to-r from-primary-600 to-indigo-600 h-48 flex items-center justify-center">
                    <h1 className="text-4xl font-bold text-white">{course.title}</h1>
                </div>

                <div className="p-8">
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                        <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full text-sm font-semibold">{course.category}</span>
                        <div className="flex items-center gap-1 text-amber-500"><Star className="w-5 h-5 fill-current" /><span className="font-bold">{course.rating}</span></div>
                        <div className="flex items-center gap-1 text-slate-500"><Clock className="w-5 h-5" />{course.duration}</div>
                    </div>

                    <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">{course.fullDescription}</p>

                    <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                                    <span className="text-primary-600 font-bold text-xl">{course.tutor[0]}</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{course.tutor}</h3>
                                    <p className="text-slate-500">Your Mentor</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-primary-600">{course.credits}</p>
                                    <p className="text-sm text-slate-500">Credits</p>
                                </div>

                                {requested ? (
                                    <div className="px-6 py-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl font-bold flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5" />Request Sent!
                                    </div>
                                ) : (
                                    <button onClick={handleRequest} disabled={requesting} className="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/25 flex items-center gap-2 disabled:opacity-50">
                                        {requesting ? <><Loader2 className="w-5 h-5 animate-spin" />Sending...</> : <>Request to Learn</>}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
