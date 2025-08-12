// import React from 'react';
// import { useAuth } from '../contexts/AuthContext';

// const SimpleDashboard: React.FC = () => {
//     const { isAuthenticated } = useAuth();

//     if (!isAuthenticated) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
//                 <div className="text-center space-y-6">
//                     <div className="text-6xl">🏛️</div>
//                     <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100">
//                         Authentication Required
//                     </h2>
//                     <p className="text-amber-700 dark:text-amber-300">
//                         Please connect your Internet Identity to access the dashboard
//                     </p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 py-8">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="text-center mb-8">
//                     <h1 className="text-4xl font-bold text-amber-900 dark:text-amber-100 font-serif mb-4">
//                         ⚱️ Heritage Dashboard
//                     </h1>
//                     <p className="text-amber-700 dark:text-amber-300 text-lg">
//                         Overview of your heritage preservation activities
//                     </p>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                     <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-amber-200/50 dark:border-amber-800/50 shadow-lg">
//                         <div className="text-center">
//                             <div className="text-3xl mb-2">🏺</div>
//                             <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">0</div>
//                             <div className="text-sm text-amber-600 dark:text-amber-400">Artifacts</div>
//                         </div>
//                     </div>

//                     <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-blue-200/50 dark:border-blue-800/50 shadow-lg">
//                         <div className="text-center">
//                             <div className="text-3xl mb-2">🏛️</div>
//                             <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">0</div>
//                             <div className="text-sm text-blue-600 dark:text-blue-400">Proposals</div>
//                         </div>
//                     </div>

//                     <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-purple-200/50 dark:border-purple-800/50 shadow-lg">
//                         <div className="text-center">
//                             <div className="text-3xl mb-2">🎭</div>
//                             <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">0</div>
//                             <div className="text-sm text-purple-600 dark:text-purple-400">NFTs</div>
//                         </div>
//                     </div>

//                     <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-green-200/50 dark:border-green-800/50 shadow-lg">
//                         <div className="text-center">
//                             <div className="text-3xl mb-2">⭐</div>
//                             <div className="text-2xl font-bold text-green-900 dark:text-green-100">0</div>
//                             <div className="text-sm text-green-600 dark:text-green-400">Reputation</div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 border border-amber-200/50 dark:border-amber-800/50 shadow-lg">
//                     <div className="text-center py-12">
//                         <div className="text-6xl mb-4">🚧</div>
//                         <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100 mb-2">
//                             Dashboard Data Loading
//                         </h3>
//                         <p className="text-amber-700 dark:text-amber-300">
//                             Your heritage platform data will be displayed here once the backend is connected.
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SimpleDashboard;



const SimpleDashboard = () => {
    return (
        <div>SimpleDashboard</div>
    )
}

export default SimpleDashboard