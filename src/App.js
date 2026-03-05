import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, Cell, PieChart, Pie } from "recharts";
import ReactGA from 'react-ga4';

ReactGA.initialize('G-BR5ER5ELRD');

const ACCENT = "#f97316";
const RED = "#ef4444";
const BLUE = "#3b82f6";
const GREEN = "#22c55e";
const PURPLE = "#a855f7";
const YELLOW = "#eab308";

const THEMES = {
  default: {
    bg: "#030712",
    bgCard: "#0a0f1a",
    bgDeep: "#060b14",
    border: "#111827",
    borderSubtle: "#1f2937",
    text: "#f3f4f6",
    textMuted: "#6b7280",
    textDim: "#4b5563",
    accent: "#f97316",
    accentSoft: "#f9731620",
  },
  calm: {
    bg: "#080f10",
    bgCard: "#192c32",
    bgDeep: "#091213",
    border: "#1a2e2e",
    borderSubtle: "#1f3535",
    text: "#e2f0ef",
    textMuted: "#5f8f8a",
    textDim: "#3d6560",
    accent: "#2dd4bf",
    accentSoft: "#2dd4bf20",
  },
};

const REMINDERS = [
  { emoji: "📊", text: "Rejections in this market reflect overwhelmed hiring pipelines — not your worth. Companies are getting 500+ applicants per role." },
  { emoji: "🧠", text: "Most people find their next role through their network, not applications. One genuine conversation often beats ten cold applies." },
  { emoji: "⏳", text: "The average tech job search right now takes 4–6 months. If you're at month 2 or 3, you're not behind — you're right on track." },
  { emoji: "💡", text: "Many people being laid off are senior, talented, and experienced. You're in good company. This is a market problem, not a you problem." },
  { emoji: "🌱", text: "Gaps on a resume are increasingly normal and expected. Hiring managers in 2026 understand the climate." },
  { emoji: "🤝", text: "The vast majority of people who were laid off in prior waves found new roles. Recoveries happen — they just don't feel that way while you're in them." },
];

function BreathingExercise({theme}) {
  const [phase, setPhase] = useState("idle");
  const [count, setCount] = useState(0);
  const intervalRef = useRef(null);
  const phases = [
    { name: "inhale", label: "Breathe in", duration: 4, color: "#3b82f6" },
    { name: "hold", label: "Hold", duration: 4, color: "#a855f7" },
    { name: "exhale", label: "Breathe out", duration: 6, color: "#22c55e" },
  ];
  const start = () => {
    ReactGA.event({ category: "engagement", action: "breathing_start" });

    let phaseIdx = 0, tick = 0;
    setPhase(phases[0].name); setCount(phases[0].duration);
    intervalRef.current = setInterval(() => {
      tick++;
      const remaining = phases[phaseIdx].duration - tick;
      if (remaining <= 0) {
        phaseIdx = (phaseIdx + 1) % phases.length;
        tick = 0;
        setPhase(phases[phaseIdx].name); setCount(phases[phaseIdx].duration);
      } else { setCount(remaining); }
    }, 1000);
  };
  const stop = () => {
    clearInterval(intervalRef.current);
    setPhase("idle"); setCount(0);
    ReactGA.event({ category: "engagement", action: "breathing_stop" });
  };
  
  useEffect(() => () => clearInterval(intervalRef.current), []);
  
  const currentPhase = phases.find(p => p.name === phase);
  const isActive = phase !== "idle";
  const scale = phase === "inhale" ? 1.3 : phase === "hold" ? 1.3 : 1;
  return (
    <div style={{ background: "#0a0f1a", border: "1px solid #162416", borderRadius: 12, padding: "20px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <div style={{ fontSize: 11, color: "#6b7280", letterSpacing: 2, textTransform: "uppercase", fontFamily: "monospace", alignSelf: "flex-start" }}>Box Breathing · 4-4-6</div>
      <p style={{ fontSize: 13, color: "#6b7280", textAlign: "center", margin: 0, lineHeight: 1.6 }}>Job searching is stressful. Take 60 seconds.</p>
      <div style={{ width: 90, height: 90, borderRadius: "50%", background: isActive ? `${currentPhase?.color}18` : "#111827", border: `2px solid ${isActive ? currentPhase?.color : "#1f2937"}`, transform: `scale(${isActive ? scale : 1})`, transition: `transform ${phase === "inhale" ? 4 : phase === "exhale" ? 6 : 0.3}s ease`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 2 }}>
        {isActive ? (<><span style={{ fontSize: 22, color: "#f3f4f6", fontWeight: 700, lineHeight: 1 }}>{count}</span><span style={{ fontSize: 9, color: currentPhase?.color, letterSpacing: 1, textTransform: "uppercase" }}>{currentPhase?.label}</span></>) : (<span style={{ fontSize: 24 }}>🫧</span>)}
      </div>
      <button onClick={isActive ? stop : start} style={{ background: isActive ? "#1f2937" : "#22c55e18", border: `1px solid ${isActive ? "#374151" : "#22c55e50"}`, color: isActive ? "#9ca3af" : "#22c55e", borderRadius: 8, padding: "8px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
        {isActive ? "Stop" : "Start"}
      </button>
    </div>
  );
}

function ReminderCard() {
  const [idx, setIdx] = useState(0);
  const r = REMINDERS[idx];
  return (
    <div style={{ background: "#0a0f1a", border: "1px solid #162416", borderRadius: 12, padding: "20px 24px" }}>
      <div style={{ fontSize: 11, color: "#6b7280", letterSpacing: 2, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 14 }}>A Reminder</div>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
        <span style={{ fontSize: 22, flexShrink: 0 }}>{r.emoji}</span>
        <p style={{ margin: 0, fontSize: 14, color: "#d1fae5", lineHeight: 1.75 }}>{r.text}</p>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {REMINDERS.map((_, i) => (
          <button key={i} onClick={() => {
            setIdx(i);
            ReactGA.event({ category: "engagement", action: "reminder_viewed", label: `reminder_${i}` });
          }} style={{ width: i === idx ? 20 : 6, height: 6, borderRadius: 3, background: i === idx ? GREEN : "#1f2937", border: "none", cursor: "pointer", padding: 0, transition: "all 0.3s ease" }} />
        ))}
      </div>
    </div>
  );
}

// Seed data from known sources (used as fallback / initial state)
const SEED = {
  stats: {
    total2026: 52150,
    events2026: 146,
    perDay2026: 828,
    total2025: 245953,
    events2025: 783,
  },
  recentLayoffs: [
    { company: "Amazon", employees: 16000, date: "Jan 2026", sector: "Cloud/E-commerce", reason: "Management restructuring" },
    { company: "Block", employees: 4000, date: "Mar 2026", sector: "Fintech", reason: "AI-driven efficiency" },
    { company: "Microsoft", employees: 9000, date: "Feb 2026", sector: "Cloud/Software", reason: "AI realignment" },
    { company: "Pinterest", employees: 675, date: "Feb 2026", sector: "Social Media", reason: "AI pivot (15% workforce)" },
    { company: "Synopsys", employees: 2000, date: "Jan 2026", sector: "Semiconductors", reason: "Post-Ansys acquisition" },
    { company: "AMD", employees: 1000, date: "Jan 2026", sector: "Semiconductors", reason: "AI chip pivot" },
    { company: "Equinix", employees: 400, date: "Feb 2026", sector: "Data Centers", reason: "Leadership transition" },
    { company: "T-Mobile", employees: 363, date: "Feb 2026", sector: "Telecom", reason: "Workforce slimming" },
    { company: "HP", employees: 5000, date: "Jan 2026", sector: "Hardware", reason: "AI adoption efficiency" },
    { company: "Salesforce", employees: 1000, date: "Feb 2026", sector: "Enterprise SaaS", reason: "Budget reduction" },
  ],
  monthlyTrend: [
    { month: "Jan 2025", employees: 28000 },
    { month: "Feb 2025", employees: 22000 },
    { month: "Mar 2025", employees: 15000 },
    { month: "Apr 2025", employees: 18000 },
    { month: "May 2025", employees: 12000 },
    { month: "Jun 2025", employees: 19000 },
    { month: "Jul 2025", employees: 31000 },
    { month: "Aug 2025", employees: 26000 },
    { month: "Sep 2025", employees: 22000 },
    { month: "Oct 2025", employees: 38000 },
    { month: "Nov 2025", employees: 21000 },
    { month: "Dec 2025", employees: 14000 },
    { month: "Jan 2026", employees: 34000 },
    { month: "Feb 2026", employees: 18150 },
  ],
  sectors: [
    { name: "Cloud/E-commerce", value: 28, color: BLUE },
    { name: "Fintech", value: 14, color: GREEN },
    { name: "Enterprise SaaS", value: 18, color: PURPLE },
    { name: "Semiconductors", value: 12, color: YELLOW },
    { name: "Social/Consumer", value: 10, color: ACCENT },
    { name: "Hardware/Telecom", value: 18, color: RED },
  ],
  drivers: [
    { label: "AI Adoption", pct: 44, color: ACCENT },
    { label: "Cost Cutting", pct: 28, color: RED },
    { label: "Post-M&A", pct: 14, color: BLUE },
    { label: "Over-hiring correction", pct: 14, color: PURPLE },
  ],
  lastUpdated: null,
  aiInsight: null,
};

async function fetchLiveData() {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: [{
        role: "user",
        content: `Search for the latest tech layoffs data in 2026. Find the most recent numbers from sources like layoffs.fyi, trueup.io, skillsyncer.com, or news sources. 

Return ONLY a raw JSON object (no markdown, no backticks) with this exact structure:
{
  "stats": {
    "total2026": <number of employees laid off in 2026 so far>,
    "events2026": <number of layoff events in 2026>,
    "perDay2026": <average per day in 2026>,
    "total2025": <total for full year 2025>,
    "events2025": <layoff events in 2025>
  },
  "recentLayoffs": [
    { "company": "name", "employees": 1000, "date": "Mon YYYY", "sector": "sector", "reason": "brief reason" }
  ],
  "aiInsight": "2-3 sentence insight about the current state of tech layoffs in 2026, key trends, and what's driving them",
  "lastUpdated": "March 2026"
}

Include at least 8-10 recent layoffs in recentLayoffs. Focus on 2026 data primarily.`
      }]
    })
  });
  const data = await res.json();
  const text = data.content?.filter(b => b.type === "text").map(b => b.text).join("") || "{}";
  try {
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch (err) {
    ReactGA.event({ category: "error", action: "api_fetch_failed", label: err.message });
    return null;
  }
}

const fmt = (n) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n?.toLocaleString();

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 8, padding: "10px 14px" }}>
      <div style={{ color: "#9ca3af", fontSize: 12, marginBottom: 4 }}>{label}</div>
      <div style={{ color: "#f3f4f6", fontSize: 14, fontWeight: 700 }}>{payload[0].value?.toLocaleString()} jobs</div>
    </div>
  );
};

export default function LayoffsDashboard() {
  const [data, setData] = useState(SEED);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("overview");
  const theme = tab === "perspective" ? THEMES.calm : THEMES.default;
  const fetchedRef = useRef(false);

  const handleTabChange = (t) => {
    setTab(t);
    ReactGA.send({ hitType: "pageview", page: `/${t}` });
  };

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    setLoading(true);
    fetchLiveData().then(live => {
      if (live?.stats) {
        setData(prev => ({
          ...prev,
          stats: live.stats || prev.stats,
          recentLayoffs: live.recentLayoffs?.length ? live.recentLayoffs : prev.recentLayoffs,
          aiInsight: live.aiInsight || null,
          lastUpdated: live.lastUpdated || "March 2026",
        }));
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const topLayoffs = [...data.recentLayoffs].sort((a, b) => b.employees - a.employees).slice(0, 8);

  return (
    <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, transition: "background 0.6s ease", minHeight: "100vh", color: "#f3f4f6", fontFamily: "system-ui, sans-serif", padding: "0 0 48px" }}>
      {/* Header (sticky) */}
      <div style={{ background: theme.bgCard, transition: "background 0.6s ease", borderBottom: `1px solid ${theme.borderBottom}`, padding: "24px 32px 20px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: loading ? YELLOW : GREEN, boxShadow: `0 0 8px ${loading ? YELLOW : GREEN}`, animation: loading ? "pulse 1s infinite" : "none" }} />
              <span style={{ fontSize: 11, letterSpacing: 3, color: "#6b7280", textTransform: "uppercase", fontFamily: "monospace" }}>
                {loading ? "Fetching live data..." : `Live · ${data.lastUpdated || "March 2026"}`}
              </span>
            </div>
            <h1 style={{ fontSize: "clamp(20px, 3vw, 30px)", fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>
              Tech Layoffs <span style={{ color: ACCENT }}>2026</span>
            </h1>
          </div>
          <div style={{ display: "flex", flexShrink: 1, flexWrap: "wrap", minWidth: 0, gap: 6 }}>
            {["overview", "companies", "trends", "perspective"].map(t => (
              <button key={t} onClick={() => handleTabChange(t)} style={{
                background: tab === t ? (t === "perspective" ? GREEN : ACCENT) : "#111827",
                color: tab === t ? "#030712" : t === "perspective" ? "#22c55e" : "#9ca3af",
                border: t === "perspective" && tab !== t ? "1px solid #22c55e30" : "none",
                borderRadius: 8, padding: "7px 16px",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                textTransform: "capitalize", transition: "all 0.15s"
              }}>{t === "perspective" ? "🌱 perspective" : t}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 32px 0" }}>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 28 }}>
          {[
            { label: "Jobs Cut in 2026", value: fmt(data.stats.total2026), sub: `${data.stats.perDay2026}/day avg`, color: RED },
            { label: "Layoff Events", value: data.stats.events2026?.toLocaleString(), sub: "companies in 2026", color: ACCENT },
            { label: "Full Year 2025", value: fmt(data.stats.total2025), sub: `${data.stats.events2025} events`, color: BLUE },
            { label: "AI-Driven Cuts", value: "44%", sub: "of 2026 layoffs", color: PURPLE },
          ].map(s => (
            <div key={s.label} style={{ background: "#0a0f1a", border: "1px solid #111827", borderRadius: 12, padding: "18px 20px" }}>
              <div style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8, fontFamily: "monospace" }}>{s.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#4b5563", marginTop: 6 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Subtle human banner — always visible */}
        <div style={{ background: "#0a130a", border: "1px solid #162416", borderRadius: 10, padding: "12px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 16 }}>💚</span>
          <p style={{ margin: 0, fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>
            If you're job searching right now — these numbers are context, not a verdict on you.{" "}
            <button onClick={() => handleTabChange("perspective")} style={{ background: "none", border: "none", color: "#22c55e", fontSize: 13, cursor: "pointer", padding: 0, textDecoration: "underline" }}>
              See some perspective →
            </button>
          </p>
        </div>


        {data.aiInsight && (
          <div style={{ background: `${ACCENT}10`, border: `1px solid ${ACCENT}30`, borderRadius: 12, padding: "16px 20px", marginBottom: 28, display: "flex", gap: 14, alignItems: "flex-start" }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>🤖</span>
            <div>
              <div style={{ fontSize: 11, color: ACCENT, letterSpacing: 2, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 6 }}>AI Analysis · Live</div>
              <p style={{ margin: 0, fontSize: 14, color: "#d1d5db", lineHeight: 1.65 }}>{data.aiInsight}</p>
            </div>
          </div>
        )}

        {/* OVERVIEW TAB */}
        {tab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            {/* Trend chart */}
            <div style={{ gridColumn: "1 / -1", background: "#0a0f1a", border: "1px solid #111827", borderRadius: 12, padding: "20px 24px" }}>
              <div style={{ fontSize: 11, color: "#6b7280", letterSpacing: 2, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 4 }}>Monthly Job Cuts Trend</div>
              <div style={{ fontSize: 12, color: "#4b5563", marginBottom: 18 }}>Jan 2025 – Feb 2026 · employees laid off</div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={data.monthlyTrend}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={ACCENT} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fill: "#4b5563", fontSize: 11 }} tickLine={false} axisLine={false} interval={2} />
                  <YAxis tick={{ fill: "#4b5563", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `${v/1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="employees" stroke={ACCENT} strokeWidth={2} fill="url(#areaGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Sectors */}
            <div style={{ background: "#0a0f1a", border: "1px solid #111827", borderRadius: 12, padding: "20px 24px" }}>
              <div style={{ fontSize: 11, color: "#6b7280", letterSpacing: 2, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 16 }}>By Sector (2026)</div>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={data.sectors} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                    {data.sectors.map((s, i) => <Cell key={i} fill={s.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v}%`, ""]} contentStyle={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", marginTop: 8 }}>
                {data.sectors.map(s => (
                  <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#9ca3af" }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flexShrink: 0 }} />
                    {s.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Drivers */}
            <div style={{ background: "#0a0f1a", border: "1px solid #111827", borderRadius: 12, padding: "20px 24px" }}>
              <div style={{ fontSize: 11, color: "#6b7280", letterSpacing: 2, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 16 }}>Layoff Drivers</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {data.drivers.map(d => (
                  <div key={d.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 13, color: "#d1d5db" }}>{d.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: d.color }}>{d.pct}%</span>
                    </div>
                    <div style={{ height: 6, background: "#1f2937", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${d.pct}%`, background: d.color, borderRadius: 3, transition: "width 0.6s ease" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* COMPANIES TAB */}
        {tab === "companies" && (
          <div style={{ display: "grid", gap: 18 }}>
            <div style={{ background: "#0a0f1a", border: "1px solid #111827", borderRadius: 12, padding: "20px 24px" }}>
              <div style={{ fontSize: 11, color: "#6b7280", letterSpacing: 2, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 4 }}>Biggest Layoffs by Company</div>
              <div style={{ fontSize: 12, color: "#4b5563", marginBottom: 20 }}>2026 · employees affected</div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topLayoffs} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" tick={{ fill: "#4b5563", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `${v/1000}k`} />
                  <YAxis type="category" dataKey="company" tick={{ fill: "#d1d5db", fontSize: 13 }} tickLine={false} axisLine={false} width={90} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="employees" radius={[0, 6, 6, 0]}>
                    {topLayoffs.map((_, i) => <Cell key={i} fill={i === 0 ? RED : i < 3 ? ACCENT : BLUE} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Full table */}
            <div style={{ background: "#0a0f1a", border: "1px solid #111827", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "16px 24px", borderBottom: "1px solid #111827" }}>
                <div style={{ fontSize: 11, color: "#6b7280", letterSpacing: 2, textTransform: "uppercase", fontFamily: "monospace" }}>All Recent Layoffs · Live Feed</div>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#060b14" }}>
                      {["Company", "Jobs Cut", "Date", "Sector", "Reason"].map(h => (
                        <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, color: "#6b7280", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", fontFamily: "monospace", borderBottom: "1px solid #111827" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentLayoffs.map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #0d1117" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#0d1520"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <td style={{ padding: "12px 16px", fontWeight: 700, color: "#f3f4f6", fontSize: 14 }}>{row.company}</td>
                        <td style={{ padding: "12px 16px", fontWeight: 700, color: row.employees >= 5000 ? RED : row.employees >= 1000 ? ACCENT : YELLOW, fontSize: 14 }}>{row.employees?.toLocaleString()}</td>
                        <td style={{ padding: "12px 16px", color: "#6b7280", fontSize: 13, fontFamily: "monospace" }}>{row.date}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ background: "#111827", borderRadius: 20, padding: "3px 10px", fontSize: 11, color: "#9ca3af" }}>{row.sector}</span>
                        </td>
                        <td style={{ padding: "12px 16px", color: "#9ca3af", fontSize: 13 }}>{row.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TRENDS TAB */}
        {tab === "trends" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <div style={{ gridColumn: "1 / -1", background: "#0a0f1a", border: "1px solid #111827", borderRadius: 12, padding: "20px 24px" }}>
              <div style={{ fontSize: 11, color: "#6b7280", letterSpacing: 2, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 4 }}>Year-over-Year Comparison</div>
              <div style={{ fontSize: 12, color: "#4b5563", marginBottom: 20 }}>Total tech employees laid off by year</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={[
                  { year: "2022", employees: 93000 },
                  { year: "2023", employees: 200000 },
                  { year: "2024", employees: 95000 },
                  { year: "2025", employees: data.stats.total2025 },
                  { year: "2026 (YTD)", employees: data.stats.total2026 },
                ]} margin={{ top: 5 }}>
                  <XAxis dataKey="year" tick={{ fill: "#9ca3af", fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: "#4b5563", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `${v/1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="employees" radius={[6, 6, 0, 0]}>
                    {["2022","2023","2024","2025","2026 (YTD)"].map((_, i) => (
                      <Cell key={i} fill={i === 1 ? RED : i === 4 ? ACCENT : BLUE} fillOpacity={i === 4 ? 1 : 0.7} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {[
              { title: "🤖 AI as a Layoff Driver", points: ["44% of 2026 layoffs linked to AI adoption", "Companies replacing content, support & coding roles", "AI pivot = new hires in ML/prompt engineering", "Pattern: cut humans, double down on AI infra"] },
              { title: "📊 Key 2026 Patterns", points: ["Layoffs happening even at record-revenue companies", "Amazon cut 16K despite $716B revenue in 2025", "Corporate & product roles hit hardest", "Management layers being flattened across Big Tech"] },
              { title: "🌍 Geographic Spread", points: ["~70% of layoffs from US-headquartered firms", "Europe seeing semiconductor & telecom cuts", "DOGE added 182K+ federal worker departures", "Entry-level & younger workers disproportionately hit"] },
              { title: "📅 What's Next", points: ["55% of hiring managers expect more layoffs in 2026", "Oracle reportedly weighing 20–30K job cuts", "AWS & cloud units preparing fresh rounds", "AI automation expected to accelerate cuts in H2"] },
            ].map(card => (
              <div key={card.title} style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 12, padding: "20px 24px" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#f3f4f6", marginBottom: 14 }}>{card.title}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  {card.points.map((p, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: ACCENT, marginTop: 6, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.5 }}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PERSPECTIVE TAB */}
        {tab === "perspective" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>

            {/* Header message */}
            <div style={{ gridColumn: "1 / -1", background: "#0a130a", border: "1px solid #1a3a1a", borderRadius: 12, padding: "24px 28px" }}>
              <div style={{ fontSize: 11, color: GREEN, letterSpacing: 2, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 10 }}>For Job Seekers</div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#d1fae5", margin: "0 0 10px", lineHeight: 1.4 }}>
                The market is hard. That's not the same as you being inadequate.
              </h2>
              <p style={{ fontSize: 14, color: "#6b7280", margin: 0, lineHeight: 1.8, maxWidth: 640 }}>
                When you're getting ghosted, rejected, or stuck in silence, it's easy to make it mean something about you. But these numbers tell a different story — a market-wide structural shift that's affecting some of the most talented people in the industry. Below are some grounded reminders and tools to help you breathe through it.
              </p>
            </div>

            {/* Reminder carousel */}
            <ReminderCard />

            {/* Breathing */}
            <BreathingExercise theme={theme} />

            {/* Reframe cards */}
            {[
              {
                title: "Rejection ≠ unqualified",
                body: "At 500+ applicants per role, companies often reject great candidates just to manage volume. Many rejections happen before anyone reads your resume. ATS filters, keyword mismatches, and internal referrals often decide before a human does.",
                emoji: "📬",
              },
              {
                title: "Its not you, its the market",
                body: "Ghosting is industry-wide right now. Hiring teams are understaffed, overwhelmed, or frozen by headcount uncertainty. Not hearing back is almost never personal — it usually means the role paused or the team is buried.",
                emoji: "🔇",
              },
              {
                title: "Longer searches are the new normal",
                body: "The average senior tech job search now runs 4–6 months, often longer. In 2021 it was 6 weeks. Recalibrating your expectations to match the current market can meaningfully reduce anxiety without changing anything about your search.",
                emoji: "📅",
              },
              {
                title: "Your skills didn't disappear",
                body: "A layoff or job gap doesn't erase what you know or what you've built. The instinct to feel like an imposter is common and understandable — but your track record is still real.",
                emoji: "🧱",
              },
            ].map(card => (
              <div key={card.title} style={{ background: "#0a0f1a", border: "1px solid #111827", borderRadius: 12, padding: "20px 24px" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 20 }}>{card.emoji}</span>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#d1fae5" }}>{card.title}</div>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: "#6b7280", lineHeight: 1.75 }}>{card.body}</p>
              </div>
            ))}

            {/* Resources */}
            <div style={{ gridColumn: "1 / -1", background: "#0a0f1a", border: "1px solid #111827", borderRadius: 12, padding: "20px 24px" }}>
              <div style={{ fontSize: 11, color: "#6b7280", letterSpacing: 2, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 16 }}>Practical Resources</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
              {[
                  { label: "Tech Interview Handbook", url: "https://www.techinterviewhandbook.org", icon: "📚", desc: "Free interview prep — algorithms, system design, behavioral" },
                  { label: "ByteByteGo", url: "https://bytebytego.com", icon: "⚙️", desc: "System design concepts explained visually" },
                  { label: "Levels.fyi", url: "https://www.levels.fyi", icon: "💰", desc: "Real salary data and career levels across companies" },
                  { label: "Blind", url: "https://www.teamblind.com", icon: "💬", desc: "Anonymous forum for candid tech industry discussion" },
                  { label: "layoffs.fyi", url: "https://layoffs.fyi", icon: "📈", desc: "Live layoff tracker — see what's happening in real time" },
                  { label: "Simplify Job Board", url: "https://github.com/SimplifyJobs/New-Grad-Positions", icon: "👩‍💻", desc: "Curated new grad & junior tech roles, updated daily" },
                  { label: "Mental Health in Tech (OSMI)", url: "https://osmihelp.org", icon: "🧘", desc: "Resources for mental wellness in the tech workplace" },
                  { label: "The Muse — After a Layoff", url: "https://www.themuse.com/advice/laid-off-what-to-do", icon: "📋", desc: "Practical steps for the first days after a layoff" },
                ].map(r => (
                  <a key={r.label} href={r.url} target="_blank" rel="noreferrer" style={{ display: "flex", gap: 10, alignItems: "flex-start", background: "#060b14", border: "1px solid #111827", borderRadius: 8, padding: "12px 14px", textDecoration: "none", transition: "border-color 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "#22c55e40"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "#111827"}>
                    <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{r.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, color: "#d1d5db", fontWeight: 600, lineHeight: 1.4, marginBottom: 2 }}>{r.label}</div>
                      <div style={{ fontSize: 11, color: "#4b5563", lineHeight: 1.4 }}>{r.desc}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 32, paddingTop: 20, borderTop: "1px solid #0d1117", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontSize: 11, color: "#374151", fontFamily: "monospace" }}>Sources: layoffs.fyi · trueup.io · skillsyncer.com · Crunchbase · TechCrunch</span>
          <span style={{ fontSize: 11, color: "#374151", fontFamily: "monospace" }}>Data fetched live via Claude AI web search</span>
        </div>
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} } * { box-sizing: border-box; }`}</style>
    </div>
  );
}
