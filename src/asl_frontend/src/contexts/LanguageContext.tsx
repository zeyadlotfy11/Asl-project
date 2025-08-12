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
        homePageTitle: 'Home Page',
        homePageSubtitle: 'Welcome to the ASL Artifacts System',
        homePageExploreArtifacts: 'Explore Artifacts',
        homePageSubmitArtifact: 'Submit Artifact',


        heroTitle: 'Preserve Egyptian Heritage Forever',
        heroSubtitle: 'A next-generation Web3 platform leveraging Internet Computer Protocol (ICP) to document, verify, and protect Egyptian artifacts on-chain for eternity.',
        exploreArtifacts: 'Explore Artifacts',
        submitArtifact: 'Submit Artifact',

        // Features
        featuresTitle: 'Core Features',
        immutableRegistry: 'Immutable Artifact Registry',
        immutableRegistryDesc: 'Each artifact has a permanent, tamper-proof record with metadata, images, and history stored on-chain.',
        proofOfHeritage: 'Proof-of-Heritage NFTs',
        proofOfHeritageDesc: 'Each verified artifact gets a non-transferable NFT to prove authenticity, not for trade, but for building a trusted heritage ledger.',
        communityDAO: 'Community-Powered DAO Moderation',
        communityDAODesc: 'Experts and heritage lovers vote on authenticity and status updates using a lightweight DAO system.',
        verifiedSubmissions: 'Verified Submissions via Internet Identity',
        verifiedSubmissionsDesc: 'Only trusted institutions (museums, scholars) can submit via a secure digital identity, ensuring data credibility.',

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
        homePageTitle: 'الصفحة الرئيسية',
        homePageSubtitle: 'مرحبًا بكم في أصل، حيث نعيد الحياة إلى التراث المصري.',
        homePageExploreArtifacts: 'استكشف الآثار',
        homePageSubmitArtifact: 'أضف أثر',



        // Features
        featuresTitle: 'الميزات الأساسية',
        immutableRegistry: 'سجل آثار غير قابل للتغيير',
        immutableRegistryDesc: 'كل أثر له سجل دائم وآمن من التلاعب مع البيانات الوصفية والصور والتاريخ المخزن على البلوك تشين.',
        proofOfHeritage: 'رموز غير قابلة للاستبدال لإثبات التراث',
        proofOfHeritageDesc: 'كل أثر تم التحقق منه يحصل على رمز غير قابل للتحويل لإثبات الأصالة، ليس للتداول، ولكن لبناء دفتر تراث موثوق.',
        communityDAO: 'إشراف DAO مدعوم من المجتمع',
        communityDAODesc: 'الخبراء ومحبي التراث يصوتون على الأصالة وتحديثات الحالة باستخدام نظام DAO خفيف الوزن.',
        verifiedSubmissions: 'تقديمات محققة عبر هوية الإنترنت',
        verifiedSubmissionsDesc: 'فقط المؤسسات الموثقة (المتاحف، الباحثين) يمكنها التقديم عبر هوية رقمية آمنة، مما يضمن مصداقية البيانات.',

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
