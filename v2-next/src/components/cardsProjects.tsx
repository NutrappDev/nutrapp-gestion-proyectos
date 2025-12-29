interface CardProps {
  name: string;
  avatarUrls?: string;
  projectTypeKey?: number;
  simplified?: boolean;
  onClick?: () => void;
  isSelected: boolean;
}

export default function CardProjects({
  name,
  isSelected,
  onClick
}: CardProps) {
  const hoursDay = Array.from({ length: 24 }, (_, i) => i + 1);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      className={`
        bg-surface
        border
        rounded-lg
        p-2
        sm:p-4
        w-full
        h-full
        sm:min-w-[20%]
        flex flex-col items-center gap-4
        cursor-pointer
        transition-all duration-200
        hover:-translate-y-1
        ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border'}
      `}
    >
      <div className="">
        <p className="text-sm font-medium text-foreground truncate text-center">
          {name}
        </p>
      </div>

      <div className="flex gap-1 w-full h-full bg-background p-2 rounded-md">
        <div className="w-[15%] flex text-center items-center">
          <p>Dev</p>
        </div>
        {hoursDay.map((hour) => (
          <div
            key={hour}
            className="flex-1 bg-green-400 rounded-md"
          />
        ))}
      </div>
      
      <div className="flex gap-1 w-full h-full bg-background p-2 rounded-md">
        <div className="w-[15%] flex text-center items-center">
          <p>Qa</p>
        </div>
        {hoursDay.map((hour) => (
          <div
            key={hour}
            className="flex-1 bg-green-400 rounded-md "
          />
        ))}
      </div>
    </div>
  );
}
