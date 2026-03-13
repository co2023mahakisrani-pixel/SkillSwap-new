import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, User, LogOut, Sun, Moon, Cpu, ChevronDown, GraduationCap, Briefcase, Bell, Settings, LogOut as LogOutIcon } from 'lucide-react';

const Navbar = ({ user, onSignOut, darkMode, toggleDarkMode }) => {
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const navItemsBeforeLogin = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Learn a Skill', path: '/learn', icon: GraduationCap },
        { name: 'Teach a Skill', path: '/teach', icon: Briefcase },
        { name: 'About', path: '/about', icon: BookOpen },
    ];

    const navItemsAfterLogin = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Learn a Skill', path: '/learn', icon: GraduationCap },
        { name: 'Teach a Skill', path: '/teach', icon: Briefcase },
        { name: 'About', path: '/about', icon: BookOpen },
    ];

    const navItems = user ? navItemsAfterLogin : navItemsBeforeLogin;

    return (
        <nav className="sticky top-0 z-50 glass border-b px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-primary-600 p-2 rounded-lg group-hover:bg-primary-700 transition-colors">
                        <Cpu className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-blue-500">
                        SkillSwap
                    </span>
                </Link>
            </div>

            <div className="hidden md:flex items-center gap-8">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        to={item.path}
                        className={`flex items-center gap-2 font-medium transition-colors hover:text-primary-600 ${location.pathname === item.path ? 'text-primary-600' : 'text-slate-600 dark:text-slate-300'
                            }`}
                    >
                        <item.icon className="w-4 h-4" />
                        {item.name}
                    </Link>
                ))}
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
                >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {user ? (
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 pl-4 border-l border-slate-200 dark:border-slate-800"
                        >
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-semibold truncate max-w-[150px]">{user.email}</p>
                                <p className="text-xs text-primary-600 font-bold">10 Credits</p>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50">
                                <Link
                                    to="/dashboard"
                                    className="flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    <User className="w-4 h-4" />
                                    Dashboard
                                </Link>
                                <Link
                                    to="/notifications"
                                    className="flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    <Bell className="w-4 h-4" />
                                    Notifications
                                </Link>
                                <Link
                                    to="/profile"
                                    className="flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    <Settings className="w-4 h-4" />
                                    Profile
                                </Link>
                                <hr className="my-2 border-slate-200 dark:border-slate-800" />
                                <button
                                    onClick={() => {
                                        setDropdownOpen(false);
                                        onSignOut();
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                >
                                    <LogOutIcon className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link
                        to="/auth"
                        className="bg-primary-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-all shadow-md shadow-primary-500/20"
                    >
                        Login / Sign Up
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
