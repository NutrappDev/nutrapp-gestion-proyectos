interface CardProps {
  name: string;
  label: string;
  members: number;
  initials: string;
  color: string;
  onClick?: () => void;
  isSelected: boolean;
}

export default function CardUsers({ 
  name, 
  label, 
  members, 
  initials, 
  color,
  onClick,
  isSelected
}: CardProps) {
  return (
    <div 
      className={`
        bg-background
        border ${isSelected ? 'border-primary' : 'border-border'}
        rounded-lg
        p-4
        w-full sm:min-w-[150px]
        flex flex-col items-center gap-4
        hover:translate-y-2
        cursor-pointer
        text-truncate
        transition-all duration-200
        ${isSelected ? 'ring-2 ring-primary/20' : ''}
      `}
      onClick={onClick}
    >
      <p className="text-sm font-medium text-foreground">
        {name}
      </p>

      <div
        style={{ backgroundColor: color }}
        className="h-10 w-10 rounded-full flex items-center justify-center p-1"
      >
        <span className="font-bold text-white">
          {initials}
        </span>
      </div>

      <div className="bg-surface w-full flex justify-center rounded-full p-2">
        <div
          style={{ backgroundColor: color }}
          className="h-7 w-7 rounded-full flex items-center justify-center p-1"
        >
          <span className="font-bold text-white">
            {members}
          </span>
        </div>
      </div>
    </div>
  );
}