import React, { useState } from 'react'

const Tags: React.FC = () => {
  const [tags, setTags] = useState([
    { id: 1, name: 'développement', color: '#3B82F6', count: 15, category: 'Technologie' },
    { id: 2, name: 'design', color: '#10B981', count: 8, category: 'Design' },
    { id: 3, name: 'marketing', color: '#F59E0B', count: 12, category: 'Business' },
    { id: 4, name: 'IA', color: '#8B5CF6', count: 6, category: 'Technologie' },
    { id: 5, name: 'mobile', color: '#EF4444', count: 9, category: 'Technologie' },
  ])

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newTag, setNewTag] = useState({ name: '', color: '#3B82F6', category: '' })

  const handleCreateTag = () => {
    if (newTag.name.trim()) {
      const tag = {
        id: Date.now(),
        name: newTag.name,
        color: newTag.color,
        count: 0,
        category: newTag.category || 'Général'
      }
      setTags([...tags, tag])
      setNewTag({ name: '', color: '#3B82F6', category: '' })
      setShowCreateForm(false)
    }
  }

  const handleDeleteTag = (id: number) => {
    setTags(tags.filter(tag => tag.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Tags</h1>
          <p className="text-gray-600">Organisez et gérez vos tags de manière efficace</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn btn-primary btn-animate"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nouveau Tag
        </button>
      </div>

      {/* Formulaire de création */}
      {showCreateForm && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Créer un nouveau tag</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="form-label">Nom du tag</label>
              <input
                type="text"
                value={newTag.name}
                onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                className="input"
                placeholder="Ex: développement"
              />
            </div>
            <div>
              <label className="form-label">Couleur</label>
              <input
                type="color"
                value={newTag.color}
                onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
                className="w-full h-10 rounded-lg border border-gray-300"
              />
            </div>
            <div>
              <label className="form-label">Catégorie</label>
              <input
                type="text"
                value={newTag.category}
                onChange={(e) => setNewTag({ ...newTag, category: e.target.value })}
                className="input"
                placeholder="Ex: Technologie"
              />
            </div>
          </div>
          <div className="flex space-x-3 mt-4">
            <button
              onClick={handleCreateTag}
              className="btn btn-primary btn-animate"
            >
              Créer
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="btn btn-secondary btn-animate"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Statistiques des tags */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card card-hover">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Total Tags</p>
            <p className="text-2xl font-bold text-gray-900">{tags.length}</p>
          </div>
        </div>
        <div className="card card-hover">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Utilisés aujourd'hui</p>
            <p className="text-2xl font-bold text-gray-900">23</p>
          </div>
        </div>
        <div className="card card-hover">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Nouveaux cette semaine</p>
            <p className="text-2xl font-bold text-gray-900">8</p>
          </div>
        </div>
        <div className="card card-hover">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Catégories</p>
            <p className="text-2xl font-bold text-gray-900">4</p>
          </div>
        </div>
      </div>

      {/* Liste des tags */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Tous les tags</h2>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Rechercher un tag..."
              className="input w-64"
            />
            <select className="input w-32">
              <option value="">Toutes</option>
              <option value="technologie">Technologie</option>
              <option value="design">Design</option>
              <option value="business">Business</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Tag</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Catégorie</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Utilisations</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tags.map((tag) => (
                <tr key={tag.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                      <span className="font-medium text-gray-900">{tag.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{tag.category}</td>
                  <td className="py-3 px-4 text-gray-600">{tag.count}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="text-primary-600 hover:text-primary-700">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDeleteTag(tag.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Tags