import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Repeat2, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ login: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { password: form.password }
      if (form.login.includes('@')) {
        payload.email = form.login
      } else {
        payload.username = form.login
      }
      await login(payload)
      toast.success('Xoş gəldiniz!')
      navigate('/')
    } catch (err) {
      const msg = err.response?.data?.detail || 'Giriş uğursuz oldu.'
      toast.error(msg)
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
            <h1 className="text-2xl font-bold text-gray-900">SkillSwap-a giriş</h1>
            <p className="text-gray-500 text-sm mt-1">Bacarıqlarını mübadiləyə başla</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">İstifadəçi adı və ya E-poçt</label>
              <input type="text" value={form.login} onChange={e => setForm({ ...form, login: e.target.value })}
                className="input-field" placeholder="username və ya email@example.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Şifrə</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="input-field pr-10"
                  placeholder="••••••"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Giriş edilir...' : 'Giriş et'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Hesabınız yoxdur?{' '}
            <Link to="/register" className="text-blue-600 hover:underline font-medium">
              Qeydiyyat
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
