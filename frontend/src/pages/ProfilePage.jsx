import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { usersAPI, skillsAPI, reviewsAPI, followsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import SkillCard from '../components/common/SkillCard'
import StarRating from '../components/common/StarRating'
import { MapPin, Users, Star, Repeat2, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { id } = useParams()
  const { user: me } = useAuth()
  const [profile, setProfile] = useState(null)
  const [skills, setSkills] = useState([])
  const [reviews, setReviews] = useState([])
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('skills')
  const [showFollowers, setShowFollowers] = useState(false)
  const [showFollowing, setShowFollowing] = useState(false)
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [followListLoading, setFollowListLoading] = useState(false)

  const userId = id || me?.id

  useEffect(() => {
    if (!userId) return
    const isOwn = me && String(userId) === String(me.id)
    const skillPromise = isOwn ? skillsAPI.mySkills() : skillsAPI.list({ owner: userId })
    Promise.all([
      usersAPI.getUser(userId),
      skillPromise,
      reviewsAPI.userReviews(userId),
    ]).then(([u, s, r]) => {
      setProfile(u.data)
      setSkills(s.data.results || s.data)
      setReviews(r.data.results || r.data)
    }).catch(() => {})
      .finally(() => setLoading(false))

    if (me && String(userId) !== String(me.id)) {
      followsAPI.isFollowing(userId)
        .then(({ data }) => setIsFollowing(data.is_following))
        .catch(() => {})
    }
  }, [userId, me])

  const loadFollowers = async () => {
    setFollowListLoading(true)
    try {
      const { data } = await followsAPI.followers(userId)
      setFollowers(data.results || data)
    } catch {}
    setFollowListLoading(false)
  }

  const loadFollowing = async () => {
    setFollowListLoading(true)
    try {
      const { data } = await followsAPI.following(userId)
      setFollowing(data.results || data)
    } catch {}
    setFollowListLoading(false)
  }

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Rəyi silmək istəyirsiniz?')) return
    try {
      await reviewsAPI.delete(reviewId)
      setReviews(prev => prev.filter(r => r.id !== reviewId))
      toast.success('Rəy silindi.')
    } catch {
      toast.error('Xəta baş verdi.')
    }
  }

  const toggleFollow = async () => {
    try {
      if (isFollowing) {
        await followsAPI.unfollow(userId)
        setIsFollowing(false)
        setProfile(p => ({ ...p, followers_count: p.followers_count - 1 }))
        toast.success('İzlənilmədi.')
      } else {
        await followsAPI.follow(userId)
        setIsFollowing(true)
        setProfile(p => ({ ...p, followers_count: p.followers_count + 1 }))
        toast.success('İzlənildi!')
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Xəta baş verdi.')
    }
  }

  if (loading) return (
    <div className="max-w-3xl mx-auto animate-pulse space-y-4">
      <div className="h-32 bg-gray-100 rounded-xl" />
      <div className="h-8 bg-gray-100 rounded w-1/3" />
    </div>
  )
  if (!profile) return <div className="text-center py-16 text-gray-400">İstifadəçi tapılmadı.</div>

  const isMe = String(userId) === String(me?.id)
  const p = profile.profile || {}

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="card p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 overflow-hidden">
              {p.avatar
                ? <img src={p.avatar} alt="avatar" className="w-full h-full object-cover" />
                : profile.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {profile.first_name && profile.last_name
                  ? `${profile.first_name} ${profile.last_name}`
                  : profile.username}
              </h1>
              <p className="text-gray-500 text-sm">@{profile.username}</p>
              {p.city && <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5"><MapPin size={12} /> {p.city}</p>}
            </div>
          </div>
          <div className="flex gap-2">
            {isMe ? (
              <Link to="/edit-profile" className="btn-secondary text-sm">Profili redaktə et</Link>
            ) : (
              <button onClick={() => {
                if (!me) { toast.error('Zəhmət olmasa əvvəlcə daxil olun'); return }
                toggleFollow()
              }}
                className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors ${isFollowing ? 'btn-secondary' : 'btn-primary'}`}>
                {isFollowing ? 'İzlənilir' : 'İzlə'}
              </button>
            )}
          </div>
        </div>

        {p.bio && <p className="text-gray-700 text-sm mt-4">{p.bio}</p>}

        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="font-bold text-gray-900">{skills.length}</div>
            <div className="text-xs text-gray-500">Bacarıq</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-gray-900">{p.total_swaps || 0}</div>
            <div className="text-xs text-gray-500">Swap</div>
          </div>
          <button onClick={() => { loadFollowers(); setShowFollowers(true) }} className="text-center hover:bg-gray-50 rounded-lg px-3 py-1 transition-colors">
            <div className="font-bold text-gray-900">{profile.followers_count || 0}</div>
            <div className="text-xs text-gray-500">İzləyici</div>
          </button>
          <button onClick={() => { loadFollowing(); setShowFollowing(true) }} className="text-center hover:bg-gray-50 rounded-lg px-3 py-1 transition-colors">
            <div className="font-bold text-gray-900">{profile.following_count || 0}</div>
            <div className="text-xs text-gray-500">İzlənilən</div>
          </button>
          {p.rating > 0 && (
            <div className="flex items-center gap-1">
              <StarRating rating={Math.round(p.rating)} size={14} />
              <span className="text-sm font-medium text-gray-700">{p.rating}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        {['skills', 'reviews'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>
            {t === 'skills' ? `💡 Bacarıqlar (${skills.length})` : `⭐ Rəylər (${reviews.length})`}
          </button>
        ))}
      </div>

      {tab === 'skills' && (
        skills.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Repeat2 size={36} className="mx-auto mb-2 opacity-30" />
            <p>Hələ bacarıq yoxdur</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skills.map(s => <SkillCard key={s.id} skill={s} />)}
          </div>
        )
      )}

      {tab === 'reviews' && (
        reviews.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Star size={36} className="mx-auto mb-2 opacity-30" />
            <p>Hələ rəy yoxdur</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map(r => (
              <div key={r.id} className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                      {r.reviewer_username?.[0]?.toUpperCase()}
                    </div>
                    <span className="font-medium text-sm text-gray-900">{r.reviewer_username}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarRating rating={r.rating} size={14} />
                    <span className="text-sm font-medium text-gray-700">{r.rating}/5</span>
                    {isMe && (
                      <button onClick={() => handleDeleteReview(r.id)} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Rəyi sil">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-700">{r.comment}</p>
                <p className="text-xs text-gray-400 mt-2">{new Date(r.created_at).toLocaleDateString('az-AZ')}</p>
              </div>
            ))}
          </div>
        )
      )}

      {/* Followers Modal */}
      {showFollowers && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowFollowers(false)}>
          <div className="card p-6 w-full max-w-md max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 text-lg">İzləyicilər</h2>
              <button onClick={() => setShowFollowers(false)} className="p-1 text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            {followListLoading ? (
              <div className="text-center py-8 text-gray-400">Yüklənir...</div>
            ) : followers.length === 0 ? (
              <div className="text-center py-8 text-gray-400">İzləyici yoxdur</div>
            ) : (
              <div className="space-y-3">
                {followers.map(f => (
                  <Link key={f.id} to={`/users/${f.id}`} onClick={() => setShowFollowers(false)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {f.username?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-gray-900">{f.first_name || f.username}</div>
                      <div className="text-xs text-gray-500">@{f.username}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Following Modal */}
      {showFollowing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowFollowing(false)}>
          <div className="card p-6 w-full max-w-md max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 text-lg">İzlənilənlər</h2>
              <button onClick={() => setShowFollowing(false)} className="p-1 text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            {followListLoading ? (
              <div className="text-center py-8 text-gray-400">Yüklənir...</div>
            ) : following.length === 0 ? (
              <div className="text-center py-8 text-gray-400">İzlənilən yoxdur</div>
            ) : (
              <div className="space-y-3">
                {following.map(f => (
                  <Link key={f.id} to={`/users/${f.id}`} onClick={() => setShowFollowing(false)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {f.username?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-gray-900">{f.first_name || f.username}</div>
                      <div className="text-xs text-gray-500">@{f.username}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
