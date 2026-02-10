
import React, { useState } from 'react';
import { translations } from '../translations';
import { Language, User } from '../types';
import { ADMIN_CREDENTIALS } from '../constants';

interface AuthProps {
  type: 'login' | 'register';
  language: Language;
  onAuth: (user: User, isNewUser: boolean) => void;
  registeredUsers: User[];
}

const Auth: React.FC<AuthProps> = ({ type, language, onAuth, registeredUsers }) => {
  const t = translations[language];
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (type === 'login') {
      // Admin Check
      if (username === ADMIN_CREDENTIALS.username) {
        if (password === ADMIN_CREDENTIALS.password) {
          onAuth({
            id: 'admin-id',
            username: ADMIN_CREDENTIALS.username,
            password: ADMIN_CREDENTIALS.password,
            isPremium: true,
            imagesGenerated: 0
          }, false);
          return;
        } else {
          setError(language === 'ar' ? 'كلمة مرور المسؤول غير صحيحة' : 'Invalid admin password');
          return;
        }
      }

      // Normal User Login
      const user = registeredUsers.find(u => u.username === username);
      if (!user) {
        setError(language === 'ar' ? 'اسم المستخدم غير موجود' : 'Username not found. Please register first.');
        return;
      }
      if (user.password !== password) {
        setError(language === 'ar' ? 'كلمة المرور غير صحيحة' : 'Incorrect password');
        return;
      }
      onAuth(user, false);

    } else {
      // Register Logic
      if (username.length < 3) {
        setError(language === 'ar' ? 'يجب أن يكون اسم المستخدم 3 أحرف على الأقل' : 'Username must be at least 3 characters');
        return;
      }
      if (password.length < 4) {
        setError(language === 'ar' ? 'يجب أن تكون كلمة المرور 4 أحرف على الأقل' : 'Password must be at least 4 characters');
        return;
      }

      // Check if username taken (including admin)
      if (username === ADMIN_CREDENTIALS.username || registeredUsers.some(u => u.username === username)) {
        setError(language === 'ar' ? 'اسم المستخدم مأخوذ بالفعل' : 'Username is already taken');
        return;
      }

      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        username,
        password,
        isPremium: false,
        imagesGenerated: 0
      };
      onAuth(newUser, true);
    }
  };

  return (
    <div className={`pt-32 px-6 flex items-center justify-center ${language === 'ar' ? 'font-arabic' : ''}`}>
      <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-[32px] shadow-2xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-yellow-400 rounded-2xl mx-auto mb-4 flex items-center justify-center text-black font-bold text-2xl rotate-3 shadow-[0_0_20px_rgba(250,204,21,0.4)]">
             N
          </div>
          <h1 className="text-2xl font-orbitron font-bold uppercase tracking-widest">{type === 'login' ? t.login : t.register}</h1>
          <p className="text-white/40 text-sm mt-2">{t.authTagline}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 text-start">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest mx-1">{t.username}</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl p-4 focus:border-yellow-400 focus:outline-none transition-colors"
              placeholder={t.username}
              required
            />
          </div>
          
          <div className="space-y-2 text-start">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest mx-1">{t.password}</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl p-4 focus:border-yellow-400 focus:outline-none transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-red-500 text-xs text-center font-medium animate-pulse">{error}</p>}

          <button 
            type="submit" 
            className="w-full bg-yellow-400 text-black font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
          >
            {type === 'login' ? t.login : t.register}
          </button>
        </form>

        <p className="text-center text-sm text-white/40 mt-8">
          {type === 'login' ? t.noAccount : t.haveAccount}
          <a href={type === 'login' ? '#/register' : '#/login'} className="text-yellow-400 mx-2 font-bold hover:underline">
            {type === 'login' ? t.register : t.login}
          </a>
        </p>
      </div>
    </div>
  );
};

export default Auth;
