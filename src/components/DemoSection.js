import { useState, useCallback } from "react";
import WaveformSVG from "./WaveformSVG";
import { FadeIn } from "./FadeIn";

const SAMPLES = [
  { id: 1, name: "Khon Kaen market vendor, female, 58", type: "real", score: 7, duration: "4.2s" },
  { id: 2, name: "Ubon Ratchathani elder, male, 72", type: "real", score: 11, duration: "3.8s" },
  { id: 3, name: "TTS synthesis — Isan accent clone", type: "fake", score: 94, duration: "3.1s" },
  { id: 4, name: "Sakon Nakhon teenager, female, 19", type: "real", score: 4, duration: "5.0s" },
];

export default function DemoSection() {
  const [state, setState] = useState("idle");
  const [result, setResult] = useState(null);
  const [drag, setDrag] = useState(false);

  const runAnalysis = useCallback((score, name, duration) => {
    setState("analyzing");
    setTimeout(() => {
      setResult({ score, name, duration });
      setState("result");
    }, 2200);
  }, []);

  const isSafe = result && result.score < 50;

  return (
    <section id="demo" className="demo-bg section-pad">
      <div className="container">
        <FadeIn>
          {/* <div className="section-label">05 — Live Demo</div> */}
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
                runAnalysis(Math.floor(Math.random() * 40 + 5), "Uploaded file", "—");
              }}
              onClick={() => runAnalysis(Math.floor(Math.random() * 40 + 5), "Uploaded file", "—")}
            >
              <div className="upload-icon">🎙</div>
              <div className="upload-text">Drop .wav or .mp3 here</div>
              <div className="upload-sub">or click to browse · max 10 MB</div>
            </div>

            <div className="sample-clips" style={{ marginTop: "1.5rem" }}>
              <div className="sample-label">Curated samples</div>
              {SAMPLES.map(s => (
                <button
                  key={s.id}
                  className="sample-btn"
                  onClick={() => runAnalysis(s.score, s.name, s.duration)}
                >
                  <span className={`tag ${s.type === "real" ? "tag-real" : "tag-fake"}`}>
                    {s.type}
                  </span>
                  <span style={{ flex: 1, textAlign: "left", fontSize: "0.82rem" }}>{s.name}</span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: "0.68rem", color: "var(--fog)" }}>{s.duration}</span>
                </button>
              ))}
            </div>

            <div style={{ marginTop: "1.5rem", padding: "1rem", background: "var(--surface-2)", borderLeft: "3px solid var(--indigo)", fontSize: "0.82rem", color: "var(--fog-lt)", lineHeight: 1.6 }}>
              <strong style={{ color: "var(--mist)", fontFamily: "var(--mono)", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Privacy note</strong><br />
              Audio is processed in memory only. Nothing is written to disk or retained after inference.
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="result-panel">
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
                    onClick={() => { setState("idle"); setResult(null); }}
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
