import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import { getSession, signOut } from './services/authService';
import { db } from './services/db';

import Layout from './components/Layout';

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import LearnSkills from './pages/LearnSkills';
import TeachSkill from './pages/TeachSkill';
import CourseDetail from './pages/CourseDetail';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import LectureView from './pages/LectureView';
import About from './pages/About';

function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('skillswap-theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await getSession();
      setUser(data.session?.user ?? null);
      
      if (data.session?.user) {
        try {
          const userProfile = await db.getProfile(data.session.user.id);
          setProfile(userProfile);
        } catch (err) {
          console.error('Error fetching profile:', err);
        }
      }
      setLoading(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        try {
          const userProfile = await db.getProfile(session.user.id);
          setProfile(userProfile);
        } catch (err) {
          console.error('Error fetching profile:', err);
        }
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('skillswap-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('skillswap-theme', 'light');
    }
  }, [darkMode]);

  const handleSignOut = async () => {
    await signOut();
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) {
      try {
        const userProfile = await db.getProfile(user.id);
        setProfile(userProfile);
      } catch (err) {
        console.error('Error refreshing profile:', err);
      }
    }
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <Router>
      <Layout
        user={user}
        profile={profile}
        onSignOut={handleSignOut}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/auth"
            element={user ? <Navigate to="/dashboard" /> : <AuthPage />}
          />
          <Route
            path="/dashboard"
            element={user ? <Dashboard user={user} profile={profile} refreshProfile={refreshProfile} /> : <Navigate to="/auth" />}
          />
          <Route
            path="/learn"
            element={user ? <LearnSkills user={user} /> : <Navigate to="/auth" />}
          />
          <Route
            path="/learn/:id"
            element={user ? <CourseDetail user={user} profile={profile} refreshProfile={refreshProfile} /> : <Navigate to="/auth" />}
          />
          <Route
            path="/teach"
            element={user ? <TeachSkill user={user} profile={profile} /> : <Navigate to="/auth" />}
          />
          <Route
            path="/notifications"
            element={user ? <Notifications user={user} /> : <Navigate to="/auth" />}
          />
          <Route
            path="/profile"
            element={user ? <Profile user={user} profile={profile} onSignOut={handleSignOut} refreshProfile={refreshProfile} /> : <Navigate to="/auth" />}
          />
          <Route
            path="/live/:id"
            element={user ? <LectureView user={user} profile={profile} /> : <Navigate to="/auth" />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
