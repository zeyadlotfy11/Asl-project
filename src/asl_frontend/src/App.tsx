import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ArtifactsPage from './pages/ArtifactsPage';
import ArtifactDetailsPage from './pages/ArtifactDetailsPage';
import CommunityPage from './pages/CommunityPage';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import ServicesPage from './pages/ServicesPage';
import { Toaster } from 'react-hot-toast';
import Dashboard from './components/Dashboard';
import CreateArtifactPage from './pages/CreateArtifactPage';
import CreateProposalPage from './pages/CreateProposalPage';
function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#f59e0b',
                  color: '#fff',
                },
              }}
            />
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="artifacts" element={<ArtifactsPage />} />
                <Route path="artifacts/:id" element={<ArtifactDetailsPage />} />
                <Route path="community" element={<CommunityPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="services" element={<ServicesPage />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="create-artifact" element={<CreateArtifactPage />} />
                <Route path="create-proposal" element={<CreateProposalPage />} />
              </Route>
            </Routes>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
