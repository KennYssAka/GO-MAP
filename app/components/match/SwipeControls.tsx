import { X, Heart, Star } from 'lucide-react';
import { motion } from 'motion/react';
import type { SwipeDir } from './MatchCard';

interface SwipeControlsProps {
  onSwipe: (dir: SwipeDir) => void;
  disabled: boolean;
}

export function SwipeControls({ onSwipe, disabled }: SwipeControlsProps) {
  return (
    <div className="flex items-center justify-center gap-5 px-8">
      {/* Dislike */}
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={() => onSwipe('left')}
        disabled={disabled}
        className="w-14 h-14 rounded-full bg-gray-900 border-2 border-red-500/50 flex items-center justify-center shadow-[0_0_16px_rgba(239,68,68,0.3)] disabled:opacity-40 transition-opacity"
      >
        <X className="w-6 h-6 text-red-400" />
      </motion.button>

      {/* Superlike */}
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={() => onSwipe('up')}
        disabled={disabled}
        className="w-12 h-12 rounded-full bg-gray-900 border-2 border-cyan-500/50 flex items-center justify-center shadow-[0_0_12px_rgba(34,211,238,0.3)] disabled:opacity-40 transition-opacity"
      >
        <Star className="w-5 h-5 text-cyan-400" />
      </motion.button>

      {/* Like */}
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={() => onSwipe('right')}
        disabled={disabled}
        className="w-14 h-14 rounded-full bg-gray-900 border-2 border-green-500/50 flex items-center justify-center shadow-[0_0_16px_rgba(34,197,94,0.3)] disabled:opacity-40 transition-opacity"
      >
        <Heart className="w-6 h-6 text-green-400" />
      </motion.button>
    </div>
  );
}
