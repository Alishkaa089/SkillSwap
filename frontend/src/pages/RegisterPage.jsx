import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import { Repeat2, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', password2: '', first_name: '', last_name: '' })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const validate = () => {
    const { first_name, last_name, email, password, password2 } = form
    if (first_name && (first_name.length < 3 || !/^[a-zA-ZəüöğıışçƏÜÖĞIİŞÇ\s]+$/.test(first_name))) {
      toast.error('Ad ən az 3 hərf olmalı və yalnız hərf ola bilər.'); return false
    }
    if (last_name && (last_name.length < 3 || !/^[a-zA-ZəüöğıışçƏÜÖĞIİŞÇ\s]+$/.test(last_name))) {
      toast.error('Soyad ən az 3 hərf olmalı və yalnız hərf ola bilər.'); return false
    }
    if (!email.includes('@')) {
      toast.error('E-poçtda @ işarəsi olmalıdır.'); return false
    }
    if (password.length < 8) {
      toast.error('Şifrə ən az 8 simvol olmalıdır.'); return false
    }
    if (password !== password2) {
      toast.error('Parollar uyğun deyil!'); return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await authAPI.register(form)
      toast.success('Qeydiyyat uğurlu! Giriş edin.')
      navigate('/login')
    } catch (err) {
      const errors = err.response?.data
      if (errors) {
        Object.values(errors).forEach(msgs =>
          Array.isArray(msgs) ? msgs.forEach(m => toast.error(m)) : toast.error(msgs)
        )
      } else {
        toast.error('Qeydiyyat uğursuz oldu.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-3">
              <div className="bg-blue-600 text-white p-3 rounded-xl">
                <Repeat2 size={28} />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Hesab yarat</h1>
            <p className="text-gray-500 text-sm mt-1">SkillSwap-a qoşul, bacarıqlarını paylaş</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">İstifadəçi adı</label>
              <input type="text" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })}
                className="input-field" placeholder="username" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
                <input type="text" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })}
                  className="input-field" placeholder="Ad" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
                <input type="text" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })}
                  className="input-field" placeholder="Soyad" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-poçt</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="input-field" placeholder="email@example.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Şifrə</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="input-field pr-10" placeholder="Minimum 8 simvol" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Şifrəni təkrarla</label>
              <input type={showPassword ? 'text' : 'password'} value={form.password2}
                onChange={e => setForm({ ...form, password2: e.target.value })}
                className="input-field" placeholder="••••••" required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Qeydiyyat olunur...' : 'Qeydiyyat'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Artıq hesabınız var?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">Giriş et</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
