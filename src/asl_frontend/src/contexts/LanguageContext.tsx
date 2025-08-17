import HomePage from 'pages/HomePage';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Language = 'en' | 'ar';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    toggleLanguage: () => void;
    t: (key: string) => string;
    isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

// Translation dictionary
const translations = {
    en: {
        // App Name
        appName: 'Asl',
        appSubtitle: 'Digital Fragments, Eternal Heritage',

        // Navigation
        home: 'Home',
        artifacts: 'Artifacts',
        services: 'Services',
        dashboard: 'Dashboard',
        community: 'Community',
        about: 'About',
        login: 'Login',
        logout: 'Logout',
        profile: 'Profile',

        // Home Page
        homePageTitle: 'Preserve Egyptian Heritage Forever',
        homePageSubtitle: 'A next-generation Web3 platform leveraging Internet Computer Protocol (ICP) to document, verify, and protect Egyptian artifacts on-chain for eternity.',
        homePageExploreArtifacts: 'Explore Artifacts',
        homePageSubmitArtifact: 'Submit Artifact',

        heroTitle: 'Preserve Egyptian Heritage Forever',
        heroSubtitle: 'A next-generation Web3 platform leveraging Internet Computer Protocol (ICP) to document, verify, and protect Egyptian artifacts on-chain for eternity.',
        exploreArtifacts: 'Explore Artifacts',
        submitArtifact: 'Submit Artifact',

        // Features
        featuresTitle: 'Core Features',
        featuresSubtitle: 'Discover how we\'re revolutionizing heritage preservation through cutting-edge blockchain technology',
        immutableRegistry: 'Immutable Artifact Registry',
        immutableRegistryDesc: 'Each artifact has a permanent, tamper-proof record with metadata, images, and history stored on-chain.',
        proofOfHeritage: 'Proof-of-Heritage NFTs',
        proofOfHeritageDesc: 'Each verified artifact gets a non-transferable NFT to prove authenticity, not for trade, but for building a trusted heritage ledger.',
        communityDAO: 'Community-Powered DAO Moderation',
        communityDAODesc: 'Experts and heritage lovers vote on authenticity and status updates using a lightweight DAO system.',
        verifiedSubmissions: 'Verified Submissions via Internet Identity',
        verifiedSubmissionsDesc: 'Only trusted institutions (museums, scholars) can submit via a secure digital identity, ensuring data credibility.',
        learnMore: 'Learn More',

        // How It Works
        howItWorksTitle: 'How It Works',
        howItWorksSubtitle: 'A simple three-step process to preserve heritage for future generations',
        discoverTitle: 'Discover & Document',
        discoverDescription: 'Institutions and experts submit artifacts with detailed documentation, images, and historical context.',
        verifyTitle: 'Community Verification',
        verifyDescription: 'Our DAO community of experts reviews and validates each submission for authenticity and accuracy.',
        preserveTitle: 'Eternal Preservation',
        preserveDescription: 'Verified artifacts are permanently stored on the blockchain with immutable proof-of-heritage NFTs.',

        // Platform Stats
        platformStatsTitle: 'Preserving History, One Artifact at a Time',
        platformStatsSubtitle: 'Join thousands of heritage enthusiasts in building the world\'s most trusted digital heritage archive',
        artifactsPreserved: 'Artifacts Preserved',
        verifiedInstitutions: 'Verified Institutions',
        expertValidators: 'Expert Validators',
        yearsOfPreservation: 'Years of Preservation',

        // Why Choose Us
        whyChooseUsTitle: 'Why Choose Our Platform?',
        whyChooseUsSubtitle: 'Leading the way in digital heritage preservation with proven technology and expert validation',
        immutableRecordTitle: 'Immutable Records',
        immutableRecordDescription: 'Your artifacts are secured forever with blockchain technology that cannot be altered or deleted.',
        expertValidationTitle: 'Expert Validation',
        expertValidationDescription: 'Every submission is reviewed by qualified archaeologists, historians, and heritage specialists.',
        globalAccessTitle: 'Global Accessibility',
        globalAccessDescription: 'Access your heritage collection from anywhere in the world, 24/7, through our decentralized platform.',
        futureProofTitle: 'Future-Proof Technology',
        futureProofDescription: 'Built on Internet Computer Protocol, ensuring your heritage survives technological changes.',
        digitalPreservation: 'Digital Preservation in Action',
        digitalPreservationDesc: 'Watch as artifacts are scanned, documented, and preserved for eternity',
        scanningProgress: 'Scanning Progress',

        // Call to Action
        joinPreservationTitle: 'Join the Heritage Preservation Revolution',
        joinPreservationSubtitle: 'Be part of the global movement to preserve our shared cultural heritage for future generations.',
        exploreCollection: 'Explore Collection',

        // Authentication
        loginRequired: 'Please login to access this feature',
        authenticationSuccess: 'Authentication successful',
        authenticationFailed: 'Authentication failed',

        // Common
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        save: 'Save',
        edit: 'Edit',
        delete: 'Delete',
        confirm: 'Confirm',
        returnToTop: 'Return to Top',

        // Footer
        footerDesc: 'Preserving Egyptian heritage through blockchain technology',
        allRightsReserved: 'All rights reserved',
        builtWith: 'Built with',
        on: 'on',
        internetComputer: 'Internet Computer',

        // Social Media & Team
        followUs: 'Follow Us',
        socialMedia: 'Social Media',
        ourTeam: 'Our Team',
        teamMembers: 'Team Members',
        fullStackDev: 'Full Stack & Blockchain Dev',
        creativeStrategist: 'Creative Strategist & Digital Narrator',
        visitProfile: 'Visit Profile',
        connectLinkedIn: 'Connect on LinkedIn',
        exploreMore: 'Explore More',
        joinCommunity: 'Join Our Community',
        pharaohsLegacy: "Guardian of Pharaoh's Digital Legacy",
        ancientWisdom: 'Ancient Wisdom, Modern Technology',
    },
    ar: {
        // App Name
        appName: 'أصل',
        appSubtitle: 'شظايا رقمية، تراث أبدي',

        // Navigation
        home: 'الرئيسية',
        artifacts: 'الآثار',
        services: 'الخدمات',
        dashboard: 'لوحة القيادة',
        community: 'المجتمع',
        about: 'حول',
        login: 'تسجيل الدخول',
        logout: 'تسجيل الخروج',
        profile: 'الملف الشخصي',

        // Home Page
        homePageTitle: 'احفظ التراث المصري إلى الأبد',
        homePageSubtitle: 'منصة ويب 3 من الجيل التالي تستفيد من بروتوكول الإنترنت الحاسوبي (ICP) لتوثيق والتحقق من وحماية الآثار المصرية على البلوك تشين إلى الأبد.',
        homePageExploreArtifacts: 'استكشف الآثار',
        homePageSubmitArtifact: 'أضف أثر',

        heroTitle: 'احفظ التراث المصري إلى الأبد',
        heroSubtitle: 'منصة ويب 3 من الجيل التالي تستفيد من بروتوكول الإنترنت الحاسوبي (ICP) لتوثيق والتحقق من وحماية الآثار المصرية على البلوك تشين إلى الأبد.',
        exploreArtifacts: 'استكشف الآثار',
        submitArtifact: 'أضف أثر',

        // Features
        featuresTitle: 'الميزات الأساسية',
        featuresSubtitle: 'اكتشف كيف نُحدث ثورة في الحفاظ على التراث من خلال تقنية البلوك تشين المتطورة',
        immutableRegistry: 'سجل آثار غير قابل للتغيير',
        immutableRegistryDesc: 'كل أثر له سجل دائم وآمن من التلاعب مع البيانات الوصفية والصور والتاريخ المخزن على البلوك تشين.',
        proofOfHeritage: 'رموز غير قابلة للاستبدال لإثبات التراث',
        proofOfHeritageDesc: 'كل أثر تم التحقق منه يحصل على رمز غير قابل للتحويل لإثبات الأصالة، ليس للتداول، ولكن لبناء دفتر تراث موثوق.',
        communityDAO: 'إشراف DAO مدعوم من المجتمع',
        communityDAODesc: 'الخبراء ومحبي التراث يصوتون على الأصالة وتحديثات الحالة باستخدام نظام DAO خفيف الوزن.',
        verifiedSubmissions: 'تقديمات محققة عبر هوية الإنترنت',
        verifiedSubmissionsDesc: 'فقط المؤسسات الموثقة (المتاحف، الباحثين) يمكنها التقديم عبر هوية رقمية آمنة، مما يضمن مصداقية البيانات.',
        learnMore: 'تعلم المزيد',

        // How It Works
        howItWorksTitle: 'كيف يعمل',
        howItWorksSubtitle: 'عملية بسيطة من ثلاث خطوات للحفاظ على التراث للأجيال القادمة',
        discoverTitle: 'اكتشف ووثق',
        discoverDescription: 'المؤسسات والخبراء يقدمون الآثار مع التوثيق التفصيلي والصور والسياق التاريخي.',
        verifyTitle: 'التحقق من المجتمع',
        verifyDescription: 'مجتمع DAO من الخبراء يراجع ويصادق على كل تقديم للأصالة والدقة.',
        preserveTitle: 'الحفظ الأبدي',
        preserveDescription: 'الآثار المتحقق منها مخزنة بشكل دائم على البلوك تشين مع رموز إثبات التراث غير القابلة للتغيير.',

        // Platform Stats
        platformStatsTitle: 'حفظ التاريخ، أثر واحد في كل مرة',
        platformStatsSubtitle: 'انضم إلى آلاف عشاق التراث في بناء أكثر أرشيف تراث رقمي موثوق في العالم',
        artifactsPreserved: 'الآثار المحفوظة',
        verifiedInstitutions: 'المؤسسات المتحققة',
        expertValidators: 'المدققون الخبراء',
        yearsOfPreservation: 'سنوات الحفظ',

        // Why Choose Us
        whyChooseUsTitle: 'لماذا تختار منصتنا؟',
        whyChooseUsSubtitle: 'نقود الطريق في الحفاظ على التراث الرقمي بتقنية مثبتة وتحقق الخبراء',
        immutableRecordTitle: 'سجلات غير قابلة للتغيير',
        immutableRecordDescription: 'آثارك محمية إلى الأبد بتقنية البلوك تشين التي لا يمكن تغييرها أو حذفها.',
        expertValidationTitle: 'تحقق الخبراء',
        expertValidationDescription: 'كل تقديم يتم مراجعته من قبل علماء آثار مؤهلين ومؤرخين ومتخصصين في التراث.',
        globalAccessTitle: 'الوصول العالمي',
        globalAccessDescription: 'الوصول إلى مجموعة التراث الخاصة بك من أي مكان في العالم، 24/7، من خلال منصتنا اللامركزية.',
        futureProofTitle: 'تقنية مقاومة للمستقبل',
        futureProofDescription: 'مبنية على بروتوكول الإنترنت الحاسوبي، مما يضمن أن تراثك يستمر رغم التغييرات التقنية.',
        digitalPreservation: 'الحفظ الرقمي في العمل',
        digitalPreservationDesc: 'شاهد كيف يتم مسح الآثار وتوثيقها وحفظها إلى الأبد',
        scanningProgress: 'تقدم المسح',

        // Call to Action
        joinPreservationTitle: 'انضم إلى ثورة الحفاظ على التراث',
        joinPreservationSubtitle: 'كن جزءاً من الحركة العالمية للحفاظ على تراثنا الثقافي المشترك للأجيال القادمة.',
        exploreCollection: 'استكشف المجموعة',

        // Authentication
        loginRequired: 'يرجى تسجيل الدخول للوصول إلى هذه الميزة',
        authenticationSuccess: 'تم التوثيق بنجاح',
        authenticationFailed: 'فشل في التوثيق',

        // Common
        loading: 'جاري التحميل...',
        error: 'خطأ',
        success: 'نجح',
        cancel: 'إلغاء',
        save: 'حفظ',
        edit: 'تعديل',
        delete: 'حذف',
        confirm: 'تأكيد',
        returnToTop: 'العودة إلى الأعلى',

        // Footer
        footerDesc: 'الحفاظ على التراث المصري من خلال تقنية البلوك تشين',
        allRightsReserved: 'جميع الحقوق محفوظة',
        builtWith: 'مبني باستخدام',
        on: 'على',
        internetComputer: 'إنترنت كمبيوتر',

        // Social Media & Team
        followUs: 'تابعنا',
        socialMedia: 'وسائل التواصل الاجتماعي',
        ourTeam: 'فريقنا',
        teamMembers: 'أعضاء الفريق',
        fullStackDev: 'مطور فول ستاك و بلوك تشين',
        creativeStrategist: 'استراتيجي إبداعي وراوي رقمي',
        visitProfile: 'زيارة الملف الشخصي',
        connectLinkedIn: 'تواصل على لينكد إن',
        exploreMore: 'استكشف المزيد',
        joinCommunity: 'انضم إلى مجتمعنا',
        pharaohsLegacy: 'حارس التراث الرقمي للفراعنة',
        ancientWisdom: 'حكمة قديمة، تكنولوجيا حديثة',
    }
};

interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        const savedLanguage = localStorage.getItem('language') as Language;
        return savedLanguage || 'en';
    });

    useEffect(() => {
        localStorage.setItem('language', language);

        // Update document direction and lang attribute
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
    }, [language]);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
    };

    const toggleLanguage = () => {
        setLanguageState(prev => prev === 'en' ? 'ar' : 'en');
    };

    const t = (key: string): string => {
        return translations[language][key as keyof typeof translations[typeof language]] || key;
    };

    const isRTL = language === 'ar';

    const value = {
        language,
        setLanguage,
        toggleLanguage,
        t,
        isRTL,
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};
