import React, { useState, useEffect } from 'react'
import Login from './Login'
import FichesList from './FichesList'
import FicheForm from './FicheForm'

export default function App() {
  const [auth, setAuth] = useState(!!sessionStorage.getItem('auth'))
  const [view, setView] = useState('list') // 'list' | 'new' | 'edit'
  const [editId, setEditId] = useState(null)

  if (!auth) return <Login onLogin={() => setAuth(true)} />

  if (view === 'new') return (
    <FicheForm
      ficheId={null}
      onBack={() => setView('list')}
      onSaved={() => setView('list')}
    />
  )

  if (view === 'edit') return (
    <FicheForm
      ficheId={editId}
      onBack={() => setView('list')}
      onSaved={() => setView('list')}
    />
  )

  return (
    <FichesList
      onNew={() => setView('new')}
      onOpen={(id) => { setEditId(id); setView('edit') }}
      onLogout={() => { sessionStorage.removeItem('auth'); setAuth(false) }}
    />
  )
}
