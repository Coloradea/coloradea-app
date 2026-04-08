import React, { useEffect, useState } from 'react'
import { supabase } from './supabase'

export default function FichesList({ onNew, onOpen, onLogout, hideHeader }) {
  const [fiches, setFiches] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)

  useEffect(() => {
    loadFiches()
  }, [])

  async function loadFiches() {
    setLoading(true)
    const { data } = await supabase
      .from('fiches')
      .select('id, num_dossier, num_devis, client, designation, type_produit, date_creation, date_livraison, created_at')
      .order('created_at', { ascending: false })
    setFiches(data || [])
    setLoading(false)
  }

  async function handleDelete(id) {
    await supabase.from('fiches').delete().eq('id', id)
    setConfirmDelete(null)
    loadFiches()
  }

  const filtered = fiches.filter(f =>
    (f.client || '').toLowerCase().includes(search.toLowerCase()) ||
    (f.num_dossier || '').toLowerCase().includes(search.toLowerCase()) ||
    (f.num_devis || '').toLowerCase().includes(search.toLowerCase()) ||
    (f.designation || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={styles.page}>
      {!hideHeader && <div style={styles.header}>}
        <div style={styles.headerLeft}>
          <span style={styles.brand}>COLORADEA</span>
          <span style={styles.headerTitle}>Fiches de Production</span>
        </div>
        <div style={styles.headerRight}>
          <button onClick={onNew} style={styles.btnNew}>+ Nouvelle fiche</button>
          <button onClick={onLogout} style={styles.btnLogout}>Déconnexion</button>
        </div>
      </div>

      <div style={styles.content}>
        <input
          style={styles.search}
          placeholder="🔍  Rechercher par client, N° dossier, N° devis, désignation..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {loading ? (
          <div style={styles.empty}>Chargement...</div>
        ) : filtered.length === 0 ? (
          <div style={styles.empty}>Aucune fiche trouvée</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                {['N° Dossier','N° Devis','Client','Désignation','Type','Date création','Date livraison',''].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((f, i) => (
                <tr key={f.id} style={{ background: i % 2 === 0 ? '#fafafa' : 'white' }}>
                  <td style={styles.td}>{f.num_dossier || '—'}</td>
                  <td style={styles.td}>{f.num_devis || '—'}</td>
                  <td style={styles.td}><strong>{f.client || '—'}</strong></td>
                  <td style={styles.td}>{f.designation || '—'}</td>
                  <td style={styles.td}>{f.type_produit || '—'}</td>
                  <td style={styles.td}>{f.date_creation || '—'}</td>
                  <td style={styles.td}>{f.date_livraison || '—'}</td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => onOpen(f.id)} style={styles.btnOpen}>Ouvrir</button>
                      {confirmDelete === f.id ? (
                        <>
                          <button onClick={() => handleDelete(f.id)} style={styles.btnConfirm}>Confirmer</button>
                          <button onClick={() => setConfirmDelete(null)} style={styles.btnCancel}>Annuler</button>
                        </>
                      ) : (
                        <button onClick={() => setConfirmDelete(f.id)} style={styles.btnDelete}>🗑</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', background: '#f4f4f4', fontFamily: 'Arial, sans-serif' },
  header: {
    background: '#1a1a2e', color: 'white', padding: '0 32px',
    height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 16 },
  brand: { fontWeight: 'bold', fontSize: 16, letterSpacing: 2 },
  headerTitle: { fontSize: 14, color: '#aaa' },
  headerRight: { display: 'flex', gap: 12 },
  btnNew: {
    background: '#7A5F8A', color: 'white', border: 'none',
    borderRadius: 5, padding: '7px 18px', fontSize: 13, fontWeight: 'bold', cursor: 'pointer',
  },
  btnLogout: {
    background: 'transparent', color: '#aaa', border: '1px solid #555',
    borderRadius: 5, padding: '7px 14px', fontSize: 13, cursor: 'pointer',
  },
  content: { maxWidth: 1200, margin: '32px auto', padding: '0 24px' },
  search: {
    width: '100%', padding: '10px 16px', fontSize: 14,
    border: '1px solid #ddd', borderRadius: 7, marginBottom: 20,
    boxSizing: 'border-box', outline: 'none',
  },
  table: { width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  th: { background: '#3a3a5c', color: 'white', padding: '10px 14px', fontSize: 12, textAlign: 'left', fontWeight: 'bold', letterSpacing: 0.5 },
  td: { padding: '10px 14px', fontSize: 13, borderBottom: '1px solid #eee' },
  btnOpen: {
    background: '#185FA5', color: 'white', border: 'none',
    borderRadius: 4, padding: '5px 14px', fontSize: 12, cursor: 'pointer',
  },
  btnDelete: {
    background: '#f5f5f5', color: '#c0392b', border: '1px solid #ddd',
    borderRadius: 4, padding: '5px 10px', fontSize: 12, cursor: 'pointer',
  },
  btnConfirm: {
    background: '#c0392b', color: 'white', border: 'none',
    borderRadius: 4, padding: '5px 10px', fontSize: 12, cursor: 'pointer',
  },
  btnCancel: {
    background: '#eee', color: '#444', border: 'none',
    borderRadius: 4, padding: '5px 10px', fontSize: 12, cursor: 'pointer',
  },
  empty: { textAlign: 'center', color: '#999', padding: 48, fontSize: 15 },
}
