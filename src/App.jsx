import { useState, useEffect, useRef } from "react";

/* ─── Global styles injected once ─────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Sora:wght@600;700;800&display=swap');
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Inter', system-ui, sans-serif; background: #fafaf9; color: #1c1917; overflow-x: hidden; }

  @keyframes fadeUp    { from { opacity:0; transform:translateY(26px); } to { opacity:1; transform:none; } }
  @keyframes blink     { 50% { opacity:0; } }
  @keyframes floaty    { 0%,100%{ transform:translateY(0px); } 50%{ transform:translateY(-14px); } }
  @keyframes bounce    { 0%,100%{ transform:translateX(-50%) translateY(0); } 50%{ transform:translateX(-50%) translateY(-10px); } }
  @keyframes eggPop    { from{ opacity:0; transform:scale(0.5); } to{ opacity:1; transform:scale(1); } }
  @keyframes meshDrift { 0%{ background-position:0% 0%,100% 100%,50% 50%; } 50%{ background-position:100% 50%,0% 50%,80% 20%; } 100%{ background-position:0% 0%,100% 100%,50% 50%; } }
  @keyframes shimmer   { 0%{ background-position:-200% 0; } 100%{ background-position:200% 0; } }
  @keyframes ringSpin  { to { transform:rotate(360deg); } }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #f1f0ee; }
  ::-webkit-scrollbar-thumb { background: #d4cfc7; border-radius: 99px; }

  /* ─── NAV ─────────────────────────────────────────────────────────────── */
  .nav-links { display: flex; gap: 2px; flex-wrap: wrap; }
  .nav-link  { font-size: 13px; font-weight: 600; padding: 7px 14px; border-radius: 99px;
               color: #57534e; text-decoration: none; transition: all .25s; white-space: nowrap; }
  .nav-link:hover, .nav-link.active { color: #fff; background: #1c1917; }
  .nav-hamburger { display: none; background: none; border: none; color: #1c1917;
                   font-size: 22px; cursor: pointer; padding: 4px 8px; line-height: 1; }
  .nav-mobile-menu { display: none; flex-direction: column; padding: 8px 20px 22px; }
  .nav-mobile-menu.open { display: flex; }
  .nav-mobile-link { display: block; padding: 13px 0; color: #292524; text-decoration: none;
                     border-bottom: 1px solid #e7e5e4; font-size: 15px; font-weight: 600; }

  /* ─── HERO ────────────────────────────────────────────────────────────── */
  .hero-inner   { display: flex; align-items: center; justify-content: space-between; gap: 40px; flex-wrap: nowrap; }
  .hero-text    { flex: 1; min-width: 0; }
  .hero-avatar  { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; }
  .hero-name    { font-family: 'Sora', sans-serif; font-size: clamp(30px, 4vw, 60px); font-weight: 800; line-height: 1.06; letter-spacing: -0.02em; }
  .hero-typed   { font-size: clamp(15px, 1.8vw, 23px); }
  .hero-tagline { font-size: clamp(13px, 1.1vw, 16px); }
  .hero-btns    { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 24px; }
  .hero-socials { display: flex; gap: 10px; margin-top: 24px; flex-wrap: wrap; }
  .avatar-ring  { width: 260px; height: 260px; border-radius: 50%; padding: 4px; position: relative;
                  box-shadow: 0 20px 60px rgba(28,25,23,.12), 0 0 0 1px rgba(28,25,23,.04); }
  .avatar-ring::before { content:""; position:absolute; inset:0; border-radius:50%;
                  background: conic-gradient(from 0deg, #f97316, #ec4899, #8b5cf6, #06b6d4, #f97316);
                  animation: ringSpin 8s linear infinite; z-index: 0; }
  .avatar-inner { width: 100%; height: 100%; border-radius: 50%; overflow: hidden;
                  border: 4px solid #fafaf9; position: relative; background: #f5f5f4; z-index: 1; }

  .btn-primary { display: inline-flex; align-items:center; gap:6px; padding: 13px 28px; border-radius: 99px; font-weight: 700;
                 font-size: 14px; text-decoration: none; cursor: pointer; border: none;
                 background: #1c1917; color: #fff;
                 box-shadow: 0 6px 20px rgba(28,25,23,.22); transition: transform .25s cubic-bezier(.34,1.56,.64,1), box-shadow .25s; }
  .btn-primary:hover { transform: translateY(-3px) scale(1.03); box-shadow: 0 10px 28px rgba(28,25,23,.3); }
  .btn-outline { display: inline-flex; align-items:center; gap:6px; padding: 12px 26px; border-radius: 99px; font-weight: 700;
                 font-size: 14px; text-decoration: none; cursor: pointer;
                 background: #fff; color: #1c1917;
                 border: 1.5px solid #e7e5e4; transition: transform .25s cubic-bezier(.34,1.56,.64,1), border-color .25s; }
  .btn-outline:hover { transform: translateY(-3px) scale(1.03); border-color: #1c1917; }
  .social-icon { width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center;
                 justify-content: center; background: #fff;
                 border: 1px solid #e7e5e4; text-decoration: none; font-size: 17px;
                 transition: all .25s cubic-bezier(.34,1.56,.64,1); cursor: pointer; }
  .social-icon:hover { background: #1c1917; transform: translateY(-3px) scale(1.08); box-shadow: 0 8px 18px rgba(28,25,23,.2); }

  /* ─── SECTIONS ────────────────────────────────────────────────────────── */
  .section      { padding: 100px 6vw; }
  .section-inner{ max-width: 1180px; margin: 0 auto; }
  .section-title-wrap { text-align: center; margin-bottom: 56px; }
  .eyebrow { font-size: 12px; letter-spacing: .18em; color: #ea580c; text-transform: uppercase; font-weight: 700; }
  .sec-title { font-family: 'Sora', sans-serif; font-size: clamp(28px, 4vw, 42px); font-weight: 800; margin-top: 10px; color: #1c1917; line-height: 1.2; letter-spacing: -0.01em; }
  .sec-divider { width: 48px; height: 4px; background: linear-gradient(90deg,#f97316,#ec4899); border-radius: 99px; margin: 16px auto 0; }

  /* ─── STATS ───────────────────────────────────────────────────────────── */
  .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; text-align: center; max-width: 1180px; margin: 0 auto; }
  .stat-val   { font-family:'Sora',sans-serif; font-size: clamp(28px, 4vw, 46px); font-weight: 800; color: #1c1917; }
  .stat-label { color: #78716c; font-size: 13px; margin-top: 6px; font-weight: 500; }

  /* ─── CARDS (soft elevated, not glass) ───────────────────────────────────*/
  .card { background: #fff; border: 1px solid #efece8; border-radius: 22px;
          transition: transform .35s cubic-bezier(.34,1.56,.64,1), box-shadow .35s, border-color .35s; }
  .card:hover { transform: translateY(-6px); box-shadow: 0 24px 48px rgba(28,25,23,.1); border-color: #e7e5e4; }

  .about-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
  .trait-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .chip { font-size: 12px; padding: 5px 14px; border-radius: 99px; font-weight: 600;
          background: #fff7ed; color: #c2410c; border: 1px solid #fed7aa; }

  .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px,1fr)); gap: 22px; }

  .projects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px,1fr)); gap: 26px; }
  .proj-card     { background: #fff; border: 1px solid #efece8; border-radius: 24px; overflow: hidden;
                    display: flex; flex-direction: column; transition: transform .4s cubic-bezier(.2,.8,.2,1), box-shadow .4s; }
  .proj-card:hover { transform: translateY(-10px); box-shadow: 0 30px 60px rgba(28,25,23,.14); }
  .stack-tag { font-size: 11px; padding: 4px 11px; border-radius: 99px; font-weight: 600;
               background: #fdf4ff; color: #a21caf; border: 1px solid #f5d0fe; }

  .certs-grid   { display: grid; grid-template-columns: repeat(auto-fit, minmax(270px,1fr)); gap: 18px; }
  .achieve-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px,1fr)); gap: 20px; }

  .contact-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 48px; align-items: start; }
  .form-input   { width: 100%; padding: 13px 16px; border-radius: 14px;
                  background: #fafaf9; border: 1.5px solid #e7e5e4;
                  color: #1c1917; font-size: 14px; outline: none; font-family: inherit; transition: border-color .2s, background .2s; }
  .form-input:focus { border-color: #1c1917; background: #fff; }

  .grad-text { background: linear-gradient(135deg,#ea580c,#db2777,#7c3aed);
               -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-size: 200% auto; }

  /* skill bar */
  .skillbar-track { height: 6px; background: #f0eeec; border-radius: 99px; overflow: hidden; }
  .skillbar-fill   { height: 100%; border-radius: 99px; transition: width 1.2s cubic-bezier(.16,1,.3,1) .15s; }

  /* magnetic wrapper cursor cue */
  .magnetic { will-change: transform; }

  /* ═══ RESPONSIVE ═══ */
  @media (min-width: 1440px) {
    .section { padding: 116px 100px; }
    .hero-inner { gap: 80px; }
    .avatar-ring { width: 320px; height: 320px; }
    .hero-name { font-size: 60px; }
  }
  @media (max-width: 1439px) and (min-width: 1024px) {
    .section { padding: 84px 4vw; }
    .hero-inner { gap: 32px; flex-wrap: nowrap; }
    .hero-name  { font-size: clamp(28px, 3.4vw, 48px); white-space: nowrap; }
    .hero-typed { font-size: clamp(14px, 1.6vw, 20px); }
    .avatar-ring { width: 240px; height: 240px; }
    .hero-btns, .hero-socials { gap: 10px; margin-top: 18px; }
    .btn-primary, .btn-outline { padding: 11px 22px; font-size: 13px; }
    .social-icon { width: 38px; height: 38px; font-size: 15px; }
    .nav-link { font-size: 12px; padding: 6px 11px; }
    .stat-val { font-size: clamp(26px, 3vw, 38px); }
  }
  @media (max-width: 1023px) and (min-width: 768px) {
    .section { padding: 72px 5vw; }
    .hero-inner { flex-direction: column-reverse; align-items: center; text-align: center; gap: 32px; flex-wrap: wrap; }
    .hero-btns, .hero-socials { justify-content: center; }
    .hero-text { width: 100%; }
    .hero-name { font-size: clamp(34px,6vw,52px); white-space: normal; }
    .avatar-ring { width: 210px; height: 210px; }
    .about-grid { grid-template-columns: 1fr; gap: 28px; }
    .contact-grid { grid-template-columns: 1fr; }
    .stats-grid { grid-template-columns: repeat(2,1fr); gap: 16px; }
    .nav-links { display: none; }
    .nav-hamburger { display: block; }
  }
  @media (max-width: 767px) {
    .section { padding: 56px 5vw; }
    .hero-inner { flex-direction: column-reverse; align-items: center; text-align: center; gap: 20px; flex-wrap: wrap; }
    .hero-btns, .hero-socials { justify-content: center; }
    .hero-text { width: 100%; }
    .hero-name { font-size: clamp(30px,8vw,46px); white-space: normal; }
    .hero-typed { font-size: clamp(14px,4vw,19px); }
    .avatar-ring { width: 180px; height: 180px; }
    .about-grid { grid-template-columns: 1fr; gap: 22px; }
    .trait-grid { grid-template-columns: 1fr 1fr; }
    .contact-grid { grid-template-columns: 1fr; }
    .stats-grid { grid-template-columns: repeat(2,1fr); gap: 12px; }
    .stat-val { font-size: clamp(26px,7vw,36px); }
    .projects-grid { grid-template-columns: 1fr; }
    .certs-grid { grid-template-columns: 1fr; }
    .nav-links { display: none; }
    .nav-hamburger { display: block; }
    .btn-primary, .btn-outline { padding: 11px 20px; font-size: 13px; }
    .sec-title { font-size: clamp(23px,7vw,30px); }
    .section-title-wrap { margin-bottom: 36px; }
  }
  @media (max-width: 380px) {
    .hero-btns { flex-direction: column; width: 100%; }
    .btn-primary, .btn-outline { width: 100%; justify-content: center; }
    .trait-grid { grid-template-columns: 1fr; }
    .skills-grid { grid-template-columns: 1fr; }
    .stats-grid { grid-template-columns: 1fr 1fr; }
    .avatar-ring { width: 150px; height: 150px; }
  }
`;

function GlobalStyles() {
  useEffect(() => {
    const id = "portfolio-light-global-css";
    if (!document.getElementById(id)) {
      const el = document.createElement("style");
      el.id = id;
      el.textContent = GLOBAL_CSS;
      document.head.appendChild(el);
    }
  }, []);
  return null;
}

/* ── Typing hook ──────────────────────────────────────────────────────────── */
function useTyping(words, speed = 95, pause = 1700) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const word = words[wordIdx];
    const delay = deleting ? 45 : speed;
    const timer = setTimeout(() => {
      if (!deleting) {
        setDisplay(word.slice(0, charIdx + 1));
        if (charIdx + 1 === word.length) setTimeout(() => setDeleting(true), pause);
        else setCharIdx(c => c + 1);
      } else {
        setDisplay(word.slice(0, charIdx - 1));
        if (charIdx === 0) { setDeleting(false); setWordIdx(i => (i + 1) % words.length); }
        else setCharIdx(c => c - 1);
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);
  return display;
}

/* ── Reveal on scroll ────────────────────────────────────────────────────── */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.12 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}
function Reveal({ children, delay = 0, className = "", style = {} }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(30px)",
      transition: `opacity .7s cubic-bezier(.16,1,.3,1) ${delay}ms, transform .7s cubic-bezier(.16,1,.3,1) ${delay}ms`,
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ── Magnetic button wrapper (cursor pull effect) ───────────────────────── */
function Magnetic({ children }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    el.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = "translate(0,0)"; };
  return (
    <div ref={ref} className="magnetic" onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ transition: "transform .25s cubic-bezier(.34,1.56,.64,1)", display: "inline-block" }}>
      {children}
    </div>
  );
}

/* ── Tilt card (3D hover tilt for project cards) ─────────────────────────── */
function TiltCard({ children, className = "", style = {} }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg) translateY(-10px)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = "perspective(900px) rotateY(0) rotateX(0) translateY(0)"; };
  return (
    <div ref={ref} className={className} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ transition: "transform .35s cubic-bezier(.2,.8,.2,1)", ...style }}>
      {children}
    </div>
  );
}

/* ── Mesh gradient background (animated blobs) ───────────────────────────── */
function MeshBackground() {
  return (
    <div style={{
      position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none",
      background: `
        radial-gradient(circle at 15% 20%, rgba(251,146,60,.22) 0%, transparent 45%),
        radial-gradient(circle at 85% 15%, rgba(236,72,153,.16) 0%, transparent 45%),
        radial-gradient(circle at 50% 80%, rgba(139,92,246,.14) 0%, transparent 50%)`,
      backgroundSize: "180% 180%, 160% 160%, 200% 200%",
      animation: "meshDrift 18s ease-in-out infinite",
    }} />
  );
}

/* ── Floating shape decorations ───────────────────────────────────────────── */
function FloatingShapes() {
  const shapes = [
    { top: "12%", left: "8%", size: 60, delay: "0s", dur: "7s", bg: "#fed7aa", rot: 12 },
    { top: "68%", left: "5%", size: 36, delay: "1.2s", dur: "6s", bg: "#fbcfe8", rot: -20 },
    { top: "20%", left: "92%", size: 44, delay: "0.6s", dur: "8s", bg: "#ddd6fe", rot: 30 },
    { top: "75%", left: "90%", size: 70, delay: "1.8s", dur: "9s", bg: "#bae6fd", rot: -10 },
  ];
  return (
    <>
      {shapes.map((s, i) => (
        <div key={i} style={{
          position: "absolute", top: s.top, left: s.left, width: s.size, height: s.size,
          background: s.bg, borderRadius: i % 2 === 0 ? "30% 70% 65% 35% / 40% 35% 65% 60%" : "50%",
          opacity: 0.55, transform: `rotate(${s.rot}deg)`,
          animation: `floaty ${s.dur} ease-in-out ${s.delay} infinite`,
          pointerEvents: "none", filter: "blur(0.5px)",
        }} />
      ))}
    </>
  );
}

/* ── Scroll progress (gradient bar) ──────────────────────────────────────── */
function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const fn = () => {
      const el = document.documentElement;
      setPct((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
    };
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, zIndex: 9999, background: "#f0eeec" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#f97316,#ec4899,#8b5cf6)", transition: "width .1s" }} />
    </div>
  );
}

/* ── Cursor glow (soft light-theme glow trailing cursor, desktop only) ──── */
function CursorGlow() {
  const ref = useRef(null);
  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) return;
    const el = ref.current;
    const fn = (e) => {
      if (el) { el.style.left = e.clientX + "px"; el.style.top = e.clientY + "px"; }
    };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);
  return (
    <div ref={ref} style={{
      position: "fixed", width: 380, height: 380, borderRadius: "50%", pointerEvents: "none",
      background: "radial-gradient(circle, rgba(249,115,22,.07) 0%, transparent 70%)",
      transform: "translate(-50%,-50%)", zIndex: 1, transition: "left .12s linear, top .12s linear",
      left: "-400px", top: "-400px",
    }} />
  );
}

/* ── Skill bar ───────────────────────────────────────────────────────────── */
function SkillBar({ name, pct, color }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: "#292524", fontWeight: 600 }}>{name}</span>
        <span style={{ fontSize: 12, color: "#a8a29e", fontWeight: 600 }}>{pct}%</span>
      </div>
      <div className="skillbar-track">
        <div className="skillbar-fill" style={{ width: visible ? `${pct}%` : "0%", background: color }} />
      </div>
    </div>
  );
}

/* ── Section helpers ─────────────────────────────────────────────────────── */
function Section({ id, children, style = {} }) {
  return <section id={id} className="section" style={{ position: "relative", ...style }}><div className="section-inner">{children}</div></section>;
}
function SectionTitle({ eyebrow, title }) {
  return (
    <Reveal>
      <div className="section-title-wrap">
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="sec-title">{title}</h2>
        <div className="sec-divider" />
      </div>
    </Reveal>
  );
}

/* ── NAV ─────────────────────────────────────────────────────────────────── */
function Nav({ active, setActive }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = ["About", "Skills", "Experience", "Projects", "Education", "Certifications", "Achievements", "Contact"];
  return (
    <nav style={{
      position: "fixed", top: 3, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? "rgba(250,250,249,0.85)" : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      boxShadow: scrolled ? "0 1px 0 #ece9e5" : "none",
      transition: "all .35s ease", padding: "0 5vw",
    }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 66 }}>
        <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 19, fontWeight: 800, letterSpacing: "-0.02em", color: "#1c1917" }}>
          Lavanya<span style={{ color: "#ea580c" }}>.</span>
        </span>
        <div className="nav-links">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className={`nav-link ${active === l ? "active" : ""}`} onClick={() => setActive(l)}>{l}</a>
          ))}
        </div>
        <button className="nav-hamburger" onClick={() => setMenuOpen(o => !o)}>{menuOpen ? "✕" : "☰"}</button>
      </div>
      <div className={`nav-mobile-menu ${menuOpen ? "open" : ""}`}>
        {links.map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} className="nav-mobile-link" onClick={() => { setActive(l); setMenuOpen(false); }}>{l}</a>
        ))}
      </div>
    </nav>
  );
}

/* ── HERO ────────────────────────────────────────────────────────────────── */
function Hero() {
  const roles = ["Software Engineer", "Full Stack Developer", "MERN Stack Developer", "AI Enthusiast", "Cloud Computing Enthusiast"];
  const typed = useTyping(roles);
  return (
    <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", padding: "100px 6vw 60px" }}>
      <MeshBackground />
      <FloatingShapes />
      <div className="hero-inner" style={{ maxWidth: 1180, margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
        <div className="hero-text">
          <div style={{ opacity: 0, animation: "fadeUp .8s ease .15s forwards" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#ea580c", letterSpacing: ".1em", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#16a34a", display: "inline-block", boxShadow: "0 0 0 4px #dcfce7" }} />
              Available for opportunities
            </span>
          </div>
          <h1 className="hero-name" style={{ marginTop: 16, opacity: 0, animation: "fadeUp .8s ease .3s forwards", color: "#1c1917" }}>
            Hi, I'm Gandikota<br />
            <span className="grad-text" style={{ animation: "shimmer 6s linear infinite" }}>Lavanya</span>
          </h1>
          <div className="hero-typed" style={{ height: 44, display: "flex", alignItems: "center", marginTop: 14, opacity: 0, animation: "fadeUp .8s ease .5s forwards", fontWeight: 700, color: "#44403c", fontFamily: "monospace" }}>
            {typed}<span style={{ animation: "blink 1s step-end infinite", color: "#ea580c" }}>|</span>
          </div>
          <p className="hero-tagline" style={{ color: "#78716c", lineHeight: 1.75, maxWidth: 520, marginTop: 18, opacity: 0, animation: "fadeUp .8s ease .7s forwards" }}>
            Building intelligent, scalable, and impactful digital experiences through Full Stack Development, Cloud Computing, and AI.
          </p>
          <div className="hero-btns" style={{ opacity: 0, animation: "fadeUp .8s ease .9s forwards" }}>
            <Magnetic><a href="#projects" className="btn-primary">View Projects ↗</a></Magnetic>
            <Magnetic><a href="/lavanya_resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-outline">Download Resume ↓</a></Magnetic>
            <Magnetic><a href="#contact" className="btn-outline">Contact Me</a></Magnetic>
          </div>
          <div className="hero-socials" style={{ opacity: 0, animation: "fadeUp .8s ease 1.05s forwards" }}>
            {[["LinkedIn","💼","https://www.linkedin.com/in/lavanya-gandikota-37162030b"],["GitHub","💻","https://github.com/lavanya2005g-lavs"],["CodeChef","👨‍🍳","#"],["Email","✉️","mailto:lavanya2005g@gmail.com"]].map(([label,icon,href]) => (
              <Magnetic key={label}><a href={href} title={label} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="social-icon">{icon}</a></Magnetic>
            ))}
          </div>
        </div>

        <div className="hero-avatar" style={{ opacity: 0, animation: "fadeUp .8s ease .4s forwards" }}>
          <div className="avatar-ring">
            <div className="avatar-inner">
              <img src="/lavanya.jpeg" alt="Gandikota Lavanya"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
            </div>
          </div>
          <p style={{ marginTop: 16, color: "#78716c", fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 5 }}>📍 Rajam, Andhra Pradesh</p>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", animation: "bounce 2s ease-in-out infinite", zIndex: 1 }}>
        <div style={{ width: 22, height: 36, borderRadius: 11, border: "2px solid #d6d3d1", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 5 }}>
          <div style={{ width: 4, height: 8, borderRadius: 4, background: "#ea580c" }} />
        </div>
      </div>
    </section>
  );
}

/* ── STATS ───────────────────────────────────────────────────────────────── */
function Stats() {
  const stats = [["9.2","B.Tech CGPA"],["8.9","Diploma CGPA"],["6+","Certifications"],["100","Day Streak 🔥"]];
  return (
    <section style={{ padding: "52px 6vw", background: "#fff", borderTop: "1px solid #efece8", borderBottom: "1px solid #efece8" }}>
      <div className="stats-grid">
        {stats.map(([val,label], i) => (
          <Reveal key={label} delay={i*80}>
            <div>
              <div className="stat-val">{val}</div>
              <div className="stat-label">{label}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── ABOUT ───────────────────────────────────────────────────────────────── */
function About() {
  const traits = [["🧩","Problem Solver","#fff7ed","#c2410c"],["📚","Continuous Learner","#fdf2f8","#be185d"],["🤝","Team Player","#f0f9ff","#0369a1"],["⚡","Fast Adaptor","#fefce8","#a16207"],["🤖","AI Enthusiast","#faf5ff","#7e22ce"]];
  return (
    <Section id="about">
      <SectionTitle eyebrow="Who I Am" title="About Me" />
      <div className="about-grid">
        <Reveal>
          <div className="card" style={{ padding: 36 }}>
            <h3 style={{ fontFamily: "'Sora',sans-serif", color: "#1c1917", fontSize: 17, fontWeight: 700, marginBottom: 14 }}>Professional Summary</h3>
            <p style={{ color: "#57534e", lineHeight: 1.85, fontSize: 14.5 }}>
              Motivated IT undergraduate passionate about Full Stack Development, Cloud Computing, and Artificial Intelligence. Skilled in MERN Stack, Java, AWS, and Data Analytics with a strong desire to build scalable applications and solve real-world problems.
            </p>
            <div style={{ marginTop: 26, display: "flex", gap: 10, flexWrap: "wrap" }}>
              {["MERN Stack","AWS","Java","AI/ML","REST APIs"].map(t => <span key={t} className="chip">{t}</span>)}
            </div>
          </div>
        </Reveal>
        <div className="trait-grid">
          {traits.map(([icon,label,bg,fg], i) => (
            <Reveal key={label} delay={i*70}>
              <div className="card" style={{ padding: "22px 18px", textAlign: "center", background: bg, borderColor: "transparent" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: fg }}>{label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ── SKILLS ──────────────────────────────────────────────────────────────── */
function Skills() {
  const cats = [
    { title: "Programming", color: "linear-gradient(90deg,#f97316,#fb923c)", skills: [["Java",88],["Python",82],["C",78],["C++",75],["C#",65]] },
    { title: "Frontend", color: "linear-gradient(90deg,#ec4899,#f472b6)", skills: [["HTML",92],["CSS",88],["JavaScript",85],["React.js",83],["Tailwind CSS",80]] },
    { title: "Backend", color: "linear-gradient(90deg,#8b5cf6,#a78bfa)", skills: [["Node.js",80],["Express.js",78]] },
    { title: "Database", color: "linear-gradient(90deg,#06b6d4,#22d3ee)", skills: [["MongoDB",82],["SQL",76]] },
    { title: "Cloud & Tools", color: "linear-gradient(90deg,#f59e0b,#fbbf24)", skills: [["AWS",72],["Git",88],["VS Code",95]] },
    { title: "Concepts", color: "linear-gradient(90deg,#10b981,#34d399)", skills: [["DBMS",80],["OOP",85],["REST APIs",82]] },
  ];
  return (
    <Section id="skills" style={{ background: "#fff" }}>
      <SectionTitle eyebrow="What I Know" title="Skills & Technologies" />
      <div className="skills-grid">
        {cats.map((cat, ci) => (
          <Reveal key={cat.title} delay={ci*60}>
            <div className="card" style={{ padding: "26px 24px" }}>
              <h3 style={{ fontFamily: "'Sora',sans-serif", color: "#1c1917", fontWeight: 700, fontSize: 15, marginBottom: 20 }}>{cat.title}</h3>
              {cat.skills.map(([n,p]) => <SkillBar key={n} name={n} pct={p} color={cat.color} />)}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ── EXPERIENCE ──────────────────────────────────────────────────────────── */
function Experience() {
  return (
    <Section id="experience">
      <SectionTitle eyebrow="My Journey" title="Experience" />
      <Reveal>
        <div style={{ position: "relative", paddingLeft: 36 }}>
          <div style={{ position: "absolute", left: 8, top: 0, bottom: 0, width: 2, background: "linear-gradient(180deg,#ea580c,#fed7aa)", borderRadius: 99 }} />
          <div style={{ position: "absolute", left: 2, top: 24, width: 14, height: 14, borderRadius: "50%", background: "#ea580c", boxShadow: "0 0 0 5px #ffedd5" }} />
          <div className="card" style={{ padding: "32px 28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
              <div>
                <h3 style={{ fontFamily: "'Sora',sans-serif", color: "#1c1917", fontWeight: 700, fontSize: 17 }}>Cloud Computing Intern</h3>
                <p style={{ color: "#ea580c", fontWeight: 700, fontSize: 13.5, marginTop: 4 }}>HashTek Solutions</p>
              </div>
              <span className="chip" style={{ alignSelf: "flex-start" }}>Internship</span>
            </div>
            <ul style={{ color: "#57534e", lineHeight: 1.8, paddingLeft: 0, fontSize: 14, listStyle: "none" }}>
              {[
                "Worked with AWS cloud services across multiple service categories.",
                "Gained hands-on experience in cloud deployment and resource management.",
                "Built and maintained cloud infrastructure using basic DevOps workflows.",
              ].map((line, i) => (
                <li key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                  <span style={{ color: "#ea580c", fontSize: 14, lineHeight: "22px", flexShrink: 0 }}>●</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <div style={{ display: "flex", gap: 8, marginTop: 18, flexWrap: "wrap" }}>
              {["AWS","Cloud Infrastructure","DevOps","Resource Management"].map(t => <span key={t} className="stack-tag">{t}</span>)}
            </div>
            <div style={{ marginTop: 20 }}>
              <Magnetic>
                <a href="/certificates/aws-internship.pdf.jpeg" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ padding: "9px 20px", fontSize: 12.5 }}>
                  View Certificate ↗
                </a>
              </Magnetic>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

/* ── PROJECTS ────────────────────────────────────────────────────────────── */
function ProjectCard({ p, delay }) {
  return (
    <Reveal delay={delay}>
      <TiltCard className="proj-card">
        <div style={{ height: 180, background: p.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 54, position: "relative" }}>
          {p.icon}
          {p.featured && (
            <span style={{ position: "absolute", top: 14, right: 14, fontSize: 11, padding: "5px 12px", borderRadius: 99, background: "rgba(255,255,255,.92)", color: "#9a3412", fontWeight: 800, boxShadow: "0 4px 12px rgba(0,0,0,.1)" }}>✦ Featured Project</span>
          )}
        </div>
        <div style={{ padding: "24px 24px 28px", flex: 1, display: "flex", flexDirection: "column" }}>
          <h3 style={{ fontFamily: "'Sora',sans-serif", color: "#1c1917", fontWeight: 700, fontSize: 18, marginBottom: 10 }}>{p.title}</h3>
          <p style={{ color: "#78716c", fontSize: 14, lineHeight: 1.7, flex: 1 }}>{p.desc}</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
            {p.stack.map(t => <span key={t} className="stack-tag">{t}</span>)}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            {p.demo ? (
              <Magnetic><a href={p.demo} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: "9px 18px", fontSize: 12 }}>Live Demo ↗</a></Magnetic>
            ) : (
              <Magnetic><span className="btn-primary" style={{ padding: "9px 18px", fontSize: 12, opacity: .5, cursor: "default" }}>Live Demo (soon)</span></Magnetic>
            )}
            {p.github ? (
              <Magnetic><a href={p.github} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ padding: "9px 18px", fontSize: 12 }}>GitHub</a></Magnetic>
            ) : (
              <Magnetic><span className="btn-outline" style={{ padding: "9px 18px", fontSize: 12, opacity: .5, cursor: "default" }}>GitHub (soon)</span></Magnetic>
            )}
          </div>
        </div>
      </TiltCard>
    </Reveal>
  );
}
function Projects() {
  const projects = [
    { title: "SentinelAI", featured: true, icon: "🛡️",
      bg: "linear-gradient(135deg,#fff7ed,#fce7f3)",
      desc: "Advanced AI-powered security and intelligent monitoring platform with real-time anomaly detection, predictive threat analysis, and an analytics dashboard for smart decision support.",
      stack: ["React","Python","AI/ML","Node.js","MongoDB","AWS"],
      demo: null, github: null },
    { title: "Intelligent Complaint Management Platform", featured: false, icon: "💬",
      bg: "linear-gradient(135deg,#eff6ff,#f0fdfa)",
      desc: "Full Stack MERN application for real-time complaint tracking with user authentication, CRUD operations, REST API integration, and live status monitoring.",
      stack: ["MongoDB","Express.js","React.js","Node.js"],
      demo: "https://complaint-management-platform.netlify.app/",
      github: "https://github.com/lavanya2005g-lavs/complaint_management_platform" },
  ];
  return (
    <Section id="projects" style={{ background: "#fff" }}>
      <SectionTitle eyebrow="What I've Built" title="Projects" />
      <div className="projects-grid">
        {projects.map((p,i) => <ProjectCard key={p.title} p={p} delay={i*100} />)}
      </div>
    </Section>
  );
}

/* ── EDUCATION ───────────────────────────────────────────────────────────── */
function Education() {
  const edu = [
    { degree: "B.Tech in Information Technology", school: "GMR Institute of Technology", years: "2024 – 2027", cgpa: "9.2", icon: "🎓", dot: "#ea580c", ring:"#ffedd5" },
    { degree: "Diploma in Computer Engineering", school: "Balajee Polytechnic College", years: "2020 – 2024", cgpa: "8.9", icon: "📜", dot: "#0891b2", ring:"#cffafe" },
  ];
  return (
    <Section id="education">
      <SectionTitle eyebrow="My Background" title="Education" />
      <div style={{ position: "relative", paddingLeft: 36 }}>
        <div style={{ position: "absolute", left: 8, top: 0, bottom: 0, width: 2, background: "linear-gradient(180deg,#ea580c,#a5f3fc)", borderRadius: 99 }} />
        {edu.map((e,i) => (
          <Reveal key={e.degree} delay={i*120}>
            <div style={{ position: "relative", marginBottom: 24 }}>
              <div style={{ position: "absolute", left: -32, top: 24, width: 14, height: 14, borderRadius: "50%", background: e.dot, boxShadow: `0 0 0 5px ${e.ring}` }} />
              <div className="card" style={{ padding: "28px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <span style={{ fontSize: 24, marginBottom: 8, display: "block" }}>{e.icon}</span>
                    <h3 style={{ fontFamily: "'Sora',sans-serif", color: "#1c1917", fontWeight: 700, fontSize: 17 }}>{e.degree}</h3>
                    <p style={{ color: e.dot, fontWeight: 700, fontSize: 13.5, marginTop: 4 }}>{e.school}</p>
                    <p style={{ color: "#a8a29e", fontSize: 13, marginTop: 4 }}>{e.years}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: 11, color: "#a8a29e", fontWeight: 600 }}>CGPA</span>
                    <div className="grad-text" style={{ fontFamily: "'Sora',sans-serif", fontSize: 28, fontWeight: 800 }}>{e.cgpa}</div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ── CERTIFICATIONS ──────────────────────────────────────────────────────── */
function Certifications() {
  const certs = [
    ["🌐","Full Stack Web Development with Node.js and MongoDB","L&T EduTech","/certificates/fullstack-it.pdf"],
    ["☁️","AWS Cloud Computing Internship","HashTek Solutions","/certificates/aws-internship.pdf.jpeg"],
    ["🤖","AWS Academy Graduate – Generative AI Foundations","AWS Academy","/certificates/aws-genai.pdf"],
    ["📊","Data Labeling Job Simulation","Deloitte · Forage","/certificates/deloitee-datalabelling.pdf"],
    ["💼","Virtual Job Simulation","Deloitte · Forage","/certificates/deloiteee-virtual.pdf"],
    ["🧠","Introduction to Generative AI","Coursera","/certificates/coursera-genai.pdf"],
    ["🔐","Cyber Job Simulation","Deloitte · Forage","/certificates/deloitee-cyber.pdf"],
    ["🛡️","Cybersecurity Analyst Job Simulation","Tata · Forage","/certificates/tata-cybersecurity.pdf"],
  ];
  return (
    <Section id="certifications" style={{ background: "#fff" }}>
      <SectionTitle eyebrow="Credentials" title="Certifications" />
      <div className="certs-grid">
        {certs.map(([icon,title,issuer,pdf], i) => (
          <Reveal key={title} delay={i*60}>
            <a href={pdf} target="_blank" rel="noopener noreferrer" className="card"
              style={{ padding: "22px 20px", display: "flex", gap: 16, alignItems: "flex-start", textDecoration: "none", cursor: "pointer" }}>
              <div style={{ fontSize: 26, flexShrink: 0 }}>{icon}</div>
              <div>
                <h4 style={{ color: "#1c1917", fontWeight: 700, fontSize: 14, lineHeight: 1.4 }}>{title}</h4>
                <p style={{ color: "#ea580c", fontSize: 12, marginTop: 5, fontWeight: 700 }}>{issuer}</p>
                <p style={{ color: "#a8a29e", fontSize: 11, marginTop: 6, fontWeight: 600 }}>View Certificate ↗</p>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ── ACHIEVEMENTS ────────────────────────────────────────────────────────── */
function Achievements() {
  const items = [
    ["🔥","100 Days Coding Streak","CodeChef","Consistently solved problems every day for 100 consecutive days.", "linear-gradient(135deg,#fff7ed,#ffedd5)"],
    ["💎","Diamond Streak Badge","CodeChef","Earned the prestigious Diamond Streak Badge for sustained coding excellence.", "linear-gradient(135deg,#eff6ff,#dbeafe)"],
    ["📄","Research Paper Published","IJRPR · Vol 7, Issue 4","Published \"Intelligent Complaint Management System\" — A+ grade journal, Impact Factor 6.844.", "linear-gradient(135deg,#f0fdf4,#dcfce7)"],
  ];
  return (
    <Section id="achievements">
      <SectionTitle eyebrow="Milestones" title="Achievements" />
      <div className="achieve-grid" style={{ alignItems: "stretch" }}>
        {items.map(([icon,title,sub,desc,bg], i) => (
          <Reveal key={title} delay={i*100} style={{ height: "100%" }}>
            <div className="card" style={{ padding: "32px 28px", textAlign: "center", background: bg, borderColor: "transparent", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>{icon}</div>
              <h3 style={{ fontFamily: "'Sora',sans-serif", color: "#1c1917", fontWeight: 800, fontSize: 18 }}>{title}</h3>
              <p style={{ color: "#ea580c", fontSize: 13, fontWeight: 700, marginTop: 4 }}>{sub}</p>
              <p style={{ color: "#57534e", fontSize: 14, marginTop: 10, lineHeight: 1.6 }}>{desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ── CONTACT ─────────────────────────────────────────────────────────────── */
function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSend = () => {
    const subject = encodeURIComponent(`Portfolio enquiry from ${name || "a visitor"}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${msg}`
    );
    window.location.href = `mailto:lavanya2005g@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <Section id="contact" style={{ background: "#fff" }}>
      <SectionTitle eyebrow="Get In Touch" title="Let's build something amazing together." />
      <div className="contact-grid">
        <Reveal>
          <div>
            <p style={{ color: "#78716c", fontSize: 14.5, lineHeight: 1.75, marginBottom: 30 }}>
              I'm currently open to internship opportunities and full-time roles. Whether you have a project in mind or just want to connect, my inbox is open.
            </p>
            {[["✉️","lavanya2005g@gmail.com","mailto:lavanya2005g@gmail.com"],["💼","LinkedIn","https://www.linkedin.com/in/lavanya-gandikota-37162030b"],["💻","GitHub","https://github.com/lavanya2005g-lavs"],["👨‍🍳","CodeChef","#"]].map(([icon,label,href]) => (
              <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: "1px solid #efece8", textDecoration: "none", color: "#292524", fontSize: 14, fontWeight: 600 }}>
                <span style={{ fontSize: 19 }}>{icon}</span>{label}
              </a>
            ))}
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="card" style={{ padding: 32 }}>
            <p style={{ color: "#a8a29e", fontSize: 12, marginBottom: 18, lineHeight: 1.6 }}>
             
            </p>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 12, color: "#a8a29e", display: "block", marginBottom: 7, fontWeight: 600 }}>Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className="form-input" />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 12, color: "#a8a29e", display: "block", marginBottom: 7, fontWeight: 600 }}>Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="form-input" />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: "#a8a29e", display: "block", marginBottom: 7, fontWeight: 600 }}>Message</label>
              <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={4} placeholder="Tell me about your project or opportunity..." className="form-input" style={{ resize: "vertical" }} />
            </div>
            <Magnetic>
              <button onClick={handleSend} className="btn-primary" style={{ width: "100%", justifyContent: "center", border: "none", cursor: "pointer" }}>Open Email to Send ✉️</button>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer style={{ padding: "28px 6vw", borderTop: "1px solid #efece8", textAlign: "center", background:"#fff" }}>
      <p style={{ color: "#a8a29e", fontSize: 13 }}>Designed & built by <span style={{ color: "#ea580c", fontWeight: 700 }}>Gandikota Lavanya</span> · {new Date().getFullYear()}</p>
    </footer>
  );
}

/* ── Konami easter egg ───────────────────────────────────────────────────── */
function useKonamiCode(cb) {
  const seq = useRef([]);
  const code = [38,38,40,40,37,39,37,39,66,65];
  useEffect(() => {
    const fn = (e) => {
      seq.current = [...seq.current, e.keyCode].slice(-10);
      if (seq.current.join() === code.join()) cb();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [cb]);
}

/* ── APP ─────────────────────────────────────────────────────────────────── */
export default function App() {
  const [active, setActive] = useState("About");
  const [egg, setEgg] = useState(false);
  useKonamiCode(() => setEgg(true));

  return (
    <div style={{ background: "#fafaf9", minHeight: "100vh", color: "#1c1917", fontFamily: "'Inter',system-ui,sans-serif", position: "relative" }}>
      <GlobalStyles />
      <CursorGlow />
      <ScrollProgress />
      <Nav active={active} setActive={setActive} />
      <Hero />
      <Stats />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Education />
      <Certifications />
      <Achievements />
      <Contact />
      <Footer />

      <Magnetic>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{ position: "fixed", bottom: 28, right: 28, width: 46, height: 46, borderRadius: "50%",
                   background: "#1c1917", border: "none", color: "#fff", fontSize: 18, cursor: "pointer",
                   zIndex: 999, boxShadow: "0 10px 24px rgba(28,25,23,.28)" }}>↑</button>
      </Magnetic>

      {egg && (
        <div onClick={() => setEgg(false)} style={{ position: "fixed", inset: 0, background: "rgba(28,25,23,.55)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
          <div style={{ animation: "eggPop .4s cubic-bezier(.34,1.56,.64,1)", background: "#fff", borderRadius: 28, padding: "48px 56px", textAlign: "center", boxShadow: "0 30px 80px rgba(0,0,0,.3)" }}>
            <div style={{ fontSize: 52 }}>🎉</div>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 22, color: "#1c1917", marginTop: 16, fontWeight: 800 }}>Thanks Recruiter for Visiting!</h2>
            <p className="grad-text" style={{ marginTop: 10, fontSize: 15, fontWeight: 700 }}>You found the Konami Code easter egg 🎮</p>
            <p style={{ color: "#a8a29e", marginTop: 8, fontSize: 13 }}>↑↑↓↓←→←→BA</p>
            <button onClick={() => setEgg(false)} className="btn-primary" style={{ marginTop: 24, border:"none", cursor:"pointer" }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
