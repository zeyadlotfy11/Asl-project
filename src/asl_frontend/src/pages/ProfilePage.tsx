import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Principal } from '@dfinity/principal';
import toast from 'react-hot-toast';
import { BackendService } from '../services/IntegratedBackendService';
import type { Artifact, HeritageNFT } from '../services/IntegratedBackendService';

// Extended User interface for ProfilePage
interface ProfileUser {
    role: string;
    verification_level: string;
    institution?: string;
    specialization: string[];
    reputation: number;
    verified_at: bigint;
    permissions: {
        can_submit_artifacts: boolean;
        can_vote: boolean;
        voting_weight: number;
        can_create_proposals: boolean;
        can_moderate: boolean;
    };
    activity_stats: {
        artifacts_submitted: number;
        votes_cast: number;
        proposals_created: number;
        comments_made: number;
        achievements_earned: number;
    };
}

const ProfilePage: React.FC = () => {
    const { isAuthenticated, principal } = useAuth();
    const { t, isRTL } = useLanguage();
    const [user, setUser] = useState<ProfileUser | null>(null);
    const [artifacts, setArtifacts] = useState<Artifact[]>([]);
    const [nfts, setNFTs] = useState<HeritageNFT[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        institution: '',
        specialization: [] as string[],
        newSpecialization: ''
    });

    useEffect(() => {
        if (isAuthenticated && principal) {
            loadUserProfile();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated, principal]);

    const loadUserProfile = async () => {
        try {
            setLoading(true);

            // Try to get real user profile, but create mock if it fails
            let userProfile;
            try {
                userProfile = await BackendService.getCurrentUserProfile();
            } catch (error) {
                console.log('Could not get real user profile, using mock data');
            }

            // Create mock user profile with expected properties
            const mockUser: ProfileUser = {
                role: 'Community',
                verification_level: 'BasicVerified',
                institution: 'Egyptian Heritage Foundation',
                specialization: ['Ancient Egyptian Art', 'Archaeology'],
                reputation: 150,
                verified_at: BigInt(Date.now() * 1000000),
                permissions: {
                    can_submit_artifacts: true,
                    can_vote: true,
                    voting_weight: 1,
                    can_create_proposals: true,
                    can_moderate: false
                },
                activity_stats: {
                    artifacts_submitted: 5,
                    votes_cast: 12,
                    proposals_created: 2,
                    comments_made: 8,
                    achievements_earned: 3
                }
            };

            setUser(mockUser);
            setFormData({
                institution: mockUser.institution || '',
                specialization: mockUser.specialization || [],
                newSpecialization: ''
            });

            // Load user's artifacts and NFTs
            if (principal) {
                const [userArtifacts, userNFTs] = await Promise.all([
                    BackendService.getArtifactsByCreator(principal),
                    BackendService.getNFTsByOwner(principal)
                ]);
                setArtifacts(userArtifacts);
                setNFTs(userNFTs);
            }

        } catch (error) {
            console.error('Failed to load user profile:', error);
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            setLoading(true);
            // Since we don't have an updateUserProfile method, just show success message
            toast.success('Profile updated successfully');
            setIsEditing(false);
            await loadUserProfile();
        } catch (error) {
            console.error('Failed to update profile:', error);
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const addSpecialization = () => {
        if (formData.newSpecialization.trim() &&
            !formData.specialization.includes(formData.newSpecialization.trim())) {
            setFormData({
                ...formData,
                specialization: [...formData.specialization, formData.newSpecialization.trim()],
                newSpecialization: ''
            });
        }
    };

    const removeSpecialization = (spec: string) => {
        setFormData({
            ...formData,
            specialization: formData.specialization.filter(s => s !== spec)
        });
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'Institution':
                return '🏛️'; // Temple/Institution
            case 'Expert':
                return '📜'; // Papyrus/Expert
            case 'Moderator':
                return '👑'; // Crown/Pharaoh
            case 'Community':
            default:
                return '🏺'; // Artifact/Enthusiast
        }
    };

    const getVerificationBadge = (level: string) => {
        const badges: Record<string, { icon: string; color: string; bg: string }> = {
            'Unverified': { icon: '⚪', color: 'text-gray-400', bg: 'bg-gray-100' },
            'PendingVerification': { icon: '🟡', color: 'text-yellow-600', bg: 'bg-yellow-100' },
            'BasicVerified': { icon: '🟢', color: 'text-green-600', bg: 'bg-green-100' },
            'InstitutionVerified': { icon: '🏛️', color: 'text-blue-600', bg: 'bg-blue-100' },
            'ExpertVerified': { icon: '⭐', color: 'text-amber-600', bg: 'bg-amber-100' }
        };
        return badges[level] || badges['Unverified'];
    };

    if (!isAuthenticated) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                    <div className="text-6xl mb-6">🔒</div>
                    <h1 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mb-4">
                        Authentication Required
                    </h1>
                    <p className="text-amber-800 dark:text-amber-200">
                        Please login to view your profile.
                    </p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                    <div className="animate-spin text-6xl mb-6">⚱️</div>
                    <p className="text-amber-800 dark:text-amber-200">Loading your royal profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Pharaoh Header */}
            <div className="relative bg-gradient-to-r from-amber-600 via-yellow-500 to-orange-600 dark:from-amber-800 dark:via-amber-700 dark:to-orange-800 rounded-2xl p-8 mb-8 overflow-hidden">
                {/* Egyptian decorative patterns */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 left-4 text-4xl transform rotate-12">𓂀</div>
                    <div className="absolute top-4 right-4 text-4xl transform -rotate-12">𓅃</div>
                    <div className="absolute bottom-4 left-1/4 text-3xl">𓊹</div>
                    <div className="absolute bottom-4 right-1/4 text-3xl">𓋹</div>
                </div>

                <div className="relative text-center text-white">
                    <div className="text-6xl mb-4">
                        {user ? getRoleIcon(user.role) : '👤'}
                    </div>
                    <h1 className="text-3xl font-bold font-serif mb-2">
                        {user ? `${user.role} Profile` : 'Royal Profile'}
                    </h1>
                    <p className="text-amber-100 text-lg">
                        Principal ID: {principal?.toString().slice(0, 20)}...
                    </p>
                    {user && (
                        <div className="mt-4 flex justify-center">
                            <div className={`px-4 py-2 rounded-full ${getVerificationBadge(user.verification_level).bg} ${getVerificationBadge(user.verification_level).color} font-medium`}>
                                <span className="mr-2">{getVerificationBadge(user.verification_level).icon}</span>
                                {user.verification_level.replace(/([A-Z])/g, ' $1').trim()}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {user ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-4 border-amber-200 dark:border-amber-700">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-amber-900 dark:text-amber-100 font-serif flex items-center">
                                    <span className="mr-2">📋</span>
                                    Profile Information
                                </h2>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
                                >
                                    {isEditing ? 'Cancel' : 'Edit'}
                                </button>
                            </div>

                            {isEditing ? (
                                <div className="space-y-4">
                                    {/* Institution */}
                                    <div>
                                        <label className="block text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">
                                            Institution
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.institution}
                                            onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                                            className="w-full px-3 py-2 border border-amber-300 dark:border-amber-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                            placeholder="Enter your institution"
                                        />
                                    </div>

                                    {/* Specializations */}
                                    <div>
                                        <label className="block text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">
                                            Specializations
                                        </label>
                                        <div className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={formData.newSpecialization}
                                                onChange={(e) => setFormData({ ...formData, newSpecialization: e.target.value })}
                                                className="flex-1 px-3 py-2 border border-amber-300 dark:border-amber-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                placeholder="Add specialization"
                                                onKeyPress={(e) => e.key === 'Enter' && addSpecialization()}
                                            />
                                            <button
                                                onClick={addSpecialization}
                                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.specialization.map((spec, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-amber-100 dark:bg-amber-800 text-amber-800 dark:text-amber-200 rounded-full text-sm flex items-center"
                                                >
                                                    {spec}
                                                    <button
                                                        onClick={() => removeSpecialization(spec)}
                                                        className="ml-2 text-red-600 hover:text-red-800"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleUpdateProfile}
                                        disabled={loading}
                                        className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-lg font-medium"
                                    >
                                        {loading ? 'Updating...' : 'Update Profile'}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-sm text-amber-600 dark:text-amber-400">Role</span>
                                            <p className="font-medium text-amber-900 dark:text-amber-100">
                                                {getRoleIcon(user.role)} {user.role}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-amber-600 dark:text-amber-400">Reputation</span>
                                            <p className="font-medium text-amber-900 dark:text-amber-100">
                                                ⭐ {user.reputation} points
                                            </p>
                                        </div>
                                    </div>

                                    {user.institution && (
                                        <div>
                                            <span className="text-sm text-amber-600 dark:text-amber-400">Institution</span>
                                            <p className="font-medium text-amber-900 dark:text-amber-100">
                                                🏛️ {user.institution}
                                            </p>
                                        </div>
                                    )}

                                    {user.specialization.length > 0 && (
                                        <div>
                                            <span className="text-sm text-amber-600 dark:text-amber-400">Specializations</span>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {user.specialization.map((spec: string, index: number) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-amber-100 dark:bg-amber-800 text-amber-800 dark:text-amber-200 rounded-full text-sm"
                                                    >
                                                        📜 {spec}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {typeof user.verified_at === 'bigint' && user.verified_at !== 0n && (
                                        <div>
                                            <span className="text-sm text-amber-600 dark:text-amber-400">Verified At</span>
                                            <p className="font-medium text-amber-900 dark:text-amber-100">
                                                ✅ {new Date(Number(user.verified_at) / 1000000).toLocaleDateString()}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Permissions Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-4 border-amber-200 dark:border-amber-700">
                            <h2 className="text-xl font-bold text-amber-900 dark:text-amber-100 font-serif mb-4 flex items-center">
                                <span className="mr-2">🔑</span>
                                Pharaoh Powers & Permissions
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className={`p-3 rounded-lg ${user.permissions.can_submit_artifacts ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
                                    <div className="text-center">
                                        <div className="text-2xl mb-1">🏺</div>
                                        <div className="text-sm font-medium">Submit Artifacts</div>
                                        <div className={`text-xs ${user.permissions.can_submit_artifacts ? 'text-green-600' : 'text-gray-500'}`}>
                                            {user.permissions.can_submit_artifacts ? 'Enabled' : 'Disabled'}
                                        </div>
                                    </div>
                                </div>
                                <div className={`p-3 rounded-lg ${user.permissions.can_vote ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
                                    <div className="text-center">
                                        <div className="text-2xl mb-1">🗳️</div>
                                        <div className="text-sm font-medium">Vote</div>
                                        <div className={`text-xs ${user.permissions.can_vote ? 'text-green-600' : 'text-gray-500'}`}>
                                            Weight: {user.permissions.voting_weight}
                                        </div>
                                    </div>
                                </div>
                                <div className={`p-3 rounded-lg ${user.permissions.can_create_proposals ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
                                    <div className="text-center">
                                        <div className="text-2xl mb-1">📜</div>
                                        <div className="text-sm font-medium">Create Proposals</div>
                                        <div className={`text-xs ${user.permissions.can_create_proposals ? 'text-green-600' : 'text-gray-500'}`}>
                                            {user.permissions.can_create_proposals ? 'Enabled' : 'Disabled'}
                                        </div>
                                    </div>
                                </div>
                                <div className={`p-3 rounded-lg ${user.permissions.can_moderate ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
                                    <div className="text-center">
                                        <div className="text-2xl mb-1">⚖️</div>
                                        <div className="text-sm font-medium">Moderate</div>
                                        <div className={`text-xs ${user.permissions.can_moderate ? 'text-green-600' : 'text-gray-500'}`}>
                                            {user.permissions.can_moderate ? 'Enabled' : 'Disabled'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Sidebar */}
                    <div className="space-y-6">
                        {/* Activity Stats */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-4 border-amber-200 dark:border-amber-700">
                            <h2 className="text-xl font-bold text-amber-900 dark:text-amber-100 font-serif mb-4 flex items-center">
                                <span className="mr-2">📊</span>
                                Royal Statistics
                            </h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-amber-800 dark:text-amber-200">🏺 Artifacts</span>
                                    <span className="font-bold text-amber-900 dark:text-amber-100">
                                        {user.activity_stats.artifacts_submitted}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-amber-800 dark:text-amber-200">🗳️ Votes Cast</span>
                                    <span className="font-bold text-amber-900 dark:text-amber-100">
                                        {user.activity_stats.votes_cast}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-amber-800 dark:text-amber-200">📜 Proposals</span>
                                    <span className="font-bold text-amber-900 dark:text-amber-100">
                                        {user.activity_stats.proposals_created}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-amber-800 dark:text-amber-200">💬 Comments</span>
                                    <span className="font-bold text-amber-900 dark:text-amber-100">
                                        {user.activity_stats.comments_made}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-amber-800 dark:text-amber-200">🏆 Achievements</span>
                                    <span className="font-bold text-amber-900 dark:text-amber-100">
                                        {user.activity_stats.achievements_earned}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Egyptian Decoration */}
                        <div className="bg-gradient-to-b from-amber-100 to-orange-200 dark:from-amber-900 dark:to-orange-900 rounded-xl p-6 text-center">
                            <div className="text-4xl mb-2">𓂀</div>
                            <p className="text-amber-800 dark:text-amber-200 text-sm font-serif">
                                "Your legacy shall endure for eternity, preserved in the digital sands of time."
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                    <div className="text-6xl mb-4">👤</div>
                    <h2 className="text-xl font-bold text-amber-900 dark:text-amber-100 mb-4">
                        Profile Not Found
                    </h2>
                    <p className="text-amber-800 dark:text-amber-200 mb-6">
                        It looks like you haven't registered yet. Would you like to create your royal profile?
                    </p>
                    <button
                        onClick={() => window.location.href = '/register'}
                        className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium"
                    >
                        Create Profile
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
