import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { reviewsAPI } from '../services/api'
import StarRating from '../components/common/StarRating'
import { Trophy } from 'lucide-react'

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    reviewsAPI.leaderboard()
      .then(({ data }) => setLeaders(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const medal = (i) => i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Trophy size={22} className="text-yellow-500" /> Reytinq Lövhəsi
      </h1>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="card p-4 animate-pulse h-16" />)}
        </div>
      ) : leaders.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Trophy size={40} className="mx-auto mb-3 opacity-30" />
          <p>Hələ reytinq yoxdur</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaders.map((u, i) => (
            <Link key={u.user_id} to={`/users/${u.user_id}`}
              className={`card p-4 flex items-center gap-4 hover:shadow-md transition-shadow block ${i < 3 ? 'border-yellow-200' : ''}`}>
              <span className="text-2xl w-10 text-center flex-shrink-0">{medal(i)}</span>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold">
                {u.username[0].toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{u.username}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <StarRating rating={Math.round(u.avg_rating)} size={14} />
                  <span className="text-xs text-gray-500">{u.avg_rating} / 5 · {u.review_count} rəy</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-blue-600 text-lg">{u.avg_rating}</div>
                <div className="text-xs text-gray-400">{u.total_swaps} swap</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
