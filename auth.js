import { getUsers, saveUsers, getSessionRaw, saveSession, clearSession } from '../services/storage'
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2,9) }

export function getSession() {
  return getSessionRaw()
}

export function login({ email, password, role }) {
  const users = getUsers()
  const found = users.find(u => u.email === email && u.password === password && u.role === role)
  if (found) {
    const session = { id: found.id, name: found.name, role: found.role, email: found.email }
    saveSession(session)
    return session
  }
  return null
}

export function register({ name, email, password }) {
  const users = getUsers()
  if (users.find(u => u.email === email)) return null
  const user = { id: uid(), name, email, password, role: 'student' }
  users.push(user)
  saveUsers(users)
  const session = { id: user.id, name: user.name, role: 'student', email: user.email }
  saveSession(session)
  return session
}

export function logout() {
  clearSession()
}
