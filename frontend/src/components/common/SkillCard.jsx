import { Link } from 'react-router-dom'
import { Eye, Tag, User } from 'lucide-react'

const LEVEL_COLORS = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-orange-100 text-orange-700',
  expert: 'bg-red-100 text-red-700',
}
const LEVEL_LABELS = {
  beginner: 'Başlanğıc',
  intermediate: 'Orta',
  advanced: 'İrəliləmiş',
  expert: 'Ekspert',
}

export default function SkillCard({ skill }) {
  return (
    <Link to={`/skills/${skill.slug}`} className="card p-5 hover:shadow-md transition-shadow block group">
      {skill.cover_image && (
        <div className="w-full h-36 rounded-lg overflow-hidden mb-3 bg-gray-100">
          <img src={skill.cover_image} alt={skill.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      )}
      {!skill.cover_image && (
        <div className="w-full h-36 rounded-lg mb-3 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <Tag size={32} className="text-blue-300" />
        </div>
      )}

      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-blue-600 transition-colors break-words">
          {skill.title}
        </h3>
        <span className={`badge flex-shrink-0 ${LEVEL_COLORS[skill.level] || 'bg-gray-100 text-gray-600'}`}>
          {LEVEL_LABELS[skill.level] || skill.level}
        </span>
      </div>

      <p className="text-xs text-gray-500 line-clamp-2 mb-3">{skill.description}</p>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <User size={12} />
          {skill.owner_username}
        </span>
        <span className="flex items-center gap-1">
          <Eye size={12} />
          {skill.views_count}
        </span>
      </div>

      {skill.category_name && (
        <div className="mt-2 pt-2 border-t border-gray-50">
          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{skill.category_name}</span>
        </div>
      )}
    </Link>
  )
}
