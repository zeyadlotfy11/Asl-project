import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BackendService } from '../services/IntegratedBackendService';
import type { Proposal, Vote, Artifact, User, ProposalResponse } from '../services/IntegratedBackendService';
import toast from 'react-hot-toast';

const ProposalDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated, principal } = useAuth();

    // State
    const [proposal, setProposal] = useState<Proposal | null>(null);
    const [artifact, setArtifact] = useState<Artifact | null>(null);
    const [votes, setVotes] = useState<Vote[]>([]);
    const [userProfile, setUserProfile] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [voting, setVoting] = useState(false);
    const [commenting, setCommenting] = useState(false);
    const [executing, setExecuting] = useState(false);

    // Comment state
    const [commentText, setCommentText] = useState('');
    const [showCommentForm, setShowCommentForm] = useState(false);

    // Vote modal state
    const [showVoteModal, setShowVoteModal] = useState(false);
    const [selectedVoteType, setSelectedVoteType] = useState<'For' | 'Against' | 'Abstain'>('For');
    const [voteRationale, setVoteRationale] = useState('');

    useEffect(() => {
        if (id) {
            loadProposalDetails();
        }
    }, [id]);

    useEffect(() => {
        if (isAuthenticated && principal) {
            loadUserProfile();
        }
    }, [isAuthenticated, principal]);

    const loadProposalDetails = async () => {
        try {
            setLoading(true);
            const proposalId = BigInt(id!);

            console.log("=== DEBUGGING PROPOSAL LOADING ===");
            console.log("Proposal ID:", proposalId);

            // Add a simple test of backend connectivity
            console.log("Testing backend connectivity...");
            try {
                const allProposals = await BackendService.getAllProposals();
                console.log("All proposals count:", allProposals.length);
                console.log("Sample proposal:", allProposals[0]);
            } catch (connError) {
                console.error("Backend connectivity issue:", connError);
            }

            // Load proposal
            console.log("Loading single proposal...");
            let proposalData = await BackendService.getProposal(Number(proposalId));

            // If that fails, try the safe method
            if (!proposalData) {
                console.log("Regular method failed, trying safe method...");
                proposalData = await BackendService.getProposalSafe(Number(proposalId));
            }

            console.log("Received proposal data:", proposalData);
            console.log("Proposal data type:", typeof proposalData);

            if (proposalData) {
                console.log("Proposal data keys:", Object.keys(proposalData));
                console.log("Has voters field:", 'voters' in proposalData);
                console.log("Has proposer field:", 'proposer' in proposalData);
                console.log("Has artifact_id field:", 'artifact_id' in proposalData);
                console.log("Has execution_payload field:", 'execution_payload' in proposalData);
                console.log("Voters:", proposalData.voters);
                console.log("Proposer:", proposalData.proposer);
                console.log("Artifact ID:", proposalData.artifact_id);
                console.log("Execution payload:", proposalData.execution_payload);
            } else {
                throw new Error("Could not load proposal with either method");
            }

            setProposal(proposalData);

            // Load related artifact if exists
            if (proposalData && proposalData.artifact_id && proposalData.artifact_id.length > 0) {
                try {
                    const artifactIdValue = proposalData.artifact_id[0];
                    if (artifactIdValue !== undefined) {
                        const artifactData = await BackendService.getArtifact(BigInt(artifactIdValue));
                        setArtifact(artifactData);
                    }
                } catch (error) {
                    console.error('Failed to load artifact:', error);
                }
            }

            // Load vote details
            try {
                const voteData = await BackendService.getVoteDetails(Number(proposalId));
                setVotes(voteData);
            } catch (error) {
                console.error('Failed to load votes:', error);
            }

        } catch (error) {
            console.error('Failed to load proposal:', error);
            toast.error('Failed to load proposal details');
            navigate('/services');
        } finally {
            setLoading(false);
        }
    };

    const loadUserProfile = async () => {
        try {
            const profile = await BackendService.getCurrentUserProfile();
            setUserProfile(profile);
        } catch (error) {
            console.error('Failed to load user profile:', error);
        }
    };

    const handleVote = async () => {
        if (!isAuthenticated || !principal || !proposal) {
            toast.error('Please connect your wallet to vote');
            return;
        }

        try {
            setVoting(true);
            await BackendService.voteOnProposal(
                Number(proposal.id),
                selectedVoteType,
                voteRationale || undefined
            );

            toast.success(`Vote cast successfully: ${selectedVoteType}`);
            setShowVoteModal(false);
            setVoteRationale('');

            // Reload proposal data
            await loadProposalDetails();
        } catch (error) {
            console.error('Failed to vote:', error);
            toast.error('Failed to cast vote. You may have already voted.');
        } finally {
            setVoting(false);
        }
    };

    const handleAddComment = async () => {
        if (!isAuthenticated || !principal || !proposal || !commentText.trim()) {
            toast.error('Please enter a comment');
            return;
        }

        try {
            setCommenting(true);
            await BackendService.addCommentToProposal(Number(proposal.id), commentText.trim());

            toast.success('Comment added successfully');
            setCommentText('');
            setShowCommentForm(false);

            // Reload proposal data to get updated comments
            await loadProposalDetails();
        } catch (error) {
            console.error('Failed to add comment:', error);
            toast.error('Failed to add comment');
        } finally {
            setCommenting(false);
        }
    };

    const handleExecuteProposal = async () => {
        if (!isAuthenticated || !principal || !proposal) {
            toast.error('Please connect your wallet');
            return;
        }

        try {
            setExecuting(true);
            await BackendService.executeProposal(Number(proposal.id));
            toast.success('Proposal executed successfully');
            await loadProposalDetails();
        } catch (error) {
            console.error('Failed to execute proposal:', error);
            toast.error('Failed to execute proposal');
        } finally {
            setExecuting(false);
        }
    };

    const getProposalTypeText = (proposalType: any): string => {
        if (typeof proposalType === 'string') return proposalType;
        if (typeof proposalType === 'object') {
            return Object.keys(proposalType)[0] || 'Unknown';
        }
        return 'Unknown';
    };

    const getProposalStatusText = (status: any): string => {
        if (typeof status === 'string') return status;
        if (typeof status === 'object') {
            return Object.keys(status)[0] || 'Unknown';
        }
        return 'Unknown';
    };

    const getArtifactStatusText = (status: any): string => {
        if (typeof status === 'string') return status;
        if (typeof status === 'object') {
            return Object.keys(status)[0] || 'Unknown';
        }
        return 'Unknown';
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
            case 'passed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
            case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
            case 'executed': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type.toLowerCase()) {
            case 'verifyartifact': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400';
            case 'disputeartifact': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
            case 'updateartifactstatus': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
            case 'grantuserrole': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
        }
    };

    const formatDate = (timestamp: number | bigint) => {
        return new Date(Number(timestamp) / 1000000).toLocaleString();
    };

    const calculateTimeRemaining = (deadline: number | bigint) => {
        const now = Date.now() * 1000000; // Convert to nanoseconds
        const deadlineNano = Number(deadline);
        const diff = deadlineNano - now;

        if (diff <= 0) return 'Voting ended';

        const days = Math.floor(diff / (24 * 60 * 60 * 1000 * 1000000));
        const hours = Math.floor((diff % (24 * 60 * 60 * 1000 * 1000000)) / (60 * 60 * 1000 * 1000000));

        if (days > 0) return `${days}d ${hours}h remaining`;
        return `${hours}h remaining`;
    };

    const getVotePercentages = () => {
        const totalVotes = proposal ? Number(proposal.votes_for) + Number(proposal.votes_against) : 0;
        if (totalVotes === 0) return { forPercent: 0, againstPercent: 0 };

        const forPercent = (Number(proposal!.votes_for) / totalVotes) * 100;
        const againstPercent = (Number(proposal!.votes_against) / totalVotes) * 100;

        return { forPercent, againstPercent };
    };

    const hasUserVoted = () => {
        return principal && votes.some(vote => vote.voter.toString() === principal.toString());
    };

    const canExecute = () => {
        if (!proposal) return false;
        const status = getProposalStatusText(proposal.status);
        return status.toLowerCase() === 'passed' && userProfile?.role &&
            (Object.keys(userProfile.role)[0] === 'Moderator' || Object.keys(userProfile.role)[0] === 'Expert');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                    <p className="text-amber-600 dark:text-amber-400">Loading proposal details...</p>
                </div>
            </div>
        );
    }

    if (!proposal) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="text-6xl">❌</div>
                    <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100">Proposal Not Found</h2>
                    <button
                        onClick={() => navigate('/services')}
                        className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                    >
                        Back to Services
                    </button>
                </div>
            </div>
        );
    }

    const { forPercent, againstPercent } = getVotePercentages();
    const proposalStatus = getProposalStatusText(proposal.status);
    const proposalType = getProposalTypeText(proposal.proposal_type);
    const timeRemaining = calculateTimeRemaining(proposal.voting_deadline);

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/services')}
                        className="flex items-center text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 mb-4"
                    >
                        ← Back to Services
                    </button>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-amber-900 dark:text-amber-100 font-serif">
                                🏛️ {proposal.title}
                            </h1>
                            <p className="text-amber-700 dark:text-amber-300 mt-2">
                                Proposal #{proposal.id.toString()}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(proposalStatus)}`}>
                                {proposalStatus}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(proposalType)}`}>
                                {proposalType}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Proposal Details */}
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50 dark:border-amber-800/50 shadow-xl">
                            <h2 className="text-xl font-bold text-amber-900 dark:text-amber-100 mb-4">
                                📋 Proposal Details
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-medium text-amber-800 dark:text-amber-200">Description</h3>
                                    <p className="text-amber-700 dark:text-amber-300 mt-1 whitespace-pre-wrap">
                                        {proposal.description}
                                    </p>
                                </div>

                                {proposal.execution_payload && proposal.execution_payload.length > 0 && (
                                    <div>
                                        <h3 className="font-medium text-amber-800 dark:text-amber-200">Execution Instructions</h3>
                                        <p className="text-amber-700 dark:text-amber-300 mt-1 whitespace-pre-wrap">
                                            {proposal.execution_payload[0]}
                                        </p>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-amber-200 dark:border-amber-700">
                                    <div>
                                        <h3 className="font-medium text-amber-800 dark:text-amber-200">Created</h3>
                                        <p className="text-amber-700 dark:text-amber-300">{formatDate(proposal.created_at)}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-amber-800 dark:text-amber-200">Voting Deadline</h3>
                                        <p className="text-amber-700 dark:text-amber-300">{formatDate(proposal.voting_deadline)}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-amber-800 dark:text-amber-200">Proposer</h3>
                                        <p className="text-amber-700 dark:text-amber-300 font-mono text-sm break-all">
                                            {proposal.proposer.toString()}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-amber-800 dark:text-amber-200">Time Remaining</h3>
                                        <p className="text-amber-700 dark:text-amber-300">{timeRemaining}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Related Artifact */}
                        {artifact && (
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50 dark:border-amber-800/50 shadow-xl">
                                <h2 className="text-xl font-bold text-amber-900 dark:text-amber-100 mb-4">
                                    🏺 Related Artifact
                                </h2>
                                <div className="flex gap-4">
                                    {artifact.images && artifact.images.length > 0 && (
                                        <img
                                            src={artifact.images[0]}
                                            alt={artifact.name}
                                            className="w-24 h-24 object-cover rounded-lg"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <h3 className="font-bold text-amber-800 dark:text-amber-200">{artifact.name}</h3>
                                        <p className="text-amber-700 dark:text-amber-300 text-sm mt-1">{artifact.description}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-xs text-amber-600 dark:text-amber-400">Status:</span>
                                            <span className={`px-2 py-1 rounded text-xs ${getStatusColor(getArtifactStatusText(artifact.status))}`}>
                                                {getArtifactStatusText(artifact.status)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Voting History */}
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50 dark:border-amber-800/50 shadow-xl">
                            <h2 className="text-xl font-bold text-amber-900 dark:text-amber-100 mb-4">
                                🗳️ Voting History ({votes.length} votes)
                            </h2>
                            {votes.length > 0 ? (
                                <div className="space-y-3 max-h-64 overflow-y-auto">
                                    {votes.map((vote, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-amber-50 dark:bg-gray-700 rounded-lg">
                                            <div className="flex-1">
                                                <p className="font-mono text-sm text-amber-700 dark:text-amber-300 break-all">
                                                    {vote.voter.toString()}
                                                </p>
                                                {vote.rationale && vote.rationale.length > 0 && (
                                                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                                                        "{vote.rationale[0]}"
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 ml-4">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${Object.keys(vote.vote_type)[0] === 'For'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                    : Object.keys(vote.vote_type)[0] === 'Against'
                                                        ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                                                    }`}>
                                                    {Object.keys(vote.vote_type)[0]}
                                                </span>
                                                <span className="text-xs text-amber-600 dark:text-amber-400">
                                                    {formatDate(vote.timestamp)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-amber-600 dark:text-amber-400">
                                    No votes cast yet
                                </div>
                            )}
                        </div>

                        {/* Comments Section */}
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50 dark:border-amber-800/50 shadow-xl">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-amber-900 dark:text-amber-100">
                                    💬 Discussion
                                </h2>
                                {isAuthenticated && (
                                    <button
                                        onClick={() => setShowCommentForm(!showCommentForm)}
                                        className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                                    >
                                        Add Comment
                                    </button>
                                )}
                            </div>

                            {showCommentForm && (
                                <div className="mb-6 p-4 bg-amber-50 dark:bg-gray-700 rounded-lg">
                                    <textarea
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="Share your thoughts on this proposal..."
                                        className="w-full px-4 py-3 border border-amber-300 dark:border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-gray-800 text-amber-900 dark:text-amber-100"
                                        rows={4}
                                    />
                                    <div className="flex gap-2 mt-3">
                                        <button
                                            onClick={handleAddComment}
                                            disabled={commenting || !commentText.trim()}
                                            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
                                        >
                                            {commenting ? 'Adding...' : 'Add Comment'}
                                        </button>
                                        <button
                                            onClick={() => setShowCommentForm(false)}
                                            className="px-4 py-2 border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="text-center py-8 text-amber-600 dark:text-amber-400">
                                Comments will be loaded here once backend integration is complete
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">

                        {/* Voting Results */}
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50 dark:border-amber-800/50 shadow-xl">
                            <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100 mb-4">
                                📊 Voting Results
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-green-700 dark:text-green-400">For</span>
                                        <span className="text-sm font-bold text-green-700 dark:text-green-400">
                                            {proposal.votes_for.toString()} ({forPercent.toFixed(1)}%)
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${forPercent}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-red-700 dark:text-red-400">Against</span>
                                        <span className="text-sm font-bold text-red-700 dark:text-red-400">
                                            {proposal.votes_against.toString()} ({againstPercent.toFixed(1)}%)
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-red-500 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${againstPercent}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-amber-200 dark:border-amber-700">
                                    <div className="text-sm text-amber-600 dark:text-amber-400">
                                        Total Voters: {(Number(proposal.votes_for) + Number(proposal.votes_against))}
                                    </div>
                                    <div className="text-sm text-amber-600 dark:text-amber-400">
                                        {timeRemaining}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Voting Actions */}
                        {isAuthenticated && proposalStatus.toLowerCase() === 'active' && !hasUserVoted() && (
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50 dark:border-amber-800/50 shadow-xl">
                                <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100 mb-4">
                                    🗳️ Cast Your Vote
                                </h3>
                                <button
                                    onClick={() => setShowVoteModal(true)}
                                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold"
                                >
                                    Vote on Proposal
                                </button>
                            </div>
                        )}

                        {/* Execute Proposal */}
                        {canExecute() && (
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50 dark:border-amber-800/50 shadow-xl">
                                <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100 mb-4">
                                    ⚡ Execute Proposal
                                </h3>
                                <button
                                    onClick={handleExecuteProposal}
                                    disabled={executing}
                                    className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold disabled:opacity-50"
                                >
                                    {executing ? 'Executing...' : 'Execute Proposal'}
                                </button>
                            </div>
                        )}

                        {/* User Vote Status */}
                        {hasUserVoted() && (
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50 dark:border-amber-800/50 shadow-xl">
                                <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100 mb-4">
                                    ✅ Your Vote
                                </h3>
                                <div className="text-center">
                                    <p className="text-amber-700 dark:text-amber-300">
                                        You have already voted on this proposal
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Vote Modal */}
                {showVoteModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
                            <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100 mb-4">
                                Cast Your Vote
                            </h3>

                            <div className="space-y-4 mb-6">
                                {['For', 'Against', 'Abstain'].map((voteType) => (
                                    <label
                                        key={voteType}
                                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedVoteType === voteType
                                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                                            : 'border-amber-200 dark:border-amber-700 hover:border-amber-300'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="voteType"
                                            value={voteType}
                                            checked={selectedVoteType === voteType}
                                            onChange={(e) => setSelectedVoteType(e.target.value as any)}
                                            className="sr-only"
                                        />
                                        <div className={`w-4 h-4 rounded-full border-2 mr-3 ${selectedVoteType === voteType
                                            ? 'border-amber-500 bg-amber-500'
                                            : 'border-gray-300'
                                            }`}>
                                            {selectedVoteType === voteType && (
                                                <div className="w-2 h-2 bg-white rounded-full m-auto mt-0.5"></div>
                                            )}
                                        </div>
                                        <span className="font-medium text-amber-900 dark:text-amber-100">
                                            {voteType}
                                        </span>
                                    </label>
                                ))}
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-amber-900 dark:text-amber-100 mb-2">
                                    Rationale (Optional)
                                </label>
                                <textarea
                                    value={voteRationale}
                                    onChange={(e) => setVoteRationale(e.target.value)}
                                    placeholder="Explain your reasoning..."
                                    className="w-full px-4 py-3 border border-amber-300 dark:border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-gray-700 text-amber-900 dark:text-amber-100"
                                    rows={3}
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowVoteModal(false)}
                                    className="flex-1 px-4 py-3 border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleVote}
                                    disabled={voting}
                                    className="flex-1 px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
                                >
                                    {voting ? 'Voting...' : 'Submit Vote'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProposalDetailsPage;
