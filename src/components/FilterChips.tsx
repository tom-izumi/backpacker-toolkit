interface FilterChipsProps {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}

export default function FilterChips({
  label,
  options,
  selected,
  onToggle,
}: FilterChipsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto">
      <span className="shrink-0 text-sm text-muted">{label}</span>
      <div className="flex shrink-0 gap-1.5">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              className={
                active
                  ? 'rounded-full border border-accent bg-accent/15 px-3 py-1 text-sm text-accent transition-colors'
                  : 'rounded-full border border-border bg-surface px-3 py-1 text-sm text-muted transition-colors hover:bg-surface-hover'
              }
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
