"use client";

import { useState } from "react";

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  disabled?: boolean;
  tooltip?: string;
}

interface MenuItemsProps {
  items: MenuItem[];
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function MenuItems({
  items,
  activeSection,
  onSectionChange,
}: MenuItemsProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <nav className="px-3 py-4 space-y-1" aria-label="Menú principal">
      {items.map((item) => {
        const isActive = activeSection === item.id;
        const isHovered = hoveredItem === item.id;
        const isDisabled = item.disabled;

        return (
          <button
            key={item.id}
            onClick={() => !isDisabled && onSectionChange(item.id)}
            onMouseEnter={() => !isDisabled && setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
            disabled={isDisabled}
            aria-disabled={isDisabled}
            aria-current={isActive ? "page" : undefined}
            aria-label={item.tooltip || item.label}
            className={`relative w-full text-left px-4 py-2.5 rounded-lg 
              ${isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
              flex items-center space-x-3 transition-all duration-200 ease-in-out
              group overflow-hidden
              ${
                isActive
                  ? "border border-green-400 text-green-400 bg-green-50"
                  : isDisabled
                  ? "text-gray-400"
                  : "text-gray-700 hover:border hover:border-green-400"
              }
            `}
          >
            {!isActive && isHovered && !isDisabled && (
              <span className="absolute inset-0 bg-white opacity-10 blur-sm animate-pulse-once" />
            )}

            {isActive && (
              <span className="absolute inset-0 bg-green-50 opacity-30 animate-fade-in" />
            )}

            <div
              className={`relative flex items-center justify-center w-8 h-8 rounded-md 
                transition-all duration-200
                ${
                  isActive
                    ? "bg-green-100 text-green-400 border border-green-400"
                    : isDisabled
                    ? "bg-gray-100 text-gray-400"
                    : "text-gray-500 group-hover:bg-green-100 group-hover:text-green-400"
                }
              `}
              title={item.tooltip}
            >
              <img
                src={item.icon}
                alt={item.label}
                className="w-6 h-6 object-contain"
              />
            </div>

            <span
              className={`relative font-medium text-sm transition-all duration-200
              ${isActive ? "text-green-400" : ""}
            `}
            >
              {item.label}
            </span>

            {isActive && (
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-green-400 rounded-l-full animate-fade-in" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
