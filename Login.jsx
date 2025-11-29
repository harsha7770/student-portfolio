import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register } from '../utils/auth'

export default function Login({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [role, setRole] = useState('student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const nav = useNavigate()

  const doLogin = e => {
    e.preventDefault()
    if (!email || !password) return setError('Email and password are required')
    const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
    if (!emailRe.test(email)) return setError('Enter a valid email')
    const s = login({ email, password, role })
    if (s) {
      onLogin && onLogin()
      nav(role === 'admin' ? '/admin' : '/student')
    } else {
      setError('Invalid credentials for selected role')
    }
  }

  const doRegister = e => {
    e.preventDefault()
    if (!name || !email || !password) return setError('All fields are required')
    if (password.length < 4) return setError('Password must be at least 4 characters')
    const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
    if (!emailRe.test(email)) return setError('Enter a valid email')
    const s = register({ name, email, password })
    if (s) {
      onLogin && onLogin()
      nav('/student')
    } else {
      setError('Registration failed — email may already be used')
    }
  }

  return (
    <div className="card auth">
      <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
      <div className="form-toggle">
        <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Login</button>
        <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Register</button>
      </div>

      {mode === 'login' ? (
        <form onSubmit={doLogin}>
          <label>Role</label>
          <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>

          <label>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" />
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />

          <button className="btn" type="submit">Login</button>
          <p className="muted">Seeded accounts: alice@example.com / student, bob@example.com / student, admin@example.com / admin</p>
        </form>
      ) : (
        <form onSubmit={doRegister}>
          <label>Name</label>
          <input value={name} onChange={e => setName(e.target.value)} />
          <label>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} />
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <button className="btn" type="submit">Register</button>
        </form>
      )}

      {error && <div className="error">{error}</div>}
    </div>
  )
}
