"use client";

import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";

const W = 1320;
const H = 2868;

const MK_W = 1022, MK_H = 2082;
const SC_L = (52 / MK_W) * 100;
const SC_T = (46 / MK_H) * 100;
const SC_W = (918 / MK_W) * 100;
const SC_H = (1990 / MK_H) * 100;
const SC_RX = (126 / 918) * 100;
const SC_RY = (126 / 1990) * 100;

const SIZES = [
  { label: '6.9"',       w: 1320, h: 2868 },
  { label: '6.5"',       w: 1284, h: 2778 },
  { label: '6.3"',       w: 1206, h: 2622 },
  { label: '6.1"',       w: 1125, h: 2436 },
  { label: 'iPad 13"',   w: 2064, h: 2752 },
  { label: 'iPad 12.9"', w: 2048, h: 2732 },
] as const;

// ── Consistent design tokens
const CAPTION_TOP   = H * 0.08;   // all slides: caption starts here
const PHONE_W       = W * 0.80;   // all phone slides: same width
const PHONE_BOTTOM  = -H * 0.06;  // all phone slides: same bottom offset
const CARD_W        = W * 0.88;   // slide 2 cards width

// ── Backgrounds (light / dark alternating)
const LIGHT = "#F2F2F7";
const DARK1 = "#0D0D0F";
const DARK2 = "#1A1A1C";

// ── Brand colors
const C = {
  busYellow: "#FFD400",
  metroBlue: "#0066CC",
  stogRed:   "#E1251B",
  white:     "#FFFFFF",
  black:     "#000000",
  muted:     "#8E8E93",
  mutedLight:"rgba(0,0,0,0.4)",
};

// ── Image preload
const IMAGE_PATHS = [
  "/mockup.png", "/app-icon.png", "/app-icon-dark.png",
  "/bus.png", "/metro.png", "/s-tog.png",
  "/screenshots/departure-board.png",
  "/screenshots/map-search.png",
  "/screenshots/add-station.png",
  "/screenshots/settings.png",
  "/screenshots/home-screen-widget.png",
  "/screenshots/live-activity-metro.png",
  "/screenshots/live-activity-bus.png",
  "/screenshots/live-activity-stog.png",
  "/screenshots/dynamic-island.png",
];
const imageCache: Record<string, string> = {};
async function preloadAllImages() {
  await Promise.all(IMAGE_PATHS.map(async (path) => {
    const resp = await fetch(path);
    const blob = await resp.blob();
    const dataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
    imageCache[path] = dataUrl;
  }));
}
function img(path: string) { return imageCache[path] || path; }

// ── Phone mockup
function Phone({ src, alt, style }: { src: string; alt: string; style?: React.CSSProperties }) {
  return (
    <div style={{ aspectRatio: `${MK_W}/${MK_H}`, position: "relative", ...style }}>
      <img src={img("/mockup.png")} alt="" style={{ display: "block", width: "100%", height: "100%" }} draggable={false} />
      <div style={{
        position: "absolute", zIndex: 10, overflow: "hidden",
        left: `${SC_L}%`, top: `${SC_T}%`,
        width: `${SC_W}%`, height: `${SC_H}%`,
        borderRadius: `${SC_RX}% / ${SC_RY}%`,
      }}>
        <img src={img(src)} alt={alt} style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} draggable={false} />
      </div>
    </div>
  );
}

// ── Unified caption — same structure, same font sizes everywhere
function Caption({ label, line1, line2, dark }: { label: string; line1: string; line2: string; dark: boolean }) {
  const fg = dark ? C.white : C.black;
  const fgMuted = dark ? C.muted : C.mutedLight;
  return (
    <div style={{ textAlign: "center", padding: `0 ${W * 0.06}px` }}>
      <p style={{
        fontSize: W * 0.028, fontWeight: 600, letterSpacing: "0.1em",
        textTransform: "uppercase", color: fgMuted, marginBottom: W * 0.016,
      }}>{label}</p>
      <h2 style={{
        fontSize: W * 0.092, fontWeight: 900, lineHeight: 1.0,
        color: fg, whiteSpace: "pre-line",
      }}>{line1}{"\n"}{line2}</h2>
    </div>
  );
}

// ── Badge pill
function Badge({ text, bg, color = "#fff" }: { text: string; bg: string; color?: string }) {
  return (
    <span style={{
      background: bg, color, fontWeight: 800,
      fontSize: W * 0.033, padding: `${W * 0.012}px ${W * 0.028}px`,
      borderRadius: 999, display: "inline-block", lineHeight: 1,
    }}>{text}</span>
  );
}

// ── Glow orb helper
function Glow({ color, top, bottom, opacity = 0.22 }: { color: string; top?: number; bottom?: number; opacity?: number }) {
  return (
    <div style={{
      position: "absolute",
      top: top !== undefined ? top : undefined,
      bottom: bottom !== undefined ? bottom : undefined,
      left: "50%", transform: "translateX(-50%)",
      width: W * 1.2, height: W * 1.2, borderRadius: "50%",
      background: `radial-gradient(circle, ${color}${Math.round(opacity * 255).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
      pointerEvents: "none",
    }} />
  );
}

// ══════════════════════════════════════
// SLIDE 1 — Hero (LIGHT)
// ══════════════════════════════════════
function Slide1() {
  return (
    <div style={{ width: W, height: H, background: LIGHT, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Glow color={C.stogRed} top={H * 0.02} opacity={0.12} />

      {/* Caption */}
      <div style={{ marginTop: CAPTION_TOP, zIndex: 2 }}>
        <Caption label="Pendler" line1="Never miss" line2="your train." dark={false} />
      </div>

      {/* Transport icons — no background */}
      <div style={{ display: "flex", gap: W * 0.05, marginTop: H * 0.038, zIndex: 2, alignItems: "center" }}>
        {["/bus.png", "/metro.png", "/s-tog.png"].map((src, i) => (
          <img key={i} src={img(src)} alt=""
            style={{ width: W * 0.1, height: W * 0.1, objectFit: "contain" }}
            draggable={false} />
        ))}
      </div>

      {/* Phone */}
      <Phone src="/screenshots/departure-board.png" alt="Departure board"
        style={{ width: PHONE_W, position: "absolute", bottom: PHONE_BOTTOM, zIndex: 1 }} />
    </div>
  );
}

// ══════════════════════════════════════
// SLIDE 2 — Live Activity (DARK)
// ══════════════════════════════════════
function Slide2() {
  return (
    <div style={{ width: W, height: H, background: DARK1, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Glow color={C.metroBlue} top={H * 0.02} opacity={0.18} />

      {/* Caption — same position as all other slides */}
      <div style={{ marginTop: CAPTION_TOP, zIndex: 2 }}>
        <Caption label="Live Activity" line1="Always" line2="on screen." dark={true} />
      </div>

      {/* Cards stack — top aligned with phone screen top in other slides */}
      <div style={{
        position: "absolute",
        top: H * 1.06 - (W * 0.80) * (MK_H / MK_W) * (1 - SC_T / 100),
        width: CARD_W,
        display: "flex",
        flexDirection: "column",
        gap: W * 0.03,
        zIndex: 2,
        alignItems: "center",
      }}>
        {/* Dynamic Island */}
        <img src={img("/screenshots/dynamic-island.png")} alt="Dynamic Island"
          style={{ width: "100%", borderRadius: W * 0.05, boxShadow: "0 8px 40px rgba(0,0,0,0.6)" }}
          draggable={false} />

        {/* Live Activity cards — overlapping stack so nothing gets cropped */}
        <div style={{ position: "relative", width: "100%" }}>
          {[
            "/screenshots/live-activity-metro.png",
            "/screenshots/live-activity-bus.png",
            "/screenshots/live-activity-stog.png",
          ].map((src, i) => (
            <img key={i} src={img(src)} alt="Live Activity"
              style={{
                display: "block", width: "100%",
                borderRadius: W * 0.04,
                boxShadow: "0 8px 40px rgba(0,0,0,0.7)",
                opacity: 1 - i * 0.08,
                marginTop: i === 0 ? 0 : -(W * 0.06),
                position: "relative",
                zIndex: 3 - i,
              }}
              draggable={false} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════
// SLIDE 3 — Map Search (LIGHT)
// ══════════════════════════════════════
function Slide3() {
  return (
    <div style={{ width: W, height: H, background: LIGHT, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Glow color={C.metroBlue} top={H * 0.02} opacity={0.08} />

      {/* Caption */}
      <div style={{ marginTop: CAPTION_TOP, zIndex: 2 }}>
        <Caption label="Discovery" line1="Find stops" line2="on the map." dark={false} />
      </div>

      {/* Two phones layered */}
      <div style={{ position: "absolute", bottom: -H * 0.02, width: W, height: H * 0.7, zIndex: 1 }}>
        <Phone src="/screenshots/add-station.png" alt="Add station"
          style={{ width: PHONE_W * 0.78, position: "absolute", left: -W * 0.04, bottom: H * 0.06,
            opacity: 0.65, transform: "rotate(-5deg)",
            filter: "drop-shadow(0 16px 40px rgba(0,0,0,0.18))" }} />
        <Phone src="/screenshots/map-search.png" alt="Map search"
          style={{ width: PHONE_W * 0.96, position: "absolute", right: -W * 0.04, bottom: 0,
            filter: "drop-shadow(0 24px 60px rgba(0,0,0,0.22))" }} />
      </div>
    </div>
  );
}

// ══════════════════════════════════════
// SLIDE 4 — Commute Schedules (DARK)
// ══════════════════════════════════════
function Slide4() {
  return (
    <div style={{ width: W, height: H, background: DARK2, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Glow color={C.busYellow} top={H * 0.02} opacity={0.14} />

      {/* Caption */}
      <div style={{ marginTop: CAPTION_TOP, zIndex: 2 }}>
        <Caption label="Smart commute" line1="Your lines," line2="your schedule." dark={true} />
      </div>

      {/* Phone */}
      <Phone src="/screenshots/settings.png" alt="Commute settings"
        style={{ width: PHONE_W, position: "absolute", bottom: PHONE_BOTTOM, zIndex: 1 }} />
    </div>
  );
}

// ══════════════════════════════════════
// SLIDE 5 — Download / Widget (LIGHT)
// ══════════════════════════════════════
function Slide5() {
  return (
    <div style={{ width: W, height: H, background: LIGHT, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Glow color={C.stogRed} top={H * 0.02} opacity={0.1} />

      {/* Caption + light/dark icons flanking the headline */}
      <div style={{ marginTop: CAPTION_TOP, zIndex: 2, position: "relative", width: "100%" }}>
        <Caption label="Free · No ads · No tracking" line1="Download" line2="Pendler." dark={false} />
        {/* Light icon — left */}
        <img src={img("/app-icon.png")} alt="Pendler light icon"
          style={{
            position: "absolute",
            left: W * 0.09,
            bottom: -W * 0.12,
            width: W * 0.16,
            borderRadius: W * 0.036,
            boxShadow: "0 12px 36px rgba(0,0,0,0.14)",
            transform: "rotate(-7deg)",
            zIndex: 3,
          }}
          draggable={false} />
        {/* Dark icon — right */}
        <img src={img("/app-icon-dark.png")} alt="Pendler dark icon"
          style={{
            position: "absolute",
            right: W * 0.09,
            bottom: -W * 0.12,
            width: W * 0.16,
            borderRadius: W * 0.036,
            boxShadow: "0 12px 36px rgba(0,0,0,0.14)",
            transform: "rotate(7deg)",
            zIndex: 3,
          }}
          draggable={false} />
      </div>

      {/* Phone */}
      <Phone src="/screenshots/home-screen-widget.png" alt="Widget"
        style={{ width: PHONE_W, position: "absolute", bottom: PHONE_BOTTOM, zIndex: 1 }} />
    </div>
  );
}

// ── Slides registry
const SLIDES = [
  { id: "hero",     label: "Hero",          Component: Slide1 },
  { id: "live",     label: "Live Activity", Component: Slide2 },
  { id: "map",      label: "Map",           Component: Slide3 },
  { id: "schedule", label: "Schedule",      Component: Slide4 },
  { id: "download", label: "Download",      Component: Slide5 },
];

// ── Preview card
function SlidePreview({ slide, index, onExport }: {
  slide: typeof SLIDES[0]; index: number; onExport: (i: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.18);
  useEffect(() => {
    const obs = new ResizeObserver(([e]) => setScale(e.contentRect.width / W));
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const { Component } = slide;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div ref={ref} style={{ width: "100%", aspectRatio: `${W}/${H}`, overflow: "hidden", borderRadius: 10, border: "1px solid #333", background: "#000" }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: W, height: H }}>
          <Component />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 4px" }}>
        <span style={{ color: "#8E8E93", fontSize: 12 }}>{String(index + 1).padStart(2, "0")} {slide.label}</span>
        <button onClick={() => onExport(index)}
          style={{ background: "#0066CC", color: "#fff", border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 11, cursor: "pointer" }}>
          Export
        </button>
      </div>
    </div>
  );
}

// ── Export
async function exportSlide(index: number, size: typeof SIZES[number], label: string) {
  const el = document.getElementById(`offscreen-${index}`);
  if (!el) return;
  el.style.left = "0px";
  const opts = { width: W, height: H, pixelRatio: 1, cacheBust: true };
  await toPng(el, opts);
  const dataUrl = await toPng(el, opts);
  el.style.left = "-9999px";

  const canvas = document.createElement("canvas");
  canvas.width = size.w; canvas.height = size.h;
  const ctx = canvas.getContext("2d")!;
  const imgEl = new window.Image();
  imgEl.src = dataUrl;
  await new Promise(r => { imgEl.onload = r; });
  ctx.drawImage(imgEl, 0, 0, size.w, size.h);

  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = `${String(index + 1).padStart(2, "0")}-${label}-${size.w}x${size.h}.png`;
  a.click();
}

// ── Page
export default function ScreenshotsPage() {
  const [ready, setReady] = useState(false);
  const [size, setSize] = useState<typeof SIZES[number]>(SIZES[0]);
  const [exporting, setExporting] = useState(false);

  useEffect(() => { preloadAllImages().then(() => setReady(true)); }, []);

  const handleExport = async (i: number) => {
    setExporting(true);
    await exportSlide(i, size, SLIDES[i].label.toLowerCase().replace(/\s/g, "-"));
    setExporting(false);
  };

  const handleExportAll = async () => {
    setExporting(true);
    for (let i = 0; i < SLIDES.length; i++) {
      await exportSlide(i, size, SLIDES[i].label.toLowerCase().replace(/\s/g, "-"));
      await new Promise(r => setTimeout(r, 350));
    }
    setExporting(false);
  };

  if (!ready) return (
    <div style={{ background: "#0D0D0F", color: "#fff", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
      Loading assets…
    </div>
  );

  return (
    <div style={{ background: "#0D0D0F", minHeight: "100vh", padding: 24, fontFamily: "inherit" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 24, flexWrap: "wrap" }}>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Pendler · App Store Screenshots</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <select value={size.label} onChange={e => setSize(SIZES.find(s => s.label === e.target.value)!)}
            style={{ background: "#2C2C2E", color: "#fff", border: "1px solid #444", borderRadius: 6, padding: "4px 8px", fontSize: 13 }}>
            {SIZES.map(s => <option key={s.label} value={s.label}>{s.label} — {s.w}×{s.h}</option>)}
          </select>
          <button onClick={handleExportAll} disabled={exporting}
            style={{ background: "#E1251B", color: "#fff", border: "none", borderRadius: 8, padding: "6px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", opacity: exporting ? 0.5 : 1 }}>
            {exporting ? "Exporting…" : "Export All"}
          </button>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
        {SLIDES.map((slide, i) => (
          <SlidePreview key={slide.id} slide={slide} index={i} onExport={handleExport} />
        ))}
      </div>

      {/* Offscreen renders */}
      <div style={{ position: "absolute", top: 0, zIndex: -1, pointerEvents: "none" }}>
        {SLIDES.map((slide, i) => {
          const { Component } = slide;
          return (
            <div key={slide.id} id={`offscreen-${i}`}
              style={{ position: "absolute", left: "-9999px", width: W, height: H, fontFamily: "Inter, -apple-system, sans-serif" }}>
              <Component />
            </div>
          );
        })}
      </div>
    </div>
  );
}
