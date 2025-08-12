import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { BackendService } from '../services/IntegratedBackendService';
import type { CreateProposalRequest, ProposalType, Artifact } from '../services/IntegratedBackendService';
import toast from 'react-hot-toast';

const CreateProposalPage: React.FC = () => {
    const { isAuthenticated, principal } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [artifacts, setArtifacts] = useState<Artifact[]>([]);
    const [loadingArtifacts, setLoadingArtifacts] = useState(true);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        proposal_type: 'VerifyArtifact' as string,
        artifact_id: '',
        voting_duration: 7, // days
        required_majority: 51, // percentage
        execution_payload: '',
        supporting_documents: [] as string[],
        newDocumentUrl: ''
    }); const proposalTypes = [
        { value: 'VerifyArtifact', label: 'Verify Artifact', icon: '✅', description: 'Propose verification of a submitted artifact' },
        { value: 'DisputeArtifact', label: 'Dispute Artifact', icon: '⚠️', description: 'Challenge the authenticity of an artifact' },
        { value: 'UpdateArtifactStatus', label: 'Update Artifact Status', icon: '🔄', description: 'Change the status of an existing artifact' },
        { value: 'GrantUserRole', label: 'Grant User Role', icon: '👑', description: 'Propose role changes for community members' }
    ];

    useEffect(() => {
        if (isAuthenticated) {
            loadArtifacts();
        }
    }, [isAuthenticated]);

    const loadArtifacts = async () => {
        try {
            setLoadingArtifacts(true);
            const allArtifacts = await BackendService.getAllArtifacts();
            setArtifacts(allArtifacts);
        } catch (error) {
            console.error('Failed to load artifacts:', error);
            toast.error('Failed to load artifacts');
        } finally {
            setLoadingArtifacts(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addDocument = () => {
        if (formData.newDocumentUrl) {
            setFormData(prev => ({
                ...prev,
                supporting_documents: [...prev.supporting_documents, prev.newDocumentUrl],
                newDocumentUrl: ''
            }));
        }
    };

    const removeDocument = (index: number) => {
        setFormData(prev => ({
            ...prev,
            supporting_documents: prev.supporting_documents.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isAuthenticated || !principal) {
            toast.error('Please connect your wallet first');
            return;
        }

        if (!formData.title || !formData.description) {
            toast.error('Please fill in all required fields');
            return;
        }

        // Validate artifact selection for artifact-related proposals
        if (['VerifyArtifact', 'DisputeArtifact', 'UpdateArtifactStatus'].includes(formData.proposal_type as string) && !formData.artifact_id) {
            toast.error('Please select an artifact for this proposal type');
            return;
        }

        // Validate that the selected artifact exists
        if (formData.artifact_id) {
            const selectedArtifact = artifacts.find(a => a.id.toString() === formData.artifact_id);
            if (!selectedArtifact) {
                toast.error('Selected artifact is not valid. Please select a different artifact.');
                return;
            }
            console.log('Selected artifact:', selectedArtifact);
        }

        setLoading(true);
        try {
            console.log('Creating proposal with form data:', formData);

            const proposalRequest: CreateProposalRequest = {
                title: formData.title,
                description: formData.description,
                proposal_type: BackendService.createProposalType(formData.proposal_type as any),
                artifact_id: formData.artifact_id ? [BigInt(formData.artifact_id)] : [],
                voting_duration_hours: BigInt(formData.voting_duration * 24), // Convert days to hours
                execution_payload: formData.execution_payload ? [formData.execution_payload] : [],
            };

            console.log('Proposal request to be sent:', proposalRequest);
            console.log('Artifact ID being used:', formData.artifact_id);

            const proposalId = await BackendService.createProposal(proposalRequest);
            console.log('Proposal created with ID:', proposalId);

            toast.success(`Proposal created successfully! ID: ${proposalId}`);
            navigate('/services'); // Navigate to services page where proposals are shown
        } catch (error) {
            console.error('Failed to create proposal:', error);
            toast.error('Failed to create proposal. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
                <div className="text-center space-y-6">
                    <div className="text-6xl">🏛️</div>
                    <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                        Authentication Required
                    </h2>
                    <p className="text-amber-700 dark:text-amber-300">
                        Please connect your Internet Identity to create proposals
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
                        🏛️ Create New Proposal
                    </h1>
                    <p className="text-amber-700 dark:text-amber-300 text-lg">
                        Participate in community governance and decision making
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-amber-200/50 dark:border-amber-800/50 shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Proposal Type */}
                        <div>
                            <label className="block text-sm font-medium text-amber-900 dark:text-amber-100 mb-3">
                                Proposal Type *
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {proposalTypes.map((type) => (
                                    <label
                                        key={type.value}
                                        className={`relative cursor-pointer p-4 border-2 rounded-lg transition-all duration-200 ${formData.proposal_type === type.value
                                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                                            : 'border-amber-200 dark:border-amber-700 hover:border-amber-300 dark:hover:border-amber-600'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="proposal_type"
                                            value={type.value}
                                            checked={formData.proposal_type === type.value}
                                            onChange={handleInputChange}
                                            className="sr-only"
                                        />
                                        <div className="flex items-start space-x-3">
                                            <div className="text-2xl">{type.icon}</div>
                                            <div>
                                                <div className="font-medium text-amber-900 dark:text-amber-100">
                                                    {type.label}
                                                </div>
                                                <div className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                                                    {type.description}
                                                </div>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-amber-900 dark:text-amber-100 mb-2">
                                    Proposal Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-amber-300 dark:border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/90 dark:bg-gray-700/90 text-amber-900 dark:text-amber-100"
                                    placeholder="e.g., Verify Golden Scarab Amulet"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-amber-900 dark:text-amber-100 mb-2">
                                    Voting Duration (days)
                                </label>
                                <input
                                    type="number"
                                    name="voting_duration"
                                    value={formData.voting_duration}
                                    onChange={handleInputChange}
                                    min="1"
                                    max="30"
                                    className="w-full px-4 py-3 border border-amber-300 dark:border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/90 dark:bg-gray-700/90 text-amber-900 dark:text-amber-100"
                                />
                            </div>
                        </div>

                        {/* Artifact Selection (for relevant proposal types) */}
                        {['VerifyArtifact', 'DisputeArtifact', 'UpdateArtifactStatus'].includes(formData.proposal_type as string) && (
                            <div>
                                <label className="block text-sm font-medium text-amber-900 dark:text-amber-100 mb-2">
                                    Select Artifact *
                                </label>
                                <select
                                    name="artifact_id"
                                    value={formData.artifact_id}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-amber-300 dark:border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/90 dark:bg-gray-700/90 text-amber-900 dark:text-amber-100"
                                >
                                    <option value="">Select an artifact...</option>
                                    {loadingArtifacts ? (
                                        <option disabled>Loading artifacts...</option>
                                    ) : (
                                        artifacts.map((artifact) => (
                                            <option key={artifact.id} value={artifact.id.toString()}>
                                                {artifact.name || `Artifact ${artifact.id}`} (Status: {typeof artifact.status === 'string' ? artifact.status : Object.keys(artifact.status || {}).join(', ') || 'Pending'})
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>
                        )}

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-amber-900 dark:text-amber-100 mb-2">
                                Proposal Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                rows={6}
                                className="w-full px-4 py-3 border border-amber-300 dark:border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/90 dark:bg-gray-700/90 text-amber-900 dark:text-amber-100"
                                placeholder="Detailed explanation of the proposal, rationale, and expected outcomes..."
                            />
                        </div>

                        {/* Execution Payload (optional) */}
                        <div>
                            <label className="block text-sm font-medium text-amber-900 dark:text-amber-100 mb-2">
                                Execution Instructions (Optional)
                            </label>
                            <textarea
                                name="execution_payload"
                                value={formData.execution_payload}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-4 py-3 border border-amber-300 dark:border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/90 dark:bg-gray-700/90 text-amber-900 dark:text-amber-100"
                                placeholder="Specific actions to be taken if proposal passes..."
                            />
                        </div>

                        {/* Required Majority */}
                        <div>
                            <label className="block text-sm font-medium text-amber-900 dark:text-amber-100 mb-2">
                                Required Majority (%)
                            </label>
                            <input
                                type="number"
                                name="required_majority"
                                value={formData.required_majority}
                                onChange={handleInputChange}
                                min="1"
                                max="100"
                                className="w-full px-4 py-3 border border-amber-300 dark:border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/90 dark:bg-gray-700/90 text-amber-900 dark:text-amber-100"
                            />
                            <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                                Percentage of votes required for proposal to pass
                            </p>
                        </div>

                        {/* Supporting Documents */}
                        <div>
                            <label className="block text-sm font-medium text-amber-900 dark:text-amber-100 mb-2">
                                Supporting Documents
                            </label>
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <input
                                        type="url"
                                        value={formData.newDocumentUrl}
                                        onChange={(e) => setFormData(prev => ({ ...prev, newDocumentUrl: e.target.value }))}
                                        className="flex-1 px-4 py-2 border border-amber-300 dark:border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/90 dark:bg-gray-700/90 text-amber-900 dark:text-amber-100"
                                        placeholder="Document URL (https://...)"
                                    />
                                    <button
                                        type="button"
                                        onClick={addDocument}
                                        className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>
                                {formData.supporting_documents.length > 0 && (
                                    <div className="space-y-2">
                                        {formData.supporting_documents.map((doc, index) => (
                                            <div key={index} className="flex items-center justify-between bg-amber-50 dark:bg-gray-700 p-3 rounded-lg">
                                                <span className="text-sm text-amber-700 dark:text-amber-300 truncate">{doc}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeDocument(index)}
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
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Proposal...
                                    </span>
                                ) : (
                                    '🏛️ Create Proposal'
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Help Section */}
                <div className="mt-8 bg-blue-100/50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200/50 dark:border-blue-800/50">
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                        🏛️ DAO Governance Guidelines
                    </h3>
                    <ul className="space-y-2 text-blue-800 dark:text-blue-200">
                        <li>• <strong>Verify Artifact:</strong> Propose to verify the authenticity of submitted artifacts</li>
                        <li>• <strong>Dispute Artifact:</strong> Challenge artifacts that may be inauthentic or improperly documented</li>
                        <li>• <strong>Update Status:</strong> Propose changes to artifact status based on new evidence</li>
                        <li>• <strong>Grant Role:</strong> Nominate community members for elevated roles (Expert, Moderator)</li>
                        <li>• All proposals are subject to community voting with transparent results</li>
                        <li>• Higher stake holders have proportionally weighted votes</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CreateProposalPage;
