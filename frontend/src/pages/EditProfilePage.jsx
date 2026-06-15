import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Camera, Save } from 'lucide-react'
import toast from 'react-hot-toast'

export default function EditProfilePage() {
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    bio: user?.profile?.bio || '',
    city: user?.profile?.city || '',
  })
  const [avatar, setAvatar] = useState(null)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) { toast.error('Zəhmət olmasa əvvəlcə daxil olun'); return }
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('first_name', form.first_name)
      fd.append('last_name', form.last_name)
      fd.append('email', form.email)
      fd.append('bio', form.bio)
      fd.append('city', form.city)
      if (avatar) fd.append('avatar', avatar)
      await authAPI.updateMe(fd)
      await refreshUser()
      toast.success('Profil yeniləndi!')
      navigate('/profile')
    } catch (err) {
      const errors = err.response?.data
      if (errors) Object.values(errors).flat().forEach(m => toast.error(m))
      else toast.error('Xəta baş verdi.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profili redaktə et</h1>
      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        <div className="flex items-center gap-4 mb-2">
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl overflow-hidden">
            {avatar
              ? <img src={URL.createObjectURL(avatar)} alt="avatar" className="w-full h-full object-cover" />
              : user?.profile?.avatar
                ? <img src={user.profile.avatar} alt="avatar" className="w-full h-full object-cover" />
                : user?.username?.[0]?.toUpperCase()}
            <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
              <Camera size={18} className="text-white" />
              <input type="file" accept="image/*" className="hidden" onChange={e => setAvatar(e.target.files[0])} />
            </label>
          </div>
          <div className="text-sm text-gray-500">Şəkili dəyişmək üçün üzərinə klikləyin</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
            <input value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
            <input value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} className="input-field" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-field" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} className="input-field resize-none" rows={3} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Şəhər</label>
          <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="input-field" />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate('/profile')} className="btn-secondary flex-1">Ləğv et</button>
          <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
            <Save size={16} /> {saving ? 'Yadda saxlanılır...' : 'Yadda saxla'}
          </button>
        </div>
      </form>
    </div>
  )
}
