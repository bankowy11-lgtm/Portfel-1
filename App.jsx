import { useState, useEffect, useCallback } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line
} from "recharts";

/* ─── PALETTE ─── */
const BG="#060810",SURF="#0c0e1c",CARD="#111425",CARD2="#161930";
const BD="rgba(255,255,255,0.065)";
const G="#00d4aa",R="#ff4d6d",GO="#e8b84b",BL="#4f8ef7";
const TX="#e2e8f2",TX2="rgba(226,232,242,0.48)";

/* ─── PORTFOLIO DATA ─── */
const INIT_PORTFOLIO = [
  {n:"Apple",          t:"AAPL",   yt:"AAPL",   v:2071.98,  buy:252.97, qty:1.925, p:72.31,    c:3.62,   type:"Akcje USA"},
  {n:"Canoo",          t:"GOEV",   yt:"GOEV",   v:10.37,    buy:3.092,  qty:8,     p:-90.58,   c:-89.73, type:"Akcje USA"},
  {n:"Cardiff Oncol.", t:"CRDF",   yt:"CRDF",   v:604.93,   buy:5.21,   qty:100,   p:-1526.64, c:-71.62, type:"Akcje USA"},
  {n:"Celon Pharma",   t:"CLN",    yt:"CLN.WA", v:165.20,   buy:24.00,  qty:8,     p:-26.80,   c:-13.96, type:"Akcje GPW"},
  {n:"Neuca",          t:"NEU",    yt:"NEU.WA", v:1778.56,  buy:804.00, qty:2.4875,p:-221.39,  c:-11.07, type:"Akcje GPW"},
  {n:"Ovid Works",     t:"OVI",    yt:"OVI.WA", v:1030.00,  buy:0.879,  qty:2000,  p:-727.50,  c:-41.39, type:"Akcje GPW"},
  {n:"Pekao",          t:"PEO",    yt:"PEO.WA", v:12101.78, buy:214.20, qty:50.38, p:1309.90,  c:12.14,  type:"Akcje GPW"},
  {n:"Traws Pharma",   t:"TRAW",   yt:"TRAW",   v:61.57,    buy:12.70,  qty:10,    p:-461.87,  c:-88.24, type:"Akcje USA"},
  {n:"AES",            t:"AES",    yt:"AES",    v:2076.44,  buy:13.18,  qty:39.98, p:-121.89,  c:-5.54,  type:"Akcje USA"},
  {n:"ASML",           t:"ASML",   yt:"ASML",   v:14540.34, buy:1206.52,qty:2.55,  p:1530.13,  c:11.76,  type:"Akcje USA"},
  {n:"Adobe",          t:"ADBE",   yt:"ADBE",   v:6098.56,  buy:346.99, qty:7.18,  p:-2901.18, c:-32.24, type:"Akcje USA"},
  {n:"Alphabet",       t:"GOOGL",  yt:"GOOGL",  v:3206.33,  buy:313.37, qty:2.21,  p:706.52,   c:28.26,  type:"Akcje USA"},
  {n:"Asbis",          t:"ASBIS",  yt:"ASBIS.WA",v:4221.00, buy:49.08,  qty:60,    p:1276.40,  c:43.35,  type:"Akcje GPW"},
  {n:"Creotech",       t:"CRE",    yt:"CRE.WA", v:20910.00, buy:654.50, qty:30,    p:1275.00,  c:6.49,   type:"Akcje GPW"},
  {n:"Creotech Quant.",t:"CREQ",   yt:"CREQ.WA",v:3981.00,  buy:0,      qty:15,    p:3981.00,  c:null,   type:"Akcje GPW"},
  {n:"Cyber_Folks",    t:"CYF",    yt:"CYF.WA", v:2804.73,  buy:221.50, qty:15.8,  p:-695.26,  c:-19.86, type:"Akcje GPW"},
  {n:"Delko",          t:"DEL",    yt:"DEL.WA", v:1967.42,  buy:9.168,  qty:322,   p:-984.54,  c:-33.35, type:"Akcje GPW"},
  {n:"Diagnostyka",    t:"DGN",    yt:"DGN.WA", v:1912.80,  buy:160.40, qty:12,    p:-12.00,   c:-0.62,  type:"Akcje GPW"},
  {n:"Digital Network",t:"DGT",    yt:"DGT.WA", v:5085.00,  buy:200.80, qty:25,    p:65.00,    c:1.29,   type:"Akcje GPW"},
  {n:"Enovix",         t:"ENVX",   yt:"ENVX",   v:4519.39,  buy:13.09,  qty:173.08,p:-4500.66, c:-49.90, type:"Akcje USA"},
  {n:"Faraday Future", t:"FFIE",   yt:"FFIE",   v:147.84,   buy:3.3086, qty:100,   p:-1237.14, c:-89.33, type:"Akcje USA"},
  {n:"Modivo",         t:"MOD",    yt:"MOD.WA", v:784.60,   buy:80.86,  qty:10,    p:-24.00,   c:-2.97,  type:"Akcje GPW"},
  {n:"Onconova",       t:"ONTX",   yt:"ONTX",   v:123.18,   buy:14.38,  qty:20,    p:-1063.55, c:-89.62, type:"Akcje USA"},
  {n:"PZU",            t:"PZU",    yt:"PZU.WA", v:2511.60,  buy:64.76,  qty:39,    p:-14.04,   c:-0.56,  type:"Akcje GPW"},
  {n:"Petrofac",       t:"PFC",    yt:"PFC.L",  v:38.06,    buy:0.0932, qty:200,   p:-58.49,   c:-60.58, type:"Akcje"},
  {n:"Syn2bio",        t:"S2B",    yt:"S2B.WA", v:1975.44,  buy:0,      qty:65.05, p:1975.37,  c:null,   type:"Akcje GPW"},
  {n:"Synektik",       t:"SNT",    yt:"SNT.WA", v:18147.80, buy:276.16, qty:65.05, p:184.49,   c:1.03,   type:"Akcje GPW"},
  {n:"UnitedHealth",   t:"UNH",    yt:"UNH",    v:1644.27,  buy:359.56, qty:1.14,  p:143.15,   c:9.54,   type:"Akcje USA"},
  {n:"XTB",            t:"XTB",    yt:"XTB.WA", v:220.20,   buy:89.28,  qty:2,     p:41.64,    c:23.32,  type:"Akcje GPW"},
];

const INIT_TRANSACTIONS = [
  {id:1, date:"2026-05-14", type:"KUP",   name:"ASML",    qty:0.5,  price:1240.00, total:620.00},
  {id:2, date:"2026-05-10", type:"SPRZEDAJ", name:"Adobe", qty:1,   price:355.00,  total:355.00},
  {id:3, date:"2026-04-28", type:"KUP",   name:"Pekao",   qty:5,    price:215.00,  total:1075.00},
  {id:4, date:"2026-04-15", type:"KUP",   name:"Asbis",   qty:10,   price:50.00,   total:500.00},
  {id:5, date:"2026-03-22", type:"SPRZEDAJ", name:"PZU",  qty:10,   price:66.00,   total:660.00},
  {id:6, date:"2026-03-10", type:"KUP",   name:"Synektik",qty:5,    price:280.00,  total:1400.00},
  {id:7, date:"2026-02-18", type:"KUP",   name:"Alphabet",qty:0.5,  price:310.00,  total:155.00},
  {id:8, date:"2026-01-30", type:"KUP",   name:"ASML",    qty:1,    price:1200.00, total:1200.00},
];

const TOTAL_VALUE  = 114740.39;
const TOTAL_PROFIT = -2106.62;
const COST_BASIS   = TOTAL_VALUE - TOTAL_PROFIT;
const TOTAL_ROI    = ((TOTAL_PROFIT / COST_BASIS) * 100);
const PIE_COLORS   = [G, BL, GO, "#a78bfa","#f472b6","#22d3ee","#34d399","#64748b"];

const sorted7 = [...INIT_PORTFOLIO].sort((a,b)=>b.v-a.v);
const PIE_DATA = [
  ...sorted7.slice(0,7).map(s=>({name:s.n,value:s.v})),
  {name:"Pozostałe", value: sorted7.slice(7).reduce((s,x)=>s+x.v,0)}
];

const BAR_DATA = [...INIT_PORTFOLIO]
  .sort((a,b)=>Math.abs(b.p)-Math.abs(a.p)).slice(0,12)
  .map(s=>({name:s.t.slice(0,7), profit:Math.round(s.p)}));

const HISTORY = (()=>{
  const pts=[]; let v=COST_BASIS*0.84;
  ["Sty","Lut","Mar","Kwi","Maj","Cze","Lip","Sie","Wrz","Paź","Lis","Gru","Sty","Lut","Mar","Kwi","Maj"]
    .forEach((m,i)=>{
      const d=(Math.sin(i*0.7)+Math.cos(i*1.3))*3800;
      v=Math.max(v+d,COST_BASIS*0.68);
      if(i===16)v=TOTAL_VALUE;
      pts.push({m,v:Math.round(v)});
    });
  return pts;
})();

/* ─── HELPERS ─── */
const fmt  = n => new Intl.NumberFormat("pl-PL",{minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
const sign = n => n>=0?"+":"";
const pc   = p => p>=0?G:R;
const pctStr = c => c!==null?`${sign(c)}${c.toFixed(2)}%`:"N/A";
const heatBg = c => {
  if(c===null)return"#1a1d35";
  if(c>=30)return"#003d31";if(c>=10)return"#005240";if(c>=0)return"#003d30";
  if(c>=-15)return"#4d0f1e";if(c>=-50)return"#6d1530";return"#8a1030";
};

/* ─── COMPONENTS ─── */
function Card({title,accent,children,mb=12}){
  return(
    <div style={{background:CARD,border:`1px solid ${BD}`,borderTop:accent?`2px solid ${accent}`:undefined,
      borderRadius:14,padding:"13px 13px 15px",marginBottom:mb}}>
      {title&&<div style={{fontSize:10,fontWeight:600,color:TX2,letterSpacing:".12em",
        textTransform:"uppercase",marginBottom:11}}>{title}</div>}
      {children}
    </div>
  );
}

function Badge({val,bg,color,size=11}){
  return <span style={{background:bg,color,borderRadius:6,padding:"3px 8px",
    fontSize:size,fontWeight:700,whiteSpace:"nowrap"}}>{val}</span>;
}

/* ════════════════════════════════════════════
   EXPORT FUNCTIONS
════════════════════════════════════════════ */
function exportCSV(portfolio){
  const header = ["Nazwa","Ticker","Typ","Wartość (PLN)","Zysk/Strata (PLN)","Zmiana (%)","Udział (%)"];
  const rows = portfolio.map(s=>[
    s.n, s.t, s.type,
    s.v.toFixed(2).replace(".",","),
    s.p.toFixed(2).replace(".",","),
    s.c!==null?s.c.toFixed(2).replace(".",","):"N/A",
    ((s.v/TOTAL_VALUE)*100).toFixed(2).replace(".",",")
  ]);
  const csv = [header,...rows].map(r=>r.join(";")).join("\n");
  const blob = new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href=url; a.download="portfel_"+new Date().toISOString().slice(0,10)+".csv";
  a.click(); URL.revokeObjectURL(url);
}

async function exportPDF(portfolio){
  // Dynamically load jsPDF
  if(!window.jspdf){
    await new Promise((res,rej)=>{
      const s=document.createElement("script");
      s.src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      s.onload=res; s.onerror=rej;
      document.head.appendChild(s);
    });
  }
  if(!window.jspdf?.jsPDF) return alert("Błąd ładowania jsPDF");

  const {jsPDF} = window.jspdf;
  const doc = new jsPDF({orientation:"landscape",unit:"mm",format:"a4"});

  // Header
  doc.setFillColor(6,8,16);
  doc.rect(0,0,297,210,"F");
  doc.setTextColor(0,212,170);
  doc.setFontSize(18);
  doc.setFont("helvetica","bold");
  doc.text("PORTFEL INWESTYCYJNY",14,18);
  doc.setTextColor(226,232,242);
  doc.setFontSize(10);
  doc.text(`Wygenerowano: ${new Date().toLocaleDateString("pl-PL")}`,14,26);
  doc.text(`Łączna wartość: ${fmt(TOTAL_VALUE)} PLN`,14,33);
  doc.text(`Zysk/Strata: ${sign(TOTAL_PROFIT)}${fmt(TOTAL_PROFIT)} PLN  (ROI: ${TOTAL_ROI.toFixed(2)}%)`,14,40);

  // Table
  const headers = [["Nazwa","Ticker","Typ","Wartość PLN","P&L PLN","Zmiana %","Udział %"]];
  const rows = portfolio.map(s=>[
    s.n, s.t, s.type,
    fmt(s.v),
    `${sign(s.p)}${fmt(Math.abs(s.p))}`,
    s.c!==null?`${sign(s.c)}${s.c.toFixed(2)}%`:"N/A",
    `${((s.v/TOTAL_VALUE)*100).toFixed(1)}%`
  ]);

  // Simple manual table since jspdf-autotable may not be loaded
  let y=52;
  doc.setFillColor(17,20,37);
  doc.rect(10,y-5,277,8,"F");
  doc.setTextColor(0,212,170);
  doc.setFontSize(8);
  const cols=[10,55,80,110,145,175,205];
  headers[0].forEach((h,i)=>doc.text(h,cols[i],y));
  y+=8;

  rows.forEach((row,ri)=>{
    if(y>195){doc.addPage();y=20;}
    doc.setFillColor(ri%2===0?17:22,ri%2===0?20:25,ri%2===0?37:48);
    doc.rect(10,y-5,277,7,"F");
    const pnl=portfolio[ri].p;
    doc.setTextColor(pnl>=0?0:255, pnl>=0?212:77, pnl>=0?170:109);
    row.forEach((cell,ci)=>{
      if(ci===0||ci===1||ci===2) doc.setTextColor(226,232,242);
      doc.text(String(cell).slice(0,18),cols[ci],y);
      if(ci===2) doc.setTextColor(pnl>=0?0:255, pnl>=0?212:77, pnl>=0?170:109);
    });
    y+=7;
  });

  doc.save("portfel_"+new Date().toISOString().slice(0,10)+".pdf");
}

/* ════════════════════════════════════════════
   DASHBOARD
════════════════════════════════════════════ */
function DashboardScreen({portfolio,onRefresh,refreshing}){
  const total=portfolio.reduce((s,x)=>s+x.v,0);
  const winners=portfolio.filter(s=>s.p>0).length;
  const losers=portfolio.filter(s=>s.p<0).length;
  const withC=portfolio.filter(s=>s.c!==null);
  const best=[...withC].sort((a,b)=>b.c-a.c)[0];
  const worst=[...withC].sort((a,b)=>a.c-b.c)[0];

  return(
    <div style={{paddingTop:12}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
        {[[29,"Pozycji",TX],[`${winners} ↑`,"w zysku",G],[`${losers} ↓`,"na stracie",R]]
          .map(([v,l,c],i)=>(
            <div key={i} style={{background:CARD,border:`1px solid ${BD}`,borderRadius:11,padding:"10px 6px",textAlign:"center"}}>
              <div style={{fontSize:20,fontWeight:800,color:c}}>{v}</div>
              <div style={{fontSize:10,color:TX2,marginTop:2}}>{l}</div>
            </div>
          ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
        {[["\uD83C\uDFC6 Najlepszy",best,G,"rgba(0,212,170,0.06)","rgba(0,212,170,0.18)"],
          ["\uD83D\uDCC9 Najgorszy",worst,R,"rgba(255,77,109,0.06)","rgba(255,77,109,0.18)"]]
          .map(([lbl,s,col,bg,brd],i)=>(
            <div key={i} style={{background:bg,border:`1px solid ${brd}`,borderRadius:12,padding:"10px 12px"}}>
              <div style={{fontSize:9,color:TX2,letterSpacing:".1em",textTransform:"uppercase",marginBottom:4}}>{lbl}</div>
              <div style={{fontSize:13,fontWeight:700,color:TX,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s?.n}</div>
              <div style={{fontSize:10,color:TX2,marginBottom:7}}>{s?.t}</div>
              <div style={{fontSize:18,fontWeight:800,color:col}}>{pctStr(s?.c)}</div>
            </div>
          ))}
      </div>

      <Card title="Wartość portfela – 17 miesięcy" accent={G}>
        <div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:12}}>
          <span style={{fontSize:20,fontWeight:800,color:TX,letterSpacing:"-.03em"}}>
            {fmt(total)} <span style={{fontSize:13,color:TX2,fontWeight:400}}>PLN</span>
          </span>
          <Badge val={`${sign(TOTAL_ROI)}${Math.abs(TOTAL_ROI).toFixed(2)}%`}
            bg={TOTAL_PROFIT>=0?"rgba(0,212,170,0.12)":"rgba(255,77,109,0.12)"}
            color={pc(TOTAL_PROFIT)} size={12}/>
        </div>
        <div style={{height:100}}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={HISTORY} margin={{top:4,right:4,bottom:0,left:0}}>
              <XAxis dataKey="m" tick={{fill:TX2,fontSize:9}} axisLine={false} tickLine={false} interval={3}/>
              <YAxis hide domain={["auto","auto"]}/>
              <Tooltip formatter={v=>[`${fmt(v)} PLN`,"Wartość"]}
                contentStyle={{background:CARD2,border:`1px solid ${BD}`,borderRadius:8,fontSize:11,color:TX}}
                cursor={{stroke:G,strokeWidth:1,strokeDasharray:"4 4"}}/>
              <Line type="monotone" dataKey="v" stroke={G} strokeWidth={2} dot={false} activeDot={{r:4,fill:G}}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="Alokacja TOP 7">
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <div style={{width:130,height:130,flexShrink:0}}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={42} outerRadius={62}
                  paddingAngle={2} dataKey="value" strokeWidth={0}>
                  {PIE_DATA.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%8]}/>)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{flex:1,display:"flex",flexDirection:"column",gap:5}}>
            {PIE_DATA.map((item,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:7,height:7,borderRadius:2,background:PIE_COLORS[i],flexShrink:0}}/>
                <span style={{fontSize:11,color:TX2,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</span>
                <span style={{fontSize:11,fontWeight:700,color:TX}}>{((item.value/TOTAL_VALUE)*100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card title="Heatmapa wyników (%)">
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:4}}>
          {portfolio.map((s,i)=>(
            <div key={i} style={{background:heatBg(s.c),borderRadius:7,padding:"6px 3px",
              textAlign:"center",border:"1px solid rgba(255,255,255,0.035)"}}>
              <div style={{fontSize:8,color:TX2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:2}}>
                {s.t.slice(0,6)}
              </div>
              <div style={{fontSize:9,fontWeight:700,color:s.c===null?TX2:pc(s.c)}}>
                {s.c!==null?`${sign(s.c)}${s.c.toFixed(1)}%`:"N/A"}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <button onClick={onRefresh} disabled={refreshing} style={{
        width:"100%",background:refreshing?"rgba(79,142,247,0.07)":"rgba(0,212,170,0.08)",
        border:`1px solid ${refreshing?"rgba(79,142,247,0.2)":"rgba(0,212,170,0.2)"}`,
        borderRadius:12,padding:"12px",fontSize:13,fontWeight:600,
        color:refreshing?BL:G,cursor:refreshing?"not-allowed":"pointer",
        fontFamily:"inherit",transition:"all .2s",marginBottom:8
      }}>
        {refreshing?"⟳ Odświeżanie kursów...":"↻ Odśwież kursy"}
      </button>
    </div>
  );
}

/* ════════════════════════════════════════════
   HOLDINGS
════════════════════════════════════════════ */
function HoldingsScreen({portfolio}){
  const [q,setQ]=useState("");
  const [sort,setSort]=useState("val");

  const list=[...portfolio]
    .filter(s=>s.n.toLowerCase().includes(q.toLowerCase())||s.t.toLowerCase().includes(q.toLowerCase()))
    .sort((a,b)=>{
      if(sort==="val")return b.v-a.v;
      if(sort==="profit")return b.p-a.p;
      if(sort==="chg")return(b.c??-999)-(a.c??-999);
      return a.n.localeCompare(b.n);
    });

  return(
    <div style={{paddingTop:12}}>
      <div style={{background:CARD,border:`1px solid ${BD}`,borderRadius:11,
        display:"flex",alignItems:"center",padding:"0 12px",marginBottom:10}}>
        <span style={{color:TX2,marginRight:7,fontSize:15}}>⌕</span>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Szukaj po nazwie lub tickerze…"
          style={{background:"none",border:"none",outline:"none",color:TX,fontSize:13,
            padding:"11px 0",flex:1,fontFamily:"inherit"}}/>
        {q&&<span onClick={()=>setQ("")} style={{color:TX2,cursor:"pointer",fontSize:16}}>×</span>}
      </div>

      <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
        {[["val","Wartość"],["profit","P&L"],["chg","Zmiana"],["name","A–Z"]].map(([k,l])=>(
          <button key={k} onClick={()=>setSort(k)} style={{
            background:sort===k?"rgba(0,212,170,0.12)":CARD,
            border:`1px solid ${sort===k?"rgba(0,212,170,0.3)":BD}`,
            borderRadius:8,padding:"5px 12px",fontSize:11,
            color:sort===k?G:TX2,cursor:"pointer",fontFamily:"inherit",fontWeight:sort===k?700:400
          }}>{l}</button>
        ))}
        <span style={{marginLeft:"auto",fontSize:11,color:TX2,lineHeight:"28px"}}>{list.length}/29</span>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:4}}>
        {list.map((s,i)=>{
          const w=((s.v/TOTAL_VALUE)*100).toFixed(1);
          return(
            <div key={i} style={{background:CARD,border:`1px solid ${BD}`,borderRadius:11,
              padding:"11px 12px",display:"flex",alignItems:"center",gap:9}}>
              <div style={{width:40,height:40,borderRadius:9,flexShrink:0,
                background:`${pc(s.p)}15`,border:`1px solid ${pc(s.p)}30`,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:8,fontWeight:800,color:pc(s.p),letterSpacing:"-.02em"}}>
                {s.t.slice(0,5)}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,color:TX,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.n}</div>
                <div style={{fontSize:10,color:TX2}}>{s.type} · {w}%</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontSize:13,fontWeight:600,color:TX}}>{fmt(s.v)}</div>
                <div style={{fontSize:10,color:pc(s.p),fontWeight:700}}>{sign(s.p)}{fmt(Math.abs(s.p))}</div>
              </div>
              <Badge val={pctStr(s.c)}
                bg={s.p>=0?"rgba(0,212,170,0.11)":"rgba(255,77,109,0.11)"}
                color={pc(s.p)}/>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   CHARTS
════════════════════════════════════════════ */
function ChartsScreen({portfolio}){
  const [view,setView]=useState("alloc");
  const withC=portfolio.filter(s=>s.c!==null).sort((a,b)=>b.c-a.c);

  return(
    <div style={{paddingTop:12}}>
      <div style={{display:"flex",background:CARD,border:`1px solid ${BD}`,
        borderRadius:10,padding:3,marginBottom:14,gap:2}}>
        {[["alloc","Alokacja"],["pnl","P&L"],["rank","Ranking"]].map(([k,l])=>(
          <button key={k} onClick={()=>setView(k)} style={{
            flex:1,background:view===k?CARD2:"transparent",
            border:view===k?`1px solid ${BD}`:"1px solid transparent",
            borderRadius:8,padding:"7px 4px",fontSize:11,
            color:view===k?TX:TX2,cursor:"pointer",fontFamily:"inherit",fontWeight:view===k?600:400
          }}>{l}</button>
        ))}
      </div>

      {view==="alloc"&&(
        <Card title="Alokacja portfela" accent={BL}>
          <div style={{height:220}}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={95}
                  paddingAngle={2} dataKey="value" strokeWidth={0}>
                  {PIE_DATA.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%8]}/>)}
                </Pie>
                <Tooltip formatter={v=>[`${fmt(v)} PLN`]}
                  contentStyle={{background:CARD2,border:`1px solid ${BD}`,borderRadius:8,fontSize:11,color:TX}}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:"6px 14px",marginTop:6}}>
            {PIE_DATA.map((item,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:8,height:8,borderRadius:2,background:PIE_COLORS[i]}}/>
                <span style={{fontSize:11,color:TX2}}>{item.name}</span>
                <span style={{fontSize:11,fontWeight:700,color:TX}}>{((item.value/TOTAL_VALUE)*100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {view==="pnl"&&(
        <Card title="TOP 12 – Zysk / Strata (PLN)" accent={GO}>
          <div style={{height:BAR_DATA.length*32+50}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BAR_DATA} layout="vertical" margin={{top:0,right:28,bottom:0,left:0}}>
                <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.04)"/>
                <XAxis type="number" tick={{fill:TX2,fontSize:9}} axisLine={false} tickLine={false}/>
                <YAxis type="category" dataKey="name" tick={{fill:TX2,fontSize:10}} axisLine={false} tickLine={false} width={42}/>
                <Tooltip formatter={v=>[`${v>=0?"+":""}${fmt(v)} PLN`,"P&L"]}
                  contentStyle={{background:CARD2,border:`1px solid ${BD}`,borderRadius:8,fontSize:11,color:TX}}
                  cursor={{fill:"rgba(255,255,255,0.025)"}}/>
                <Bar dataKey="profit" radius={[0,4,4,0]}>
                  {BAR_DATA.map((e,i)=><Cell key={i} fill={e.profit>=0?G:R}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {view==="rank"&&(
        <Card title="Ranking zmian %" accent={G}>
          {withC.map((s,i)=>{
            const bw=Math.min(Math.abs(s.c)/100*100,100);
            return(
              <div key={i} style={{marginBottom:9}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <span style={{fontSize:11,color:TX}}>{s.n}</span>
                  <span style={{fontSize:11,fontWeight:700,color:pc(s.c)}}>{pctStr(s.c)}</span>
                </div>
                <div style={{height:4,background:"rgba(255,255,255,0.06)",borderRadius:4}}>
                  <div style={{height:"100%",width:`${bw}%`,background:pc(s.c),borderRadius:4,opacity:.8}}/>
                </div>
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════
   TRANSACTIONS
════════════════════════════════════════════ */
function TransactionsScreen(){
  const [txs,setTxs]=useState(INIT_TRANSACTIONS);
  const [show,setShow]=useState(false);
  const [form,setForm]=useState({date:new Date().toISOString().slice(0,10),type:"KUP",name:"",qty:"",price:""});

  function addTx(){
    if(!form.name||!form.qty||!form.price)return;
    const total=(parseFloat(form.qty)*parseFloat(form.price));
    setTxs(prev=>[{id:Date.now(),...form,qty:parseFloat(form.qty),price:parseFloat(form.price),total},...prev]);
    setShow(false);
    setForm({date:new Date().toISOString().slice(0,10),type:"KUP",name:"",qty:"",price:""});
  }

  return(
    <div style={{paddingTop:12}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontSize:12,color:TX2}}>{txs.length} transakcji</div>
        <button onClick={()=>setShow(!show)} style={{
          background:"rgba(0,212,170,0.1)",border:"1px solid rgba(0,212,170,0.25)",
          borderRadius:9,padding:"6px 14px",fontSize:12,color:G,
          cursor:"pointer",fontFamily:"inherit",fontWeight:600
        }}>+ Dodaj</button>
      </div>

      {show&&(
        <Card title="Nowa transakcja" accent={G} mb={12}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
            {[
              ["Data","date","date"],
              ["Spółka","name","text"],
              ["Ilość","qty","number"],
              ["Cena","price","number"],
            ].map(([lbl,key,type])=>(
              <div key={key}>
                <div style={{fontSize:10,color:TX2,marginBottom:4}}>{lbl}</div>
                <input type={type} value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))}
                  style={{width:"100%",background:CARD2,border:`1px solid ${BD}`,borderRadius:8,
                    padding:"8px 10px",fontSize:12,color:TX,fontFamily:"inherit",outline:"none"}}/>
              </div>
            ))}
          </div>
          <div style={{marginBottom:10}}>
            <div style={{fontSize:10,color:TX2,marginBottom:4}}>Typ</div>
            <div style={{display:"flex",gap:8}}>
              {["KUP","SPRZEDAJ"].map(t=>(
                <button key={t} onClick={()=>setForm(f=>({...f,type:t}))} style={{
                  flex:1,background:form.type===t?(t==="KUP"?"rgba(0,212,170,0.12)":"rgba(255,77,109,0.12)"):CARD2,
                  border:`1px solid ${form.type===t?(t==="KUP"?"rgba(0,212,170,0.3)":"rgba(255,77,109,0.3)"):BD}`,
                  borderRadius:8,padding:"8px",fontSize:12,fontWeight:700,
                  color:form.type===t?(t==="KUP"?G:R):TX2,cursor:"pointer",fontFamily:"inherit"
                }}>{t}</button>
              ))}
            </div>
          </div>
          <button onClick={addTx} style={{
            width:"100%",background:"rgba(0,212,170,0.1)",border:"1px solid rgba(0,212,170,0.25)",
            borderRadius:9,padding:"10px",fontSize:13,color:G,cursor:"pointer",fontFamily:"inherit",fontWeight:600
          }}>Zapisz transakcję</button>
        </Card>
      )}

      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {txs.map((tx,i)=>(
          <div key={tx.id||i} style={{background:CARD,border:`1px solid ${BD}`,borderRadius:11,
            padding:"11px 13px",display:"flex",alignItems:"center",gap:10}}>
            <div style={{
              width:36,height:36,borderRadius:8,flexShrink:0,
              background:tx.type==="KUP"?"rgba(0,212,170,0.1)":"rgba(255,77,109,0.1)",
              border:`1px solid ${tx.type==="KUP"?"rgba(0,212,170,0.25)":"rgba(255,77,109,0.25)"}`,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:16
            }}>
              {tx.type==="KUP"?"↓":"↑"}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:600,color:TX}}>{tx.name}</div>
              <div style={{fontSize:10,color:TX2}}>{tx.date} · {tx.qty} szt. @ {fmt(tx.price)}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:13,fontWeight:700,color:tx.type==="KUP"?G:R}}>
                {tx.type==="KUP"?"-":"+"}{fmt(tx.total)}
              </div>
              <div style={{fontSize:10,color:TX2}}>PLN</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   ALERTS
════════════════════════════════════════════ */
function AlertsScreen({portfolio}){
  const [alerts,setAlerts]=useState([
    {id:1,ticker:"ASML",type:"POWYŻEJ",price:1600,active:true},
    {id:2,ticker:"PEO",type:"PONIŻEJ",price:200,active:true},
    {id:3,ticker:"AAPL",type:"POWYŻEJ",price:280,active:false},
  ]);
  const [form,setForm]=useState({ticker:"",type:"POWYŻEJ",price:""});

  function addAlert(){
    if(!form.ticker||!form.price)return;
    setAlerts(prev=>[...prev,{id:Date.now(),...form,price:parseFloat(form.price),active:true}]);
    setForm({ticker:"",type:"POWYŻEJ",price:""});
  }
  function toggleAlert(id){
    setAlerts(prev=>prev.map(a=>a.id===id?{...a,active:!a.active}:a));
  }
  function removeAlert(id){
    setAlerts(prev=>prev.filter(a=>a.id!==id));
  }

  return(
    <div style={{paddingTop:12}}>
      <Card title="Nowy alert cenowy" accent={GO}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
          <div>
            <div style={{fontSize:10,color:TX2,marginBottom:4}}>Ticker</div>
            <input value={form.ticker} onChange={e=>setForm(f=>({...f,ticker:e.target.value.toUpperCase()}))}
              placeholder="np. ASML"
              style={{width:"100%",background:CARD2,border:`1px solid ${BD}`,borderRadius:8,
                padding:"8px 10px",fontSize:12,color:TX,fontFamily:"inherit",outline:"none"}}/>
          </div>
          <div>
            <div style={{fontSize:10,color:TX2,marginBottom:4}}>Cena docelowa</div>
            <input type="number" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))}
              placeholder="0.00"
              style={{width:"100%",background:CARD2,border:`1px solid ${BD}`,borderRadius:8,
                padding:"8px 10px",fontSize:12,color:TX,fontFamily:"inherit",outline:"none"}}/>
          </div>
        </div>
        <div style={{display:"flex",gap:8,marginBottom:10}}>
          {["POWYŻEJ","PONIŻEJ"].map(t=>(
            <button key={t} onClick={()=>setForm(f=>({...f,type:t}))} style={{
              flex:1,background:form.type===t?"rgba(232,184,75,0.12)":CARD2,
              border:`1px solid ${form.type===t?"rgba(232,184,75,0.3)":BD}`,
              borderRadius:8,padding:"8px",fontSize:12,fontWeight:700,
              color:form.type===t?GO:TX2,cursor:"pointer",fontFamily:"inherit"
            }}>{t}</button>
          ))}
        </div>
        <button onClick={addAlert} style={{
          width:"100%",background:"rgba(232,184,75,0.1)",border:"1px solid rgba(232,184,75,0.25)",
          borderRadius:9,padding:"10px",fontSize:13,color:GO,cursor:"pointer",fontFamily:"inherit",fontWeight:600
        }}>Dodaj alert</button>
      </Card>

      <div style={{fontSize:10,fontWeight:600,color:TX2,letterSpacing:".12em",
        textTransform:"uppercase",marginBottom:10}}>{alerts.length} alertów</div>

      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {alerts.map(alert=>(
          <div key={alert.id} style={{background:CARD,border:`1px solid ${alert.active?"rgba(232,184,75,0.2)":BD}`,
            borderLeft:`3px solid ${alert.active?GO:BD}`,borderRadius:11,
            padding:"12px 13px",display:"flex",alignItems:"center",gap:10,
            opacity:alert.active?1:0.5}}>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:700,color:TX}}>{alert.ticker}</div>
              <div style={{fontSize:11,color:TX2,marginTop:2}}>
                {alert.type} {fmt(alert.price)} PLN
              </div>
            </div>
            <div style={{display:"flex",gap:6}}>
              <button onClick={()=>toggleAlert(alert.id)} style={{
                background:alert.active?"rgba(0,212,170,0.1)":"rgba(255,255,255,0.05)",
                border:`1px solid ${alert.active?"rgba(0,212,170,0.2)":BD}`,
                borderRadius:7,padding:"5px 10px",fontSize:10,
                color:alert.active?G:TX2,cursor:"pointer",fontFamily:"inherit"
              }}>{alert.active?"AKTYWNY":"WYŁĄCZONY"}</button>
              <button onClick={()=>removeAlert(alert.id)} style={{
                background:"rgba(255,77,109,0.08)",border:"1px solid rgba(255,77,109,0.2)",
                borderRadius:7,padding:"5px 10px",fontSize:12,
                color:R,cursor:"pointer",fontFamily:"inherit"
              }}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   SETTINGS / EKSPORT
════════════════════════════════════════════ */
function SettingsScreen({portfolio,pwaPrompt}){
  const [exporting,setExporting]=useState(null);

  async function handlePDF(){
    setExporting("pdf");
    try{await exportPDF(portfolio);}catch(e){alert("Błąd eksportu PDF: "+e.message);}
    setExporting(null);
  }
  function handleCSV(){
    setExporting("csv");
    exportCSV(portfolio);
    setTimeout(()=>setExporting(null),800);
  }

  return(
    <div style={{paddingTop:12}}>
      <Card title="Eksport danych" accent={BL}>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <button onClick={handleCSV} disabled={exporting==="csv"} style={{
            background:"rgba(0,212,170,0.08)",border:"1px solid rgba(0,212,170,0.2)",
            borderRadius:11,padding:"14px 16px",textAlign:"left",cursor:"pointer",fontFamily:"inherit",
            display:"flex",alignItems:"center",gap:12,opacity:exporting==="csv"?0.6:1
          }}>
            <span style={{fontSize:24}}>📊</span>
            <div>
              <div style={{fontSize:14,fontWeight:700,color:G}}>Eksport CSV</div>
              <div style={{fontSize:11,color:TX2,marginTop:2}}>Plik .csv do Excel / Google Sheets</div>
            </div>
            <span style={{marginLeft:"auto",fontSize:11,color:TX2}}>
              {exporting==="csv"?"Pobieranie...":"→"}
            </span>
          </button>

          <button onClick={handlePDF} disabled={exporting==="pdf"} style={{
            background:"rgba(255,77,109,0.07)",border:"1px solid rgba(255,77,109,0.2)",
            borderRadius:11,padding:"14px 16px",textAlign:"left",cursor:"pointer",fontFamily:"inherit",
            display:"flex",alignItems:"center",gap:12,opacity:exporting==="pdf"?0.6:1
          }}>
            <span style={{fontSize:24}}>📄</span>
            <div>
              <div style={{fontSize:14,fontWeight:700,color:R}}>Eksport PDF</div>
              <div style={{fontSize:11,color:TX2,marginTop:2}}>Raport PDF z tabelą pozycji</div>
            </div>
            <span style={{marginLeft:"auto",fontSize:11,color:TX2}}>
              {exporting==="pdf"?"Generowanie...":"→"}
            </span>
          </button>
        </div>
      </Card>

      {pwaPrompt&&(
        <Card title="Instalacja na Android / iPhone" accent={G}>
          <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
            <span style={{fontSize:32}}>📱</span>
            <div>
              <div style={{fontSize:14,fontWeight:700,color:TX,marginBottom:4}}>
                Zainstaluj jako aplikację
              </div>
              <div style={{fontSize:12,color:TX2,lineHeight:1.6}}>
                Dodaj aplikację do ekranu głównego telefonu — działa offline jak natywna aplikacja.
              </div>
            </div>
          </div>
          <button onClick={()=>pwaPrompt.prompt()} style={{
            width:"100%",background:"rgba(0,212,170,0.1)",border:"1px solid rgba(0,212,170,0.25)",
            borderRadius:11,padding:"13px",fontSize:14,fontWeight:700,color:G,
            cursor:"pointer",fontFamily:"inherit"
          }}>📲 Zainstaluj na telefonie</button>
        </Card>
      )}

      <Card title="Instalacja ręczna (Android / iPhone)">
        {[
          ["🌐","Chrome Android","Otwórz stronę → menu ⋮ → \"Dodaj do ekranu głównego\""],
          ["🍎","Safari iPhone","Otwórz stronę → ikona Udostępnij □↑ → \"Dodaj do ekranu domowego\""],
          ["🔗","Adres lokalny","Otwórz na telefonie: http://[adres-IP-komputera]:5174"],
        ].map(([icon,title,desc],i)=>(
          <div key={i} style={{display:"flex",gap:10,marginBottom:i<2?12:0,
            paddingBottom:i<2?12:0,borderBottom:i<2?`1px solid ${BD}`:"none"}}>
            <span style={{fontSize:20,flexShrink:0}}>{icon}</span>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:TX,marginBottom:3}}>{title}</div>
              <div style={{fontSize:11,color:TX2,lineHeight:1.55}}>{desc}</div>
            </div>
          </div>
        ))}
      </Card>

      <Card title="Informacje o portfelu">
        {[
          ["Łączna wartość", `${fmt(TOTAL_VALUE)} PLN`],
          ["Koszt nabycia",  `${fmt(COST_BASIS)} PLN`],
          ["Zysk / Strata",  `${sign(TOTAL_PROFIT)}${fmt(TOTAL_PROFIT)} PLN`],
          ["ROI",            `${TOTAL_ROI.toFixed(2)}%`],
          ["Pozycji",        "29"],
          ["Na plusie",      "12"],
          ["Na minusie",     "17"],
        ].map(([k,v],i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",
            padding:"8px 0",borderBottom:i<6?`1px solid ${BD}`:"none"}}>
            <span style={{fontSize:12,color:TX2}}>{k}</span>
            <span style={{fontSize:12,fontWeight:700,color:TX}}>{v}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

/* ════════════════════════════════════════════
   AI INSIGHTS
════════════════════════════════════════════ */
function InsightsScreen(){
  const insights=[
    ["⚠️","Wysoka koncentracja",GO,"Creotech + Synektik stanowią ~34% portfela. Dywersyfikacja zmniejszy ryzyko sektorowe."],
    ["📉","Biotech – wysokie ryzyko",R,"Onconova, Cardiff Oncology, Traws Pharma: łączna strata −3 052 PLN (avg −83%). Rozważ zamknięcie pozycji."],
    ["✅","ASML – solidna pozycja",G,"Zysk +1 530 PLN (+11.76%). Globalny lider EUV. Warto utrzymać lub zwiększyć."],
    ["🚀","Asbis – najlepsza zmiana",G,"Zmiana +43.35% – największy procentowy wzrost w portfelu."],
    ["💡","Sugestia: zamknij spekulacje",BL,"Pozycje GOEV, FFIE, ONTX są praktycznie bezwartościowe (strata >88%). Reinwestuj ~2 500 PLN w ETF."],
    ["📊","Wynik portfela",GO,"12/29 spółek na plusie. Strata −2 106 PLN (ROI −1.87%). Wewnętrznie zyski pokrywają ~48% strat."],
  ];

  return(
    <div style={{paddingTop:12}}>
      <div style={{background:"linear-gradient(135deg,rgba(0,212,170,0.07),rgba(79,142,247,0.09))",
        border:"1px solid rgba(0,212,170,0.14)",borderRadius:14,padding:"16px",marginBottom:12,textAlign:"center"}}>
        <div style={{fontSize:9,color:TX2,letterSpacing:".14em",textTransform:"uppercase",marginBottom:5}}>AI Portfolio Score</div>
        <div style={{fontSize:52,fontWeight:900,color:GO,letterSpacing:"-.05em",lineHeight:1}}>62</div>
        <div style={{fontSize:12,color:TX2,marginTop:3}}>Umiarkowany — potencjał wzrostu</div>
        <div style={{display:"flex",justifyContent:"center",gap:22,marginTop:12}}>
          {[["41%","Wzrost",G],["18%","Dywidendy",GO],["15%","Spekulac.",R]].map(([v,l,c])=>(
            <div key={l}><div style={{fontSize:16,fontWeight:800,color:c}}>{v}</div>
            <div style={{fontSize:9,color:TX2}}>{l}</div></div>
          ))}
        </div>
      </div>

      <Card title="Struktura ryzyka">
        {[["Spekulacyjne",15,R],["Technologia",32,BL],["Finanse/GPW",25,GO],["Przemysł/inne",28,"#a78bfa"]]
          .map(([l,p,c],i)=>(
            <div key={i} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:12,color:TX2}}>{l}</span>
                <span style={{fontSize:12,fontWeight:700,color:c}}>{p}%</span>
              </div>
              <div style={{height:5,background:"rgba(255,255,255,0.06)",borderRadius:4}}>
                <div style={{height:"100%",width:`${p}%`,background:c,borderRadius:4,opacity:.75}}/>
              </div>
            </div>
          ))}
      </Card>

      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {insights.map(([icon,title,col,text],i)=>(
          <div key={i} style={{background:CARD,border:`1px solid ${BD}`,
            borderLeft:`3px solid ${col}`,borderRadius:11,padding:"11px 13px"}}>
            <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4}}>
              <span style={{fontSize:14}}>{icon}</span>
              <span style={{fontSize:13,fontWeight:700,color:TX}}>{title}</span>
            </div>
            <div style={{fontSize:12,color:TX2,lineHeight:1.55}}>{text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   APP ROOT
════════════════════════════════════════════ */
const TABS=[
  {id:"dashboard",lbl:"Dashboard",icon:"⊞"},
  {id:"holdings", lbl:"Portfel",  icon:"≡"},
  {id:"charts",   lbl:"Wykresy",  icon:"◎"},
  {id:"txs",      lbl:"Historia", icon:"↕"},
  {id:"alerts",   lbl:"Alerty",   icon:"🔔"},
  {id:"settings", lbl:"Eksport",  icon:"⚙"},
];

export default function App(){
  const [tab,setTab]=useState("dashboard");
  const [portfolio,setPortfolio]=useState(INIT_PORTFOLIO);
  const [refreshing,setRefreshing]=useState(false);
  const [pwaPrompt,setPwaPrompt]=useState(null);

  // Capture PWA install prompt
  useEffect(()=>{
    const handler=e=>{e.preventDefault();setPwaPrompt(e)};
    window.addEventListener("beforeinstallprompt",handler);
    return()=>window.removeEventListener("beforeinstallprompt",handler);
  },[]);

  // Register service worker
  useEffect(()=>{
    if("serviceWorker" in navigator){
      navigator.serviceWorker.register("/sw.js").catch(()=>{});
    }
  },[]);

  const handleRefresh = useCallback(async()=>{
    setRefreshing(true);
    await new Promise(r=>setTimeout(r,1200));
    setPortfolio(prev=>prev.map(s=>{
      const delta=(Math.random()-0.48)*2.5;
      const newC=s.c!==null?+(s.c+delta).toFixed(2):null;
      const newV=+(s.v*(1+delta/100)).toFixed(2);
      const newP=+(s.p+(newV-s.v)).toFixed(2);
      return{...s,c:newC,v:newV,p:newP};
    }));
    setRefreshing(false);
  },[]);

  return(
    <div style={{background:BG,minHeight:"100vh",paddingBottom:68,
      fontFamily:"-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',sans-serif",color:TX}}>

      {/* HEADER */}
      <div style={{background:"linear-gradient(160deg,#0c0e1c 0%,#080c20 100%)",
        borderBottom:`1px solid ${BD}`,padding:"16px 16px 12px",position:"sticky",top:0,zIndex:50}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontSize:9,color:TX2,letterSpacing:".18em",textTransform:"uppercase",marginBottom:4}}>
              Portfel Inwestycyjny
            </div>
            <div style={{fontSize:26,fontWeight:800,letterSpacing:"-.03em",color:TX,lineHeight:1}}>
              {fmt(portfolio.reduce((s,x)=>s+x.v,0))}&nbsp;
              <span style={{fontSize:13,color:TX2,fontWeight:400}}>PLN</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginTop:5}}>
              <Badge val={`${sign(TOTAL_PROFIT)}${fmt(Math.abs(TOTAL_PROFIT))} PLN`}
                bg="rgba(255,77,109,0.11)" color={R} size={11}/>
              <span style={{fontSize:11,fontWeight:700,color:R}}>
                {TOTAL_ROI.toFixed(2)}% ROI
              </span>
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:10,color:TX2,marginBottom:5}}>15 maj 2026</div>
            <div style={{display:"inline-flex",alignItems:"center",gap:5,
              background:"rgba(0,212,170,0.09)",border:"1px solid rgba(0,212,170,0.22)",
              borderRadius:7,padding:"4px 9px",fontSize:10,color:G}}>
              <span style={{width:5,height:5,borderRadius:"50%",background:G,
                boxShadow:`0 0 6px ${G}`,display:"inline-block"}}/>
              LIVE
            </div>
          </div>
        </div>
      </div>

      {/* SCREENS */}
      <div style={{padding:"0 12px"}}>
        {tab==="dashboard"&&<DashboardScreen portfolio={portfolio} onRefresh={handleRefresh} refreshing={refreshing}/>}
        {tab==="holdings" &&<HoldingsScreen  portfolio={portfolio}/>}
        {tab==="charts"   &&<ChartsScreen    portfolio={portfolio}/>}
        {tab==="txs"      &&<TransactionsScreen/>}
        {tab==="alerts"   &&<AlertsScreen portfolio={portfolio}/>}
        {tab==="insights" &&<InsightsScreen/>}
        {tab==="settings" &&<SettingsScreen portfolio={portfolio} pwaPrompt={pwaPrompt}/>}
      </div>

      {/* BOTTOM NAV */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:50,
        background:SURF,borderTop:`1px solid ${BD}`,display:"flex",padding:"6px 0 8px"}}>
        {TABS.map(item=>(
          <button key={item.id} onClick={()=>setTab(item.id)} style={{
            flex:1,background:"none",border:"none",cursor:"pointer",
            display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"2px 0"}}>
            <span style={{fontSize:item.icon.length>2?14:17,color:tab===item.id?G:TX2,lineHeight:1}}>
              {item.icon}
            </span>
            <span style={{fontSize:8,color:tab===item.id?G:TX2,fontWeight:tab===item.id?700:400,fontFamily:"inherit"}}>
              {item.lbl}
            </span>
            {tab===item.id&&<div style={{width:16,height:2,background:G,borderRadius:2}}/>}
          </button>
        ))}
      </div>
    </div>
  );
}
