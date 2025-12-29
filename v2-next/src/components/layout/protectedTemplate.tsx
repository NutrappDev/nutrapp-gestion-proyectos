'use client';

import { useState } from "react";
import ProtectedRoute from "../../shared/ProtectedRoute";
import Sidebar from "../../shared/Sidebar";

const ProtectedTemplate = ({ children }: { children: React.ReactNode }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <ProtectedRoute>
      <div className="flex h-screen w-full overflow-hidden bg-gray-50">
        {/* Overlay para móvil */}
        {isActive && (
          <div
            className="fixed inset-0 bg-black/50 z-10 sm:hidden"
            onClick={() => setIsActive(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed sm:static
            top-0 left-0 h-full w-64
            bg-white border-r border-gray-200
            transition-transform duration-300
            ${isActive ? "translate-x-0" : "-translate-x-full"}
            sm:translate-x-0
            z-20
            flex flex-col
            shadow-lg
          `}
        >
          <Sidebar isActive={isActive} />
        </aside>

        {/* Header móvil */}
        <div className="sm:hidden fixed top-0 left-0 w-full h-14 flex items-center px-4 gap-3 bg-white text-black z-30 shadow">
          <button
            onClick={() => setIsActive(!isActive)}
            aria-label="Abrir menú"
            className="
              flex items-center justify-center
              w-10 h-10
              rounded-md
              bg-white
              border-2 border-gray-300
              shadow-[0_4px_0_0_rgba(0,0,0,0.15)]
              transition-all duration-100
              hover:bg-gray-100
              active:translate-y-[2px]
              active:shadow-[0_1px_0_0_rgba(0,0,0,0.2)]
            "
          >
            <img
              src="/images/dev-icon.png"
              alt="logo"
              className="w-6 h-6 object-contain"
            />
          </button>
          <h2 className="text-lg text-purple-900 font-semibold">Nutrapp</h2>
        </div>

        {/* Main Content */}
        <main className="
          flex-1
          h-full
          overflow-auto
          pt-14 sm:pt-0
          bg-background
        ">
          <div className="h-full p-0 sm:p-6">
            <div className="bg-surface p-4 sm:p-6 rounded-lg">
              {children}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default ProtectedTemplate;