import React, { useState } from 'react'
import Login from './Login'
import FichesList from './FichesList'
import FicheForm from './FicheForm'
import Planning from './Planning'
import { LangProvider, LangSwitcher, useLang } from './LangContext'

function AppContent() {
  const { t } = useLang()
  const [auth, setAuth] = useState(!!sessionStorage.getItem('auth'))
  const [tab, setTab] = useState('fiches')
  const [view, setView] = useState('list')
  const [editId, setEditId] = useState(null)

  if (!auth) return <Login onLogin={() => setAuth(true)} />

  if (tab === 'planning') return (
    <Planning onBack={() => setTab('fiches')} />
  )

  if (view === 'new') return (
    <FicheForm ficheId={null} onBack={() => setView('list')} onSaved={() => setView('list')} />
  )

  if (view === 'edit') return (
    <FicheForm ficheId={editId} onBack={() => setView('list')} onSaved={() => setView('list')} />
  )

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', background: '#f4f4f4' }}>
      <div style={{ background: '#1a1a2e', display: 'flex', alignItems: 'center', padding: '0 24px', height: 50 }}>
        <span style={{ fontWeight: 'bold', fontSize: 15, letterSpacing: 2, color: 'white', marginRight: 32 }}>{t.brand}</span>
        <button onClick={() => setTab('fiches')} style={{ background: tab==='fiches'?'#7A5F8A':'transparent', color:'white', border:'none', padding:'6px 18px', fontSize:13, cursor:'pointer', borderRadius:4, marginRight:4, fontWeight:tab==='fiches'?'bold':'normal' }}>
          {t.tab_fiches}
        </button>
        <button onClick={() => setTab('planning')} style={{ background: tab==='planning'?'#7A5F8A':'transparent', color:'white', border:'none', padding:'6px 18px', fontSize:13, cursor:'pointer', borderRadius:4, fontWeight:tab==='planning'?'bold':'normal' }}>
          {t.tab_planning}
        </button>
        <div style={{ flex: 1 }} />
        <LangSwitcher />
        <button onClick={() => { sessionStorage.removeItem('auth'); setAuth(false) }} style={{ background:'transparent', color:'#aaa', border:'1px solid #555', borderRadius:5, padding:'5px 14px', fontSize:12, cursor:'pointer', marginLeft:12 }}>
          {t.logout}
        </button>
      </div>
      <FichesList onNew={() => setView('new')} onOpen={(id) => { setEditId(id); setView('edit') }} onLogout={() => { sessionStorage.removeItem('auth'); setAuth(false) }} hideHeader={true} />
    </div>
  )
}

export default function App() {
  return (
    <LangProvider>
      <AppContent />
    </LangProvider>
  )
}
