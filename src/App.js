import { useState, useEffect, useRef } from "react";
import "./App.css";
import HeroSection from "./components/HeroSection";
// import WaveformSVG from "./components/WaveformSVG";
import SpectrogramCanvas from "./components/SpectrogramCanvas";
import { FadeIn } from "./components/FadeIn";
import DemoSection from "./components/DemoSection";

// ─── CSS INJECTION ────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@400;500;700&family=Poppins:wght@600;700&family=Sarabun:ital,wght@0,300;0,400;0,500;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    /* ── SOFTER ISAN PALETTE ── */
    --text-main: #3A3230;     /* Soft dark brown/charcoal instead of black */
    --text-muted: #6E6360;    /* Warm grey for secondary text */
    --text-light: #A39794;
    
    --bg-page: #FDFBF7;       /* Warm silk/cream background */
    --surface: #FFFFFF;       /* Clean white for cards */
    --surface-2: #F6F1ED;     /* Soft clay/beige for secondary surfaces */
    
    --primary-red: #E63946;   /* Vibrant red for primary accent */
    --primary-red-lt: #F1CED1;
    --mohom-blue: #5B728A;    /* Muted Indigo / Mo-Hom shirt color */
    --mohom-blue-lt: #8A9FB5;
    --cream: #FFF8E7;         /* Warm cream/ivory */
    --cream-lt: #FFFDF5;
    --mudmee-green: #6C967D;  /* Soft green for success/safe states */
    --brick-red: #C76B61;     /* Soft red for danger/fake states */

    --border: rgba(91, 114, 138, 0.15);
    --border-2: rgba(91, 114, 138, 0.25);
    
    /* ── ISAN TYPOGRAPHY ── */
    --serif: 'Poppins', sans-serif;    /* Playful, modern headers */
    --mono: 'Kanit', sans-serif;       /* Modern, clean UI text */
    --body: 'Sarabun', sans-serif;     /* Highly readable body text */
  }

  html { scroll-behavior: smooth; }

  body, #root {
    background: var(--bg-page);
    color: var(--text-main);
    font-family: var(--body);
    line-height: 1.75;
    overflow-x: hidden;
  }

  ::selection { background: var(--primary-red-lt); color: var(--text-main); }

  /* ── NAV ── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 1rem 3rem;
    background: rgba(253, 251, 247, 0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    transition: all 0.3s ease;
  }
  .nav-logo {
    font-family: var(--serif); font-size: 1.2rem; font-weight: 600;
    color: var(--text-main); letter-spacing: 0.02em;
  }
  .nav-logo span { color: var(--primary-red); }
  .nav-links { display: flex; gap: 2rem; list-style: none; }
  .nav-links a {
    font-family: var(--mono); font-size: 0.8rem; letter-spacing: 0.05em;
    text-transform: uppercase; font-weight: 500; color: var(--text-muted); text-decoration: none;
    transition: color 0.2s;
  }
  .nav-links a:hover { color: var(--primary-red); }

  /* ── SECTIONS ── */
  section { position: relative; }

  /* ── HERO ── */
  .hero {
    min-height: 100vh; display: flex; flex-direction: column;
    justify-content: flex-end; padding: 0 3rem 6rem;
    overflow: hidden;
  }
  .hero-bg {
    position: absolute; inset: 0; z-index: 0;
    background: radial-gradient(circle at 70% 30%, rgba(230, 57, 70, 0.08) 0%, transparent 60%),
                radial-gradient(circle at 30% 70%, rgba(91, 114, 138, 0.1) 0%, transparent 50%);
  }
  .hero-grid-lines {
    position: absolute; inset: 0; z-index: 0; opacity: 0.3;
    background-image: radial-gradient(var(--border-2) 1px, transparent 1px);
    background-size: 40px 40px;
  }
  .hero-waveform { display: none; } /* Removed for softer look */
  .hero-content { position: relative; z-index: 1; max-width: 900px; }
  .hero-kicker {
    font-family: var(--mono); font-size: 0.8rem; letter-spacing: 0.1em;
    text-transform: uppercase; font-weight: 500; color: var(--mohom-blue); margin-bottom: 1.5rem;
    display: flex; align-items: center; gap: 0.75rem;
  }
  .hero-kicker::before {
    content: ''; display: block; width: 2.5rem; height: 2px; background: var(--mohom-blue); border-radius: 2px;
  }
  .hero-title {
    font-family: var(--serif); font-size: clamp(2.8rem, 6vw, 5.5rem);
    font-weight: 700; line-height: 1.1; letter-spacing: -0.01em;
    color: var(--text-main); margin-bottom: 1.2rem;
  }
  .hero-title em { font-style: normal; color: var(--primary-red); }
  .hero-sub {
    font-family: var(--body); font-size: 1.2rem; color: var(--text-muted); max-width: 600px;
    line-height: 1.7; margin-bottom: 2.5rem; font-weight: 400;
  }
  .hero-ctas { display: flex; gap: 1rem; flex-wrap: wrap; }
  
  /* User-friendly pill buttons */
  .btn-primary {
    padding: 0.8rem 2rem; background: var(--primary-red);
    color: #fff; border: none; border-radius: 50px;
    font-family: var(--mono); font-size: 0.85rem; font-weight: 500; letter-spacing: 0.05em;
    text-transform: uppercase; cursor: pointer; transition: all 0.2s ease;
    text-decoration: none; display: inline-block;
    box-shadow: 0 4px 12px rgba(230, 57, 70, 0.25);
  }
  .btn-primary:hover { background: #D62839; transform: translateY(-2px); box-shadow: 0 6px 16px rgba(230, 57, 70, 0.35); }
  .btn-ghost {
    padding: 0.8rem 2rem; background: var(--surface);
    color: var(--mohom-blue); border: 1.5px solid var(--border-2); border-radius: 50px;
    font-family: var(--mono); font-size: 0.85rem; font-weight: 500; letter-spacing: 0.05em;
    text-transform: uppercase; cursor: pointer; transition: all 0.2s ease;
    text-decoration: none; display: inline-block;
  }
  .btn-ghost:hover { border-color: var(--mohom-blue); color: var(--mohom-blue); background: rgba(91, 114, 138, 0.05); transform: translateY(-2px); }
  
  .hero-scroll-hint {
    position: absolute; bottom: 2rem; right: 3rem; z-index: 1;
    font-family: var(--mono); font-size: 0.7rem; font-weight: 500; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--text-light); display: flex;
    align-items: center; gap: 0.5rem;
  }

  /* ── CONTENT WRAPPER ── */
  .container { max-width: 1100px; margin: 0 auto; padding: 0 3rem; }
  .section-pad { padding: 8rem 0; }

  /* ── SECTION LABELS ── */
  .section-label {
    font-family: var(--mono); font-size: 0.8rem; font-weight: 500; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--mohom-blue); margin-bottom: 1rem;
    display: flex; align-items: center; gap: 0.75rem;
  }
  .section-label::before {
    content: ''; display: block; width: 2rem; height: 2px; background: var(--mohom-blue); border-radius: 2px;
  }
  .section-title {
    font-family: var(--serif); font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 600; line-height: 1.2; color: var(--text-main);
    margin-bottom: 1.5rem; letter-spacing: -0.01em;
  }
  .section-title em { font-style: normal; color: var(--primary-red); }
  .section-body {
    font-size: 1.1rem; color: var(--text-muted); line-height: 1.8;
    max-width: 700px; font-weight: 400;
  }

  /* ── PROBLEM SECTION ── */
  .problem-bg { background: var(--surface-2); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
  
  .stat-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; margin: 4rem 0; }
  .stat-card { 
    background: var(--surface); padding: 2.5rem 2rem; text-align: center; 
    border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 4px 20px rgba(0,0,0,0.02);
  }
  .stat-value { font-family: var(--serif); font-size: 3.5rem; font-weight: 700; color: var(--silk-gold); line-height: 1; margin-bottom: 0.75rem; }
  .stat-label { font-family: var(--mono); font-size: 0.8rem; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-muted); }
  
  .failure-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 3rem; }
  .failure-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 16px;
    padding: 2.5rem; position: relative; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.02);
  }
  .failure-card::before {
    content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%;
    background: var(--silk-gold); border-radius: 4px 0 0 4px;
  }
  .failure-card.red::before { background: var(--brick-red); }
  .failure-num { font-family: var(--mono); font-size: 0.8rem; font-weight: 500; color: var(--text-light); margin-bottom: 0.75rem; }
  .failure-title { font-family: var(--serif); font-size: 1.4rem; font-weight: 600; color: var(--text-main); margin-bottom: 0.75rem; }
  .failure-body { font-size: 1rem; color: var(--text-muted); line-height: 1.7; }

  /* ── LINGUISTIC SECTION ── */
  .spectrogram-container { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 3rem 0; }
  .spectrogram-panel {
    background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 16px;
  }
  .spectrogram-label { font-family: var(--mono); font-size: 0.8rem; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 1rem; }
  .spectrogram-label.real { color: var(--mudmee-green); }
  .spectrogram-label.fake { color: var(--brick-red); }
  
  .tone-comparison {
    background: var(--surface); border: 1px solid var(--border); padding: 2rem; margin-top: 2rem; border-radius: 16px;
  }
  .tone-row { display: flex; align-items: center; gap: 1rem; margin: 1rem 0; }
  .tone-name { font-family: var(--mono); font-size: 0.85rem; min-width: 120px; color: var(--text-muted); }
  .tone-bar-wrap { flex: 1; height: 8px; background: var(--surface-2); border-radius: 4px; overflow: hidden; }
  .tone-bar { height: 100%; border-radius: 4px; transition: width 1.5s cubic-bezier(0.4,0,0.2,1); }

  /* ── DEMO SECTION ── */
  .demo-bg { background: var(--surface-2); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
  .demo-wrapper { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; }
  .upload-zone {
    border: 2px dashed var(--border-2); padding: 3rem 2rem; border-radius: 16px;
    text-align: center; cursor: pointer; transition: all 0.2s ease;
    background: var(--surface); position: relative;
  }
  .upload-zone:hover, .upload-zone.drag { border-color: var(--primary-red); background: rgba(230, 57, 70, 0.03); transform: translateY(-2px); }
  .upload-icon { font-size: 2.5rem; margin-bottom: 1rem; opacity: 0.8; color: var(--mohom-blue-lt); }
  .upload-text { font-family: var(--mono); font-size: 0.9rem; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-main); }
  .upload-sub { font-size: 0.9rem; color: var(--text-muted); margin-top: 0.5rem; }
  
  .sample-clips { margin-top: 1.5rem; }
  .sample-label { font-family: var(--mono); font-size: 0.75rem; font-weight: 500; text-transform: uppercase; color: var(--text-light); margin-bottom: 0.75rem; }
  .sample-btn {
    display: flex; align-items: center; gap: 0.75rem; width: 100%; border-radius: 12px;
    background: var(--surface); border: 1px solid var(--border); padding: 0.8rem 1.2rem;
    margin-bottom: 0.75rem; cursor: pointer; transition: all 0.2s ease; color: var(--text-main);
    font-family: var(--body); font-size: 1rem;
  }
  .sample-btn:hover { border-color: var(--mohom-blue); box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
  .sample-btn .tag {
    font-family: var(--mono); font-size: 0.7rem; font-weight: 500; text-transform: uppercase;
    padding: 0.2rem 0.6rem; border-radius: 50px;
  }
  .tag-real { background: rgba(108, 150, 125, 0.15); color: var(--mudmee-green); }
  .tag-fake { background: rgba(199, 107, 97, 0.15); color: var(--brick-red); }

  /* Result display */
  .result-panel { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 2rem; box-shadow: 0 8px 24px rgba(0,0,0,0.03); }
  .result-idle { display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 320px; color: var(--text-light); text-align: center; }
  .result-idle-icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.5; color: var(--text-light); }
  .result-idle-text { font-family: var(--mono); font-size: 0.85rem; font-weight: 500; text-transform: uppercase; }

  .result-score-wrap { position: relative; margin-bottom: 2rem; }
  .result-big-num { font-family: var(--serif); font-size: 5.5rem; font-weight: 700; line-height: 1; }
  .result-big-num.safe { color: var(--mudmee-green); }
  .result-big-num.danger { color: var(--brick-red); }
  .result-pct { font-family: var(--mono); font-size: 1.2rem; color: var(--text-muted); }
  .result-verdict { font-size: 1.2rem; font-weight: 500; color: var(--text-main); margin-bottom: 1.5rem; }
  
  .confidence-bar-wrap { background: var(--surface-2); height: 8px; margin: 1rem 0 0.5rem; border-radius: 4px; overflow: hidden; }
  .confidence-bar { height: 100%; border-radius: 4px; transition: width 1.5s cubic-bezier(0.4,0,0.2,1); }
  .confidence-bar.safe { background: var(--mudmee-green); }
  .confidence-bar.danger { background: var(--brick-red); }
  .confidence-label { font-family: var(--mono); font-size: 0.75rem; font-weight: 500; color: var(--text-muted); }
  
  .result-metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.5rem; }
  .metric-chip { background: var(--surface-2); border-radius: 12px; padding: 1rem; text-align: center; }
  .metric-val { font-family: var(--mono); font-size: 1.2rem; color: var(--text-main); font-weight: 500; }
  .metric-key { font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem; }

  .analyzing { text-align: center; padding: 3rem 0; }
  .analyzing-text { font-family: var(--mono); font-size: 0.85rem; font-weight: 500; color: var(--mohom-blue); }
  .pulse-dots span { display: inline-block; width: 8px; height: 8px; background: var(--primary-red); border-radius: 50%; margin: 0 4px; animation: pulse 1.2s infinite; }
  .pulse-dots span:nth-child(2) { animation-delay: 0.2s; }
  .pulse-dots span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes pulse { 0%,80%,100%{opacity:0.3;transform:scale(0.8)} 40%{opacity:1;transform:scale(1)} }

  /* ── TECH SECTION ── */
  .pipeline-steps { margin: 3rem 0; }
  .pipeline-step { display: flex; gap: 2rem; margin-bottom: 0; position: relative; }
  .pipeline-step:not(:last-child)::after {
    content: ''; position: absolute; left: 1.4rem; top: 3.2rem; bottom: -1.5rem;
    width: 2px; background: var(--border);
  }
  .step-num-wrap { flex-shrink: 0; }
  .step-num {
    width: 3rem; height: 3rem; border-radius: 50%; border: 2px solid var(--border-2);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--mono); font-size: 0.9rem; font-weight: 500; color: var(--mohom-blue);
    background: var(--surface); flex-shrink: 0; box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  }
  .step-content { padding-bottom: 2.5rem; }
  .step-title { font-family: var(--serif); font-size: 1.2rem; font-weight: 600; color: var(--text-main); margin-bottom: 0.35rem; }
  .step-body { font-size: 1rem; color: var(--text-muted); line-height: 1.7; }
  .step-code { font-family: var(--mono); font-size: 0.85rem; background: var(--surface-2); border-radius: 6px; padding: 0.4rem 0.8rem; color: var(--mudmee-green); display: inline-block; margin-top: 0.75rem; }

  .tech-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 3rem; }
  .tech-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 1.75rem; box-shadow: 0 2px 12px rgba(0,0,0,0.02); }
  .tech-card-label { font-family: var(--mono); font-size: 0.75rem; font-weight: 500; text-transform: uppercase; color: var(--mohom-blue); margin-bottom: 0.5rem; }
  .tech-card-val { font-family: var(--serif); font-size: 1.25rem; font-weight: 600; color: var(--text-main); }

  .equation-block {
    background: var(--surface); border-left: 4px solid var(--silk-gold); border-radius: 0 12px 12px 0;
    padding: 1.5rem 2rem; margin: 2rem 0; font-family: var(--mono);
    font-size: 1.1rem; color: var(--text-main); box-shadow: 0 2px 12px rgba(0,0,0,0.02);
  }
  .equation-sub { font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem; font-family: var(--body); }

  /* ── STORY SECTION ── */
  .story-layout { display: grid; grid-template-columns: 1fr 2fr; gap: 5rem; align-items: start; }
  .story-aside { position: sticky; top: 8rem; }
  .story-num { font-family: var(--serif); font-size: 8rem; font-weight: 700; color: var(--silk-gold-lt); line-height: 1; margin-bottom: -1rem; opacity: 0.5; }
  .story-quote { border-left: 4px solid var(--primary-red); padding-left: 1.5rem; margin: 2rem 0; }
  .story-quote p { font-family: var(--serif); font-size: 1.25rem; color: var(--text-main); line-height: 1.65; }
  .story-body p { font-size: 1.1rem; color: var(--text-muted); line-height: 1.85; margin-bottom: 1.5rem; font-weight: 400; }
  .story-body p strong { color: var(--text-main); font-weight: 500; }

  /* ── CTA SECTION ── */
  .cta-bg { background: var(--surface-2); border-top: 1px solid var(--border); }
  .cta-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; margin: 4rem 0; }
  .cta-card {
    background: var(--surface); border: 1px solid var(--border); padding: 2.5rem 2rem; border-radius: 16px;
    transition: all 0.2s ease; display: flex; flex-direction: column; box-shadow: 0 4px 12px rgba(0,0,0,0.02);
  }
  .cta-card:hover { border-color: var(--primary-red-lt); transform: translateY(-4px); box-shadow: 0 8px 24px rgba(230, 57, 70, 0.08); }
  .cta-audience { font-family: var(--mono); font-size: 0.75rem; font-weight: 500; text-transform: uppercase; color: var(--primary-red); margin-bottom: 1rem; }
  .cta-title { font-family: var(--serif); font-size: 1.4rem; font-weight: 600; color: var(--text-main); margin-bottom: 0.75rem; }
  .cta-body { font-size: 1rem; color: var(--text-muted); line-height: 1.7; flex: 1; margin-bottom: 1.5rem; }
  .cta-link { font-family: var(--mono); font-size: 0.85rem; font-weight: 500; text-transform: uppercase; color: var(--mohom-blue); text-decoration: none; display: flex; align-items: center; gap: 0.5rem; transition: gap 0.2s; }
  .cta-link:hover { gap: 0.8rem; color: var(--primary-red); }
  
  .closing-line { font-family: var(--serif); font-size: 1.25rem; color: var(--text-muted); max-width: 700px; text-align: center; margin: 0 auto; line-height: 1.7; }

  /* ── FOOTER ── */
  .footer { border-top: 1px solid var(--border); padding: 2.5rem 3rem; display: flex; justify-content: space-between; align-items: center; background: var(--surface); }
  .footer-left, .footer-right { font-family: var(--mono); font-size: 0.8rem; font-weight: 400; color: var(--text-light); }

  /* ── DIVIDER ── */
  .divider { width: 100%; height: 1px; background: var(--border); margin: 3rem 0; }

  /* ── ANIMATIONS ── */
  .fade-in { opacity: 0; transform: translateY(24px); transition: opacity 0.8s ease, transform 0.8s ease; }
  .fade-in.visible { opacity: 1; transform: translateY(0); }

  @media (max-width: 768px) {
    .nav { padding: 1rem 1.5rem; }
    .nav-links { display: none; }
    .hero { padding: 0 1.5rem 4rem; }
    .container { padding: 0 1.5rem; }
    .stat-grid, .failure-grid, .demo-wrapper, .spectrogram-container, .tech-grid, .story-layout, .cta-grid { grid-template-columns: 1fr; }
    .story-aside { position: static; }
    .footer { flex-direction: column; gap: 1rem; text-align: center; }
  }
`;

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  // eslint-disable-next-line no-unused-vars
  const [scrolled, setScrolled] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [toneVisible, setToneVisible] = useState(false);
  const toneRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setToneVisible(true); },
      { threshold: 0.3 }
    );
    if (toneRef.current) obs.observe(toneRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{STYLES}</style>

      {/* ── NAV ── */}
      {/* <nav className="nav" style={{ borderBottomColor: scrolled ? "var(--border-2)" : "transparent" }}>
        <div className="nav-logo">Siang <span>Isan</span></div>
        <ul className="nav-links">
          <li><a href="#problem">Problem</a></li>
          <li><a href="#linguistics">Linguistics</a></li>
          <li><a href="#demo">Demo</a></li>
          <li><a href="#tech">Architecture</a></li>
          <li><a href="#story">Story</a></li>
        </ul>
      </nav> */}

      {/* ══════════════════════════════════════════════════════════════
                01 — HERO
          ══════════════════════════════════════════════════════════════ */}
      <HeroSection />

      {/* ══════════════════════════════════════════════════════════════
          02 — THE PROBLEM
      ══════════════════════════════════════════════════════════════ */}
      <section id="problem" className="problem-bg section-pad">
        <div className="container">
          <FadeIn>
            {/* <div className="section-label">02 — The Problem</div> */}
            <h2 className="section-title">A technology that works <br /><em>just not for you</em></h2>
            <p className="section-body">
              Every voice security system you interact with was built on audio
              collected in recording studios, research labs, and cities where people
              don't speak like you do. The result is invisible, systematic exclusion.
            </p>
          </FadeIn>

          <FadeIn delay={150}>
            <div className="stat-grid">
              <div className="stat-card">
                <div className="stat-value">20M+</div>
                <div className="stat-label">Isan speakers in Thailand</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">&lt;5%</div>
                <div className="stat-label">of global voice datasets include regional Thai dialects</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">6–7</div>
                <div className="stat-label">tones in Isan dialects</div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="failure-grid">
              <div className="failure-card">
                <div className="failure-num">Failure Mode A</div>
                <div className="failure-title">False Rejection</div>
                <div className="failure-body">
                  A legitimate Isan speaker is flagged as a potential spoof.
                  The model has never learned what authentic Isan sounds like,
                  so it treats genuine tonal patterns as synthetic artifacts.
                  The person is locked out. The system was supposed to protect
                  them — and instead it excludes them.
                </div>
              </div>
              <div className="failure-card red">
                <div className="failure-num">Failure Mode B</div>
                <div className="failure-title">False Acceptance</div>
                <div className="failure-body">
                  A scammer using a voice synthesis tool produces a rough
                  imitation of an Isan accent. Because the model has no
                  reference for genuine Isan speech, it cannot detect the
                  artifacts that reveal the fake. The attack succeeds.
                  The community is defenseless.
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          03 — LINGUISTICS
      ══════════════════════════════════════════════════════════════ */}
      <section id="linguistics" className="section-pad">
        <div className="container">
          <FadeIn>
            {/* <div className="section-label">03 — How Isan Sounds Different</div> */}
            <h2 className="section-title">The acoustic <em>fingerprint</em></h2>
            <p className="section-body">
              Isan is not a "different accent." It is a distinct tonal language.
              Understanding what makes it different is the key to understanding
              why standard models fail — and how this one succeeds.
            </p>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="spectrogram-container">
              <div className="spectrogram-panel">
                <div className="spectrogram-label real">◉ Genuine Isan Speech</div>
                <SpectrogramCanvas isReal={true} animated={true} />
                <p style={{ fontSize: "0.78rem", color: "var(--fog)", lineHeight: 1.6, marginTop: "0.75rem" }}>
                  Natural jitter and shimmer in tonal transitions. Irregular micro-variations
                  across formant regions. Energy present above 6 kHz.
                </p>
              </div>
              <div className="spectrogram-panel">
                <div className="spectrogram-label fake">◈ Synthetic Isan Clone</div>
                <SpectrogramCanvas isReal={false} animated={true} />
                <p style={{ fontSize: "0.78rem", color: "var(--fog)", lineHeight: 1.6, marginTop: "0.75rem" }}>
                  Unnaturally regular periodicity. "Synthetic silence" above 7 kHz.
                  Absent micro-variations that define real vocal tract behavior.
                </p>
              </div>
            </div>
          </FadeIn>

          {/* <FadeIn delay={200}>
            <div ref={toneRef} className="tone-comparison">
              <div style={{ fontFamily: "var(--mono)", fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--indigo-lt)", marginBottom: "1.25rem" }}>
                Tonal complexity comparison
              </div>
              {[
                { name: "Central Thai", tones: 5, max: 7, color: "var(--fog)" },
                { name: "Standard Isan", tones: 6, max: 7, color: "var(--teal)" },
                { name: "Korat Isan dialect", tones: 7, max: 7, color: "var(--indigo-lt)" },
                { name: "Ubon dialect", tones: 6, max: 7, color: "var(--teal)" },
              ].map(row => (
                <div key={row.name} className="tone-row">
                  <span className="tone-name">{row.name}</span>
                  <div className="tone-bar-wrap">
                    <div
                      className="tone-bar"
                      style={{
                        width: toneVisible ? `${(row.tones / row.max) * 100}%` : "0%",
                        background: row.color,
                        transitionDelay: "200ms",
                      }}
                    />
                  </div>
                  <span style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", color: row.color, minWidth: "1.5rem", textAlign: "right" }}>{row.tones}</span>
                </div>
              ))}
              <p style={{ fontSize: "0.82rem", color: "var(--fog)", marginTop: "1rem", lineHeight: 1.65 }}>
                Each additional tone represents a complete set of minimal pairs — words
                with identical consonants and vowels that differ only in pitch. A model
                trained on 5 tones treats the extra tonal gestures as noise, causing
                systematic errors in both directions.
              </p>
            </div>
          </FadeIn> */}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          04 — ORIGIN STORY
      ══════════════════════════════════════════════════════════════ */}
      {/* <section id="story" className="section-pad" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <FadeIn>
            <div className="section-label">04 — The Origin</div>
          </FadeIn>
          <div className="story-layout">
            <FadeIn delay={50}>
              <div className="story-aside">
                <div className="story-num">04</div>
                <div className="story-quote">
                  <p>"I didn't build this to prove a technical point. I built it because
                  the people I grew up around deserve the same protection as everyone else."</p>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={150}>
              <div className="story-body">
                <h2 className="section-title" style={{ fontSize: "2.2rem" }}>
                  Why this dialect.<br />Why this <em>problem.</em>
                </h2>
                <p>
                  Voice security is not an abstract engineering problem. It is the
                  difference between an elderly woman in Khon Kaen being able to
                  verify her identity at her bank — or not. It is the difference
                  between a family recognizing that the voice on the phone is a
                  scammer — or wiring money they cannot afford to lose.
                </p>
                <p>
                  The Northeast of Thailand is one of the most densely populated
                  regions in the country. It is also one of the most underrepresented
                  in the data that trains the systems making decisions about its people.
                  <strong> That gap is not accidental — but fixing it can be.</strong>
                </p>
                <p>
                  This project starts with a single model, trained on a single
                  dialect group, solving a narrow problem well. The ambition is
                  that it proves a method: that targeted, community-specific
                  datasets can close the gaps that generic large-scale training
                  leaves behind.
                </p>
                <div style={{ marginTop: "2rem", display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                  {[
                    { val: "50+", label: "Hours of curated audio" },
                    { val: "4", label: "Sub-dialects represented" },
                    { val: "4+", label: "Age demographics covered" },
                  ].map(s => (
                    <div key={s.val} style={{ textAlign: "center" }}>
                      <div style={{ fontFamily: "var(--serif)", fontSize: "2.2rem", fontWeight: 900, color: "var(--amber-lt)" }}>{s.val}</div>
                      <div style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--fog)", marginTop: "0.25rem" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section> */}

      {/* ══════════════════════════════════════════════════════════════
          05 — DEMO (component)
      ══════════════════════════════════════════════════════════════ */}
      <DemoSection />

      {/* ══════════════════════════════════════════════════════════════
          06 — ARCHITECTURE
      ══════════════════════════════════════════════════════════════ */}
      <section id="tech" className="section-pad" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <FadeIn>
            {/* <div className="section-label">06 — Under the Hood</div> */}
            <h2 className="section-title">The inference <em>pipeline</em></h2>
            <p className="section-body">
              The model never receives raw audio. It receives a visual representation
              of sound — a log-power spectrogram — which encodes the acoustic structure
              that separates real voices from synthetic ones.
            </p>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="equation-block">
              S(f, t) = log( |STFT( x(t) )|² )
              <div className="equation-sub">
                Log-power spectrogram · captures energy distribution across frequency bands over time
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={150}>
            <div className="pipeline-steps">
              {[
                { n: "01", title: "Audio ingestion", body: "User uploads .wav or .mp3 via the web interface. FastAPI validates format, size (max 10 MB), and minimum duration.", code: "POST /api/analyze" },
                { n: "02", title: "Normalization", body: "Audio is resampled to 16 kHz mono using librosa or torchaudio. Amplitude is normalized to prevent scale-dependent errors.", code: "16 kHz · mono · normalized" },
                { n: "03", title: "STFT → log-power spectrogram", body: "Short-Time Fourier Transform converts the waveform into a time-frequency representation. Log scaling compresses the dynamic range to match the model's training distribution.", code: "librosa.stft() → log(|S|²)" },
                { n: "04", title: "Model inference", body: "The spectrogram tensor is passed to the ResNet-based classifier loaded from model.pth. The model was trained to distinguish natural acoustic irregularities from synthetic regularity.", code: "model.pth · torch.no_grad()" },
                { n: "05", title: "Spoof score output", body: "The network outputs a scalar in [0, 1] representing the probability that the input was synthetically generated. The result is returned as JSON and rendered to the user.", code: "{ score: 0.07, risk: 'low' }" },
              ].map((step, i) => (
                <div key={i} className="pipeline-step">
                  <div className="step-num-wrap">
                    <div className="step-num">{step.n}</div>
                  </div>
                  <div className="step-content">
                    <div className="step-title">{step.title}</div>
                    <div className="step-body">{step.body}</div>
                    <div className="step-code">{step.code}</div>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
{/* 
          <FadeIn delay={200}>
            <div className="tech-grid">
              {[
                { label: "Framework", val: "PyTorch — model.pth loaded once at server startup via singleton pattern" },
                { label: "Backend", val: "FastAPI · Python 3.10+ · async inference endpoint" },
                { label: "Architecture", val: "ResNet-based binary classifier trained on log-power spectrograms" },
                { label: "Metric", val: "Equal Error Rate (EER) reported on held-out Isan validation set" },
                { label: "Frontend", val: "React · no heavy framework · waveform and spectrogram rendered on canvas" },
                { label: "Privacy", val: "Audio processed in memory only · nothing written to disk after response" },
              ].map((c, i) => (
                <div key={i} className="tech-card">
                  <div className="tech-card-label">{c.label}</div>
                  <div className="tech-card-val">{c.val}</div>
                </div>
              ))}
            </div>
          </FadeIn> */}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          07 — CTA
      ══════════════════════════════════════════════════════════════ */}
      {/* <section className="cta-bg section-pad">
        <div className="container">
          <FadeIn>
            <div className="section-label">07 — What Comes Next</div>
            <h2 className="section-title">The work continues.<br /><em>Join it.</em></h2>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="cta-grid">
              <div className="cta-card">
                <div className="cta-audience">For recruiters & engineers</div>
                <div className="cta-title">View the full codebase</div>
                <div className="cta-body">
                  Training scripts, feature engineering pipeline, model architecture,
                  and evaluation results — all documented on GitHub.
                </div>
                <a href="#" className="cta-link">GitHub repository →</a>
              </div>
              <div className="cta-card">
                <div className="cta-audience">For the Isan community</div>
                <div className="cta-title">Contribute your voice</div>
                <div className="cta-body">
                  The model improves with every genuine Isan recording added to
                  the dataset. Your voice makes this shield stronger for everyone.
                </div>
                <a href="#" className="cta-link">Join the dataset →</a>
              </div>
              <div className="cta-card">
                <div className="cta-audience">For the public</div>
                <div className="cta-title">Learn to spot a voice scam</div>
                <div className="cta-body">
                  Voice phishing is increasing across rural Thailand. A short guide
                  on how synthetic voices work — and how to stay safe.
                </div>
                <a href="#" className="cta-link">Read the guide →</a>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="divider" />
            <p className="closing-line">
              "This model was built for 20 million people who never asked to be excluded from
              the future. It was built by someone who didn't want to be one of them."
            </p>
          </FadeIn>
        </div>
      </section> */}

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-left"> Isan Anti-Spoofing Project · Northeast Thailand</div>
        {/* <div className="footer-right">Built with PyTorch · FastAPI · React</div> */}
      </footer>
    </>
  );
}
