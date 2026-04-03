import { forwardRef, useCallback, useImperativeHandle } from 'react';
import { MapPin, Sparkles } from 'lucide-react';
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
  type PanInfo,
} from 'motion/react';

export interface MatchProfile {
  id: number;
  name: string;
  age: number;
  vibe: string;
  vibeEmoji: string;
  location: string;
  distance: string;
  interests: string[];
  bio: string;
  match: number;
  status: 'online' | 'active' | 'offline';
  gradient: string;
  initial: string;
}

export type SwipeDir = 'left' | 'right' | 'up';

export interface MatchCardHandle {
  flyAway: (dir: SwipeDir) => void;
}

const SWIPE_THRESHOLD = 90;
const VELOCITY_THRESHOLD = 500;

export const MatchCard = forwardRef<MatchCardHandle, {
  profile: MatchProfile;
  onSwiped: (dir: SwipeDir) => void;
  isTop: boolean;
}>(({ profile, onSwiped, isTop }, ref) => {
  const controls = useAnimation();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotate = useTransform(x, [-400, 0, 400], [-22, 0, 22]);
  const likeOpacity = useTransform(x, [0, 60, 140], [0, 0.7, 1]);
  const nopeOpacity = useTransform(x, [-140, -60, 0], [1, 0.7, 0]);
  const superOpacity = useTransform(y, [-140, -60, 0], [1, 0.7, 0]);

  const flyAway = useCallback(async (dir: SwipeDir) => {
    const target =
      dir === 'right' ? { x: 620, y: -40, rotate: 30 }
      : dir === 'left'  ? { x: -620, y: -40, rotate: -30 }
      :                   { x: 0, y: -700, rotate: 0 };

    await controls.start({ ...target, opacity: 0, transition: { duration: 0.28, ease: 'easeIn' } });
    onSwiped(dir);
  }, [controls, onSwiped]);

  useImperativeHandle(ref, () => ({ flyAway }), [flyAway]);

  const handleDragEnd = useCallback((_: unknown, info: PanInfo) => {
    const { offset, velocity } = info;
    if (offset.y < -SWIPE_THRESHOLD || velocity.y < -VELOCITY_THRESHOLD) {
      flyAway('up');
    } else if (offset.x > SWIPE_THRESHOLD || velocity.x > VELOCITY_THRESHOLD) {
      flyAway('right');
    } else if (offset.x < -SWIPE_THRESHOLD || velocity.x < -VELOCITY_THRESHOLD) {
      flyAway('left');
    } else {
      controls.start({
        x: 0, y: 0, rotate: 0,
        transition: { type: 'spring', stiffness: 500, damping: 35 },
      });
    }
  }, [flyAway, controls]);

  return (
    <motion.div
      style={{ x, y, rotate, position: 'absolute', width: '100%', height: '100%' }}
      animate={controls}
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.02, cursor: 'grabbing' }}
    >
      {/* LIKE overlay */}
      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute top-8 left-6 z-20 border-4 border-green-400 rounded-xl px-4 py-2 rotate-[-15deg]"
      >
        <span className="text-green-400 text-2xl font-black tracking-wider">LIKE</span>
      </motion.div>

      {/* NOPE overlay */}
      <motion.div
        style={{ opacity: nopeOpacity }}
        className="absolute top-8 right-6 z-20 border-4 border-red-400 rounded-xl px-4 py-2 rotate-[15deg]"
      >
        <span className="text-red-400 text-2xl font-black tracking-wider">NOPE</span>
      </motion.div>

      {/* SUPER overlay */}
      <motion.div
        style={{ opacity: superOpacity }}
        className="absolute bottom-36 left-1/2 -translate-x-1/2 z-20 border-4 border-cyan-400 rounded-xl px-4 py-2"
      >
        <span className="text-cyan-400 text-2xl font-black tracking-wider">SUPER</span>
      </motion.div>

      {/* Card */}
      <div className="h-full rounded-3xl overflow-hidden shadow-2xl shadow-black/80 flex flex-col select-none">
        {/* Gradient hero */}
        <div className={`relative flex-1 min-h-0 bg-gradient-to-br ${profile.gradient}`}>
          {/* Big initial letter */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <span className="text-[180px] font-black text-white/10 leading-none select-none">
              {profile.initial}
            </span>
          </div>

          {/* Match % badge */}
          <div className="absolute top-4 right-4 z-10 bg-black/40 backdrop-blur-md rounded-full px-3.5 py-1.5 flex items-center gap-1.5 shadow-[0_0_12px_rgba(34,211,238,0.4)]">
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span className="text-white font-bold text-sm">{profile.match}%</span>
          </div>

          {/* Online indicator */}
          {profile.status === 'online' && (
            <div className="absolute top-4 left-4 z-10 bg-green-500/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold text-white flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              Online
            </div>
          )}

          {/* Fade to card bottom */}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />

          {/* Info overlay */}
          <div className="absolute inset-x-0 bottom-0 p-5 z-10">
            <h2 className="text-white text-3xl font-bold mb-1 drop-shadow-lg">
              {profile.name}, {profile.age}
            </h2>
            <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
              <span className="text-xl leading-none">{profile.vibeEmoji}</span>
              <span className="font-medium">{profile.vibe}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/60 text-xs">
              <MapPin className="w-3.5 h-3.5" />
              <span>{profile.location}</span>
              <span className="mx-0.5">·</span>
              <span>{profile.distance}</span>
            </div>
          </div>
        </div>

        {/* Bio + interests */}
        <div className="p-5 bg-gray-900 border-t border-white/[0.06]">
          <p className="text-gray-300 text-sm mb-3 leading-relaxed line-clamp-2">{profile.bio}</p>
          <div className="flex flex-wrap gap-1.5">
            {profile.interests.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-white/[0.07] text-white/80 text-xs font-medium border border-white/[0.06]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

MatchCard.displayName = 'MatchCard';
