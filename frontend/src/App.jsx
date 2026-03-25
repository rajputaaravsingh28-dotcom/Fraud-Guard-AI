import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, AlertTriangle, AlertCircle, Activity, Search, RefreshCw, XCircle, 
  BarChart2, FileText, Share2, Users, Database, Globe, Play, ChevronRight, FileArchive, Menu, X
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import ForceGraph2D from 'react-force-graph-2d';

const API_URL = 'http://localhost:8001';

const getBadgeStyle = (decision) => {
  switch(decision) {
    case 'ALLOW': return 'badge-low';
    case 'MONITOR': return 'badge-medium';
    case 'ESCALATE': return 'badge-high';
    case 'BLOCK': return 'badge-high';
    default: return '';
  }
};

const getScoreColor = (score) => {
  if (score < 30) return 'var(--risk-low)';
  if (score < 60) return 'var(--risk-medium)';
  return 'var(--risk-high)';
};

// [EXISTING CODE] Reusing LandingPage, Sidebar, Header, SequentialAgentFeed, Dashboard, AMLRules
function LandingPage() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Gradient orbs background */}
      <div style={{ position: 'absolute', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)', top: '-200px', right: '-100px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', bottom: '-150px', left: '-100px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', top: '30%', left: '60%', pointerEvents: 'none' }} />

      {/* Glassmorphism Hero Card */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(255,255,255,0.45)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: '32px', padding: 'clamp(40px, 6vw, 80px) clamp(24px, 5vw, 64px)', maxWidth: '720px', width: '90%', boxShadow: '0 8px 32px rgba(31,38,135,0.08), 0 2px 8px rgba(0,0,0,0.04)' }}>

        {/* 3D Floating Shield */}
        <div style={{ position: 'relative', marginBottom: '32px', animation: 'float 4s ease-in-out infinite' }}>
          <div style={{ width: '120px', height: '120px', background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', borderRadius: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 60px rgba(37,99,235,0.25), 0 0 0 1px rgba(255,255,255,0.2) inset', transform: 'perspective(600px) rotateY(-6deg) rotateX(4deg)' }}>
            <ShieldCheck size={56} color="white" strokeWidth={1.5} />
          </div>
          <div style={{ position: 'absolute', bottom: '-12px', left: '50%', transform: 'translateX(-50%)', width: '80px', height: '12px', background: 'radial-gradient(ellipse, rgba(37,99,235,0.15), transparent)', borderRadius: '50%' }} />
        </div>

        {/* Title */}
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '800', color: '#0f172a', textAlign: 'center', marginBottom: '12px', letterSpacing: '-1px', lineHeight: 1.1 }}>
          Fraud Guard <span style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span>
        </h1>
        <p style={{ fontSize: 'clamp(14px, 2vw, 17px)', color: '#64748b', maxWidth: '480px', textAlign: 'center', lineHeight: '1.7', marginBottom: '36px' }}>
          Next-generation cognitive fraud detection & financial crime investigation platform powered by multi-agent AI swarm intelligence.
        </p>

        {/* CTA Button */}
        <button onClick={() => navigate('/app/dashboard')} style={{ padding: '14px 36px', fontSize: '15px', fontWeight: '700', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#fff', border: 'none', borderRadius: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 20px rgba(37,99,235,0.3)', transition: 'all 0.3s ease', letterSpacing: '0.3px' }}>
          Launch Dashboard <ChevronRight size={18} />
        </button>
      </div>

      {/* Stats bar ΓÇö Glassmorphism */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 'clamp(16px, 4vw, 48px)', marginTop: '48px', flexWrap: 'wrap', justifyContent: 'center', background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.7)', borderRadius: '20px', padding: '24px clamp(24px, 4vw, 48px)', boxShadow: '0 4px 24px rgba(31,38,135,0.06)' }}>
        {[{ val: '65,000+', label: 'Transactions Monitored', color: '#2563eb' }, { val: '99.8%', label: 'Detection Accuracy', color: '#7c3aed' }, { val: '<50ms', label: 'Response Time', color: '#0ea5e9' }, { val: '6', label: 'AI Agents Active', color: '#22c55e' }].map(s => (
          <div key={s.label} style={{ textAlign: 'center', minWidth: '100px' }}>
            <div style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: '800', color: s.color }}>{s.val}</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', fontWeight: '500' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-14px); } }
      `}</style>
    </div>
  );
}

function Sidebar({ isOpen, setOpen }) {
  const location = useLocation();
  const links = [
    { name: 'Dashboard', path: '/app/dashboard', icon: <Activity size={18} /> },
    { name: 'Under Review', path: '/app/review', icon: <Search size={18} /> },
    { name: 'Resolved', path: '/app/resolved', icon: <ShieldCheck size={18} /> },
    { name: 'Case Reports', path: '/app/cases', icon: <FileArchive size={18} /> },
    { name: 'Entity Graph', path: '/app/entity-graph', icon: <Share2 size={18} /> },
    { name: 'AML/KYC Rules', path: '/app/rules', icon: <Database size={18} /> },
    { name: 'Audit Trail', path: '/app/audit', icon: <Globe size={18} /> }
  ];

  return (
    <>
      <div className="sidebar-overlay" onClick={() => setOpen(false)}></div>
      <div className="sidebar-container" style={{display:'flex', flexDirection:'column'}}>
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'var(--accent-light)', padding: '8px', borderRadius: '8px' }}>
              <ShieldCheck size={24} color="var(--accent)" />
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: '700' }}>Fraud Guard AI</h2>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>OLLAMA AGENT ENABLED</p>
            </div>
          </div>
          <button className="mobile-nav-toggle" style={{margin:0}} onClick={() => setOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {links.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              onClick={() => setOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px',
                textDecoration: 'none', fontSize: '14px', fontWeight: location.pathname === link.path ? '600' : '500',
                color: location.pathname === link.path ? 'var(--accent)' : 'var(--text-secondary)',
                background: location.pathname === link.path ? 'var(--accent-light)' : 'transparent',
                transition: 'var(--transition)'
              }}
            >
              {link.icon} {link.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

function Header({ simulateAlert, toggleMenu }) {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="header-container">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button className="mobile-nav-toggle" onClick={toggleMenu}><Menu size={24} /></button>
        <h1 style={{ fontSize: '18px', fontWeight: '600', display: 'none', '@media(min-width: 640px)': {display: 'block'} }} className="header-title">Transaction Intelligence</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '600', color: 'var(--risk-low)', background: 'var(--risk-low-bg)', padding: '4px 10px', borderRadius: '999px', border: '1px solid rgba(34,197,94,0.2)', marginLeft: '16px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--risk-low)' }}></div> LIVE
        </div>
      </div>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', marginRight: '16px' }} className="hide-on-mobile">
          <Globe size={14} /> {time} UTC
        </div>
        <button className="btn-secondary" onClick={() => window.open(`${API_URL}/report/export`, '_blank')}>
          <FileText size={16} /> Export CSV
        </button>
        <button className="btn-primary" onClick={simulateAlert}>
          <Play size={16} /> Simulate
        </button>
      </div>
    </div>
  );
}

const CheckCircle = ({size, color}) => <div style={{width:size,height:size, borderRadius:'50%', background:color}}></div>;

function SequentialAgentFeed({ agentLogs }) {
  let steps = [];
  try { steps = agentLogs ? JSON.parse(agentLogs) : []; } catch(e) {}
  if (steps.length === 0) steps = [{ agent: 'System Engine', action: 'Awaiting intelligence sequence...' }];

  const [activeStep, setActiveStep] = useState(-1);
  useEffect(() => {
    setActiveStep(-1);
    let current = 0;
    const interval = setInterval(() => {
      setActiveStep(current);
      current++;
      if (current >= steps.length) clearInterval(interval);
    }, 400);
    return () => clearInterval(interval);
  }, [agentLogs]);

  return (
    <div style={{ marginTop: '24px' }}>
      <h4 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>Cognitive Agent Feed</h4>
      <div>
        {steps.map((step, idx) => (
          <div key={idx} className="fade-in feed-step" style={{ display: idx <= activeStep ? 'flex' : 'none' }}>
            <div className="step-icon">
              {idx === activeStep && idx < steps.length - 1 ? <div style={{width:'8px',height:'8px',background:'var(--accent)',borderRadius:'50%'}}></div> : <CheckCircle size={12} color="var(--accent)" />}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{step.agent}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{step.action} {step.score !== undefined ? `[Score: ${step.score.toFixed?step.score.toFixed(0):step.score}]` : ''}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Dashboard({ transactions, kpi, stats, selectedTx, setSelectedTx }) {
  const COLORS = ['#22c55e', '#f59e0b', '#ef4444'];
  return (
    <div className="fade-in" style={{ padding: 'clamp(16px, 3vw, 32px)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="grid-kpi">
        <div className="card">
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500', marginBottom: '8px' }}>Transactions Today</div>
          <div style={{ fontSize: '28px', fontWeight: '700' }}>{(kpi?.transactions_today || 14502).toLocaleString()}</div>
        </div>
        <div className="card">
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500', marginBottom: '8px' }}>Flagged Anomalies</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--risk-high)' }}>{kpi?.flagged_anomalies || 24}</div>
        </div>
        <div className="card">
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500', marginBottom: '8px' }}>Active Investigations</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--risk-medium)' }}>{kpi?.active_investigations || 8}</div>
        </div>
        <div className="card">
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500', marginBottom: '8px' }}>False Positive Rate</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--risk-low)' }}>{kpi?.fp_rate || '1.2%'}</div>
        </div>
      </div>

      <div className="grid-main">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card" style={{ height: '300px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>Transaction Volume Over Time</h3>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={stats?.volume_data || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill:'var(--text-muted)', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill:'var(--text-muted)', fontSize: 12}} />
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                <Line type="monotone" dataKey="volume" stroke="var(--accent)" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card" style={{ flex: 1 }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>Live Transaction Monitoring</h3>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr><th>Tx ID</th><th>User</th><th>Amount</th><th>Location</th><th>Risk</th></tr>
                </thead>
                <tbody>
                  {(Array.isArray(transactions) ? transactions : []).slice(0, 15).map(tx => (
                    <tr key={tx.id} onClick={() => setSelectedTx(tx)} className={selectedTx?.id === tx.id ? 'selected-row' : ''}>
                      <td style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>#{tx.id}</td>
                      <td style={{ fontWeight: '500' }}>{tx.user_id}</td>
                      <td style={{ fontWeight: '500' }}>${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td>{tx.location}</td>
                      <td><span className={`badge ${getBadgeStyle(tx.decision)}`}>{tx.decision}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card" style={{ position: 'sticky', top: '94px', minHeight: '600px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="var(--accent)" /> AI Intelligence Panel
          </h3>
          {selectedTx ? (
            <div className="fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Risk Assessment</div>
                  <div style={{ fontSize: '48px', fontWeight: '700', color: getScoreColor(selectedTx.risk_score), lineHeight: '1' }}>
                    {selectedTx.risk_score.toFixed(0)}<span style={{fontSize:'20px', color:'var(--text-muted)'}}>/100</span>
                  </div>
                </div>
                <div className={`badge ${getBadgeStyle(selectedTx.decision)}`} style={{ fontSize: '14px', padding: '6px 12px' }}>
                  {selectedTx.decision}
                </div>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                  <div><div style={{ color: 'var(--text-secondary)' }}>Amount</div><div style={{ fontWeight: '500' }}>${selectedTx.amount.toLocaleString()}</div></div>
                  <div><div style={{ color: 'var(--text-secondary)' }}>Location</div><div style={{ fontWeight: '500' }}>{selectedTx.location}</div></div>
                  <div><div style={{ color: 'var(--text-secondary)' }}>Device</div><div style={{ fontWeight: '500' }}>{selectedTx.device}</div></div>
                  <div><div style={{ color: 'var(--text-secondary)' }}>User ID</div><div style={{ fontWeight: '500' }}>{selectedTx.user_id}</div></div>
                </div>
              </div>
              <SequentialAgentFeed agentLogs={selectedTx.agent_logs} />
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '100px' }}>Select a transaction</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---- NEW FUNCTIONAL PAGES ----

function TablePage({ title, description, endpoint, columns, renderRow }) {
  const [data, setData] = useState([]);
  const fetchData = () => { fetch(`${API_URL}${endpoint}`).then(r => r.json()).then(setData).catch(console.error); };
  useEffect(() => { fetchData() }, [endpoint]);
  return (
    <div className="card fade-in" style={{ margin: 'clamp(16px, 3vw, 32px)' }}>
       <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: description ? '8px' : '24px' }}>{title}</h2>
       {description && <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '14px' }}>{description}</p>}
       <div style={{ overflowX: 'auto' }}>
         <table>
           <thead><tr>{columns.map(c => <th key={c}>{c}</th>)}</tr></thead>
           <tbody>{(Array.isArray(data) ? data : []).map(item => renderRow(item, fetchData))}</tbody>
         </table>
         {(!Array.isArray(data) || data.length === 0) && <div style={{padding:'40px', textAlign:'center', color:'var(--text-secondary)'}}>No data found in Database...</div>}
       </div>
    </div>
  );
}

function EntityGraph() {
  const [data, setData] = useState({ nodes: [], links: [] });
  useEffect(() => { fetch(`${API_URL}/entities`).then(r => r.json()).then(setData).catch(console.error); }, []);
  return (
    <div className="card fade-in" style={{ margin: 'clamp(16px, 3vw, 32px)', height: '800px', display: 'flex', flexDirection: 'column' }}>
      <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom: '16px'}}>
         <Share2 size={24} color="var(--accent)" />
         <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Live Entity Relationship Subgraph</h2>
      </div>
      <div style={{ flex: 1, border: '1px solid var(--border-light)', borderRadius: '8px', position: 'relative', overflow: 'hidden', background: '#fafafa' }}>
        {data.nodes && data.nodes.length > 0 ? (
          <ForceGraph2D
            width={1200}
            height={700}
            graphData={data}
            nodeLabel="label"
            nodeAutoColorBy="group"
            linkDirectionalParticles={2}
            linkDirectionalParticleSpeed={d => d.value * 0.001}
          />
        ) : (
          <div style={{height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-secondary)'}}>Generating Subgraph Links...</div>
        )}
      </div>
    </div>
  );
}

function SystemAuditTrail() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('');
  
  useEffect(() => {
    fetch(`${API_URL}/audit`).then(r => r.json()).then(setLogs).catch(console.error);
  }, []);

  const filteredLogs = logs.filter(l => 
    l.action.toLowerCase().includes(filter.toLowerCase()) || 
    l.details.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="fade-in" style={{ padding: 'clamp(16px, 3vw, 32px)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Globe color="var(--accent)" /> Deep System Audit Trail
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Immutable ledger tracking cognitive updates and manual overrides.</p>
        </div>
        <div style={{ background: 'var(--bg-secondary)', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px', width: '300px' }}>
          <Search size={16} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search telemetry..." 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)} 
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '14px', color: 'var(--text-primary)' }}
          />
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-light)' }}>
            <tr>
              <th style={{ padding: '16px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Log Index</th>
              <th style={{ padding: '16px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Operation Category</th>
              <th style={{ padding: '16px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Telemetry Detail</th>
              <th style={{ padding: '16px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Timestamp (UTC)</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(l => (
              <tr key={l.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '16px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>AUTH-{l.id}</td>
                <td style={{ padding: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: l.action.includes('Override') ? 'var(--risk-high)' : 'var(--accent)' }}></div>
                    {l.action}
                  </span>
                </td>
                <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{l.details}</td>
                <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '13px' }}>{new Date(l.timestamp).toUTCString()}</td>
              </tr>
            ))}
            {filteredLogs.length === 0 && (
              <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No telemetry arrays match the active filter.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AMLRules() {
  return <TablePage title="AML/KYC Rules Dictionary" endpoint="/rules" columns={['Rule ID', 'Name', 'Description', 'Weight', 'Status']} renderRow={r => (
    <tr key={r.id}>
      <td style={{fontFamily:'monospace', color:'var(--text-secondary)'}}>{r.id}</td><td>{r.name}</td><td>{r.desc}</td><td>{r.weight}</td>
      <td><span className={r.active ? 'badge badge-high' : 'badge badge-low'}>{r.active ? 'ACTIVE' : 'INACTIVE'}</span></td>
    </tr>
  )} />
}

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [kpi, setKpi] = useState(null);
  const [stats, setStats] = useState(null);
  const [selectedTx, setSelectedTx] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [txRes, kpiRes, statsRes] = await Promise.all([ fetch(`${API_URL}/transactions`), fetch(`${API_URL}/kpi`), fetch(`${API_URL}/stats`) ]);
        if(txRes.ok) {
           const data = await txRes.json();
           setTransactions(data);
           setSelectedTx(prev => prev || (data.length > 0 ? data[0] : null));
        }
        if(kpiRes.ok) setKpi(await kpiRes.json());
        if(statsRes.ok) setStats(await statsRes.json());
      } catch (err) {}
    };
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const simulateAlert = async () => {
    const payload = { user_id: `USR-${Math.floor(Math.random()*9000)+1000}`, amount: [1500, 45000, 120000, 195000][Math.floor(Math.random()*4)], location: ['India', 'USA', 'UK', 'Russia'][Math.floor(Math.random()*4)], device: ['mobile', 'desktop'][Math.floor(Math.random()*2)] };
    try {
      await fetch(`${API_URL}/analyze-transaction`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const txRes = await fetch(`${API_URL}/transactions`);
      if(txRes.ok) { const data = await txRes.json(); setTransactions(data); setSelectedTx(data[0]); }
    } catch {}
  };

  return (
    <div className={`app-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar isOpen={sidebarOpen} setOpen={setSidebarOpen} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header simulateAlert={simulateAlert} toggleMenu={() => setSidebarOpen(true)} />
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <Routes>
             <Route path="/dashboard" element={<Dashboard transactions={transactions} selectedTx={selectedTx} setSelectedTx={setSelectedTx} kpi={kpi} stats={stats} />} />
             <Route path="/entity-graph" element={<EntityGraph />} />
             <Route path="/rules" element={<AMLRules />} />
             <Route path="/review" element={<TablePage title="Action Required: Under Review" description="Transactions that triggered medium-to-high risk anomalies. Requires immediate manual analyst review to authorize Approval or definitive Block overrides." endpoint="/review" columns={['Tx ID', 'User', 'Amount', 'Location', 'Risk', 'Actions']} renderRow={(tx, refresh) => (
               <tr key={tx.id}>
                  <td style={{fontFamily:'monospace'}}>#{tx.id}</td><td>{tx.user_id}</td><td>${tx.amount.toLocaleString()}</td><td>{tx.location}</td><td><span className={`badge ${getBadgeStyle(tx.decision)}`}>{tx.decision}</span></td>
                  <td>
                    <div style={{display:'flex', gap:'8px'}}>
                      <button className="btn-secondary" style={{padding:'4px 8px', fontSize:'12px'}} onClick={() => fetch(`${API_URL}/transactions/${tx.id}/decision`, {method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({decision:'ALLOW'})}).then(refresh)}>Approve</button>
                      <button className="btn-primary" style={{padding:'4px 8px', fontSize:'12px', background:'var(--risk-high)', border:'none', color:'white'}} onClick={() => fetch(`${API_URL}/transactions/${tx.id}/decision`, {method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({decision:'BLOCK'})}).then(refresh)}>Block</button>
                    </div>
                  </td>
               </tr>
             )}/>} />
             <Route path="/resolved" element={<TablePage title="Successfully Resolved (Safe)" description="Historical log of natively permitted connections securely matching low-risk models without flagged anomalies." endpoint="/resolved" columns={['Tx ID', 'User', 'Amount', 'Location', 'Risk']} renderRow={(tx) => (
               <tr key={tx.id}><td style={{fontFamily:'monospace'}}>#{tx.id}</td><td>{tx.user_id}</td><td>${tx.amount.toLocaleString()}</td><td>{tx.location}</td><td><span className={`badge ${getBadgeStyle(tx.decision)}`}>{tx.decision}</span></td></tr>
             )}/>} />
             <Route path="/cases" element={<TablePage title="Intelligent Case Reports" description="High-priority escalations automatically spawned by the AI Pipeline in response to severe structural matrix violations." endpoint="/cases" columns={['Case ID', 'Tx Ref', 'Status', 'AI Notes', 'Created At', 'Action']} renderRow={(c, refresh) => (
               <tr key={c.id}>
                  <td>#{c.id}</td><td>Tx #{c.transaction_id}</td><td><span className={c.status === 'CLOSED' ? "badge badge-low" : "badge badge-high"}>{c.status}</span></td><td>{c.notes}</td><td style={{color:'var(--text-secondary)'}}>{new Date(c.created_at).toLocaleString()}</td>
                  <td>
                    {c.status !== 'CLOSED' && <button className="btn-secondary" style={{padding:'4px 8px', fontSize:'12px'}} onClick={() => fetch(`${API_URL}/cases/${c.id}/status`, {method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({status:'CLOSED'})}).then(refresh)}>Close Case</button>}
                  </td>
               </tr>
             )}/>} />
             <Route path="/audit" element={<SystemAuditTrail />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default function App() { return <Router><Routes><Route path="/" element={<LandingPage />} /><Route path="/app/*" element={<MainLayout />} /></Routes></Router>; }
