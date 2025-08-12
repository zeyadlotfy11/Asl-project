import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const CommunityPage: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center space-y-8">
                <h1 className="text-4xl font-bold text-amber-900 dark:text-amber-100 font-serif">
                    {t('community')}
                </h1>

                <div className="text-6xl">🏛️</div>

                <p className="text-xl text-amber-800 dark:text-amber-200 max-w-2xl mx-auto">
                    Join our community of heritage experts, archaeologists, and cultural preservation enthusiasts.
                </p>

                <div className="bg-amber-100 dark:bg-gray-800 rounded-lg p-8 max-w-2xl mx-auto">
                    <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-4">
                        DAO Governance
                    </h3>
                    <p className="text-amber-800 dark:text-amber-200">
                        Our decentralized autonomous organization allows community members to vote on artifact authenticity, propose new features, and guide the platform's development.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CommunityPage;
