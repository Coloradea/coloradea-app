import React, { useState } from 'react'

const APP_PASSWORD = process.env.REACT_APP_PASSWORD || 'coloradea2024'

export default function Login({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password === APP_PASSWORD) {
      sessionStorage.setItem('auth', 'true')
      onLogin()
    } else {
      setError('Mot de passe incorrect')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>COLORADEA</div>
        <h2 style={styles.title}>Fiches de Production</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={styles.input}
            placeholder="••••••••"
            autoFocus
          />
          {error && <div style={styles.error}>{error}</div>}
          <button type="submit" style={styles.button}>Connexion</button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    background: 'white',
    borderRadius: 10,
    padding: '40px 48px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
    width: 340,
    textAlign: 'center',
  },
  logo: {
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 3,
    color: '#1a1a2e',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    color: '#555',
    fontWeight: 'normal',
    marginBottom: 28,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    textAlign: 'left',
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#444',
  },
  input: {
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: 6,
    fontSize: 14,
    outline: 'none',
  },
  error: {
    color: '#c0392b',
    fontSize: 13,
  },
  button: {
    marginTop: 8,
    padding: '11px 0',
    background: '#7A5F8A',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 'bold',
    cursor: 'pointer',
    letterSpacing: 0.5,
  },
}
