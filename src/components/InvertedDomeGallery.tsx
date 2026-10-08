import React, { useState, useEffect, useRef } from 'react';
import {
  Compass, Maximize2, Rotate3d, Play, Pause, Sparkles,
  ArrowLeft, Sun, Moon, Eye, Zap, Layers, RefreshCw, X
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { soundManager } from '../utils/audio';

interface GalleryPhoto {
  id: string;
  title: string;
  subtitle: string;
  category: 'Cyber Legends' | 'Imperial Gold' | 'Cosmic Arenas';
  rating: number;
  lore: string;
  primaryColor: string;
  accentColor: string;
  symbol: string;
  bgGradient: string;
  imgUrl: string;
}

const CHESS_GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'photo-1',
    title: 'Titanium Sovereign King',
    subtitle: 'Mark IV Nanocore Defense Armor',
    category: 'Imperial Gold',
    rating: 2850,
    lore: 'Forged in stellar crucibles with impenetrable auric shielding. Guarantees absolute monarchical safety.',
    primaryColor: '#f59e0b',
    accentColor: '#fbbf24',
    symbol: '♔',
    bgGradient: 'from-amber-950 via-slate-900 to-black',
    imgUrl: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'photo-2',
    title: 'Quantum Crystal Queen',
    subtitle: 'Hyper-Vector Diagonal Laser',
    category: 'Cyber Legends',
    rating: 2900,
    lore: 'Capable of calculating 400 billion tactical branches per microsecond. Dominates all 64 squares.',
    primaryColor: '#38bdf8',
    accentColor: '#e0f2fe',
    symbol: '♕',
    bgGradient: 'from-sky-950 via-slate-900 to-black',
    imgUrl: 'https://images.unsplash.com/photo-1586165368502-1bad197a6461?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'photo-3',
    title: 'Mecha-Steed Knight',
    subtitle: 'Twin Plasma Thruster Jump',
    category: 'Cyber Legends',
    rating: 2600,
    lore: 'Bypasses enemy defenses with perpendicular kinetic leaps. Renowned for lethal triple royal forks.',
    primaryColor: '#a855f7',
    accentColor: '#f3e8ff',
    symbol: '♘',
    bgGradient: 'from-purple-950 via-slate-900 to-black',
    imgUrl: 'https://images.unsplash.com/photo-1560174038-da43ac74f01b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'photo-4',
    title: 'Molten Citadel Rook',
    subtitle: 'Heavy 7th Rank Demolisher',
    category: 'Imperial Gold',
    rating: 2750,
    lore: 'Anchored on open files to shatter fortress walls. Radiates extreme thermal compression.',
    primaryColor: '#f97316',
    accentColor: '#ffedd5',
    symbol: '♖',
    bgGradient: 'from-orange-950 via-slate-900 to-black',
    imgUrl: 'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'photo-5',
    title: 'Cosmic Starlight Bishop',
    subtitle: 'Long-Range Diagonal Sniper',
    category: 'Cosmic Arenas',
    rating: 2700,
    lore: 'Channels starlight across light and dark color complexes. Forms an impenetrable fianchetto battery.',
    primaryColor: '#ec4899',
    accentColor: '#fdf2f8',
    symbol: '♗',
    bgGradient: 'from-pink-950 via-slate-900 to-black',
    imgUrl: 'https://images.unsplash.com/photo-1528819622765-d6bcf132f793?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'photo-6',
    title: 'Cyber Pawn Vanguard',
    subtitle: 'Queening Nanofiber Matrix',
    category: 'Cyber Legends',
    rating: 2400,
    lore: 'Individually humble, collectively unstoppable. Marches relentlessly toward 8th-rank promotion.',
    primaryColor: '#10b981',
    accentColor: '#d1fae5',
    symbol: '♙',
    bgGradient: 'from-emerald-950 via-slate-900 to-black',
    imgUrl: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'photo-7',
    title: 'Aurelia Imperial Chamber',
    subtitle: 'Golden Grandmaster Court',
    category: 'Imperial Gold',
    rating: 2880,
    lore: 'The revered sanctuary where Grand Queen Aurelia calculates eternal positional traps.',
    primaryColor: '#eab308',
    accentColor: '#fef9c3',
    symbol: '👑',
    bgGradient: 'from-yellow-950 via-amber-950 to-black',
    imgUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'photo-8',
    title: 'Neo-Tokyo Midnight Blitz',
    subtitle: 'High-Speed Holographic Ring',
    category: 'Cosmic Arenas',
    rating: 2650,
    lore: 'Ultra-fast 3-minute blitz tournaments under the neon skyscrapers of Neo-Tokyo 2099.',
    primaryColor: '#06b6d4',
    accentColor: '#cffafe',
    symbol: '⚡',
    bgGradient: 'from-cyan-950 via-slate-900 to-black',
    imgUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'photo-9',
    title: 'Orbital Zero-G Championship',
    subtitle: 'Deep Orbit Space Station Board',
    category: 'Cosmic Arenas',
    rating: 2950,
    lore: 'Floating pieces magnetically locked in zero gravity, overlooking the curve of Earth.',
    primaryColor: '#6366f1',
    accentColor: '#e0e7ff',
    symbol: '🌌',
    bgGradient: 'from-indigo-950 via-slate-900 to-black',
    imgUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'photo-10',
    title: 'The Immortal Queen Sacrifice',
    subtitle: 'Classic Opera House Reborn',
    category: 'Imperial Gold',
    rating: 2820,
    lore: 'The ultimate aesthetic triumph: sacrificing queen for an inescapable 2-bishop back-rank mate.',
    primaryColor: '#f43f5e',
    accentColor: '#ffe4e6',
    symbol: '⚔️',
    bgGradient: 'from-rose-950 via-slate-900 to-black',
    imgUrl: 'https://images.unsplash.com/photo-1523875194681-bedd468c58b7?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'photo-11',
    title: 'Dark Matter Singularity',
    subtitle: 'Shadow Realm Gambit Arena',
    category: 'Cosmic Arenas',
    rating: 2790,
    lore: 'Where time dilates and every pawn move bends the gravitational continuum.',
    primaryColor: '#8b5cf6',
    accentColor: '#ede9fe',
    symbol: '🌀',
    bgGradient: 'from-violet-950 via-slate-900 to-black',
    imgUrl: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'photo-12',
    title: 'Golden Dragon Opening Battery',
    subtitle: 'Sicilian Dragon Hyper-Drive',
    category: 'Imperial Gold',
    rating: 2720,
    lore: 'Unleashing the lethal dark-squared dragon bishop with razor-sharp tactical crossfire.',
    primaryColor: '#d97706',
    accentColor: '#fef3c7',
    symbol: '🐉',
    bgGradient: 'from-amber-950 via-slate-950 to-black',
    imgUrl: 'https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?auto=format&fit=crop&w=800&q=80',
  },
];

interface InvertedDomeGalleryProps {
  onBack: () => void;
  onPlayNow: () => void;
}

export const InvertedDomeGallery: React.FC<InvertedDomeGalleryProps> = ({ onBack, onPlayNow }) => {
  const { themeMode, toggleTheme } = useTheme();
  const isDark = themeMode === 'dark';

  // Display Mode: 'dome' | 'hybrid' | 'vertex'
  const [viewMode, setViewMode] = useState<'hybrid' | 'dome' | 'vertex'>('hybrid');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  // Dome 3D Orientation
  const [rotX, setRotX] = useState<number>(15);
  const [rotY, setRotY] = useState<number>(0);
  const [isAutoOrbit, setIsAutoOrbit] = useState<boolean>(true);
  const [curvature, setCurvature] = useState<number>(75); // Curvature factor
  const [domeRadius, setDomeRadius] = useState<number>(420); // 3D radius

  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; rotX: number; rotY: number }>({ x: 0, y: 0, rotX: 15, rotY: 0 });
  const animFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Filtered photos
  const filteredPhotos = categoryFilter === 'All'
    ? CHESS_GALLERY_PHOTOS
    : CHESS_GALLERY_PHOTOS.filter((p) => p.category === categoryFilter);

  // Auto-orbit loop
  useEffect(() => {
    let lastTime = performance.now();
    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;
      if (isAutoOrbit && !isDraggingRef.current) {
        setRotY((prev) => (prev + dt * 10) % 360);
      }
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isAutoOrbit]);

  // Mouse drag handlers for 3D rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY, rotX, rotY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setRotY((dragStartRef.current.rotY + dx * 0.4) % 360);
    setRotX(Math.max(-45, Math.min(65, dragStartRef.current.rotX - dy * 0.3)));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Canvas 3D Vertex Gravitational Funnel (Image 4)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const renderVortex = () => {
      t += 0.015;
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const rings = 28;

      for (let r = 0; r < rings; r++) {
        const ringProgress = r / rings;
        // Funnel curvature profile: descending towards center
        const radiusX = (1 - ringProgress) * (width * 0.45);
        const radiusY = radiusX * 0.42;
        const depthY = Math.pow(ringProgress, 2.2) * (height * 0.38);

        const currentCy = cy + depthY - (height * 0.12);
        const points = 36 + r * 2;
        const ringSpeed = (1 - ringProgress * 0.7) * 0.8;
        const ringOffset = t * ringSpeed + r * 0.15;

        // Render connected ring lines
        ctx.beginPath();
        for (let p = 0; p <= points; p++) {
          const angle = (p / points) * Math.PI * 2 + ringOffset;
          // Vertex distortion
          const wobble = Math.sin(angle * 6 + t * 2) * (2 + r * 0.3);
          const px = cx + Math.cos(angle) * (radiusX + wobble);
          const py = currentCy + Math.sin(angle) * (radiusY + wobble * 0.5);

          if (p === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = ringProgress < 0.4
          ? `rgba(245, 158, 11, ${0.12 + ringProgress * 0.25})`
          : `rgba(255, 255, 255, ${0.08 + (1 - ringProgress) * 0.15})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Render luminous vertex dots along the ring
        const dotStep = Math.max(1, Math.floor(points / 24));
        for (let p = 0; p < points; p += dotStep) {
          const angle = (p / points) * Math.PI * 2 + ringOffset;
          const wobble = Math.sin(angle * 6 + t * 2) * (2 + r * 0.3);
          const px = cx + Math.cos(angle) * (radiusX + wobble);
          const py = currentCy + Math.sin(angle) * (radiusY + wobble * 0.5);

          const isGold = (p + r) % 3 === 0;
          ctx.beginPath();
          ctx.arc(px, py, isGold ? 2 : 1.2, 0, Math.PI * 2);
          ctx.fillStyle = isGold ? '#fbbf24' : '#ffffff';
          ctx.shadowColor = isGold ? '#f59e0b' : '#ffffff';
          ctx.shadowBlur = isGold ? 8 : 4;
          ctx.fill();
        }
      }

      // Gravitational Singularity Pulse at the vortex center
      const pulse = Math.sin(t * 3) * 6;
      const coreY = cy + height * 0.25;
      const grad = ctx.createRadialGradient(cx, coreY, 2, cx, coreY, 35 + pulse);
      grad.addColorStop(0, 'rgba(251, 191, 36, 0.9)');
      grad.addColorStop(0.3, 'rgba(245, 158, 11, 0.5)');
      grad.addColorStop(0.8, 'rgba(217, 119, 6, 0.15)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.beginPath();
      ctx.arc(cx, coreY, 35 + pulse, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      animId = requestAnimationFrame(renderVortex);
    };

    animId = requestAnimationFrame(renderVortex);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className={`min-h-screen p-4 max-w-7xl mx-auto flex flex-col transition-colors duration-300 select-none ${
      isDark ? 'bg-[#080503] text-slate-100' : 'bg-[#faf8f5] text-slate-900'
    }`}>
      {/* Light Sweep */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
        <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-amber-500/10 to-transparent skew-x-[-25deg] animate-royal-sweep" />
      </div>

      {/* Header */}
      <div className={`relative z-20 flex items-center justify-between py-3 border-b mb-4 ${
        isDark ? 'border-amber-500/20' : 'border-amber-200'
      }`}>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors border ${
              isDark ? 'bg-slate-900 hover:bg-slate-800 text-amber-200 border-amber-500/30' : 'bg-white hover:bg-amber-50 text-slate-800 border-amber-300 shadow-sm'
            }`}
          >
            <ArrowLeft className="w-4 h-4" /> Hub
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-display font-bold flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Rotate3d className="w-5 h-5" />
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-amber-400">
                INVERTED DOME 3D GALLERY
              </span>
            </h1>
            <p className="text-xs text-amber-400/80 font-tech">
              Interactive 3D Concave Dome & Vertex Gravitational Vortex Effect
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-all ${
              isDark ? 'bg-slate-900 text-amber-400 border-amber-500/30' : 'bg-amber-100 text-amber-900 border-amber-300'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onPlayNow}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-tech font-extrabold text-xs shadow-[0_0_20px_rgba(245,158,11,0.35)] border border-amber-300 hover:scale-102 transition-transform"
          >
            PLAY CHESS NOW
          </button>
        </div>
      </div>

      {/* Control Ribbon */}
      <div className={`relative z-20 flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl border mb-4 ${
        isDark ? 'bg-[#0d0905]/80 border-amber-500/20' : 'bg-white border-amber-200 shadow-sm'
      }`}>
        {/* Mode Selector */}
        <div className="flex items-center gap-1.5">
          {[
            { id: 'hybrid', label: '3D Dome + Vortex', icon: Layers },
            { id: 'dome', label: 'Inverted Dome', icon: Rotate3d },
            { id: 'vertex', label: '3D Vertex Funnel', icon: Compass },
          ].map((mode) => {
            const isActive = viewMode === mode.id;
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setViewMode(mode.id as any);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-tech font-bold transition-all border ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 border-amber-300 shadow-sm'
                    : isDark ? 'bg-slate-900/80 text-slate-300 border-white/5 hover:text-white' : 'bg-amber-50/70 text-slate-700 border-amber-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {mode.label}
              </button>
            );
          })}
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5">
          {['All', 'Imperial Gold', 'Cyber Legends', 'Cosmic Arenas'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                soundManager.playClick();
                setCategoryFilter(cat);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                categoryFilter === cat
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAutoOrbit(!isAutoOrbit)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
              isAutoOrbit
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 text-slate-400 border-white/10'
            }`}
          >
            {isAutoOrbit ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isAutoOrbit ? 'Orbiting' : 'Paused'}
          </button>

          <button
            type="button"
            onClick={() => {
              setRotX(15);
              setRotY(0);
              soundManager.playClick();
            }}
            className="p-1.5 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white"
            title="Reset 3D Perspective"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3D Interactive Stage */}
      <div
        className="relative z-20 flex-1 min-h-[520px] rounded-3xl border overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at center, #170f07 0%, #080503 100%)'
            : 'radial-gradient(ellipse at center, #fffbeb 0%, #fef3c7 100%)',
          borderColor: isDark ? 'rgba(245, 158, 11, 0.25)' : 'rgba(251, 191, 36, 0.4)',
        }}
      >
        {/* Canvas for 3D Vertex Funnel (Shown in Hybrid & Vertex modes) */}
        {(viewMode === 'hybrid' || viewMode === 'vertex') && (
          <canvas
            ref={canvasRef}
            width={900}
            height={600}
            className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-500 ${
              viewMode === 'hybrid' ? 'opacity-55' : 'opacity-100'
            }`}
          />
        )}

        {/* 3D INVERTED DOME MESH CONTAINER (Image 3 Concave Dome) */}
        {(viewMode === 'hybrid' || viewMode === 'dome') && (
          <div
            className="w-full h-full flex items-center justify-center pointer-events-none"
            style={{ perspective: '1100px' }}
          >
            <div
              className="relative transition-transform duration-75 ease-out"
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
                width: '0px',
                height: '0px',
              }}
            >
              {filteredPhotos.map((photo, index) => {
                const total = filteredPhotos.length;
                // Inverted Dome Math:
                // Cards wrap around a sphere/concave dome, curving inward toward center
                const angleY = (index / total) * 360;
                // Vertical tiers: alternate cards across 2 tiers for authentic dome bowl depth
                const tier = (index % 2 === 0 ? -1 : 1) * (curvature * 0.22);
                const cardZ = domeRadius;

                return (
                  <div
                    key={photo.id}
                    className="absolute pointer-events-auto"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: `rotateY(${angleY}deg) rotateX(${tier}deg) translateZ(${cardZ}px) rotateY(180deg)`,
                      width: '200px',
                      height: '270px',
                      marginLeft: '-100px',
                      marginTop: '-135px',
                    }}
                  >
                    <div
                      onClick={() => {
                        soundManager.playPieceClick();
                        setSelectedPhoto(photo);
                      }}
                      className="group relative w-full h-full rounded-2xl p-3 flex flex-col justify-between overflow-hidden border shadow-[0_10px_30px_rgba(0,0,0,0.6)] cursor-pointer transition-all duration-300 hover:scale-108 hover:shadow-[0_0_35px_rgba(245,158,11,0.6)]"
                      style={{
                        background: `linear-gradient(145deg, rgba(15, 10, 5, 0.95), rgba(0, 0, 0, 0.98))`,
                        borderColor: photo.primaryColor,
                      }}
                    >
                      {/* Background Photo Image */}
                      <div className="absolute inset-0 opacity-40 group-hover:opacity-65 transition-opacity duration-300">
                        <img
                          src={photo.imgUrl}
                          alt={photo.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                      </div>

                      {/* Card Top Pill */}
                      <div className="relative z-10 flex items-center justify-between">
                        <span
                          className="text-[10px] font-tech font-bold px-2 py-0.5 rounded-full border shadow-sm backdrop-blur-md"
                          style={{
                            backgroundColor: `${photo.primaryColor}25`,
                            color: photo.accentColor,
                            borderColor: `${photo.primaryColor}60`,
                          }}
                        >
                          {photo.category}
                        </span>
                        <span className="text-xl filter drop-shadow-md select-none">{photo.symbol}</span>
                      </div>

                      {/* Card Bottom Meta */}
                      <div className="relative z-10 space-y-1">
                        <div className="flex items-center gap-1 text-[10px] font-mono text-amber-400 font-bold">
                          <Sparkles className="w-3 h-3" />
                          <span>{photo.rating} ELO POWER</span>
                        </div>
                        <h3 className="font-display font-bold text-sm text-white leading-tight group-hover:text-amber-300 transition-colors">
                          {photo.title}
                        </h3>
                        <p className="text-[10px] text-slate-300 line-clamp-1">
                          {photo.subtitle}
                        </p>
                      </div>

                      {/* Hover Glow Ring */}
                      <div
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border-2"
                        style={{ borderColor: photo.primaryColor }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Drag Hint Overlay */}
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-amber-500/20 text-xs text-amber-300 font-tech">
          <Rotate3d className="w-4 h-4 animate-spin" />
          <span>Click & Drag to Rotate 3D Inverted Dome • Scroll / Sliders to Adjust Depth</span>
        </div>

        {/* Radius & Curvature Controls */}
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-4 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-amber-500/20 text-xs text-amber-300 font-tech">
          <div className="flex items-center gap-2">
            <span>Radius:</span>
            <input
              type="range"
              min="280"
              max="600"
              value={domeRadius}
              onChange={(e) => setDomeRadius(Number(e.target.value))}
              className="w-20 accent-amber-400 cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-2">
            <span>Curvature:</span>
            <input
              type="range"
              min="20"
              max="120"
              value={curvature}
              onChange={(e) => setCurvature(Number(e.target.value))}
              className="w-20 accent-amber-400 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Selected 3D Artwork Inspection Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div
            className="relative w-full max-w-xl rounded-3xl border shadow-2xl overflow-hidden p-6 text-white space-y-5"
            style={{
              background: 'linear-gradient(145deg, #120b05, #000000)',
              borderColor: selectedPhoto.primaryColor,
              boxShadow: `0 0 50px ${selectedPhoto.primaryColor}40`,
            }}
          >
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 border border-white/10 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image Hero */}
            <div className="relative h-64 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
              <img
                src={selectedPhoto.imgUrl}
                alt={selectedPhoto.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <span
                    className="text-xs font-tech font-bold px-3 py-1 rounded-full border backdrop-blur-md"
                    style={{
                      backgroundColor: `${selectedPhoto.primaryColor}30`,
                      color: selectedPhoto.accentColor,
                      borderColor: selectedPhoto.primaryColor,
                    }}
                  >
                    {selectedPhoto.category}
                  </span>
                  <h2 className="text-2xl font-display font-bold mt-2 text-white drop-shadow-md">
                    {selectedPhoto.title}
                  </h2>
                  <p className="text-xs text-amber-300 font-tech">{selectedPhoto.subtitle}</p>
                </div>
                <span className="text-5xl drop-shadow-lg">{selectedPhoto.symbol}</span>
              </div>
            </div>

            {/* Tactical Lore & Stats */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono">
                <span className="text-slate-400">Tactical Rating:</span>
                <span className="font-bold text-amber-400">{selectedPhoto.rating} ELO Master Power</span>
              </div>

              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 text-xs leading-relaxed text-slate-300 space-y-1">
                <span className="font-bold text-amber-300 uppercase tracking-wider text-[10px] block font-tech">
                  3D Grandmaster Lore:
                </span>
                <p>{selectedPhoto.lore}</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-semibold"
              >
                Close View
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedPhoto(null);
                  onPlayNow();
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-tech font-extrabold text-xs shadow-lg"
              >
                PLAY WITH THIS TACTIC
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
