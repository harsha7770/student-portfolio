import React from 'react'
import { useParams } from 'react-router-dom'
import { getPortfolios } from '../services/storage'
import { getMedia } from '../services/mediaStorage'
import jsPDF from 'jspdf'

export default function PortfolioView() {
  const { id } = useParams()
  const p = getPortfolios().find(x => x.id === id)
  if (!p) return <div className="card">Portfolio not found</div>
  const [mediaMap, setMediaMap] = React.useState({})
  React.useEffect(() => {
    ;(async () => {
      const map = {}
      for (const m of (p.media||[])) {
        try { map[m.id] = await getMedia(m.id) } catch (e) { map[m.id] = null }
      }
      setMediaMap(map)
    })()
  }, [id])
  const downloadPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text(p.title || 'Untitled', 10, 20)
    doc.setFontSize(12)
    doc.text(p.description || '', 10, 30)
    doc.save((p.title || 'portfolio') + '.pdf')
  }

  return (
    <div className="card">
      <h2>{p.title}</h2>
      <p>{p.description}</p>
      <h3>Timeline</h3>
      <ul className="timeline">
        {(p.milestones||[]).map(m => <li key={m.id} className={m.status}>{m.title} - {m.status}</li>)}
      </ul>
      <h3>Media</h3>
      <div className="media-list">
        {(p.media||[]).map(m => <div key={m.id} className="media-item"><img src={m.url} alt={m.name} /><div className="media-name">{m.name}</div></div>)}
      </div>
      <h3>Feedback</h3>
      <ul>
        {(p.feedback||[]).map(f=> <li key={f.id}><strong>{f.from}:</strong> {f.text}</li>)}
      </ul>
      <div className="actions">
        <button className="btn" onClick={downloadPDF}>Download as PDF</button>
        <button className="btn ghost" onClick={() => window.print()}>Print</button>
      </div>
    </div>
  )
}
