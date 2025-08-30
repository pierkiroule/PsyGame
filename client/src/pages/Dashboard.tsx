import React from 'react'
import { Link } from 'react-router-dom'

const Dashboard: React.FC = () => {
  const stats = [
    { name: 'Total Tags', value: '156', change: '+12%', changeType: 'positive' },
    { name: 'Catégories', value: '12', change: '+2', changeType: 'positive' },
    { name: 'Utilisés aujourd\'hui', value: '23', change: '+5', changeType: 'positive' },
    { name: 'Nouveaux cette semaine', value: '8', change: '+3', changeType: 'positive' },
  ]

  const recentTags = [
    { id: 1, name: 'développement', color: '#3B82F6', count: 15, category: 'Technologie' },
    { id: 2, name: 'design', color: '#10B981', count: 8, category: 'Design' },
    { id: 3, name: 'marketing', color: '#F59E0B', count: 12, category: 'Business' },
    { id: 4, name: 'IA', color: '#8B5CF6', count: 6, category: 'Technologie' },
  ]

  const quickActions = [
    { name: 'Créer un tag', href: '/tags', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6', color: 'primary' },
    { name: 'Nouvelle catégorie', href: '/categories', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', color: 'secondary' },
    { name: 'Importer des tags', href: '/tags/import', icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12', color: 'gray' },
  ]

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600">Bienvenue sur Tagzai, votre gestionnaire de tags intelligent</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions rapides */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              to={action.href}
              className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                action.color === 'primary' ? 'bg-primary-100 text-primary-600' :
                action.color === 'secondary' ? 'bg-secondary-100 text-secondary-600' :
                'bg-gray-100 text-gray-600'
              }`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                </svg>
              </div>
              <span className="font-medium text-gray-900">{action.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Tags récents */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Tags récents</h2>
          <Link to="/tags" className="text-primary-600 hover:text-primary-700 font-medium">
            Voir tous →
          </Link>
        </div>
        <div className="space-y-3">
          {recentTags.map((tag) => (
            <div key={tag.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: tag.color }}
                />
                <span className="font-medium text-gray-900">{tag.name}</span>
                <span className="text-sm text-gray-500">({tag.category})</span>
              </div>
              <div className="text-sm text-gray-600">
                {tag.count} utilisations
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Graphique d'utilisation */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Utilisation des tags (7 derniers jours)</h2>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p>Graphique d'utilisation</p>
            <p className="text-sm">Les données seront affichées ici</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard