import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Repeat2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [loginWith, setLoginWith] = useState('username')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {}
      if (loginWith === 'email') {
        payload.email = form.email
      } else {
        payload.username = form.username
      }
      payload.password = form.password
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
            <div className="flex gap-2">
              <button type="button" onClick={() => setLoginWith('username')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${loginWith === 'username' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                İstifadəçi adı
              </button>
              <button type="button" onClick={() => setLoginWith('email')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${loginWith === 'email' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                E-poçt
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {loginWith === 'email' ? 'E-poçt' : 'İstifadəçi adı'}
              </label>
              {loginWith === 'email' ? (
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="input-field" placeholder="email@example.com" required />
              ) : (
                <input type="text" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })}
                  className="input-field" placeholder="username" required />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Şifrə</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="input-field"
                placeholder="••••••"
                required
              />
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
