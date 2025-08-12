import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const AboutPage: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="space-y-16">
                <div className="text-center space-y-8">
                    <h1 className="text-4xl font-bold text-amber-900 dark:text-amber-100 font-serif">
                        {t('about')}
                    </h1>

                    <div className="text-6xl">𓂀</div>

                    <p className="text-xl text-amber-800 dark:text-amber-200 max-w-3xl mx-auto">
                        {t('appName')} means "Origin/Root" in Egyptian Arabic. We're building the future of cultural heritage preservation through Web3 technology.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Mission */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100 font-serif mb-6">
                            Our Mission
                        </h2>
                        <p className="text-amber-800 dark:text-amber-200 leading-relaxed">
                            To create an immutable, decentralized repository of Egyptian cultural heritage that will preserve our history for future generations. Using blockchain technology, we ensure that these precious artifacts and their stories remain accessible and authentic forever.
                        </p>
                    </div>

                    {/* Vision */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100 font-serif mb-6">
                            Our Vision
                        </h2>
                        <p className="text-amber-800 dark:text-amber-200 leading-relaxed">
                            A world where cultural heritage is democratically accessible, community-verified, and eternally preserved. We envision a global network of heritage enthusiasts working together to document and protect humanity's shared history.
                        </p>
                    </div>

                    {/* Technology */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100 font-serif mb-6">
                            Technology Stack
                        </h2>
                        <ul className="text-amber-800 dark:text-amber-200 space-y-2">
                            <li>• Internet Computer Protocol (ICP)</li>
                            <li>• Non-transferable Heritage NFTs</li>
                            <li>• Decentralized Identity Verification</li>
                            <li>• Community DAO Governance</li>
                            <li>• IPFS for Media Storage</li>
                        </ul>
                    </div>

                    {/* Team */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100 font-serif mb-6">
                            Built With Love
                        </h2>
                        <p className="text-amber-800 dark:text-amber-200 leading-relaxed">
                            Created by a passionate team of developers, archaeologists, and heritage preservation specialists who believe in the power of technology to preserve human culture and history for eternity.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
