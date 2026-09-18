import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Volume2, VolumeX, X, Rocket as RocketIcon, Flame } from 'lucide-react';
import { soundEffects } from '../utils/audio';
import { ManWithFirecrackers } from './ManWithFirecrackers';

interface FirecrackersCelebrationProps {
  onComplete?: () => void;
  durationSeconds?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  decay: number;
  size: number;
  flicker: boolean;
  gravity: number;
}

interface RocketTrail {
  x: number;
  y: number;
  alpha: number;
  color: string;
}

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  vx: number;
  vy: number;
  color: string;
  trails: RocketTrail[];
}

export const FirecrackersCelebration: React.FC<FirecrackersCelebrationProps> = ({
  onComplete,
  durationSeconds = 10
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [muted, setMuted] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // 10-second precise countdown without setState inside updater
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsActive(false);
      onCompleteRef.current?.();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Particle[] = [];
    const rockets: Rocket[] = [];
    const colors = [
      '#FFD700', // Gold
      '#FF3D00', // Fiery Red
      '#FF9100', // Vivid Orange
      '#00E5FF', // Electric Cyan
      '#76FF03', // Neon Lime
      '#E040FB', // Radiant Violet
      '#FF1744', // Crimson
      '#FFFFFF'  // Diamond Spark
    ];

    // Fire rocket blast explosion
    const createRocketExplosion = (x: number, y: number, color: string, count = 75) => {
      if (!muted) {
        soundEffects.playRocketBlow();
      }

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 7.5 + 2;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          alpha: 1,
          decay: Math.random() * 0.018 + 0.012,
          size: Math.random() * 3.5 + 2,
          flicker: Math.random() > 0.35,
          gravity: Math.random() * 0.08 + 0.06
        });
      }

      // Secondary glittering flash stars in the center
      for (let j = 0; j < 15; j++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.5 + 0.5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: '#FFFFFF',
          alpha: 1,
          decay: Math.random() * 0.03 + 0.02,
          size: Math.random() * 2.5 + 1.5,
          flicker: true,
          gravity: 0.03
        });
      }
    };

    let lastRocketBatchTime = 0;

    // Launch a fire rocket
    const launchRocket = () => {
      const startX = Math.random() * (width - 160) + 80;
      const targetY = Math.random() * (height * 0.42) + 50;
      const color = colors[Math.floor(Math.random() * colors.length)];

      rockets.push({
        x: startX,
        y: height,
        targetY,
        vx: (Math.random() - 0.5) * 3,
        vy: -(Math.random() * 5 + 11),
        color,
        trails: []
      });

      if (!muted) {
        soundEffects.playRocketLaunch();
      }
    };

    // Initial volley of 3 rockets
    setTimeout(() => {
      if (isActive) {
        launchRocket();
        setTimeout(launchRocket, 180);
        setTimeout(launchRocket, 360);
      }
    }, 100);

    const render = (time: number) => {
      if (!isActive) return;

      // Dark translucent wash to produce glowing fireworks light trails
      ctx.fillStyle = 'rgba(8, 12, 24, 0.25)';
      ctx.fillRect(0, 0, width, height);

      // Periodically fire rocket salvos
      if (time - lastRocketBatchTime > 450) {
        lastRocketBatchTime = time;
        launchRocket();
        // Occasionally launch a twin rocket
        if (Math.random() > 0.45) {
          setTimeout(launchRocket, 140);
        }
      }

      // Update and draw ascending rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.x += r.vx;
        r.y += r.vy;

        // Add smoke / spark trail behind rocket
        r.trails.push({
          x: r.x,
          y: r.y,
          alpha: 0.9,
          color: r.color
        });

        // Draw trails
        for (let t = r.trails.length - 1; t >= 0; t--) {
          const trail = r.trails[t];
          trail.alpha -= 0.07;
          if (trail.alpha <= 0) {
            r.trails.splice(t, 1);
            continue;
          }
          ctx.save();
          ctx.globalAlpha = trail.alpha;
          ctx.fillStyle = trail.color;
          ctx.beginPath();
          ctx.arc(trail.x, trail.y, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Draw ascending rocket head
        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = r.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();

        // Check if rocket reaches explosion altitude
        if (r.y <= r.targetY || r.vy >= 0) {
          createRocketExplosion(r.x, r.y, r.color, 70);
          rockets.splice(i, 1);
        }
      }

      // Update and draw explosion particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.985;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.flicker && Math.random() > 0.2 ? p.alpha * 0.7 : p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isActive, muted]);

  if (!isActive) return null;

  return (
    <div
      id="fire-rocket-celebration-overlay"
      className="fixed inset-0 z-[100] pointer-events-none flex flex-col justify-between p-3 sm:p-5"
      aria-label="Fire Rocket Blowout Celebration"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Floating 10-Second Status Banner */}
      <div className="relative z-10 mx-auto pointer-events-auto mt-2">
        <div className="flex items-center gap-2.5 sm:gap-3.5 bg-slate-950/95 text-amber-200 border-2 border-amber-400 px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-[0_0_30px_rgba(245,158,11,0.4)] backdrop-blur-md animate-pulse">
          <div className="flex items-center gap-1 text-amber-400">
            <RocketIcon className="w-5 h-5 text-amber-400 animate-bounce" />
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-spin" />
          </div>

          <div className="text-xs sm:text-base font-black tracking-wide text-white">
            🚀 Fire Rocket Blowout:{' '}
            <span className="text-yellow-300 font-mono text-lg sm:text-xl font-black ml-1">
              {timeLeft}s
            </span>
          </div>

          <div className="h-4 w-px bg-slate-700 mx-0.5" />

          <button
            id="mute-rockets-btn"
            type="button"
            onClick={() => setMuted(!muted)}
            className="p-1.5 rounded-full hover:bg-slate-800 text-amber-300 hover:text-white transition-colors cursor-pointer"
            title={muted ? 'Unmute fire rockets' : 'Mute fire rockets'}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            id="close-rockets-btn"
            type="button"
            onClick={() => {
              setIsActive(false);
              onCompleteRef.current?.();
            }}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Stop rocket celebration"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Man with Firecracker Blow Animation in Celebration Overlay */}
      <div className="relative z-20 pointer-events-auto flex flex-col items-center sm:items-end sm:pr-8 pb-1">
        <div className="bg-slate-950/80 p-2 sm:p-3 rounded-2xl border border-amber-500/40 shadow-2xl backdrop-blur-md flex items-end gap-2">
          <ManWithFirecrackers
            size="md"
            enableAudio={!muted}
            autoBlowInterval={1800}
          />
        </div>
      </div>

      {/* Bottom hint banner */}
      <div className="relative z-10 text-center text-xs font-semibold text-amber-300/90 drop-shadow-md pb-2 flex items-center justify-center gap-2">
        <span>✨ 10-Second Detective Achievement Rocket Fireworks Show ✨</span>
      </div>
    </div>
  );
};
