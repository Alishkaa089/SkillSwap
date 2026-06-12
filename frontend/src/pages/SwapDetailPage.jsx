import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { swapsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { ArrowLeft, Check, X, CheckCheck, Ban, MessageSquare, User, Repeat2 } from 'lucide-react'
import toast from 'react-hot-toast'

const STATUS_STYLE = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  accepted: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-green-50 text-green-700 border-green-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  cancelled: 'bg-gray-50 text-gray-500 border-gray-200',
}
const STATUS_LABEL = { pending: 'Gözləyir', accepted: 'Qəbul edildi', completed: 'Tamamlandı', rejected: 'Rədd edildi', cancelled: 'Ləğv edildi' }

export default function SwapDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [swap, setSwap] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    swapsAPI.detail(id)
      .then(({ data }) => setSwap(data))
      .catch(() => navigate('/swaps'))
      .finally(() => setLoading(false))
  }, [id])

  const action = async (fn, msg) => {
    try { await fn(); toast.success(msg); navigate('/swaps') }
    catch (err) { toast.error(err.response?.data?.error || 'Xəta baş verdi.') }
  }

  if (loading) return (
    <div className="max-w-xl mx-auto animate-pulse space-y-4">
      <div className="h-32 bg-gray-100 rounded-xl" />
    </div>
  )
  if (!swap) return null

  const isIncoming = swap.receiver_id === user?.id
  const canAccept = isIncoming && swap.status === 'pending'

  return (
    <div className="max-w-xl mx-auto">
      <Link to="/swaps" className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-4">
        <ArrowLeft size={14} /> Swap-lara qayıt
      </Link>

      <div className={`card p-6 border ${STATUS_STYLE[swap.status]}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Repeat2 size={20} className="text-blue-600" />
            <span className={`badge border ${STATUS_STYLE[swap.status]} text-sm`}>{STATUS_LABEL[swap.status]}</span>
            <span className="text-xs text-gray-400">#{swap.id}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="text-xs text-gray-500 mb-1">Təklif olunan bacarıq</div>
            <div className="font-medium text-blue-600">{swap.offered_skill_title}</div>
            <Link to={`/users/${swap.sender_id}`} className="text-xs text-gray-400 flex items-center gap-1 mt-1">
              <User size={10} /> {swap.sender_username}
            </Link>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="text-xs text-gray-500 mb-1">İstənilən bacarıq</div>
            <div className="font-medium text-green-600">{swap.requested_skill_title}</div>
            <Link to={`/users/${swap.receiver_id}`} className="text-xs text-gray-400 flex items-center gap-1 mt-1">
              <User size={10} /> {swap.receiver_username}
            </Link>
          </div>
        </div>

        {swap.message && (
          <div className="bg-white rounded-lg p-4 border border-gray-100 mb-4">
            <div className="flex items-start gap-2">
              <MessageSquare size={14} className="text-gray-400 mt-0.5" />
              <div>
                <div className="text-xs text-gray-500 mb-1">Mesaj</div>
                <p className="text-sm text-gray-700">{swap.message}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-gray-400 pt-4 border-t border-gray-100">
          <span>Yaradılma: {new Date(swap.created_at).toLocaleString('az-AZ')}</span>
          {swap.updated_at && <span>• Yenilənmə: {new Date(swap.updated_at).toLocaleString('az-AZ')}</span>}
        </div>
      </div>

      {/* Actions */}
      {user && (
        <div className="flex gap-3 mt-4">
          {canAccept && (
            <>
              <button onClick={() => action(() => swapsAPI.accept(swap.id), 'Swap qəbul edildi!')}
                className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                <Check size={16} /> Qəbul et
              </button>
              <button onClick={() => action(() => swapsAPI.reject(swap.id), 'Swap rədd edildi.')}
                className="flex-1 flex items-center justify-center gap-1.5 bg-red-100 text-red-600 px-4 py-2.5 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium">
                <X size={16} /> Rədd et
              </button>
            </>
          )}
          {swap.status === 'accepted' && (
            <button onClick={() => action(() => swapsAPI.complete(swap.id), 'Swap tamamlandı!')}
              className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              <CheckCheck size={16} /> Tamamla
            </button>
          )}
          {swap.status === 'completed' && (
            <span className="flex-1 text-center text-sm text-green-600 font-medium py-2.5">Bu swap tamamlanmışdır</span>
          )}
          {swap.status === 'pending' && !isIncoming && (
            <button onClick={() => action(() => swapsAPI.cancel(swap.id), 'Swap ləğv edildi.')}
              className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 text-gray-600 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
              <Ban size={16} /> Ləğv et
            </button>
          )}
        </div>
      )}
    </div>
  )
}
