/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Book, Student, Transaction } from '../types';
import { Search, UserCheck, Check, Info, AlertTriangle, BookOpen, User, RefreshCw, Calendar, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CirculationProps {
  books: Book[];
  students: Student[];
  transactions: Transaction[];
  onIssueBook: (bookId: string, studentId: string) => void;
  onReturnBook: (bookId: string) => void;
}

export default function Circulation({
  books,
  students,
  transactions,
  onIssueBook,
  onReturnBook,
}: CirculationProps) {
  const [activeTab, setActiveTab] = useState<'issue' | 'return'>('issue');
  
  // Issue tab state management
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);

  const [bookSearch, setBookSearch] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showBookDropdown, setShowBookDropdown] = useState(false);

  const [issueError, setIssueError] = useState('');
  const [issueSuccess, setIssueSuccess] = useState('');

  // Return tab state management
  const [returnSearch, setReturnSearch] = useState('');

  // Filter students based on text query
  const autocompleteStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.id.includes(studentSearch)
  );

  // Filter available books based on text query for issuing
  const autocompleteBooks = books.filter(
    (b) =>
      (b.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
        b.isbn.includes(bookSearch)) &&
      b.status === 'Available'
  );

  // Handle issue book action
  const handleConfirmIssue = () => {
    if (!selectedStudent) {
      setIssueError('Please select a student first.');
      return;
    }
    if (!selectedBook) {
      setIssueError('Please select an available book to issue.');
      return;
    }
    if (selectedStudent.booksIssued >= 5) {
      setIssueError(`${selectedStudent.name} has reached the maximum allowance (5 books).`);
      return;
    }

    onIssueBook(selectedBook.id, selectedStudent.id);
    
    // Trigger Success Animation state
    setIssueSuccess(`"${selectedBook.title}" successfully issued to ${selectedStudent.name}!`);
    setIssueError('');
    
    // Clear selections
    setSelectedStudent(null);
    setSelectedBook(null);
    setStudentSearch('');
    setBookSearch('');

    setTimeout(() => {
      setIssueSuccess('');
    }, 5000);
  };

  // Get active issues for returning
  const currentlyIssuedBooks = books.filter(
    (b) => b.status === 'Issued' || b.status === 'Overdue'
  );

  // Filter return candidates by search query (book title or student details)
  const filteredReturnBooks = currentlyIssuedBooks.filter((book) => {
    const relatedTx = transactions.find((t) => t.bookId === book.id && t.status !== 'Returned');
    const matchesBook = book.title.toLowerCase().includes(returnSearch.toLowerCase());
    const matchesStudent = relatedTx
      ? relatedTx.studentName.toLowerCase().includes(returnSearch.toLowerCase()) ||
        relatedTx.studentId.includes(returnSearch)
      : false;
    return matchesBook || matchesStudent;
  });

  // Calculate days left or overdue text
  const getDueBadgeSettings = (dueDateStr?: string) => {
    if (!dueDateStr) return { label: '7 DAYS LEFT', cls: 'bg-gray-100 text-gray-700' };
    const diff = new Date(dueDateStr).getTime() - new Date('2026-06-11').getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    if (days < 0) {
      return {
        label: `OVERDUE - ${Math.abs(days)} DAYS`,
        cls: 'bg-red-50 text-red-700 border border-red-100 font-bold',
      };
    } else {
      return {
        label: `${days} DAYS LEFT`,
        cls: 'bg-orange-50 text-primary border border-orange-100 font-semibold',
      };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Page Headline */}
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Circulation Management</h2>
        <p className="text-xs text-gray-500 mt-1">Process book checkouts and returns securely.</p>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => {
            setActiveTab('issue');
            setIssueError('');
            setIssueSuccess('');
          }}
          className={`cursor-pointer px-6 py-3 font-semibold text-sm transition-all focus:outline-none ${
            activeTab === 'issue'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-400 hover:text-gray-900 border-b-2 border-transparent'
          }`}
        >
          Issue Book
        </button>
        <button
          onClick={() => {
            setActiveTab('return');
            setReturnSearch('');
          }}
          className={`cursor-pointer px-6 py-3 font-semibold text-sm transition-all focus:outline-none ${
            activeTab === 'return'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-400 hover:text-gray-900 border-b-2 border-transparent'
          }`}
        >
          Return Book
        </button>
      </div>

      {/* TAB 1: ISSUE BOOK */}
      {activeTab === 'issue' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Action Form Column */}
          <div className="lg:col-span-7 space-y-6">
            <AnimatePresence>
              {issueSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-4 rounded-lg flex items-start gap-2.5 shadow-xs"
                >
                  <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div>
                    <span className="font-bold block">Transaction Completed</span>
                    <span className="mt-0.5 block">{issueSuccess}</span>
                  </div>
                </motion.div>
              )}

              {issueError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-red-50 border border-red-200 text-red-800 text-xs p-4 rounded-lg flex items-start gap-2.5 shadow-xs"
                >
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div>
                    <span className="font-bold block">Error Encountered</span>
                    <span className="mt-0.5 block">{issueError}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input 1: Student Auto-suggest Box */}
            <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-xs relative">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Select Library Student
              </label>
              
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                  <User className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  placeholder="Type student ID or full name..."
                  className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary/10 rounded-lg py-3 pl-11 pr-4 focus:outline-none focus:border-primary text-xs transition-all placeholder:text-gray-400 font-sans"
                  value={studentSearch}
                  onChange={(e) => {
                    setStudentSearch(e.target.value);
                    setShowStudentDropdown(true);
                  }}
                  onFocus={() => setShowStudentDropdown(true)}
                />

                {selectedStudent && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-md">
                    <Check className="w-3.5 h-3.5 text-primary" />
                    Student Locked: {selectedStudent.initials}
                  </div>
                )}
              </div>

              {/* Suggestions Dropdown */}
              {showStudentDropdown && studentSearch && (
                <div className="absolute left-5 right-5 mt-1.5 bg-white border border-gray-200 rounded-lg shadow-lg z-30 max-h-48 overflow-y-auto divide-y divide-gray-100">
                  {autocompleteStudents.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setSelectedStudent(s);
                        setStudentSearch(s.name);
                        setShowStudentDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-xs text-gray-700 flex justify-between items-center"
                    >
                      <div>
                        <span className="font-bold">{s.name}</span>
                        <span className="text-gray-400 ml-1.5">ID: {s.id}</span>
                      </div>
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-[9px] font-medium text-gray-500">
                        {s.department}
                      </span>
                    </button>
                  ))}
                  {autocompleteStudents.length === 0 && (
                    <div className="p-3 text-center text-xs text-gray-400">No students matched.</div>
                  )}
                </div>
              )}
            </div>

            {/* Input 2: Book Suggest Box */}
            <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-xs relative">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                SCAN/SEARCH BOOK
              </label>

              <div className="relative mb-3">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                  <BookOpen className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  placeholder="Scan barcode or type ISBN / Book Title..."
                  className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary/10 rounded-lg py-3 pl-11 pr-4 focus:outline-none focus:border-primary text-xs transition-all placeholder:text-gray-400 font-sans"
                  value={bookSearch}
                  onChange={(e) => {
                    setBookSearch(e.target.value);
                    setShowBookDropdown(true);
                  }}
                  onFocus={() => setShowBookDropdown(true)}
                />
              </div>

              {/* Suggestions Dropdown for Books */}
              {showBookDropdown && bookSearch && (
                <div className="absolute left-5 right-5 mt-1.5 bg-white border border-gray-200 rounded-lg shadow-lg z-30 max-h-48 overflow-y-auto divide-y divide-gray-100">
                  {autocompleteBooks.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        setSelectedBook(b);
                        setBookSearch(b.title);
                        setShowBookDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-xs text-gray-700 flex justify-between items-center"
                    >
                      <div>
                        <span className="font-bold">{b.title}</span>
                        <span className="text-gray-400 ml-1.5">by {b.author}</span>
                      </div>
                      <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[9px] font-bold">
                        Available
                      </span>
                    </button>
                  ))}
                  {autocompleteBooks.length === 0 && (
                    <div className="p-3 text-center text-xs text-gray-400">
                      No available books found matching search query.
                    </div>
                  )}
                </div>
              )}

              {/* Live Preview of Selected Match */}
              {selectedBook && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3.5 border border-gray-200 bg-gray-50/50 rounded-lg flex gap-3.5 items-center mt-3"
                >
                  <div className="w-10 h-14 bg-gray-200 border border-gray-300 rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {selectedBook.cover ? (
                      <img src={selectedBook.cover} alt={selectedBook.title} className="w-full h-full object-cover" />
                    ) : (
                      <BookOpen className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 leading-tight truncate">{selectedBook.title}</h4>
                    <p className="text-[10px] text-gray-500 mt-1 truncate">
                      {selectedBook.author} | ISBN: {selectedBook.isbn}
                    </p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-100 flex-shrink-0">
                    Available
                  </span>
                </motion.div>
              )}
            </div>

            {/* Confirm buttons */}
            <button
              onClick={handleConfirmIssue}
              className="cursor-pointer w-full bg-primary hover:bg-primary-hover active:scale-99 transition-all text-white font-bold text-xs py-4 rounded-xl flex items-center justify-center gap-2 shadow-xs"
            >
              <Check className="w-4 h-4" />
              Confirm Book Issue
            </button>
          </div>

          {/* Issue Policy Guidance Sidebar */}
          <div className="lg:col-span-5">
            <div className="bg-primary/5 border border-primary/10 p-6 rounded-xl flex flex-col justify-between h-full space-y-6">
              <div>
                <h3 className="text-sm font-bold text-primary mb-3">Issue Policy Instructions</h3>
                <ul className="space-y-3.5 text-xs text-gray-600">
                  <li className="flex gap-2 items-start">
                    <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    Standard student loan period is strictly set to <strong>14 calender days</strong>.
                  </li>
                  <li className="flex gap-2 items-start">
                    <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    Maximum of 5 checked-out library books can be active per student member.
                  </li>
                  <li className="flex gap-2 items-start">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    Librarians are required to verify ID badges match the borrower details before checkout approval.
                  </li>
                </ul>
              </div>

              <div className="pt-6 border-t border-gray-200/50">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Live Session Feed
                  </span>
                  <span className="text-[9px] font-bold text-primary uppercase tracking-wider">
                    Recent Activity
                  </span>
                </div>
                
                <div className="space-y-2.5">
                  {transactions.slice(0, 3).map((tx, idx) => (
                    <div key={idx} className="text-xs text-gray-600 flex justify-between items-center">
                      <span className="truncate max-w-[180px]">
                        <strong>{tx.status}:</strong> {tx.bookTitle}
                      </span>
                      <span className="text-gray-400 font-mono text-[10px]">{tx.timestamp}</span>
                    </div>
                  ))}
                  {transactions.length === 0 && (
                    <span className="text-xs text-gray-400 italic">No circulation logs recorded yet.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RETURN BOOK */}
      {activeTab === 'return' && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-xs">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search currently issued books by title, Student ID, or borrower..."
                className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary/10 rounded-lg py-3.5 pl-10 pr-4 focus:outline-none focus:border-primary text-xs transition-all placeholder:text-gray-400 font-sans"
                value={returnSearch}
                onChange={(e) => setReturnSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Candidate list for returns */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs divide-y divide-gray-100">
            {filteredReturnBooks.map((book) => {
              const relatedTx = transactions.find(
                (t) => t.bookId === book.id && t.status !== 'Returned'
              );
              const badgeSettings = getDueBadgeSettings(book.dueDate);

              return (
                <div
                  key={book.id}
                  className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex gap-4 items-center">
                    <div className="w-10 h-14 bg-gray-100 border border-gray-200 rounded flex items-center justify-center overflow-hidden flex-shrink-0 shadow-xs">
                      {book.cover ? (
                        <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                      ) : (
                        <BookOpen className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 leading-tight">{book.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Issued to: <span className="font-semibold text-primary">{relatedTx ? relatedTx.studentName : 'Unlisted Member'}</span> (ID: {relatedTx ? relatedTx.studentId : 'STU-N/A'})
                      </p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${badgeSettings.cls}`}>
                          {badgeSettings.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                    <div className="text-left md:text-right">
                      <p className="text-[10px] font-bold text-gray-400 tracking-wider">DUE DATE</p>
                      <p className="text-xs font-semibold text-gray-800 leading-normal mt-0.5">
                        {book.dueDate ? new Date(book.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onReturnBook(book.id)}
                      className="cursor-pointer bg-white border border-gray-300 hover:border-primary hover:text-white hover:bg-primary text-gray-700 font-bold text-xs px-5 py-2.5 rounded-lg active:scale-98 transition-all shadow-xs"
                    >
                      Return Book
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredReturnBooks.length === 0 && (
              <div className="p-12 text-center text-gray-400 text-xs flex flex-col items-center justify-center gap-1.5">
                <RefreshCw className="w-8 h-8 text-gray-300 animate-spin-slow mb-1" />
                <span className="font-bold text-gray-700">No active book loans matching criteria</span>
                <span>Select alternative filters or issue a new checkout to start tracking.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
