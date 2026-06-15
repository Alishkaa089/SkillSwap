import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor — auto refresh
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const refresh = localStorage.getItem('refresh_token')
        const { data } = await axios.post('/api/auth/refresh/', { refresh })
        localStorage.setItem('access_token', data.access)
        original.headers.Authorization = `Bearer ${data.access}`
        return api(original)
      } catch {
        localStorage.clear()
      }
    }
    return Promise.reject(error)
  }
)

// ── Auth ──────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  logout: (refresh) => api.post('/auth/logout/', { refresh }),
  me: () => api.get('/auth/me/'),
  updateMe: (data) => api.patch('/auth/me/', data),
}

// ── Users ─────────────────────────────────────────────
export const usersAPI = {
  getUser: (id) => api.get(`/users/${id}/`),
  search: (q) => api.get(`/users/search/?search=${q}`),
}

// ── Skills ────────────────────────────────────────────
export const skillsAPI = {
  list: (params) => api.get('/skills/', { params }),
  detail: (slug) => api.get(`/skills/${slug}/`),
  create: (data) => api.post('/skills/', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (slug, data) => api.patch(`/skills/${slug}/`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (slug) => api.delete(`/skills/${slug}/`),
  mySkills: () => api.get('/skills/my/'),
  trending: () => api.get('/skills/trending/'),
  stats: () => api.get('/skills/stats/'),
}

// ── Categories ────────────────────────────────────────
export const categoriesAPI = {
  list: () => api.get('/categories/'),
  detail: (id) => api.get(`/categories/${id}/`),
}

// ── Swaps ─────────────────────────────────────────────
export const swapsAPI = {
  list: () => api.get('/swaps/'),
  detail: (id) => api.get(`/swaps/${id}/`),
  create: (data) => api.post('/swaps/', data),
  incoming: () => api.get('/swaps/incoming/'),
  outgoing: () => api.get('/swaps/outgoing/'),
  accept: (id) => api.patch(`/swaps/${id}/accept/`),
  reject: (id) => api.patch(`/swaps/${id}/reject/`),
  complete: (id) => api.patch(`/swaps/${id}/complete/`),
  cancel: (id) => api.delete(`/swaps/${id}/cancel/`),
  stats: () => api.get('/swaps/stats/'),
}

// ── Reviews ───────────────────────────────────────────
export const reviewsAPI = {
  list: () => api.get('/reviews/'),
  detail: (id) => api.get(`/reviews/${id}/`),
  create: (data) => api.post('/reviews/', data),
  update: (id, data) => api.patch(`/reviews/${id}/`, data),
  userReviews: (userId) => api.get(`/reviews/user/${userId}/`),
  leaderboard: () => api.get('/reviews/leaderboard/'),
  delete: (id) => api.delete(`/reviews/${id}/`),
}

// ── Notifications ─────────────────────────────────────
export const notificationsAPI = {
  list: () => api.get('/notifications/'),
  unread: () => api.get('/notifications/unread/'),
  unreadCount: () => api.get('/notifications/unread_count/'),
  markRead: (id) => api.patch(`/notifications/${id}/read/`),
  markAllRead: () => api.post('/notifications/read_all/'),
  delete: (id) => api.delete(`/notifications/${id}/`),
}

// ── Follows ───────────────────────────────────────────
export const followsAPI = {
  follow: (userId) => api.post(`/users/${userId}/follow/`),
  unfollow: (userId) => api.delete(`/users/${userId}/unfollow/`),
  followers: (userId) => api.get(`/users/${userId}/followers/`),
  following: (userId) => api.get(`/users/${userId}/following/`),
  isFollowing: (userId) => api.get(`/users/${userId}/is-following/`),
  feed: () => api.get('/users/feed/'),
}

export default api
