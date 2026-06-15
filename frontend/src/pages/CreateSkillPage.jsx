import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { skillsAPI, categoriesAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Upload } from 'lucide-react'

export default function CreateSkillPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [form, setForm] = useState({
    title: '', description: '', category_id: '', level: 'beginner', tags: '', cover_image: null
  })

  useEffect(() => {
    categoriesAPI.list().then(({ data }) => setCategories(data.results || data))
  }, [])

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (file) {
      setForm({ ...form, cover_image: file })
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) { toast.error('Zəhmət olmasa əvvəlcə daxil olun'); return }
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('description', form.description)
      fd.append('category_id', form.category_id)
      fd.append('level', form.level)
      fd.append('tags', form.tags)
      if (form.cover_image) fd.append('cover_image', form.cover_image)

      const { data } = await skillsAPI.create(fd)
      toast.success('Bacarıq əlavə edildi!')
      navigate(`/skills/${data.slug}`)
    } catch (err) {
      const errors = err.response?.data
      if (errors) Object.entries(errors).forEach(([k, v]) => toast.error(`${k}: ${Array.isArray(v) ? v[0] : v}`))
      else toast.error('Xəta baş verdi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Yeni bacarıq əlavə et</h1>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Cover image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Örtük şəkli (könüllü)</label>
            <label className="block cursor-pointer">
              <div className={`border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-400 transition-colors ${preview ? 'p-0 border-solid' : ''}`}>
                {preview ? (
                  <img src={preview} alt="preview" className="w-full h-48 object-cover rounded-xl" />
                ) : (
                  <div className="text-gray-400">
                    <Upload size={28} className="mx-auto mb-2" />
                    <p className="text-sm">Şəkil seçin</p>
                    <p className="text-xs mt-1">PNG, JPG, WEBP</p>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bacarıq adı *</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              className="input-field" placeholder="Məs: Python ilə backend proqramlaşdırma" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Təsvir *</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              className="input-field resize-none" rows={4}
              placeholder="Bu bacarıq nədir? Nə öyrədəcəksiniz?" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kateqoriya *</label>
              <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}
                className="input-field" required>
                <option value="">— Seçin —</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Səviyyə</label>
              <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} className="input-field">
                <option value="beginner">Başlanğıc</option>
                <option value="intermediate">Orta</option>
                <option value="advanced">İrəliləmiş</option>
                <option value="expert">Ekspert</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teqlər (könüllü)</label>
            <input type="text" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
              className="input-field" placeholder="python, django, web (vergüllə ayırın)" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">Ləğv et</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Əlavə edilir...' : 'Bacarıq əlavə et'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
