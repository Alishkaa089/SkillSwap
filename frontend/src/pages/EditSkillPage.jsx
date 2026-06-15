import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { skillsAPI, categoriesAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Save } from 'lucide-react'
import toast from 'react-hot-toast'

export default function EditSkillPage() {
  const { user } = useAuth()
  const { slug } = useParams()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    level: 'beginner',
    category_id: '',
    tags: '',
  })
  const [cover, setCover] = useState(null)

  useEffect(() => {
    categoriesAPI.list().then(({ data }) => setCategories(data.results || data)).catch(() => {})
    skillsAPI.detail(slug).then(({ data }) => {
      setForm({
        title: data.title,
        description: data.description,
        level: data.level,
        category_id: data.category?.id || '',
        tags: data.tags || '',
      })
    }).catch(() => navigate('/skills'))
      .finally(() => setLoading(false))
  }, [slug])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) { toast.error('Zəhmət olmasa əvvəlcə daxil olun'); return }
    if (!form.title.trim()) { toast.error('Başlıq tələb olunur.'); return }
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('description', form.description)
      fd.append('level', form.level)
      fd.append('category_id', form.category_id)
      fd.append('tags', form.tags)
      if (cover) fd.append('cover_image', cover)
      await skillsAPI.update(slug, fd)
      toast.success('Bacarıq yeniləndi!')
      navigate(`/skills/${slug}`)
    } catch (err) {
      const errors = err.response?.data
      if (errors) Object.values(errors).flat().forEach(m => toast.error(m))
      else toast.error('Xəta baş verdi.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="max-w-xl mx-auto animate-pulse space-y-4">
      {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-100 rounded-lg" />)}
    </div>
  )

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Bacarığı redaktə et</h1>
      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Başlıq *</label>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-field" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Açıqlama</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field resize-none" rows={5} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Səviyyə</label>
            <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} className="input-field">
              <option value="beginner">Başlanğıc</option>
              <option value="intermediate">Orta</option>
              <option value="advanced">İrəliləmiş</option>
              <option value="expert">Ekspert</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kateqoriya</label>
            <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} className="input-field">
              <option value="">Seçin</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Teqlər (vergüllə ayırın)</label>
          <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} className="input-field" placeholder="react, python, dizayn" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cover şəkili</label>
          <input type="file" accept="image/*" onChange={e => setCover(e.target.files[0])} className="input-field" />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate(`/skills/${slug}`)} className="btn-secondary flex-1">Ləğv et</button>
          <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
            <Save size={16} /> {saving ? 'Yadda saxlanılır...' : 'Yadda saxla'}
          </button>
        </div>
      </form>
    </div>
  )
}
