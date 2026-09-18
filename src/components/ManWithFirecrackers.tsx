import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Sparkles } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface ManWithFirecrackersProps {
  size?: 'sm' | 'md' | 'lg';
  enableAudio?: boolean;
  className?: string;
  autoBlowInterval?: number;
}

interface Spark {
  id: number;
  x: number;
  y: number;
  color: string;
  angle: number;
  distance: number;
  size: number;
}

const PHRASES = ['BOOM! 💥', 'ધમાકો! 🚀', 'PATAKA! 🎆', 'Hooray! 🎉', 'SUPERB! ⭐', 'DETECTIVE! 🏆'];

export const ManWithFirecrackers: React.FC<ManWithFirecrackersProps> = ({
  size = 'md',
  enableAudio = true,
  className = '',
  autoBlowInterval = 2000
}) => {
  const [isBlowing, setIsBlowing] = useState(false);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [blastCount, setBlastCount] = useState(0);

  // Trigger firecracker explosion
  const triggerBlow = () => {
    setIsBlowing(true);
    setBlastCount((c) => c + 1);
    setPhraseIndex((prev) => (prev + 1) % PHRASES.length);

    if (enableAudio) {
      soundEffects.playRocketBlow();
    }

    // Generate burst sparks around the firecracker tip
    const newSparks: Spark[] = [];
    const colors = ['#FF1744', '#FFD700', '#FF9100', '#00E5FF', '#76FF03', '#E040FB', '#FFFFFF'];
    for (let i = 0; i < 24; i++) {
      newSparks.push({
        id: Date.now() + i,
        x: 0,
        y: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: (i / 24) * Math.PI * 2 + (Math.random() - 0.5) * 0.3,
        distance: Math.random() * 70 + 40,
        size: Math.random() * 6 + 3
      });
    }
    setSparks(newSparks);

    setTimeout(() => {
      setIsBlowing(false);
    }, 450);

    setTimeout(() => {
      setSparks([]);
    }, 800);
  };

  // Periodic automatic firecracker blow
  useEffect(() => {
    if (autoBlowInterval <= 0) return;
    const timer = setInterval(() => {
      triggerBlow();
    }, autoBlowInterval);

    return () => clearInterval(timer);
  }, [autoBlowInterval, enableAudio]);

  // Dimension scaling
  const scale = size === 'sm' ? 0.75 : size === 'lg' ? 1.25 : 1;
  const containerW = 220 * scale;
  const containerH = 260 * scale;

  return (
    <div
      id="man-with-firecracker-character"
      onClick={triggerBlow}
      className={`relative select-none cursor-pointer group flex flex-col items-center justify-end ${className}`}
      style={{ width: `${containerW}px`, height: `${containerH}px` }}
      title="Click the detective to blow more firecrackers! 💥"
    >
      {/* Speech Bubble / Blast Phrase */}
      <AnimatePresence>
        {isBlowing && (
          <motion.div
            key={blastCount}
            initial={{ scale: 0, y: 15, opacity: 0 }}
            animate={{ scale: [0, 1.25, 1], y: -15, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute top-0 z-30 pointer-events-none bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 text-slate-950 font-black text-xs sm:text-sm px-3 py-1.5 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.7)] border-2 border-white tracking-wider whitespace-nowrap"
          >
            {PHRASES[phraseIndex]}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sparks explosion container positioned at cracker tip */}
      <div
        className="absolute z-20 pointer-events-none"
        style={{
          left: `${150 * scale}px`,
          top: `${75 * scale}px`
        }}
      >
        <AnimatePresence>
          {sparks.map((spark) => {
            const tx = Math.cos(spark.angle) * spark.distance * scale;
            const ty = Math.sin(spark.angle) * spark.distance * scale;
            return (
              <motion.div
                key={spark.id}
                initial={{ x: 0, y: 0, scale: 1.2, opacity: 1 }}
                animate={{
                  x: tx,
                  y: ty,
                  scale: 0.2,
                  opacity: 0
                }}
                transition={{ duration: 0.65, ease: 'easeOut' }}
                className="absolute rounded-full shadow-lg"
                style={{
                  width: `${spark.size * scale}px`,
                  height: `${spark.size * scale}px`,
                  backgroundColor: spark.color,
                  boxShadow: `0 0 10px ${spark.color}`
                }}
              />
            );
          })}
        </AnimatePresence>

        {/* Shockwave expanding ring */}
        {isBlowing && (
          <motion.div
            initial={{ scale: 0.2, opacity: 1 }}
            animate={{ scale: 2.8, opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-amber-300 pointer-events-none"
            style={{
              width: `${70 * scale}px`,
              height: `${70 * scale}px`,
              left: 0,
              top: 0
            }}
          />
        )}
      </div>

      {/* Vector Illustration of Detective Man with Firecracker */}
      <motion.svg
        width={190 * scale}
        height={220 * scale}
        viewBox="0 0 190 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{
          y: isBlowing ? [0, -10, 2, 0] : [0, -3, 0],
          rotate: isBlowing ? [0, -4, 3, 0] : [0, 0.5, 0]
        }}
        transition={{
          y: isBlowing ? { duration: 0.35 } : { repeat: Infinity, duration: 2, ease: 'easeInOut' },
          rotate: isBlowing ? { duration: 0.35 } : { repeat: Infinity, duration: 2.4, ease: 'easeInOut' }
        }}
        className="filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.6)] overflow-visible"
      >
        <defs>
          <linearGradient id="coatGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <linearGradient id="hatGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
          <linearGradient id="rocketBodyGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>
          <radialGradient id="sparkleGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF" stopOpacity="1" />
            <stop offset="40%" stopColor="#FFD700" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF3D00" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Shadow on ground */}
        <ellipse cx="95" cy="212" rx="55" ry="7" fill="#000000" fillOpacity="0.45" />

        {/* Legs & Shoes */}
        <rect x="74" y="165" width="14" height="42" rx="4" fill="#1E293B" />
        <rect x="100" y="165" width="14" height="42" rx="4" fill="#1E293B" />
        <ellipse cx="79" cy="207" rx="12" ry="5" fill="#0F172A" />
        <ellipse cx="109" cy="207" rx="12" ry="5" fill="#0F172A" />

        {/* Body / Detective Trench Coat */}
        <path
          d="M 60 100 Q 95 90 128 100 L 132 172 Q 95 178 56 172 Z"
          fill="url(#coatGrad)"
          stroke="#475569"
          strokeWidth="1.5"
        />

        {/* Coat Lapels & Gold Detective Badge */}
        <path d="M 75 100 L 95 135 L 70 145 Z" fill="#334155" />
        <path d="M 113 100 L 93 135 L 118 145 Z" fill="#334155" />
        {/* Badge */}
        <circle cx="80" cy="122" r="5.5" fill="#F59E0B" stroke="#FDE68A" strokeWidth="1" />
        <path d="M 80 119 L 81.5 121.5 L 84 122 L 82 123.5 L 82.5 126 L 80 124.5 L 77.5 126 L 78 123.5 L 76 122 L 78.5 121.5 Z" fill="#78350F" />

        {/* Left Arm: Raising & Holding the Rocket Cracker */}
        <path
          d="M 125 108 Q 148 100 152 78"
          stroke="#1E293B"
          strokeWidth="15"
          strokeLinecap="round"
        />
        {/* Left Hand holding rocket base */}
        <circle cx="152" cy="76" r="8" fill="#FBCFE8" />

        {/* Right Arm: Cheering / Sparkler Torch */}
        <path
          d="M 64 110 Q 42 105 32 82"
          stroke="#1E293B"
          strokeWidth="15"
          strokeLinecap="round"
        />
        {/* Right Hand holding sparkler rod */}
        <circle cx="31" cy="80" r="7.5" fill="#FBCFE8" />
        {/* Sparkler wire */}
        <line x1="31" y1="80" x2="18" y2="48" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
        {/* Sparkler flaming tip */}
        <circle cx="18" cy="46" r="6" fill="#F59E0B" />
        <circle cx="18" cy="46" r="3" fill="#FFFFFF" />
        <line x1="18" y1="46" x2="10" y2="38" stroke="#FBBF24" strokeWidth="1.5" />
        <line x1="18" y1="46" x2="26" y2="38" stroke="#FBBF24" strokeWidth="1.5" />
        <line x1="18" y1="46" x2="18" y2="34" stroke="#EF4444" strokeWidth="1.5" />

        {/* Head & Neck */}
        <rect x="88" y="85" width="14" height="15" rx="3" fill="#FBCFE8" />
        {/* Face */}
        <ellipse cx="95" cy="72" rx="20" ry="22" fill="#FBCFE8" />

        {/* Cheerful Eyes */}
        <ellipse cx="88" cy="68" rx="2.5" ry="3.5" fill="#0F172A" />
        <ellipse cx="102" cy="68" rx="2.5" ry="3.5" fill="#0F172A" />
        {/* Eye twinkles */}
        <circle cx="89" cy="67" r="1" fill="#FFFFFF" />
        <circle cx="103" cy="67" r="1" fill="#FFFFFF" />

        {/* Rosy Cheeks */}
        <ellipse cx="83" cy="76" rx="3.5" ry="2" fill="#F43F5E" fillOpacity="0.6" />
        <ellipse cx="107" cy="76" rx="3.5" ry="2" fill="#F43F5E" fillOpacity="0.6" />

        {/* Big Joyful Smile */}
        <path
          d="M 88 77 Q 95 87 102 77"
          stroke="#0F172A"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="#DC2626"
        />

        {/* Detective Fedora Hat */}
        <path
          d="M 68 56 Q 95 48 122 56 L 126 59 Q 95 53 64 59 Z"
          fill="url(#hatGrad)"
          stroke="#1E293B"
          strokeWidth="1.5"
        />
        {/* Hat Crown */}
        <path
          d="M 77 54 L 81 30 Q 95 24 109 30 L 113 54 Z"
          fill="url(#hatGrad)"
        />
        {/* Gold Ribbon Band */}
        <path
          d="M 78 52 Q 95 48 112 52 L 113 46 Q 95 42 77 46 Z"
          fill="#F59E0B"
        />

        {/* THE FIRECRACKER ROCKET in left hand */}
        <g transform="rotate(18 152 74)">
          {/* Rocket stick */}
          <line x1="152" y1="72" x2="152" y2="120" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
          {/* Rocket cylindrical body */}
          <rect
            x="144"
            y="35"
            width="16"
            height="38"
            rx="3"
            fill="url(#rocketBodyGrad)"
            stroke="#991B1B"
            strokeWidth="1.5"
          />
          {/* Decorative gold chevrons on rocket */}
          <path d="M 145 46 L 152 40 L 159 46" stroke="#FEF08A" strokeWidth="2" fill="none" />
          <path d="M 145 56 L 152 50 L 159 56" stroke="#FEF08A" strokeWidth="2" fill="none" />

          {/* Rocket cone tip */}
          <polygon points="142,35 152,18 162,35" fill="#B91C1C" stroke="#7F1D1D" strokeWidth="1" />

          {/* Rocket Fuse burning at tip */}
          <path d="M 152 18 Q 155 12 150 7" stroke="#475569" strokeWidth="1.5" fill="none" />
          {/* Burning Flame & Spark on Fuse */}
          <circle cx="150" cy="7" r="7" fill="url(#sparkleGlow)" />
          <circle cx="150" cy="7" r="3" fill="#FFFFFF" />
        </g>
      </motion.svg>

      {/* Floating Sparkles around character */}
      <motion.div
        animate={{
          scale: [0.8, 1.2, 0.8],
          rotate: [0, 180, 360]
        }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="absolute top-6 left-2 text-amber-400 pointer-events-none"
      >
        <Sparkles className="w-5 h-5 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
      </motion.div>

      <motion.div
        animate={{
          scale: [1.2, 0.7, 1.2],
          y: [0, -5, 0]
        }}
        transition={{ repeat: Infinity, duration: 2.2 }}
        className="absolute bottom-10 right-0 text-red-400 pointer-events-none"
      >
        <Flame className="w-6 h-6 fill-red-500 text-orange-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
      </motion.div>
    </div>
  );
};
