import React, { useState, useEffect, useRef } from 'react'
import { supabase } from './supabase'
import { useLang, LangSwitcher } from './LangContext'

const ATELIERS = ['Laboratoire','Coating 1','Coating 2','Coating 3','Application manuelle','Chipping','Massicots','Offset','Assemblage','Découpe','Perforation','Pose Rivet','Emballage']
const PALETTE = ['#4A90D9','#27AE60','#E74C3C','#F39C12','#8E44AD','#16A085','#D35400','#2C3E50','#C0392B','#1ABC9C']
const ROW_H = 52, DAY_W = 36, NAME_W = 160, LANE_H = 26

function dk(d) { return d.toISOString().slice(0,10) }
function addDays(d,n) { const r=new Date(d); r.setDate(r.getDate()+n); return r }
function parseDate(s) { if(!s)return null; const[y,m,d]=s.split('-').map(Number); return new Date(y,m-1,d) }
function daysBetween(a,b) { return Math.round((b-a)/86400000) }

function easterOrthodox(year) {
  const a=year%4,b=year%7,c=year%19,d=(19*c+15)%30,e=(2*a+4*b-d+34)%7,f=d+e
  let month=f<28?4:3+(f-28>0?1:0), day=f<28?f+1:f-27
  if(month===4&&day>30)day-=30
  const g=new Date(year,month-1,day); g.setDate(g.getDate()+13); return g
}
function easterCatholic(year) {
  const a=year%19,b=Math.floor(year/100),c=year%100,d=Math.floor(b/4),e=b%4
  const f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30
  const i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451)
  return new Date(year,Math.floor((h+l-7*m+114)/31)-1,((h+l-7*m+114)%31)+1)
}
function getHolidays(year) {
  const h=new Set()
  const fixed=[[1,1],[2,1],[24,1],[1,5],[1,6],[15,8],[30,11],[1,12],[25,12],[26,12],[6,1],[3,5],[1,11],[8,12]]
  fixed.forEach(function(x){ h.add(year+'-'+String(x[1]).padStart(2,'0')+'-'+String(x[0]).padStart(2,'0')) })
  const eo=easterOrthodox(year); [0,1,39,49,50].forEach(n=>h.add(dk(addDays(eo,n))))
  const ec=easterCatholic(year); [0,1,39,49].forEach(n=>h.add(dk(addDays(ec,n))))
  return h
}
function isOff(d,holidays) { const w=d.getDay(); return w===0||w===6||holidays.has(dk(d)) }

// ── Modal ─────────────────────────────────────────────────────────────────────
function JobModal({ job, fiches, onSave, onClose, onDelete }) {
  const { t } = useLang()
  const [form, setForm] = useState({
    fiche_id:'', client:'', produit:'', type_produit:'',
    atelier:ATELIERS[0], date_creation:dk(new Date()), date_livraison:dk(new Date()),
    couleur:PALETTE[0], note:'',
    ...job
  })
  const set = (k,v) => setForm(f=>({...f,[k]:v}))

  const handleFiche = (ficheId) => {
    set('fiche_id', ficheId)
    if (ficheId) {
      const f = fiches.find(f=>f.id===ficheId)
      if (f) {
        set('client',f.client||'')
        set('produit',f.designation||'')
        set('type_produit',f.type_produit||'')
        if (f.date_creation) set('date_creation', f.date_creation)
        if (f.date_livraison) set('date_livraison', f.date_livraison)
      }
    }
  }

  const selectedFiche = fiches.find(f=>f.id===form.fiche_id)

  return (
    <div style={ms.overlay} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={ms.modal}>
        <div style={ms.header}>
          <span style={ms.title}>{job?.id ? t.modifier_job : t.planifier_job}</span>
          <button onClick={onClose} style={ms.closeBtn}>✕</button>
        </div>
        <div style={ms.body}>
          {/* Fiche */}
          <div style={ms.field}>
            <label style={ms.label}>{t.fiche_production}</label>
            <select value={form.fiche_id||''} onChange={e=>handleFiche(e.target.value)} style={ms.input}>
              <option value="">{t.sans_fiche}</option>
              {fiches.map(f=>(
                <option key={f.id} value={f.id}>{f.num_dossier||'—'} — {f.client||'—'} — {f.designation||'—'}</option>
              ))}
            </select>
          </div>
          {/* Infos fiche */}
          {selectedFiche && (
            <div style={{background:'#f8f8f8',border:'1px solid #eee',borderRadius:6,padding:'10px 12px',fontSize:12,color:'#444',lineHeight:1.9}}>
              <div style={{display:'grid',gridTemplateColumns:'110px 1fr',gap:'2px 8px'}}>
                <span style={{color:'#999'}}>N° Dossier</span><strong>{selectedFiche.num_dossier||'—'}</strong>
                <span style={{color:'#999'}}>Client</span><strong>{selectedFiche.client||'—'}</strong>
                <span style={{color:'#999'}}>Désignation</span><span>{selectedFiche.designation||'—'}</span>
                <span style={{color:'#999'}}>Type</span><span>{selectedFiche.type_produit||'—'}</span>
              </div>
            </div>
          )}
          <hr style={{border:'none',borderTop:'1px solid #eee'}} />
          {/* Atelier */}
          <div style={ms.field}>
            <label style={ms.label}>{t.atelier}</label>
            <select value={form.atelier} onChange={e=>set('atelier',e.target.value)} style={ms.input}>
              {ATELIERS.map(a=><option key={a}>{a}</option>)}
            </select>
          </div>
          {/* Dates */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            <div style={ms.field}>
              <label style={ms.label}>{t.date_creation}</label>
              <input type="date" value={form.date_creation||''} onChange={e=>set('date_creation',e.target.value)} style={ms.input} />
            </div>
            <div style={ms.field}>
              <label style={ms.label}>{t.date_livraison}</label>
              <input type="date" value={form.date_livraison||''} onChange={e=>set('date_livraison',e.target.value)} style={ms.input} />
            </div>
          </div>
          {/* Couleur */}
          <div style={ms.field}>
            <label style={ms.label}>Couleur</label>
            <div style={{display:'flex',gap:8,flexWrap:'wrap',paddingTop:4}}>
              {PALETTE.map(c=>(
                <div key={c} onClick={()=>set('couleur',c)}
                  style={{width:24,height:24,borderRadius:4,background:c,cursor:'pointer',
                    border:form.couleur===c?'3px solid #333':'2px solid transparent'}} />
              ))}
            </div>
          </div>
          {/* Note */}
          <div style={ms.field}>
            <label style={ms.label}>{t.note}</label>
            <textarea value={form.note} onChange={e=>set('note',e.target.value)}
              style={{...ms.input,minHeight:56,resize:'vertical'}} />
          </div>
        </div>
        <div style={ms.footer}>
          {job?.id && <button onClick={()=>onDelete(job.id)} style={ms.deleteBtn}>{t.delete}</button>}
          <div style={{flex:1}} />
          <button onClick={onClose} style={ms.cancelBtn}>{t.cancel}</button>
          <button onClick={()=>onSave(form)} style={ms.saveBtn}>{t.save}</button>
        </div>
      </div>
    </div>
  )
}

const ms = {
  overlay:{position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000},
  modal:{background:'white',borderRadius:8,width:460,maxHeight:'90vh',display:'flex',flexDirection:'column',boxShadow:'0 8px 32px rgba(0,0,0,0.2)'},
  header:{padding:'16px 20px',borderBottom:'1px solid #eee',display:'flex',alignItems:'center',justifyContent:'space-between'},
  title:{fontWeight:'bold',fontSize:15,fontFamily:'Arial'},
  closeBtn:{background:'none',border:'none',fontSize:16,cursor:'pointer',color:'#999'},
  body:{padding:'16px 20px',overflowY:'auto',display:'flex',flexDirection:'column',gap:12},
  footer:{padding:'12px 20px',borderTop:'1px solid #eee',display:'flex',gap:10,alignItems:'center'},
  field:{display:'flex',flexDirection:'column',gap:4},
  label:{fontSize:11,fontWeight:'bold',color:'#555'},
  input:{border:'1px solid #ddd',borderRadius:4,padding:'6px 8px',fontSize:13,outline:'none',fontFamily:'Arial'},
  saveBtn:{background:'#7A5F8A',color:'white',border:'none',borderRadius:5,padding:'8px 20px',fontSize:13,fontWeight:'bold',cursor:'pointer'},
  cancelBtn:{background:'#eee',color:'#444',border:'none',borderRadius:5,padding:'8px 16px',fontSize:13,cursor:'pointer'},
  deleteBtn:{background:'#c0392b',color:'white',border:'none',borderRadius:5,padding:'8px 16px',fontSize:13,cursor:'pointer'},
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Planning({ onBack }) {
  const { t } = useLang()
  const [jobs, setJobs] = useState([])
  const [fiches, setFiches] = useState([])
  const [modal, setModal] = useState(null)
  const [anchorDate, setAnchorDate] = useState(() => { const d=new Date(); d.setDate(d.getDate()-7); return d })
  const numDays = 60
  const gridRef = useRef()
  const nameRef = useRef()
  const holidays = useRef(new Set())

  useEffect(() => {
    const y = new Date().getFullYear()
    holidays.current = new Set([...getHolidays(y-1),...getHolidays(y),...getHolidays(y+1)])
  }, [])

  useEffect(() => { loadJobs(); loadFiches() }, [])

  async function loadJobs() {
    const { data } = await supabase.from('jobs').select('*').order('date_creation')
    setJobs(data||[])
  }
  async function loadFiches() {
    const { data } = await supabase.from('fiches').select('id,num_dossier,client,designation,type_produit').order('created_at',{ascending:false})
    setFiches(data||[])
  }

  async function saveJob(form) {
    const clean = obj => { const r={}; for(const[k,v] of Object.entries(obj)) r[k]=v===''?null:v; return r }
    const payload = clean({...form})
    delete payload.id; delete payload.created_at
    if (form.id) await supabase.from('jobs').update(payload).eq('id',form.id)
    else await supabase.from('jobs').insert([payload])
    setModal(null); loadJobs()
  }

  async function deleteJob(id) {
    await supabase.from('jobs').delete().eq('id',id)
    setModal(null); loadJobs()
  }

  const days = []
  for (let i=0; i<numDays; i++) days.push(addDays(anchorDate,i))

  function getJobsForAtelier(atelier) {
    return jobs.filter(j=>j.atelier===atelier&&j.date_creation&&j.date_livraison)
  }

  function computeLanes(atJobs) {
    const lanes=[]
    atJobs.forEach(job=>{
      const s=parseDate(job.date_creation), e=parseDate(job.date_livraison)
      let placed=false
      for(const lane of lanes){
        if(!lane.some(j=>{ const js=parseDate(j.date_debut),je=parseDate(j.date_fin); return s<=je&&e>=js })){
          lane.push(job); placed=true; break
        }
      }
      if(!placed) lanes.push([job])
    })
    return lanes
  }

  async function handleDrop(e, atelier, dayStr) {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain')
    if (!id) return
    const job = jobs.find(j=>j.id===id||j.id===parseInt(id))
    if (!job) return
    const dur = daysBetween(parseDate(job.date_creation), parseDate(job.date_livraison))
    await supabase.from('jobs').update({atelier, date_creation:dayStr, date_livraison:dk(addDays(parseDate(dayStr),dur))}).eq('id',job.id)
    loadJobs()
  }

  function renderJobBar(job, laneIndex) {
    const s=parseDate(job.date_creation), e=parseDate(job.date_livraison)
    const segs=[], hols=holidays.current
    let segStart=null
    days.forEach((d,i)=>{
      const inJob=d>=s&&d<=e, off=isOff(d,hols)
      if(inJob&&!off&&segStart===null) segStart=i
      if(segStart!==null&&(!inJob||off)){ segs.push({from:segStart,to:i-1}); segStart=null }
    })
    if(segStart!==null) segs.push({from:segStart,to:days.length-1})

    return segs.map((seg,si)=>{
      const isFirst=si===0, isLast=si===segs.length-1
      return (
        <div key={`${job.id}-${si}`}
          draggable
          onDragStart={ev=>{ev.dataTransfer.setData('text/plain',String(job.id));ev.stopPropagation()}}
          onClick={ev=>{ev.stopPropagation();setModal({job})}}
          style={{
            position:'absolute',
            left:seg.from*DAY_W, top:laneIndex*LANE_H+4,
            width:(seg.to-seg.from+1)*DAY_W-2, height:LANE_H-6,
            background:job.couleur||'#4A90D9',
            borderRadius:`${isFirst?4:0}px ${isLast?4:0}px ${isLast?4:0}px ${isFirst?4:0}px`,
            cursor:'pointer', overflow:'hidden',
            display:'flex', alignItems:'center',
            paddingLeft:isFirst?6:2,
            fontSize:11, color:'white', fontWeight:'bold', fontFamily:'Arial',
            whiteSpace:'nowrap', boxShadow:'0 1px 3px rgba(0,0,0,0.2)',
            zIndex:2, userSelect:'none',
          }}
          title={`${job.client||''} — ${job.produit||''}\n${job.date_creation} → ${job.date_livraison}`}
        >
          {isFirst && `${job.client||''}${job.produit?' — '+job.produit:''}`}
        </div>
      )
    })
  }

  const monthGroups=[]
  let cur=null
  days.forEach((d,i)=>{
    const m=`${d.getFullYear()}-${d.getMonth()}`
    if(m!==cur){ if(monthGroups.length) monthGroups[monthGroups.length-1].end=i-1; monthGroups.push({label:d.toLocaleDateString('fr-FR',{month:'long',year:'numeric'}),start:i,end:days.length-1}); cur=m }
  })

  const today=dk(new Date())
  const navBtn={background:'transparent',color:'white',border:'1px solid #555',borderRadius:4,padding:'4px 10px',fontSize:13,cursor:'pointer'}

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100vh',fontFamily:'Arial,sans-serif',background:'#f5f6f8'}}>
      {/* Topbar */}
      <div style={{background:'#1a1a2e',color:'white',height:50,display:'flex',alignItems:'center',padding:'0 20px',gap:8,flexShrink:0}}>
        <button onClick={onBack} style={{...navBtn,marginRight:8}}>← Retour</button>
        <span style={{fontWeight:'bold',fontSize:14,letterSpacing:1}}>{t.planning_title}</span>
        <div style={{flex:1}} />
        <button onClick={()=>setAnchorDate(d=>addDays(d,-14))} style={navBtn}>‹‹</button>
        <button onClick={()=>setAnchorDate(d=>addDays(d,-7))} style={navBtn}>‹</button>
        <button onClick={()=>{const d=new Date();d.setDate(d.getDate()-7);setAnchorDate(d)}} style={{...navBtn,background:'#7A5F8A',border:'none'}}>{t.today}</button>
        <button onClick={()=>setAnchorDate(d=>addDays(d,7))} style={navBtn}>›</button>
        <button onClick={()=>setAnchorDate(d=>addDays(d,14))} style={navBtn}>››</button>
        <LangSwitcher />
        <button onClick={()=>setModal({job:null})} style={{background:'#7A5F8A',color:'white',border:'none',borderRadius:5,padding:'6px 16px',fontSize:13,fontWeight:'bold',cursor:'pointer',marginLeft:8}}>{t.new_job}</button>
      </div>

      {/* Grid */}
      <div style={{display:'flex',flex:1,overflow:'hidden'}}>
        {/* Names */}
        <div style={{width:NAME_W,flexShrink:0,display:'flex',flexDirection:'column',borderRight:'2px solid #dde'}}>
          <div style={{height:56,background:'white',borderBottom:'1px solid #dde',flexShrink:0}} />
          <div ref={nameRef} style={{overflowY:'hidden',flex:1}}>
            {ATELIERS.map(atelier=>{
              const ln=computeLanes(getJobsForAtelier(atelier))
              const h=Math.max(ROW_H, ln.length*LANE_H+8)
              return <div key={atelier} style={{height:h,display:'flex',alignItems:'center',padding:'0 12px',background:'white',borderBottom:'1px solid #eef',fontSize:13,fontWeight:'500',color:'#333'}}>{atelier}</div>
            })}
          </div>
        </div>

        {/* Scrollable */}
        <div ref={gridRef} style={{flex:1,overflowX:'auto',overflowY:'auto'}}
          onScroll={e=>{ if(nameRef.current) nameRef.current.style.marginTop=-e.target.scrollTop+'px' }}>
          <div style={{width:days.length*DAY_W}}>
            {/* Months */}
            <div style={{display:'flex',height:26,background:'white',borderBottom:'1px solid #dde',position:'sticky',top:0,zIndex:10}}>
              {monthGroups.map((g,i)=>(
                <div key={i} style={{width:(g.end-g.start+1)*DAY_W,flexShrink:0,borderRight:'2px solid #dde',display:'flex',alignItems:'center',paddingLeft:8,fontSize:11,fontWeight:'bold',color:'#555',textTransform:'capitalize',overflow:'hidden'}}>{g.label}</div>
              ))}
            </div>
            {/* Days */}
            <div style={{display:'flex',height:30,background:'white',borderBottom:'1px solid #dde',position:'sticky',top:26,zIndex:10}}>
              {days.map((d,i)=>{
                const dStr=dk(d),isToday=dStr===today,off=isOff(d,holidays.current)
                return <div key={i} style={{width:DAY_W,flexShrink:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontSize:10,color:off?'#bbb':isToday?'#4A90D9':'#666',fontWeight:isToday?'bold':'normal',background:isToday?'#eef2ff':off?'#f7f8fc':'white',borderRight:'1px solid #eef'}}>
                  <span>{['D','L','M','M','J','V','S'][d.getDay()]}</span>
                  <span>{d.getDate()}</span>
                </div>
              })}
            </div>
            {/* Rows */}
            {ATELIERS.map(atelier=>{
              const ln=computeLanes(getJobsForAtelier(atelier))
              const h=Math.max(ROW_H, ln.length*LANE_H+8)
              return (
                <div key={atelier} style={{height:h,position:'relative',display:'flex',borderBottom:'1px solid #eef'}}>
                  {days.map((d,i)=>{
                    const dStr=dk(d),isToday=dStr===today,off=isOff(d,holidays.current)
                    return <div key={i} style={{width:DAY_W,flexShrink:0,height:'100%',background:isToday?'#eef2ff':off?'#f7f8fc':'white',borderRight:'1px solid #f0f0f0',cursor:'pointer'}}
                      onDragOver={e=>e.preventDefault()}
                      onDrop={e=>handleDrop(e,atelier,dStr)}
                      onDoubleClick={()=>setModal({job:{atelier,date_creation:dStr,date_livraison:dStr}})}
                    />
                  })}
                  <div style={{position:'absolute',inset:0,pointerEvents:'none'}}>
                    <div style={{position:'relative',height:'100%',pointerEvents:'all'}}>
                      {ln.map((lane,li)=>lane.map(job=>renderJobBar(job,li)))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {modal && <JobModal job={modal.job} fiches={fiches} onSave={saveJob} onDelete={deleteJob} onClose={()=>setModal(null)} />}
    </div>
  )
}
