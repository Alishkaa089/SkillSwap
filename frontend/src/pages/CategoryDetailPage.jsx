import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { categoriesAPI, skillsAPI } from '../services/api'
import SkillCard from '../components/common/SkillCard'
import Pagination from '../components/common/Pagination'
import { ArrowLeft } from 'lucide-react'

export default function CategoryDetailPage() {
  const { id } = useParams()
  const [category, setCategory] = useState(null)
  const [skills, setSkills] = useState([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    categoriesAPI.detail(id)
      .then(({ data }) => setCategory(data))
      .catch(() => setCategory(null))
  }, [id])

  useEffect(() => {
    if (!id) return
    setLoading(true)
    skillsAPI.list({ category: id, page })
      .then(({ data }) => {
        setSkills(data.results || data)
        setCount(data.count || 0)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id, page])

  if (!category && !loading) return (
    <div className="text-center py-16 text-gray-400">
      <p>Kateqoriya tapılmadı</p>
      <Link to="/skills" className="text-blue-600 hover:underline text-sm mt-2 inline-block">Bacarıqlara qayıt</Link>
    </div>
  )

  return (
    <div>
      <Link to="/skills" className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-4">
        <ArrowLeft size={14} /> Bacarıqlara qayıt
      </Link>

      <div className="card p-6 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{category?.icon || '📁'}</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{category?.name || 'Yüklənir...'}</h1>
            <p className="text-sm text-gray-500">{category?.skills_count || 0} bacarıq</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => <div key={i} className="card p-5 animate-pulse h-44" />)}
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p>Bu kateqoriyada bacarıq yoxdur</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {skills.map(skill => <SkillCard key={skill.id} skill={skill} />)}
          </div>
          <Pagination count={count} page={page} pageSize={9} onPage={p => { setPage(p); window.scrollTo(0, 0) }} />
        </>
      )}
    </div>
  )
}
