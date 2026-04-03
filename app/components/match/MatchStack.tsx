import { useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MatchCard, type MatchProfile, type MatchCardHandle, type SwipeDir } from './MatchCard';

export interface MatchStackHandle {
  triggerSwipe: (dir: SwipeDir) => void;
}

interface MatchStackProps {
  profiles: MatchProfile[];
  currentIndex: number;
  onSwiped: (dir: SwipeDir) => void;
}

export const MatchStack = forwardRef<MatchStackHandle, MatchStackProps>(
  ({ profiles, currentIndex, onSwiped }, ref) => {
    const topCardRef = useRef<MatchCardHandle>(null);

    const triggerSwipe = useCallback((dir: SwipeDir) => {
      topCardRef.current?.flyAway(dir);
    }, []);

    useImperativeHandle(ref, () => ({ triggerSwipe }), [triggerSwipe]);

    if (currentIndex >= profiles.length) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8">
          <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center text-4xl">
            ✨
          </div>
          <p className="text-white text-xl font-bold text-center">Все карточки просмотрены!</p>
          <p className="text-gray-400 text-sm text-center">
            Загляни позже — появятся новые люди рядом с тобой
          </p>
        </div>
      );
    }

    const visibleProfiles = profiles.slice(currentIndex, currentIndex + 3);

    return (
      <div className="flex-1 relative mx-4">
        <AnimatePresence>
          {visibleProfiles
            .slice()
            .reverse()
            .map((profile, reversedIdx) => {
              const stackIdx = visibleProfiles.length - 1 - reversedIdx;
              const isTop = stackIdx === 0;

              return (
                <motion.div
                  key={profile.id}
                  initial={{ scale: 1 - stackIdx * 0.04, y: stackIdx * 10 }}
                  animate={{ scale: 1 - stackIdx * 0.04, y: stackIdx * 10 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  style={{ position: 'absolute', inset: 0, zIndex: 10 - stackIdx }}
                >
                  <MatchCard
                    ref={isTop ? topCardRef : undefined}
                    profile={profile}
                    onSwiped={onSwiped}
                    isTop={isTop}
                  />
                </motion.div>
              );
            })}
        </AnimatePresence>
      </div>
    );
  }
);

MatchStack.displayName = 'MatchStack';
