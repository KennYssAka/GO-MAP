interface ProfileInterestsProps {
  interests: string[];
}

export function ProfileInterests({ interests }: ProfileInterestsProps) {
  if (!interests.length) return null;

  return (
    <div className="px-4 mb-4">
      <p className="text-gray-500 text-[11px] font-semibold uppercase tracking-wider mb-2">Интересы</p>
      <div className="flex flex-wrap gap-1.5">
        {interests.slice(0, 12).map((interest) => (
          <span
            key={interest}
            className="px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[12px] font-medium"
          >
            {interest}
          </span>
        ))}
      </div>
    </div>
  );
}
