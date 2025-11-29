import { getUsers, saveUsers, getPortfolios, savePortfolios } from './services/storage'

export function seedMockData() {
  const users = getUsers()
  if (users && users.length) return

  const initialUsers = [
    { id: 'student1', name: 'Alice Student', email: 'alice@example.com', role: 'student', password: 'student' },
    { id: 'student2', name: 'Bob Student', email: 'bob@example.com', role: 'student', password: 'student' },
    { id: 'admin1', name: 'Admin User', email: 'admin@example.com', role: 'admin', password: 'admin' }
  ]
  saveUsers(initialUsers)

  const initialPortfolios = [
    {
      id: 'p1',
      ownerId: 'student1',
      title: 'Smart Garden',
      description: 'An IoT-based smart garden monitoring system.',
      media: [],
      milestones: [
        { id: 'm1', title: 'Idea', status: 'completed' },
        { id: 'm2', title: 'Prototype', status: 'in-progress' },
        { id: 'm3', title: 'Testing', status: 'todo' }
      ],
      feedback: [
        { id: 'f1', from: 'Admin User', text: 'Good potential. Add sensor calibration notes.' }
      ],
      status: 'pending'
    }
  ]
  savePortfolios(initialPortfolios)
}
