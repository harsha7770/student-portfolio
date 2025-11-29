import React, { useEffect, useState } from 'react'
import { getSession } from '../utils/auth'
import { getPortfolios, savePortfolios } from '../services/storage'
import { saveMedia, getMedia } from '../services/mediaStorage'

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2,9) }

export default function StudentDashboard() {
  const session = getSession()
  const [portfolio, setPortfolio] = useState(null)
  const [previewSrc, setPreviewSrc] = useState(null)
  const [mediaUrls, setMediaUrls] = useState({})

  useEffect(() => {
    const all = getPortfolios()
    const mine = all.find(p => p.ownerId === session.id)
    if (mine) {
      setPortfolio(mine)
      // load media urls
      ;(async () => {
        const map = {}
        for (const m of (mine.media||[])) {
          try { map[m.id] = await getMedia(m.id) } catch (e) { map[m.id] = null }
        }
        setMediaUrls(map)
      })()
    }
    else setPortfolio({ id: uid(), ownerId: session.id, title: '', description: '', media: [], milestones: [{id: 'm1', title: 'Idea', status: 'todo'},{id: 'm2', title: 'Prototype', status: 'todo'},{id: 'm3', title: 'Testing', status: 'todo'},{id: 'm4', title: 'Completed', status: 'todo'}], feedback: [], status: 'draft' })
  }, [session.id])

  if (!portfolio) return <div>Loading...</div>

  const handleSave = () => {
    const all = getPortfolios()
    const idx = all.findIndex(p => p.id === portfolio.id)
    if (idx >= 0) all[idx] = portfolio
    else all.push(portfolio)
    savePortfolios(all)
    alert('Saved locally')
  }

  const handleFile = e => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async () => {
      const url = reader.result
      setPreviewSrc(url)
      const id = uid()
      try {
        await saveMedia(id, url)
        setPortfolio(prev => ({ ...prev, media: [...(prev.media||[]), {id, name: file.name}] }))
        setMediaUrls(prev => ({ ...prev, [id]: url }))
      } catch (e) {
        alert('Failed to save media locally')
      }
    }
    reader.readAsDataURL(file)
  }

  const updateMilestoneStatus = (id, status) => {
    setPortfolio(prev => ({ ...prev, milestones: prev.milestones.map(m => m.id===id?{...m,status}:m) }))
  }

  const progressPercent = () => {
    const done = portfolio.milestones.filter(m => m.status === 'completed').length
    return Math.round((done / portfolio.milestones.length) * 100)
  }

  return (
    <div className="card">
      <h2>Student Dashboard</h2>
      <label>Title</label>
      <input value={portfolio.title} onChange={e => setPortfolio({...portfolio, title: e.target.value})} />
      <label>Description</label>
      <textarea value={portfolio.description} onChange={e => setPortfolio({...portfolio, description: e.target.value})} />

      <label>Upload media (preview only)</label>
      <input type="file" onChange={handleFile} />
      {previewSrc && <img src={previewSrc} className="preview" alt="preview" />}

      <h3>Media</h3>
      <div className="media-list">
        {portfolio.media.map(m => (
          <div className="media-item" key={m.id}>
            <img src={mediaUrls[m.id] || ''} alt={m.name} />
            <div className="media-name">{m.name}</div>
          </div>
        ))}
      </div>

      <h3>Milestones</h3>
      <div className="progress-bar"><div className="progress" style={{width: progressPercent() + '%'}}></div></div>
      <div className="milestones">
        {portfolio.milestones.map(m => (
          <div className="milestone" key={m.id}>
            <div>{m.title}</div>
            <select value={m.status} onChange={e => updateMilestoneStatus(m.id, e.target.value)}>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        ))}
      </div>

      <h3>Mock Feedback</h3>
      <ul>
        {(portfolio.feedback||[]).map(f => <li key={f.id}><strong>{f.from}:</strong> {f.text}</li>)}
      </ul>

      <div className="actions">
        <button className="btn" onClick={handleSave}>Save</button>
        <button className="btn ghost" onClick={() => { setPortfolio({...portfolio, status: 'submitted'}); handleSave(); alert('Marking as submitted (UI only)') }}>Submit for Review</button>
      </div>
    </div>
  )
}
