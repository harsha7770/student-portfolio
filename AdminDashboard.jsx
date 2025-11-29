import React, { useEffect, useState } from 'react'
import { getPortfolios, savePortfolios } from '../services/storage'
import { getUsers } from '../services/storage'
import { getMedia } from '../services/mediaStorage'

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2,9) }

export default function AdminDashboard() {
  const [list, setList] = useState([])
  const [users, setUsers] = useState([])
  const [selected, setSelected] = useState(null)
  const [comment, setComment] = useState('')
  const [query, setQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    setList(getPortfolios())
    setUsers(getUsers())
  }, [])

  const filtered = list.filter(p => {
    const q = query.trim().toLowerCase()
    if (filterStatus && p.status !== filterStatus) return false
    if (!q) return true
    if ((p.title||'').toLowerCase().includes(q)) return true
    const owner = users.find(u=>u.id===p.ownerId)?.name || ''
    if (owner.toLowerCase().includes(q)) return true
    return false
  })

  const open = (p) => setSelected(p)

  useEffect(() => {
    // whenever selected changes, ensure media urls are loaded
    if (!selected) return
    ;(async () => {
      const map = {}
      for (const m of (selected.media||[])) {
        try { map[m.id] = await getMedia(m.id) } catch (e) { map[m.id] = null }
      }
      setSelected(prev => ({ ...prev, _mediaUrls: map }))
    })()
  }, [selected])

  const addFeedback = () => {
    if (!comment) return
    const f = { id: uid(), from: 'Admin', text: comment }
    const updated = list.map(p => p.id === selected.id ? { ...p, feedback: [...(p.feedback||[]), f] } : p)
    savePortfolios(updated)
    setList(updated)
    setSelected(updated.find(p => p.id === selected.id))
    setComment('')
  }

  const changeStatus = (id, status) => {
    const updated = list.map(p => p.id===id?{...p, status}:p)
    savePortfolios(updated)
    setList(updated)
    if (selected && selected.id === id) setSelected(updated.find(p=>p.id===id))
  }

  return (
    <div className="card admin-grid">
      <div className="left">
        <h2>Submissions</h2>
        <div style={{marginBottom:8}}>
          <input placeholder="Search by title or owner" value={query} onChange={e=>setQuery(e.target.value)} />
          <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{marginLeft:8}}>
            <option value="">All</option>
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <ul className="submission-list">
          {filtered.map(p => (
            <li key={p.id} onClick={() => open(p)} className={p.status==='approved'? 'approved': p.status==='rejected' ? 'rejected':''}>
              <div className="title">{p.title || '(untitled)'}</div>
              <div className="owner">{users.find(u=>u.id===p.ownerId)?.name || p.ownerId}</div>
              <div className="status">{p.status}</div>
            </li>
          ))}
        </ul>
      </div>
      <div className="right">
        {selected ? (
          <div>
            <h3>{selected.title}</h3>
            <p>{selected.description}</p>
            <h4>Feedback</h4>
            <ul>
              {(selected.feedback||[]).map(f => <li key={f.id}><strong>{f.from}:</strong> {f.text}</li>)}
            </ul>
            <textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Add feedback" />
            <div className="actions">
              <button className="btn" onClick={addFeedback}>Add Feedback</button>
              <button className="btn" onClick={() => changeStatus(selected.id, 'approved')}>Approve</button>
              <button className="btn ghost" onClick={() => changeStatus(selected.id, 'rejected')}>Reject</button>
            </div>
            <h4>Media</h4>
            <div className="media-list">
              {(selected.media||[]).map(m => <img key={m.id} src={selected._mediaUrls ? selected._mediaUrls[m.id] : ''} alt={m.name} />)}
            </div>
          </div>
        ) : (
          <div>Select a submission to view details</div>
        )}
      </div>
    </div>
  )
}
