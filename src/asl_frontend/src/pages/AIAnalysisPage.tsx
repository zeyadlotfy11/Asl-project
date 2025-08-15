import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BackendService } from '../services/IntegratedBackendService';
import type { Artifact, AIAnalysisResult } from '../services/IntegratedBackendService';
import AIAnalysisModal from '../components/AIAnalysisModal';
import toast from 'react-hot-toast';

const AIAnalysisPage: React.FC = () => {
    const { isAuthenticated, principal } = useAuth();
    const [artifacts, setArtifacts] = useState<Artifact[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [analyzing, setAnalyzing] = useState<string | null>(null);

    useEffect(() => {
        loadArtifacts();
    }, []);

    const loadArtifacts = async () => {
        setLoading(true);
        try {
            const allArtifacts = await BackendService.getAllArtifacts();
            setArtifacts(allArtifacts || []);
        } catch (error) {
            console.error('Failed to load artifacts:', error);
            toast.error('Failed to load artifacts');
        } finally {
            setLoading(false);
        }
    };

    const handleAnalyzeArtifact = async (artifact: Artifact) => {
        setAnalyzing(artifact.id.toString());
        try {
            // First try to get existing analysis
            let analysis = await BackendService.getAIAnalysis(artifact.id);

            // If no existing analysis, perform new analysis
            if (!analysis) {
                toast.loading('Performing AI analysis... This may take a moment.');
                analysis = await BackendService.analyzeArtifactWithAI(artifact.id);
            }

            if (analysis) {
                setSelectedArtifact(artifact);
                setAnalysisResult(analysis);
                setShowModal(true);
                toast.success('AI analysis completed!');
            } else {
                toast.error('AI analysis failed. Please try again.');
            }
        } catch (error) {
            console.error('AI Analysis error:', error);
            toast.error('Failed to perform AI analysis');
        } finally {
            setAnalyzing(null);
        }
    };

    const getStatusColor = (status: any): string => {
        if (!status || typeof status !== 'object') return 'bg-gray-100 text-gray-800';
        const statusKey = Object.keys(status)[0];
        switch (statusKey) {
            case 'Verified': return 'bg-green-100 text-green-800';
            case 'PendingVerification': return 'bg-yellow-100 text-yellow-800';
            case 'Disputed': return 'bg-red-100 text-red-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: any): string => {
        if (!status || typeof status !== 'object') return 'Unknown';
        return Object.keys(status)[0] || 'Unknown';
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
                <div className="text-center space-y-6">
                    <div className="text-6xl">🤖</div>
                    <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                        Authentication Required
                    </h2>
                    <p className="text-purple-700 dark:text-purple-300">
                        Please connect your Internet Identity to access AI Analysis
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-purple-900 dark:text-purple-100 mb-4">
                        🤖 AI-Powered Heritage Analysis
                    </h1>
                    <p className="text-purple-700 dark:text-purple-300 text-lg">
                        Leverage advanced AI technology to analyze and authenticate heritage artifacts
                    </p>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-purple-200/50 dark:border-purple-800/50">
                        <div className="text-3xl mb-3">🔍</div>
                        <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                            Artifact Analysis
                        </h3>
                        <p className="text-purple-700 dark:text-purple-300 text-sm">
                            Get detailed AI insights about artifact authenticity, materials, and cultural origins
                        </p>
                    </div>
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-purple-200/50 dark:border-purple-800/50">
                        <div className="text-3xl mb-3">📊</div>
                        <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                            Confidence Scoring
                        </h3>
                        <p className="text-purple-700 dark:text-purple-300 text-sm">
                            Receive confidence scores and detailed recommendations for further research
                        </p>
                    </div>
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-purple-200/50 dark:border-purple-800/50">
                        <div className="text-3xl mb-3">⚡</div>
                        <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                            Instant Results
                        </h3>
                        <p className="text-purple-700 dark:text-purple-300 text-sm">
                            Get immediate AI analysis results with detailed findings and actionable insights
                        </p>
                    </div>
                </div>

                {/* Artifacts Grid */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-200/50 dark:border-purple-800/50">
                    <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-6">
                        Available Artifacts for Analysis
                    </h2>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, index) => (
                                <div key={index} className="animate-pulse">
                                    <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-48 mb-4"></div>
                                    <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 mb-2"></div>
                                    <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 w-3/4"></div>
                                </div>
                            ))}
                        </div>
                    ) : artifacts.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📦</div>
                            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-2">
                                No Artifacts Available
                            </h3>
                            <p className="text-purple-700 dark:text-purple-300">
                                No artifacts are currently available for AI analysis
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {artifacts.map((artifact) => (
                                <div key={artifact.id.toString()} className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4 border border-purple-200 dark:border-purple-700 hover:shadow-lg transition-all duration-300">
                                    <div className="mb-4">
                                        <div className="w-full h-40 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-lg flex items-center justify-center">
                                            <span className="text-4xl">🏺</span>
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-purple-900 dark:text-purple-100 mb-2 truncate">
                                        {artifact.name}
                                    </h3>

                                    <p className="text-purple-700 dark:text-purple-300 text-sm mb-3 line-clamp-2">
                                        {artifact.description}
                                    </p>

                                    <div className="flex items-center justify-between mb-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(artifact.status)}`}>
                                            {getStatusText(artifact.status)}
                                        </span>
                                        <span className="text-purple-600 dark:text-purple-400 text-xs">
                                            ID: {artifact.id.toString()}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => handleAnalyzeArtifact(artifact)}
                                        disabled={analyzing === artifact.id.toString()}
                                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {analyzing === artifact.id.toString() ? (
                                            <span className="flex items-center justify-center">
                                                <span className="animate-spin mr-2">🔄</span>
                                                Analyzing...
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center">
                                                🤖 Analyze with AI
                                            </span>
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Statistics */}
                <div className="mt-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-200/50 dark:border-purple-800/50">
                    <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-4">
                        📊 Analysis Statistics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {artifacts.length}
                            </div>
                            <div className="text-purple-700 dark:text-purple-300 text-sm">
                                Total Artifacts
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {artifacts.filter(a => getStatusText(a.status) === 'Verified').length}
                            </div>
                            <div className="text-purple-700 dark:text-purple-300 text-sm">
                                Verified
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                {artifacts.filter(a => getStatusText(a.status) === 'PendingVerification').length}
                            </div>
                            <div className="text-purple-700 dark:text-purple-300 text-sm">
                                Pending
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                100%
                            </div>
                            <div className="text-purple-700 dark:text-purple-300 text-sm">
                                AI Ready
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Analysis Modal */}
            <AIAnalysisModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                artifact={selectedArtifact}
                analysisResult={analysisResult}
            />
        </div>
    );
};

export default AIAnalysisPage;
