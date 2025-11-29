import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import StudentDashboard from './pages/StudentDashboard'
import AdminDashboard from './pages/AdminDashboard'
import PortfolioView from './pages/PortfolioView'
import Nav from './components/Nav'
import { seedMockData } from './mockData'
import { getSession, logout as doLogout } from './utils/auth'

export default function App() {
  const [session, setSession] = useState(getSession())
  const navigate = useNavigate()

  useEffect(() => {
    seedMockData()
  }, [])

  useEffect(() => {
    setSession(getSession())
  }, [])

  const logout = () => {
    doLogout()
    setSession(null)
    navigate('/login')
  }

  return (
    <div>
      <Nav session={session} onLogout={logout} />
      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to={session ? (session.role === 'admin' ? '/admin' : '/student') : '/login'} />} />
          <Route path="/login" element={<Login onLogin={() => setSession(getSession())} />} />
          <Route path="/student" element={session && session.role === 'student' ? <StudentDashboard /> : <Navigate to="/login" />} />
          <Route path="/admin" element={session && session.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/portfolio/:id" element={<PortfolioView />} />
        </Routes>
      </main>
    </div>
  )
}
