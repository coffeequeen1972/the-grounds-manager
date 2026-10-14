import { useMemo, useState, type FormEvent } from 'react';
import { Link } from 'wouter';
import { ArrowRight, CalendarDays, CircleAlert, Package, Plus, Sparkles, Users } from 'lucide-react';
import { AppShell, PageHeader } from '../components/AppShell';
import { dateLabel, today, useGrounds } from '../lib/store';

export default function Dashboard(){
  const {data,setData}=useGrounds(); const [priority,setPriority]=useState('');
  const todayKey=today(); const todayShifts=data.shifts.filter(s=>s.date===todayKey).sort((a,b)=>a.start.localeCompare(b.start));
  const upcoming=data.shifts.filter(s=>s.date>todayKey).sort((a,b)=>a.date.localeCompare(b.date)||a.start.localeCompare(b.start)).slice(0,4);
  const low=data.inventory.filter(i=>i.quantity<=i.minimum);
  const unfinished=data.tasks.filter(t=>t.completionDate!==todayKey);
  const reminders=useMemo(()=>data.notes.filter(n=>n.type==='Reminder'||n.priority==='High').sort((a,b)=>a.dueDate.localeCompare(b.dueDate)).slice(0,3),[data.notes]);
  const employee=(id:string)=>data.employees.find(e=>e.id===id)?.name||'Unassigned';
  const toggleTask=(id:string)=>setData(d=>({...d,tasks:d.tasks.map(t=>t.id===id?{...t,completionDate:t.completionDate===todayKey?'':todayKey}:t)}));
  const addPriority=(e:FormEvent)=>{e.preventDefault();if(priority.trim()){setData(d=>({...d,priorities:[...d.priorities,priority.trim()]}));setPriority('');}};
  return <AppShell><PageHeader eyebrow="The Grounds · owner's desk" title="Good morning." subtitle="A clear view of what needs your attention today."><div className="date-pill"><CalendarDays size={14}/>{new Date().toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'})}</div></PageHeader>
    <div className="stat-row">
      <div className="stat"><div className="stat-number">{todayShifts.length}</div><div className="stat-label">on today's schedule</div></div>
      <div className="stat"><div className="stat-number">{low.length}</div><div className="stat-label">items to reorder</div></div>
      <div className="stat"><div className="stat-number">{unfinished.length}</div><div className="stat-label">tasks still to do</div></div>
    </div>
    <div className="grid dashboard-grid">
      <div className="grid">
        <section className="panel">
          <div className="panel-heading"><div><h2 className="panel-title">On the floor today</h2><div className="panel-caption">Your crew, in order of arrival</div></div><Link href="/schedule" className="button secondary small">Full schedule <ArrowRight size={13}/></Link></div>
          {todayShifts.length?todayShifts.map(s=><div className="list-row" key={s.id}><div className="row-main"><div className="avatar">{employee(s.employeeId).split(' ').map(n=>n[0]).join('')}</div><div><div className="row-title">{employee(s.employeeId)}</div><div className="row-meta">{s.start} – {s.end}</div></div></div><span className="tag">{s.start<'12:00'?'Opening':'Later shift'}</span></div>):<div className="empty-state">No shifts on the schedule today.</div>}
          {!!upcoming.length&&<div style={{marginTop:17,paddingTop:14,borderTop:'1px solid #eee7db'}}><div className="eyebrow" style={{marginBottom:4}}>Coming up</div>{upcoming.map(s=><div className="list-row" key={s.id}><div className="row-main"><CalendarDays size={15} color="#8c795e"/><div><div className="row-title">{employee(s.employeeId)}</div><div className="row-meta">{dateLabel(s.date)} · {s.start}–{s.end}</div></div></div><span className="tag gold">Upcoming</span></div>)}</div>}
        </section>
        <section className="panel"><div className="panel-heading"><div><h2 className="panel-title">Today's task list</h2><div className="panel-caption">Small things add up to a good shift</div></div><Link href="/tasks" className="button ghost small">All tasks <ArrowRight size={13}/></Link></div>
          {unfinished.length?unfinished.slice(0,5).map(t=><label className="task-line" key={t.id}><input className="task-check" type="checkbox" checked={false} onChange={()=>toggleTask(t.id)} data-testid={`check-dashboard-task-${t.id}`}/><span style={{flex:1}}>{t.title}</span><span className="row-meta">{t.category}</span></label>):<div className="empty-state">Everything is checked off. Lovely work.</div>}
        </section>
      </div>
      <div className="grid">
        <section className="panel"><div className="panel-heading"><div><h2 className="panel-title">Daily priorities</h2><div className="panel-caption">Keep the important things close</div></div><Sparkles size={17} color="#b48c4c"/></div>
          {data.priorities.map((p,i)=><div className="priority-card" key={`${p}-${i}`}><div style={{display:'flex',justifyContent:'space-between',gap:8}}><span>{p}</span><button className="button ghost" aria-label="Remove priority" onClick={()=>setData(d=>({...d,priorities:d.priorities.filter((_,j)=>j!==i)}))}>×</button></div></div>)}
          <form className="inline-form" onSubmit={addPriority}><input className="input" aria-label="Add daily priority" placeholder="Add a priority..." value={priority} onChange={e=>setPriority(e.target.value)}/><button className="button icon" aria-label="Add priority"><Plus size={16}/></button></form>
        </section>
        <section className="panel"><div className="panel-heading"><div><h2 className="panel-title">Restock watch</h2><div className="panel-caption">At or below your minimum</div></div><Package size={17} color="#71836a"/></div>
          {low.length?low.map(i=><div className="list-row" key={i.id}><div><div className="row-title">{i.name}</div><div className="row-meta">{i.quantity} {i.unit} left · minimum {i.minimum}</div></div><span className="tag alert">Low</span></div>):<div className="empty-state">Stock is looking good.</div>}
          <Link href="/inventory" className="button secondary small" style={{marginTop:14}}>Open inventory <ArrowRight size={13}/></Link>
        </section>
        <section className="panel"><div className="panel-heading"><div><h2 className="panel-title">Don't forget</h2><div className="panel-caption">Reminders and things to keep an eye on</div></div><CircleAlert size={17} color="#b48c4c"/></div>
          {reminders.map(n=><div className="list-row" key={n.id}><div><div className="row-title">{n.title}</div><div className="row-meta">{dateLabel(n.dueDate,{month:'short',day:'numeric'})} · {n.type}</div></div><span className={`tag ${n.priority==='High'?'alert':'gold'}`}>{n.priority}</span></div>)}
          <Link href="/notes" className="button ghost small" style={{marginTop:10}}>See all notes <ArrowRight size={13}/></Link>
        </section>
        <div className="privacy-note"><Users size={14} style={{verticalAlign:'middle',marginRight:6}}/>Your data is saved only in this browser. It does not sync between devices.</div>
      </div>
    </div>
  </AppShell>;
}
