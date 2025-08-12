import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { BackendService } from '../services/IntegratedBackendService';
import type { CreateArtifactRequest } from '../services/IntegratedBackendService';
import toast from 'react-hot-toast';

const CreateArtifactPage: React.FC = () => {
    const { isAuthenticated, principal } = useAuth();
    const { t, isRTL } = useLanguage();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        heritage_proof: '',
        location: '',
        time_period: '',
        cultural_significance: '',
        images: [] as string[],
        metadata: [] as Array<[string, string]>,
        newMetadataKey: '',
        newMetadataValue: '',
        newImageUrl: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addMetadata = () => {
        if (formData.newMetadataKey && formData.newMetadataValue) {
            setFormData(prev => ({
                ...prev,
                metadata: [...prev.metadata, [prev.newMetadataKey, prev.newMetadataValue]],
                newMetadataKey: '',
                newMetadataValue: ''
            }));
        }
    };

    const removeMetadata = (index: number) => {
        setFormData(prev => ({
            ...prev,
            metadata: prev.metadata.filter((_, i) => i !== index)
        }));
    };

    const addImage = () => {
        if (formData.newImageUrl) {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, prev.newImageUrl],
                newImageUrl: ''
            }));
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isAuthenticated || !principal) {
            toast.error('Please connect your wallet first');
            return;
        }

        if (!formData.name || !formData.description || !formData.heritage_proof) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            // Debug: Test connection first
            console.log('Testing connection...');
            console.log('Current location:', window.location.href);
            console.log('Hostname:', window.location.hostname);

            // TODO: Implement backend integration
            const artifactRequest: CreateArtifactRequest = {
                name: formData.name,
                description: formData.description,
                heritage_proof: [formData.heritage_proof],
                metadata: formData.metadata,
                images: formData.images
            };

            console.log('Artifact request:', artifactRequest);
            const artifactId = await BackendService.createArtifact(artifactRequest);
            console.log('Artifact created with ID:', artifactId);

            toast.success(`Artifact submission pending review!`);
            navigate('/artifacts');
        } catch (error) {
            console.error('Failed to create artifact:', error);

            toast.error('Failed to create artifact. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {

        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
                <div className="text-center space-y-6">
                    <div className="text-6xl">🏺</div>
                    <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                        Authentication Required
                    </h2>
                    <p className="text-amber-700 dark:text-amber-300">
                        Please connect your Internet Identity to create artifacts
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-amber-900 dark:text-amber-100 font-serif mb-4">
                        🏺 Create New Artifact
                    </h1>
                    <p className="text-amber-700 dark:text-amber-300 text-lg">
                        Document and preserve Egyptian heritage for eternity
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-amber-200/50 dark:border-amber-800/50 shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-amber-900 dark:text-amber-100 mb-2">
                                    Artifact Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-amber-300 dark:border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/90 dark:bg-gray-700/90 text-amber-900 dark:text-amber-100"
                                    placeholder="e.g., Golden Mask of Tutankhamun"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-amber-900 dark:text-amber-100 mb-2">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-amber-300 dark:border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/90 dark:bg-gray-700/90 text-amber-900 dark:text-amber-100"
                                    placeholder="e.g., Valley of the Kings, Luxor"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-amber-900 dark:text-amber-100 mb-2">
                                    Time Period
                                </label>
                                <input
                                    type="text"
                                    name="time_period"
                                    value={formData.time_period}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-amber-300 dark:border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/90 dark:bg-gray-700/90 text-amber-900 dark:text-amber-100"
                                    placeholder="e.g., New Kingdom, 18th Dynasty"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-amber-900 dark:text-amber-100 mb-2">
                                    Cultural Significance
                                </label>
                                <input
                                    type="text"
                                    name="cultural_significance"
                                    value={formData.cultural_significance}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-amber-300 dark:border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/90 dark:bg-gray-700/90 text-amber-900 dark:text-amber-100"
                                    placeholder="e.g., Royal burial mask, Religious artifact"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-amber-900 dark:text-amber-100 mb-2">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                rows={4}
                                className="w-full px-4 py-3 border border-amber-300 dark:border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/90 dark:bg-gray-700/90 text-amber-900 dark:text-amber-100"
                                placeholder="Detailed description of the artifact, its historical context, and significance..."
                            />
                        </div>

                        {/* Heritage Proof */}
                        <div>
                            <label className="block text-sm font-medium text-amber-900 dark:text-amber-100 mb-2">
                                Heritage Proof *
                            </label>
                            <textarea
                                name="heritage_proof"
                                value={formData.heritage_proof}
                                onChange={handleInputChange}
                                required
                                rows={3}
                                className="w-full px-4 py-3 border border-amber-300 dark:border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/90 dark:bg-gray-700/90 text-amber-900 dark:text-amber-100"
                                placeholder="Provide evidence of authenticity, provenance, documentation, or expert verification..."
                            />
                        </div>

                        {/* Images */}
                        <div>
                            <label className="block text-sm font-medium text-amber-900 dark:text-amber-100 mb-2">
                                Images
                            </label>
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <input
                                        type="url"
                                        value={formData.newImageUrl}
                                        onChange={(e) => setFormData(prev => ({ ...prev, newImageUrl: e.target.value }))}
                                        className="flex-1 px-4 py-2 border border-amber-300 dark:border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/90 dark:bg-gray-700/90 text-amber-900 dark:text-amber-100"
                                        placeholder="Image URL (https://...)"
                                    />
                                    <button
                                        type="button"
                                        onClick={addImage}
                                        className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>
                                {formData.images.length > 0 && (
                                    <div className="space-y-2">
                                        {formData.images.map((image, index) => (
                                            <div key={index} className="flex items-center justify-between bg-amber-50 dark:bg-gray-700 p-3 rounded-lg">
                                                <span className="text-sm text-amber-700 dark:text-amber-300 truncate">{image}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="text-red-600 hover:text-red-800 ml-2"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Metadata */}
                        <div>
                            <label className="block text-sm font-medium text-amber-900 dark:text-amber-100 mb-2">
                                Additional Metadata
                            </label>
                            <div className="space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <input
                                        type="text"
                                        value={formData.newMetadataKey}
                                        onChange={(e) => setFormData(prev => ({ ...prev, newMetadataKey: e.target.value }))}
                                        className="px-4 py-2 border border-amber-300 dark:border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/90 dark:bg-gray-700/90 text-amber-900 dark:text-amber-100"
                                        placeholder="Key (e.g., Material)"
                                    />
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={formData.newMetadataValue}
                                            onChange={(e) => setFormData(prev => ({ ...prev, newMetadataValue: e.target.value }))}
                                            className="flex-1 px-4 py-2 border border-amber-300 dark:border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/90 dark:bg-gray-700/90 text-amber-900 dark:text-amber-100"
                                            placeholder="Value (e.g., Gold)"
                                        />
                                        <button
                                            type="button"
                                            onClick={addMetadata}
                                            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                                {formData.metadata.length > 0 && (
                                    <div className="space-y-2">
                                        {formData.metadata.map(([key, value], index) => (
                                            <div key={index} className="flex items-center justify-between bg-amber-50 dark:bg-gray-700 p-3 rounded-lg">
                                                <span className="text-sm text-amber-700 dark:text-amber-300">
                                                    <strong>{key}:</strong> {value}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeMetadata(index)}
                                                    className="text-red-600 hover:text-red-800 ml-2"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4 pt-6">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="flex-1 px-6 py-3 border border-amber-300 dark:border-amber-600 text-amber-700 dark:text-amber-300 rounded-lg hover:bg-amber-50 dark:hover:bg-gray-700 transition-colors"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Artifact...
                                    </span>
                                ) : (
                                    '🏺 Create Artifact'
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Help Section */}
                <div className="mt-8 bg-amber-100/50 dark:bg-amber-900/20 rounded-xl p-6 border border-amber-200/50 dark:border-amber-800/50">
                    <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-3">
                        📋 Submission Guidelines
                    </h3>
                    <ul className="space-y-2 text-amber-800 dark:text-amber-200">
                        <li>• Provide accurate and detailed information about the artifact</li>
                        <li>• Include high-quality images and documentation when possible</li>
                        <li>• Heritage proof should include provenance, expert opinions, or historical documentation</li>
                        <li>• All submissions are subject to community verification and expert review</li>
                        <li>• Verified artifacts become eligible for Heritage NFT minting</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CreateArtifactPage;
