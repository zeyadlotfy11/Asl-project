import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { BackendService } from '../services/IntegratedBackendService';
import CommunityPost from '../components/CommunityPost';
import CommunityCard from '../components/CommunityCard';

// Types for community features
interface CommunityPost {
    id: number;
    author: string;
    title: string;
    content: string;
    category: 'general' | 'artifacts' | 'research' | 'events';
    timestamp: number;
    likes: number;
    replies: number;
    tags: string[];
}

interface CommunityStats {
    totalMembers: number;
    activeToday: number;
    totalPosts: number;
    totalArtifacts: number;
}

interface UpcomingEvent {
    id: number;
    title: string;
    date: string;
    type: 'workshop' | 'exhibition' | 'discussion' | 'webinar';
    participants: number;
    maxParticipants: number;
}

const CommunityPage: React.FC = () => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'feed' | 'events' | 'members' | 'governance'>('feed');
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [events, setEvents] = useState<UpcomingEvent[]>([]);
    const [stats, setStats] = useState<CommunityStats>({
        totalMembers: 0,
        activeToday: 0,
        totalPosts: 0,
        totalArtifacts: 0
    });
    const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general' as const });
    const [showCreatePost, setShowCreatePost] = useState(false);

    useEffect(() => {
        loadCommunityData();
    }, []);

    const loadCommunityData = async () => {
        try {
            // Load community statistics
            const statsData = await BackendService.getCommunityStats();
            setStats(statsData);

            // Load recent posts
            const postsData = await BackendService.getCommunityPosts();
            setPosts(postsData);

            // Load upcoming events
            const eventsData = await BackendService.getUpcomingEvents();
            // Map VirtualEvent[] to UpcomingEvent[]
            const mappedEvents = eventsData.map((event: any) => ({
                id: event.id,
                title: event.title,
                date: event.date ?? '',
                type: event.type ?? 'workshop',
                participants: event.participants ?? 0,
                maxParticipants: event.maxParticipants ?? 0,
            }));
            setEvents(mappedEvents);
        } catch (error) {
            console.error('Failed to load community data:', error);
        }
    };

    const handleCreatePost = async () => {
        if (!newPost.title.trim() || !newPost.content.trim()) return;

        try {
            await BackendService.createCommunityPost(newPost);
            setNewPost({ title: '', content: '', category: 'general' });
            setShowCreatePost(false);
            loadCommunityData(); // Refresh data
        } catch (error) {
            console.error('Failed to create post:', error);
        }
    };

    const handleJoinEvent = async (eventId: number) => {
        try {
            await BackendService.joinEvent(BigInt(eventId));
            loadCommunityData(); // Refresh events
        } catch (error) {
            console.error('Failed to join event:', error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="text-center space-y-6 mb-12">
                <h1 className="text-4xl font-bold text-amber-900 dark:text-amber-100 font-serif">
                    {t('community')}
                </h1>
                <div className="text-6xl">🏛️</div>
                <p className="text-xl text-amber-800 dark:text-amber-200 max-w-2xl mx-auto">
                    Join our community of heritage experts, archaeologists, and cultural preservation enthusiasts.
                </p>
            </div>

            {/* Community Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                    <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.totalMembers}</div>
                    <div className="text-gray-600 dark:text-gray-300">Total Members</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.activeToday}</div>
                    <div className="text-gray-600 dark:text-gray-300">Active Today</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.totalPosts}</div>
                    <div className="text-gray-600 dark:text-gray-300">Community Posts</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.totalArtifacts}</div>
                    <div className="text-gray-600 dark:text-gray-300">Artifacts Shared</div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                {[
                    { key: 'feed', label: 'Community Feed', icon: '📋' },
                    { key: 'events', label: 'Events', icon: '📅' },
                    { key: 'members', label: 'Members', icon: '👥' },
                    { key: 'governance', label: 'DAO Governance', icon: '🗳️' }
                ].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as any)}
                        className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-colors ${activeTab === tab.key
                            ? 'bg-white dark:bg-gray-700 text-amber-600 dark:text-amber-400 shadow-sm'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'
                            }`}
                    >
                        <span>{tab.icon}</span>
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'feed' && (
                <div className="space-y-6">
                    {/* Create Post Button */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                        <button
                            onClick={() => setShowCreatePost(!showCreatePost)}
                            className="w-full text-left p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                            <span className="text-gray-500 dark:text-gray-400">Share your thoughts with the community...</span>
                        </button>
                    </div>

                    {/* Create Post Form */}
                    {showCreatePost && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Create New Post</h3>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Post title..."
                                    value={newPost.title}
                                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                                <select
                                    value={newPost.category}
                                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value as any })}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                >
                                    <option value="general">General Discussion</option>
                                    <option value="artifacts">Artifacts</option>
                                    <option value="research">Research</option>
                                    <option value="events">Events</option>
                                </select>
                                <textarea
                                    placeholder="What's on your mind?"
                                    value={newPost.content}
                                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                    rows={4}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                                <div className="flex space-x-3">
                                    <button
                                        onClick={handleCreatePost}
                                        className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                                    >
                                        Post
                                    </button>
                                    <button
                                        onClick={() => setShowCreatePost(false)}
                                        className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Posts Feed */}
                    <div className="space-y-6">
                        {posts.map((post) => (
                            <CommunityPost
                                key={post.id}
                                post={post}
                                onLike={(postId) => console.log(`Liked post ${postId}`)}
                                onReply={(postId) => console.log(`Reply to post ${postId}`)}
                                onShare={(postId) => console.log(`Share post ${postId}`)}
                            />
                        ))}

                        {posts.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📝</div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                    No posts yet
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Be the first to share something with the community!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'events' && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Upcoming Events</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {events.map((event) => (
                            <div key={event.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{event.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-400">{event.date}</p>
                                    </div>
                                    <span className={`px-3 py-1 text-xs rounded-full ${event.type === 'workshop' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                        event.type === 'exhibition' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                            event.type === 'discussion' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                                                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                        }`}>
                                        {event.type}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {event.participants}/{event.maxParticipants} participants
                                    </span>
                                    <button
                                        onClick={() => handleJoinEvent(event.id)}
                                        className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                                    >
                                        Join Event
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'members' && (
                <div className="space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Community Members</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
                            Connect with experts, institutions, and fellow heritage enthusiasts from around the world.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <CommunityCard
                            icon="👨‍🎓"
                            title="Heritage Experts"
                            description="Connect with archaeologists, historians, and cultural heritage specialists."
                            action={{
                                label: "Browse Experts",
                                onClick: () => console.log("Browse experts")
                            }}
                        />

                        <CommunityCard
                            icon="🏛️"
                            title="Cultural Institutions"
                            description="Partner with museums, universities, and preservation organizations."
                            action={{
                                label: "View Institutions",
                                onClick: () => console.log("View institutions")
                            }}
                        />

                        <CommunityCard
                            icon="🌍"
                            title="Global Community"
                            description="Join thousands of heritage enthusiasts preserving our shared culture."
                            action={{
                                label: "Join Network",
                                onClick: () => console.log("Join network")
                            }}
                        />

                        <CommunityCard
                            icon="🎯"
                            title="Research Groups"
                            description="Collaborate on specialized research projects and publications."
                            action={{
                                label: "Find Groups",
                                onClick: () => console.log("Find groups")
                            }}
                        />

                        <CommunityCard
                            icon="📚"
                            title="Knowledge Sharing"
                            description="Share discoveries, methodologies, and best practices."
                            action={{
                                label: "Start Discussion",
                                onClick: () => setActiveTab('feed')
                            }}
                        />

                        <CommunityCard
                            icon="🤝"
                            title="Mentorship"
                            description="Find mentors or become one to guide the next generation."
                            action={{
                                label: "Learn More",
                                onClick: () => console.log("Learn more about mentorship")
                            }}
                        />
                    </div>
                </div>
            )}

            {activeTab === 'governance' && (
                <div className="space-y-6">
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-8">
                        <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mb-4">DAO Governance</h2>
                        <p className="text-amber-800 dark:text-amber-200 mb-6">
                            Our decentralized autonomous organization allows community members to vote on artifact authenticity,
                            propose new features, and guide the platform's development.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Active Proposals</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">5 proposals awaiting your vote</p>
                                <button className="w-full py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                                    View Proposals
                                </button>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Your Voting Power</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">Based on your contributions and reputation</p>
                                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">85 VP</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommunityPage;
