import React from 'react'

interface HeaderProps {
  onMenuClick: () => void
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const handleLogout = () => {
    localStorage.removeItem('tagzai_token')
    window.location.reload()
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo et titre */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Tagzai</h1>
          </div>
        </div>

        {/* Navigation desktop */}
        <nav className="hidden lg:flex items-center space-x-8">
          <a href="/" className="text-gray-600 hover:text-primary-600 transition-colors">
            Tableau de bord
          </a>
          <a href="/tags" className="text-gray-600 hover:text-primary-600 transition-colors">
            Tags
          </a>
          <a href="/categories" className="text-gray-600 hover:text-primary-600 transition-colors">
            Catégories
          </a>
        </nav>

        {/* Menu utilisateur */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-medium text-sm">U</span>
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900">Utilisateur</p>
              <p className="text-gray-500">user@example.com</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Déconnexion"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header