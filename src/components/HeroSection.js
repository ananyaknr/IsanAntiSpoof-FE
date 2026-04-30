// eslint-disable-next-line no-unused-vars
import { useRef, useEffect } from "react";
import WaveformSVG from "./WaveformSVG";
// import { FadeIn } from "./FadeIn";

const HERO_STYLES = `
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

  /* ── HERO ── */
  .hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 0 3rem 6rem;
    overflow: hidden;
    position: relative;
  }

  .hero-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
    background: radial-gradient(circle at 70% 30%, rgba(230, 57, 70, 0.08) 0%, transparent 60%),
                radial-gradient(circle at 30% 70%, rgba(91, 114, 138, 0.1) 0%, transparent 50%);
  }

  .hero-grid-lines {
    position: absolute;
    inset: 0;
    z-index: 0;
    opacity: 0.3;
    background-image: radial-gradient(var(--border-2) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  .hero-waveform {
    display: none;
  }

  .hero-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
    position: relative;
    z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
    width: 100%;
  }

  .hero-content {
    position: relative;
    z-index: 1;
    max-width: 900px;
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(220, 167, 90, 0.15);
    border: 1px solid var(--silk-gold);
    padding: 0.5rem 1.2rem;
    border-radius: 50px;
    margin-bottom: 2rem;
  }

  .badge-icon {
    font-size: 1rem;
  }

  .badge-text {
    font-family: var(--body);
    font-weight: 600;
    color: var(--silk-gold);
    font-size: 0.95rem;
    letter-spacing: 0.02em;
  }

  .hero-kicker {
    font-family: var(--mono);
    font-size: 0.8rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-weight: 500;
    color: var(--mohom-blue);
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .hero-kicker::before {
    content: '';
    display: block;
    width: 2.5rem;
    height: 2px;
    background: var(--mohom-blue);
    border-radius: 2px;
  }

  .hero-title {
    font-family: var(--serif);
    font-size: clamp(2.8rem, 6vw, 5.5rem);
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.01em;
    color: var(--text-main);
    margin-bottom: 1.2rem;
  }

  .hero-title em {
    font-style: normal;
    color: var(--primary-red);
  }

  .hero-sub {
    font-family: var(--body);
    font-size: 1.2rem;
    color: var(--text-muted);
    max-width: 600px;
    line-height: 1.7;
    margin-bottom: 2.5rem;
    font-weight: 400;
  }

  .hero-ctas {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .btn-primary {
    padding: 0.8rem 2rem;
    background: var(--primary-red);
    color: #fff;
    border: none;
    border-radius: 50px;
    font-family: var(--mono);
    font-size: 0.85rem;
    font-weight: 500;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
    display: inline-block;
    box-shadow: 0 4px 12px rgba(212, 121, 144, 0.25);
  }

  .btn-primary:hover {
    background: #C4677E;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(212, 121, 144, 0.35);
  }

  .btn-ghost {
    padding: 0.8rem 2rem;
    background: var(--surface);
    color: var(--mohom-blue);
    border: 1.5px solid var(--border-2);
    border-radius: 50px;
    font-family: var(--mono);
    font-size: 0.85rem;
    font-weight: 500;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
    display: inline-block;
  }

  .btn-ghost:hover {
    border-color: var(--mohom-blue);
    color: var(--mohom-blue);
    background: rgba(91, 114, 138, 0.05);
    transform: translateY(-2px);
  }

  .hero-visual {
    position: relative;
    display: flex;
    justify-content: center;
  }

  .avatar-wrapper {
    position: relative;
    width: 100%;
    max-width: 450px;
    animation: floatAvatar 6s ease-in-out infinite;
  }

  .avatar-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120%;
    height: 120%;
    background: radial-gradient(circle, rgba(212, 121, 144, 0.15) 0%, transparent 60%);
    z-index: -1;
    border-radius: 50%;
  }

  .hero-avatar {
    width: 100%;
    height: auto;
    object-fit: contain;
    filter: drop-shadow(0 20px 30px rgba(0,0,0,0.08));
  }

  .floating-text {
    position: absolute;
    font-family: var(--serif);
    font-weight: 700;
    font-size: 1.1rem;
    padding: 0.6rem 1.2rem;
    border-radius: 12px;
    background: var(--surface);
    box-shadow: 0 8px 24px rgba(0,0,0,0.06);
    border: 1px solid var(--border);
    z-index: 2;
  }

  .float-1 {
    top: 10%;
    right: -5%;
    color: var(--primary-red);
    animation: floatDelayed 5s ease-in-out infinite;
  }

  .float-2 {
    bottom: 20%;
    left: -10%;
    color: var(--mohom-blue);
    animation: floatDelayed 7s ease-in-out infinite reverse;
  }

  @keyframes floatAvatar {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }

  @keyframes floatDelayed {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-15px) rotate(4deg); }
  }

  .hero-scroll-hint {
    position: absolute;
    bottom: 2rem;
    right: 3rem;
    z-index: 1;
    font-family: var(--mono);
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-light);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .fade-in {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }

  .fade-in.visible {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    .hero {
      padding: 0 1.5rem 4rem;
    }
    .hero-layout {
      grid-template-columns: 1fr;
      text-align: center;
      padding-top: 4rem;
    }
    .hero-badge {
      margin: 0 auto 2rem;
    }
    .hero-sub {
      margin: 0 auto 2.5rem;
    }
    .hero-ctas {
      justify-content: center;
    }
    .avatar-wrapper {
      max-width: 320px;
      margin: 3rem auto 0;
    }
    .float-1 {
      right: 0;
      top: 0;
    }
    .float-2 {
      left: 0;
      bottom: 10%;
    }
  }
`;

export default function HeroSection() {
  useEffect(() => {
    const fadeEls = document.querySelectorAll('section.hero .fade-in');
    fadeEls.forEach((el, index) => {
      el.style.transitionDelay = `${index * 100}ms`;
      el.classList.add('visible');
    });
  }, []);

  return (
    <>
      <style>{HERO_STYLES}</style>
      <section className="hero" id="top">
        <div className="hero-bg" />
        <div className="hero-grid-lines" />

        <div className="hero-waveform">
          <WaveformSVG color="rgba(212, 121, 144, 0.15)" height={200} />
        </div>

        <div className="hero-layout">
          <div className="hero-content">
            {/* <div className="hero-badge fade-in">
              <span className="badge-icon">✨</span>
              <span className="badge-text">ของแท้บ่ตั๋ว • Authentic, No Fakes</span>
            </div> */}

            <h1 className="hero-title fade-in">
              Man-Khak<br />
              <small style={{ fontSize: '0.5em', display: 'block', fontWeight: 'normal', marginTop: '10px' }}>
                The Northeast<br />
                has a voice. <em>Now it has a shield.</em>
              </small>
            </h1>

            <p className="hero-sub fade-in">
              A machine learning project that teaches AI to distinguish a genuine
              Isan voice from a machine-made fake.
            </p>

            <div className="hero-ctas fade-in">
              <a href="#demo" className="btn-primary">See live demo</a>
              <a href="#problem" className="btn-ghost">Hear the story</a>
            </div>
          </div>

          <div className="hero-visual fade-in">
            <div className="avatar-wrapper">
              <div className="avatar-glow"></div>
              <img
                src="avatar.png"
                alt="3D Isan Avatar"
                className="hero-avatar"
              />

              <div className="floating-text float-1">ตรวจภาษาอีสาน</div>
              <div className="floating-text float-2">ปลอดภัยขึ้น</div>
            </div>
          </div>
        </div>

        <div className="hero-scroll-hint">
          <span>Scroll to explore</span>
          <span style={{ fontSize: "1.2rem", marginTop: "4px" }}>↓</span>
        </div>
      </section>
    </>
  );
}
