import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/layout/Layout'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import SkillsPage from './pages/SkillsPage'
import SkillDetailPage from './pages/SkillDetailPage'
import CreateSkillPage from './pages/CreateSkillPage'
import EditSkillPage from './pages/EditSkillPage'
import EditProfilePage from './pages/EditProfilePage'
import SwapsPage from './pages/SwapsPage'
import SwapDetailPage from './pages/SwapDetailPage'
import ProfilePage from './pages/ProfilePage'
import LeaderboardPage from './pages/LeaderboardPage'
import NotificationsPage from './pages/NotificationsPage'
import FeedPage from './pages/FeedPage'
import CategoryDetailPage from './pages/CategoryDetailPage'
import ReviewsPage from './pages/ReviewsPage'

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/skills/:slug" element={<SkillDetailPage />} />
        <Route path="/categories/:id" element={<CategoryDetailPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/users/:id" element={<ProfilePage />} />
        <Route path="/create-skill" element={<CreateSkillPage />} />
        <Route path="/edit-skill/:slug" element={<EditSkillPage />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
        <Route path="/swaps" element={<SwapsPage />} />
        <Route path="/swaps/:id" element={<SwapDetailPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
