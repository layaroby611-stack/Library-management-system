/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Bell, Search, BookOpen, GraduationCap } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
}

export default function Header({ currentTab }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 w-full h-16 flex justify-between items-center px-4 md:px-8 sticky top-0 z-50 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-linear-to-tr from-[#ff783e] to-[#ffbb96] p-0.5 rounded-xl flex items-center justify-center shadow-xs overflow-hidden">
          <img src="/src/assets/images/library_logo_1781245000507.jpg" alt="Logo" className="w-full h-full object-cover rounded-lg" referrerPolicy="no-referrer" />
        </div>
        <h1 className="text-xl font-extrabold text-gray-950 tracking-tight">Library Admin</h1>
        <div className="hidden md:flex ml-4 items-center gap-2 bg-gray-100 py-1 px-2.5 rounded-full text-xs font-medium text-gray-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          System Online
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Active view indicator for desktop */}
        <span className="hidden lg:inline text-xs font-semibold text-gray-400 uppercase tracking-widest bg-gray-100 rounded-lg px-2.5 py-1 text-right">
          Console / {currentTab}
        </span>
        
        <button className="relative p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-full transition-all" aria-label="Notifications">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="h-8 w-px bg-gray-200"></div>

        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
            <img 
              alt="Admin Profile" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFBxWQs1gvFQ4Z7ZiHuyV0DH4_Kr-TgnJ8Gv-lNK-j0xWAsiYCK6j6yePuTk7AfY-H9HCIP1OZ3ckOsh0kx8CL6Oo_xGZB9UksBYp4QjqAoiTR5Nle4D71WH8pJuha80diX2fg24dYQ57wy3CjIFWe4sZloca5uhGMIF0vncBNrAn65aEQ79Q3v7goTxQfZHHMiw1_-mh0lA4uV2AiwkxjZpwK3j6zbJYSnafYavxQqOrXdCX7pdpF8S4YxuM_8w3JGhZ3twgB55dp"
            />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-gray-800 leading-none">Marcus Vance</p>
            <p className="text-[10px] text-gray-400">Head Librarian</p>
          </div>
        </div>
      </div>
    </header>
  );
}
