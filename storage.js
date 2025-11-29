const USERS_KEY = 'eduport_users'
const PORTFOLIOS_KEY = 'eduport_portfolios'
const SESSION_KEY = 'eduport_session'

export function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  } catch (e) {
    return []
  }
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users || []))
}

export function getPortfolios() {
  try {
    return JSON.parse(localStorage.getItem(PORTFOLIOS_KEY) || '[]')
  } catch (e) {
    return []
  }
}

export function savePortfolios(list) {
  localStorage.setItem(PORTFOLIOS_KEY, JSON.stringify(list || []))
}

export function getSessionRaw() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
  } catch (e) {
    return null
  }
}

export function saveSession(s) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(s))
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}
