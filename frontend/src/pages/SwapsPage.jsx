import { useState, useEffect } from 'react'
import { swapsAPI, reviewsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import StarRating from '../components/common/StarRating'
import { Repeat2, Check, X, CheckCheck, Ban, MessageSquare, BarChart3 } from 'lucide-react'
import toast from 'react-hot-toast'

const STATUS_STYLE = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  accepted: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-green-50 text-green-700 border-green-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  cancelled: 'bg-gray-50 text-gray-500 border-gray-200',
}
const STATUS_LABEL = { pending: 'Gözləyir', accepted: 'Qəbul edildi', completed: 'Tamamlandı', rejected: 'Rədd edildi', cancelled: 'Ləğv edildi' }

export default function SwapsPage() {
  const { user } = useAuth()
  const [tab, setTab] = useState('incoming')
  const [swaps, setSwaps] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviewModal, setReviewModal] = useState(null)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [stats, setStats] = useState(null)

  const load = () => {
    if (!user) { setLoading(false); return }
    setLoading(true)
    const req = tab === 'incoming' ? swapsAPI.incoming() : swapsAPI.outgoing()
    req.then(({ data }) => setSwaps(data.results || data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [tab])

  useEffect(() => {
    swapsAPI.stats().then(({ data }) => setStats(data)).catch(() => {})
  }, [])

  const action = async (fn, msg) => {
    try { await fn(); toast.success(msg); load() }
    catch (err) { toast.error(err.response?.data?.error || 'Xəta baş verdi.') }
  }

  const submitReview = async (e) => {
    e.preventDefault()
    try {
      const swap = reviewModal
      const reviewedUser = user.id === swap.sender_id ? swap.receiver_id : swap.sender_id
      await reviewsAPI.create({ swap: swap.id, reviewed_user: reviewedUser, ...reviewForm })
      toast.success('Rəy yazıldı!')
      setReviewModal(null)
    } catch (err) {
      const errors = err.response?.data
      if (errors) Object.values(errors).flat().forEach(m => toast.error(m))
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
        <Repeat2 size={22} className="text-blue-600" /> Swap-larım
      </h1>

      {stats && (
        <div className="flex gap-4 mb-6 text-sm">
          <div className="flex items-center gap-1 text-gray-500"><BarChart3 size={14} /> Ümumi: <strong className="text-gray-900">{stats.total}</strong></div>
          <div className="flex items-center gap-1 text-green-600">✓ Tamamlanan: <strong>{stats.completed}</strong></div>
          <div className="flex items-center gap-1 text-yellow-600">⏳ Gözləyən: <strong>{stats.pending}</strong></div>
          <div className="flex items-center gap-1 text-blue-600">→ Qəbul edilən: <strong>{stats.accepted}</strong></div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        {['incoming', 'outgoing'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
            {t === 'incoming' ? '📥 Gələnlər' : '📤 Göndərilənlər'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="card p-5 animate-pulse h-28" />)}
        </div>
      ) : swaps.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Repeat2 size={40} className="mx-auto mb-3 opacity-30" />
          <p>Hələ swap yoxdur</p>
        </div>
      ) : (
        <div className="space-y-4">
            {swaps.map(swap => (
            <Link key={swap.id} to={`/swaps/${swap.id}`} className={`card p-5 border ${STATUS_STYLE[swap.status]} block hover:shadow-md transition-shadow`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`badge border ${STATUS_STYLE[swap.status]} text-xs`}>{STATUS_LABEL[swap.status]}</span>
                    <span className="text-xs text-gray-400">#{swap.id}</span>
                  </div>
                  <div className="text-sm text-gray-700 flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-blue-600">{swap.offered_skill_title}</span>
                    <span className="text-gray-400">↔</span>
                    <span className="font-medium text-green-600">{swap.requested_skill_title}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {tab === 'incoming' ? `Göndərən: ${swap.sender_username}` : `Alan: ${swap.receiver_username}`}
                  </div>
                  {swap.message && (
                    <div className="mt-2 text-xs text-gray-600 bg-white/60 rounded-lg p-2 flex gap-1.5">
                      <MessageSquare size={12} className="flex-shrink-0 mt-0.5" />
                      {swap.message}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  {tab === 'incoming' && swap.status === 'pending' && (
                    <>
                      <button onClick={e => { e.preventDefault(); action(() => swapsAPI.accept(swap.id), 'Swap qəbul edildi!') }}
                        className="flex items-center gap-1 text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors">
                        <Check size={12} /> Qəbul et
                      </button>
                      <button onClick={e => { e.preventDefault(); action(() => swapsAPI.reject(swap.id), 'Swap rədd edildi.') }}
                        className="flex items-center gap-1 text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-200 transition-colors">
                        <X size={12} /> Rədd et
                      </button>
                    </>
                  )}
                  {swap.status === 'accepted' && (
                      <button onClick={e => { e.preventDefault(); action(() => swapsAPI.complete(swap.id), 'Swap tamamlandı!') }}
                        className="flex items-center gap-1 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">
                        <CheckCheck size={12} /> Tamamla
                      </button>
                  )}
                  {swap.status === 'completed' && (
                    <button onClick={e => { e.preventDefault(); setReviewModal(swap) }}
                      className="flex items-center gap-1 text-xs bg-yellow-500 text-white px-3 py-1.5 rounded-lg hover:bg-yellow-600 transition-colors">
                      ⭐ Rəy yaz
                    </button>
                  )}
                  {tab === 'outgoing' && swap.status === 'pending' && (
                    <button onClick={e => { e.preventDefault(); action(() => swapsAPI.cancel(swap.id), 'Swap ləğv edildi.') }}
                      className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors">
                      <Ban size={12} /> Ləğv et
                    </button>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="card p-6 w-full max-w-md">
            <h2 className="font-bold text-gray-900 text-lg mb-4">Rəy yaz</h2>
            <form onSubmit={submitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reytinq</label>
                <StarRating rating={reviewForm.rating} size={28} onChange={r => setReviewForm({ ...reviewForm, rating: r })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Şərh</label>
                <textarea value={reviewForm.comment} onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="input-field resize-none" rows={3} placeholder="Təcrübənizi paylaşın..." required />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setReviewModal(null)} className="btn-secondary flex-1">Ləğv et</button>
                <button type="submit" className="btn-primary flex-1">Göndər</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
