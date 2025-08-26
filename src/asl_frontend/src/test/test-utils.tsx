import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'

// Mock providers since they might not exist yet
const MockLanguageProvider = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
const MockThemeProvider = ({ children }: { children: React.ReactNode }) => <div>{children}</div>

// Mock data for testing
export const mockArtifact = {
    id: 'artifact_1',
    name: 'Tutankhamun Mask',
    description: 'Golden burial mask of the pharaoh Tutankhamun',
    category: 'Royal Artifacts',
    period: 'New Kingdom',
    location: 'Valley of the Kings',
    images: ['mask1.jpg', 'mask2.jpg'],
    creator: 'test_user',
    created_at: BigInt(Date.now() * 1000000),
    metadata: {},
    tags: ['tutankhamun', 'golden', 'pharaoh'],
    verification_status: 'verified',
    likes: 15,
    views: 250
}

export const mockCommunity = {
    id: 'community_1',
    name: 'Ancient Egypt Enthusiasts',
    description: 'A community for people passionate about ancient Egyptian culture',
    creator: 'test_admin',
    members: ['user1', 'user2', 'user3'],
    moderators: ['test_admin'],
    created_at: BigInt(Date.now() * 1000000),
    category: 'Historical Research',
    is_public: true,
    member_count: 3,
    post_count: 10
}

export const mockUser = {
    id: 'test_user',
    username: 'TestUser',
    bio: 'Passionate about Egyptian archaeology',
    location: 'Cairo, Egypt',
    created_at: BigInt(Date.now() * 1000000),
    reputation_score: 750,
    artifacts_contributed: 5,
    communities_joined: 3,
    followers: 25,
    following: 15
}

export const mockProposal = {
    id: 'proposal_1',
    title: 'Implement AI Analysis',
    description: 'Add AI-powered artifact analysis features',
    creator: 'test_admin',
    proposal_type: 'FeatureRequest',
    yes_votes: 75,
    no_votes: 25,
    voters: ['user1', 'user2', 'user3'],
    created_at: BigInt(Date.now() * 1000000),
    voting_ends_at: BigInt((Date.now() + 604800000) * 1000000), // 1 week from now
    status: 'Active',
    execution_payload: null
}

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
    initialEntries?: string[]
    route?: string
}

export const renderWithProviders = (
    ui: ReactElement,
    options: CustomRenderOptions = {}
) => {
    const { initialEntries = ['/'], route = '/', ...renderOptions } = options

    const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
        return (
            <BrowserRouter>
                <MockThemeProvider>
                    <MockLanguageProvider>
                        {children}
                    </MockLanguageProvider>
                </MockThemeProvider>
            </BrowserRouter>
        )
    }

    return render(ui, { wrapper: AllTheProviders, ...renderOptions })
}

// Helper function to create mock backend service
export const createMockBackendService = () => ({
    getPlatformStats: vi.fn().mockResolvedValue({
        total_artifacts: 150,
        total_users: 500,
        total_communities: 25,
        total_proposals: 10,
        active_users_monthly: 200,
        artifacts_created_monthly: 45,
    }),
    getUserProfile: vi.fn().mockResolvedValue(mockUser),
    getArtifacts: vi.fn().mockResolvedValue([mockArtifact]),
    getArtifact: vi.fn().mockResolvedValue(mockArtifact),
    createArtifact: vi.fn().mockResolvedValue('artifact_1'),
    getCommunities: vi.fn().mockResolvedValue([mockCommunity]),
    getCommunity: vi.fn().mockResolvedValue(mockCommunity),
    createCommunity: vi.fn().mockResolvedValue('community_1'),
    joinCommunity: vi.fn().mockResolvedValue(true),
    getProposals: vi.fn().mockResolvedValue([mockProposal]),
    createProposal: vi.fn().mockResolvedValue('proposal_1'),
    voteOnProposal: vi.fn().mockResolvedValue(true),
    createUserProfile: vi.fn().mockResolvedValue('test_user'),
    updateUserProfile: vi.fn().mockResolvedValue(true),
})

// Helper function to wait for async operations
export const waitForAsyncOperation = () => new Promise(resolve => setTimeout(resolve, 0))

// Mock local storage
export const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
})

// Export everything for easy imports
export * from '@testing-library/react'
export { vi } from 'vitest'
