
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Language, User, GeneratedImage } from './types';
import Navbar from './Navbar';
import Home from './Home';
import Auth from './Auth';
import Dashboard from './Dashboard';
import Generate from './Generate';
import Upgrade from './Upgrade';
import Admin from './Admin';
import Gallery from './Gallery';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allImages, setAllImages] = useState<GeneratedImage[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedUsers = localStorage.getItem('nano_users');
    const storedImages = localStorage.getItem('nano_images');
    const storedSession = localStorage.getItem('nano_session');

    if (storedUsers) setAllUsers(JSON.parse(storedUsers));
    if (storedImages) setAllImages(JSON.parse(storedImages));
    if (storedSession) setCurrentUser(JSON.parse(storedSession));
    
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('nano_users', JSON.stringify(allUsers));
  }, [allUsers, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('nano_images', JSON.stringify(allImages));
  }, [allImages, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    if (currentUser) {
      localStorage.setItem('nano_session', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('nano_session');
    }
  }, [currentUser, isLoaded]);

  const handleLanguageToggle = () => setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  
  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleAuth = (user: User, isNewUser: boolean) => {
    if (isNewUser) {
      setAllUsers(prev => [...prev, user]);
    }
    setCurrentUser(user);
  };

  const handleImageGenerated = (img: GeneratedImage) => {
    setAllImages(prev => [...prev, img]);
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        imagesGenerated: currentUser.imagesGenerated + 1
      };
      setCurrentUser(updatedUser);
      setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    }
  };

  const handleUpdateUser = (updatedUser: User) => {
    setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  if (!isLoaded) return <div className="min-h-screen bg-[#050505] flex items-center justify-center font-orbitron text-yellow-400 animate-pulse uppercase tracking-widest">LOADING NANO...</div>;

  return (
    <Router>
      <div 
        dir={language === 'ar' ? 'rtl' : 'ltr'}
        className={`min-h-screen bg-[#050505] text-white selection:bg-yellow-400 selection:text-black ${language === 'ar' ? 'font-arabic' : ''}`}
      >
        <NavbarWrapper 
          user={currentUser} 
          language={language} 
          onLanguageToggle={handleLanguageToggle} 
          onLogout={handleLogout} 
        />
        
        <main className="transition-opacity duration-300">
          <Routes>
            <Route path="/" element={<HomeContent language={language} user={currentUser} onImageGenerated={handleImageGenerated} />} />
            <Route 
              path="/login" 
              element={!currentUser ? <Auth type="login" language={language} onAuth={handleAuth} registeredUsers={allUsers} /> : <Navigate to="/" replace />} 
            />
            <Route 
              path="/register" 
              element={!currentUser ? <Auth type="register" language={language} onAuth={handleAuth} registeredUsers={allUsers} /> : <Navigate to="/" replace />} 
            />
            <Route 
              path="/dashboard" 
              element={<DashboardWrapper language={language} user={currentUser} allImages={allImages} />} 
            />
            <Route 
              path="/generate" 
              element={<GenerateWrapper language={language} user={currentUser} onImageGenerated={handleImageGenerated} />} 
            />
            <Route path="/upgrade" element={<Upgrade language={language} />} />
            <Route 
              path="/admin" 
              element={<Admin language={language} users={allUsers} currentUser={currentUser} onUpdateUser={handleUpdateUser} />} 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

const HomeContent: React.FC<{ language: Language, user: User | null, onImageGenerated: (img: GeneratedImage) => void }> = ({ language, user, onImageGenerated }) => {
  const navigate = useNavigate();
  if (user) {
    return (
      <>
        <Generate language={language} user={user} onImageGenerated={onImageGenerated} onNavigate={navigate} />
        <div id="gallery" className="pb-20">
          <Gallery language={language} />
        </div>
      </>
    );
  }
  return <Home language={language} user={user} onNavigate={navigate} />;
};

const DashboardWrapper: React.FC<{ language: Language, user: User | null, allImages: GeneratedImage[] }> = ({ language, user, allImages }) => {
  const navigate = useNavigate();
  if (!user) return <Navigate to="/login" replace />;
  const userImages = allImages.filter(i => i.userId === user.id);
  return <Dashboard language={language} user={user} images={userImages} onNavigate={navigate} />;
};

const GenerateWrapper: React.FC<{ language: Language, user: User | null, onImageGenerated: (img: GeneratedImage) => void }> = ({ language, user, onImageGenerated }) => {
  const navigate = useNavigate();
  if (!user) return <Navigate to="/login" replace />;
  return (
    <>
      <Generate language={language} user={user} onImageGenerated={onImageGenerated} onNavigate={navigate} />
      <div id="gallery" className="pb-20">
        <Gallery language={language} />
      </div>
    </>
  );
};

const NavbarWrapper: React.FC<{ user: User | null, language: Language, onLanguageToggle: () => void, onLogout: () => void }> = ({ user, language, onLanguageToggle, onLogout }) => {
  const navigate = useNavigate();
  return (
    <Navbar 
      user={user} 
      language={language} 
      onLanguageToggle={onLanguageToggle} 
      onLogout={() => { onLogout(); navigate('/'); }} 
      onNavigate={(page) => navigate(page === 'home' ? '/' : `/${page}`)} 
    />
  );
};

export default App;
