import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
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

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>
  return user ? children : <Navigate to="/login" replace />
}

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
        <Route path="/create-skill" element={<PrivateRoute><CreateSkillPage /></PrivateRoute>} />
        <Route path="/edit-skill/:slug" element={<PrivateRoute><EditSkillPage /></PrivateRoute>} />
        <Route path="/edit-profile" element={<PrivateRoute><EditProfilePage /></PrivateRoute>} />
        <Route path="/swaps" element={<PrivateRoute><SwapsPage /></PrivateRoute>} />
        <Route path="/swaps/:id" element={<PrivateRoute><SwapDetailPage /></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />
        <Route path="/feed" element={<PrivateRoute><FeedPage /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
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
