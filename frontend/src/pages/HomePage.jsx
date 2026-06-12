import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { skillsAPI, categoriesAPI } from '../services/api'
import SkillCard from '../components/common/SkillCard'
import { Repeat2, TrendingUp, Users, Star, ArrowRight } from 'lucide-react'

export default function HomePage() {
  const [trending, setTrending] = useState([])
  const [categories, setCategories] = useState([])
  const [stats, setStats] = useState(null)

  useEffect(() => {
    skillsAPI.trending().then(({ data }) => setTrending(data)).catch(() => {})
    categoriesAPI.list().then(({ data }) => setCategories(data.results || data)).catch(() => {})
    skillsAPI.stats().then(({ data }) => setStats(data)).catch(() => {})
  }, [])

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center py-16 px-4">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <Repeat2 size={14} /> Bacarıq mübadiləsi platforması
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Öyrən. Öyrət.<br />
          <span className="text-blue-600">Mübadiləyə başla.</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8">
          Öz bacarığını paylaş, başqasının bacarığını öyrən — pulsuz, birbaşa, insanlar arasında.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/skills" className="btn-primary px-8 py-3 text-base flex items-center justify-center gap-2">
            Bacarıqlara bax <ArrowRight size={18} />
          </Link>
          <Link to="/register" className="btn-secondary px-8 py-3 text-base">
            Qeydiyyat
          </Link>
        </div>
      </section>

      {/* Stats */}
      {stats && (
        <section className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
          {[
            { label: 'Bacarıq', value: stats.overview?.approved || 0, icon: Star },
            { label: 'Kateqoriya', value: categories.length, icon: TrendingUp },
            { label: 'İstifadəçi', value: '∞', icon: Users },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="card p-5 text-center">
              <Icon size={20} className="text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{value}</div>
              <div className="text-xs text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-5">Kateqoriyalar</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {categories.slice(0, 8).map(cat => (
              <Link
                key={cat.id}
                to={`/skills?category=${cat.id}`}
                className="card p-4 text-center hover:shadow-md hover:border-blue-200 transition-all group"
              >
                <div className="text-2xl mb-1">{cat.icon}</div>
                <div className="text-sm font-medium text-gray-800 group-hover:text-blue-600">{cat.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{cat.skills_count} bacarıq</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Trending */}
      {trending.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-500" /> Trend bacarıqlar
            </h2>
            <Link to="/skills" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              Hamısına bax <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {trending.slice(0, 6).map(skill => <SkillCard key={skill.id} skill={skill} />)}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="card p-10 text-center bg-gradient-to-r from-blue-600 to-indigo-600 border-0 text-white">
        <h2 className="text-2xl font-bold mb-3">Öz bacarığını paylaş</h2>
        <p className="text-blue-100 mb-6 max-w-md mx-auto">
          Bildiklərin başqasına lazım ola bilər. Bacarığını əlavə et, mübadiləyə başla.
        </p>
        <Link to="/create-skill" className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors">
          Bacarıq əlavə et <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  )
}
