import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useMemo, useState } from "react";

/* ─── Custom Gold Cursor ─── */
function GoldCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const onMove = (e: MouseEvent) => {
      dot.style.left = `${e.clientX - 5}px`;
      dot.style.top = `${e.clientY - 5}px`;
      setTimeout(() => {
        ring.style.left = `${e.clientX - 18}px`;
        ring.style.top = `${e.clientY - 18}px`;
      }, 80);
    };
    const onDown = () => { dot.style.transform = "scale(2)"; };
    const onUp = () => { dot.style.transform = "scale(1)"; };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="fixed z-[9999] pointer-events-none rounded-full" style={{ width: 10, height: 10, background: "#FFB432", mixBlendMode: "difference", transition: "transform 0.1s" }} />
      <div ref={ringRef} className="fixed z-[9998] pointer-events-none rounded-full" style={{ width: 36, height: 36, border: "1px solid rgba(255,180,50,0.5)", transition: "left 0.1s, top 0.1s" }} />
    </>
  );
}

/* ─── Hero Starfield ─── */
function Starfield({ count, className }: { count: number; className?: string }) {
  const stars = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * (className?.includes("canvas") ? 60 : 100)}%`,
    size: 0.4 + Math.random() * 2,
    dur: 2 + Math.random() * 4,
    delay: Math.random() * 5,
  })), [count, className]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className || ""}`}>
      {stars.map(s => (
        <div key={s.id} className="absolute rounded-full bg-white" style={{
          left: s.left, top: s.top, width: s.size, height: s.size,
          animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
        }} />
      ))}
    </div>
  );
}

/* ─── Fireflies ─── */
function Fireflies() {
  const flies = useMemo(() => Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${15 + Math.random() * 70}%`,
    top: `${60 + Math.random() * 35}%`,
    size: 1.5 + Math.random() * 3,
    dur: 5 + Math.random() * 6,
    delay: -Math.random() * 10,
    fx: (Math.random() - 0.5) * 60,
    fy: (Math.random() - 0.5) * 40,
    fx2: (Math.random() - 0.5) * 50,
    fy2: (Math.random() - 0.5) * 30,
  })), []);

  return (
    <>
      {flies.map(f => (
        <div key={f.id} className="absolute rounded-full z-[16]" style={{
          left: f.left, top: f.top, width: f.size, height: f.size,
          background: "rgba(255,220,80,0.8)",
          boxShadow: "0 0 6px rgba(255,220,80,0.8)",
          animation: `fireflyDrift ${f.dur}s ease-in-out ${f.delay}s infinite`,
          // @ts-ignore
          "--fx": `${f.fx}px`, "--fy": `${f.fy}px`, "--fx2": `${f.fx2}px`, "--fy2": `${f.fy2}px`,
        } as React.CSSProperties} />
      ))}
    </>
  );
}

/* ─── Graduation Caps ─── */
const capData = [
  { left: "12%", bottom: "38%", dx: -120, dy: -260, dr: 400, dur: 5.5, delay: 0 },
  { left: "28%", bottom: "40%", dx: 30, dy: -300, dr: -220, dur: 7, delay: 1.2 },
  { left: "44%", bottom: "37%", dx: 60, dy: -280, dr: 300, dur: 6, delay: 0.6 },
  { right: "28%", bottom: "40%", dx: -40, dy: -270, dr: -300, dur: 8, delay: 2.5 },
  { right: "14%", bottom: "38%", dx: 80, dy: -260, dr: 250, dur: 6.5, delay: 3.5 },
  { left: "55%", bottom: "42%", dx: -20, dy: -290, dr: 360, dur: 7.5, delay: 4.8 },
  { left: "35%", bottom: "38%", dx: 100, dy: -240, dr: -180, dur: 5, delay: 6 },
];

function GraduationCaps() {
  return (
    <>
      {capData.map((c, i) => (
        <div key={i} className="absolute z-[22] text-[26px]" style={{
          left: c.left, right: (c as any).right, bottom: c.bottom,
          filter: "drop-shadow(0 0 10px rgba(255,180,50,0.7))",
          animation: `capFly ${c.dur}s linear ${c.delay}s infinite`,
          // @ts-ignore
          "--dx": `${c.dx}px`, "--dy": `${c.dy}px`, "--dr": `${c.dr}deg`,
        } as React.CSSProperties}>🎓</div>
      ))}
    </>
  );
}

/* ─── Building Component ─── */
function Building({ label, bodyW, bodyH, roofW, roofH, winColor, style }: {
  label: string; bodyW: number; bodyH: number; roofW: number; roofH: number; winColor: string; style: React.CSSProperties;
}) {
  const cols = Math.max(2, Math.floor(bodyW / 18));
  const rows = Math.max(2, Math.floor((bodyH - 30) / 16));
  const windows = Array.from({ length: cols * rows }, (_, i) => i);

  return (
    <div className="absolute z-[15] flex flex-col items-center" style={style}>
      {/* Roof */}
      <div style={{
        width: 0, height: 0,
        borderLeft: `${roofW / 2}px solid transparent`,
        borderRight: `${roofW / 2}px solid transparent`,
        borderBottom: `${roofH}px solid #231758`,
      }} />
      {/* Body */}
      <div className="relative" style={{
        width: bodyW, height: bodyH,
        background: "linear-gradient(180deg, #241857, #160d3a)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}>
        <div className="absolute inset-x-2 top-3 grid gap-[5px]" style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
        }}>
          {windows.map(j => (
            <div key={j} className="rounded-[1px]" style={{
              height: 11, background: winColor,
              animation: `winFlicker 3s ease-in-out ${j * 0.3}s infinite`,
            }} />
          ))}
        </div>
      </div>
      {/* Footer strip */}
      <div style={{ width: bodyW + 4, height: 4, background: "#1e1548" }} />
      {/* Label */}
      <span className="font-code text-[7px] tracking-[2px] mt-1" style={{ color: "rgba(255,180,50,0.5)" }}>{label}</span>
    </div>
  );
}

/* ─── Clock Tower ─── */
function ClockTower() {
  return (
    <div className="absolute z-[20] flex flex-col items-center" style={{
      bottom: "36%", left: "50%", transform: "translateX(-50%)",
      animation: "towerBreath 8s ease-in-out infinite",
    }}>
      {/* Spire */}
      <div className="relative">
        <div style={{ width: 0, height: 0, borderLeft: "20px solid transparent", borderRight: "20px solid transparent", borderBottom: "50px solid #231758" }} />
        {/* Flag */}
        <div className="absolute" style={{
          top: 5, right: -26, width: 24, height: 15,
          background: "linear-gradient(135deg, #FFB432, #FF6B35)",
          clipPath: "polygon(0 0, 100% 25%, 100% 75%, 0 100%)",
          animation: "flagWave 2.5s ease-in-out infinite",
        }} />
      </div>
      {/* Tower body */}
      <div className="relative" style={{
        width: 38, height: 180,
        background: "linear-gradient(180deg, #2a1f5e, #1a1240)",
        border: "1px solid rgba(255,180,50,0.25)",
        boxShadow: "inset 2px 0 8px rgba(0,0,0,0.3), inset -2px 0 8px rgba(0,0,0,0.3)",
      }}>
        {/* Clock face */}
        <div className="absolute left-1/2 -translate-x-1/2 top-2 rounded-full" style={{
          width: 30, height: 30, border: "2px solid rgba(255,180,50,0.75)",
          boxShadow: "0 0 16px rgba(255,180,50,0.5)",
        }}>
          <div className="absolute left-1/2 top-1/2 origin-bottom -translate-x-1/2" style={{
            width: 1.5, height: 9, background: "#FFB432", marginTop: -9,
            animation: "hourHand 3600s linear infinite",
          }} />
          <div className="absolute left-1/2 top-1/2 origin-bottom -translate-x-1/2" style={{
            width: 1, height: 11, background: "white", marginTop: -11,
            animation: "minHand 60s linear infinite",
          }} />
        </div>
        {/* Windows */}
        {[70, 105, 140].map(y => (
          <div key={y} className="absolute left-1/2 -translate-x-1/2" style={{
            top: y, width: 10, height: 14,
            background: "rgba(255,200,80,0.6)",
            animation: `winFlicker 3s ease-in-out ${y * 0.01}s infinite`,
          }} />
        ))}
        {/* Arch door */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2" style={{
          width: 16, height: 24, borderRadius: "8px 8px 0 0",
          background: "rgba(10,6,30,0.8)", border: "1px solid rgba(255,180,50,0.4)",
        }} />
      </div>
      {/* Base + plinth */}
      <div style={{ width: 55, height: 10, background: "linear-gradient(180deg, #2a1f5e, #1e1548)" }} />
      <div style={{ width: 64, height: 8, background: "linear-gradient(180deg, #1e1548, #140e38)" }} />
      {/* Nameplate */}
      <div className="mt-1 px-2 py-0.5 font-code text-[8px] tracking-[3px]" style={{
        color: "#FFB432", background: "rgba(255,180,50,0.1)", border: "1px solid rgba(255,180,50,0.4)",
      }}>UNIVERSITY OF EXCELLENCE</div>
    </div>
  );
}

/* ─── Trees ─── */
function Trees() {
  const positions = [
    { left: "24%", dur: 7, delay: 0 },
    { left: "41%", dur: 9, delay: 1 },
    { right: "41%", dur: 8, delay: 2 },
    { right: "24%", dur: 10, delay: 0.5 },
  ];
  return (
    <>
      {positions.map((p, i) => (
        <div key={i} className="absolute z-[18] flex flex-col items-center" style={{
          left: p.left, right: (p as any).right, bottom: "36%",
          animation: `treeSway ${p.dur}s ease-in-out ${p.delay}s infinite`,
          transformOrigin: "bottom center",
        }}>
          <div style={{ width: 0, height: 0, borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderBottom: "24px solid #224d30", marginBottom: -14 }} />
          <div style={{ width: 0, height: 0, borderLeft: "16px solid transparent", borderRight: "16px solid transparent", borderBottom: "34px solid #1c4028", marginBottom: -22 }} />
          <div style={{ width: 0, height: 0, borderLeft: "22px solid transparent", borderRight: "22px solid transparent", borderBottom: "46px solid #163322" }} />
          <div style={{ width: 7, height: 24, background: "#3d2812" }} />
        </div>
      ))}
    </>
  );
}

/* ─── Lamp Posts ─── */
function LampPosts() {
  const positions = [{ left: "17%" }, { left: "35%" }, { right: "35%" }, { right: "17%" }];
  return (
    <>
      {positions.map((p, i) => (
        <div key={i} className="absolute z-[19] flex flex-col items-center" style={{ ...p, bottom: "36%" }}>
          <div style={{ width: 20, height: 14, borderTop: "2px solid #3a3070", borderRight: "2px solid #3a3070", borderRadius: "0 6px 0 0" }} />
          <div className="self-end" style={{
            width: 10, height: 6, borderRadius: "4px 4px 0 0", background: "#4a3880",
            boxShadow: "0 6px 22px rgba(255,200,80,0.9), 0 10px 40px rgba(255,200,80,0.4), 0 0 8px rgba(255,200,80,0.6)",
          }} />
          <div style={{ width: 3, height: 68, background: "linear-gradient(180deg, #3a3070, #2a2255)" }} />
          <div style={{ width: 10, height: 5, background: "#2a2255", borderRadius: 2 }} />
          {/* Ground glow */}
          <div className="absolute" style={{
            bottom: -40, width: 70, height: 80,
            background: "radial-gradient(ellipse at 50% 0%, rgba(255,200,80,0.18), transparent 70%)",
          }} />
        </div>
      ))}
    </>
  );
}

/* ─── Clouds ─── */
function Clouds() {
  const clouds = [
    { w: 120, h: 30, top: "15%", dur: 70, delay: 0 },
    { w: 90, h: 22, top: "22%", dur: 90, delay: -30 },
    { w: 140, h: 28, top: "10%", dur: 110, delay: -60 },
  ];
  return (
    <>
      {clouds.map((c, i) => (
        <div key={i} className="absolute rounded-full" style={{
          width: c.w, height: c.h, top: c.top,
          background: "rgba(80,40,100,0.35)",
          animation: `cloudDrift ${c.dur}s linear ${c.delay}s infinite`,
        }} />
      ))}
    </>
  );
}

/* ─── Floating Stat Cards ─── */
function FloatingStatCards() {
  const cards = [
    { value: "250+", label: "COLLEGES SERVED", style: { top: 28, left: 30 }, dur: 5, delay: 0 },
    { value: "1,200+", label: "REPORTS GENERATED", style: { top: 28, right: 30 }, dur: 7, delay: 1.5 },
    { value: "85%", label: "TIME SAVED", style: { bottom: "42%", right: 30 }, dur: 6, delay: 3 },
  ];
  return (
    <>
      {cards.map((c, i) => (
        <div key={i} className="absolute z-[30] backdrop-blur-[16px]" style={{
          ...c.style,
          background: "rgba(10,6,24,0.88)", border: "1px solid rgba(255,180,50,0.35)",
          borderRadius: 10, padding: "18px 26px",
          animation: `cardFloat ${c.dur}s ease-in-out ${c.delay}s infinite`,
        }}>
          <div className="font-display text-[34px] font-black" style={{
            color: "#FFB432", textShadow: "0 0 20px rgba(255,180,50,0.4)",
          }}>{c.value}</div>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="rounded-full" style={{
              width: 5, height: 5, background: "#00FFD1",
              animation: "dotPing 2s ease-in-out infinite",
            }} />
            <span className="font-code text-[9px] tracking-[3px]" style={{ color: "rgba(255,255,255,0.4)" }}>{c.label}</span>
          </div>
        </div>
      ))}
    </>
  );
}

/* ─── Feature Cards ─── */
const featureCards = [
  { icon: "🌇", title: "Living Campus Atmosphere", text: "A breathing, animated college scene with flickering windows, swaying trees, and warm lamp glow that makes data feel alive." },
  { icon: "🎓", title: "Graduation Caps in Flight", text: "Seven continuously flying caps arc upward — a celebration of achievement that mirrors your accreditation journey." },
  { icon: "🕰", title: "The Clock Tower Heartbeat", text: "A ticking clock at the heart of campus, reminding every team that deadlines drive excellence." },
  { icon: "🌙", title: "Golden Hour Dusk Palette", text: "From deep purple skies to warm orange horizons — every pixel crafted to feel like your campus at dusk." },
];

function FeatureCards() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const cards = el.querySelectorAll(".feat-card");
          cards.forEach((c, i) => {
            setTimeout(() => {
              (c as HTMLElement).style.opacity = "1";
              (c as HTMLElement).style.transform = "translateY(0)";
            }, i * 120);
          });
          obs.disconnect();
        }
      });
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid gap-5 max-w-[960px] mx-auto px-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
      {featureCards.map((f, i) => (
        <div key={i} className="feat-card group relative overflow-hidden transition-all duration-500 cursor-pointer" style={{
          opacity: 0, transform: "translateY(30px)",
          background: "rgba(255,180,50,0.04)", border: "1px solid rgba(255,180,50,0.14)",
          borderRadius: 12, padding: 28,
          transitionProperty: "opacity, transform, border-color, box-shadow",
        }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "rgba(255,180,50,0.35)";
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow = "0 20px 60px rgba(255,180,50,0.08)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "rgba(255,180,50,0.14)";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {/* Hover sweep line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFB432] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-600" style={{ animation: "none" }} />
          <div className="text-[32px] mb-3">{f.icon}</div>
          <h3 className="font-display text-[17px] font-bold text-white mb-2">{f.title}</h3>
          <p className="font-body text-[13px] leading-[1.75]" style={{ color: "rgba(255,255,255,0.42)" }}>{f.text}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── Stats Strip ─── */
const statsData = [
  { value: "250+", label: "COLLEGES SERVED" },
  { value: "1,200+", label: "REPORTS GENERATED" },
  { value: "85%", label: "TIME SAVED" },
  { value: "6M→2W", label: "MONTHS TO WEEKS" },
];

function StatsStrip() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const items = el.querySelectorAll(".stat-item");
          items.forEach((c, i) => {
            setTimeout(() => {
              (c as HTMLElement).style.opacity = "1";
              (c as HTMLElement).style.transform = "translateY(0)";
            }, i * 80);
          });
          obs.disconnect();
        }
      });
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex max-w-[960px] mx-auto rounded-xl overflow-hidden" style={{
      border: "1px solid rgba(255,180,50,0.12)",
    }}>
      {statsData.map((s, i) => (
        <div key={i} className="stat-item flex-1 text-center transition-all duration-500 group cursor-default" style={{
          padding: "32px 24px", background: "rgba(255,180,50,0.03)",
          borderRight: i < statsData.length - 1 ? "1px solid rgba(255,180,50,0.12)" : "none",
          opacity: 0, transform: "translateY(20px)",
          transitionProperty: "opacity, transform, background",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,180,50,0.07)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,180,50,0.03)"; }}
        >
          <div className="font-display text-[42px] font-black" style={{
            color: "#FFB432", textShadow: "0 0 30px rgba(255,180,50,0.3)",
          }}>{s.value}</div>
          <div className="font-code text-[10px] tracking-[3px] mt-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ─── Main Landing ─── */
export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-x-hidden text-white" style={{ background: "#0c0820", cursor: "none" }}>
      <GoldCursor />

      {/* ═══ FIXED NAV ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4" style={{
        background: "rgba(8,6,20,0.88)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,180,50,0.12)",
      }}>
        <span className="font-logo text-[17px] tracking-[6px] text-white">AUTO <span style={{ color: "#FFB432" }}>SCALE</span> AI</span>
        <div className="hidden md:flex items-center gap-8">
          {["Features", "How It Works", "Colleges", "Pricing"].map(l => (
            <a key={l} className="font-code text-[11px] tracking-[2px] transition-colors duration-300 cursor-pointer" style={{ color: "rgba(255,255,255,0.35)" }}
              onMouseEnter={e => { (e.target as HTMLElement).style.color = "#FFB432"; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.color = "rgba(255,255,255,0.35)"; }}
            >{l}</a>
          ))}
        </div>
        <button className="font-code text-[11px] font-bold tracking-[1px] px-5 py-2.5 rounded-full text-black transition-all duration-300 hover:-translate-y-0.5" style={{
          background: "linear-gradient(135deg, #FFB432, #FF6B35)",
          boxShadow: "none",
        }}
          onMouseEnter={e => { (e.target as HTMLElement).style.boxShadow = "0 8px 25px rgba(255,180,50,0.35)"; }}
          onMouseLeave={e => { (e.target as HTMLElement).style.boxShadow = "none"; }}
          onClick={() => navigate("/auth")}
        >Start New Cycle →</button>
      </nav>

      {/* ═══ HERO SECTION ═══ */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-6" style={{
        background: "radial-gradient(ellipse at 50% 100%, rgba(255,100,50,0.08), transparent 60%), #0c0820",
      }}>
        <Starfield count={140} />

        <p className="font-code text-[11px] tracking-[5px] mb-6 animate-[fadeUp_1s_ease-out_forwards]" style={{ color: "rgba(255,180,50,0.6)", opacity: 0 }}>
          — ACCREDITATION INTELLIGENCE PLATFORM —
        </p>
        <h1 className="font-display font-black leading-[1.1] mb-6 animate-[fadeUp_1s_ease-out_0.2s_forwards]" style={{
          fontSize: "clamp(44px, 7.5vw, 92px)", opacity: 0,
        }}>
          From <em style={{ color: "#FFB432" }}>6 Months</em> to 2 Weeks
        </h1>
        <p className="font-body text-[16px] max-w-[500px] leading-[1.85] mb-10 animate-[fadeUp_1s_ease-out_0.4s_forwards]" style={{
          color: "rgba(255,255,255,0.45)", opacity: 0,
        }}>
          AI-Powered Accreditation for NAAC, NBA & ABET compliance. Automate your entire SAR preparation process.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 animate-[fadeUp_1s_ease-out_0.6s_forwards]" style={{ opacity: 0 }}>
          <button className="relative overflow-hidden font-code text-[12px] font-bold tracking-[1px] px-8 py-4 rounded-full text-black transition-all duration-300 hover:-translate-y-[3px] group" style={{
            background: "linear-gradient(135deg, #FFB432, #FF6B35)",
          }} onClick={() => navigate("/auth")}>
            <span className="relative z-10">Start New Cycle →</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </button>
          <button className="font-code text-[12px] tracking-[1px] px-8 py-4 rounded-full transition-all duration-300 hover:-translate-y-[3px]" style={{
            background: "transparent", border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.6)",
          }}
            onMouseEnter={e => { const t = e.currentTarget; t.style.borderColor = "rgba(255,180,50,0.5)"; t.style.color = "#FFB432"; }}
            onMouseLeave={e => { const t = e.currentTarget; t.style.borderColor = "rgba(255,255,255,0.18)"; t.style.color = "rgba(255,255,255,0.6)"; }}
            onClick={() => navigate("/auth")}
          >▷ View Dashboard</button>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 font-code text-[10px] tracking-[4px] animate-[bounce_2.5s_infinite]" style={{ color: "rgba(255,255,255,0.2)" }}>
          ↓ SCROLL TO EXPLORE
        </div>
      </section>

      {/* ═══ CAMPUS SCENE SECTION ═══ */}
      <section className="relative py-24 px-6 text-center" style={{
        background: "linear-gradient(180deg, #0c0820, #1a0e35, #0c0820)",
      }}>
        <p className="font-code text-[11px] tracking-[5px] mb-4" style={{ color: "rgba(255,180,50,0.5)" }}>
          — THE CAMPUS EXPERIENCE —
        </p>
        <h2 className="font-display font-black mb-4" style={{ fontSize: "clamp(30px, 4vw, 52px)" }}>
          Your <em style={{ color: "#FFB432" }}>Campus,</em> at Golden Hour
        </h2>
        <div className="mx-auto mb-4" style={{ width: 60, height: 1, background: "#FFB432", opacity: 0.4 }} />
        <p className="font-body text-[15px] max-w-[520px] mx-auto leading-[1.85] mb-12" style={{ color: "rgba(255,255,255,0.4)" }}>
          A living, breathing campus scene that captures the magic of golden hour — where tradition meets innovation.
        </p>

        {/* Campus Canvas */}
        <div className="relative mx-auto overflow-hidden" style={{
          maxWidth: 1000, height: 520, borderRadius: 20,
          boxShadow: "0 40px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,180,50,0.12)",
        }}>
          {/* Sky gradient */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(180deg, #07051a 0%, #110b2e 20%, #28134a 45%, #5a2060 65%, #8B3A62 80%, #B5503A 92%, #C8623A 100%)",
          }}>
            {/* Sunset bloom */}
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(255,100,40,0.35) 0%, transparent 55%)" }} />
            {/* Horizon haze */}
            <div className="absolute left-0 right-0" style={{ bottom: "34%", height: 40, background: "rgba(255,140,60,0.12)", filter: "blur(20px)" }} />
          </div>

          {/* Moon */}
          <div className="absolute rounded-full" style={{
            top: 50, right: 140, width: 66, height: 66,
            background: "radial-gradient(circle at 38% 35%, #fffae0, #f5d060 60%, #e8b040)",
            boxShadow: "0 0 30px rgba(245,208,96,0.7), 0 0 80px rgba(245,208,96,0.25), inset 0 0 20px rgba(255,255,255,0.2)",
            animation: "moonPulse 6s ease-in-out infinite",
          }} />

          {/* Canvas stars */}
          <Starfield count={90} className="canvas" />

          {/* Clouds */}
          <Clouds />

          {/* Ground */}
          <div className="absolute bottom-0 left-0 right-0" style={{
            height: "38%",
            background: "linear-gradient(180deg, #160e35, #0d0828)",
            clipPath: "polygon(0 30%, 50% 0, 100% 30%, 100% 100%, 0 100%)",
          }}>
            {/* Pathways */}
            <div className="absolute inset-0">
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0" style={{ width: 2, background: "rgba(255,180,50,0.12)" }} />
              <div className="absolute left-[35%] top-[20%] bottom-0" style={{ width: 1, background: "rgba(255,180,50,0.06)" }} />
              <div className="absolute right-[35%] top-[20%] bottom-0" style={{ width: 1, background: "rgba(255,180,50,0.06)" }} />
            </div>
            {/* Ground glow */}
            <div className="absolute bottom-0 left-0 right-0 h-full" style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(255,180,50,0.06), transparent 70%)" }} />
          </div>

          {/* Buildings */}
          <Building label="HOSTEL A" bodyW={74} bodyH={90} roofW={74} roofH={22} winColor="rgba(120,200,255,0.55)" style={{ left: 20, bottom: "34%" }} />
          <Building label="ADMIN BLOCK" bodyW={130} bodyH={145} roofW={130} roofH={32} winColor="rgba(255,200,80,0.65)" style={{ left: 110, bottom: "34%" }} />
          <Building label="LIBRARY" bodyW={90} bodyH={110} roofW={90} roofH={25} winColor="rgba(0,255,180,0.45)" style={{ left: 252, bottom: "34%" }} />
          <Building label="AUDITORIUM" bodyW={94} bodyH={120} roofW={94} roofH={26} winColor="rgba(255,180,50,0.5)" style={{ right: 252, bottom: "34%" }} />
          <Building label="ACADEMIC BLOCK" bodyW={124} bodyH={150} roofW={124} roofH={30} winColor="rgba(255,200,80,0.6)" style={{ right: 110, bottom: "34%" }} />
          <Building label="HOSTEL B" bodyW={80} bodyH={95} roofW={80} roofH={22} winColor="rgba(200,180,255,0.45)" style={{ right: 20, bottom: "34%" }} />

          {/* Clock Tower */}
          <ClockTower />

          {/* Trees */}
          <Trees />

          {/* Lamp Posts */}
          <LampPosts />

          {/* Graduation Caps */}
          <GraduationCaps />

          {/* Fireflies */}
          <Fireflies />

          {/* Floating Stat Cards */}
          <FloatingStatCards />
        </div>
      </section>

      {/* ═══ FEATURE CARDS ═══ */}
      <section className="py-24" style={{ background: "linear-gradient(180deg, #0c0820, #1a0e35, #0c0820)" }}>
        <FeatureCards />
      </section>

      {/* ═══ STATS STRIP ═══ */}
      <section className="py-16 px-6" style={{ background: "#0c0820" }}>
        <StatsStrip />
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="relative py-24 px-6 text-center" style={{
        background: "radial-gradient(ellipse at 50% 50%, rgba(255,180,50,0.05), transparent 65%), linear-gradient(180deg, #0c0820, #1a0e35, #0c0820)",
      }}>
        <h2 className="font-display font-black mb-6" style={{ fontSize: "clamp(34px, 5vw, 64px)" }}>
          Ready to Transform Your <em style={{ color: "#FFB432" }}>Accreditation?</em>
        </h2>
        <p className="font-body text-[16px] max-w-[480px] mx-auto leading-[1.85] mb-10" style={{ color: "rgba(255,255,255,0.42)" }}>
          Join 250+ institutions already using AccredAI to streamline their NAAC, NBA & ABET compliance.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="relative overflow-hidden font-code text-[14px] font-bold tracking-[1px] px-11 py-4 rounded-full text-black transition-all duration-300 hover:-translate-y-[3px] group" style={{
            background: "linear-gradient(135deg, #FFB432, #FF6B35)",
          }} onClick={() => navigate("/auth")}>
            <span className="relative z-10">Start New Cycle →</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </button>
          <button className="font-code text-[14px] tracking-[1px] px-11 py-4 rounded-full transition-all duration-300 hover:-translate-y-[3px]" style={{
            background: "transparent", border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.6)",
          }}
            onMouseEnter={e => { const t = e.currentTarget; t.style.borderColor = "rgba(255,180,50,0.5)"; t.style.color = "#FFB432"; }}
            onMouseLeave={e => { const t = e.currentTarget; t.style.borderColor = "rgba(255,255,255,0.18)"; t.style.color = "rgba(255,255,255,0.6)"; }}
            onClick={() => navigate("/auth")}
          >▷ View Dashboard</button>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="flex items-center justify-between px-6 md:px-12 py-6" style={{
        borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.3)",
      }}>
        <span className="font-logo text-[14px] tracking-[4px] text-white">ACCR<span style={{ color: "#FFB432" }}>ED</span>AI</span>
        <span className="font-code text-[10px] tracking-[2px]" style={{ color: "rgba(255,255,255,0.2)" }}>
          © 2025 ACCREDAI · ACCREDITATION INTELLIGENCE PLATFORM
        </span>
        <span className="font-logo text-[12px] tracking-[3px]" style={{ color: "rgba(255,255,255,0.2)" }}>
          NAAC · NBA · ABET
        </span>
      </footer>

      {/* ═══ KEYFRAME STYLES ═══ */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }
        @keyframes winFlicker {
          0%, 100% { opacity: 0.9; }
          20% { opacity: 0.5; }
          60% { opacity: 1; }
          80% { opacity: 0.6; }
        }
        @keyframes towerBreath {
          0%, 100% { filter: drop-shadow(0 0 12px rgba(255,180,50,0.4)); }
          50% { filter: drop-shadow(0 0 28px rgba(255,180,50,0.7)); }
        }
        @keyframes flagWave {
          0%, 100% { clip-path: polygon(0 0, 100% 25%, 100% 75%, 0 100%); }
          50% { clip-path: polygon(0 10%, 100% 15%, 100% 85%, 0 90%); }
        }
        @keyframes hourHand {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes minHand {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes treeSway {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(1.2deg); }
        }
        @keyframes moonPulse {
          0%, 100% { box-shadow: 0 0 30px rgba(245,208,96,0.7), 0 0 80px rgba(245,208,96,0.25); }
          50% { box-shadow: 0 0 50px rgba(245,208,96,0.9), 0 0 130px rgba(245,208,96,0.4); }
        }
        @keyframes cloudDrift {
          from { transform: translateX(-100px); }
          to { transform: translateX(1100px); }
        }
        @keyframes cardFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
        @keyframes dotPing {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.5); }
        }
        @keyframes capFly {
          0% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0.8); }
          8% { opacity: 0.95; }
          88% { opacity: 0.85; }
          100% { opacity: 0; transform: translate(var(--dx), var(--dy)) rotate(var(--dr)) scale(1.1); }
        }
        @keyframes fireflyDrift {
          0% { opacity: 0; transform: translate(0, 0); }
          25% { opacity: 1; transform: translate(var(--fx), var(--fy)); }
          50% { opacity: 0.8; transform: translate(var(--fx2), var(--fy2)); }
          75% { opacity: 0.6; transform: translate(var(--fx), calc(var(--fy) * -1)); }
          100% { opacity: 0; transform: translate(0, 0); }
        }
      `}</style>
    </div>
  );
}
