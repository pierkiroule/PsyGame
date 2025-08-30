import React, { useState } from 'react'

const Categories: React.FC = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Technologie', description: 'Catégorie pour les sujets technologiques', tagCount: 25, color: '#3B82F6' },
    { id: 2, name: 'Design', description: 'Catégorie pour le design et la créativité', tagCount: 18, color: '#10B981' },
    { id: 3, name: 'Business', description: 'Catégorie pour les sujets business', tagCount: 22, color: '#F59E0B' },
    { id: 4, name: 'Marketing', description: 'Catégorie pour le marketing et la communication', tagCount: 15, color: '#8B5CF6' },
  ])

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: '', description: '', color: '#3B82F6' })

  const handleCreateCategory = () => {
    if (newCategory.name.trim()) {
      const category = {
        id: Date.now(),
        name: newCategory.name,
        description: newCategory.description,
        tagCount: 0,
        color: newCategory.color
      }
      setCategories([...categories, category])
      setNewCategory({ name: '', description: '', color: '#3B82F6' })
      setShowCreateForm(false)
    }
  }

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter(category => category.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Catégories</h1>
          <p className="text-gray-600">Organisez vos tags en catégories logiques</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn btn-primary btn-animate"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Nouvelle Catégorie
        </button>
      </div>

      {/* Formulaire de création */}
      {showCreateForm && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Créer une nouvelle catégorie</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="form-label">Nom de la catégorie</label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="input"
                placeholder="Ex: Technologie"
              />
            </div>
            <div>
              <label className="form-label">Description</label>
              <input
                type="text"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                className="input"
                placeholder="Description de la catégorie"
              />
            </div>
            <div>
              <label className="form-label">Couleur</label>
              <input
                type="color"
                value={newCategory.color}
                onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                className="w-full h-10 rounded-lg border border-gray-300"
              />
            </div>
          </div>
          <div className="flex space-x-3 mt-4">
            <button
              onClick={handleCreateCategory}
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

      {/* Statistiques des catégories */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card card-hover">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Total Catégories</p>
            <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
          </div>
        </div>
        <div className="card card-hover">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Total Tags</p>
            <p className="text-2xl font-bold text-gray-900">
              {categories.reduce((sum, cat) => sum + cat.tagCount, 0)}
            </p>
          </div>
        </div>
        <div className="card card-hover">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Catégorie la plus utilisée</p>
            <p className="text-2xl font-bold text-gray-900">
              {categories.reduce((max, cat) => cat.tagCount > max.tagCount ? cat : max, categories[0])?.name || 'N/A'}
            </p>
          </div>
        </div>
        <div className="card card-hover">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Moyenne tags/catégorie</p>
            <p className="text-2xl font-bold text-gray-900">
              {Math.round(categories.reduce((sum, cat) => sum + cat.tagCount, 0) / categories.length)}
            </p>
          </div>
        </div>
      </div>

      {/* Vue en grille des catégories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="card card-hover">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: category.color }}
                >
                  {category.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.tagCount} tags</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="text-primary-600 hover:text-primary-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button 
                  onClick={() => handleDeleteCategory(category.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">{category.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-xs text-gray-500">Couleur de la catégorie</span>
              </div>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                Voir les tags →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Liste détaillée des catégories */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Vue détaillée des catégories</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Catégorie</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Nombre de tags</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-lg"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="font-medium text-gray-900">{category.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{category.description}</td>
                  <td className="py-3 px-4 text-gray-600">{category.tagCount}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="text-primary-600 hover:text-primary-700">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDeleteCategory(category.id)}
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

export default Categories