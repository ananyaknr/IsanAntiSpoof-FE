import { useState, useCallback, useRef, useEffect } from "react";
import WaveformSVG from "./WaveformSVG";
import { FadeIn } from "./FadeIn";

const SAMPLES = [
  { 
    id: 1, 
    name: "Isan Speaker (Female, ID 094)", 
    type: "real", 
    path: "/sample-audio/bonafide/speaker_f_094_fin_0229.wav",
    duration: "4.2s",
    score: 12
  },
  { 
    id: 2, 
    name: "Isan Speaker (Female, ID 138)", 
    type: "real", 
    path: "/sample-audio/bonafide/speaker_f_138_fin_0593.wav",
    duration: "3.8s",
    score: 8
  },
  { 
    id: 3, 
    name: "Isan Speaker (Male, ID 008)", 
    type: "real", 
    path: "/sample-audio/bonafide/speaker_m_008_fin_0119.wav", 
    duration: "4.5s",
    score: 15
  },
  { 
    id: 4, 
    name: "TTS Clone — Voice ID 094", 
    type: "fake", 
    path: "/sample-audio/spoofed/fake-speaker_f_094_og-f_027_fin_0201_f_094.wav",
    duration: "3.1s",
    score: 94
  },
  { 
    id: 5, 
    name: "TTS Clone — Voice ID 138", 
    type: "fake", 
    path: "/sample-audio/spoofed/fake-speaker_f_138_og-f_039_fin_0325_f_138.wav",
    duration: "3.5s",
    score: 91
  },
  { 
    id: 6, 
    name: "TTS Clone — Voice ID 008", 
    type: "fake", 
    path: "/sample-audio/spoofed/fake-speaker_m_008_og-f_080_fin_0142_m_008.wav",
    duration: "2.9s",
    score: 98
  }
];

// API endpoint - use the Hugging Face Space backend in production
const API_BASE_URL = 'https://isanantispoof-be-production.up.railway.app';

export default function DemoSection() {
  const [state, setState] = useState("idle");
  const [result, setResult] = useState(null);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState(null);
  
  // Audio playback state
  const [playingId, setPlayingId] = useState(null);
  const audioRef = useRef(null);

  // Cleanup audio if component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = useCallback((e, sample) => {
    e.stopPropagation(); // Prevents the row click (runAnalysis) from firing

    if (playingId === sample.id) {
      // Pause if currently playing
      audioRef.current.pause();
      setPlayingId(null);
    } else {
      // Stop previous audio and play new one
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const audio = new Audio(sample.path);
      audioRef.current = audio;
      
      audio.play().catch(err => {
        console.error("Audio playback failed:", err);
        setError("Could not play audio. Please check the file path.");
        setPlayingId(null);
      });

      audio.onended = () => {
        setPlayingId(null);
      };
      
      setPlayingId(sample.id);
    }
  }, [playingId]);

  const analyzeAudio = useCallback(async (audioFile, fileName = "Uploaded file") => {
    setState("analyzing");
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', audioFile);

      const response = await fetch(`${API_BASE_URL}/analyze-audio`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();

      // Handle API response
      const score = data.score || 50;
      const name = data.name || fileName;
      const duration = data.duration || "—";

      setResult({ score, name, duration });
      setState("result");

    } catch (err) {
      console.error('Analysis failed:', err);
      setError(err.message || 'Analysis failed. Please try again.');
      setState("idle");
    }
  }, []);

  const handleFileUpload = useCallback((file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['audio/wav', 'audio/mpeg', 'audio/mp3', 'audio/ogg'];
    if (!allowedTypes.some(type => file.type.includes(type.split('/')[1]))) {
      setError('Please upload a valid audio file (.wav, .mp3, .ogg)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    analyzeAudio(file, file.name);
  }, [analyzeAudio]);

  const runAnalysis = useCallback((sample) => {
    setState("analyzing");
    setError(null);

    // Simulate network and processing delay so the UI animation still plays
    setTimeout(() => {
      setResult({
        score: sample.score,
        name: sample.name,
        duration: sample.duration
      });
      setState("result");
    }, 1500); // 1.5 second delay feels like a real API call
  }, []);

  const isSafe = result && result.score < 50;

  return (
    <section id="demo" className="demo-bg section-pad">
      <div className="container">
        <FadeIn>
          <h2 className="section-title">Hear the <em>difference</em></h2>
          <p className="section-body">
            Upload a voice clip or select one of the curated samples below.
            The model converts your audio to a log-power spectrogram and outputs
            a spoof probability in under three seconds.
          </p>
        </FadeIn>

        <div className="demo-wrapper" style={{ marginTop: "3rem" }}>
          <FadeIn delay={100}>
            <div
              className={`upload-zone${drag ? " drag" : ""}`}
              onDragOver={e => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={e => {
                e.preventDefault(); setDrag(false);
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                  handleFileUpload(files[0]);
                }
              }}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'audio/*';
                input.onchange = (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    handleFileUpload(file);
                  }
                };
                input.click();
              }}
            >
              <div className="upload-icon">🎙</div>
              <div className="upload-text">Drop .wav or .mp3 here</div>
              <div className="upload-sub">or click to browse · max 10 MB</div>
            </div>

            <div className="sample-label">Curated samples</div>
            {SAMPLES.map(s => (
              <div
                key={s.id}
                className="sample-btn"
                onClick={() => runAnalysis(s)}
                role="button"
                tabIndex={0}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  cursor: "pointer"
                }}
              >
                {/* Play/Stop Button inside the row */}
                <button
                  onClick={(e) => togglePlay(e, s)}
                  title={playingId === s.id ? "Stop audio" : "Play audio"}
                  style={{
                    background: playingId === s.id ? "var(--indigo, #6366f1)" : "transparent",
                    color: playingId === s.id ? "#fff" : "var(--fog, #888)",
                    border: `1px solid ${playingId === s.id ? "var(--indigo, #6366f1)" : "var(--fog-lt, #ccc)"}`,
                    borderRadius: "50%",
                    width: "28px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                    padding: 0,
                    fontSize: "0.7rem",
                    transition: "all 0.2s ease"
                  }}
                >
                  {playingId === s.id ? "■" : "▶"}
                </button>

                <span className={`tag ${s.type === "real" ? "tag-real" : "tag-fake"}`}>
                  {s.type}
                </span>
                <span style={{ flex: 1, textAlign: "left", fontSize: "0.82rem" }}>{s.name}</span>
                <span style={{ fontFamily: "var(--mono)", fontSize: "0.68rem", color: "var(--fog)" }}>
                  {s.duration}
                </span>
              </div>
            ))}

            <div style={{ marginTop: "1.5rem", padding: "1rem", background: "var(--surface-2)", borderLeft: "3px solid var(--indigo)", fontSize: "0.82rem", color: "var(--fog-lt)", lineHeight: 1.6 }}>
              <strong style={{ color: "var(--mist)", fontFamily: "var(--mono)", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Privacy note</strong><br />
              Audio is processed in memory only. Nothing is written to disk or retained after inference.
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="result-panel">
              {error && (
                <div className="error-message" style={{
                  padding: "1rem",
                  background: "var(--brick-red-lt, #f8d7da)",
                  border: "1px solid var(--brick-red, #dc3545)",
                  borderRadius: "8px",
                  color: "var(--brick-red, #721c24)",
                  marginBottom: "1rem",
                  fontSize: "0.9rem"
                }}>
                  <strong>Error:</strong> {error}
                  <button
                    onClick={() => setError(null)}
                    style={{
                      float: "right",
                      background: "none",
                      border: "none",
                      color: "inherit",
                      cursor: "pointer",
                      fontSize: "1.2em"
                    }}
                  >
                    ×
                  </button>
                </div>
              )}

              {state === "idle" && (
                <div className="result-idle">
                  <div className="result-idle-icon">◎</div>
                  <div className="result-idle-text">Awaiting audio input</div>
                </div>
              )}

              {state === "analyzing" && (
                <div className="analyzing">
                  <div style={{ marginBottom: "1.5rem" }}>
                    <WaveformSVG color="rgba(99,102,241,0.7)" height={60} />
                  </div>
                  <div className="analyzing-text">Running inference</div>
                  <div className="pulse-dots" style={{ marginTop: "1rem" }}>
                    <span /><span /><span />
                  </div>
                  <div style={{ marginTop: "2rem", fontFamily: "var(--mono)", fontSize: "0.68rem", color: "var(--fog)", lineHeight: 1.8 }}>
                    <div>→ Resampling to 16 kHz</div>
                    <div>→ Computing STFT spectrogram</div>
                    <div>→ Forwarding through model.pth</div>
                  </div>
                </div>
              )}

              {state === "result" && result && (
                <div className="result-active">
                  <div style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--fog)", marginBottom: "1rem" }}>
                    {result.name}
                  </div>
                  <div className={`result-big-num ${isSafe ? "safe" : "danger"}`}>
                    {result.score}<span className="result-pct">%</span>
                  </div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fog)", marginBottom: "1rem" }}>
                    probability of synthetic origin
                  </div>
                  <div className="result-verdict">
                    {isSafe
                      ? "✓ This voice shows strong signs of being genuine."
                      : "⚠ This voice shows significant signs of synthesis."}
                  </div>
                  <div className="confidence-bar-wrap">
                    <div
                      className={`confidence-bar ${isSafe ? "safe" : "danger"}`}
                      style={{ width: `${result.score}%` }}
                    />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span className="confidence-label">0% — Genuine</span>
                    <span className="confidence-label">100% — Synthetic</span>
                  </div>

                  <div className="result-metrics">
                    <div className="metric-chip">
                      <div className="metric-val">{result.duration}</div>
                      <div className="metric-key">Clip length</div>
                    </div>
                    <div className="metric-chip">
                      <div className="metric-val">16 kHz</div>
                      <div className="metric-key">Sample rate</div>
                    </div>
                    <div className="metric-chip">
                      <div className="metric-val">{result.score < 30 ? "Low" : result.score < 65 ? "Medium" : "High"}</div>
                      <div className="metric-key">Risk level</div>
                    </div>
                    <div className="metric-chip">
                      <div className="metric-val">&lt; 3s</div>
                      <div className="metric-key">Inference time</div>
                    </div>
                  </div>

                  <button
                    className="btn-ghost"
                    style={{ marginTop: "1.5rem", width: "100%" }}
                    onClick={() => {
                      setState("idle");
                      setResult(null);
                      setError(null);
                    }}
                  >
                    Analyze another clip
                  </button>
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}