import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
const Navbar: React.FC = () => {
    const { isAuthenticated, login, logout, loading } = useAuth();
    const { language, toggleLanguage, t, isRTL } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { key: 'home', path: '/' },
        { key: 'artifacts', path: '/artifacts' },
        { key: 'services', path: '/services' },
        { key: 'dashboard', path: '/dashboard' },
        { key: 'community', path: '/community' },
        { key: 'about', path: '/about' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="bg-gradient-to-r from-amber-800 via-yellow-600 to-amber-700 dark:from-gray-900 dark:via-amber-900 dark:to-gray-900 shadow-lg border-b-4 border-amber-500 dark:border-amber-600 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo and Brand */}
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
                            {/* Egyptian Ankh Symbol */}
                            {/* <div className="w-8 h-8 text-white flex items-center justify-center">
                                <img src="/Asl.png" alt="Logo" />
                            </div> */}


                            <div
                                className={`flex items-center justify-center rounded-full relative overflow-hidden 
                                            animate-[pharaohGlow_3s_ease-in-out_infinite]
                                           ${theme === 'dark'
                                        ? 'bg-gradient-to-br from-[#d4af37] to-[#ffd700] border-[#d4af37]'
                                        : 'bg-gradient-to-br from-[#b8860b] to-[#8b7355] border-[#b8860b]'
                                    }
                                      border-2 w-[45px] h-[45px]
                                             sm:border-3 sm:w-[55px] sm:h-[55px]
                                    lg:w-[60px] lg:h-[60px]`}
                            >
                                <img
                                    src="/Asl.png"
                                    alt="ASL Logo"
                                    className="logo-img"
                                    style={{
                                        color: theme === 'dark' ? '#fff' : '#000000',


                                    }}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        const fallback = (e.target as HTMLElement).nextElementSibling as HTMLElement;
                                        if (fallback) fallback.style.display = 'block';
                                    }}
                                />
                                <div
                                    style={{
                                        display: 'none',
                                        fontSize: '1.5rem',
                                        color: theme === 'dark' ? '#fff' : '#000000',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    𓉔
                                </div>

                                <div className="logo-decorative" />
                            </div>

                            <style>
                                {`
    @keyframes pharaohGlow {
      0%, 100% {
        box-shadow: 0 0 10px ${theme === 'dark'
                                        ? 'rgba(212, 175, 55, 0.3)'
                                        : 'rgba(184, 134, 11, 0.3)'};
      }
      50% {
        box-shadow:
          0 0 20px ${theme === 'dark'
                                        ? 'rgba(212, 175, 55, 0.6)'
                                        : 'rgba(184, 134, 11, 0.6)'},
          0 0 30px ${theme === 'dark'
                                        ? 'rgba(212, 175, 55, 0.4)'
                                        : 'rgba(184, 134, 11, 0.4)'};
      }
    }
  `}
                            </style>




                            <div className="text-white">
                                <h1 className="text-xl font-bold tracking-wide font-serif">
                                    {t('appName')}
                                </h1>
                                <p className="text-xs opacity-90 hidden sm:block">
                                    {t('appSubtitle')}
                                </p>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
                        {navItems.map((item) => (
                            <Link
                                key={item.key}
                                to={item.path}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${isActive(item.path)
                                    ? 'text-amber-100 bg-amber-600 dark:bg-amber-800 shadow-md'
                                    : 'text-white hover:text-amber-100 hover:bg-amber-600 dark:hover:bg-amber-800'
                                    }`}
                            >
                                {t(item.key)}
                            </Link>
                        ))}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        {/* Language Toggle */}
                        <button
                            onClick={toggleLanguage}
                            className="p-2 rounded-md text-white hover:bg-amber-600 dark:hover:bg-amber-800 transition-colors duration-200"
                            aria-label="Toggle language"
                        >
                            <span className="text-sm font-medium">
                                {language === 'en' ? 'عربي' : 'EN'}
                            </span>
                        </button>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-md text-white hover:bg-amber-600 dark:hover:bg-amber-800 transition-colors duration-200"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>

                        {/* Authentication */}
                        {loading ? (
                            <div className="text-white text-sm">{t('loading')}</div>
                        ) : isAuthenticated ? (
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                {/* Quick Create Buttons */}
                                <div className="hidden lg:flex items-center space-x-2">
                                    <Link
                                        to="/create-artifact"
                                        className="px-3 py-1.5 text-xs bg-amber-600 hover:bg-amber-700 text-white rounded-md transition-colors duration-200 font-medium"
                                        title="Submit Artifact"
                                    >
                                        🏺 Add
                                    </Link>
                                    <Link
                                        to="/create-proposal"
                                        className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 font-medium"
                                        title="Create Proposal"
                                    >
                                        🏛️ Propose
                                    </Link>
                                </div>
                                <Link
                                    to="/profile"
                                    className="p-2 rounded-md text-white hover:bg-amber-600 dark:hover:bg-amber-800 transition-colors duration-200"
                                    aria-label="Profile"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </Link>
                                <button
                                    onClick={logout}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                                >
                                    {t('logout')}
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={login}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                            >
                                {t('login')}
                            </button>
                        )}

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-md text-white hover:bg-amber-600 dark:hover:bg-amber-800"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-amber-600 dark:border-amber-700 pt-4 pb-3">
                        <div className="space-y-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.key}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActive(item.path)
                                        ? 'text-amber-100 bg-amber-600 dark:bg-amber-800'
                                        : 'text-white hover:text-amber-100 hover:bg-amber-600 dark:hover:bg-amber-800'
                                        }`}
                                >
                                    {t(item.key)}
                                </Link>
                            ))}

                            {/* Mobile Create Buttons */}
                            {isAuthenticated && (
                                <div className="border-t border-amber-600 dark:border-amber-700 pt-3 mt-3 space-y-2">
                                    <Link
                                        to="/create-artifact"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-base font-medium transition-colors duration-200"
                                    >
                                        🏺 Submit Artifact
                                    </Link>
                                    <Link
                                        to="/create-proposal"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-base font-medium transition-colors duration-200"
                                    >
                                        🏛️ Create Proposal
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
