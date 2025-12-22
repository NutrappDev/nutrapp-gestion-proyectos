'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isActive: boolean;
  setisActive?:(active: boolean) => void;
}

interface Route {
  path: string;
  label: string;
}

const Sidebar = ({ isActive, setisActive }: SidebarProps) => {
  const pathname = usePathname();

  const routes: Route[] = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/home', label: 'Home' },
  ];

  return (
    <div
      className={`
        min-h-full w-full
        bg-surface
        pt-[20%]
        sm:pt-0
        transition-opacity duration-300
        ${isActive ? 'opacity-100' : 'opacity-0 sm:opacity-100'}
      `}
    >
      {/* Header */}
      <div className="
        flex items-center p-4 font-bold
        text-foreground
        hidden sm:flex
        border-b border-border
      ">
        <div className="
          w-[3rem] h-[3rem]
          rounded
          bg-background
          flex items-center justify-center
          p-1
          border border-border
        ">
          <img
            src="/images/dev-icon.png"
            alt="logo"
            className="w-full h-full object-contain"
          />
        </div>
        <h2 className="text-xl p-2 text-primary">
          Nutrapp
        </h2>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2 flex flex-col">
        {routes.map((route) => {
          const isCurrent = pathname === route.path;

          return (
            <Link
              key={route.path}
              href={route.path}
              aria-current={isCurrent ? 'page' : undefined}
              className={`
                w-full rounded-md px-3 py-2 transition-colors
                ${isCurrent
                  ? 'bg-primary text-white'
                  : 'bg-background text-foreground hover:bg-surface'}
                focus:outline-none
                focus:ring-2 focus:ring-primary/40
              `}
            >
              {route.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
