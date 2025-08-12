import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { BackendService } from '../services/IntegratedBackendService';
import { updateArtifactStatusWithFreshAgent, voteOnArtifactWithFreshAgent } from '../services/FreshAgentService';
import type { Artifact, ArtifactStatus, HistoryEntry } from '../services/IntegratedBackendService';
import { ArrowLeft, Heart, HeartHandshake, Eye, Calendar, User, Map, Clock, AlertTriangle, CheckCircle, XCircle, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const PharaohArtifactDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t, language, isRTL } = useLanguage();
    const { theme } = useTheme();
    const { isAuthenticated, principal } = useAuth();
    const [artifact, setArtifact] = useState<Artifact | null>(null);
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [voting, setVoting] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    const [userVote, setUserVote] = useState<boolean | null>(null);
    const isDarkMode = theme === 'dark';

    useEffect(() => {
        if (id) {
            fetchArtifactDetails();
        }
    }, [id]);

    const fetchArtifactDetails = async () => {
        try {
            setLoading(true);
            const artifactId = BigInt(id!);

            const [artifactData, historyData] = await Promise.all([
                BackendService.getArtifact(artifactId),
                BackendService.getArtifactHistory(artifactId)
            ]);

            if (artifactData) {
                setArtifact(artifactData);
                setHistory(historyData);
            } else {
                toast.error(language === 'ar' ? 'لم يتم العثور على الأثر' : 'Artifact not found');
                navigate('/artifacts');
            }
        } catch (error) {
            console.error('Error fetching artifact details:', error);
            toast.error(language === 'ar' ? 'خطأ في تحميل تفاصيل الأثر' : 'Error loading artifact details');
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (support: boolean) => {
        if (!isAuthenticated || !artifact) {
            toast.error(language === 'ar' ? 'يجب تسجيل الدخول للتصويت' : 'Please login to vote');
            return;
        }

        try {
            setVoting(true);
            await voteOnArtifactWithFreshAgent(artifact.id, support);
            setUserVote(support);
            toast.success(
                language === 'ar'
                    ? `تم التصويت ${support ? 'بالموافقة' : 'بالرفض'} بنجاح`
                    : `Vote ${support ? 'for approval' : 'for rejection'} submitted successfully`
            );
            await fetchArtifactDetails(); // Refresh data
        } catch (error) {
            console.error('Error voting:', error);
            toast.error(language === 'ar' ? 'خطأ في التصويت' : 'Error submitting vote');
        } finally {
            setVoting(false);
        }
    };

    const handleStatusUpdate = async (newStatus: ArtifactStatus) => {
        if (!isAuthenticated || !artifact) return;

        try {
            setUpdatingStatus(true);
            await updateArtifactStatusWithFreshAgent(artifact.id, newStatus);
            toast.success(language === 'ar' ? 'تم تحديث حالة الأثر' : 'Artifact status updated');
            await fetchArtifactDetails(); // Refresh data
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error(language === 'ar' ? 'خطأ في تحديث الحالة' : 'Error updating status');
        } finally {
            setUpdatingStatus(false);
        }
    }; const getStatusDisplay = (status: ArtifactStatus) => {
        const statusKey = Object.keys(status)[0];
        const statusMap = {
            'PendingVerification': {
                icon: Clock,
                color: 'text-yellow-600 dark:text-yellow-400',
                bg: 'bg-yellow-100 dark:bg-yellow-900/30',
                labelEn: 'Pending Review',
                labelAr: 'قيد المراجعة'
            },
            'Verified': {
                icon: CheckCircle,
                color: 'text-green-600 dark:text-green-400',
                bg: 'bg-green-100 dark:bg-green-900/30',
                labelEn: 'Verified',
                labelAr: 'موثق'
            },
            'Rejected': {
                icon: XCircle,
                color: 'text-red-600 dark:text-red-400',
                bg: 'bg-red-100 dark:bg-red-900/30',
                labelEn: 'Rejected',
                labelAr: 'مرفوض'
            },
            'Disputed': {
                icon: AlertTriangle,
                color: 'text-orange-600 dark:text-orange-400',
                bg: 'bg-orange-100 dark:bg-orange-900/30',
                labelEn: 'Disputed',
                labelAr: 'محل نزاع'
            }
        };
        return statusMap[statusKey as keyof typeof statusMap] || statusMap['PendingVerification'];
    };

    const formatDate = (timestamp: bigint) => {
        const date = new Date(Number(timestamp) / 1000000);
        return language === 'ar'
            ? date.toLocaleDateString('ar-EG')
            : date.toLocaleDateString('en-US');
    };

    const canUpdateStatus = () => {
        // Add logic for who can update status (admins, experts, etc.)
        return isAuthenticated && principal == "tppuu-qc5yq-lludd-4ljje-nbq3o-vlppy-zga23-u5psn-lxijt-wpeyg-vae";
    };

    if (loading) {
        return (
            <>
                <style>{`
                    @keyframes shimmerGold {
                        0% { background-position: -200% 0; }
                        100% { background-position: 200% 0; }
                    }
                    @keyframes floatHieroglyph {
                        0%, 100% { transform: translateY(0px) rotate(0deg); }
                        50% { transform: translateY(-8px) rotate(2deg); }
                    }
                    .gold-shimmer {
                        background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.4), transparent);
                        background-size: 200% 100%;
                        animation: shimmerGold 3s infinite;
                    }
                    .hieroglyph-float {
                        animation: floatHieroglyph 6s ease-in-out infinite;
                    }
                `}</style>
                <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-amber-50'}`}>
                    <div className="text-center">
                        <div className="text-8xl mb-6 hieroglyph-float">🏺</div>
                        <div className={`text-xl font-serif mb-4 ${isDarkMode ? 'text-amber-200' : 'text-amber-800'}`}>
                            {language === 'ar' ? 'جاري استكشاف كنوز الأثر...' : 'Discovering artifact treasures...'}
                        </div>
                        <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full gold-shimmer"></div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (!artifact) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-amber-50'}`}>
                <div className="text-center">
                    <div className="text-8xl mb-6">❓</div>
                    <h2 className={`text-2xl font-serif mb-4 ${isDarkMode ? 'text-amber-200' : 'text-amber-800'}`}>
                        {language === 'ar' ? 'الأثر غير موجود' : 'Artifact Not Found'}
                    </h2>
                    <Link
                        to="/artifacts"
                        className={`inline-flex items-center px-6 py-3 rounded-lg ${isDarkMode ? 'bg-amber-600 hover:bg-amber-700' : 'bg-amber-500 hover:bg-amber-600'} text-white font-medium transition-colors`}
                    >
                        <ArrowLeft className={`w-5 h-5 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
                        {language === 'ar' ? 'العودة إلى الآثار' : 'Back to Artifacts'}
                    </Link>
                </div>
            </div>
        );
    }

    const status = getStatusDisplay(artifact.status);

    return (
        <>
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes floatHieroglyph {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-8px) rotate(2deg); }
                }
                @keyframes pulseGlow {
                    0%, 100% { box-shadow: 0 0 20px rgba(212, 175, 55, 0.4); }
                    50% { box-shadow: 0 0 40px rgba(212, 175, 55, 0.8); }
                }
                .artifact-container {
                    background: ${isDarkMode
                    ? 'linear-gradient(135deg, #1a1a2e 0%, #2c1810 50%, #1a1a2e 100%)'
                    : 'linear-gradient(135deg, #faf5e6 0%, #f5f0dc 50%, #faf5e6 100%)'
                };
                }
                .fade-in-up {
                    animation: fadeInUp 0.6s ease-out;
                }
                .hieroglyph-float {
                    animation: floatHieroglyph 6s ease-in-out infinite;
                }
                .vote-button {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .vote-button:hover {
                    transform: translateY(-2px);
                    animation: pulseGlow 2s infinite;
                }
                .image-gallery {
                    scroll-behavior: smooth;
                }
            `}</style>

            <div className="artifact-container min-h-screen relative overflow-hidden">
                {/* Floating Hieroglyphs Background */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {['𓉔', '𓏺', '𓂋', '𓋴', '𓊪', '𓈖'].map((hieroglyph, i) => (
                        <div
                            key={i}
                            className="absolute text-6xl hieroglyph-float opacity-5 select-none"
                            style={{
                                left: `${10 + (i * 15)}%`,
                                top: `${10 + (i % 3) * 30}%`,
                                animationDelay: `${i * 0.8}s`,
                                color: isDarkMode ? '#d4af37' : '#b8860b'
                            }}
                        >
                            {hieroglyph}
                        </div>
                    ))}
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header with Back Button */}
                    <div className="mb-8 fade-in-up">
                        <Link
                            to="/artifacts"
                            className={`inline-flex items-center px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-amber-200' : 'bg-white hover:bg-amber-50 text-amber-800'} shadow-lg transition-all duration-300 hover:scale-105`}
                        >
                            <ArrowLeft className={`w-5 h-5 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
                            {language === 'ar' ? 'العودة إلى الآثار' : 'Back to Artifacts'}
                        </Link>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left Column - Images */}
                        <div className="fade-in-up" style={{ animationDelay: '0.2s' }}>
                            {/* Main Image */}
                            <div className={`rounded-2xl overflow-hidden shadow-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} mb-6`}>
                                {artifact.images && artifact.images.length > 0 ? (
                                    <img
                                        src={artifact.images[selectedImage]}
                                        alt={artifact.name}
                                        className="w-full h-96 object-cover"
                                    />
                                ) : (
                                    <div className={`w-full h-96 flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                        <div className="text-8xl">🏺</div>
                                    </div>
                                )}
                            </div>

                            {/* Image Thumbnails */}
                            {artifact.images && artifact.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-3">
                                    {artifact.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`rounded-lg overflow-hidden transition-all duration-300 ${selectedImage === index
                                                ? 'ring-4 ring-amber-500 scale-105'
                                                : 'opacity-70 hover:opacity-100 hover:scale-105'
                                                }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${artifact.name} ${index + 1}`}
                                                className="w-full h-20 object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right Column - Details */}
                        <div className="fade-in-up" style={{ animationDelay: '0.4s' }}>
                            {/* Title and Status */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h1 className={`text-4xl font-bold font-serif ${isDarkMode ? 'text-amber-100' : 'text-amber-900'}`}>
                                        {artifact.name}
                                    </h1>
                                    <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${status.bg}`}>
                                        <status.icon className={`w-5 h-5 ${status.color}`} />
                                        <span className={`font-medium ${status.color}`}>
                                            {language === 'ar' ? status.labelAr : status.labelEn}
                                        </span>
                                    </div>
                                </div>

                                {/* Authenticity Score */}
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="flex items-center space-x-2">
                                        <Star className="w-6 h-6 text-yellow-500" />
                                        <span className={`text-lg font-semibold ${isDarkMode ? 'text-amber-200' : 'text-amber-700'}`}>
                                            {(artifact.authenticity_score * 100).toFixed(1)}%
                                        </span>
                                        <span className={`text-sm ${isDarkMode ? 'text-amber-300' : 'text-amber-600'}`}>
                                            {language === 'ar' ? 'موثوقية' : 'Authenticity'}
                                        </span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-amber-200' : 'text-amber-700'} mb-6`}>
                                    {artifact.description}
                                </p>
                            </div>

                            {/* Metadata */}
                            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm border-2 border-amber-400 mb-8`}>
                                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-amber-100' : 'text-amber-800'} font-serif mb-4`}>
                                    {language === 'ar' ? 'تفاصيل الأثر' : 'Artifact Details'}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-3">
                                        <Calendar className={`w-5 h-5 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                                        <div>
                                            <div className={`text-sm ${isDarkMode ? 'text-amber-300' : 'text-amber-600'}`}>
                                                {language === 'ar' ? 'تاريخ الإنشاء' : 'Created'}
                                            </div>
                                            <div className={`font-medium ${isDarkMode ? 'text-amber-200' : 'text-amber-800'}`}>
                                                {formatDate(artifact.created_at)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <User className={`w-5 h-5 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                                        <div>
                                            <div className={`text-sm ${isDarkMode ? 'text-amber-300' : 'text-amber-600'}`}>
                                                {language === 'ar' ? 'المُنشئ' : 'Creator'}
                                            </div>
                                            <div className={`font-medium ${isDarkMode ? 'text-amber-200' : 'text-amber-800'} font-mono text-sm`}>
                                                {artifact.creator.toText().slice(0, 20)}...
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Metadata */}
                                {artifact.metadata && artifact.metadata.length > 0 && (
                                    <div className="mt-6 space-y-3">
                                        {artifact.metadata.map(([key, value], index) => (
                                            <div key={index} className="flex justify-between items-center">
                                                <span className={`font-medium ${isDarkMode ? 'text-amber-300' : 'text-amber-600'}`}>
                                                    {key}:
                                                </span>
                                                <span className={`${isDarkMode ? 'text-amber-200' : 'text-amber-800'}`}>
                                                    {value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="space-y-6">
                                {/* Voting Section */}
                                {isAuthenticated && (
                                    <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm border-2 border-amber-400`}>
                                        <h3 className={`text-lg font-bold ${isDarkMode ? 'text-amber-100' : 'text-amber-800'} font-serif mb-4`}>
                                            {language === 'ar' ? 'التصويت على الأثر' : 'Vote on Artifact'}
                                        </h3>
                                        <div className="flex space-x-4">
                                            <button
                                                onClick={() => handleVote(true)}
                                                disabled={voting}
                                                className={`vote-button flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${userVote === true
                                                    ? 'bg-green-600 text-white'
                                                    : isDarkMode
                                                        ? 'bg-green-700 hover:bg-green-600 text-white'
                                                        : 'bg-green-500 hover:bg-green-600 text-white'
                                                    } disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl`}
                                            >
                                                <HeartHandshake className="w-5 h-5" />
                                                <span>{language === 'ar' ? 'موافق' : 'Approve'}</span>
                                            </button>
                                            <button
                                                onClick={() => handleVote(false)}
                                                disabled={voting}
                                                className={`vote-button flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${userVote === false
                                                    ? 'bg-red-600 text-white'
                                                    : isDarkMode
                                                        ? 'bg-red-700 hover:bg-red-600 text-white'
                                                        : 'bg-red-500 hover:bg-red-600 text-white'
                                                    } disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl`}
                                            >
                                                <AlertTriangle className="w-5 h-5" />
                                                <span>{language === 'ar' ? 'رفض' : 'Reject'}</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Status Management for Admins */}
                                {canUpdateStatus() && (
                                    <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm border-2 border-amber-400`}>
                                        <h3 className={`text-lg font-bold ${isDarkMode ? 'text-amber-100' : 'text-amber-800'} font-serif mb-4`}>
                                            {language === 'ar' ? 'إدارة الحالة' : 'Status Management'}
                                        </h3>
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={() => handleStatusUpdate(BackendService.createArtifactStatus("PendingVerification"))}
                                                disabled={updatingStatus}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isDarkMode
                                                    ? 'bg-yellow-700 hover:bg-yellow-600 text-white'
                                                    : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                                    } disabled:opacity-50 shadow-md hover:shadow-lg`}
                                            >
                                                {language === 'ar' ? 'قيد المراجعة' : 'Pending'}
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(BackendService.createArtifactStatus("Verified"))}
                                                disabled={updatingStatus}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isDarkMode
                                                    ? 'bg-green-700 hover:bg-green-600 text-white'
                                                    : 'bg-green-500 hover:bg-green-600 text-white'
                                                    } disabled:opacity-50 shadow-md hover:shadow-lg`}
                                            >
                                                {language === 'ar' ? 'موثق' : 'Verified'}
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(BackendService.createArtifactStatus("Rejected"))}
                                                disabled={updatingStatus}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isDarkMode
                                                    ? 'bg-red-700 hover:bg-red-600 text-white'
                                                    : 'bg-red-500 hover:bg-red-600 text-white'
                                                    } disabled:opacity-50 shadow-md hover:shadow-lg`}
                                            >
                                                {language === 'ar' ? 'مرفوض' : 'Rejected'}
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(BackendService.createArtifactStatus("Disputed"))}
                                                disabled={updatingStatus}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isDarkMode
                                                    ? 'bg-orange-700 hover:bg-orange-600 text-white'
                                                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                                                    } disabled:opacity-50 shadow-md hover:shadow-lg`}
                                            >
                                                {language === 'ar' ? 'محل نزاع' : 'Disputed'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* History Section */}
                    {history.length > 0 && (
                        <div className="mt-12 fade-in-up" style={{ animationDelay: '0.6s' }}>
                            <div className={`p-8 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm border-2 border-amber-400`}>
                                <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-amber-100' : 'text-amber-800'} font-serif mb-6 flex items-center`}>
                                    <Clock className={`w-6 h-6 mr-3 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                                    {language === 'ar' ? 'تاريخ الأثر' : 'Artifact History'}
                                </h3>
                                <div className="space-y-4">
                                    {history.map((entry, index) => (
                                        <div
                                            key={index}
                                            className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-amber-50/50'} border-l-4 border-amber-500`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className={`font-medium ${isDarkMode ? 'text-amber-200' : 'text-amber-800'}`}>
                                                        {entry.action}
                                                    </div>
                                                    <div className={`text-sm ${isDarkMode ? 'text-amber-300' : 'text-amber-600'} mt-1`}>
                                                        {entry.details}
                                                    </div>
                                                </div>
                                                <div className={`text-sm ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>
                                                    {formatDate(entry.timestamp)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default PharaohArtifactDetailsPage;
