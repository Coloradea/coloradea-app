import React, { useState, useEffect, useRef } from 'react'
import { supabase } from './supabase'
import { useLang } from './LangContext'

function SectionHeader({ title, color, className }) {
  return (
    <div className={className} style={{
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
    <input type={type} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ border: '1px solid #ccc', borderRadius: 4, padding: '5px 8px', fontSize: 12, outline: 'none', ...style }} />
  )
}

function Select({ value, onChange, options, placeholder }) {
  return (
    <select value={value || ''} onChange={e => onChange(e.target.value)}
      style={{ border: '1px solid #ccc', borderRadius: 4, padding: '5px 8px', fontSize: 12, outline: 'none' }}>
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

function Textarea({ value, onChange, placeholder }) {
  return (
    <textarea value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ border: '1px solid #ccc', borderRadius: 4, padding: '6px 8px', fontSize: 12, outline: 'none', minHeight: 46, resize: 'vertical', lineHeight: 1.5 }} />
  )
}

function Check({ label, checked, onChange }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>
      <input type="checkbox" checked={!!checked} onChange={e => onChange(e.target.checked)}
        style={{ width: 14, height: 14, accentColor: '#7A5F8A' }} />
      {label}
    </label>
  )
}

function Grid({ cols = 2, gap = 12, children, style }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap, ...style }}>{children}</div>
  )
}

function Separator() {
  return <hr style={{ border: 'none', borderTop: '1px solid #e0e0e0', margin: '12px 0' }} />
}

const PAPIER_OPTIONS = ['Fedri 200gr','Fedri 220gr','Fedri 250gr','Fedri 300gr','Fedri 350gr','Garda 200gr','Garda 250gr','Garda 300gr','Garda 350gr']
const PAPIER_PVC_OPTIONS = [...PAPIER_OPTIONS, 'PVC 200µ','PVC 500µ','PVC 700µ']

function ImprimerieBloc({ title, data, onChange, hasPrestataire = true, hasCouvertureOptions = false, isCouleur = false, t }) {
  const set = (key, val) => onChange({ ...data, [key]: val })
  return (
    <div style={{ marginBottom: 4 }}>
      <SubHeader title={title} />
      <div style={{ padding: '10px 12px', background: 'white', border: '1px solid #eee', borderTop: 'none' }}>
        {hasPrestataire && (
          <>
            <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
              <Check label={t.coloradea} checked={data.coloradea} onChange={v => set('coloradea', v)} />
              <Check label={t.sous_traitant} checked={data.soustraitant} onChange={v => set('soustraitant', v)} />
            </div>
            {hasCouvertureOptions && (
              <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
                <Check label={t.format_net} checked={data.format_net} onChange={v => set('format_net', v)} />
                <Check label={t.couverture_u} checked={data.couverture_u} onChange={v => set('couverture_u', v)} />
              </div>
            )}
          </>
        )}
        {isCouleur ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 10, marginBottom: 8 }}>
              <Field label={t.papier}><Select value={data.papier} onChange={v => set('papier', v)} options={PAPIER_OPTIONS} placeholder={t.select} /></Field>
              <Field label={t.finition}>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', paddingTop: 4 }}>
                  {[t.mat, t.satin, t.brillant].map((f, i) => (
                    <Check key={i} label={f} checked={data['fin_'+['mat','satin','brillant'][i]]} onChange={v => set('fin_'+['mat','satin','brillant'][i], v)} />
                  ))}
                </div>
              </Field>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 10, marginTop: 8 }}>
              <Field label={t.nb_pages}><Input type="number" value={data.nb_pages} onChange={v => set('nb_pages', v)} /></Field>
              <Field label={t.impression}>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', paddingTop: 4 }}>
                  <Check label={t.recto_sur_teinte || 'Recto sur la teinte'} checked={data.imp_recto_sur} onChange={v => set('imp_recto_sur', v)} />
                  <Check label={t.recto_sous_teinte || 'Recto sous la teinte'} checked={data.imp_recto_sous} onChange={v => set('imp_recto_sous', v)} />
                  <div style={{display:'flex',gap:10,flexWrap:'nowrap'}}>
                    <Check label={t.recto_verso} checked={data.imp_rv} onChange={v => set('imp_rv', v)} />
                    <Check label={t.verso} checked={data.imp_verso} onChange={v => set('imp_verso', v)} />
                  </div>
                </div>
              </Field>
            </div>
            <Field label={t.couleur} style={{ marginTop: 8 }}>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', paddingTop: 4 }}>
                <Check label={t.noir} checked={data.coul_noir} onChange={v => set('coul_noir', v)} />
                <Check label={t.noir_alu} checked={data.coul_noir_alu} onChange={v => set('coul_noir_alu', v)} />
                <Check label={t.alu} checked={data.coul_alu} onChange={v => set('coul_alu', v)} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Check label={t.pantone} checked={data.coul_pantone} onChange={v => set('coul_pantone', v)} />
                  <Input value={data.pantone_val} onChange={v => set('pantone_val', v)} style={{ width: 80 }} />
                </div>
              </div>
            </Field>
          </>
        ) : (
          <>
            <Grid cols={2} gap={10}>
              <Field label={t.papier_pvc}><Select value={data.papier} onChange={v => set('papier', v)} options={PAPIER_PVC_OPTIONS} placeholder={t.select} /></Field>
              <Field label={t.finition}>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', paddingTop: 4 }}>
                  {[t.mat, t.satin, t.brillant].map((f, i) => (
                    <Check key={i} label={f} checked={data['fin_'+['mat','satin','brillant'][i]]} onChange={v => set('fin_'+['mat','satin','brillant'][i], v)} />
                  ))}
                </div>
              </Field>
            </Grid>
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 10, marginTop: 8 }}>
              <Field label={t.nb_pages}><Input type="number" value={data.nb_pages} onChange={v => set('nb_pages', v)} /></Field>
              <Field label={t.impression}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: 4 }}>
                  <Check label={t.recto_sur_teinte || 'Recto sur la teinte'} checked={data.imp_recto_sur} onChange={v => set('imp_recto_sur', v)} />
                  <Check label={t.recto_sous_teinte || 'Recto sous la teinte'} checked={data.imp_recto_sous} onChange={v => set('imp_recto_sous', v)} />
                  <div style={{display:'flex',gap:10,flexWrap:'nowrap'}}>
                    <Check label={t.recto_verso} checked={data.imp_rv} onChange={v => set('imp_rv', v)} />
                    <Check label={t.verso} checked={data.imp_verso} onChange={v => set('imp_verso', v)} />
                  </div>
                </div>
              </Field>
            </div>
            <div style={{ marginTop: 8 }}>
              <Field label={t.couleur}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: 4 }}>
                  <Check label={t.noir} checked={data.coul_noir} onChange={v => set('coul_noir', v)} />
                  <Check label={t.cmyk} checked={data.coul_cmyk} onChange={v => set('coul_cmyk', v)} />
                </div>
              </Field>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function initState() {
  return {
    num_devis: '', num_dossier: '', date_creation: new Date().toISOString().split('T')[0], date_livraison: '',
    designation: '', client: '', type_produit: '',
    format_ouvert_l: '', format_ouvert_h: '', format_ferme_l: '', format_ferme_h: '',
    coins_ronds: false, coins_droits: false, couverture_u_imp: false, couverture_u_trans: false, couverture_u_microns: '',
    quantite: '', nb_couvertures: '', nb_ft_textes: '', nb_ft_index: '',
    nb_ft_aspect: '', nb_ft_transparents: '', nb_ft_couleurs: '', obs_designation: '',
    nb_couleurs_totales: '', papier_feuillet_couleur: '',
    spectro_xrite: false, spectro_datacolor: false, spectro_autre: false,
    modele_dispo_oui: false, modele_dispo_non: false, decoupe_vif_oui: false, decoupe_vif_non: false,
    fin_mat: false, fin_satin: false, fin_brillant: false, fin_metallise: false, fin_velours: false,
    fin_water_base: false, fin_grain: false, fin_grain_pct: '',
    papier_fin_mat: false, papier_fin_satin: false, papier_fin_brillant: false,
    degre_brillance: '', contretypage_xml: false, contretypage_std: false,
    formats_couleurs: Array(8).fill(null).map(() => ({ l: '', h: '', nb: '', teintes_page: '', pages: '' })),
    notes_labo: '', papier_coating: '', laize_papier: '',
    coat_fin_mat: false, coat_fin_satin: false, coat_fin_brillant: false,
    nouvel_outil: false, outil_existant: '',
    coating_lignes: Array(8).fill(null).map(() => ({ nb_coul: '', hauteur: '', espace_teintes: '', nb_pages: '' })),
    obs_coating: '', imp_feuillets_couleur: {}, imp_couvertures: {}, imp_feuillet_texte: {},
    imp_index: {}, imp_catalogue: {}, obs_imprimerie: '',
    decoupe_format_net: false, decoupe_forme: false, perf_avec: false, perf_sans: false,
    rivet_argent: false, rivet_noir: false, rivet_or: false, rivet_plast_blanc: false, rivet_plast_noir: false,
    emb_film: false, emb_film_ex: '', emb_kraft: false, emb_kraft_ex: '', obs_finition: '',
    exp_entreprise: '', exp_service: '', exp_contact: '', exp_tel: '', exp_email: '',
    exp_adr1: '', exp_adr2: '', exp_adr3: '', exp_cp: '', exp_ville: '', exp_pays: '', obs_expedition: '',
  }
}

export default function FicheForm({ ficheId, onBack, onSaved }) {
  const { t } = useLang()
  const [form, setForm] = useState(initState())
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(!!ficheId)
  const printRef = useRef()

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))
  const setBlocFull = (key, val) => setForm(f => ({ ...f, [key]: val }))

  useEffect(() => { if (ficheId) loadFiche() }, [ficheId])

  async function loadFiche() {
    setLoading(true)
    const { data } = await supabase.from('fiches').select('*').eq('id', ficheId).single()
    if (data) {
      const parsed = { ...data }
      if (typeof parsed.formats_couleurs === 'string') parsed.formats_couleurs = JSON.parse(parsed.formats_couleurs)
      if (Array.isArray(parsed.formats_couleurs)) {
        while (parsed.formats_couleurs.length < 8) parsed.formats_couleurs.push({ l: '', h: '', nb: '', teintes_page: '', pages: '' })
        parsed.formats_couleurs = parsed.formats_couleurs.slice(0, 8)
      }
      if (typeof parsed.coating_lignes === 'string') parsed.coating_lignes = JSON.parse(parsed.coating_lignes)
      if (Array.isArray(parsed.coating_lignes)) {
        while (parsed.coating_lignes.length < 8) parsed.coating_lignes.push({ nb_coul: '', hauteur: '', espace_teintes: '', nb_pages: '' })
        parsed.coating_lignes = parsed.coating_lignes.slice(0, 8)
      }
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
      for (const [k, v] of Object.entries(obj)) { result[k] = (v === '' || v === undefined) ? null : v }
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
    if (ficheId) result = await supabase.from('fiches').update(payload).eq('id', ficheId)
    else result = await supabase.from('fiches').insert([payload])
    setSaving(false)
    if (!result.error) { setSaved(true); setTimeout(() => setSaved(false), 3000); if (onSaved) onSaved() }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: 60, fontFamily: 'Arial' }}>{t.loading}</div>

  const f = form

  const TYPE_OPTIONS_FR = ['Fandeck','Carte de couleur','Panneau','Application manuelle']
  const TYPE_OPTIONS_RO = ['Fandeck','Carte de culori','Panou','Aplicare manuală']
  const TYPE_OPTIONS_EN = ['Fandeck','Colour card','Panel','Manual application']
  const typeOptions = t.oui === 'Oui' ? TYPE_OPTIONS_FR : t.oui === 'Yes' ? TYPE_OPTIONS_EN : TYPE_OPTIONS_RO

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', background: '#f0f0f0', minHeight: '100vh' }}>
      <div style={{ background: '#1a1a2e', color: 'white', padding: '0 24px', height: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={onBack} style={{ background: 'transparent', color: '#aaa', border: '1px solid #555', borderRadius: 5, padding: '5px 12px', fontSize: 12, cursor: 'pointer' }}>{t.back}</button>
          <span style={{ fontWeight: 'bold', fontSize: 14, letterSpacing: 1 }}>{t.section_identification.split('—')[1]?.trim() || 'FICHE DE PRODUCTION'}</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => window.print()} style={{ background: '#185FA5', color: 'white', border: 'none', borderRadius: 5, padding: '6px 16px', fontSize: 12, fontWeight: 'bold', cursor: 'pointer' }}>{t.print}</button>
          <button onClick={handleSave} disabled={saving} style={{ background: saving ? '#999' : '#7A5F8A', color: 'white', border: 'none', borderRadius: 5, padding: '6px 16px', fontSize: 12, fontWeight: 'bold', cursor: 'pointer' }}>
            {saving ? t.saving : saved ? t.saved : t.save}
          </button>
        </div>
      </div>

      <div ref={printRef} style={{ maxWidth: 900, margin: '24px auto', background: 'white', borderRadius: 8, boxShadow: '0 2px 12px rgba(0,0,0,0.1)', padding: '20px 24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, borderBottom: '2px solid #1a1a2e', paddingBottom: 12 }}>
          <img src="data:image/png;base64,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" style={{ height:36, objectFit:"contain" }} alt="Coloradea" />
          <div style={{ fontSize: 36, fontWeight: "bold", color: "#1a1a2e", letterSpacing: 2 }}>PRODUCTION</div>
        </div>

        {/* 1. IDENTIFICATION */}
        <SectionHeader title={t.section_identification} color="#3a3a5c" />
        <div style={{ padding: '12px', border: '1px solid #ddd', borderTop: 'none' }}>
          <Grid cols={4} gap={12}>
            <Field label={t.num_devis}><Input value={f.num_devis} onChange={v => set('num_devis', v)} /></Field>
            <Field label={t.num_dossier}><Input value={f.num_dossier} onChange={v => set('num_dossier', v)} /></Field>
            <Field label={t.date_debut || t.date_creation}><Input type="date" value={f.date_creation} onChange={v => set('date_creation', v)} /></Field>
            <Field label={t.date_livraison}><Input type="date" value={f.date_livraison} onChange={v => set('date_livraison', v)} /></Field>
          </Grid>
        </div>

        {/* 2. DÉSIGNATION */}
        <SectionHeader title={t.section_designation} color="#3a3a5c" />
        <div style={{ padding: '12px', border: '1px solid #ddd', borderTop: 'none' }}>
          <Field label={t.designation_produit} style={{ marginBottom: 10 }}>
            <Input value={f.designation} onChange={v => set('designation', v)} />
          </Field>
          <Grid cols={2} gap={12} style={{ marginBottom: 10 }}>
            <Field label={t.nom_client}><Input value={f.client} onChange={v => set('client', v)} /></Field>
            <Field label={t.type_produit}>
              <Select value={f.type_produit} onChange={v => set('type_produit', v)} options={typeOptions} placeholder={t.select} />
            </Field>
          </Grid>
          <Grid cols={2} gap={12} style={{ marginBottom: 10 }}>
            <Field label={t.format_ouvert}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <Input type="number" value={f.format_ouvert_l} onChange={v => set('format_ouvert_l', v)} style={{ width: 70 }} placeholder="L" />
                <span style={{ fontSize: 12 }}>×</span>
                <Input type="number" value={f.format_ouvert_h} onChange={v => set('format_ouvert_h', v)} style={{ width: 70 }} placeholder="H" />
              </div>
            </Field>
            <Field label={t.format_ferme}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <Input type="number" value={f.format_ferme_l} onChange={v => set('format_ferme_l', v)} style={{ width: 70 }} placeholder="L" />
                <span style={{ fontSize: 12 }}>×</span>
                <Input type="number" value={f.format_ferme_h} onChange={v => set('format_ferme_h', v)} style={{ width: 70 }} placeholder="H" />
              </div>
            </Field>
          </Grid>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 'bold', color: '#444', marginBottom: 4 }}>{t.coins}</div>
              <div style={{ display: 'flex', gap: 12 }}>
                <Check label={t.coins_ronds} checked={f.coins_ronds} onChange={v => set('coins_ronds', v)} />
                <Check label={t.coins_droits} checked={f.coins_droits} onChange={v => set('coins_droits', v)} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 'bold', color: '#444', marginBottom: 4 }}>{t.couverture_u}</div>
              <div style={{ display: 'flex', gap: 12 }}>
                <Check label={t.imprimee} checked={f.couverture_u_imp} onChange={v => set('couverture_u_imp', v)} />
                <Check label={t.transparente} checked={f.couverture_u_trans} onChange={v => set('couverture_u_trans', v)} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Input type="number" value={f.couverture_u_microns} onChange={v => set('couverture_u_microns', v)} style={{ width: 65 }} />
                  <span style={{ fontSize: 11, color: '#444' }}>microns</span>
                </div>
              </div>
            </div>
          </div>
          <Field label={t.quantite} style={{ maxWidth: 200, marginBottom: 10 }}>
            <Input type="number" value={f.quantite} onChange={v => set('quantite', v)} />
          </Field>
          <Grid cols={3} gap={10} style={{ marginBottom: 10 }}>
            {[[f.nb_couvertures,'nb_couvertures',t.nb_couvertures],[f.nb_ft_textes,'nb_ft_textes',t.nb_ft_textes],[f.nb_ft_index,'nb_ft_index',t.nb_ft_index],
              [f.nb_ft_aspect,'nb_ft_aspect',t.nb_ft_aspect],[f.nb_ft_transparents,'nb_ft_transparents',t.nb_ft_transparents],[f.nb_ft_couleurs,'nb_ft_couleurs',t.nb_ft_couleurs]
            ].map(([val, key, label]) => (
              <Field key={key} label={label}><Input type="number" value={val} onChange={v => set(key, v)} /></Field>
            ))}
          </Grid>
          <Field label={t.observations}>
            <Textarea value={f.obs_designation} onChange={v => set('obs_designation', v)} placeholder={t.info_complementaires} />
          </Field>
        </div>

        {/* 3. LABORATOIRE */}
        <div style={{pageBreakBefore:'always'}}>
        <SectionHeader title={t.section_labo} color="#7A5F8A" />
        <div style={{ padding: '12px', border: '1px solid #ddd', borderTop: 'none' }}>
          <Grid cols={2} gap={12} style={{ marginBottom: 10 }}>
            <div>
              <Field label={t.nb_couleurs_totales} style={{ marginBottom: 8 }}>
                <Input type="number" value={f.nb_couleurs_totales} onChange={v => set('nb_couleurs_totales', v)} />
              </Field>
              {/* SPECTRO DU CLIENT */}
              <div style={{ marginBottom: 6 }}>
                <div style={{ fontSize: 11, fontWeight: 'bold', color: '#444', marginBottom: 4 }}>Spectro du client</div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <Check label="X-RITE" checked={f.spectro_xrite} onChange={v => set('spectro_xrite', v)} />
                  <Check label="DATACOLOR" checked={f.spectro_datacolor} onChange={v => set('spectro_datacolor', v)} />
                  <Check label="Autre" checked={f.spectro_autre} onChange={v => set('spectro_autre', v)} />
                </div>
              </div>
            </div>
            <div>
              <Field label={t.papier_feuillet}>
                <Select value={f.papier_feuillet_couleur} onChange={v => set('papier_feuillet_couleur', v)} options={PAPIER_OPTIONS} placeholder={t.select} />
              </Field>
              <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                <Check label={t.mat} checked={f.papier_fin_mat} onChange={v => set('papier_fin_mat', v)} />
                <Check label={t.satin} checked={f.papier_fin_satin} onChange={v => set('papier_fin_satin', v)} />
                <Check label={t.brillant} checked={f.papier_fin_brillant} onChange={v => set('papier_fin_brillant', v)} />
              </div>
            </div>
          </Grid>
          <div style={{ display: 'flex', gap: 32, marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 'bold', color: '#444', marginBottom: 4 }}>{t.modele_dispo}</div>
              <div style={{ display: 'flex', gap: 12 }}>
                <Check label={t.oui} checked={f.modele_dispo_oui} onChange={v => set('modele_dispo_oui', v)} />
                <Check label={t.non} checked={f.modele_dispo_non} onChange={v => set('modele_dispo_non', v)} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 'bold', color: '#444', marginBottom: 4 }}>{t.decoupe_vif}</div>
              <div style={{ display: 'flex', gap: 12 }}>
                <Check label={t.oui} checked={f.decoupe_vif_oui} onChange={v => set('decoupe_vif_oui', v)} />
                <Check label={t.non} checked={f.decoupe_vif_non} onChange={v => set('decoupe_vif_non', v)} />
              </div>
            </div>
          </div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 'bold', color: '#444', marginBottom: 4 }}>{t.finition_couleur || 'Finition couleur'}</div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
              <Check label={t.mat} checked={f.fin_mat} onChange={v => set('fin_mat', v)} />
              <Check label={t.velours || 'Velours'} checked={f.fin_velours} onChange={v => set('fin_velours', v)} />
              <Check label={t.satin} checked={f.fin_satin} onChange={v => set('fin_satin', v)} />
              <Check label={t.brillant} checked={f.fin_brillant} onChange={v => set('fin_brillant', v)} />
              <Check label={t.metallise} checked={f.fin_metallise} onChange={v => set('fin_metallise', v)} />
            </div>
            {/* WATER BASE + GRAIN */}
            <div style={{ display: 'flex', gap: 20 }}>
              <Check label="Water base" checked={f.fin_water_base} onChange={v => set('fin_water_base', v)} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Check label="Grain" checked={f.fin_grain} onChange={v => set('fin_grain', v)} />
                <Input type="number" value={f.fin_grain_pct} onChange={v => set('fin_grain_pct', v)} style={{ width: 55 }} />
                <span style={{ fontSize: 11, color: '#444' }}>%</span>
              </div>
            </div>
          </div>
          <Grid cols={2} gap={12} style={{ marginBottom: 10 }}>
            <Field label={t.degre_brillance}><Input value={f.degre_brillance} onChange={v => set('degre_brillance', v)} /></Field>
            <div>
              <div style={{ fontSize: 11, fontWeight: 'bold', color: '#444', marginBottom: 4 }}>{t.contretypage}</div>
              <div style={{ display: 'flex', gap: 12 }}>
                <Check label={t.base_xml} checked={f.contretypage_xml} onChange={v => set('contretypage_xml', v)} />
                <Check label={t.standard_couleur} checked={f.contretypage_std} onChange={v => set('contretypage_std', v)} />
              </div>
            </div>
          </Grid>
          <div style={{ fontSize: 11, fontWeight: 'bold', color: '#444', marginBottom: 6 }}>{t.formats_couleurs}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 10 }}>
            {f.formats_couleurs.map((fc, i) => (
              <div key={i} style={{ border: '1px solid #eee', borderRadius: 4, padding: '6px 8px' }}>
                <div style={{ fontSize: 10, color: '#888', marginBottom: 4 }}>Format {i+1}</div>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
                  <Input type="number" value={fc.l} placeholder="L" style={{ width: 40 }}
                    onChange={v => { const arr = [...f.formats_couleurs]; arr[i] = {...arr[i], l: v}; set('formats_couleurs', arr) }} />
                  <span style={{ fontSize: 11 }}>×</span>
                  <Input type="number" value={fc.h} placeholder="H" style={{ width: 40 }}
                    onChange={v => { const arr = [...f.formats_couleurs]; arr[i] = {...arr[i], h: v}; set('formats_couleurs', arr) }} />
                  <span style={{ fontSize: 10, color: '#888' }}>mm</span>
                </div>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 4 }}>
                  <Input type="number" value={fc.nb} placeholder="nb" style={{ width: 40 }}
                    onChange={v => { const arr = [...f.formats_couleurs]; arr[i] = {...arr[i], nb: v}; set('formats_couleurs', arr) }} />
                  <span style={{ fontSize: 10, color: '#888' }}>{t.teintes || 'teintes'}</span>
                </div>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 4 }}>
                  <Input type="number" value={fc.teintes_page} placeholder="nb" style={{ width: 40 }}
                    onChange={v => {
                      const arr = [...f.formats_couleurs]; arr[i] = {...arr[i], teintes_page: v}; set('formats_couleurs', arr)
                      const cl = [...f.coating_lignes]; cl[i] = {...cl[i], nb_coul: v}; set('coating_lignes', cl)
                    }} />
                  <span style={{ fontSize: 10, color: '#888' }}>{t.teintes_par_page || 'teintes par page'}</span>
                </div>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <Input type="number" value={fc.pages} placeholder="nb" style={{ width: 40 }}
                    onChange={v => {
                      const arr = [...f.formats_couleurs]; arr[i] = {...arr[i], pages: v}; set('formats_couleurs', arr)
                      const cl = [...f.coating_lignes]; cl[i] = {...cl[i], nb_pages: v}; set('coating_lignes', cl)
                    }} />
                  <span style={{ fontSize: 10, color: '#888' }}>{t.pages_couleur || 'pages couleur'}</span>
                </div>
              </div>
            ))}
          </div>
          <Field label={t.notes_labo}>
            <Textarea value={f.notes_labo} onChange={v => set('notes_labo', v)} placeholder={t.formules_ref} />
          </Field>
        </div>
        </div>

        {/* 4. COATING */}
        <div style={{pageBreakBefore:'always'}}>
        <SectionHeader title={t.section_coating} color="#185FA5" />
        <div style={{ padding: '12px', border: '1px solid #ddd', borderTop: 'none' }}>
          <Field label={t.papier_pvc} style={{ marginBottom: 10 }}>
            <Select value={f.papier_coating} onChange={v => set('papier_coating', v)} options={PAPIER_OPTIONS} placeholder={t.select} />
          </Field>
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', marginBottom: 10 }}>
            <Field label={t.laize_papier} style={{ minWidth: 140 }}>
              <Input type="number" value={f.laize_papier} onChange={v => set('laize_papier', v)} />
            </Field>
            <div>
              <div style={{ fontSize: 11, fontWeight: 'bold', color: '#444', marginBottom: 4 }}>{t.finition}</div>
              <div style={{ display: 'flex', gap: 12 }}>
                <Check label={t.mat} checked={f.coat_fin_mat} onChange={v => set('coat_fin_mat', v)} />
                <Check label={t.satin} checked={f.coat_fin_satin} onChange={v => set('coat_fin_satin', v)} />
                <Check label={t.brillant} checked={f.coat_fin_brillant} onChange={v => set('coat_fin_brillant', v)} />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 'bold', color: '#444', marginBottom: 4 }}>{t.outil}</div>
              <Check label={t.nouvel_outil} checked={f.nouvel_outil} onChange={v => set('nouvel_outil', v)} />
            </div>
            <Field label={t.outil_existant} style={{ flex: 1 }}>
              <Input value={f.outil_existant} onChange={v => set('outil_existant', v)} />
            </Field>
          </div>
          {f.coating_lignes.map((cl, i) => (
            <Grid key={i} cols={4} gap={10} style={{ marginBottom: 8 }}>
              <Field label={t.nb_coul_page}><Input type="number" value={cl.nb_coul} onChange={v => { const arr=[...f.coating_lignes]; arr[i]={...arr[i],nb_coul:v}; set('coating_lignes',arr) }} /></Field>
              <Field label={t.hauteur_bande}><Input type="number" value={cl.hauteur} onChange={v => { const arr=[...f.coating_lignes]; arr[i]={...arr[i],hauteur:v}; set('coating_lignes',arr) }} /></Field>
              <Field label={t.espace_teintes || 'Espace teintes (mm)'}><Input type="number" value={cl.espace_teintes} onChange={v => { const arr=[...f.coating_lignes]; arr[i]={...arr[i],espace_teintes:v}; set('coating_lignes',arr) }} /></Field>
              <Field label={t.nb_pages}><Input type="number" value={cl.nb_pages} onChange={v => { const arr=[...f.coating_lignes]; arr[i]={...arr[i],nb_pages:v}; set('coating_lignes',arr) }} /></Field>
            </Grid>
          ))}
          <Field label={t.observations} style={{ marginTop: 8 }}>
            <Textarea value={f.obs_coating} onChange={v => set('obs_coating', v)} placeholder={t.info_complementaires} />
          </Field>
        </div>
        </div>

        {/* 5. IMPRIMERIE */}
        <div style={{pageBreakBefore:'always'}}>
        <SectionHeader title={t.section_imprimerie} color="#B94040" />
        <div style={{ padding: '12px', border: '1px solid #ddd', borderTop: 'none' }}>
          <ImprimerieBloc title={t.feuillets_couleur} data={f.imp_feuillets_couleur} onChange={v => setBlocFull('imp_feuillets_couleur', v)} hasPrestataire={false} isCouleur={true} t={t} />
          <Separator />
          <ImprimerieBloc title={t.couvertures} data={f.imp_couvertures} onChange={v => setBlocFull('imp_couvertures', v)} hasCouvertureOptions={true} t={t} />
          <Separator />
          <ImprimerieBloc title={t.feuillet_texte} data={f.imp_feuillet_texte} onChange={v => setBlocFull('imp_feuillet_texte', v)} t={t} />
          <Separator />
          <ImprimerieBloc title={t.index} data={f.imp_index} onChange={v => setBlocFull('imp_index', v)} t={t} />
          <Separator />
          <ImprimerieBloc title={t.catalogue} data={f.imp_catalogue} onChange={v => setBlocFull('imp_catalogue', v)} t={t} />
          <Separator />
          <Field label={t.observations}>
            <Textarea value={f.obs_imprimerie} onChange={v => set('obs_imprimerie', v)} placeholder={t.info_complementaires} />
          </Field>
        </div>
        </div>

        {/* 6. FINITION */}
        <div style={{pageBreakBefore:'always'}}>
        <SectionHeader title={t.section_finition} color="#2E7D5E" />
        <div style={{ padding: '12px', border: '1px solid #ddd', borderTop: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 'bold', color: '#444', minWidth: 80 }}>{t.decoupe}</div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Check label={t.format_net} checked={f.decoupe_format_net} onChange={v => set('decoupe_format_net', v)} />
              <Check label={t.a_la_forme} checked={f.decoupe_forme} onChange={v => set('decoupe_forme', v)} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 'bold', color: '#444', minWidth: 80 }}>{t.perforation}</div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Check label={t.avec_perf} checked={f.perf_avec} onChange={v => set('perf_avec', v)} />
              <Check label={t.sans_perf} checked={f.perf_sans} onChange={v => set('perf_sans', v)} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 'bold', color: '#444', minWidth: 80, paddingTop: 2 }}>{t.rivet}</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Check label={t.rivet_argent} checked={f.rivet_argent} onChange={v => set('rivet_argent', v)} />
              <Check label={t.rivet_noir} checked={f.rivet_noir} onChange={v => set('rivet_noir', v)} />
              <Check label={t.rivet_or} checked={f.rivet_or} onChange={v => set('rivet_or', v)} />
              <Check label={t.rivet_plast_blanc} checked={f.rivet_plast_blanc} onChange={v => set('rivet_plast_blanc', v)} />
              <Check label={t.rivet_plast_noir} checked={f.rivet_plast_noir} onChange={v => set('rivet_plast_noir', v)} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 'bold', color: '#444', minWidth: 80, paddingTop: 2 }}>{t.emballage}</div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              <Check label={t.sous_film} checked={f.emb_film} onChange={v => set('emb_film', v)} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Input type="number" value={f.emb_film_ex} onChange={v => set('emb_film_ex', v)} style={{ width: 60 }} />
                <span style={{ fontSize: 11 }}>{t.exemplaires}</span>
              </div>
              <Check label={t.bande_kraft} checked={f.emb_kraft} onChange={v => set('emb_kraft', v)} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Input type="number" value={f.emb_kraft_ex} onChange={v => set('emb_kraft_ex', v)} style={{ width: 60 }} />
                <span style={{ fontSize: 11 }}>{t.exemplaires}</span>
              </div>
            </div>
          </div>
          <Field label={t.observations}>
            <Textarea value={f.obs_finition} onChange={v => set('obs_finition', v)} placeholder={t.info_complementaires} />
          </Field>
        </div>
        </div>

        {/* 7. EXPÉDITION */}
        <div style={{pageBreakBefore:'always'}}>
        <SectionHeader title={t.section_expedition} color="#5A5A5A" />
        <div style={{ padding: '12px', border: '1px solid #ddd', borderTop: 'none' }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
            <Field label={t.nom_entreprise} style={{ flex: 1 }}><Input value={f.exp_entreprise} onChange={v => set('exp_entreprise', v)} /></Field>
            <Field label={t.service || 'Service'} style={{ flex: 1 }}><Input value={f.exp_service} onChange={v => set('exp_service', v)} /></Field>
          </div>
          <Grid cols={2} gap={12} style={{ marginBottom: 10 }}>
            <Field label={t.adresse1}><Input value={f.exp_adr1} onChange={v => set('exp_adr1', v)} /></Field>
            <Field label={t.adresse2}><Input value={f.exp_adr2} onChange={v => set('exp_adr2', v)} /></Field>
            <Field label={t.adresse3}><Input value={f.exp_adr3} onChange={v => set('exp_adr3', v)} /></Field>
            <Field label={t.code_postal}><Input value={f.exp_cp} onChange={v => set('exp_cp', v)} /></Field>
            <Field label={t.ville}><Input value={f.exp_ville} onChange={v => set('exp_ville', v)} /></Field>
            <Field label={t.pays}><Input value={f.exp_pays} onChange={v => set('exp_pays', v)} /></Field>
            <Field label={t.contact}><Input value={f.exp_contact} onChange={v => set('exp_contact', v)} /></Field>
            <Field label={t.telephone}><Input value={f.exp_tel} onChange={v => set('exp_tel', v)} /></Field>
            <Field label={t.email}><Input type="email" value={f.exp_email} onChange={v => set('exp_email', v)} /></Field>
          </Grid>
          <Field label={t.observations}>
            <Textarea value={f.obs_expedition} onChange={v => set('obs_expedition', v)} placeholder={t.info_complementaires} />
          </Field>
        </div>
        </div>

      </div>

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
