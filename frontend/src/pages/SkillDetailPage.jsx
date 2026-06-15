import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { skillsAPI, swapsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import StarRating from '../components/common/StarRating'
import { Eye, Calendar, User, Tag, Repeat2, Trash2, Edit } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SkillDetailPage() {
  const { slug } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [skill, setSkill] = useState(null)
  const [mySkills, setMySkills] = useState([])
  const [showSwapModal, setShowSwapModal] = useState(false)
  const [swapForm, setSwapForm] = useState({ offered_skill: '', message: '' })
  const [loading, setLoading] = useState(true)
  const [swapping, setSwapping] = useState(false)

  useEffect(() => {
    skillsAPI.detail(slug)
      .then(({ data }) => setSkill(data))
      .catch(() => navigate('/skills'))
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (user && showSwapModal) {
      skillsAPI.mySkills().then(({ data }) => setMySkills(data.results || data))
    }
  }, [user, showSwapModal])

  const handleDelete = async () => {
    if (!confirm('Bu bacarığı silmək istəyirsiniz?')) return
    try {
      await skillsAPI.delete(slug)
      toast.success('Bacarıq silindi.')
      navigate('/skills')
    } catch {
      toast.error('Xəta baş verdi.')
    }
  }

  const handleSwap = async (e) => {
    e.preventDefault()
    if (!swapForm.offered_skill) { toast.error('Bir bacarıq seçin.'); return }
    setSwapping(true)
    try {
      await swapsAPI.create({
        receiver: skill.owner.id,
        offered_skill: swapForm.offered_skill,
        requested_skill: skill.id,
        message: swapForm.message,
      })
      toast.success('Swap sorğusu göndərildi!')
      setShowSwapModal(false)
    } catch (err) {
      const errors = err.response?.data
      if (errors) Object.values(errors).flat().forEach(m => toast.error(m))
      else toast.error('Xəta baş verdi.')
    } finally {
      setSwapping(false)
    }
  }

  if (loading) return (
    <div className="max-w-3xl mx-auto animate-pulse space-y-4">
      <div className="h-64 bg-gray-100 rounded-xl" />
      <div className="h-8 bg-gray-100 rounded w-2/3" />
      <div className="h-4 bg-gray-100 rounded" />
    </div>
  )
  if (!skill) return null

  const isOwner = user?.id === skill.owner?.id

  return (
    <div className="max-w-3xl mx-auto">
      {/* Cover */}
      {skill.cover_image && (
        <div className="w-full h-64 rounded-xl overflow-hidden mb-6 bg-gray-100">
          <img src={skill.cover_image} alt={skill.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="card p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{skill.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <Link to={`/users/${skill.owner?.id}`} className="flex items-center gap-1 hover:text-blue-600">
                <User size={14} /> {skill.owner?.username}
              </Link>
              <span className="flex items-center gap-1"><Eye size={14} /> {skill.views_count} baxış</span>
              <span className="flex items-center gap-1">
                <Calendar size={14} /> {new Date(skill.created_at).toLocaleDateString('az-AZ')}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {isOwner ? (
              <>
                <Link to={`/edit-skill/${slug}`} className="btn-secondary flex items-center gap-1.5 text-sm">
                  <Edit size={14} /> Redaktə
                </Link>
                <button onClick={handleDelete} className="btn-danger flex items-center gap-1.5 text-sm">
                  <Trash2 size={14} /> Sil
                </button>
              </>
            ) : user ? (
              <button onClick={() => setShowSwapModal(true)} className="btn-primary flex items-center gap-1.5">
                <Repeat2 size={16} /> Swap təklif et
              </button>
            ) : (
              <button onClick={() => toast.error('Zəhmət olmasa əvvəlcə daxil olun')} className="btn-primary flex items-center gap-1.5">
                <Repeat2 size={16} /> Swap təklif et
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {skill.category && (
            <Link to={`/categories/${skill.category.id}`} className="badge bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
              {skill.category.name}
            </Link>
          )}
          <span className={`badge ${
            skill.level === 'expert' ? 'bg-red-100 text-red-700' :
            skill.level === 'advanced' ? 'bg-orange-100 text-orange-700' :
            skill.level === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
            'bg-green-100 text-green-700'
          }`}>
            {skill.level === 'beginner' ? 'Başlanğıc' :
             skill.level === 'intermediate' ? 'Orta' :
             skill.level === 'advanced' ? 'İrəliləmiş' : 'Ekspert'}
          </span>
        </div>

        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{skill.description}</p>

        {skill.tags && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
            <Tag size={14} className="text-gray-400 mt-0.5" />
            {skill.tags.split(',').map(t => t.trim()).filter(Boolean).map(tag => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Owner card */}
      {skill.owner && (
        <div className="card p-5 mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">Bacarıq sahibi</h2>
          <Link to={`/users/${skill.owner.id}`} className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
              {skill.owner.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <div className="font-medium text-gray-900">{skill.owner.first_name || skill.owner.username}</div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <StarRating rating={Math.round(skill.owner.profile?.rating || 0)} size={12} />
                <span>{skill.owner.profile?.rating || 0} reytinq</span>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Swap Modal */}
      {showSwapModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="card p-6 w-full max-w-md">
            <h2 className="font-bold text-gray-900 text-lg mb-4">Swap sorğusu göndər</h2>
            <p className="text-sm text-gray-500 mb-4">
              <strong>{skill.owner?.username}</strong>-ə <strong>{skill.title}</strong> bacarığı üçün swap təklif edirsiniz.
            </p>
            <form onSubmit={handleSwap} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Öz bacarığınızı seçin</label>
                <select
                  value={swapForm.offered_skill}
                  onChange={e => setSwapForm({ ...swapForm, offered_skill: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">— Seçin —</option>
                  {mySkills.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>
                {mySkills.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    Əvvəlcə <Link to="/create-skill" className="underline">bacarıq əlavə edin</Link>.
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mesaj (könüllü)</label>
                <textarea
                  value={swapForm.message}
                  onChange={e => setSwapForm({ ...swapForm, message: e.target.value })}
                  className="input-field resize-none"
                  rows={3}
                  placeholder="Özünüz haqqında qısa məlumat..."
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowSwapModal(false)} className="btn-secondary flex-1">
                  Ləğv et
                </button>
                <button type="submit" disabled={swapping} className="btn-primary flex-1">
                  {swapping ? 'Göndərilir...' : 'Göndər'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
