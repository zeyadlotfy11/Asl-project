import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { BackendService } from '../services/IntegratedBackendService';
import type { Artifact } from '../services/IntegratedBackendService';
import { Link } from 'react-router-dom';

const PharaohArtifactsPage: React.FC = () => {
    const { t, language, isRTL } = useLanguage();
    const { theme } = useTheme();
    const [artifacts, setArtifacts] = useState<Artifact[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const isDarkMode = theme === 'dark';

    const fetchArtifacts = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await BackendService.getAllArtifacts();
            setArtifacts(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "فشل في تحميل الآثار");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArtifacts();
    }, []);

    const getStatusDisplay = (status: any) => {
        const statusMap = {
            'PendingVerification': {
                icon: '⏳',
                color: 'text-yellow-600 dark:text-yellow-400',
                bg: 'bg-yellow-100 dark:bg-yellow-900/30',
                labelEn: 'Pending',
                labelAr: 'قيد المراجعة'
            },
            'Verified': {
                icon: '✅',
                color: 'text-green-600 dark:text-green-400',
                bg: 'bg-green-100 dark:bg-green-900/30',
                labelEn: 'Verified',
                labelAr: 'موثق'
            },
            'Rejected': {
                icon: '❌',
                color: 'text-red-600 dark:text-red-400',
                bg: 'bg-red-100 dark:bg-red-900/30',
                labelEn: 'Rejected',
                labelAr: 'مرفوض'
            },
            'Disputed': {
                icon: '⚠️',
                color: 'text-orange-600 dark:text-orange-400',
                bg: 'bg-orange-100 dark:bg-orange-900/30',
                labelEn: 'Disputed',
                labelAr: 'محل نزاع'
            }
        };
        return statusMap[Object.keys(status)[0] as keyof typeof statusMap] || statusMap['PendingVerification'];
    };

    const formatDate = (timestamp: bigint) => {
        const date = new Date(Number(timestamp) / 1000000);
        return language === 'ar'
            ? date.toLocaleDateString('ar-EG')
            : date.toLocaleDateString('en-US');
    };

    const filteredArtifacts = artifacts.filter(artifact => {
        const matchesSearch = artifact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            artifact.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || Object.keys(artifact.status)[0] === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <>
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes floatHieroglyph {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(2deg); }
                }
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                @keyframes sandfall {
                    0% { transform: translateY(-100px) translateX(0px); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(100vh) translateX(50px); opacity: 0; }
                }
                .artifact-card {
                    animation: fadeInUp 0.6s ease-out;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    background: ${isDarkMode
                    ? 'linear-gradient(135deg, #2d1810 0%, #1a1a2e 50%, #3d2817 100%)'
                    : 'linear-gradient(135deg, #faf5e6 0%, #f5f0dc 50%, #ede4c8 100%)'
                };
                    border: 2px solid ${isDarkMode ? '#d4af37' : '#b8860b'};
                    box-shadow: 0 8px 32px ${isDarkMode ? 'rgba(212, 175, 55, 0.3)' : 'rgba(184, 134, 11, 0.2)'};
                }
                .artifact-card:hover {
                    transform: translateY(-8px) scale(1.02);
                    box-shadow: 0 20px 40px ${isDarkMode ? 'rgba(212, 175, 55, 0.5)' : 'rgba(184, 134, 11, 0.3)'};
                    border-color: ${isDarkMode ? '#ffd700' : '#daa520'};
                }
                .hieroglyph-bg {
                    animation: floatHieroglyph 6s ease-in-out infinite;
                }
                .gold-shimmer {
                    background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.4), transparent);
                    background-size: 200% 100%;
                    animation: shimmer 3s infinite;
                }
                .sand-particle {
                    animation: sandfall 8s linear infinite;
                }
                .pharaoh-title {
                    background: ${isDarkMode
                    ? 'linear-gradient(45deg, #d4af37, #ffd700, #ffed4e, #d4af37)'
                    : 'linear-gradient(45deg, #b8860b, #daa520, #ffd700, #b8860b)'
                };
                    background-size: 300% 300%;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: shimmer 4s ease-in-out infinite;
                }
            `}</style>

            {/* Sand Particles Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute sand-particle w-1 h-1 bg-amber-400 dark:bg-amber-300 rounded-full opacity-60"
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 8}s`,
                            animationDuration: `${8 + Math.random() * 4}s`
                        }}
                    />
                ))}
            </div>

            {/* Floating Hieroglyphs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                {['𓉔', '𓏺', '𓂋', '𓋴', '𓊪', '𓈖', '𓇯', '𓆣'].map((hieroglyph, i) => (
                    <div
                        key={i}
                        className="absolute text-6xl hieroglyph-bg opacity-5 select-none"
                        style={{
                            left: `${10 + (i * 12)}%`,
                            top: `${10 + (i * 8)}%`,
                            animationDelay: `${i * 0.5}s`,
                            color: isDarkMode ? '#d4af37' : '#b8860b'
                        }}
                    >
                        {hieroglyph}
                    </div>
                ))}
            </div>

            <div className={`min-h-screen relative z-10 ${isDarkMode
                ? 'bg-gradient-to-b from-gray-900 via-amber-950 to-gray-900'
                : 'bg-gradient-to-b from-amber-50 via-orange-50 to-amber-50'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <div className="flex justify-center items-center mb-6">
                            <img
                                src="/pharos1.gif"
                                alt="Pharaoh"
                                className="w-24 h-24 object-contain" // 96px x 96px
                            />
                        </div>
                        <h1
                            className={`text-6xl font-bold pharaoh-title font-serif mb-4 ${isRTL ? 'text-right' : 'text-left'
                                }`}
                        >
                            {language === 'ar'
                                ? 'كنوز الحضارة المصرية'
                                : 'Treasures of Egyptian Civilization'}
                        </h1>
                        <p
                            className={`text-xl ${isDarkMode ? 'text-amber-200' : 'text-amber-800'
                                } font-serif max-w-3xl mx-auto`}
                        >
                            {language === 'ar'
                                ? 'اكتشف الآثار المقدسة والكنوز الأثرية من عصر الفراعنة العظماء'
                                : 'Discover sacred artifacts and archaeological treasures from the era of the great pharaohs'}
                        </p>
                    </div>

                    {/* Search and Filter Controls */}
                    <div className="mb-8 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between">
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder={language === 'ar' ? 'ابحث في الآثار...' : 'Search artifacts...'}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={`w-full px-4 py-3 pr-10 rounded-lg border-2 ${isDarkMode
                                        ? 'bg-gray-800 border-amber-600 text-amber-100 placeholder-amber-300'
                                        : 'bg-white border-amber-400 text-amber-900 placeholder-amber-600'
                                        } focus:ring-4 focus:ring-amber-300 focus:border-amber-500 transition-all duration-300`}
                                    dir={isRTL ? 'rtl' : 'ltr'}
                                />
                                <div className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 text-amber-500`}>
                                    🔍
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-2 rtl:space-x-reverse">
                            {['all', 'PendingVerification', 'Verified', 'Rejected', 'Disputed'].map((statusFilter) => (
                                <button
                                    key={statusFilter}
                                    onClick={() => setFilter(statusFilter)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${filter === statusFilter
                                        ? `${isDarkMode ? 'bg-amber-600 text-white' : 'bg-amber-500 text-white'} shadow-lg`
                                        : `${isDarkMode ? 'bg-gray-700 text-amber-200 hover:bg-gray-600' : 'bg-white text-amber-800 hover:bg-amber-50'} border border-amber-300`
                                        }`}
                                >
                                    {language === 'ar'
                                        ? (statusFilter === 'all' ? 'الكل' :
                                            statusFilter === 'PendingVerification' ? 'قيد المراجعة' :
                                                statusFilter === 'Verified' ? 'موثق' :
                                                    statusFilter === 'Rejected' ? 'مرفوض' :
                                                        statusFilter === 'Disputed' ? 'محل نزاع' : statusFilter)
                                        : (statusFilter === 'all' ? 'All' :
                                            statusFilter === 'PendingVerification' ? 'Pending' :
                                                statusFilter)
                                    }
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="text-8xl mb-4 hieroglyph-bg">⏳</div>
                            <div className={`text-xl font-serif ${isDarkMode ? 'text-amber-200' : 'text-amber-800'}`}>
                                {language === 'ar' ? 'جاري استكشاف الكنوز...' : 'Discovering treasures...'}
                            </div>
                            <div className="mt-4 w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full gold-shimmer"></div>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="text-center py-16">
                            <div className="text-8xl mb-4">⚠️</div>
                            <div className={`text-xl ${isDarkMode ? 'text-red-400' : 'text-red-600'} font-serif mb-4`}>
                                {language === 'ar' ? 'حدث خطأ في استكشاف الكنوز' : 'Error discovering treasures'}
                            </div>
                            <p className={`${isDarkMode ? 'text-red-300' : 'text-red-500'}`}>{error}</p>
                            <button
                                onClick={fetchArtifacts}
                                className={`mt-4 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${isDarkMode
                                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                                    : 'bg-amber-500 hover:bg-amber-600 text-white'
                                    } shadow-lg hover:shadow-xl`}
                            >
                                {language === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
                            </button>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && !error && filteredArtifacts.length === 0 && (
                        <div className="text-center py-20">
                            <div className="text-8xl mb-6 hieroglyph-bg">🏛️</div>
                            <h3 className={`text-2xl font-serif mb-4 ${isDarkMode ? 'text-amber-200' : 'text-amber-800'}`}>
                                {language === 'ar' ? 'لم يتم العثور على آثار' : 'No artifacts found'}
                            </h3>
                            <p className={`${isDarkMode ? 'text-amber-300' : 'text-amber-600'}`}>
                                {language === 'ar'
                                    ? 'لا توجد آثار تطابق معايير البحث الحالية'
                                    : 'No artifacts match the current search criteria'
                                }
                            </p>
                        </div>
                    )}

                    {/* Artifacts Grid */}
                    {!loading && !error && filteredArtifacts.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredArtifacts.map((artifact, index) => {
                                const status = getStatusDisplay(artifact.status);
                                return (
                                    <div
                                        key={artifact.id.toString()}
                                        className="artifact-card rounded-xl overflow-hidden group"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        {/* Image Section */}
                                        <div className="relative h-48 overflow-hidden">
                                            {artifact.images && artifact.images.length > 0 ? (
                                                <img
                                                    src={artifact.images[0]}
                                                    alt={artifact.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                                    <div className="text-6xl">🏺</div>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                                            {/* Status Badge */}
                                            <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'}`}>
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.color}`}>
                                                    <span className="mr-1 rtl:mr-0 rtl:ml-1">{status.icon}</span>
                                                    {language === 'ar' ? status.labelAr : status.labelEn}
                                                </span>
                                            </div>

                                            {/* Authenticity Score */}
                                            <div className={`absolute bottom-3 ${isRTL ? 'right-3' : 'left-3'}`}>
                                                <div className="flex items-center space-x-1 rtl:space-x-reverse bg-black/50 rounded-full px-2 py-1">
                                                    <span className="text-yellow-400">⭐</span>
                                                    <span className="text-white text-sm font-medium">
                                                        {(artifact.authenticity_score * 100).toFixed(1)}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="p-6">
                                            <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-amber-100' : 'text-amber-900'} font-serif group-hover:text-amber-400 transition-colors`}>
                                                {artifact.name}
                                            </h3>

                                            <p className={`text-sm mb-4 ${isDarkMode ? 'text-amber-200' : 'text-amber-700'} line-clamp-3`}>
                                                {artifact.description}
                                            </p>

                                            {/* Metadata */}
                                            {artifact.metadata && artifact.metadata.length > 0 && (
                                                <div className="mb-4 space-y-2">
                                                    {artifact.metadata.slice(0, 2).map(([key, value], idx) => (
                                                        <div key={idx} className="flex justify-between items-center text-sm">
                                                            <span className={`font-medium ${isDarkMode ? 'text-amber-300' : 'text-amber-600'}`}>
                                                                {key}:
                                                            </span>
                                                            <span className={`${isDarkMode ? 'text-amber-200' : 'text-amber-800'} truncate ml-2`}>
                                                                {value}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Footer */}
                                            <div className="flex justify-between items-center pt-4 border-t border-amber-300 dark:border-amber-600">
                                                <span className={`text-xs ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                                                    {formatDate(artifact.created_at)}
                                                </span>
                                                <Link to={`/artifacts/${artifact.id}`}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isDarkMode
                                                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                                                        : 'bg-amber-500 hover:bg-amber-600 text-white'
                                                        } shadow-md hover:shadow-lg hover:scale-105`}>
                                                    {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Statistics Footer */}
                    {!loading && !error && artifacts.length > 0 && (
                        <div className={`mt-16 p-8 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm border-2 border-amber-400 dark:border-amber-600`}>
                            <div className="text-center mb-6">
                                <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-amber-100' : 'text-amber-900'} font-serif`}>
                                    {language === 'ar' ? 'إحصائيات المجموعة' : 'Collection Statistics'}
                                </h3>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="text-center">
                                    <div className="text-3xl mb-2">🏺</div>
                                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-amber-200' : 'text-amber-800'}`}>
                                        {artifacts.length}
                                    </div>
                                    <div className={`text-sm ${isDarkMode ? 'text-amber-300' : 'text-amber-600'}`}>
                                        {language === 'ar' ? 'إجمالي الآثار' : 'Total Artifacts'}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl mb-2">✅</div>
                                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                                        {artifacts.filter(a => Object.keys(a.status)[0] === 'Verified').length}
                                    </div>
                                    <div className={`text-sm ${isDarkMode ? 'text-amber-300' : 'text-amber-600'}`}>
                                        {language === 'ar' ? 'موثق' : 'Verified'}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl mb-2">⏳</div>
                                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                                        {artifacts.filter(a => Object.keys(a.status)[0] === 'Pending').length}
                                    </div>
                                    <div className={`text-sm ${isDarkMode ? 'text-amber-300' : 'text-amber-600'}`}>
                                        {language === 'ar' ? 'قيد المراجعة' : 'Pending'}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl mb-2">⭐</div>
                                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-amber-200' : 'text-amber-800'}`}>
                                        {artifacts.length > 0 ?
                                            ((artifacts.reduce((sum, a) => sum + a.authenticity_score, 0) / artifacts.length) * 100).toFixed(1) + '%'
                                            : '0%'
                                        }
                                    </div>
                                    <div className={`text-sm ${isDarkMode ? 'text-amber-300' : 'text-amber-600'}`}>
                                        {language === 'ar' ? 'متوسط الموثوقية' : 'Avg. Authenticity'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default PharaohArtifactsPage;
