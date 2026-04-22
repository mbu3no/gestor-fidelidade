import { useState, useEffect, useMemo, useCallback, createContext, useContext } from "react";
import {
  Trash2,
  PlusCircle,
  Fuel,
  Table2,
  Dices,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Sun,
  Moon,
  Gauge,
  Droplets,
} from "lucide-react";

/* ── helpers ─────────────────────────────────────────────────────── */
const formatBRL = (v) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

const pct = (v) => `${parseFloat(v).toFixed(2)}%`;

const uid = () => crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

/* ── localStorage ────────────────────────────────────────────────── */
const STORAGE_KEYS = {
  roulettePrizes: "gfm_roulette_prizes",
  rouletteMargin: "gfm_roulette_margin",
  rouletteTicket: "gfm_roulette_ticket",
  catalogPrizes: "gfm_catalog_prizes_v2",
  catalogProfit: "gfm_catalog_profit",
  activeTab: "gfm_active_tab",
  theme: "gfm_theme",
};

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* ── theme tokens ────────────────────────────────────────────────── */
const themes = {
  dark: {
    mode: "dark",
    bg: "#080b11",
    bgGradient: "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(45,212,191,0.06) 0%, transparent 60%), #080b11",
    card: "rgba(13,19,30,0.85)",
    cardBorder: "rgba(45,212,191,0.08)",
    cardHover: "rgba(45,212,191,0.03)",
    inputBg: "rgba(6,10,18,0.7)",
    inputBorder: "rgba(45,212,191,0.15)",
    inputBorderFocus: "rgba(45,212,191,0.5)",
    inputText: "#e0f2f1",
    tableHeaderBg: "rgba(6,10,18,0.6)",
    rowBg: "rgba(6,10,18,0.35)",
    rowBorder: "rgba(45,212,191,0.05)",
    resultCardBg: "rgba(6,10,18,0.5)",
    textPrimary: "#e0f2f1",
    textSecondary: "#80cbc4",
    textMuted: "#4db6ac",
    textDim: "#5eead4",
    accent: "#2dd4bf",
    accentLight: "#5eead4",
    accentBg: "rgba(45,212,191,0.08)",
    accentBorder: "rgba(45,212,191,0.2)",
    accentGradient: "linear-gradient(135deg, #0d9488, #2dd4bf)",
    tabActiveBg: "linear-gradient(135deg, rgba(45,212,191,0.12), rgba(20,184,166,0.06))",
    tabActiveBorder: "1px solid rgba(45,212,191,0.35)",
    tabInactiveBorder: "1px solid rgba(45,212,191,0.08)",
    green: "#10b981",
    greenLight: "#34d399",
    greenBg: "rgba(16,185,129,0.1)",
    greenBorder: "rgba(16,185,129,0.25)",
    greenBadgeBg: "rgba(16,185,129,0.15)",
    red: "#ef4444",
    redLight: "#f87171",
    redBg: "rgba(239,68,68,0.1)",
    redBgSubtle: "rgba(239,68,68,0.04)",
    redBorder: "rgba(239,68,68,0.3)",
    redBorderSubtle: "rgba(239,68,68,0.15)",
    redBtnBg: "rgba(239,68,68,0.12)",
    redBtnBorder: "rgba(239,68,68,0.25)",
    redBadgeBg: "rgba(239,68,68,0.15)",
    yellow: "#fbbf24",
    yellowBg: "rgba(251,191,36,0.06)",
    yellowBorder: "rgba(251,191,36,0.2)",
    viableBg: "rgba(16,185,129,0.06)",
    viableBorder: "rgba(16,185,129,0.2)",
    lossBg: "rgba(239,68,68,0.06)",
    lossBorder: "rgba(239,68,68,0.2)",
    toggleBg: "rgba(13,19,30,0.9)",
    toggleBorder: "rgba(45,212,191,0.15)",
    toggleIcon: "#2dd4bf",
    divider: "rgba(45,212,191,0.06)",
  },
  light: {
    mode: "light",
    bg: "#f8fafc",
    bgGradient: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(100,116,139,0.05) 0%, transparent 50%), #f8fafc",
    card: "rgba(255,255,255,0.95)",
    cardBorder: "rgba(148,163,184,0.2)",
    cardHover: "rgba(100,116,139,0.04)",
    inputBg: "#ffffff",
    inputBorder: "rgba(148,163,184,0.3)",
    inputBorderFocus: "rgba(45,212,191,0.5)",
    inputText: "#1e293b",
    tableHeaderBg: "rgba(241,245,249,0.8)",
    rowBg: "rgba(248,250,252,0.8)",
    rowBorder: "rgba(148,163,184,0.12)",
    resultCardBg: "rgba(241,245,249,0.6)",
    textPrimary: "#0f172a",
    textSecondary: "#334155",
    textMuted: "#64748b",
    textDim: "#64748b",
    accent: "#0d9488",
    accentLight: "#0d9488",
    accentBg: "rgba(13,148,136,0.06)",
    accentBorder: "rgba(13,148,136,0.15)",
    accentGradient: "linear-gradient(135deg, #0d9488, #14b8a6)",
    tabActiveBg: "linear-gradient(135deg, rgba(13,148,136,0.08), rgba(20,184,166,0.04))",
    tabActiveBorder: "1px solid rgba(13,148,136,0.25)",
    tabInactiveBorder: "1px solid rgba(148,163,184,0.2)",
    green: "#059669",
    greenLight: "#059669",
    greenBg: "rgba(5,150,105,0.06)",
    greenBorder: "rgba(5,150,105,0.2)",
    greenBadgeBg: "rgba(5,150,105,0.1)",
    red: "#dc2626",
    redLight: "#dc2626",
    redBg: "rgba(220,38,38,0.06)",
    redBgSubtle: "rgba(220,38,38,0.03)",
    redBorder: "rgba(220,38,38,0.2)",
    redBorderSubtle: "rgba(220,38,38,0.1)",
    redBtnBg: "rgba(220,38,38,0.08)",
    redBtnBorder: "rgba(220,38,38,0.2)",
    redBadgeBg: "rgba(220,38,38,0.08)",
    yellow: "#b45309",
    yellowBg: "rgba(180,83,9,0.05)",
    yellowBorder: "rgba(180,83,9,0.15)",
    viableBg: "rgba(5,150,105,0.05)",
    viableBorder: "rgba(5,150,105,0.15)",
    lossBg: "rgba(220,38,38,0.05)",
    lossBorder: "rgba(220,38,38,0.15)",
    toggleBg: "#ffffff",
    toggleBorder: "rgba(148,163,184,0.25)",
    toggleIcon: "#0f172a",
    divider: "rgba(148,163,184,0.12)",
  },
};

const ThemeContext = createContext(themes.dark);
function useTheme() {
  return useContext(ThemeContext);
}

/* ── shared UI pieces ────────────────────────────────────────────── */
function TabButton({ active, onClick, icon, label }) {
  const t = useTheme();
  return (
    <button
      onClick={onClick}
      className="flex-1 sm:flex-none items-center justify-center gap-2 px-3 py-3 sm:px-5 md:px-7 md:py-3.5 text-[11px] md:text-xs font-bold uppercase transition-all duration-300 cursor-pointer flex"
      style={{
        letterSpacing: "0.12em",
        borderRadius: "14px",
        background: active ? t.tabActiveBg : "transparent",
        border: active ? t.tabActiveBorder : t.tabInactiveBorder,
        color: active ? t.accentLight : t.textDim,
        fontFamily: "'Outfit', sans-serif",
        fontWeight: active ? 700 : 600,
      }}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">{label.split(" ")[0]}</span>
    </button>
  );
}

function NumericInput({ label, value, onChange, placeholder, min = 0, step = "0.01" }) {
  const t = useTheme();
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          className="text-[11px] md:text-xs font-semibold uppercase"
          style={{ color: t.textMuted, letterSpacing: "0.1em", fontFamily: "'Outfit', sans-serif" }}
        >
          {label}
        </label>
      )}
      <input
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full py-2.5 px-3.5 text-sm md:text-base font-medium outline-none transition-all duration-200"
        style={{
          background: t.inputBg,
          border: `1.5px solid ${t.inputBorder}`,
          color: t.inputText,
          borderRadius: "10px",
          fontFamily: "'JetBrains Mono', monospace",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = t.inputBorderFocus;
          e.target.style.boxShadow = `0 0 0 3px ${t.inputBorderFocus.replace("0.5", "0.1")}`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = t.inputBorder;
          e.target.style.boxShadow = "none";
        }}
      />
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder }) {
  const t = useTheme();
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          className="text-[11px] md:text-xs font-semibold uppercase"
          style={{ color: t.textMuted, letterSpacing: "0.1em", fontFamily: "'Outfit', sans-serif" }}
        >
          {label}
        </label>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full py-2.5 px-3.5 text-sm md:text-base font-medium outline-none transition-all duration-200"
        style={{
          background: t.inputBg,
          border: `1.5px solid ${t.inputBorder}`,
          color: t.inputText,
          borderRadius: "10px",
          fontFamily: "'Outfit', sans-serif",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = t.inputBorderFocus;
          e.target.style.boxShadow = `0 0 0 3px ${t.inputBorderFocus.replace("0.5", "0.1")}`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = t.inputBorder;
          e.target.style.boxShadow = "none";
        }}
      />
    </div>
  );
}

function CardWrapper({ children, className = "", delay = 0 }) {
  const t = useTheme();
  return (
    <div
      className={`animate-fade-up ${className}`}
      style={{
        background: t.card,
        border: `1px solid ${t.cardBorder}`,
        borderRadius: "18px",
        backdropFilter: "blur(24px)",
        animationDelay: `${delay}s`,
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = t.accentBorder;
        e.currentTarget.style.boxShadow = `0 8px 32px ${t.mode === "dark" ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.06)"}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = t.cardBorder;
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ icon, children }) {
  const t = useTheme();
  return (
    <h2
      className="text-sm md:text-base font-bold flex items-center gap-2.5"
      style={{ color: t.textPrimary, fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}
    >
      {icon}
      {children}
    </h2>
  );
}

function AddButton({ onClick }) {
  const t = useTheme();
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold uppercase cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
      style={{
        background: t.accentGradient,
        borderRadius: "10px",
        color: "#fff",
        border: "none",
        letterSpacing: "0.08em",
        fontFamily: "'Outfit', sans-serif",
        boxShadow: `0 2px 12px ${t.mode === "dark" ? "rgba(45,212,191,0.2)" : "rgba(13,148,136,0.15)"}`,
      }}
    >
      <PlusCircle size={14} />
      Adicionar
    </button>
  );
}

function DeleteButton({ onClick, size = "md" }) {
  const t = useTheme();
  const s = size === "sm";
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 ${s ? "w-8 h-8" : "w-9 h-9"}`}
      style={{
        background: t.redBtnBg,
        border: `1px solid ${t.redBtnBorder}`,
        borderRadius: "9px",
      }}
      title="Remover"
    >
      <Trash2 size={s ? 13 : 15} color={t.redLight} />
    </button>
  );
}

function StatusBanner({ type, children }) {
  const t = useTheme();
  const config = {
    error: { bg: t.redBg, border: t.redBorder, color: t.redLight, Icon: AlertTriangle },
    success: { bg: t.greenBg, border: t.greenBorder, color: t.greenLight, Icon: CheckCircle2 },
    warning: { bg: t.yellowBg, border: t.yellowBorder, color: t.yellow, Icon: AlertTriangle },
  }[type];
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 animate-fade-up"
      style={{
        background: config.bg,
        border: `1px solid ${config.border}`,
        borderRadius: "14px",
      }}
    >
      <config.Icon size={18} color={config.color} style={{ flexShrink: 0 }} />
      <span className="text-xs md:text-sm font-semibold" style={{ color: config.color, fontFamily: "'Outfit', sans-serif" }}>
        {children}
      </span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ABA 1 — SIMULADOR DE ROLETA
   ══════════════════════════════════════════════════════════════════ */
function RouletteTab() {
  const t = useTheme();

  const [prizes, setPrizes] = useState(() =>
    loadJSON(STORAGE_KEYS.roulettePrizes, [
      { id: uid(), name: "Brinde pequeno", probability: "60", cost: "2" },
      { id: uid(), name: "Desconto 10%", probability: "25", cost: "8" },
      { id: uid(), name: "Troca de oleo gratis", probability: "10", cost: "40" },
      { id: uid(), name: "Tanque cheio", probability: "5", cost: "250" },
    ])
  );
  const [margin, setMargin] = useState(() => loadJSON(STORAGE_KEYS.rouletteMargin, "18"));
  const [ticket, setTicket] = useState(() => loadJSON(STORAGE_KEYS.rouletteTicket, "100"));

  useEffect(() => saveJSON(STORAGE_KEYS.roulettePrizes, prizes), [prizes]);
  useEffect(() => saveJSON(STORAGE_KEYS.rouletteMargin, margin), [margin]);
  useEffect(() => saveJSON(STORAGE_KEYS.rouletteTicket, ticket), [ticket]);

  const addPrize = () =>
    setPrizes((p) => [...p, { id: uid(), name: "", probability: "", cost: "" }]);
  const removePrize = (id) => setPrizes((p) => p.filter((x) => x.id !== id));
  const updatePrize = useCallback((id, field, value) => {
    setPrizes((p) => p.map((x) => (x.id === id ? { ...x, [field]: value } : x)));
  }, []);

  const totalProb = useMemo(
    () => prizes.reduce((s, p) => s + (parseFloat(p.probability) || 0), 0),
    [prizes]
  );
  const expectedCost = useMemo(
    () => prizes.reduce((s, p) => s + ((parseFloat(p.probability) || 0) / 100) * (parseFloat(p.cost) || 0), 0),
    [prizes]
  );

  const ticketNum = parseFloat(ticket) || 0;
  const marginNum = parseFloat(margin) || 0;
  const revenuePerSpin = ticketNum * (marginNum / 100);
  const profitPerSpin = revenuePerSpin - expectedCost;
  const isViable = profitPerSpin >= 0;
  const probOver = totalProb > 100;
  const probExact = Math.abs(totalProb - 100) < 0.01;

  /* probability bar */
  const probBarPct = Math.min(totalProb, 100);
  const probBarColor = probOver ? t.red : probExact ? t.green : t.yellow;

  return (
    <div className="space-y-5">
      {/* Probability banner */}
      {probOver && <StatusBanner type="error">Probabilidade total excede 100% ({pct(totalProb)}). Ajuste os valores.</StatusBanner>}
      {probExact && <StatusBanner type="success">Probabilidade total em 100%. Roleta calibrada.</StatusBanner>}
      {!probOver && !probExact && <StatusBanner type="warning">Probabilidade total: {pct(totalProb)} -- ainda faltam {pct(100 - totalProb)}.</StatusBanner>}

      {/* Probability progress bar */}
      <div className="animate-fade-up stagger-1">
        <div className="flex items-center justify-between mb-1.5 px-1">
          <span className="text-[10px] font-semibold uppercase" style={{ color: t.textMuted, letterSpacing: "0.1em", fontFamily: "'Outfit', sans-serif" }}>
            Distribuição de probabilidade
          </span>
          <span className="text-xs font-bold" style={{ color: probBarColor, fontFamily: "'JetBrains Mono', monospace" }}>
            {pct(totalProb)}
          </span>
        </div>
        <div style={{ background: t.rowBg, borderRadius: "8px", height: "6px", overflow: "hidden" }}>
          <div
            style={{
              width: `${probBarPct}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${probBarColor}, ${probBarColor}88)`,
              borderRadius: "8px",
              transition: "width 0.5s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s",
            }}
          />
        </div>
      </div>

      {/* Global params */}
      <CardWrapper delay={0.06}>
        <div className="p-5 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NumericInput label="Ticket Mínimo (R$) - Valor mínimo gasto para girar" value={ticket} onChange={setTicket} placeholder="100" />
            <NumericInput label="Margem de Lucro (%) - Margem sobre o litro de combustível" value={margin} onChange={setMargin} placeholder="18" />
          </div>
          {ticketNum > 0 && marginNum > 0 && (
            <div
              className="mt-4 flex items-center gap-2 px-4 py-3"
              style={{
                background: t.accentBg,
                border: `1px solid ${t.accentBorder}`,
                borderRadius: "12px",
              }}
            >
              <Fuel size={16} color={t.accent} />
              <span className="text-xs md:text-sm font-semibold" style={{ color: t.textSecondary, fontFamily: "'Outfit', sans-serif" }}>
                {formatBRL(ticketNum)} × {marginNum}% ={" "}
                <strong style={{ color: t.accent, fontFamily: "'JetBrains Mono', monospace" }}>{formatBRL(revenuePerSpin)}</strong>
                {" "}de lucro bruto por abastecimento
              </span>
            </div>
          )}
        </div>
      </CardWrapper>

      {/* Prize list */}
      <CardWrapper delay={0.1}>
        <div className="p-5 md:p-6">
          <div className="flex items-center justify-between mb-2">
            <SectionTitle icon={<Dices size={18} color={t.accent} />}>Prêmios da Roleta</SectionTitle>
            <AddButton onClick={addPrize} />
          </div>
          <p className="text-sm mb-5" style={{ color: t.textMuted, fontFamily: "'Outfit', sans-serif" }}>
            Cadastre cada prêmio com a chance (%) de ser sorteado e o custo real que o posto paga por ele.
          </p>

          {/* Header row */}
          <div
            className="hidden md:grid gap-3 mb-3 px-3 py-2.5 text-xs font-bold uppercase"
            style={{
              gridTemplateColumns: "2fr 1fr 1fr 42px",
              color: t.textDim,
              background: t.tableHeaderBg,
              borderRadius: "10px",
              letterSpacing: "0.1em",
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            <span>Nome do Prêmio</span>
            <span>Chance de sair (%)</span>
            <span>Quanto você paga (R$)</span>
            <span />
          </div>

          <div className="flex flex-col gap-2.5">
            {prizes.map((p, i) => (
              <div
                key={p.id}
                className={`animate-fade-up p-3.5 md:p-3 transition-colors duration-200`}
                style={{
                  background: t.rowBg,
                  borderRadius: "12px",
                  border: `1px solid ${t.rowBorder}`,
                  animationDelay: `${0.02 * i}s`,
                }}
              >
                {/* Desktop */}
                <div className="hidden md:grid gap-3 items-end" style={{ gridTemplateColumns: "2fr 1fr 1fr 42px" }}>
                  <TextInput value={p.name} onChange={(v) => updatePrize(p.id, "name", v)} placeholder="Ex: Chaveiro, Desconto..." />
                  <NumericInput value={p.probability} onChange={(v) => updatePrize(p.id, "probability", v)} placeholder="%" step="0.1" />
                  <NumericInput value={p.cost} onChange={(v) => updatePrize(p.id, "cost", v)} placeholder="R$" />
                  <DeleteButton onClick={() => removePrize(p.id)} />
                </div>
                {/* Mobile */}
                <div className="md:hidden space-y-2.5">
                  <TextInput label="Nome do Prêmio" value={p.name} onChange={(v) => updatePrize(p.id, "name", v)} placeholder="Ex: Chaveiro, Desconto..." />
                  <div className="grid grid-cols-2 gap-2">
                    <NumericInput label="Chance de sair (%)" value={p.probability} onChange={(v) => updatePrize(p.id, "probability", v)} placeholder="%" step="0.1" />
                    <NumericInput label="Quanto você paga (R$)" value={p.cost} onChange={(v) => updatePrize(p.id, "cost", v)} placeholder="R$" />
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => removePrize(p.id)}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase cursor-pointer transition-all duration-200 hover:scale-105"
                      style={{ background: t.redBg, border: `1px solid ${t.redBtnBorder}`, borderRadius: "8px", color: t.redLight, fontFamily: "'Outfit', sans-serif" }}
                    >
                      <Trash2 size={12} /> Remover
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardWrapper>

      {/* Results */}
      <CardWrapper delay={0.14}>
        <div className="p-5 md:p-6">
          <SectionTitle icon={<Gauge size={18} color={t.accent} />}>Resultado por Giro Médio</SectionTitle>
          <div style={{ height: "1px", background: t.divider, margin: "16px 0" }} />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <ResultCard label="Receita por Giro" value={formatBRL(revenuePerSpin)} color={t.accent} sub={`Quanto o posto lucra por giro: ${formatBRL(ticketNum)} x ${marginNum}%`} />
            <ResultCard label="Custo Esperado por Giro" value={formatBRL(expectedCost)} color={t.redLight} sub="Média ponderada do custo dos prêmios pela chance de cada um sair" />
            <ResultCard
              label="Resultado por Giro"
              value={`${profitPerSpin >= 0 ? "+" : ""}${formatBRL(profitPerSpin)}`}
              color={isViable ? t.green : t.red}
              sub={isViable ? "Receita por giro menos o custo esperado dos prêmios" : "O custo dos prêmios supera a receita por giro"}
              highlight
            />
          </div>

          <div
            className="flex items-center gap-3 px-5 py-4"
            style={{
              background: isViable ? t.viableBg : t.lossBg,
              border: `1px solid ${isViable ? t.viableBorder : t.lossBorder}`,
              borderRadius: "14px",
            }}
          >
            {isViable ? <CheckCircle2 size={20} color={t.greenLight} /> : <XCircle size={20} color={t.redLight} />}
            <span className="text-xs md:text-sm font-semibold" style={{ color: isViable ? t.greenLight : t.redLight, fontFamily: "'Outfit', sans-serif" }}>
              {isViable
                ? `Roleta viável. Lucro médio de ${formatBRL(profitPerSpin)} por giro.`
                : `Roleta dá prejuízo. Perda média de ${formatBRL(Math.abs(profitPerSpin))} por giro. Reduza custos ou aumente a margem.`}
            </span>
          </div>
        </div>
      </CardWrapper>

      {/* Simulation table by ticket value */}
      <SimulationTable ticketMin={ticketNum} margin={marginNum} expectedCost={expectedCost} />
    </div>
  );
}

function SimulationTable({ ticketMin, margin, expectedCost }) {
  const t = useTheme();
  const ticketValues = useMemo(() => {
    const base = [100, 150, 200, 250, 300, 400, 500];
    if (ticketMin > 0 && !base.includes(ticketMin)) {
      base.push(ticketMin);
      base.sort((a, b) => a - b);
    }
    return base;
  }, [ticketMin]);

  return (
    <CardWrapper delay={0.18}>
      <div className="p-5 md:p-6">
        <SectionTitle icon={<ChevronRight size={18} color={t.accent} />}>
          Simulação por Valor de Abastecimento
        </SectionTitle>
        <p className="text-sm mt-1 mb-5" style={{ color: t.textMuted, fontFamily: "'Outfit', sans-serif" }}>
          1 giro por visita. Veja como o resultado muda conforme o cliente abastece mais.
        </p>

        {/* Header */}
        <div
          className="hidden md:grid gap-3 mb-3 px-3 py-2.5 text-xs font-bold uppercase"
          style={{
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            color: t.textDim,
            background: t.tableHeaderBg,
            borderRadius: "10px",
            letterSpacing: "0.1em",
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          <span>Cliente abastece</span>
          <span>Lucro do posto</span>
          <span>Custo dos prêmios</span>
          <span>Resultado por giro</span>
        </div>

        <div className="flex flex-col gap-2">
          {ticketValues.map((tv, i) => {
            const revenue = tv * (margin / 100);
            const profit = revenue - expectedCost;
            const isPositive = profit >= 0;
            const isMin = tv === ticketMin;
            return (
              <div
                key={tv}
                className="animate-fade-up"
                style={{ animationDelay: `${0.02 * i}s` }}
              >
                {/* Desktop */}
                <div
                  className="hidden md:grid gap-3 items-center px-3 py-3"
                  style={{
                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                    background: isMin ? t.accentBg : t.rowBg,
                    borderRadius: "12px",
                    border: isMin ? `1px solid ${t.accentBorder}` : `1px solid ${t.rowBorder}`,
                  }}
                >
                  <span className="text-sm font-bold flex items-center gap-2" style={{ color: t.textPrimary, fontFamily: "'JetBrains Mono', monospace" }}>
                    {formatBRL(tv)}
                    {isMin && (
                      <span className="text-[10px] font-bold px-2 py-0.5 uppercase" style={{ background: t.accentBg, color: t.accent, borderRadius: "6px", border: `1px solid ${t.accentBorder}`, fontFamily: "'Outfit', sans-serif" }}>
                        Mínimo
                      </span>
                    )}
                  </span>
                  <span className="text-sm font-bold" style={{ color: t.accent, fontFamily: "'JetBrains Mono', monospace" }}>{formatBRL(revenue)}</span>
                  <span className="text-sm font-bold" style={{ color: t.redLight, fontFamily: "'JetBrains Mono', monospace" }}>{formatBRL(expectedCost)}</span>
                  <span className="text-sm font-bold" style={{ color: isPositive ? t.green : t.red, fontFamily: "'JetBrains Mono', monospace" }}>
                    {isPositive ? "+" : ""}{formatBRL(profit)}
                  </span>
                </div>
                {/* Mobile */}
                <div
                  className="md:hidden px-3 py-3"
                  style={{
                    background: isMin ? t.accentBg : t.rowBg,
                    borderRadius: "12px",
                    border: isMin ? `1px solid ${t.accentBorder}` : `1px solid ${t.rowBorder}`,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold flex items-center gap-2" style={{ color: t.textPrimary, fontFamily: "'JetBrains Mono', monospace" }}>
                      {formatBRL(tv)}
                      {isMin && (
                        <span className="text-[11px] font-bold px-2 py-0.5 uppercase" style={{ background: t.accentBg, color: t.accent, borderRadius: "5px", border: `1px solid ${t.accentBorder}`, fontFamily: "'Outfit', sans-serif" }}>
                          Mínimo
                        </span>
                      )}
                    </span>
                    <span className="text-sm font-bold" style={{ color: isPositive ? t.green : t.red, fontFamily: "'JetBrains Mono', monospace" }}>
                      {isPositive ? "+" : ""}{formatBRL(profit)}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm" style={{ color: t.textMuted, fontFamily: "'Outfit', sans-serif" }}>
                    <span>Lucro: <strong style={{ color: t.accent }}>{formatBRL(revenue)}</strong></span>
                    <span>Custo: <strong style={{ color: t.redLight }}>{formatBRL(expectedCost)}</strong></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </CardWrapper>
  );
}

function ResultCard({ label, value, color, sub, highlight }) {
  const t = useTheme();
  return (
    <div
      className={`p-4 md:p-5 transition-all duration-300 ${highlight ? "glow-pulse" : ""}`}
      style={{
        background: t.resultCardBg,
        borderRadius: "14px",
        borderLeft: `3px solid ${color}`,
      }}
    >
      <span
        className="text-xs md:text-sm font-bold uppercase block mb-1.5"
        style={{ color: t.textMuted, letterSpacing: "0.1em", fontFamily: "'Outfit', sans-serif" }}
      >
        {label}
      </span>
      <span className="text-xl md:text-2xl font-bold block" style={{ color, fontFamily: "'JetBrains Mono', monospace" }}>
        {value}
      </span>
      {sub && (
        <span className="text-xs md:text-sm block mt-1.5" style={{ color: t.textMuted, fontFamily: "'Outfit', sans-serif" }}>
          {sub}
        </span>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ABA 2 — SIMULADOR DE CATALOGO (PONTOS / LITROS)
   ══════════════════════════════════════════════════════════════════ */
function CatalogTab() {
  const t = useTheme();

  const [prizes, setPrizes] = useState(() =>
    loadJSON(STORAGE_KEYS.catalogPrizes, [
      { id: uid(), name: "Aspiração veicular", points: "10", cost: "5" },
      { id: uid(), name: "Ducha completa", points: "150", cost: "35" },
      { id: uid(), name: "Voucher R$ 10", points: "500", cost: "10" },
      { id: uid(), name: "Voucher R$ 15", points: "600", cost: "15" },
    ])
  );
  const [profitPerLiter, setProfitPerLiter] = useState(() =>
    loadJSON(STORAGE_KEYS.catalogProfit, "0.45")
  );

  useEffect(() => saveJSON(STORAGE_KEYS.catalogPrizes, prizes), [prizes]);
  useEffect(() => saveJSON(STORAGE_KEYS.catalogProfit, profitPerLiter), [profitPerLiter]);

  const profitNum = parseFloat(profitPerLiter) || 0;

  const addPrize = () =>
    setPrizes((p) => [...p, { id: uid(), name: "", points: "", cost: "" }]);
  const removePrize = (id) => setPrizes((p) => p.filter((x) => x.id !== id));
  const updatePrize = useCallback((id, field, value) => {
    setPrizes((p) => p.map((x) => (x.id === id ? { ...x, [field]: value } : x)));
  }, []);

  const rows = useMemo(
    () =>
      prizes.map((p) => {
        const pointsNum = parseFloat(p.points) || 0;
        const costNum = parseFloat(p.cost) || 0;
        const revenue = pointsNum * profitNum;
        const roi = costNum > 0 ? ((revenue - costNum) / costNum) * 100 : 0;
        const tooExpensive = costNum > revenue;
        return { ...p, pointsNum, costNum, revenue, roi, tooExpensive };
      }),
    [prizes, profitNum]
  );

  return (
    <div className="space-y-5">
      {/* Profit per liter */}
      <CardWrapper delay={0.02}>
        <div className="p-5 md:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 flex items-center justify-center"
              style={{
                background: t.accentGradient,
                borderRadius: "12px",
                boxShadow: `0 4px 14px ${t.mode === "dark" ? "rgba(45,212,191,0.2)" : "rgba(13,148,136,0.15)"}`,
              }}
            >
              <Droplets size={20} color="#fff" />
            </div>
            <div>
              <span className="text-xs md:text-sm font-bold uppercase block" style={{ color: t.textSecondary, letterSpacing: "0.08em", fontFamily: "'Outfit', sans-serif" }}>
                Lucro Médio por Litro
              </span>
              <span className="text-sm block" style={{ color: t.textMuted, fontFamily: "'Outfit', sans-serif" }}>
                Quanto o posto lucra por litro vendido. Cada ponto equivale a 1 litro.
              </span>
            </div>
          </div>
          <NumericInput value={profitPerLiter} onChange={setProfitPerLiter} placeholder="0.45" step="0.01" />
        </div>
      </CardWrapper>

      {/* Prize table */}
      <CardWrapper delay={0.06}>
        <div className="p-5 md:p-6">
          <div className="flex items-center justify-between mb-2">
            <SectionTitle icon={<Table2 size={18} color={t.accent} />}>Catálogo de Prêmios</SectionTitle>
            <AddButton onClick={addPrize} />
          </div>
          <p className="text-sm mb-5" style={{ color: t.textMuted, fontFamily: "'Outfit', sans-serif" }}>
            O cliente acumula pontos abastecendo (1 ponto = 1 litro). O sistema calcula se o lucro gerado por esses litros cobre o custo do prêmio.
          </p>

          {/* Desktop header */}
          <div
            className="hidden md:grid gap-3 mb-3 px-3 py-2.5 text-xs font-bold uppercase"
            style={{
              gridTemplateColumns: "1.8fr 0.8fr 0.8fr 1fr 0.8fr 0.8fr 42px",
              color: t.textDim,
              background: t.tableHeaderBg,
              borderRadius: "10px",
              letterSpacing: "0.1em",
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            <span>Prêmio</span>
            <span>Pontos (= Litros)</span>
            <span>Custo do Prêmio</span>
            <span>Lucro com Combustível</span>
            <span>Retorno (%)</span>
            <span>Status</span>
            <span />
          </div>

          <div className="flex flex-col gap-2.5">
            {rows.map((r, i) => (
              <CatalogRow key={r.id} row={r} onUpdate={updatePrize} onRemove={removePrize} delay={0.02 * i} />
            ))}
          </div>
        </div>
      </CardWrapper>
    </div>
  );
}

function CatalogRow({ row, onUpdate, onRemove, delay }) {
  const t = useTheme();
  const { id, name, points, cost, revenue, roi, tooExpensive } = row;

  const badgeStyle = tooExpensive
    ? { background: t.redBadgeBg, color: t.redLight }
    : { background: t.greenBadgeBg, color: t.greenLight };

  return (
    <div
      className="animate-fade-up p-3.5 md:p-3 transition-colors duration-200"
      style={{
        background: tooExpensive ? t.redBgSubtle : t.rowBg,
        borderRadius: "12px",
        border: `1px solid ${tooExpensive ? t.redBorderSubtle : t.rowBorder}`,
        animationDelay: `${delay}s`,
      }}
    >
      {/* Desktop row */}
      <div className="hidden md:grid gap-3 items-center" style={{ gridTemplateColumns: "1.8fr 0.8fr 0.8fr 1fr 0.8fr 0.8fr 42px" }}>
        <TextInput value={name} onChange={(v) => onUpdate(id, "name", v)} placeholder="Nome" />
        <NumericInput value={points} onChange={(v) => onUpdate(id, "points", v)} placeholder="Pts" step="1" />
        <NumericInput value={cost} onChange={(v) => onUpdate(id, "cost", v)} placeholder="R$" />
        <span className="text-sm font-bold" style={{ color: t.green, fontFamily: "'JetBrains Mono', monospace" }}>{formatBRL(revenue)}</span>
        <span className="text-sm font-bold" style={{ color: roi >= 0 ? t.green : t.red, fontFamily: "'JetBrains Mono', monospace" }}>{roi.toFixed(1)}%</span>
        <span
          className="text-sm font-bold px-3 py-1.5 inline-block text-center leading-tight"
          style={{ ...badgeStyle, borderRadius: "7px", fontFamily: "'Outfit', sans-serif", letterSpacing: "0.04em" }}
          title={tooExpensive ? "Custo do prêmio supera o lucro gerado" : "Lucro gerado cobre o custo do prêmio"}
        >
          {tooExpensive ? "Inviável" : "Viável"}
        </span>
        <DeleteButton onClick={() => onRemove(id)} />
      </div>

      {/* Mobile stacked */}
      <div className="md:hidden space-y-2.5">
        <TextInput label="Nome" value={name} onChange={(v) => onUpdate(id, "name", v)} placeholder="Nome do prêmio" />
        <div className="grid grid-cols-2 gap-2">
          <NumericInput label="Pontos (Litros)" value={points} onChange={(v) => onUpdate(id, "points", v)} placeholder="Pts" step="1" />
          <NumericInput label="Custo Real (R$)" value={cost} onChange={(v) => onUpdate(id, "cost", v)} placeholder="R$" />
        </div>
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div>
            <span className="text-xs uppercase block" style={{ color: t.textDim, fontFamily: "'Outfit', sans-serif", letterSpacing: "0.08em" }}>Lucro com Litros</span>
            <span className="text-sm font-bold" style={{ color: t.green, fontFamily: "'JetBrains Mono', monospace" }}>{formatBRL(revenue)}</span>
          </div>
          <div>
            <span className="text-xs uppercase block" style={{ color: t.textDim, fontFamily: "'Outfit', sans-serif", letterSpacing: "0.08em" }}>Retorno</span>
            <span className="text-sm font-bold" style={{ color: roi >= 0 ? t.green : t.red, fontFamily: "'JetBrains Mono', monospace" }}>{roi.toFixed(1)}%</span>
          </div>
          <div className="flex items-end justify-between">
            <span
              className="text-sm font-bold px-3 py-1"
              style={{ ...badgeStyle, borderRadius: "6px", fontFamily: "'Outfit', sans-serif" }}
            >
              {tooExpensive ? "Inviável" : "Viável"}
            </span>
            <DeleteButton onClick={() => onRemove(id)} size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   APP ROOT
   ══════════════════════════════════════════════════════════════════ */
export default function App() {
  const [tab, setTab] = useState(() => loadJSON(STORAGE_KEYS.activeTab, 0));
  const [isDark, setIsDark] = useState(() => loadJSON(STORAGE_KEYS.theme, true));

  useEffect(() => saveJSON(STORAGE_KEYS.activeTab, tab), [tab]);
  useEffect(() => saveJSON(STORAGE_KEYS.theme, isDark), [isDark]);

  const t = isDark ? themes.dark : themes.light;

  return (
    <ThemeContext.Provider value={t}>
      <div
        className="min-h-screen p-3 sm:p-4 md:p-8"
        style={{
          background: t.bgGradient,
          fontFamily: "'Outfit', sans-serif",
          transition: "background 0.4s",
        }}
      >
        <div className="max-w-5xl mx-auto">
          {/* Theme toggle */}
          <div className="flex justify-end mb-3 animate-fade-up">
            <button
              onClick={() => setIsDark((v) => !v)}
              className="flex items-center gap-2 px-3.5 py-2.5 text-[11px] font-bold uppercase cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: t.toggleBg,
                border: `1px solid ${t.toggleBorder}`,
                borderRadius: "12px",
                color: t.textMuted,
                letterSpacing: "0.08em",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              {isDark ? <Sun size={15} color={t.toggleIcon} /> : <Moon size={15} color={t.toggleIcon} />}
              <span className="hidden sm:inline">{isDark ? "Modo Claro" : "Modo Escuro"}</span>
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-8 md:mb-12 animate-fade-up" style={{ animationDelay: "0.05s" }}>
            <div
              className="inline-flex items-center gap-2 mb-5 px-5 py-2"
              style={{
                background: t.accentBg,
                border: `1px solid ${t.accentBorder}`,
                borderRadius: "9999px",
              }}
            >
              <Fuel size={14} color={t.accent} />
              <span
                className="text-[10px] md:text-[11px] font-bold uppercase"
                style={{ color: t.accent, letterSpacing: "0.18em" }}
              >
                Gestor de Fidelidade Multiposto
              </span>
            </div>
            <h1
              className="text-2xl sm:text-3xl md:text-6xl font-extrabold mb-4 tracking-tight"
              style={{
                fontFamily: "'Outfit', sans-serif",
                ...(isDark
                  ? {
                      background: "linear-gradient(135deg, #e0f2f1 0%, #2dd4bf 50%, #0d9488 100%)",
                      backgroundSize: "200% 100%",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }
                  : { color: "#0f172a" }),
              }}
            >
              Painel de Fidelidade
            </h1>
            <p className="text-sm md:text-base px-2 max-w-lg mx-auto" style={{ color: t.textDim, lineHeight: 1.6 }}>
              Simule e gerencie roletas e catálogos de prêmios para seus postos.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-3 md:gap-4 mb-7 md:mb-10 justify-center animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <TabButton
              active={tab === 0}
              onClick={() => setTab(0)}
              icon={<Dices size={16} color={tab === 0 ? t.accentLight : t.textDim} />}
              label="Simulador de Roleta"
            />
            <TabButton
              active={tab === 1}
              onClick={() => setTab(1)}
              icon={<Table2 size={16} color={tab === 1 ? t.accentLight : t.textDim} />}
              label="Simulador de Catálogo"
            />
          </div>

          {/* Tab content */}
          <div key={tab}>
            {tab === 0 ? <RouletteTab /> : <CatalogTab />}
          </div>

          {/* Footer */}
          <div className="text-center mt-10 mb-4 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div style={{ height: "1px", background: t.divider, marginBottom: "16px" }} />
            <span className="text-[10px] uppercase font-semibold" style={{ color: t.textDim, letterSpacing: "0.15em" }}>
              Gestor de Fidelidade Multiposto -- Uso interno
            </span>
          </div>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}
