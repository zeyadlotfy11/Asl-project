import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BackendService, Artifact, ProposalResponse, HeritageNFT } from '../services/IntegratedBackendService';

const ServicesPage: React.FC = () => {
    const { t, isRTL } = useLanguage();
    const { isAuthenticated, principal } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('artifacts');
    const [artifacts, setArtifacts] = useState<Artifact[]>([]);
    const [proposals, setProposals] = useState<ProposalResponse[]>([]);
    const [nfts, setNFTs] = useState<HeritageNFT[]>([]);
    const [loading, setLoading] = useState(false);

    const services = [
        {
            id: 'artifacts',
            name: 'Artifacts Registry',
            icon: '🏺',
            description: 'Immutable artifact documentation and verification',
            color: 'from-amber-500 to-orange-600'
        },
        {
            id: 'proposals',
            name: 'DAO Governance',
            icon: '🏛️',
            description: 'Community-driven decision making and voting',
            color: 'from-blue-500 to-indigo-600'
        },
        {
            id: 'nfts',
            name: 'Heritage NFTs',
            icon: '🎭',
            description: 'Proof-of-heritage digital certificates',
            color: 'from-purple-500 to-pink-600'
        },
        {
            id: 'ai',
            name: 'AI Analysis',
            icon: '🔍',
            description: 'Advanced artifact analysis and authentication',
            color: 'from-green-500 to-teal-600'
        }
    ];

    useEffect(() => {
        if (isAuthenticated) {
            loadData();
        }
    }, [isAuthenticated, activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            switch (activeTab) {
                case 'artifacts':
                    const artifactData = await BackendService.getAllArtifacts();
                    setArtifacts(artifactData);
                    break;
                case 'proposals':
                    const proposalData = await BackendService.getAllProposals();
                    setProposals(proposalData);
                    break;
                case 'nfts':
                    if (principal) {
                        const nftData = await BackendService.getNFTsByOwner(principal);
                        setNFTs(nftData);
                    }
                    break;
            }
        } catch (error) {
            console.error('Failed to load data:', error);
            alert('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const renderArtifacts = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100">
                    📚 Artifact Registry
                </h3>
                <span className="text-sm text-amber-600 dark:text-amber-400">
                    {artifacts.length} artifacts preserved
                </span>
            </div>

            {artifacts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {artifacts.map((artifact) => (
                        <div key={artifact.id.toString()} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-amber-200 dark:border-amber-700">
                            <div className="flex items-start justify-between mb-4">
                                <h4 className="font-bold text-amber-900 dark:text-amber-100 truncate">
                                    {artifact.name}
                                </h4>
                                <span className={`px-2 py-1 rounded-full text-xs ${(artifact.status as any) === 'Verified' ||
                                    (typeof artifact.status === 'object' && artifact.status && 'Verified' in artifact.status)
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {typeof artifact.status === 'string' ? artifact.status : 'Unknown'}
                                </span>
                            </div>
                            <p className="text-sm text-amber-800 dark:text-amber-200 mb-4 line-clamp-3">
                                {artifact.description}
                            </p>
                            <div className="flex items-center justify-between text-xs text-amber-600 dark:text-amber-400">
                                <span>⭐ {artifact.authenticity_score}/100</span>
                                <span>Artifact</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏺</div>
                    <p className="text-amber-800 dark:text-amber-200">No artifacts found</p>
                </div>
            )}
        </div>
    );

    const renderProposals = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100">
                    🏛️ DAO Proposals
                </h3>
                <span className="text-sm text-amber-600 dark:text-amber-400">
                    {proposals.length} proposals
                </span>
            </div>

            {proposals.length > 0 ? (
                <div className="space-y-4">
                    {proposals.map((proposal) => (
                        <div key={proposal.id.toString()} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-blue-200 dark:border-blue-700">
                            <div className="flex items-start justify-between mb-4">
                                <h4 className="font-bold text-blue-900 dark:text-blue-100">
                                    {proposal.title}
                                </h4>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${(proposal.status as any) === 'Active' ||
                                    (typeof proposal.status === 'object' && proposal.status && 'Active' in proposal.status)
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {typeof proposal.status === 'string' ? proposal.status : 'Unknown'}
                                </span>
                            </div>
                            <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
                                {proposal.description}
                            </p>
                            <div className="flex items-center justify-between">
                                <div className="flex space-x-4 text-xs text-blue-600 dark:text-blue-400">
                                    <span>👍 {proposal.votes_for.toString()}</span>
                                    <span>👎 {proposal.votes_against.toString()}</span>
                                </div>
                                <span className="text-xs text-blue-600 dark:text-blue-400">
                                    {typeof proposal.proposal_type === 'string' ? proposal.proposal_type : 'Unknown'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏛️</div>
                    <p className="text-amber-800 dark:text-amber-200">No proposals found</p>
                </div>
            )}
        </div>
    );

    const renderNFTs = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100">
                    🎭 Heritage NFTs
                </h3>
                <span className="text-sm text-amber-600 dark:text-amber-400">
                    {nfts.length} NFTs owned
                </span>
            </div>

            {nfts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {nfts.map((nft) => (
                        <div key={nft.id.toString()} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-purple-200 dark:border-purple-700">
                            <div className="text-center mb-4">
                                <div className="text-4xl mb-2">🎭</div>
                                <h4 className="font-bold text-purple-900 dark:text-purple-100">
                                    Heritage NFT #{nft.id.toString()}
                                </h4>
                            </div>
                            <div className="space-y-2 text-xs text-purple-800 dark:text-purple-200">
                                <div className="flex justify-between">
                                    <span>Artifact ID:</span>
                                    <span>#{nft.artifact_id.toString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Transferable:</span>
                                    <span>{(nft as any).is_transferable ? '✅' : '❌'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Provenance:</span>
                                    <span>{(nft as any).provenance_verified ? '✅' : '❌'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Endorsements:</span>
                                    <span>{(nft as any).expert_endorsements?.length || 0}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎭</div>
                    <p className="text-amber-800 dark:text-amber-200">No NFTs found</p>
                </div>
            )}
        </div>
    );

    const renderAIAnalysis = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100">
                🔍 AI Analysis Services
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-green-200 dark:border-green-700">
                    <div className="text-center">
                        <div className="text-4xl mb-4">🤖</div>
                        <h4 className="font-bold text-green-900 dark:text-green-100 mb-2">
                            Artifact Authentication
                        </h4>
                        <p className="text-sm text-green-800 dark:text-green-200 mb-4">
                            Advanced AI analysis for authenticity verification using machine learning models trained on Egyptian artifacts.
                        </p>
                        <div className="text-xs text-green-600 dark:text-green-400">
                            Coming Soon
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-teal-200 dark:border-teal-700">
                    <div className="text-center">
                        <div className="text-4xl mb-4">🔍</div>
                        <h4 className="font-bold text-teal-900 dark:text-teal-100 mb-2">
                            Similarity Analysis
                        </h4>
                        <p className="text-sm text-teal-800 dark:text-teal-200 mb-4">
                            Find similar artifacts and connections within the heritage database using AI-powered pattern recognition.
                        </p>
                        <div className="text-xs text-teal-600 dark:text-teal-400">
                            Coming Soon
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Pharaoh Header */}
            <div className="text-center mb-12">
                <div className="text-6xl mb-4">⚱️</div>
                <h1 className="text-4xl font-bold text-amber-900 dark:text-amber-100 font-serif mb-4">
                    Royal Services of the Digital Dynasty
                </h1>
                <p className="text-xl text-amber-800 dark:text-amber-200 max-w-3xl mx-auto mb-8">
                    Explore the powerful services that preserve Egyptian heritage for eternity on the blockchain
                </p>

                {/* Creation Actions */}
                {isAuthenticated && (
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/create-artifact')}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-300 font-semibold shadow-lg"
                        >
                            🏺 Submit New Artifact
                        </button>
                        <button
                            onClick={() => navigate('/create-proposal')}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg"
                        >
                            🏛️ Create Proposal
                        </button>
                    </div>
                )}
            </div>

            {/* Service Navigation */}
            <div className="mb-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {services.map((service) => (
                        <button
                            key={service.id}
                            onClick={() => setActiveTab(service.id)}
                            className={`relative overflow-hidden rounded-xl p-6 text-center transition-all duration-300 transform hover:scale-105 ${activeTab === service.id
                                ? 'bg-gradient-to-r ' + service.color + ' text-white shadow-lg'
                                : 'bg-white dark:bg-gray-800 text-amber-900 dark:text-amber-100 border-2 border-amber-200 dark:border-amber-700 hover:border-amber-400'
                                }`}
                        >
                            <div className="text-3xl mb-2">{service.icon}</div>
                            <h3 className="font-bold text-sm mb-1">{service.name}</h3>
                            <p className="text-xs opacity-80">{service.description}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Service Content */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-amber-900 rounded-2xl p-8 min-h-[500px]">
                {!isAuthenticated ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-6">🔒</div>
                        <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mb-4">
                            Sacred Knowledge Requires Authentication
                        </h2>
                        <p className="text-amber-800 dark:text-amber-200 mb-6">
                            Please authenticate with Internet Identity to access the royal services
                        </p>
                        <button className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium">
                            Authenticate Now
                        </button>
                    </div>
                ) : loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin text-6xl mb-6">⚱️</div>
                        <p className="text-amber-800 dark:text-amber-200">
                            Loading sacred data from the blockchain...
                        </p>
                    </div>
                ) : (
                    <div>
                        {activeTab === 'artifacts' && renderArtifacts()}
                        {activeTab === 'proposals' && renderProposals()}
                        {activeTab === 'nfts' && renderNFTs()}
                        {activeTab === 'ai' && renderAIAnalysis()}
                    </div>
                )}
            </div>

            {/* Egyptian Decoration */}
            <div className="mt-12 text-center">
                <div className="flex justify-center items-center space-x-8 text-4xl text-amber-400 dark:text-amber-600 opacity-60">
                    <span>𓂀</span>
                    <span>𓅃</span>
                    <span>𓊹</span>
                    <span>𓋹</span>
                    <span>𓎛</span>
                </div>
            </div>
        </div>
    );
};

export default ServicesPage;
