import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders, mockArtifact } from '../../test/test-utils'
import Dashboard from '../Dashboard'

// Mock the backend service methods
vi.mock('../../services/IntegratedBackendService', () => ({
    BackendService: {
        getPlatformStats: vi.fn().mockResolvedValue({
            total_artifacts: BigInt(150),
            total_users: BigInt(500),
            total_communities: BigInt(25),
            total_proposals: BigInt(10),
        }),
        getArtifacts: vi.fn().mockResolvedValue([mockArtifact]),
        getUserProfile: vi.fn().mockResolvedValue(null),
        getProposals: vi.fn().mockResolvedValue([]),
    },
}))

// Mock the context providers
vi.mock('../../contexts/AuthContext', () => ({
    useAuth: vi.fn(() => ({
        isAuthenticated: false,
        principal: null,
        login: vi.fn(),
        logout: vi.fn(),
    }))
}))

vi.mock('../../contexts/LanguageContext', () => ({
    useLanguage: vi.fn(() => ({
        t: (key: string) => key,
        isRTL: false,
        language: 'en',
        setLanguage: vi.fn(),
    }))
}))

describe('Dashboard Component', () => {
    it('renders dashboard with platform statistics', async () => {
        renderWithProviders(<Dashboard />)

        // Check for main dashboard elements
        expect(screen.getByText(/platform statistics/i)).toBeInTheDocument()

        // Wait for stats to load
        await waitFor(() => {
            expect(screen.getByText('150')).toBeInTheDocument() // total artifacts
            expect(screen.getByText('500')).toBeInTheDocument() // total users
            expect(screen.getByText('25')).toBeInTheDocument() // total communities
        })
    })

    it('displays recent artifacts section', async () => {
        renderWithProviders(<Dashboard />)

        await waitFor(() => {
            expect(screen.getByText(/recent artifacts/i)).toBeInTheDocument()
            expect(screen.getByText(mockArtifact.name)).toBeInTheDocument()
        })
    })

    it('shows loading state initially', () => {
        renderWithProviders(<Dashboard />)

        expect(screen.getByText(/loading/i)).toBeInTheDocument()
    })

    it('handles navigation to different sections', async () => {
        renderWithProviders(<Dashboard />)

        // Wait for component to load
        await waitFor(() => {
            expect(screen.getByText(/platform statistics/i)).toBeInTheDocument()
        })

        // Test navigation buttons
        const artifactsButton = screen.getByRole('button', { name: /view all artifacts/i })
        fireEvent.click(artifactsButton)

        // Should navigate to artifacts page (mocked router)
        expect(artifactsButton).toBeInTheDocument()
    })

    it('displays user-specific content when authenticated', async () => {
        // Mock the service for this test
        const mockBackendService = await import('../../services/IntegratedBackendService')
        vi.mocked(mockBackendService.BackendService.getUserProfile)
            .mockResolvedValueOnce({
                institution: ['Test Institution'],
                role: { 'Expert': null },
                reputation: 750,
                verified_at: [BigInt(Date.now())],
                specialization: ['Testing'],
            })

        renderWithProviders(<Dashboard />)

        await waitFor(() => {
            expect(screen.getByText(/welcome back/i)).toBeInTheDocument()
            expect(screen.getByText('TestUser')).toBeInTheDocument()
        })
    })

    it('handles error states gracefully', async () => {
        // Mock API error
        const mockBackendService = await import('../../services/IntegratedBackendService')
        vi.mocked(mockBackendService.BackendService.getPlatformStats)
            .mockRejectedValueOnce(new Error('Network error'))

        renderWithProviders(<Dashboard />)

        await waitFor(() => {
            expect(screen.getByText(/error loading dashboard/i)).toBeInTheDocument()
        })
    })

    it('is responsive and renders on different screen sizes', () => {
        // Test mobile view
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 375,
        })

        renderWithProviders(<Dashboard />)

        expect(screen.getByTestId('dashboard-container')).toHaveClass('mobile-responsive')
    })
})
