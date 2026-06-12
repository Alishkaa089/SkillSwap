import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { followsAPI } from '../services/api'
import SkillCard from '../components/common/SkillCard'
import { Rss, Users } from 'lucide-react'

export default function FeedPage() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    followsAPI.feed()
      .then(({ data }) => setSkills(data.results || data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Rss size={22} className="text-blue-600" /> Lentim
      </h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="card p-5 animate-pulse h-48" />)}
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Users size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">Lentiniz boşdur</p>
          <p className="text-sm mt-1 mb-6">İstifadəçiləri izləyin, onların bacarıqlarını görün</p>
          <Link to="/skills" className="btn-primary">İstifadəçiləri tap</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {skills.map(skill => <SkillCard key={skill.id} skill={skill} />)}
        </div>
      )}
    </div>
  )
}
