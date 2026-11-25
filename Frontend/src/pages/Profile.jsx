import { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Avatar } from '../components/Header'
import { getDashboardSummary } from '../services/api'
import { dashboardStats } from '../data/mockData'
const fields = [['name','Full name',100],['businessName','Business name',120],['industry','Business category',100],['location','Business location',120],['phone','Phone number',40],['bio','Business description',500]]
export default function Profile () {
  const { user, saveProfile, demoMode } = useAuth()
  const [form,setForm] = useState(null), [busy,setBusy] = useState(false), [message,setMessage] = useState(''), [error,setError] = useState('')
  const dialog = useRef(null)
  const editButton = useRef(null)
  const closeButton = useRef(null)
  const closeTimer = useRef(null)
  const imageVersion = useRef(0)
  const [closing,setClosing] = useState(false)
  const isEditing = form !== null
  useEffect(() => () => { clearTimeout(closeTimer.current); imageVersion.current++ }, [])
  useEffect(() => {
    if (isEditing && !dialog.current.open) {
      dialog.current.showModal()
      closeButton.current?.focus()
    }
  }, [isEditing])
  const [summary,setSummary] = useState(null)
  useEffect(()=>{ if(demoMode)return; let active=true; getDashboardSummary().then(data=>{if(active)setSummary(data)}).catch(()=>{}); return ()=>{active=false} },[demoMode])
  const overview = demoMode ? dashboardStats : summary
  const start = () => { setForm(Object.fromEntries(fields.map(([k])=>[k,user?.[k]||'']))); setError(''); setClosing(false) }
  const finishClose = () => {
    imageVersion.current++
    clearTimeout(closeTimer.current)
    const finish = () => {
      dialog.current?.close()
      setForm(null)
      setClosing(false)
      editButton.current?.focus()
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.motion === 'reduced') { finish(); return }
    setClosing(true)
    closeTimer.current = setTimeout(finish, 180)
  }
  const close = () => {
    if (busy || closing) return
    if (form && Object.entries(form).some(([k,v])=>v !== (user?.[k]||'')) && !window.confirm('Discard unsaved changes?')) return
    finishClose()
  }
  const image = async e => {
    const file=e.target.files?.[0]; if (!file) return
    const version = ++imageVersion.current
    if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size>8*1024*1024) { setError('Choose a JPG, PNG or WebP image under 8 MB.'); return }
    try { const bitmap=await createImageBitmap(file); const canvas=document.createElement('canvas'); canvas.width=320;canvas.height=320;const side=Math.min(bitmap.width,bitmap.height);canvas.getContext('2d').drawImage(bitmap,(bitmap.width-side)/2,(bitmap.height-side)/2,side,side,0,0,320,320);bitmap.close();if(version!==imageVersion.current)return;setForm(v=>v ? {...v,avatar:canvas.toDataURL('image/jpeg',0.84)} : v);setError('') } catch { if(version===imageVersion.current)setError('Unable to read this image.') }
  }
  const submit = async e => { e.preventDefault(); if (busy || closing) return; setBusy(true);setError('');try { await saveProfile(form);finishClose();setMessage(demoMode?'Demo profile updated for this visit.':'Profile updated successfully.') } catch(err){setError(err.message)} finally{setBusy(false)} }
  return <div className='page premium-profile'><div className='page-heading'><div><h2>Your profile</h2><p>Your identity and business information.</p></div></div>
    <section className='card profile-hero'><Avatar user={user} size='large'/><div className='profile-identity'><h2>{user?.name}</h2><p>{user?.businessName || 'Your business'}</p>{user?.bio && <p>{user.bio}</p>}<small>{user?.createdAt ? `Member since ${new Date(user.createdAt).toLocaleDateString(undefined,{month:'long',year:'numeric'})}` : demoMode ? 'Demo workspace' : 'Patron Index member'}</small></div><button ref={editButton} type='button' className='primary-button' onClick={start}>Edit Profile</button></section>
    {overview && <section className='card premium-details profile-overview'><h3>Business at a glance</h3><div><span>Total customers<strong>{Number(overview.totalCustomers||0).toLocaleString('en-IN')}</strong></span><span>Revenue tracked<strong>₹{Number(overview.totalRevenue||0).toLocaleString('en-IN')}</strong></span></div></section>}
    {message && <p role='status' className='premium-status'>{message}</p>}
    <section className='card premium-details'><h3>Personal information</h3><dl><dt>Full name</dt><dd>{user?.name}</dd><dt>Email address</dt><dd>{user?.email}</dd><dt>Phone number</dt><dd>{user?.phone || 'Not provided'}</dd></dl></section>
    <section className='card premium-details'><h3>Business information</h3><dl>{fields.slice(1).filter(([k])=>k!=='phone').map(([k,label])=><div className='detail-row' key={k}><dt>{label}</dt><dd>{user?.[k] || 'Not provided'}</dd></div>)}</dl></section>
    <dialog ref={dialog} className={`premium-dialog ${closing ? 'is-closing' : ''}`} aria-labelledby='edit-profile-title' onCancel={e=>{e.preventDefault();close()}}>{form && <form onSubmit={submit}><div className='premium-dialog-header'><div><h2 id='edit-profile-title'>Edit profile</h2><p>Update your personal and business information.</p></div><button ref={closeButton} type='button' className='premium-icon-button premium-dialog-close' aria-label='Close edit profile' onClick={close} disabled={busy || closing}><X size={20} aria-hidden='true'/></button></div><div className='edit-avatar'><Avatar user={{...user,...form}} size='medium'/><label className='secondary-button'>Change photo<input type='file' accept='image/png,image/jpeg,image/webp' onChange={image} className='visually-hidden'/></label></div>{fields.map(([k,label,max])=><label className='premium-field' key={k}>{label}{k==='bio'?<textarea maxLength={max} value={form[k]} onChange={e=>setForm(v=>({...v,[k]:e.target.value}))}/>:<input required={k==='name'} maxLength={max} value={form[k]} onChange={e=>setForm(v=>({...v,[k]:e.target.value}))}/>}</label>)}<p className='muted-text'>Email is managed by your sign-in method.</p>{error && <p role='alert'>{error}</p>}<div className='dialog-actions'><button type='button' className='secondary-button' onClick={close} disabled={busy || closing}>Cancel</button><button className='primary-button' disabled={busy || closing}>{busy?'Saving…':'Save changes'}</button></div></form>}</dialog>
  </div>
}
