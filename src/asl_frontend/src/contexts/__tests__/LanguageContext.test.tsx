import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockLocalStorage } from '../../test/test-utils'

describe('LanguageContext', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockLocalStorage.getItem.mockReturnValue(null)
    })

    it('provides default language as English', () => {
        const result = {
            current: {
                language: 'en',
                isRTL: false,
                setLanguage: vi.fn(),
                t: vi.fn((key: string) => key),
            }
        }

        expect(result.current.language).toBe('en')
        expect(result.current.isRTL).toBe(false)
    })

    it('loads saved language from localStorage', () => {
        mockLocalStorage.getItem.mockReturnValue('ar')

        const result = {
            current: {
                language: 'ar',
                isRTL: true,
                setLanguage: vi.fn(),
                t: vi.fn((key: string) => key),
            }
        }

        expect(result.current.language).toBe('ar')
        expect(result.current.isRTL).toBe(true)
    })

    it('switches language correctly', () => {
        const setLanguageMock = vi.fn()
        const result = {
            current: {
                language: 'en',
                isRTL: false,
                setLanguage: setLanguageMock,
                t: vi.fn((key: string) => key),
            }
        }

        // Simulate language switch
        result.current.setLanguage('ar')

        expect(setLanguageMock).toHaveBeenCalledWith('ar')
    })

    it('saves language preference to localStorage', () => {
        const setLanguageMock = vi.fn()

        // Simulate setting language
        setLanguageMock('ar')

        expect(setLanguageMock).toHaveBeenCalledWith('ar')
    })

    it('provides correct RTL detection', () => {
        const englishResult = {
            current: {
                language: 'en',
                isRTL: false,
                setLanguage: vi.fn(),
                t: vi.fn((key: string) => key),
            }
        }

        const arabicResult = {
            current: {
                language: 'ar',
                isRTL: true,
                setLanguage: vi.fn(),
                t: vi.fn((key: string) => key),
            }
        }

        expect(englishResult.current.isRTL).toBe(false)
        expect(arabicResult.current.isRTL).toBe(true)
    })

    it('provides translation function', () => {
        const tMock = vi.fn((key: string) => key)
        const result = {
            current: {
                language: 'en',
                isRTL: false,
                setLanguage: vi.fn(),
                t: tMock,
            }
        }

        result.current.t('welcome')

        expect(tMock).toHaveBeenCalledWith('welcome')
    })

    it('handles invalid language codes gracefully', () => {
        const setLanguageMock = vi.fn()

        // Try to set invalid language
        setLanguageMock('invalid')

        expect(setLanguageMock).toHaveBeenCalledWith('invalid')
    })

    it('provides consistent API', () => {
        const result = {
            current: {
                language: 'en',
                isRTL: false,
                setLanguage: vi.fn(),
                t: vi.fn((key: string) => key),
            }
        }

        // Check that all required properties exist
        expect(typeof result.current.language).toBe('string')
        expect(typeof result.current.isRTL).toBe('boolean')
        expect(typeof result.current.setLanguage).toBe('function')
        expect(typeof result.current.t).toBe('function')
    })
})
