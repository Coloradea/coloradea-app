import React, { useState, useEffect, useRef } from 'react'
import { supabase } from './supabase'

// ── Reusable field components ─────────────────────────────────────────────────

function SectionHeader({ title, color }) {
  return (
    <div style={{
      background: color, color: 'white', padding: '8px 14px',
      fontSize: 12, fontWeight: 'bold', letterSpacing: 1,
      textTransform: 'uppercase', marginTop: 16, borderRadius: '4px 4px 0 0'
    }}>{title}</div>
  )
}

function SubHeader({ title }) {
  return (
    <div style={{
      background: '#f0e8f0', color: '#444', padding: '5px 10px',
      fontSize: 11, fontWeight: 'bold', letterSpacing: 0.8,
      textTransform: 'uppercase', borderBottom: '1px solid #ddd', marginTop: 10
    }}>{title}</div>
  )
}

function Field({ label, children, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, ...style }}>
      <label style={{ fontSize: 11, fontWeight: 'bold', color: '#444' }}>{label}</label>
      {children}
    </div>
  )
}

function Input({ value, onChange, type = 'text', placeholder = '', style }) {
  return (
    <input
      type={type}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        border: '1px solid #ccc', borderRadius: 4, padding: '5px 8px',
        fontSize: 12, outline: 'none', ...style
      }}
    />
  )
}

function Select({ value, onChange, options }) {
  return (
    <select
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      style={{ border: '1px solid #ccc', borderRadius: 4, padding: '5px 8px', fontSize: 12, outline: 'none' }}
    >
      <option value="">— Sélectionner —</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

function Textarea({ value, onChange, placeholder }) {
  return (
    <textarea
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        border: '1px solid #ccc', borderRadius: 4, padding: '6px 8px',
        fontSize: 12, outline: 'none', minHeight: 46, resize: 'vertical', lineHeight: 1.5
      }}
    />
  )
}

function Check({ label, checked, onChange, round }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>
      <input
        type="checkbox"
        checked={!!checked}
        onChange={e => onChange(e.target.checked)}
        style={{ width: 14, height: 14, accentColor: '#7A5F8A', borderRadius: round ? 50 : 0 }}
      />
      {label}
    </label>
  )
}

function Grid({ cols = 2, gap = 12, children, style }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap,
      ...style
    }}>{children}</div>
  )
}

function Separator() {
  return <hr style={{ border: 'none', borderTop: '1px solid #e0e0e0', margin: '12px 0' }} />
}

const PAPIER_OPTIONS = [
  'Fedri 200gr','Fedri 220gr','Fedri 250gr','Fedri 300gr','Fedri 350gr',
  'Garda 200gr','Garda 250gr','Garda 300gr','Garda 350gr',
]
const PAPIER_PVC_OPTIONS = [...PAPIER_OPTIONS, 'PVC 200µ','PVC 500µ','PVC 700µ']

// ── Impression bloc (réutilisable) ────────────────────────────────────────────
function ImprimerieBloc({ title, data, onChange, hasPrestataire = true, hasCouvertureOptions = false, isCouleur = false }) {
  const set = (key, val) => onChange({ ...data, [key]: val })

  return (
    <div style={{ marginBottom: 4 }}>
      <SubHeader title={title} />
      <div style={{ padding: '10px 12px', background: 'white', border: '1px solid #eee', borderTop: 'none' }}>
        {hasPrestataire && (
          <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
            <Check label="Coloradea" checked={data.coloradea} onChange={v => set('coloradea', v)} />
            <Check label="Sous-traitant" checked={data.soustraitant} onChange={v => set('soustraitant', v)} />
            {hasCouvertureOptions && <>
              <Check label="Format net" checked={data.format_net} onChange={v => set('format_net', v)} />
              <Check label="Couverture en U" checked={data.couverture_u} onChange={v => set('couverture_u', v)} />
            </>}
          </div>
        )}

        {isCouleur ? (
          <>
            <Grid cols={2} gap={10}>
              <Field label="Papier">
                <Select value={data.papier} onChange={v => set('papier', v)} options={PAPIER_OPTIONS} />
              </Field>
              <Field label="Finition">
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', paddingTop: 4 }}>
                  {['Mat','Satin','Brillant'].map(f => (
                    <Check key={f} label={f} checked={data['fin_'+f.toLowerCase()]} onChange={v => set('fin_'+f.toLowerCase(), v)} />
                  ))}
                </div>
              </Field>
            </Grid>
            <Grid cols={2} gap={10} style={{ marginTop: 8 }}>
              <Field label="Nombre de pages">
                <Input type="number" value={data.nb_pages} onChange={v => set('nb_pages', v)} />
              </Field>
              <Field label="Impression">
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', paddingTop: 4 }}>
                  <Check label="Recto" checked={data.imp_recto} onChange={v => set('imp_recto', v)} />
                  <Check label="Verso" checked={data.imp_verso} onChange={v => set('imp_verso', v)} />
                  <Check label="Recto/Verso" checked={data.imp_rv} onChange={v => set('imp_rv', v)} />
                </div>
              </Field>
            </Grid>
            <Field label="Couleur" style={{ marginTop: 8 }}>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', paddingTop: 4 }}>
                <Check label="Noir" checked={data.coul_noir} onChange={v => set('coul_noir', v)} />
                <Check label="Noir + Alu" checked={data.coul_noir_alu} onChange={v => set('coul_noir_alu', v)} />
                <Check label="Alu" checked={data.coul_alu} onChange={v => set('coul_alu', v)} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Check label="Pantone :" checked={data.coul_pantone} onChange={v => set('coul_pantone', v)} />
                  <Input value={data.pantone_val} onChange={v => set('pantone_val', v)} style={{ width: 80 }} />
                </div>
              </div>
            </Field>
          </>
        ) : (
          <>
            <Grid cols={2} gap={10}>
              <Field label="Papier / PVC">
                <Select value={data.papier} onChange={v => set('papier', v)} options={PAPIER_PVC_OPTIONS} />
              </Field>
              <Field label="Finition">
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', paddingTop: 4 }}>
                  {['Mat','Satin','Brillant'].map(f => (
                    <Check key={f} label={f} checked={data['fin_'+f.toLowerCase()]} onChange={v => set('fin_'+f.toLowerCase(), v)} />
                  ))}
                </div>
              </Field>
            </Grid>
            <Grid cols={3} gap={10} style={{ marginTop: 8 }}>
              <Field label="Nombre de pages">
                <Input type="number" value={data.nb_pages} onChange={v => set('nb_pages', v)} />
              </Field>
              <Field label="Couleur">
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: 4 }}>
                  <Check label="Noir" checked={data.coul_noir} onChange={v => set('coul_noir', v)} />
                  <Check label="CMYK" checked={data.coul_cmyk} onChange={v => set('coul_cmyk', v)} />
                </div>
              </Field>
              <Field label="Impression">
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: 4 }}>
                  <Check label="Recto" checked={data.imp_recto} onChange={v => set('imp_recto', v)} />
                  <Check label="Verso" checked={data.imp_verso} onChange={v => set('imp_verso', v)} />
                  <Check label="Recto/Verso" checked={data.imp_rv} onChange={v => set('imp_rv', v)} />
                </div>
              </Field>
            </Grid>
          </>
        )}
      </div>
    </div>
  )
}

// ── Initial form state ────────────────────────────────────────────────────────
function initState() {
  return {
    // Identification
    num_devis: '', num_dossier: '', date_creation: new Date().toISOString().split('T')[0], date_livraison: '',
    // Désignation
    designation: '', client: '', type_produit: '',
    format_ouvert_l: '', format_ouvert_h: '',
    format_ferme_l: '', format_ferme_h: '',
    coins_ronds: false, coins_droits: false,
    couverture_u_imp: false, couverture_u_trans: false,
    quantite: '',
    nb_couvertures: '', nb_ft_textes: '', nb_ft_index: '',
    nb_ft_aspect: '', nb_ft_transparents: '', nb_ft_couleurs: '',
    obs_designation: '',
    // Labo
    nb_couleurs_totales: '', papier_feuillet_couleur: '',
    modele_dispo_oui: false, modele_dispo_non: false,
    decoupe_vif_oui: false, decoupe_vif_non: false,
    fin_mat: false, fin_satin: false, fin_brillant: false, fin_metallise: false,
    degre_brillance: '', contretypage_xml: false, contretypage_std: false,
    formats_couleurs: Array(16).fill(null).map(() => ({ l: '', h: '', nb: '' })),
    notes_labo: '',
    // Coating
    papier_coating: '', laize_papier: '',
    coat_fin_mat: false, coat_fin_satin: false, coat_fin_brillant: false,
    nouvel_outil: false, outil_existant: '',
    coating_lignes: Array(3).fill(null).map(() => ({ nb_coul: '', hauteur: '', nb_pages: '' })),
    obs_coating: '',
    // Imprimerie blocs
    imp_feuillets_couleur: {},
    imp_couvertures: {},
    imp_feuillet_texte: {},
    imp_index: {},
    imp_catalogue: {},
    obs_imprimerie: '',
    // Finition
    decoupe_format_net: false, decoupe_forme: false,
    perf_avec: false, perf_sans: false,
    rivet_argent: false, rivet_noir: false, rivet_or: false,
    rivet_plast_blanc: false, rivet_plast_noir: false,
    emb_film: false, emb_film_ex: '', emb_kraft: false, emb_kraft_ex: '',
    obs_finition: '',
    // Expédition
    exp_entreprise: '', exp_contact: '', exp_tel: '', exp_email: '',
    exp_adr1: '', exp_adr2: '', exp_adr3: '',
    exp_cp: '', exp_ville: '', exp_pays: '',
    obs_expedition: '',
  }
}

export default function FicheForm({ ficheId, onBack, onSaved }) {
  const [form, setForm] = useState(initState())
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(!!ficheId)
  const printRef = useRef()

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))
  const setBloc = (key, val) => setForm(f => ({ ...f, [key]: { ...f[key], ...val } }))
  const setBlocFull = (key, val) => setForm(f => ({ ...f, [key]: val }))

  useEffect(() => {
    if (ficheId) loadFiche()
  }, [ficheId])

  async function loadFiche() {
    setLoading(true)
    const { data } = await supabase.from('fiches').select('*').eq('id', ficheId).single()
    if (data) {
      const parsed = { ...data }
      if (typeof parsed.formats_couleurs === 'string') parsed.formats_couleurs = JSON.parse(parsed.formats_couleurs)
      if (typeof parsed.coating_lignes === 'string') parsed.coating_lignes = JSON.parse(parsed.coating_lignes)
      if (typeof parsed.imp_feuillets_couleur === 'string') parsed.imp_feuillets_couleur = JSON.parse(parsed.imp_feuillets_couleur)
      if (typeof parsed.imp_couvertures === 'string') parsed.imp_couvertures = JSON.parse(parsed.imp_couvertures)
      if (typeof parsed.imp_feuillet_texte === 'string') parsed.imp_feuillet_texte = JSON.parse(parsed.imp_feuillet_texte)
      if (typeof parsed.imp_index === 'string') parsed.imp_index = JSON.parse(parsed.imp_index)
      if (typeof parsed.imp_catalogue === 'string') parsed.imp_catalogue = JSON.parse(parsed.imp_catalogue)
      setForm(f => ({ ...f, ...parsed }))
    }
    setLoading(false)
  }

  async function handleSave() {
    setSaving(true)

    const clean = (obj) => {
      const result = {}
      for (const [k, v] of Object.entries(obj)) {
        if (v === '' || v === undefined) result[k] = null
        else result[k] = v
      }
      return result
    }

    const payload = clean({
      ...form,
      formats_couleurs: JSON.stringify(form.formats_couleurs),
      coating_lignes: JSON.stringify(form.coating_lignes),
      imp_feuillets_couleur: JSON.stringify(form.imp_feuillets_couleur),
      imp_couvertures: JSON.stringify(form.imp_couvertures),
      imp_feuillet_texte: JSON.stringify(form.imp_feuillet_texte),
      imp_index: JSON.stringify(form.imp_index),
      imp_catalogue: JSON.stringify(form.imp_catalogue),
    })

    let result
    if (ficheId) {
      result = await supabase.from('fiches').update(payload).eq('id', ficheId)
    } else {
      result = await supabase.from('fiches').insert([payload])
      if (!result.error) {
        await fetch(`https://ttsheptdateqblcenxjb.supabase.co/functions/v1/notify`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0c2hlcHRkYXRlcWJsY2VueGpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1MzU2MzAsImV4cCI6MjA5MTExMTYzMH0.chksYwsgFHx1l4_Pqvs3KLhCKCgrkSKajlTB0hIFrHk`
  },
          body: JSON.stringify({
            client: form.client,
            num_dossier: form.num_dossier,
            type_produit: form.type_produit,
            date_creation: form.date_creation,
          })
        }).catch(() => {})
      }
    }

    setSaving(false)
    if (!result.error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      if (onSaved) onSaved()
    }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: 60, fontFamily: 'Arial' }}>Chargement...</div>

  const f = form

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', background: '#f0f0f0', minHeight: '100vh' }}>
      {/* Top bar */}
      <div style={{ background: '#1a1a2e', color: 'white', padding: '0 24px', height: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={onBack} style={{ background: 'transparent', color: '#aaa', border: '1px solid #555', borderRadius: 5, padding: '5px 12px', fontSize: 12, cursor: 'pointer' }}>← Retour</button>
          <span style={{ fontWeight: 'bold', fontSize: 14, letterSpacing: 1 }}>FICHE DE PRODUCTION</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => window.print()} style={{ background: '#185FA5', color: 'white', border: 'none', borderRadius: 5, padding: '6px 16px', fontSize: 12, fontWeight: 'bold', cursor: 'pointer' }}>🖨️ Imprimer</button>
          <button onClick={handleSave} disabled={saving} style={{ background: saving ? '#999' : '#7A5F8A', color: 'white', border: 'none', borderRadius: 5, padding: '6px 16px', fontSize: 12, fontWeight: 'bold', cursor: 'pointer' }}>
            {saving ? 'Sauvegarde...' : saved ? '✓ Sauvegardé !' : '💾 Sauvegarder'}
          </button>
        </div>
      </div>

      {/* Form */}
      <div ref={printRef} style={{ maxWidth: 900, margin: '24px auto', background: 'white', borderRadius: 8, boxShadow: '0 2px 12px rgba(0,0,0,0.1)', padding: '20px 24px 32px' }}>

        {/* Logo + Titre */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, borderBottom: '2px solid #1a1a2e', paddingBottom: 12 }}>
          <div style={{ fontSize: 20, fontWeight: 'bold', letterSpacing: 3, color: '#1a1a2e' }}>COLORADEA</div>
          <div style={{ fontSize: 16, fontWeight: 'bold', color: '#444', letterSpacing: 1 }}>FICHE DE PRODUCTION</div>
        </div>

        {/* ── 1. IDENTIFICATION ── */}
        <SectionHeader title="1 — Identification du dossier" color="#3a3a5c" />
        <div style={{ padding: '12px', border: '1px solid #ddd', borderTop: 'none' }}>
          <Grid cols={4} gap={12}>
            <Field label="N° de devis"><Input value={f.num_devis} onChange={v => set('num_devis', v)} /></Field>
            <Field label="N° de dossier"><Input value={f.num_dossier} onChange={v => set('num_dossier', v)} /></Field>
            <Field label="Date de création"><Input type="date" value={f.date_creation} onChange={v => set('date_creation', v)} /></Field>
            <Field label="Date de livraison"><Input type="date" value={f.date_livraison} onChange={v => set('date_livraison', v)} /></Field>
          </Grid>
        </div>

        {/* ── 2. DÉSIGNATION ── */}
        <SectionHeader title="2 — Désignation & Client" color="#3a3a5c" />
        <div style={{ padding: '12px', border: '1px solid #ddd', borderTop: 'none' }}>
          <Field label="Désignation du produit" style={{ marginBottom: 10 }}>
            <Input value={f.designation} onChange={v => set('designation', v)} />
          </Field>
          <Grid cols={2} gap={12} style={{ marginBottom: 10 }}>
            <Field label="Nom du client"><Input value={f.client} onChange={v => set('client', v)} /></Field>
            <Field label="Type de produit">
              <Select value={f.type_produit} onChange={v => set('type_produit', v)}
                options={['Fandeck','Carte de couleur','Panneau','Application manuelle','Manuelle']} />
            </Field>
          </Grid>
          <Grid cols={2} gap={12} style={{ marginBottom: 10 }}>
            <Field label="Format ouvert (L × H mm)">
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <Input type="number" value={f.format_ouvert_l} onChange={v => set('format_ouvert_l', v)} style={{ width: 70 }} placeholder="L" />
                <span style={{ fontSize: 12 }}>×</span>
                <Input type="number" value={f.format_ouvert_h} onChange={v => set('format_ouvert_h', v)} style={{ width: 70 }} placeholder="H" />
              </div>
            </Field>
            <Field label="Format fermé (L × H mm)">
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <Input type="number" value={f.format_ferme_l} onChange={v => set('format_ferme_l', v)} style={{ width: 70 }} placeholder="L" />
                <span style={{ fontSize: 12 }}>×</span>
                <Input type="number" value={f.format_ferme_h} onChange={v => set('format_ferme_h', v)} style={{ width: 70 }} placeholder="H" />
              </div>
            </Field>
          </Grid>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 'bold', color: '#444', marginBottom: 4 }}>Coins</div>
              <div style={{ display: 'flex', gap: 12 }}>
                <Check label="Coins ronds" checked={f.coins_ronds} onChange={v => set('coins_ronds', v)} />
                <Check label="Coins droits" checked={f.coins_droits} onChange={v => set('coins_droits', v)} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 'bold', color: '#444', marginBottom: 4 }}>Couverture en U</div>
              <div style={{ display: 'flex', gap: 12 }}>
                <Check label="Imprimée" checked={f.couverture_u_imp} onChange={v => set('couverture_u_imp', v)} />
                <Check label="Transparente" checked={f.couverture_u_trans} onChange={v => set('couverture_u_trans', v)} />
              </div>
            </div>
          </div>
          <Field label="Quantité" style={{ maxWidth: 200, marginBottom: 10 }}>
            <Input type="number" value={f.quantite} onChange={v => set('quantite', v)} />
          </Field>
          <Grid cols={3} gap={10} style={{ marginBottom: 10 }}>
            {[['nb_couvertures','Nb de couvertures'],['nb_ft_textes','Nb de feuillets textes'],['nb_ft_index','Nb de feuillets index'],
              ['nb_ft_aspect','Nb de feuillets aspect'],['nb_ft_transparents','Nb de feuillets transparents'],['nb_ft_couleurs','Nb de feuillets couleurs']
            ].map(([k, l]) => (
              <Field key={k} label={l}><Input type="number" value={f[k]} onChange={v => set(k, v)} /></Field>
            ))}
          </Grid>
          <Field label="Observations / remarques">
            <Textarea value={f.obs_designation} onChange={v => set('obs_designation', v)} placeholder="Informations complémentaires..." />
          </Field>
        </div>

        {/* ── 3. LABORATOIRE ── */}
        <SectionHeader title="3 — Atelier — Laboratoire" color="#7A5F8A" />
        <div style={{ padding: '12px', border: '1px solid #ddd', borderTop: 'none' }}>
          <Grid cols={2} gap={12} style={{ marginBottom: 10 }}>
            <Field label="Nombre de couleurs totales"><Input type="number" value={f.nb_couleurs_totales} onChange={v => set('nb_couleurs_totales', v)} /></Field>
            <Field label="Papier / PVC pour feuillet couleur">
              <Select value={f.papier_feuillet_couleur} onChange={v => set('papier_feuillet_couleur', v)} options={PAPIER_PVC_OPTIONS} />
            </Field>
          </Grid>
          <div style={{ display: 'flex', gap: 32, marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 'bold', color: '#444', marginBottom: 4 }}>Modèle disponible</div>
              <div style={{ display: 'flex', gap: 12 }}>
                <Check label="Oui" checked={f.modele_dispo_oui} onChange={v => set('modele_dispo_oui', v)} />
                <Check label="Non" checked={f.modele_dispo_non} onChange={v => set('modele_dispo_non', v)} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 'bold', color: '#444', marginBottom: 4 }}>Découpe à vif</div>
              <div style={{ display: 'flex', gap: 12 }}>
                <Check label="Oui" checked={f.decoupe_vif_oui} onChange={v => set('decoupe_vif_oui', v)} />
                <Check label="Non" checked={f.decoupe_vif_non} onChange={v => set('decoupe_vif_non', v)} />
              </div>
            </div>
          </div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 'bold', color: '#444', marginBottom: 4 }}>Finition</div>
            <div style={{ display: 'flex', gap: 16 }}>
              {['Mat','Satin','Brillant','Métallisé'].map(fn => (
                <Check key={fn} label={fn} checked={f['fin_'+fn.toLowerCase().replace('é','e')]} onChange={v => set('fin_'+fn.toLowerCase().replace('é','e'), v)} />
              ))}
            </div>
          </div>
          <Grid cols={2} gap={12} style={{ marginBottom: 10 }}>
            <Field label="Degré de brillance"><Input value={f.degre_brillance} onChange={v => set('degre_brillance', v)} /></Field>
            <div>
              <div style={{ fontSize: 11, fontWeight: 'bold', color: '#444', marginBottom: 4 }}>Contretypage</div>
              <div style={{ display: 'flex', gap: 12 }}>
                <Check label="Base XML" checked={f.contretypage_xml} onChange={v => set('contretypage_xml', v)} />
                <Check label="Standard couleur" checked={f.contretypage_std} onChange={v => set('contretypage_std', v)} />
              </div>
            </div>
          </Grid>
          {/* 16 formats couleurs */}
          <div style={{ fontSize: 11, fontWeight: 'bold', color: '#444', marginBottom: 6 }}>Formats couleurs</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 10 }}>
            {f.formats_couleurs.map((fc, i) => (
              <div key={i} style={{ border: '1px solid #eee', borderRadius: 4, padding: '6px 8px' }}>
                <div style={{ fontSize: 10, color: '#888', marginBottom: 4 }}>Format {i+1}</div>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Input type="number" value={fc.l} placeholder="L" style={{ width: 46 }}
                    onChange={v => { const arr = [...f.formats_couleurs]; arr[i] = {...arr[i], l: v}; set('formats_couleurs', arr) }} />
                  <span style={{ fontSize: 11 }}>×</span>
                  <Input type="number" value={fc.h} placeholder="H" style={{ width: 46 }}
                    onChange={v => { const arr = [...f.formats_couleurs]; arr[i] = {...arr[i], h: v}; set('formats_couleurs', arr) }} />
                  <Input type="number" value={fc.nb} placeholder="nb" style={{ width: 38 }}
                    onChange={v => { const arr = [...f.formats_couleurs]; arr[i] = {...arr[i], nb: v}; set('formats_couleurs', arr) }} />
                </div>
              </div>
            ))}
          </div>
          <Field label="Notes laboratoire">
            <Textarea value={f.notes_labo} onChange={v => set('notes_labo', v)} placeholder="Formules, références, remarques techniques..." />
          </Field>
        </div>

        {/* ── 4. COATING ── */}
        <SectionHeader title="4 — Atelier — Coating" color="#185FA5" />
        <div style={{ padding: '12px', border: '1px solid #ddd', borderTop: 'none' }}>
          <Field label="Papier / PVC" style={{ marginBottom: 10 }}>
            <Select value={f.papier_coating} onChange={v => set('papier_coating', v)} options={PAPIER_OPTIONS} />
          </Field>
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', marginBottom: 10 }}>
            <Field label="Laize papier (cm)" style={{ minWidth: 140 }}>
              <Input type="number" value={f.laize_papier} onChange={v => set('laize_papier', v)} />
            </Field>
            <div>
              <div style={{ fontSize: 11, fontWeight: 'bold', color: '#444', marginBottom: 4 }}>Finition</div>
              <div style={{ display: 'flex', gap: 12 }}>
                {['Mat','Satin','Brillant'].map(fn => (
                  <Check key={fn} label={fn} checked={f['coat_fin_'+fn.toLowerCase()]} onChange={v => set('coat_fin_'+fn.toLowerCase(), v)} />
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 'bold', color: '#444', marginBottom: 4 }}>Outil</div>
              <Check label="Nouvel outil" checked={f.nouvel_outil} onChange={v => set('nouvel_outil', v)} />
            </div>
            <Field label="Outil existant — N°" style={{ flex: 1 }}>
              <Input value={f.outil_existant} onChange={v => set('outil_existant', v)} />
            </Field>
          </div>
          {f.coating_lignes.map((cl, i) => (
            <Grid key={i} cols={3} gap={10} style={{ marginBottom: 8 }}>
              <Field label="Nb couleurs/page">
                <Input type="number" value={cl.nb_coul}
                  onChange={v => { const arr = [...f.coating_lignes]; arr[i] = {...arr[i], nb_coul: v}; set('coating_lignes', arr) }} />
              </Field>
              <Field label="Hauteur de la bande (mm)">
                <Input type="number" value={cl.hauteur}
                  onChange={v => { const arr = [...f.coating_lignes]; arr[i] = {...arr[i], hauteur: v}; set('coating_lignes', arr) }} />
              </Field>
              <Field label="Nombre de pages">
                <Input type="number" value={cl.nb_pages}
                  onChange={v => { const arr = [...f.coating_lignes]; arr[i] = {...arr[i], nb_pages: v}; set('coating_lignes', arr) }} />
              </Field>
            </Grid>
          ))}
          <Field label="Observations / remarques" style={{ marginTop: 8 }}>
            <Textarea value={f.obs_coating} onChange={v => set('obs_coating', v)} placeholder="Informations complémentaires..." />
          </Field>
        </div>

        {/* ── 5. IMPRIMERIE ── */}
        <SectionHeader title="5 — Atelier — Imprimerie" color="#B94040" />
        <div style={{ padding: '12px', border: '1px solid #ddd', borderTop: 'none' }}>
          <ImprimerieBloc title="Feuillets couleur" data={f.imp_feuillets_couleur} onChange={v => setBlocFull('imp_feuillets_couleur', v)} hasPrestataire={false} isCouleur={true} />
          <Separator />
          <ImprimerieBloc title="Couvertures" data={f.imp_couvertures} onChange={v => setBlocFull('imp_couvertures', v)} hasCouvertureOptions={true} />
          <Separator />
          <ImprimerieBloc title="Feuillet texte" data={f.imp_feuillet_texte} onChange={v => setBlocFull('imp_feuillet_texte', v)} />
          <Separator />
          <ImprimerieBloc title="Index" data={f.imp_index} onChange={v => setBlocFull('imp_index', v)} />
          <Separator />
          <ImprimerieBloc title="Catalogue" data={f.imp_catalogue} onChange={v => setBlocFull('imp_catalogue', v)} />
          <Separator />
          <Field label="Observations / remarques">
            <Textarea value={f.obs_imprimerie} onChange={v => set('obs_imprimerie', v)} placeholder="Informations complémentaires..." />
          </Field>
        </div>

        {/* ── 6. FINITION ── */}
        <SectionHeader title="6 — Atelier — Finition" color="#2E7D5E" />
        <div style={{ padding: '12px', border: '1px solid #ddd', borderTop: 'none' }}>
          {[
            { label: 'Découpe', items: [['decoupe_format_net','Format net'],['decoupe_forme','À la forme']] },
            { label: 'Perforation', items: [['perf_avec','Avec perforation'],['perf_sans','Sans perforation']] },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 'bold', color: '#444', minWidth: 80 }}>{row.label}</div>
              <div style={{ display: 'flex', gap: 12 }}>
                {row.items.map(([k, l]) => <Check key={k} label={l} checked={f[k]} onChange={v => set(k, v)} />)}
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 'bold', color: '#444', minWidth: 80, paddingTop: 2 }}>Rivet</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {[['rivet_argent','Métal argent'],['rivet_noir','Métal noir'],['rivet_or','Métal or'],['rivet_plast_blanc','Plastique blanc'],['rivet_plast_noir','Plastique noir']].map(([k,l]) => (
                <Check key={k} label={l} checked={f[k]} onChange={v => set(k, v)} />
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 'bold', color: '#444', minWidth: 80, paddingTop: 2 }}>Emballage</div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              <Check label="Sous film" checked={f.emb_film} onChange={v => set('emb_film', v)} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Input type="number" value={f.emb_film_ex} onChange={v => set('emb_film_ex', v)} style={{ width: 60 }} />
                <span style={{ fontSize: 11 }}>exemplaires</span>
              </div>
              <Check label="Bande kraft" checked={f.emb_kraft} onChange={v => set('emb_kraft', v)} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Input type="number" value={f.emb_kraft_ex} onChange={v => set('emb_kraft_ex', v)} style={{ width: 60 }} />
                <span style={{ fontSize: 11 }}>exemplaires</span>
              </div>
            </div>
          </div>
          <Field label="Observations / remarques">
            <Textarea value={f.obs_finition} onChange={v => set('obs_finition', v)} placeholder="Informations complémentaires..." />
          </Field>
        </div>

        {/* ── 7. EXPÉDITION ── */}
        <SectionHeader title="7 — Expédition" color="#5A5A5A" />
        <div style={{ padding: '12px', border: '1px solid #ddd', borderTop: 'none' }}>
          <Grid cols={2} gap={12} style={{ marginBottom: 10 }}>
            <Field label="Nom de l'entreprise"><Input value={f.exp_entreprise} onChange={v => set('exp_entreprise', v)} /></Field>
            <Field label="Contact"><Input value={f.exp_contact} onChange={v => set('exp_contact', v)} /></Field>
            <Field label="Téléphone"><Input value={f.exp_tel} onChange={v => set('exp_tel', v)} /></Field>
            <Field label="Email"><Input type="email" value={f.exp_email} onChange={v => set('exp_email', v)} /></Field>
            <Field label="Adresse (ligne 1)"><Input value={f.exp_adr1} onChange={v => set('exp_adr1', v)} /></Field>
            <Field label="Adresse (ligne 2)"><Input value={f.exp_adr2} onChange={v => set('exp_adr2', v)} /></Field>
            <Field label="Adresse (ligne 3)"><Input value={f.exp_adr3} onChange={v => set('exp_adr3', v)} /></Field>
            <Field label="Code postal"><Input value={f.exp_cp} onChange={v => set('exp_cp', v)} /></Field>
            <Field label="Ville"><Input value={f.exp_ville} onChange={v => set('exp_ville', v)} /></Field>
            <Field label="Pays"><Input value={f.exp_pays} onChange={v => set('exp_pays', v)} /></Field>
          </Grid>
          <Field label="Observations / remarques">
            <Textarea value={f.obs_expedition} onChange={v => set('obs_expedition', v)} placeholder="Informations complémentaires..." />
          </Field>
        </div>

      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body > *:not(#root) { display: none; }
          div[style*="position: sticky"] { display: none !important; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </div>
  )
}
