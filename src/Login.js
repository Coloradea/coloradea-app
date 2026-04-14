import React, { useState } from 'react'
import { useLang, LangSwitcher } from './LangContext'

const APP_PASSWORD = process.env.REACT_APP_PASSWORD || 'coloradea2024'

export default function Login({ onLogin }) {
  const { t } = useLang()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password === APP_PASSWORD) {
      sessionStorage.setItem('auth', 'true')
      onLogin()
    } else {
      setError(t.login_error)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            <LangSwitcherDark />
          </div>
        </div>
        <div style={styles.logo}>COLORADEA</div>
        <h2 style={styles.title}>{t.login_title}</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>{t.login_password}</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={styles.input}
            placeholder="••••••••"
            autoFocus
          />
          {error && <div style={styles.error}>{error}</div>}
          <button type="submit" style={styles.button}>{t.login_button}</button>
        </form>
      </div>
    </div>
  )
}

function LangSwitcherDark() {
  const { lang, toggleLang } = useLang()
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      <button onClick={() => toggleLang('fr')} style={{ background:'none',border:'none',cursor:'pointer',fontSize:20,opacity:lang==='fr'?1:0.3 }} title="Français">🇫🇷</button>
      <button onClick={() => toggleLang('ro')} style={{ background:'none',border:'none',cursor:'pointer',fontSize:20,opacity:lang==='ro'?1:0.3 }} title="Română">🇷🇴</button>
      <button onClick={() => toggleLang('en')} style={{ background:'none',border:'none',cursor:'pointer',fontSize:20,opacity:lang==='en'?1:0.3 }} title="English">🇬🇧</button>
    </div>
  )
}

const styles = {
  container: { minHeight:'100vh', background:'#f0f0f0', display:'flex', alignItems:'center', justifyContent:'center' },
  card: { background:'white', borderRadius:10, padding:'32px 48px', boxShadow:'0 4px 24px rgba(0,0,0,0.12)', width:340 },
  logo: { fontSize:22, fontWeight:'bold', letterSpacing:3, color:'#1a1a2e', marginBottom:8, textAlign:'center' },
  title: { fontSize:16, color:'#555', fontWeight:'normal', marginBottom:28, textAlign:'center' },
  form: { display:'flex', flexDirection:'column', gap:12 },
  label: { fontSize:13, fontWeight:'bold', color:'#444' },
  input: { padding:'10px 12px', border:'1px solid #ddd', borderRadius:6, fontSize:14, outline:'none' },
  error: { color:'#c0392b', fontSize:13 },
  button: { marginTop:8, padding:'11px 0', background:'#7A5F8A', color:'white', border:'none', borderRadius:6, fontSize:14, fontWeight:'bold', cursor:'pointer' },
}
