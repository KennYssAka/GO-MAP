interface Stat {
  label: string;
  value: number;
  onClick?: () => void;
}

interface ProfileStatsProps {
  stats: Stat[];
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  return (
    <div className="flex border-t border-b border-white/[0.06] divide-x divide-white/[0.06] my-3 mx-0">
      {stats.map((s, i) => (
        <button
          key={i}
          onClick={s.onClick}
          disabled={!s.onClick}
          className="flex-1 flex flex-col items-center py-3 gap-0.5 disabled:cursor-default active:bg-white/[0.04] transition-colors"
        >
          <span className="text-white font-black text-[20px] leading-none">{s.value}</span>
          <span className="text-gray-500 text-[11px] font-medium">{s.label}</span>
        </button>
      ))}
    </div>
  );
}
