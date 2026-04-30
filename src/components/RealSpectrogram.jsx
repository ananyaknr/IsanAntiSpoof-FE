import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import Spectrogram from "wavesurfer.js/dist/plugins/spectrogram.esm.js";

export default function RealSpectrogram({ audioUrl, isReal }) {
  const containerRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Wavesurfer
    wavesurferRef.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor: isReal ? '#4ade80' : '#f87171', // Differentiate wave colors
      progressColor: '#818cf8',
      height: 0, // Set to 0 if you ONLY want the spectrogram, or >0 to show the waveform too
      url: audioUrl,
      plugins: [
        Spectrogram.create({
          labels: true,
          height: 160,
          splitChannels: false,
          frequencyMin: 0,
          frequencyMax: 8000, // Show up to 8kHz to highlight the 6kHz-7kHz differences
          labelsBackground: 'rgba(17, 17, 32, 0.7)',
          labelsColor: '#94a3b8',
        }),
      ],
    });

    wavesurferRef.current.on('play', () => setIsPlaying(true));
    wavesurferRef.current.on('pause', () => setIsPlaying(false));

    return () => {
      wavesurferRef.current.destroy();
    };
  }, [audioUrl, isReal]);

  const togglePlay = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  };

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <div ref={containerRef} style={{ width: "100%", height: 160, background: "#111120" }} />
      <button 
        onClick={togglePlay}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "white",
          padding: "4px 12px",
          borderRadius: "4px",
          cursor: "pointer",
          zIndex: 10
        }}
      >
        {isPlaying ? "Pause" : "Play Audio"}
      </button>
    </div>
  );
}