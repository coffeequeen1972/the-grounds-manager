import { createContext, useContext, useEffect, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';

export type Employee = { id: string; name: string; availability: string; timeOff: string[] };
export type Shift = { id: string; employeeId: string; date: string; start: string; end: string };
export type InventoryItem = { id: string; name: string; category: string; quantity: number; unit: string; minimum: number };
export type Task = { id: string; title: string; category: 'Opening' | 'Closing' | 'Cleaning' | 'Maintenance'; assignee: string; recurring: boolean; completionDate: string };
export type Note = { id: string; title: string; body: string; type: 'Employee' | 'Maintenance' | 'Reminder'; dueDate: string; priority: 'Low' | 'Normal' | 'High' };
export type GroundsData = { employees: Employee[]; shifts: Shift[]; inventory: InventoryItem[]; tasks: Task[]; notes: Note[]; priorities: string[] };
const KEY = 'the-grounds-manager-v1';
const iso = (date: Date) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
export const today = () => iso(new Date());
export const addDays = (date: Date, amount: number) => { const d = new Date(date); d.setDate(d.getDate()+amount); return d; };
export const dateLabel = (value: string, options: Intl.DateTimeFormatOptions = { weekday:'short', month:'short', day:'numeric' }) => new Date(`${value}T12:00:00`).toLocaleDateString(undefined, options);
const id = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
export function freshDemo(): GroundsData {
  const now = new Date(); const day = today(); const tomorrow = iso(addDays(now,1)); const plus2 = iso(addDays(now,2)); const plus3 = iso(addDays(now,3));
  const monday = addDays(now, -((now.getDay()+6)%7));
  const emp = [{id:'e-maya',name:'Maya Chen',availability:'Mon, Tue, Thu, Fri · mornings',timeOff:[]},{id:'e-jordan',name:'Jordan Reyes',availability:'Tue–Sat · flexible',timeOff:[]},{id:'e-ellie',name:'Ellie Parker',availability:'Mon–Fri · after 2pm',timeOff:[plus3]},{id:'e-noah',name:'Noah Brooks',availability:'Wed–Sun · open availability',timeOff:[]}];
  let shiftCount = 0;
  const shift = (n:number,e:string,s:string,end:string):Shift=>({id:`s-seed-${++shiftCount}`,employeeId:e,date:iso(addDays(monday,n)),start:s,end});
  return {
    employees:emp,
    shifts:[shift((now.getDay()+6)%7,'e-maya','06:30','12:30'),shift((now.getDay()+6)%7,'e-jordan','11:30','16:00'),shift((now.getDay()+6)%7,'e-noah','15:00','20:00'),shift(now.getDay()%7,'e-ellie','07:00','13:00'),shift(now.getDay()%7,'e-jordan','12:00','17:00'),shift((now.getDay()+1)%7,'e-noah','07:00','14:00'),shift((now.getDay()+2)%7,'e-maya','06:30','12:30'),shift((now.getDay()+3)%7,'e-ellie','14:00','19:00'),shift((now.getDay()+4)%7,'e-jordan','08:00','14:00'),shift((now.getDay()+5)%7,'e-noah','07:00','15:00'),...(now.getDay()===0?[{id:'s-next-week',employeeId:'e-maya',date:tomorrow,start:'07:00',end:'13:00'}]:[])],
    inventory:[{id:'i-1',name:'House espresso beans',category:'Coffee',quantity:3,unit:'bags',minimum:5},{id:'i-2',name:'Oat milk',category:'Dairy & alt',quantity:8,unit:'cartons',minimum:6},{id:'i-3',name:'Whole milk',category:'Dairy & alt',quantity:4,unit:'gallons',minimum:5},{id:'i-4',name:'12 oz hot cups',category:'Packaging',quantity:240,unit:'cups',minimum:150},{id:'i-5',name:'Vanilla syrup',category:'Syrups',quantity:2,unit:'bottles',minimum:3},{id:'i-6',name:'Cold brew concentrate',category:'Coffee',quantity:6,unit:'jugs',minimum:3}],
    tasks:[{id:'t-1',title:'Dial in espresso and record shot time',category:'Opening',assignee:'Maya Chen',recurring:true,completionDate:''},{id:'t-2',title:'Set pastry case & update labels',category:'Opening',assignee:'Jordan Reyes',recurring:true,completionDate:''},{id:'t-3',title:'Wipe tables and reset patio',category:'Cleaning',assignee:'Ellie Parker',recurring:true,completionDate:''},{id:'t-4',title:'Backflush espresso machine',category:'Cleaning',assignee:'Noah Brooks',recurring:true,completionDate:''},{id:'t-5',title:'Check grinder burr delivery',category:'Maintenance',assignee:'Maya Chen',recurring:false,completionDate:''},{id:'t-6',title:'Count tills and lock up',category:'Closing',assignee:'Jordan Reyes',recurring:true,completionDate:''}],
    notes:[{id:'n-1',title:'Order espresso before Thursday',body:'Ask Lark Roasters for two bags of the seasonal blend.',type:'Reminder',dueDate:plus2,priority:'High'},{id:'n-2',title:'Walk-in door seal',body:'Bottom corner is catching; maintenance visit requested.',type:'Maintenance',dueDate:day,priority:'High'},{id:'n-3',title:'Ellie exam week',body:'Confirmed reduced hours through Friday. Check coverage for Thursday.',type:'Employee',dueDate:plus3,priority:'Normal'},{id:'n-4',title:'Spring menu tasting',body:'Set aside an hour to test the orange-cardamom cold foam.',type:'Reminder',dueDate:tomorrow,priority:'Low'}],
    priorities:['Prep the seasonal espresso launch','Confirm Thursday coverage','Get through the milk delivery']
  };
}
const isData = (v: unknown): v is GroundsData => {
  if(!v||typeof v!=='object') return false;
  const x=v as Record<string,unknown>;
  if(!['employees','shifts','inventory','tasks','notes','priorities'].every(k=>Array.isArray(x[k]))) return false;
  const has=(row:unknown,keys:string[])=>!!row&&typeof row==='object'&&keys.every(k=>typeof (row as Record<string,unknown>)[k]==='string');
  return (x.employees as unknown[]).every(r=>has(r,['id','name','availability'])&&Array.isArray((r as Employee).timeOff)&&(r as Employee).timeOff.every(x=>typeof x==='string'))
    &&(x.shifts as unknown[]).every(r=>has(r,['id','employeeId','date','start','end']))
    &&(x.inventory as unknown[]).every(r=>has(r,['id','name','category','unit'])&&typeof (r as InventoryItem).quantity==='number'&&typeof (r as InventoryItem).minimum==='number')
    &&(x.tasks as unknown[]).every(r=>has(r,['id','title','category','assignee','completionDate'])&&typeof (r as Task).recurring==='boolean')
    &&(x.notes as unknown[]).every(r=>has(r,['id','title','body','type','dueDate','priority']))
    &&(x.priorities as unknown[]).every(r=>typeof r==='string');
};
const repairShiftIds = (data: GroundsData): GroundsData => {
  const seen = new Set<string>();
  return {
    ...data,
    shifts: data.shifts.map(shift => {
      if (!seen.has(shift.id)) {
        seen.add(shift.id);
        return shift;
      }
      const repaired = { ...shift, id: id() };
      seen.add(repaired.id);
      return repaired;
    }),
  };
};
type Store = { data: GroundsData; setData: Dispatch<SetStateAction<GroundsData>> };
const Context = createContext<Store | null>(null);
export function StoreProvider({children}:{children:ReactNode}) {
  const [data,setData] = useState<GroundsData>(()=>{try{const raw=localStorage.getItem(KEY); if(raw){const parsed=JSON.parse(raw);if(isData(parsed)) return repairShiftIds(parsed);}}catch{try{localStorage.removeItem(KEY);}catch{}} return freshDemo();});
  useEffect(()=>{try{localStorage.setItem(KEY,JSON.stringify(data));}catch{/* Keep the working in-memory state if storage is unavailable. */}},[data]);
  const value=useMemo(()=>({data,setData}),[data]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useGrounds(){const value=useContext(Context);if(!value)throw new Error('StoreProvider is missing');return value;}
export const makeId = id;
