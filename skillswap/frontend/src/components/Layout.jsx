import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = ({ children, user, onSignOut, darkMode, toggleDarkMode }) => {
    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-slate-950 text-slate-50' : 'bg-slate-50 text-slate-900'}`}>
            <Navbar user={user} onSignOut={onSignOut} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <main className="max-w-7xl mx-auto px-4 py-8">
                {children}
            </main>
            <footer className="border-t border-slate-200 dark:border-slate-800 py-12 px-4 mt-20">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="bg-primary-600 p-1.5 rounded-lg">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold">SkillSwap</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                            The ultimate platform for skill exchange. Learn anything from experts around the world using our unique token-based system.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Platform</h4>
                        <ul className="space-y-2 text-slate-500 dark:text-slate-400">
                            <li><Link to="/learn" className="hover:text-primary-500 transition-colors">Courses</Link></li>
                            <li><Link to="/about" className="hover:text-primary-500 transition-colors">How it Works</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Support</h4>
                        <ul className="space-y-2 text-slate-500 dark:text-slate-400">
                            <li><Link to="/contact" className="hover:text-primary-500 transition-colors">Contact Us</Link></li>
                            <li><Link to="/faq" className="hover:text-primary-500 transition-colors">FAQ</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400 text-sm">
                    © {new Date().getFullYear()} SkillSwap. Built for Production.
                </div>
            </footer>
        </div>
    );
};

export default Layout;
