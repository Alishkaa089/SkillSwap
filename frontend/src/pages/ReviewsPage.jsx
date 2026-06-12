import { useState, useEffect } from 'react'
import { reviewsAPI } from '../services/api'
import { Star, MessageSquare } from 'lucide-react'
import StarRating from '../components/common/StarRating'
import Pagination from '../components/common/Pagination'

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    reviewsAPI.list()
      .then(({ data }) => {
        setReviews(data.results || data)
        setCount(data.count || 0)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page])

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Star size={22} className="text-yellow-500" /> Bütün rəylər
        <span className="text-sm font-normal text-gray-400">({count} rəy)</span>
      </h1>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="card p-5 animate-pulse h-24" />)}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
          <p>Hələ rəy yoxdur</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {reviews.map(r => (
              <div key={r.id} className="card p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                      {r.reviewer_username?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <span className="font-medium text-sm text-gray-900">{r.reviewer_username}</span>
                      <span className="text-xs text-gray-400 ml-2">→ {r.reviewed_user_username}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <StarRating rating={r.rating} size={14} />
                    <span className="text-sm font-medium text-gray-700">{r.rating}/5</span>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{r.comment}</p>
                <p className="text-xs text-gray-400 mt-2">{new Date(r.created_at).toLocaleDateString('az-AZ')}</p>
              </div>
            ))}
          </div>
          <Pagination count={count} page={page} pageSize={10} onPage={p => { setPage(p); window.scrollTo(0, 0) }} />
        </>
      )}
    </div>
  )
}
