"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

const examples = [
  "What if Messi never left Barcelona?",
  "What if Leicester City had lost the 2016 title race?",
  "What if Zidane never headbutted Materazzi?",
  "What if Liverpool never won in Istanbul?",
  "What if Maradona had signed for Real Madrid?",
  "What if the Premier League never existed?",
];

const logEntries = [
  "BRANCH 1999 UCL FINAL: STABLE", "NEXUS EVENT: LATE WINNER 90+3", "TRANSFER ANOMALY AT 02:14",
  "OFFSIDE LINE DRIFT DETECTED", "VAR REVIEW LOOP: 0 FOUND", "BRANCH 2005 ISTANBUL: STABLE",
  "PENALTY MISS: VARIANCE +0.1", "TEMPAD 4471 PINGED", "DERBY TIMELINE: DIVERGING",
  "MANAGER SACKED: BRANCH SPAWNED", "FIXTURE LIST: CHECKSUM OK", "CROWD NOISE SPIKE: STADIUM-09",
];

type AudioContextWindow = Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext };

function FrameCorners({ corners = "tl br" }: { corners?: string }) {
  return <>{corners.split(" ").map((corner) => <i className={`c ${corner}`} key={corner} />)}</>;
}

function AudioBars() { return <span className="eq"><i /><i /><i /></span>; }

function Stat({ label, value, width }: { label: string; value: string; width: number }) {
  return <div><div className="row"><span>{label}</span><span>{value}</span></div><div className="bar"><i style={{ width: `${width}%` }} /></div></div>;
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [audioOn, setAudioOn] = useState(true);
  const [logs, setLogs] = useState(logEntries.slice(0, 5));
  const [stats, setStats] = useState({ sacred: 99.7, variance: 0.3, load: 41, branches: 0x2a1, pruned: 0x37, drift: "+0.002s" });
  const [clock, setClock] = useState("");
  const audioContext = useRef<AudioContext | null>(null);
  const started = useRef(false);
  const typingTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const getAudio = () => {
    if (!audioOn || typeof window === "undefined") return null;
    if (!audioContext.current) {
      const AudioContextClass = window.AudioContext || (window as AudioContextWindow).webkitAudioContext;
      if (!AudioContextClass) return null;
      audioContext.current = new AudioContextClass();
    }
    if (audioContext.current.state === "suspended") void audioContext.current.resume();
    return audioContext.current;
  };

  const tone = (frequency: number, duration: number, type: OscillatorType = "square", volume = 0.05, to?: number, at = 0) => {
    const context = getAudio();
    if (!context) return;
    const time = context.currentTime + at;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, time);
    if (to) oscillator.frequency.exponentialRampToValueAtTime(to, time + duration);
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    oscillator.connect(gain); gain.connect(context.destination);
    oscillator.start(time); oscillator.stop(time + duration + 0.02);
  };

  const sound = (kind: "click" | "key" | "hover" | "load" | "confirm" | "toggle" | "boot") => {
    if (kind === "click") { tone(1200, .05, "square", .05, 600); tone(300, .12, "sawtooth", .04, 150, .03); }
    if (kind === "key") tone(1750, .025, "square", .025);
    if (kind === "hover") tone(620, .05, "sine", .025, 700);
    if (kind === "load") { tone(500, .07); tone(750, .07, "square", .04, undefined, .07); tone(1000, .1, "square", .04, undefined, .14); }
    if (kind === "confirm") { [440, 660, 880, 1320].forEach((frequency, index) => tone(frequency, .14, "square", .05, undefined, index * .09)); tone(110, .7, "sawtooth", .05, 55, .1); }
    if (kind === "toggle") tone(audioOn ? 900 : 300, .08, "triangle", .06);
    if (kind === "boot") { tone(60, 1.1, "sawtooth", .05, 180); tone(900, .05, "square", .03, undefined, .9); }
  };

  useEffect(() => {
    const unlock = () => { started.current = true; };
    window.addEventListener("pointerdown", unlock, { once: true }); window.addEventListener("keydown", unlock, { once: true });
    const logTimer = window.setInterval(() => setLogs((current) => [...current, logEntries[Math.floor(Math.random() * logEntries.length)]].slice(-9)), 2600);
    const statTimer = window.setInterval(() => setStats((current) => { const sacred = 97.2 + Math.random() * 2.7; return { sacred, variance: 100 - sacred, load: Math.round(30 + Math.random() * 48), branches: current.branches + (Math.random() < .5 ? 1 : 0), pruned: current.pruned + (Math.random() < .3 ? 1 : 0), drift: `+${(Math.random() * .009).toFixed(3)}s` }; }), 1800);
    const clockTimer = window.setInterval(() => setClock(new Date().toLocaleTimeString("en-GB")), 1000);
    return () => { window.clearInterval(logTimer); window.clearInterval(statTimer); window.clearInterval(clockTimer); window.removeEventListener("pointerdown", unlock); window.removeEventListener("keydown", unlock); };
  }, []);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (busy) return; sound("click");
    if (!prompt.trim()) { setError(true); setMessage("> ERROR: NO ANOMALY DESCRIBED. ENTER A WHAT-IF."); return; }
    setError(false); setBusy(true);
    const steps = ["> LOGGING VARIANCE REQUEST...", "> CROSS-REFERENCING SACRED TIMELINE...", "> BRANCH POINT LOCATED.", "> REQUEST FILED. TIMELINE ENGINE OFFLINE IN THIS BUILD."];
    steps.forEach((step, index) => window.setTimeout(() => { setMessage(step); sound("key"); if (index === steps.length - 1) { sound("confirm"); setBusy(false); } }, index * 650));
    setLogs((current) => [...current, `REQUEST FILED: ${prompt.slice(0, 22).toUpperCase()}`].slice(-9));
  };

  const loadExample = (value: string) => {
    if (typingTimer.current) clearInterval(typingTimer.current);
    sound("load"); setPrompt(""); setMessage(""); setError(false); let index = 0;
    typingTimer.current = setInterval(() => { index += 1; setPrompt(value.slice(0, index)); if (index % 2) sound("key"); if (index >= value.length && typingTimer.current) clearInterval(typingTimer.current); }, 22);
  };

  return <>
    <div className="bg" /><div className="ring" aria-hidden="true"><svg viewBox="0 0 400 400" fill="none" stroke="#ff8a1f" strokeWidth=".6"><circle cx="200" cy="200" r="196" strokeDasharray="2 6" /><circle cx="200" cy="200" r="170" strokeDasharray="40 8 4 8" /><g className="r2"><polygon points="200,40 313,87 360,200 313,313 200,360 87,313 40,200 87,87" strokeWidth=".8" /><circle cx="200" cy="200" r="118" strokeDasharray="1 4" /></g>{Array.from({ length: 120 }, (_, index) => { const angle = index * 3 * Math.PI / 180; const length = index % 10 === 0 ? 12 : 5; return <line key={index} x1={(200 + Math.sin(angle) * 196).toFixed(6)} y1={(200 - Math.cos(angle) * 196).toFixed(6)} x2={(200 + Math.sin(angle) * (196 - length)).toFixed(6)} y2={(200 - Math.cos(angle) * (196 - length)).toFixed(6)} />; })}</svg></div>
    <div className="stage"><header><div className="frame logo"><FrameCorners /><svg viewBox="0 0 48 48" fill="none" stroke="#ff8a1f" strokeWidth="2" aria-hidden="true"><polygon points="24,2 46,24 24,46 2,24" /><circle cx="24" cy="24" r="12" /><path d="M24 12v12l8 5M2 24h10M36 24h10" /><path d="M14 8l-6 6M34 8l6 6" strokeWidth="1" /></svg><div className="wm"><b>FOOTBALL: FRACTURED</b><i>TIME VARIANCE ARCHIVE</i></div></div><div className="frame status"><FrameCorners corners="tr bl" /><div><small>TERMINAL 7-FF · SACRED TIMELINE</small><strong>SYSTEM STATUS — ACTIVE</strong></div><span className="dot" /></div></header>
      <main><aside className="frame rail" aria-label="Timeline monitors"><FrameCorners /><h3>TEMPORAL INTEGRITY</h3><Stat label="SACRED" value={`${stats.sacred.toFixed(1)}%`} width={stats.sacred} /><Stat label="VARIANCE" value={`${stats.variance.toFixed(1)}%`} width={stats.variance * 3} /><Stat label="NEXUS LOAD" value={`${stats.load}%`} width={stats.load} /><h3>BRANCH REGISTER</h3><div className="row"><span>ACTIVE BRANCHES</span><span>{String(stats.branches).padStart(4, "0")}</span></div><div className="row"><span>PRUNED TODAY</span><span>{String(stats.pruned).padStart(4, "0")}</span></div><div className="row"><span>ARCHIVE</span><span>1863–NOW</span></div><h3>TEMPAD SIGNALS</h3><div className="glyphs">{Array.from({ length: 32 }, (_, index) => <i key={index} />)}</div></aside>
        <section className="frame core" aria-labelledby="h"><FrameCorners corners="tl tr bl br" /><p className="tag">ANOMALY INTAKE · OPEN FILE</p><h1 id="h" className="glitch"><span>What if football</span><span>took another path?</span></h1><form className="frame term" onSubmit={submit} autoComplete="off"><FrameCorners /><div className="bar2"><span>TIMELINE REQUEST</span><span>MAX 140 CHR</span></div><label className="input-box"><span className="pr" aria-hidden="true">&gt;_</span><div className={`mir${prompt ? "" : " ph"}`} aria-hidden="true">{prompt || "What if Ronaldo never left Real Madrid?"}<span className="cur" /></div><span className="sr-only">Describe your what-if scenario</span><textarea value={prompt} maxLength={140} rows={2} spellCheck={false} aria-label="Describe your what-if scenario" placeholder="What if Ronaldo never left Real Madrid?" onChange={(event) => { setPrompt(event.target.value); setError(false); sound("key"); }} /></label><button className="go" type="submit" disabled={busy} onMouseEnter={() => sound("hover")}>CREATE NEW TIMELINE</button></form><p className={`msg${error ? " error" : ""}`} role="status">{message}</p><div className="ex"><h2>LOGGED VARIANCES — SELECT TO LOAD</h2><ul>{examples.map((value, index) => <li key={value}><button type="button" onMouseEnter={() => sound("hover")} onClick={() => loadExample(value)}><b>V-{String(index + 1).padStart(2, "0")}</b><span>{value}</span></button></li>)}</ul></div></section>
        <aside className="frame rail" aria-label="Event log"><FrameCorners corners="tr bl" /><h3>VARIANCE LOG</h3><div className="log" aria-live="off">{logs.map((entry, index) => <div className={index === logs.length - 1 ? "w" : ""} key={`${entry}-${index}`}>&gt; {entry}</div>)}</div><h3>SCAN</h3><div className="row"><span>SECTOR</span><span>PITCH-04</span></div><div className="row"><span>CLOCK DRIFT</span><span>{stats.drift}</span></div></aside>
      </main><footer><button className="snd" type="button" aria-pressed={audioOn} onClick={() => { setAudioOn((value) => !value); sound("toggle"); }} onMouseEnter={() => sound("hover")}><AudioBars /><span>{audioOn ? "AUDIO ON" : "AUDIO OFF"}</span></button><div className="tk"><div>TVA NOTICE: ALL BRANCHES ARE SUBJECT TO PRUNING &nbsp;///&nbsp; THE SACRED TIMELINE MUST BE PRESERVED &nbsp;///&nbsp; ANOMALOUS TRANSFERS, RED CARDS AND LATE WINNERS FLAGGED FOR REVIEW &nbsp;///&nbsp; FILE ALL WHAT-IFS WITH YOUR LOCAL VARIANCE OFFICER &nbsp;///&nbsp; FOR ALL TIME. ALWAYS.</div></div><div className="clock">{clock}</div></footer></div><div className="crt vig" /><div className="crt scan" /><div className="crt sweep" /><div className="crt flick" />
  </>;
}
