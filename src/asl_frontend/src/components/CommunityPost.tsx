import React from 'react';

interface CommunityPostProps {
    post: {
        id: number;
        author: string;
        title: string;
        content: string;
        category: 'general' | 'artifacts' | 'research' | 'events';
        timestamp: number;
        likes: number;
        replies: number;
        tags: string[];
    };
    onLike?: (postId: number) => void;
    onReply?: (postId: number) => void;
    onShare?: (postId: number) => void;
}

const CommunityPost: React.FC<CommunityPostProps> = ({
    post,
    onLike,
    onReply,
    onShare
}) => {
    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'artifacts':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'research':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'events':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    const formatTimeAgo = (timestamp: number) => {
        const now = Date.now();
        const diff = now - timestamp;
        const hours = Math.floor(diff / (1000 * 60 * 60));

        if (hours < 1) {
            const minutes = Math.floor(diff / (1000 * 60));
            return `${minutes}m ago`;
        } else if (hours < 24) {
            return `${hours}h ago`;
        } else {
            const days = Math.floor(hours / 24);
            return `${days}d ago`;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {post.author.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                            {post.author}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatTimeAgo(post.timestamp)}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(post.category)}`}>
                            {post.category}
                        </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                        {post.title}
                    </h3>

                    <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                        {post.content}
                    </p>

                    {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 rounded-full"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center space-x-6">
                        <button
                            onClick={() => onLike?.(post.id)}
                            className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                        >
                            <span className="text-lg">👍</span>
                            <span className="text-sm font-medium">{post.likes}</span>
                        </button>

                        <button
                            onClick={() => onReply?.(post.id)}
                            className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                        >
                            <span className="text-lg">💬</span>
                            <span className="text-sm font-medium">{post.replies}</span>
                        </button>

                        <button
                            onClick={() => onShare?.(post.id)}
                            className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                        >
                            <span className="text-lg">🔗</span>
                            <span className="text-sm font-medium">Share</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityPost;
