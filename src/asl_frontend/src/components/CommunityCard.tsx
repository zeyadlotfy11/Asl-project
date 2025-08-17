import React from 'react';

interface CommunityCardProps {
    icon: string;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

const CommunityCard: React.FC<CommunityCardProps> = ({
    icon,
    title,
    description,
    action,
    className = ""
}) => {
    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow ${className}`}>
            <div className="text-4xl mb-4 text-center">{icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 text-center">
                {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
                {description}
            </p>
            {action && (
                <button
                    onClick={action.onClick}
                    className="w-full py-2 px-4 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
};

export default CommunityCard;
