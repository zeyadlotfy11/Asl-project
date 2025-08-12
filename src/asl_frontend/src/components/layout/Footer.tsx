import React from 'react';
import { Facebook, Instagram, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

const PharaohFooter: React.FC = () => {
    const { t, language } = useLanguage();
    const { theme } = useTheme();
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        {
            name: 'Facebook',
            url: 'https://www.facebook.com/AslCulture',
            icon: <Facebook size={24} />,
            color: 'hover:text-blue-400',
            nameAr: 'فيسبوك'
        },
        {
            name: 'Instagram',
            url: 'https://www.instagram.com/asl_01_00/',
            icon: <Instagram size={24} />,
            color: 'hover:text-pink-400',
            nameAr: 'انستغرام'
        },
        {
            name: 'X',
            url: 'https://x.com/asl_egy',
            color: 'hover:text-blue-300',
            nameAr: 'اكس'
        }
    ];

    const teamMembers = [
        {
            name: 'Zeyad Lotfy',
            nameAr: 'زياد لطفي',
            role: t('fullStackDev'),
            profile: 'https://zeyadlotfy.vercel.app/',
            linkedin: 'https://www.linkedin.com/in/zeyadlotfyzizo',
            profileImage: "/zeyadlotfy.png",
            desc: language === 'ar' ? 'مطور ذو خبرة في التطوير الشامل مع تركيز متزايد على البلوك تشين' : 'A developer with solid experience in full-stack development and a growing focus on blockchain'
        },
        {
            name: 'Zyad Ashraf',
            nameAr: 'زياد أشرف',
            role: t('creativeStrategist'),
            linkedin: 'https://www.linkedin.com/in/z-ash/',
            profileImage: "/zyadashraf.png",
            desc: language === 'ar' ? 'العقل وراء رؤية المشروع وصياغة المشاكل والسرد الرقمي' : 'The mind behind the project\'s vision, problem framing, and digital storytelling'
        }
    ];

    return (
        <>
            <style>{`
                @keyframes floatHieroglyph {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-8px) rotate(1deg); }
                }
                @keyframes shimmerGold {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .pharaoh-footer {
                    background: ${theme === 'dark'
                    ? 'linear-gradient(135deg, #1a1a2e 0%, #2c1810 25%, #3d2817 50%, #2c1810 75%, #1a1a2e 100%)'
                    : 'linear-gradient(135deg, #faf5e6 0%, #f5f0dc 25%, #ede4c8 50%, #f5f0dc 75%, #faf5e6 100%)'
                };
                    border-top: 4px solid ${theme === 'dark' ? '#d4af37' : '#b8860b'};
                    position: relative;
                    overflow: hidden;
                }
                .hieroglyph-float {
                    animation: floatHieroglyph 6s ease-in-out infinite;
                }
                .gold-shimmer {
                    background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.3), transparent);
                    background-size: 200% 100%;
                    animation: shimmerGold 3s infinite;
                }
                .fade-in-up {
                    animation: fadeInUp 0.6s ease-out;
                }
                .social-icon {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .social-icon:hover {
                    transform: translateY(-3px) scale(1.1);
                }
                .team-card {
                    background: ${theme === 'dark'
                    ? 'linear-gradient(135deg, #2d1810 0%, #1a1a2e 100%)'
                    : 'linear-gradient(135deg, #f5f0dc 0%, #ede4c8 100%)'
                };
                    border: 2px solid ${theme === 'dark' ? '#d4af37' : '#b8860b'};
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .team-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 25px ${theme === 'dark' ? 'rgba(212, 175, 55, 0.3)' : 'rgba(184, 134, 11, 0.2)'};
                    border-color: ${theme === 'dark' ? '#ffd700' : '#daa520'};
                }
            `}</style>

            {/* Floating Hieroglyphs Background */}
            <div className="pharaoh-footer relative">
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {['𓉔', '𓏺', '𓂋', '𓋴', '𓊪', '𓈖', '𓇯', '𓆣', '𓅓', '𓄿'].map((hieroglyph, i) => (
                        <div
                            key={i}
                            className="absolute text-4xl hieroglyph-float opacity-10 select-none"
                            style={{
                                left: `${5 + (i * 9)}%`,
                                top: `${10 + (i % 3) * 30}%`,
                                animationDelay: `${i * 0.8}s`,
                                color: theme === 'dark' ? '#d4af37' : '#b8860b'
                            }}
                        >
                            {hieroglyph}
                        </div>
                    ))}
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    {/* Header Section */}
                    <div className="text-center mb-12 fade-in-up">
                        <div className="flex justify-center items-center mb-6">
                            <div className="text-6xl hieroglyph-float">𓋹</div>
                        </div>
                        <h2 className={`text-4xl font-bold font-serif mb-4 ${theme === 'dark' ? 'text-amber-100' : 'text-amber-900'
                            }`}>
                            <span className={`${theme === 'dark' ? 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent' : ''}`}>
                                {t('pharaohsLegacy')}
                            </span>
                        </h2>
                        <p className={`text-lg ${theme === 'dark' ? 'text-amber-200' : 'text-amber-700'} font-serif`}>
                            {t('ancientWisdom')}
                        </p>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-12">
                        {/* Brand & Description */}
                        <div className="space-y-6 fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                <div className={`w-12 h-12 ${theme === 'dark' ? 'text-amber-300' : 'text-amber-600'} hieroglyph-float`}>
                                    <img src="/Asl.png" alt="Asl Logo" className="w-full h-full" />
                                </div>
                                <div>
                                    <h3 className={`text-2xl font-bold font-serif ${theme === 'dark' ? 'text-amber-100' : 'text-amber-900'}`}>
                                        {t('appName')}
                                    </h3>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-amber-300' : 'text-amber-600'}`}>
                                        {t('appSubtitle')}
                                    </p>
                                </div>
                            </div>
                            <p className={`${theme === 'dark' ? 'text-amber-200' : 'text-amber-700'} leading-relaxed`}>
                                {t('footerDesc')}
                            </p>

                            {/* Social Media */}
                            <div className="space-y-4">
                                <h4 className={`text-lg font-semibold ${theme === 'dark' ? 'text-amber-100' : 'text-amber-800'} font-serif`}>
                                    {t('followUs')}
                                </h4>
                                <div className="flex space-x-4 rtl:space-x-reverse">
                                    {socialLinks.map((social) => (
                                        <a
                                            key={social.name}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`social-icon flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-lg ${theme === 'dark'
                                                ? 'bg-gray-800 hover:bg-gray-700 text-amber-200'
                                                : 'bg-white hover:bg-amber-50 text-amber-800'
                                                } shadow-lg ${social.color} transition-all duration-300`}
                                            title={language === 'ar' ? social.nameAr : social.name}
                                        >
                                            {social.icon}
                                            <span className="font-medium">
                                                {language === 'ar' ? social.nameAr : social.name}
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Our Team */}
                        <div className="lg:col-span-2 space-y-6 fade-in-up" style={{ animationDelay: '0.4s' }}>
                            <h4 className={`text-2xl font-bold ${theme === 'dark' ? 'text-amber-100' : 'text-amber-800'} font-serif text-center`}>
                                {t('ourTeam')}
                            </h4>
                            <div className="grid grid-cols-1 gap-6">
                                {teamMembers.map((member, index) => (
                                    <div
                                        key={member.name}
                                        className="team-card rounded-xl p-6"
                                        style={{ animationDelay: `${0.6 + index * 0.2}s` }}
                                    >
                                        <div className="flex items-start space-x-4 rtl:space-x-reverse mb-4">
                                            <div className="text-4xl hieroglyph-float">
                                                <img
                                                    src={member.profileImage}
                                                    alt={member.name}
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h5 className={`text-xl font-bold ${theme === 'dark' ? 'text-amber-100' : 'text-amber-900'} font-serif`}>
                                                    {language === 'ar' ? member.nameAr : member.name}
                                                </h5>
                                                <p className={`text-sm ${theme === 'dark' ? 'text-amber-300' : 'text-amber-600'} font-medium`}>
                                                    {member.role}
                                                </p>
                                            </div>
                                        </div>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-amber-200' : 'text-amber-700'} mb-4 leading-relaxed`}>
                                            {member.desc}
                                        </p>
                                        <div className="flex space-x-3 rtl:space-x-reverse">
                                            {member.profile && (
                                                <a
                                                    href={member.profile}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${theme === 'dark'
                                                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                                                        : 'bg-amber-500 hover:bg-amber-600 text-white'
                                                        } shadow-md hover:shadow-lg hover:scale-105`}
                                                >
                                                    🌐 {t('visitProfile')}
                                                </a>
                                            )}
                                            <a
                                                href={member.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${theme === 'dark'
                                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                                                    } shadow-md hover:shadow-lg hover:scale-105`}
                                            >
                                                💼 LinkedIn
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>



                    {/* Bottom Section */}
                    <div className={`pt-8 border-t-2 ${theme === 'dark' ? 'border-amber-600' : 'border-amber-400'} fade-in-up`} style={{ animationDelay: '1s' }}>
                        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                            <div className={`${theme === 'dark' ? 'text-amber-200' : 'text-amber-700'} text-center md:text-left`}>
                                <p className="font-serif">
                                    © {currentYear} {t('appName')} - {t('allRightsReserved')}
                                </p>
                                <p className="text-sm opacity-80 mt-1">
                                    {t('ancientWisdom')}
                                </p>
                            </div>

                            <div className="flex items-center space-x-6 rtl:space-x-reverse">
                                <a
                                    href="https://internetcomputer.org"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`${theme === 'dark' ? 'text-amber-300 hover:text-amber-100' : 'text-amber-600 hover:text-amber-800'} transition-colors duration-200 font-medium`}
                                >
                                    🌐 {t('internetComputer')}
                                </a>
                                <div className={`text-2xl hieroglyph-float ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`}>
                                    𓋹
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PharaohFooter;