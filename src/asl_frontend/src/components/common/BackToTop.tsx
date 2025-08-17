import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';

const BackToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { theme } = useTheme();
    const { t, isRTL } = useLanguage();

    // Show button when page is scrolled down
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    if (!isVisible) {
        return null;
    }

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-6 ${isRTL ? 'left-6 md:left-8' : 'right-6 md:right-8'} md:bottom-8 z-50 group transition-all duration-300 ease-in-out
                       transform hover:scale-110 hover:-translate-y-1
                       ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
            aria-label={t('returnToTop')}
        >
            <div
                className={`relative flex items-center justify-center rounded-full shadow-lg
                           w-12 h-12 md:w-14 md:h-14 border-2 transition-all duration-300
                           animate-[pharaohGlow_3s_ease-in-out_infinite]
                           group-hover:shadow-xl
                           ${theme === 'dark'
                        ? 'bg-gradient-to-br from-[#d4af37] to-[#ffd700] border-[#d4af37] hover:from-[#ffd700] hover:to-[#ffed4e]'
                        : 'bg-gradient-to-br from-[#b8860b] to-[#d4af37] border-[#b8860b] hover:from-[#d4af37] hover:to-[#ffd700]'
                    }`}
            >
                <span className='bold'>
                    𓋹
                </span>

                {/* Decorative ring around the button */}
                <div className={`absolute inset-0 rounded-full border-2 opacity-0 group-hover:opacity-100 
                               animate-ping transition-opacity duration-300
                               ${theme === 'dark' ? 'border-[#ffd700]' : 'border-[#d4af37]'}`}></div>

                {/* Tooltip */}
                <div className={`absolute bottom-full ${isRTL ? 'left-0' : 'right-0'} mb-2 px-3 py-1 rounded-lg text-sm font-medium
                               opacity-0 group-hover:opacity-100 transition-opacity duration-300
                               whitespace-nowrap pointer-events-none
                               ${theme === 'dark'
                        ? 'bg-gray-800 text-white border border-gray-600'
                        : 'bg-white text-gray-800 border border-gray-200 shadow-lg'
                    }`}>
                    {t('returnToTop')}
                    {/* Tooltip arrow */}
                    <div className={`absolute top-full ${isRTL ? 'left-4' : 'right-4'} w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent
                                   ${theme === 'dark' ? 'border-t-gray-800' : 'border-t-white'}`}></div>
                </div>
            </div>

            <style>{`
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
            `}</style>
        </button>
    );
};

export default BackToTop;
