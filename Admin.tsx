
import React from 'react';
import { translations } from '../translations';
import { Language, User } from '../types';

interface AdminProps {
  language: Language;
  users: User[];
  currentUser: User | null;
  onUpdateUser: (updatedUser: User) => void;
}

const Admin: React.FC<AdminProps> = ({ language, users, currentUser, onUpdateUser }) => {
  const t = translations[language];
  const isAdmin = currentUser?.username === 'R2';

  const extendSubscription = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      const now = new Date();
      const currentExpiry = user.subscriptionExpiry ? new Date(user.subscriptionExpiry) : now;
      const baseDate = currentExpiry > now ? currentExpiry : now;
      // Add 30 days
      const newExpiry = new Date(baseDate.getTime() + (30 * 24 * 60 * 60 * 1000));
      
      onUpdateUser({
        ...user,
        isPremium: true,
        subscriptionExpiry: newExpiry.toISOString()
      });
    }
  };

  if (!isAdmin) {
    return (
      <div className={`pt-32 px-6 flex flex-col items-center justify-center text-center ${language === 'ar' ? 'font-arabic' : ''}`}>
        <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-orbitron font-bold mb-4 uppercase tracking-widest">{language === 'ar' ? 'وصول مرفوض' : 'Access Denied'}</h2>
        <p className="text-white/40 max-w-sm">
          {language === 'ar' ? 'عذراً، هذه المنطقة مخصصة حصرياً لمدراء النظام فقط.' : 'Sorry, this area is strictly reserved for system administrators only.'}
        </p>
      </div>
    );
  }

  return (
    <div className={`pt-24 pb-20 px-6 max-w-6xl mx-auto ${language === 'ar' ? 'font-arabic' : ''}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-orbitron font-bold uppercase tracking-widest bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
            {t.userManagement}
          </h1>
          <p className="text-white/40 text-sm mt-1">{language === 'ar' ? 'إدارة تراخيص المستخدمين ومدة الاشتراك' : 'Manage user licenses and subscription durations'}</p>
        </div>
        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-bold text-white/60">{users.length} {language === 'ar' ? 'مستخدم مسجل' : 'Registered Users'}</span>
        </div>
      </div>
      
      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className={`w-full text-start ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-white/40">
                <th className="p-5 text-xs font-bold uppercase tracking-widest">{t.username}</th>
                <th className="p-5 text-xs font-bold uppercase tracking-widest">{t.status}</th>
                <th className="p-5 text-xs font-bold uppercase tracking-widest">{t.imagesCount}</th>
                <th className="p-5 text-xs font-bold uppercase tracking-widest">{t.expiry}</th>
                <th className="p-5 text-xs font-bold uppercase tracking-widest">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-white/[0.03] transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-xl flex items-center justify-center text-sm font-bold shadow-inner">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold tracking-tight">{user.username}</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                      user.isPremium 
                      ? 'bg-yellow-400/10 border-yellow-400/20 text-yellow-400' 
                      : 'bg-white/5 border-white/10 text-white/30'
                    }`}>
                      {user.isPremium ? 'PREMIUM' : 'FREE'}
                    </span>
                  </td>
                  <td className="p-5 font-mono text-sm text-white/60">
                    {user.imagesGenerated}
                  </td>
                  <td className="p-5 text-xs text-white/40">
                    {user.subscriptionExpiry 
                      ? new Date(user.subscriptionExpiry).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) 
                      : '---'}
                  </td>
                  <td className="p-5">
                    <button 
                      onClick={() => extendSubscription(user.id)}
                      className="bg-yellow-400 text-black text-[11px] font-bold px-4 py-2 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-yellow-400/10 uppercase tracking-tighter"
                    >
                      {t.extendSub}
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-white/20 italic font-medium">
                    {language === 'ar' ? 'لا يوجد مستخدمين مسجلين بعد في النظام' : 'No users registered in the system yet'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
