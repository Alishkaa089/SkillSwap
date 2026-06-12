import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { skillsAPI, categoriesAPI } from '../services/api'
import SkillCard from '../components/common/SkillCard'
import Pagination from '../components/common/Pagination'
import { Search, SlidersHorizontal } from 'lucide-react'

const LEVELS = [
  { value: '', label: 'Hamısı' },
  { value: 'beginner', label: 'Başlanğıc' },
  { value: 'intermediate', label: 'Orta' },
  { value: 'advanced', label: 'İrəliləmiş' },
  { value: 'expert', label: 'Ekspert' },
]

export default function SkillsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [skills, setSkills] = useState([])
  const [count, setCount] = useState(0)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const page = parseInt(searchParams.get('page') || '1')
  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const level = searchParams.get('level') || ''

  useEffect(() => {
    categoriesAPI.list().then(({ data }) => setCategories(data.results || data)).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    skillsAPI.list({ page, search, category, level })
      .then(({ data }) => {
        setSkills(data.results || data)
        setCount(data.count || 0)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page, search, category, level])

  const setParam = (key, val) => {
    const p = new URLSearchParams(searchParams)
    if (val) p.set(key, val); else p.delete(key)
    p.delete('page')
    setSearchParams(p)
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bacarıqlar</h1>
          <p className="text-gray-500 text-sm mt-0.5">{count} bacarıq tapıldı</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setParam('search', e.target.value)}
            placeholder="Bacarıq axtar..."
            className="input-field pl-9"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal size={14} className="text-gray-400" />
          <select
            value={category}
            onChange={e => setParam('category', e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Bütün kateqoriyalar</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name} ({c.skills_count})</option>)}
          </select>

          <div className="flex gap-1">
            {LEVELS.map(l => (
              <button
                key={l.value}
                onClick={() => setParam('level', l.value)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                  level === l.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-36 bg-gray-100 rounded-lg mb-3" />
              <div className="h-4 bg-gray-100 rounded mb-2 w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Search size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">Bacarıq tapılmadı</p>
          <p className="text-sm mt-1">Filtrləri dəyişdirməyi yoxlayın</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {skills.map(skill => <SkillCard key={skill.id} skill={skill} />)}
          </div>
          <Pagination count={count} page={page} pageSize={9} onPage={p => setParam('page', p)} />
        </>
      )}
    </div>
  )
}
