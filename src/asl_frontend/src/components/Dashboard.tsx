import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
// import { BackendService } from '../services/IntegratedBackendService';
// import type {
//     Artifact,
//     ProposalResponse,
//     HeritageNFT
// } from '../services/IntegratedBackendService';
import { Principal } from '@dfinity/principal';
import toast from 'react-hot-toast';

interface DashboardStats {
    totalArtifacts: number;
    totalProposals: number;
    totalUsers: number;
    totalNFTs: number;
    verifiedArtifacts: number;
    activeProposals: number;
}

const Dashboard: React.FC = () => {
    const { isAuthenticated, principal } = useAuth();
    const { t, isRTL } = useLanguage();

    // State management
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentArtifacts, setRecentArtifacts] = useState<any[]>([]);
    const [activeProposals, setActiveProposals] = useState<any[]>([]);
    const [userNFTs, setUserNFTs] = useState<any[]>([]);

    // Load dashboard data
    useEffect(() => {
        if (isAuthenticated && principal) {
            loadDashboardData();
        }
    }, [isAuthenticated, principal]);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            // TODO: Load all dashboard data from backend
            // Mock data for now
            setStats({
                totalArtifacts: 0,
                totalProposals: 0,
                totalUsers: 0,
                totalNFTs: 0,
                verifiedArtifacts: 0,
                activeProposals: 0
            });
            setRecentArtifacts([]);
            setActiveProposals([]);
            setUserNFTs([]);

        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    // Handle artifact creation
    const handleCreateArtifact = async (
        name: string,
        description: string,
        heritageProof: string
    ) => {
        try {
            // TODO: Implement backend integration
            // const artifactId = await BackendService.submitArtifactPublic(
            //     name,
            //     description,
            //     heritageProof
            // );
            toast.success(`Artifact submission pending review`);
            loadDashboardData(); // Refresh data
        } catch (error) {
            toast.error('Failed to create artifact');
            console.error(error);
        }
    };

    // Handle proposal voting
    const handleVoteOnProposal = async (proposalId: bigint, support: boolean) => {
        try {
            // TODO: Implement backend integration
            // const voteType = BackendService.createVoteType(support ? 'For' : 'Against');
            // await BackendService.voteOnProposal(proposalId, voteType);
            toast.success('Vote submitted successfully');
            loadDashboardData(); // Refresh data
        } catch (error) {
            toast.error('Failed to submit vote');
            console.error(error);
        }
    };

    // Handle NFT minting
    const handleMintNFT = async (artifactId: bigint) => {
        try {
            // TODO: Implement backend integration
            // const nftId = await BackendService.issueHeritageNFT(artifactId);
            toast.success(`Heritage NFT minting pending review`);
            loadDashboardData(); // Refresh data
        } catch (error) {
            toast.error('Failed to mint NFT');
            console.error(error);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
                <div className="text-center space-y-6">
                    <div className="text-6xl">🏺</div>
                    <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                        Authentication Required
                    </h2>
                    <p className="text-amber-700 dark:text-amber-300">
                        Please connect your Internet Identity to access the dashboard
                    </p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
                <div className="text-center space-y-6">
                    <div className="animate-spin text-6xl">⚱️</div>
                    <h2 className="text-xl font-semibold text-amber-900 dark:text-amber-100">
                        Loading Dashboard...
                    </h2>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50 dark:border-amber-800/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-amber-900 dark:text-amber-100 font-serif">
                                🏺 Heritage Dashboard
                            </h1>
                            <p className="text-amber-700 dark:text-amber-300 mt-2">
                                Welcome back, {principal?.toString().slice(0, 8)}...
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-amber-600 dark:text-amber-400">
                                Connected to ICP Network
                            </div>
                            <div className="text-sm text-green-600 dark:text-green-400 flex items-center">
                                ✓ Internet Identity Connected
                            </div>
                        </div>
                    </div>
                </div>

                {/* Platform Statistics */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {[
                            { label: 'Total Artifacts', value: stats.totalArtifacts, icon: '🏺', color: 'from-amber-500 to-orange-600' },
                            { label: 'Verified Artifacts', value: stats.verifiedArtifacts, icon: '✅', color: 'from-green-500 to-emerald-600' },
                            { label: 'Active Proposals', value: stats.activeProposals, icon: '🏛️', color: 'from-blue-500 to-indigo-600' },
                            { label: 'Total Proposals', value: stats.totalProposals, icon: '📋', color: 'from-purple-500 to-violet-600' },
                            { label: 'Heritage NFTs', value: stats.totalNFTs, icon: '🎭', color: 'from-pink-500 to-rose-600' },
                            { label: 'Platform Users', value: stats.totalUsers, icon: '👥', color: 'from-cyan-500 to-blue-600' }
                        ].map((stat, index) => (
                            <div key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-amber-200/50 dark:border-amber-800/50">
                                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} text-white text-lg mb-2`}>
                                    {stat.icon}
                                </div>
                                <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                                    {stat.value.toLocaleString()}
                                </div>
                                <div className="text-sm text-amber-600 dark:text-amber-400">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Recent Artifacts & Active Proposals */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Recent Artifacts */}
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50 dark:border-amber-800/50">
                        <h2 className="text-xl font-bold text-amber-900 dark:text-amber-100 mb-4 flex items-center">
                            🏺 Recent Artifacts
                        </h2>
                        <div className="space-y-3">
                            {recentArtifacts.length > 0 ? recentArtifacts.map((artifact, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-amber-50 dark:bg-gray-700 rounded-lg">
                                    <div>
                                        <div className="font-medium text-amber-900 dark:text-amber-100">
                                            {artifact.name || `Artifact ${index}`}
                                        </div>
                                        <div className="text-sm text-amber-600 dark:text-amber-400">
                                            Status: {artifact.status || 'Pending'}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleMintNFT(BigInt(index))}
                                        className="px-3 py-1 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700 transition-colors"
                                    >
                                        Mint NFT
                                    </button>
                                </div>
                            )) : (
                                <div className="text-center text-amber-600 dark:text-amber-400 py-8">
                                    No artifacts found
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Active Proposals */}
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50 dark:border-amber-800/50">
                        <h2 className="text-xl font-bold text-amber-900 dark:text-amber-100 mb-4 flex items-center">
                            🏛️ Active Proposals
                        </h2>
                        <div className="space-y-3">
                            {activeProposals.length > 0 ? activeProposals.map((proposal, index) => (
                                <div key={index} className="p-3 bg-blue-50 dark:bg-gray-700 rounded-lg">
                                    <div className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                                        {proposal.title || `Proposal ${index}`}
                                    </div>
                                    <div className="text-sm text-blue-600 dark:text-blue-400 mb-3">
                                        Type: {proposal.proposal_type || 'General'}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleVoteOnProposal(BigInt(index), true)}
                                            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                                        >
                                            Vote For
                                        </button>
                                        <button
                                            onClick={() => handleVoteOnProposal(BigInt(index), false)}
                                            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                                        >
                                            Vote Against
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center text-blue-600 dark:text-blue-400 py-8">
                                    No active proposals
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* User's NFTs */}
                {userNFTs.length > 0 && (
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50 dark:border-amber-800/50">
                        <h2 className="text-xl font-bold text-amber-900 dark:text-amber-100 mb-4 flex items-center">
                            🎭 Your Heritage NFTs
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {userNFTs.map((nft) => (
                                <div key={Number(nft.id)} className="p-4 bg-purple-50 dark:bg-gray-700 rounded-lg">
                                    <div className="font-medium text-purple-900 dark:text-purple-100 mb-2">
                                        NFT #{Number(nft.id)}
                                    </div>
                                    <div className="text-sm text-purple-600 dark:text-purple-400 mb-2">
                                        Artifact: {Number(nft.artifact_id)}
                                    </div>
                                    <div className="text-xs text-purple-500 dark:text-purple-300">
                                        Created: {new Date(Number(nft.created_at)).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => {
                            const name = prompt("Artifact Name:");
                            const description = prompt("Artifact Description:");
                            const proof = prompt("Heritage Proof:");
                            if (name && description && proof) {
                                handleCreateArtifact(name, description, proof);
                            }
                        }}
                        className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4 rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all duration-300 font-semibold"
                    >
                        🏺 Submit New Artifact
                    </button>

                    <button
                        onClick={() => toast.success('Feature coming soon!')}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 font-semibold"
                    >
                        🏛️ Create Proposal
                    </button>

                    <button
                        onClick={() => toast.success('AI Analysis coming soon!')}
                        className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4 rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 font-semibold"
                    >
                        🔍 AI Analysis
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
