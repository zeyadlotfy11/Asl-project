import React from 'react';
import { Artifact, AIAnalysisResult } from '../services/IntegratedBackendService';
import toast from 'react-hot-toast';

interface AIAnalysisModalProps {
    isOpen: boolean;
    onClose: () => void;
    artifact: Artifact | null;
    analysisResult: AIAnalysisResult | null;
}

const AIAnalysisModal: React.FC<AIAnalysisModalProps> = ({
    isOpen,
    onClose,
    artifact,
    analysisResult
}) => {
    if (!isOpen || !artifact || !analysisResult) return null;

    const getRiskLevelColor = (riskLevel: any): string => {
        if (!riskLevel || typeof riskLevel !== 'object') return 'text-gray-500';
        const level = Object.keys(riskLevel)[0];
        switch (level) {
            case 'VeryLow': return 'text-green-600';
            case 'Low': return 'text-green-500';
            case 'Medium': return 'text-yellow-500';
            case 'High': return 'text-orange-500';
            case 'Critical': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };

    const getRiskLevelText = (riskLevel: any): string => {
        if (!riskLevel || typeof riskLevel !== 'object') return 'Unknown';
        return Object.keys(riskLevel)[0] || 'Unknown';
    };

    const copyResultsToClipboard = () => {
        const analysisText = `
AI Analysis Results for ${artifact.name}
========================================

Confidence Score: ${(analysisResult.confidence_score * 100).toFixed(1)}%
Analysis Type: ${analysisResult.analysis_type}
Artifact ID: ${analysisResult.artifact_id}

Findings:
${analysisResult.findings?.map(finding => `- ${finding}`).join('\n') || 'No findings available'}

Recommendations:
${analysisResult.recommendations?.map(rec => `- ${rec}`).join('\n') || 'No recommendations available'}

Analysis Date: ${new Date(Number(analysisResult.timestamp)).toLocaleString()}
        `.trim();

        navigator.clipboard.writeText(analysisText).then(() => {
            toast.success('Analysis results copied to clipboard!');
        }).catch(() => {
            toast.error('Failed to copy to clipboard');
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100 flex items-center">
                            🔍 AI Analysis Results
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Artifact Info */}
                    <div className="mb-6 p-4 bg-amber-50 dark:bg-gray-700 rounded-lg">
                        <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                            📿 Analyzing: {artifact.name}
                        </h3>
                        <p className="text-amber-700 dark:text-amber-300 text-sm">
                            {artifact.description}
                        </p>
                        <div className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                            Artifact ID: {artifact.id.toString()}
                        </div>
                    </div>

                    {/* Analysis Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg border border-blue-200 dark:border-blue-700">
                            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                {(analysisResult.confidence_score * 100).toFixed(1)}%
                            </div>
                            <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                                🎯 Confidence Score
                            </div>
                            <div className="w-full bg-blue-200 dark:bg-blue-700 rounded-full h-2 mt-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${analysisResult.confidence_score * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg border border-green-200 dark:border-green-700">
                            <div className="text-lg font-bold text-green-900 dark:text-green-100">
                                {analysisResult.analysis_type}
                            </div>
                            <div className="text-green-600 dark:text-green-400 text-sm font-medium">
                                🔍 Analysis Type
                            </div>
                        </div>
                    </div>

                    {/* Findings */}
                    {analysisResult.findings && analysisResult.findings.length > 0 && (
                        <div className="mb-6">
                            <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-3 flex items-center">
                                🔍 AI Findings
                            </h4>
                            <div className="space-y-3">
                                {analysisResult.findings.map((finding, index) => (
                                    <div key={index} className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900 rounded-lg border border-yellow-200 dark:border-yellow-700">
                                        <div className="flex items-start">
                                            <span className="text-yellow-600 mr-3 text-lg">💡</span>
                                            <span className="text-yellow-800 dark:text-yellow-200 font-medium">
                                                {finding}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recommendations */}
                    {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
                        <div className="mb-6">
                            <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-3 flex items-center">
                                ✅ AI Recommendations
                            </h4>
                            <div className="space-y-3">
                                {analysisResult.recommendations.map((recommendation, index) => (
                                    <div key={index} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 rounded-lg border border-green-200 dark:border-green-700">
                                        <div className="flex items-start">
                                            <span className="text-green-600 mr-3 text-lg">📋</span>
                                            <span className="text-green-800 dark:text-green-200 font-medium">
                                                {recommendation}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Analysis Metadata */}
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center">
                                <span className="mr-2">📅</span>
                                <span>
                                    Analysis Date: {new Date(Number(analysisResult.timestamp)).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <span className="mr-2">🆔</span>
                                <span>
                                    Artifact ID: {analysisResult.artifact_id.toString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex gap-3 flex-wrap">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                        >
                            Close
                        </button>
                        <button
                            onClick={copyResultsToClipboard}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                        >
                            📋 Copy Results
                        </button>
                        <button
                            onClick={() => toast.success('Export functionality coming soon!')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                        >
                            📄 Export Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIAnalysisModal;
