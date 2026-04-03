import { Edit3, MapPin, Link, Ghost, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import type { UserProfile } from '@/app/components/UserContext';
import type { KarmaRank } from '@/app/components/KarmaContext';

interface ProfileHeaderProps {
  user: UserProfile;
  rank: KarmaRank;
  friendCount: number;
  onEditAvatar: () => void;
}

export function ProfileHeader({ user, rank, friendCount, onEditAvatar }: ProfileHeaderProps) {
  const COVER_HEIGHT = 160;

  return (
    <div className="relative">
      {/* Cover banner */}
      <div
        style={{ height: COVER_HEIGHT }}
        className="w-full bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900 relative overflow-hidden"
      >
        {/* Neon glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
        <div className="absolute inset-0">
          <div className="absolute top-4 left-8 w-32 h-32 bg-violet-500/20 rounded-full blur-3xl" />
          <div className="absolute top-8 right-12 w-24 h-24 bg-cyan-500/20 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-1/2 w-48 h-16 bg-purple-500/30 rounded-full blur-2xl -translate-x-1/2" />
        </div>

        {/* Username & badges in cover */}
        <div className="absolute top-12 left-4 flex items-center gap-2">
          <span className="text-white font-bold text-lg tracking-tight drop-shadow-lg">
            {user.username || user.name.toLowerCase().replace(/\s+/g, '_')}
          </span>
          {user.ghostMode && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/40 border border-purple-400/50 backdrop-blur-sm">
              <Ghost className="w-3 h-3 text-purple-300" />
              <span className="text-purple-200 text-[10px] font-semibold">ghost</span>
            </div>
          )}
          {user.isPrivate && (
            <Lock className="w-4 h-4 text-gray-300 drop-shadow" />
          )}
        </div>
      </div>

      {/* Avatar overlapping cover */}
      <div className="px-4" style={{ marginTop: -(COVER_HEIGHT * 0.45) }}>
        <div className="flex items-end justify-between">
          <button onClick={onEditAvatar} className="relative shrink-0">
            {/* Neon ring */}
            <div className="w-24 h-24 rounded-full p-[2.5px] bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 shadow-[0_0_20px_rgba(139,92,246,0.6)]">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover border-[3px] border-black"
                />
              ) : (
                <div
                  className={`w-full h-full rounded-full bg-gradient-to-br ${user.avatarGradient} flex items-center justify-center text-white text-2xl font-black border-[3px] border-black`}
                >
                  {user.avatarInitial}
                </div>
              )}
            </div>
            <div className="absolute bottom-0.5 right-0.5 w-6 h-6 rounded-full bg-cyan-500 border-2 border-black flex items-center justify-center shadow-[0_0_8px_rgba(34,211,238,0.8)]">
              <Edit3 className="w-3 h-3 text-black" />
            </div>
          </button>

          {/* Rank badge */}
          <div className="mb-1">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`px-3 py-1 rounded-full border text-xs font-bold ${rank.color} bg-black/60 border-current/30 backdrop-blur-sm`}
            >
              {rank.name}
            </motion.div>
          </div>
        </div>

        {/* Name & bio */}
        <div className="mt-2">
          <p className="text-white font-bold text-[17px] leading-tight">{user.name}</p>
          {user.bio && (
            <p className="text-gray-400 text-[13px] leading-snug mt-0.5">{user.bio}</p>
          )}
          <div className="flex flex-wrap gap-3 mt-1.5">
            {user.city && (
              <div className="flex items-center gap-1 text-gray-500 text-[12px]">
                <MapPin className="w-3 h-3" />
                <span>{user.city}</span>
              </div>
            )}
            {(user.socialLinks.instagram || user.socialLinks.telegram) && (
              <div className="flex items-center gap-1 text-cyan-400 text-[12px]">
                <Link className="w-3 h-3" />
                {user.socialLinks.instagram && <span>@{user.socialLinks.instagram}</span>}
                {user.socialLinks.telegram && !user.socialLinks.instagram && (
                  <span>t.me/{user.socialLinks.telegram}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
