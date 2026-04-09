import React, { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { useLang } from './LangContext'

export default function FichesList({ onNew, onOpen, onLogout, hideHeader }) {
  const { t } = useLang()
  const [fiches, setFiches] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)

  useEffect(() => { loadFiches() }, [])

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
      <div style={styles.content}>
        {hideHeader && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <button onClick={onNew} style={styles.btnNew}>{t.new_fiche}</button>
          </div>
        )}
        <input
          style={styles.search}
          placeholder={t.search_placeholder}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {loading ? (
          <div style={styles.empty}>{t.loading}</div>
        ) : filtered.length === 0 ? (
          <div style={styles.empty}>{t.no_fiches}</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                {[t.col_dossier, t.col_devis, t.col_client, t.col_designation, t.col_type, t.col_date_creation, t.col_date_livraison, ''].map(h => (
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
                      <button onClick={() => onOpen(f.id)} style={styles.btnOpen}>{t.open}</button>
                      {confirmDelete === f.id ? (
                        <>
                          <button onClick={() => handleDelete(f.id)} style={styles.btnConfirm}>{t.confirm}</button>
                          <button onClick={() => setConfirmDelete(null)} style={styles.btnCancel}>{t.cancel}</button>
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
  content: { maxWidth: 1200, margin: '32px auto', padding: '0 24px' },
  search: { width: '100%', padding: '10px 16px', fontSize: 14, border: '1px solid #ddd', borderRadius: 7, marginBottom: 20, boxSizing: 'border-box', outline: 'none' },
  table: { width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  th: { background: '#3a3a5c', color: 'white', padding: '10px 14px', fontSize: 12, textAlign: 'left', fontWeight: 'bold', letterSpacing: 0.5 },
  td: { padding: '10px 14px', fontSize: 13, borderBottom: '1px solid #eee' },
  btnNew: { background: '#7A5F8A', color: 'white', border: 'none', borderRadius: 5, padding: '7px 18px', fontSize: 13, fontWeight: 'bold', cursor: 'pointer' },
  btnOpen: { background: '#185FA5', color: 'white', border: 'none', borderRadius: 4, padding: '5px 14px', fontSize: 12, cursor: 'pointer' },
  btnDelete: { background: '#f5f5f5', color: '#c0392b', border: '1px solid #ddd', borderRadius: 4, padding: '5px 10px', fontSize: 12, cursor: 'pointer' },
  btnConfirm: { background: '#c0392b', color: 'white', border: 'none', borderRadius: 4, padding: '5px 10px', fontSize: 12, cursor: 'pointer' },
  btnCancel: { background: '#eee', color: '#444', border: 'none', borderRadius: 4, padding: '5px 10px', fontSize: 12, cursor: 'pointer' },
  empty: { textAlign: 'center', color: '#999', padding: 48, fontSize: 15 },
}
