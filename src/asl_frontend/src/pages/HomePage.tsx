import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import HeroSection from '../components/home/Hero';

const HomePage: React.FC = () => {
    const { t, isRTL } = useLanguage();
    const { isAuthenticated, login } = useAuth();
    const { theme } = useTheme();


    const features = [
        {
            key: 'immutableRegistry',
            icon: '🏺',
            gradient: 'from-amber-400 to-orange-500',
        },
        {
            key: 'proofOfHeritage',
            icon: '🎭',
            gradient: 'from-yellow-400 to-amber-500',
        },
        {
            key: 'communityDAO',
            icon: '🏛️',
            gradient: 'from-orange-400 to-red-500',
        },
        {
            key: 'verifiedSubmissions',
            icon: '🔒',
            gradient: 'from-amber-500 to-yellow-600',
        },
    ];

    return (
        <div className="space-b-16">
            <HeroSection />

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Egyptian pattern background */}
                <div className="absolute inset-0 opacity-10 dark:opacity-5">
                    <div className="w-full h-full bg-gradient-to-r from-amber-600 via-yellow-500 to-orange-600"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center space-y-8">
                        {/* Egyptian Ankh Symbol */}
                        <div className="flex justify-center">
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
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold text-amber-900 dark:text-amber-100 font-serif leading-tight">
                            {t('homePageTitle')}
                        </h1>

                        <p className="text-xl md:text-2xl text-amber-800 dark:text-amber-200 max-w-4xl mx-auto leading-relaxed">
                            {t('homePageSubtitle')}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                            <Link
                                to="/artifacts"
                                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                            >
                                {t('homePageExploreArtifacts')}
                            </Link>

                            {isAuthenticated ? (
                                <Link
                                    to="/submit"
                                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                                >
                                    {t('homePageSubmitArtifact')}
                                </Link>
                            ) : (
                                <button
                                    onClick={login}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                                >
                                    {t('login')} {t('submitArtifact')}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Decorative Egyptian elements */}
                <div className="absolute top-10 left-10 w-16 h-16 text-amber-300 dark:text-amber-600 opacity-30 transform rotate-12">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                        <path d="M12 2L2 22h20L12 2z" />
                    </svg>
                </div>
                <div className="absolute bottom-10 right-10 w-20 h-16 text-amber-300 dark:text-amber-600 opacity-30 transform -rotate-12">
                    <svg viewBox="0 0 48 32" fill="currentColor" className="w-full h-full">
                        <path d="M24 16c-4 0-8-4-12-8 4-4 8-8 12-8s8 4 12 8c-4 4-8 8-12 8zm0-12c-2 0-4 2-4 4s2 4 4 4 4-2 4-4-2-4-4-4z" />
                    </svg>
                </div>
            </section>

            {/* Features Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-amber-900 dark:text-amber-100 font-serif mb-4">
                        {t('featuresTitle')}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature) => (
                        <div
                            key={feature.key}
                            className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden"
                        >
                            {/* Gradient background */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>

                            <div className="relative p-6 space-y-4">
                                {/* Icon */}
                                <div className="text-4xl mb-4">{feature.icon}</div>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100 font-serif">
                                    {t(feature.key)}
                                </h3>

                                {/* Description */}
                                <p className="text-amber-800 dark:text-amber-200 leading-relaxed">
                                    {t(`${feature.key}Desc`)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-gradient-to-r from-amber-600 via-yellow-500 to-orange-600 dark:from-amber-800 dark:via-amber-700 dark:to-orange-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
                        <div className="space-y-2">
                            <div className="text-4xl font-bold">5,000+</div>
                            <div className="text-xl opacity-90">Artifacts Preserved</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-4xl font-bold">100+</div>
                            <div className="text-xl opacity-90">Verified Institutions</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-4xl font-bold">∞</div>
                            <div className="text-xl opacity-90">Years of Preservation</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
