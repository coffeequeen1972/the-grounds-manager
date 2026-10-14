import { Link, useLocation } from 'wouter';
import { CalendarDays, CheckSquare, Coffee, ClipboardList, LayoutDashboard, NotebookPen, Package } from 'lucide-react';
import type { ReactNode } from 'react';

const nav=[{href:'/',label:'Overview',Icon:LayoutDashboard},{href:'/schedule',label:'Schedule',Icon:CalendarDays},{href:'/inventory',label:'Inventory',Icon:Package},{href:'/tasks',label:'Daily tasks',Icon:CheckSquare},{href:'/notes',label:'Notes & reminders',Icon:NotebookPen}];
export function AppShell({children}:{children:ReactNode}){
  const [location]=useLocation();
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Coffee size={20}/></div><div><div className="brand-name">The Grounds</div><div className="brand-sub">Manager's desk</div></div></div>
      <div className="nav-label">Your workspace</div>
      {nav.map(({href,label,Icon})=><Link key={href} href={href} className={`nav-link ${location===href?'active':''}`} data-testid={`link-nav-${label.toLowerCase().replaceAll(' ','-')}`}><Icon size={17}/>{label}</Link>)}
      <div className="sidebar-note"><strong>A little local, a lot reliable.</strong>Your information lives in this browser only. It won't sync to another device.</div>
    </aside>
    <main className="main-area">{children}</main>
    <nav className="mobile-nav">{nav.map(({href,label,Icon})=><Link key={href} href={href} className={location===href?'active':''} data-testid={`mobile-nav-${label.toLowerCase().replaceAll(' ','-')}`}><Icon size={18}/><span>{label==='Notes & reminders'?'Notes':label==='Daily tasks'?'Tasks':label}</span></Link>)}</nav>
  </div>;
}

export function PageHeader({eyebrow,title,subtitle,children}:{eyebrow:string;title:string;subtitle?:string;children?:ReactNode}){
  return <div className="topbar"><div><div className="eyebrow">{eyebrow}</div><h1 className="page-title">{title}</h1>{subtitle&&<p className="page-subtitle">{subtitle}</p>}</div>{children}</div>;
}
export function Modal({title,onClose,children}:{title:string;onClose:()=>void;children:ReactNode}){
  return <div className="modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}><section className="modal" role="dialog" aria-modal="true" aria-label={title}><div className="modal-head"><h2 className="modal-title">{title}</h2><button className="button ghost icon" onClick={onClose} aria-label="Close dialog">×</button></div>{children}</section></div>;
}
export function Field({label,children,className}:{label:string;children:ReactNode;className?:string}){
  return <label className={`field ${className||''}`}><span className="field-label">{label}</span>{children}</label>;
}
export function Empty({title,detail}:{title:string;detail:string}){return <div className="empty-state"><div className="empty-icon"><ClipboardList size={19}/></div><strong>{title}</strong><div style={{fontSize:12,marginTop:5}}>{detail}</div></div>;}
