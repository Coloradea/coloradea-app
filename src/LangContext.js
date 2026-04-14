import React, { createContext, useContext, useState } from 'react'
import { translations } from './translations'

const LangContext = createContext()

export function LangProvider({ children }) {
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'fr')

  function toggleLang(l) {
    setLang(l)
    localStorage.setItem('lang', l)
  }

  const t = translations[lang]

  return (
    <LangContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}

export function LangSwitcher() {
  const { lang, toggleLang } = useLang()
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      <button
        onClick={() => toggleLang('fr')}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 20, opacity: lang === 'fr' ? 1 : 0.4,
          padding: '2px 4px', borderRadius: 4,
          outline: lang === 'fr' ? '2px solid white' : 'none',
        }}
        title="Français"
      >🇫🇷</button>
      <button
        onClick={() => toggleLang('ro')}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 20, opacity: lang === 'ro' ? 1 : 0.4,
          padding: '2px 4px', borderRadius: 4,
          outline: lang === 'ro' ? '2px solid white' : 'none',
        }}
        title="Română"
      >🇷🇴</button>
      <button
        onClick={() => toggleLang('en')}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 20, opacity: lang === 'en' ? 1 : 0.4,
          padding: '2px 4px', borderRadius: 4,
          outline: lang === 'en' ? '2px solid white' : 'none',
        }}
        title="English"
      >🇬🇧</button>
    </div>
  )
}
