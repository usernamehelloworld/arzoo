import React from "react";

interface SidebarToggleProps {
  isOpen: boolean;
  toggle: () => void;
}

const SidebarToggle = ({ isOpen, toggle }: SidebarToggleProps) => (
  <button
    onClick={toggle}
    className="absolute left-2 top-2 z-40 p-2 rounded-full bg-[#232326] text-white shadow-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/40 hover:bg-[#232326]/80 active:scale-95"
    aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
    tabIndex={0}
    style={{ transitionProperty: 'background, box-shadow, border, color, transform' }}
  >
    <span className="sr-only">Toggle Sidebar</span>
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu w-6 h-6">
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  </button>
);

export default SidebarToggle;
