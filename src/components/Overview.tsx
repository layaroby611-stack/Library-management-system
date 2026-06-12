/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Book, Transaction, Student } from '../types';
import { BookOpen, ExternalLink, Calendar, ChevronRight, User, TrendingUp, AlertCircle, ArrowRight, Ban } from 'lucide-react';
import { motion } from 'motion/react';

interface OverviewProps {
  books: Book[];
  students: Student[];
  transactions: Transaction[];
  onNavigate: (tab: string) => void;
  onOpenAddBook: () => void;
  onOpenAddStudent: () => void;
}

export default function Overview({
  books,
  students,
  transactions,
  onNavigate,
  onOpenAddBook,
  onOpenAddStudent,
}: OverviewProps) {
  // Compute dynamic stats based on library state
  const baselineBooks = 1240;
  const baselineIssued = 150;
  const baselineOverdue = 12;

  const currentIssuedCount = books.filter((b) => b.status === 'Issued' || b.status === 'Overdue').length;
  const currentOverdueCount = books.filter((b) => b.status === 'Overdue').length;

  const totalBooksStat = baselineBooks + (books.length - 14);
  const issuedStat = baselineIssued + (currentIssuedCount - 8);
  const overdueStat = baselineOverdue + (currentOverdueCount - 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Dashboard Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Overview</span>
          <h2 className="text-3xl font-extrabold text-gray-950 tracking-tight">Dashboard</h2>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={() => onNavigate('Transactions')}
            className="cursor-pointer bg-primary text-white font-semibold text-sm px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-primary-hover active:scale-98 transition-all shadow-xs"
          >
            <BookOpen className="w-4 h-4" />
            Issue Book
          </button>
          <button
            onClick={onOpenAddBook}
            className="cursor-pointer border border-gray-300 bg-white text-gray-700 font-semibold text-sm px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-gray-50 active:scale-98 transition-all shadow-xs"
          >
            Add New Book
          </button>
        </div>
      </div>

      {/* Premium Welcome Banner with Generated Assets */}
      <div className="bg-linear-to-r from-[#fff2e8] to-[#fffaf6] border border-[#ffccc7]/40 p-6 md:p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative shadow-xs">
        <div className="space-y-3 z-10 max-w-lg">
          <div className="flex items-center gap-2">
            <img src="/src/assets/images/library_logo_1781245000507.jpg" alt="Logo" className="w-8 h-8 rounded-lg object-contain" referrerPolicy="no-referrer" />
            <span className="text-[10px] font-extrabold text-[#e3581f] uppercase tracking-widest">Library Management System</span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-950 tracking-tight leading-tight">
            Streamlining campus literature & digital assets
          </h2>
          <p className="text-xs text-[#5f5e5f] leading-relaxed">
            Welcome back to the administrator panel, Marcus. You can manage available books, analyze live circulation rates, add new digital frames, and track active student checkout logs.
          </p>
        </div>
        
        {/* Beautiful Circular Hero Image exactly like mockup design */}
        <div className="relative shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-white shadow-md">
          <img 
            src="/src/assets/images/library_hero_1781244979932.jpg" 
            alt="Library Hand Reaching Book" 
            className="w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Decorative elements */}
        <div className="absolute right-0 top-0 w-32 h-32 bg-[#ff783e]/5 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* Metrics Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 p-6 rounded-xl flex flex-col justify-between min-h-[140px] shadow-xs relative overflow-hidden group hover:border-primary transition-all">
          <div className="flex justify-between items-start">
            <span className="p-2 bg-orange-50 text-primary rounded-lg">
              <BookOpen className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">+2.4% vs last month</span>
          </div>
          <div className="mt-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Total Books</p>
            <p className="text-3xl font-extrabold text-gray-900 mt-1">{totalBooksStat.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-6 rounded-xl flex flex-col justify-between min-h-[140px] shadow-xs relative overflow-hidden group hover:border-primary transition-all">
          <div className="flex justify-between items-start">
            <span className="p-2 bg-orange-50 text-primary rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active circulation</span>
          </div>
          <div className="mt-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Issued</p>
            <p className="text-3xl font-extrabold text-gray-900 mt-1">{issuedStat}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-6 rounded-xl flex flex-col justify-between min-h-[140px] shadow-xs relative overflow-hidden group hover:border-red-300 transition-all">
          <div className="flex justify-between items-start">
            <span className="p-2 bg-red-50 text-red-600 rounded-lg">
              <AlertCircle className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Action required</span>
          </div>
          <div className="mt-4">
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest leading-none">Overdue</p>
            <p className="text-3xl font-extrabold text-red-600 mt-1">{overdueStat}</p>
          </div>
        </div>
      </div>

      {/* Main Split Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions List */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
              <button
                onClick={() => onNavigate('Transactions')}
                className="cursor-pointer text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                View All
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="divide-y divide-gray-100">
              {transactions.slice(0, 4).map((tx) => (
                <div
                  key={tx.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-14 bg-gray-100 border border-gray-200 rounded flex-shrink-0 flex items-center justify-center overflow-hidden shadow-xs">
                      {tx.cover ? (
                        <img src={tx.cover} alt={tx.bookTitle} className="w-full h-full object-cover" />
                      ) : (
                        <BookOpen className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 leading-tight">{tx.bookTitle}</h4>
                      <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                        <User className="w-3 h-3 flex-shrink-0" />
                        Student: {tx.studentName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        tx.status === 'Returned'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : tx.status === 'Overdue'
                          ? 'bg-red-50 text-red-700 border border-red-100'
                          : 'bg-blue-50 text-blue-700 border border-blue-100'
                      }`}
                    >
                      {tx.status}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-1 flex items-center justify-end gap-1 font-mono">
                      <Calendar className="w-2.5 h-2.5" />
                      {tx.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              {transactions.length === 0 && (
                <div className="py-8 text-center text-gray-400 text-sm">
                  No transactions recorded yet.
                </div>
              )}
            </div>
          </div>

          {/* Desktop Circulation Rate Bar Chart Visualizer */}
          <div className="mt-8 bg-white border border-gray-200 p-6 rounded-xl shadow-xs">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="text-md font-bold text-gray-900 leading-none">Circulation Rate</h4>
                <p className="text-xs text-gray-400 mt-1">Weekly checkout distribution index</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-sm">
                <TrendingUp className="w-3.5 h-3.5" />
                Active Circulation
              </div>
            </div>

            {/* Custom SVG/CSS Bar Chart representing Mon-Fri checkout volume */}
            <div className="relative pt-4">
              <div className="flex items-end justify-between h-36 border-b border-gray-100 pb-2 px-4 gap-4">
                {[
                  { day: 'MON', val: 78, active: false },
                  { day: 'TUE', val: 110, active: false },
                  { day: 'WED', val: 148, active: true },
                  { day: 'THU', val: 102, active: false },
                  { day: 'FRI', val: 132, active: false },
                ].map((bar, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center group relative cursor-pointer">
                    {/* Tooltip */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[10px] py-1 px-1.5 rounded-sm shadow-md font-semibold z-10 whitespace-nowrap">
                      {bar.val} books checked out
                    </div>
                    {/* Bar Pillar */}
                    <div 
                      className={`w-full max-w-[40px] rounded-t-sm transition-all duration-500`}
                      style={{ 
                        height: `${(bar.val / 150) * 100}%`,
                        backgroundColor: bar.active ? '#ff783e' : '#cbd5e1'
                      }}
                    ></div>
                    {/* Label */}
                    <span className="text-[10px] font-bold text-gray-400 mt-2 tracking-wider">{bar.day}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 bg-orange-50/50 border border-orange-100 p-3 rounded-lg flex items-start gap-2 text-xs text-orange-950">
                <AlertCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Mid-week peak detected:</strong> Wednesday has the highest checkout density. Correct staffing ratios are recommended around 14:00 to avoid return service delays.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar / Insights & Settings */}
        <aside className="space-y-6">
          {/* Library Performance */}
          <div className="bg-primary text-white p-6 rounded-xl shadow-xs relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-lg font-bold mb-1.5">Library Performance</h4>
              <p className="text-blue-100 text-xs mb-6">
                The library inventory circulation rate has increased by 15% this academic week.
              </p>
              
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <div className="bg-white h-full w-[75%] rounded-full transition-all duration-1000"></div>
              </div>
              <div className="flex justify-between mt-2.5 text-[10px] font-bold tracking-wider uppercase text-blue-200">
                <span>Target: 2k Books</span>
                <span>75% Achieved</span>
              </div>
            </div>
            {/* SVG graph background */}
            <div className="absolute -bottom-8 -right-8 opacity-10 group-hover:scale-105 transition-transform">
              <BookOpen className="w-36 h-36" />
            </div>
          </div>

          {/* Quick Category Select */}
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-xs">
            <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Quick Filters</h4>
            <div className="flex flex-wrap gap-2">
              {['Design', 'Frames', 'Big Data', 'AI', 'Scientific', 'Fiction', 'Action Story'].map((category) => (
                <button
                  key={category}
                  onClick={() => onNavigate('Inventory')}
                  className="cursor-pointer bg-gray-50 border border-gray-100 px-3.5 py-1.5 rounded-full text-xs font-semibold text-gray-600 hover:bg-primary hover:text-white hover:border-primary transition-all"
                >
                  {category}
                </button>
              ))}
            </div>
            
            <hr className="my-5 border-gray-100" />
            
            <button
              onClick={() => onNavigate('Inventory')}
              className="cursor-pointer flex items-center gap-2 text-xs font-bold text-primary group hover:underline"
            >
              Search book database
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* System Status Alerts */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Librarian Alerts</h4>
            
            <div className="space-y-3">
              <div className="flex gap-2.5 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5"></span>
                <div>
                  <p className="font-semibold text-gray-800">Inventory Audit Required</p>
                  <p className="text-gray-400 mt-0.5">Computer Science wing (F-Wing) stock inspection scheduled for tomorrow.</p>
                </div>
              </div>
              <div className="flex gap-2.5 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5"></span>
                <div>
                  <p className="font-semibold text-gray-800">New Systems Active</p>
                  <p className="text-gray-400 mt-0.5">Database auto-syncing configured with central campus server.</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </motion.div>
  );
}
