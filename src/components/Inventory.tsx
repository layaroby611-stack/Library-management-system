/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Book } from '../types';
import { Search, Plus, BookOpen, AlertCircle, Bookmark, Check, Layers, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InventoryProps {
  books: Book[];
  onAddBook: (newBook: Omit<Book, 'id'>) => void;
  isAddModalOpenInitially?: boolean;
}

export default function Inventory({ books, onAddBook, isAddModalOpenInitially = false }: InventoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Available' | 'Issued' | 'Overdue' | 'Recently Added'>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [isAddOpen, setIsAddOpen] = useState(isAddModalOpenInitially);
  
  // New book form states
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [category, setCategory] = useState('Design');
  const [location, setLocation] = useState('');
  const [coverUrl, setCoverUrl] = useState('');

  const [formError, setFormError] = useState('');

  React.useEffect(() => {
    if (isAddModalOpenInitially) {
      setIsAddOpen(true);
    }
  }, [isAddModalOpenInitially]);

  // Color mapper helper based on mockup image details
  const getCategoryTheme = (cat: string) => {
    const norm = cat.toLowerCase();
    if (norm.includes('design')) {
      return {
        bg: 'bg-[#fff1f0]',
        text: 'text-[#ff4d4f]',
        border: 'border-[#ffccc7]',
        pillBg: 'bg-[#ff7875]',
        stripe: 'bg-[#ff7875]'
      };
    }
    if (norm.includes('frame')) {
      return {
        bg: 'bg-[#fff7e6]',
        text: 'text-[#fa8c16]',
        border: 'border-[#ffd591]',
        pillBg: 'bg-[#ffbb96]',
        stripe: 'bg-[#ffbb96]'
      };
    }
    if (norm.includes('big data') || norm.includes('data')) {
      return {
        bg: 'bg-[#e6f7ff]',
        text: 'text-[#1890ff]',
        border: 'border-[#91d5ff]',
        pillBg: 'bg-[#91d5ff]',
        stripe: 'bg-[#91d5ff]'
      };
    }
    if (norm.includes('scientific') || norm.includes('science')) {
      return {
        bg: 'bg-[#e6f4ea]',
        text: 'text-[#137333]',
        border: 'border-[#ceead6]',
        pillBg: 'bg-[#34a853]',
        stripe: 'bg-[#34a853]'
      };
    }
    if (norm.includes('fiction')) {
      return {
        bg: 'bg-[#fdf0f5]',
        text: 'text-[#c2185b]',
        border: 'border-[#f8bbd0]',
        pillBg: 'bg-[#e91e63]',
        stripe: 'bg-[#e91e63]'
      };
    }
    if (norm.includes('action') || norm.includes('story')) {
      return {
        bg: 'bg-[#fffbeb]',
        text: 'text-[#b45309]',
        border: 'border-[#fde68a]',
        pillBg: 'bg-[#f59e0b]',
        stripe: 'bg-[#f59e0b]'
      };
    }
    if (norm.includes('ai') || norm.includes('cs')) {
      return {
        bg: 'bg-[#f9f0ff]',
        text: 'text-[#722ed1]',
        border: 'border-[#d3adf7]',
        pillBg: 'bg-[#d3adf7]',
        stripe: 'bg-[#d3adf7]'
      };
    }
    return {
      bg: 'bg-orange-50',
      text: 'text-primary',
      border: 'border-orange-100',
      pillBg: 'bg-primary-hover',
      stripe: 'bg-primary'
    };
  };

  // Handle book submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author) {
      setFormError('Please enter at least a book title and author.');
      return;
    }
    
    onAddBook({
      title,
      author,
      isbn: isbn || `978-${Math.floor(Math.random() * 1000000000)}`,
      status: 'Available',
      location: location || 'A-101',
      cover: coverUrl || '',
      category,
      rating: parseFloat((4.0 + Math.random() * 1.0).toFixed(1)),
    });

    // Reset fields
    setTitle('');
    setAuthor('');
    setIsbn('');
    setCategory('Design');
    setLocation('');
    setCoverUrl('');
    setFormError('');
    setIsAddOpen(false);
  };

  // Filter books matching search term, active status filter, and category filter
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm);

    if (!matchesSearch) return false;

    // Apply status filter
    if (statusFilter !== 'All') {
      if (statusFilter === 'Available' && book.status !== 'Available') return false;
      if (statusFilter === 'Issued' && book.status !== 'Issued') return false;
      if (statusFilter === 'Overdue' && book.status !== 'Overdue') return false;
      if (statusFilter === 'Recently Added') {
        const isRecent = book.id === 'B-011' || book.id === 'B-012' || book.id === 'B-013' || book.id === 'B-014';
        if (!isRecent) return false;
      }
    }

    // Apply category filter
    if (categoryFilter !== 'All') {
      if (!book.category.toLowerCase().includes(categoryFilter.toLowerCase())) {
        return false;
      }
    }

    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Search and Quick Filters */}
      <section className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xs space-y-5">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all text-sm text-gray-950 placeholder:text-gray-400 font-sans"
            placeholder="Type book name or Author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Horizontal Navigation Status Tabs from Mockup */}
        <div className="flex border-b border-gray-100 pb-1 gap-6">
          {[
            { tag: 'All', label: 'Library' },
            { tag: 'Available', label: 'Available' },
            { tag: 'Issued', label: 'Orders / Issued' },
            { tag: 'Overdue', label: 'Overdue' },
          ].map(({ tag, label }) => (
            <button
              key={tag}
              onClick={() => setStatusFilter(tag as any)}
              className={`cursor-pointer pb-2.5 text-sm font-bold transition-all relative ${
                statusFilter === tag
                  ? 'text-primary font-extrabold'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {label}
              {statusFilter === tag && (
                <motion.div
                  layoutId="statusUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        {/* Elegant Design Pill Tags from the Uploaded Image */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Browse Categories</p>
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setCategoryFilter('All')}
              className={`cursor-pointer px-4.5 py-2 text-xs font-bold rounded-lg transition-all border ${
                categoryFilter === 'All'
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
              }`}
            >
              All Genres
            </button>
            {[
              { name: 'Design', label: 'Design' },
              { name: 'Frames', label: 'Frames' },
              { name: 'Big Data', label: 'Big Data' },
              { name: 'AI', label: 'AI' },
              { name: 'Scientific', label: 'Scientific' },
              { name: 'Fiction', label: 'Fiction' },
              { name: 'Action Story', label: 'Action Story' },
            ].map((cat) => {
              const theme = getCategoryTheme(cat.name);
              const isSelected = categoryFilter.toLowerCase() === cat.name.toLowerCase();
              return (
                <button
                  key={cat.name}
                  onClick={() => setCategoryFilter(cat.name)}
                  className={`cursor-pointer px-4.5 py-2 text-xs font-bold rounded-lg transition-all border ${
                    isSelected
                      ? `${theme.bg} ${theme.text} ${theme.border} ring-2 ring-offset-1 ring-primary/25`
                      : `bg-white border-gray-100 text-[#5f5e5f] hover:bg-gray-50`
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Header section with live feed statistics */}
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Collection Catalog</p>
          <h3 className="text-xl font-extrabold text-gray-950 mt-1">Found Books</h3>
        </div>
        <p className="text-xs text-gray-500 font-medium">
          Showing <span className="font-bold text-primary">{filteredBooks.length}</span> of {books.length} entries
        </p>
      </div>

      {/* Books Grid with mockup border layouts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => {
          const theme = getCategoryTheme(book.category);
          return (
            <div
              key={book.id}
              className="bg-white border border-gray-200/80 rounded-2xl group hover:border-[#ff783e]/50 hover:shadow-xs transition-all flex relative overflow-hidden"
            >
              {/* Vertical Elegant Left Border Strip from Mockup Image */}
              <div className={`w-1.5 self-stretch ${theme.stripe} shrink-0`} />

              <div className="p-4 flex gap-4 w-full justify-between items-start">
                <div className="flex gap-4 min-w-0">
                  {/* Book Cover Container */}
                  <div className="w-16 h-22 bg-gray-50 border border-gray-200/60 rounded-lg flex-shrink-0 relative overflow-hidden flex items-center justify-center shadow-3xs">
                    {book.cover ? (
                      <img
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                        src={book.cover}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-gray-400">
                        <BookOpen className="w-6 h-6 text-gray-300" />
                        <span className="text-[7px] font-bold uppercase tracking-wider text-gray-400">Book</span>
                      </div>
                    )}
                  </div>

                  {/* Book Text Metrics */}
                  <div className="flex flex-col justify-between py-0.5 min-w-0">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors truncate pr-2">
                        {book.title}
                      </h4>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{book.author}</p>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`px-2 py-0.5 rounded-sm font-bold text-[8px] uppercase tracking-wider ${
                          book.status === 'Available'
                            ? 'bg-accent-available text-accent-available-text'
                            : book.status === 'Overdue'
                            ? 'bg-accent-overdue text-accent-overdue-text'
                            : 'bg-accent-issued text-accent-issued-text'
                        }`}
                      >
                        {book.status}
                      </span>
                      
                      <span className={`px-2 py-0.5 text-[8px] font-bold rounded-sm ${theme.bg} ${theme.text}`}>
                        {book.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Star Ratings showing on the right exactly like mockup screenshot */}
                <div className="flex flex-col items-end shrink-0 pl-1">
                  <div className="flex items-center gap-1 bg-[#fffaf6] border border-[#ffe0cc]/70 px-1.5 py-0.5 rounded text-primary text-[11px] font-bold">
                    <span className="text-[#faad14]">★</span>
                    <span>{book.rating ? book.rating.toFixed(1) : '4.5'}</span>
                  </div>
                  <span className="text-[8px] font-mono font-medium text-gray-400 mt-1 uppercase">
                    {book.location}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {filteredBooks.length === 0 && (
          <div className="col-span-full bg-white border border-gray-100 rounded-2xl p-16 text-center text-gray-500 space-y-2.5">
            <AlertCircle className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="font-bold text-gray-800">No books found in this filter</p>
            <p className="text-xs text-gray-400">Try adjusting your active category pills or search keyword.</p>
          </div>
        )}
      </div>

      {/* Primary FAB for Adding a Book */}
      <div className="fixed bottom-24 md:bottom-12 right-6 md:right-12 z-40">
        <button
          onClick={() => setIsAddOpen(true)}
          className="cursor-pointer w-14 h-14 bg-primary hover:bg-primary-hover text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-lg"
          title="Add New Book"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Add New Book Modal */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop slide click to exit */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddOpen(false)}
              className="absolute inset-0 bg-black"
            />
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-gray-200 rounded-xl max-w-md w-full relative z-10 shadow-2xl overflow-hidden"
            >
              <div className="p-6 bg-primary text-white flex justify-between items-center">
                <h3 className="font-bold text-lg">Add New Book</h3>
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="text-white/80 hover:text-white font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {formError && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs rounded-sm font-medium flex gap-2 items-center">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Book Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none"
                    placeholder="e.g. Clean Code"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Author <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none"
                    placeholder="e.g. Robert C. Martin"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      ISBN
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none font-mono"
                      placeholder="e.g. 978-0132350884"
                      value={isbn}
                      onChange={(e) => setIsbn(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Category
                    </label>
                    <select
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none bg-white"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="Design">Design</option>
                      <option value="Frames">Frames</option>
                      <option value="Big Data">Big Data</option>
                      <option value="AI">AI</option>
                      <option value="Scientific">Scientific</option>
                      <option value="Fiction">Fiction</option>
                      <option value="Action Story">Action Story</option>
                      <option value="Science">Science</option>
                      <option value="History">History</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Shelf Location
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none"
                      placeholder="e.g. F-104"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Book Cover URL
                    </label>
                    <input
                      type="url"
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none"
                      placeholder="e.g. https://domain.com/cover.jpg"
                      value={coverUrl}
                      onChange={(e) => setCoverUrl(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-2.5 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="cursor-pointer border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold px-4 py-2.5 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="cursor-pointer bg-primary hover:bg-primary-hover text-white text-xs font-bold px-5 py-2.5 rounded-lg flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    Save Book
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
