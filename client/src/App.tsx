import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Tags from './pages/Tags'
import Categories from './pages/Categories'
import Login from './pages/Login'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  // Simuler une vérification d'authentification
  React.useEffect(() => {
    const token = localStorage.getItem('tagzai_token')
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tags" element={<Tags />} />
              <Route path="/categories" element={<Categories />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App