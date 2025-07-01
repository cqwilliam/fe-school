"use client";

import { useState } from "react";

interface MenuItem {
  id: string;
  label: string;
  icon: string;
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
  return (
    <nav className="mt-6">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSectionChange(item.id)}
          className={`w-full text-left px-6 py-3 flex items-center space-x-3 transition-colors ${
            activeSection === item.id
              ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <span className="text-lg">{item.icon}</span>
          <span className="font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
