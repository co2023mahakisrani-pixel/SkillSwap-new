import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import { signInWithEmail, signOut, getSession, signUpWithEmail } from './services/authService';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await getSession();
      setUser(data.session?.user ?? null);
    };

    loadSession();

    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription?.subscription?.unsubscribe?.();
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setMessage('');
    const { error } = await signInWithEmail(email, password);
    if (error) setMessage(error.message);
    else setMessage('Signed in successfully');
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setMessage('');
    const { error } = await signUpWithEmail(email, password);
    if (error) setMessage(error.message);
    else setMessage('Sign up successful, please check your email for confirmation');
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) setMessage(error.message);
    else setMessage('Signed out successfully');
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '2rem', maxWidth: 480, margin: '0 auto' }}>
      <h1>SkillSwap</h1>
      {user ? (
        <div>
          <p>Signed in as: {user.email}</p>
          <button onClick={handleSignOut}>Sign out</button>
        </div>
      ) : (
        <form onSubmit={handleSignIn} style={{ display: 'grid', gap: '0.75rem' }}>
          <input
            type='email'
            required
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type='password'
            required
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type='submit'>Sign In</button>
            <button type='button' onClick={handleSignUp}>Register</button>
          </div>
        </form>
      )}
      {message && <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>{message}</p>}
    </div>
  );
}

export default App;
