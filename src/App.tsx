/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Book, Student, Transaction } from './types';
import { INITIAL_BOOKS, INITIAL_STUDENTS, INITIAL_TRANSACTIONS } from './data';
import Header from './components/Header';
import Overview from './components/Overview';
import Inventory from './components/Inventory';
import Circulation from './components/Circulation';
import Students from './components/Students';
import { LayoutDashboard, Library, ArrowLeftRight, Users, Sparkles, BookOpen } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('Dashboard');
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);

  // Initialize unified data nodes from localStorage or static data
  const [books, setBooks] = useState<Book[]>(() => {
    const data = localStorage.getItem('lib_admin_books');
    return data ? JSON.parse(data) : INITIAL_BOOKS;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const data = localStorage.getItem('lib_admin_students');
    return data ? JSON.parse(data) : INITIAL_STUDENTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const data = localStorage.getItem('lib_admin_transactions');
    return data ? JSON.parse(data) : INITIAL_TRANSACTIONS;
  });

  // Sync to localStorage when state updates
  useEffect(() => {
    localStorage.setItem('lib_admin_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('lib_admin_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('lib_admin_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Action: Issue Book
  const handleIssueBook = (bookId: string, studentId: string) => {
    // 1. Update book node
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 14 days standard lending loan
    const formattedDueDate = dueDate.toISOString().split('T')[0];

    const targetBook = books.find((b) => b.id === bookId);
    if (!targetBook) return;

    setBooks((prevBooks) =>
      prevBooks.map((b) =>
        b.id === bookId
          ? { ...b, status: 'Issued', dueDate: formattedDueDate }
          : b
      )
    );

    // 2. Update student Node
    const targetStudent = students.find((s) => s.id === studentId);
    if (!targetStudent) return;

    setStudents((prevStudents) =>
      prevStudents.map((s) =>
        s.id === studentId
          ? {
              ...s,
              booksIssued: s.booksIssued + 1,
              nextDue: formattedDueDate,
            }
          : s
      )
    );

    // 3. Insert transaction
    const newTx: Transaction = {
      id: `TX-${Math.floor(100+Math.random()*900)}`,
      bookId,
      bookTitle: targetBook.title,
      studentId,
      studentName: targetStudent.name,
      status: 'Issued',
      timestamp: 'Just now',
      dueDate: formattedDueDate,
      cover: targetBook.cover,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  // Action: Return Book
  const handleReturnBook = (bookId: string) => {
    const targetBook = books.find((b) => b.id === bookId);
    if (!targetBook) return;

    // 1. Update book node
    setBooks((prevBooks) =>
      prevBooks.map((b) =>
        b.id === bookId
          ? { ...b, status: 'Available', dueDate: undefined }
          : b
      )
    );

    // 2. Find open transaction matching active issue
    const activeTx = transactions.find((t) => t.bookId === bookId && t.status !== 'Returned');
    if (!activeTx) return;

    // 3. Update student outstanding count
    setStudents((prevStudents) =>
      prevStudents.map((s) =>
        s.id === activeTx.studentId
          ? {
              ...s,
              booksIssued: Math.max(0, s.booksIssued - 1),
              nextDue: s.booksIssued <= 1 ? undefined : s.nextDue,
            }
          : s
      )
    );

    // 4. Terminate transaction as returned
    setTransactions((prevTxs) =>
      prevTxs.map((t) =>
        t.id === activeTx.id
          ? {
              ...t,
              status: 'Returned',
              timestamp: 'Just now',
              returnedDate: new Date().toISOString().split('T')[0],
            }
          : t
      )
    );
  };

  // Action: Add Book
  const handleAddBook = (newBook: Omit<Book, 'id'>) => {
    const newId = `B-0${books.length + 1}`;
    const bookToAdd: Book = {
      id: newId,
      ...newBook,
    };
    setBooks((prev) => [bookToAdd, ...prev]);
  };

  // Action: Add Student
  const handleAddStudent = (newStu: Omit<Student, 'joinDate' | 'initials' | 'booksIssued' | 'status'>) => {
    const initials = newStu.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

    const studentToAdd: Student = {
      ...newStu,
      initials,
      booksIssued: 0,
      status: 'Clear',
      joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    };
    setStudents((prev) => [studentToAdd, ...prev]);
  };

  // Rendering active tabs with fallback checking
  const renderCurrentTab = () => {
    switch (currentTab) {
      case 'Dashboard':
        return (
          <Overview
            books={books}
            students={students}
            transactions={transactions}
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenAddBook={() => {
              setCurrentTab('Inventory');
              setIsAddBookModalOpen(true);
            }}
            onOpenAddStudent={() => {
              setCurrentTab('Students');
            }}
          />
        );
      case 'Inventory':
        return (
          <Inventory
            books={books}
            onAddBook={handleAddBook}
            isAddModalOpenInitially={isAddBookModalOpen}
          />
        );
      case 'Transactions':
        return (
          <Circulation
            books={books}
            students={students}
            transactions={transactions}
            onIssueBook={handleIssueBook}
            onReturnBook={handleReturnBook}
          />
        );
      case 'Students':
        return (
          <Students
            students={students}
            books={books}
            transactions={transactions}
            onAddStudent={handleAddStudent}
            onNavigate={(tab) => setCurrentTab(tab)}
          />
        );
      default:
        return <Overview books={books} students={students} transactions={transactions} onNavigate={setCurrentTab} onOpenAddBook={() => {}} onOpenAddStudent={() => {}} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] antialiased text-gray-800">
      {/* Top Application Bar */}
      <Header currentTab={currentTab} />

      <div className="flex-1 flex max-w-[1280px] w-full mx-auto relative">
        
        {/* Navigation Sidebar (Desktop Only) */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 p-4 sticky top-16 h-[calc(100vh-16px)] space-y-2 select-none">
          {[
            { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'Inventory', label: 'Inventory', icon: Library },
            { id: 'Transactions', label: 'Transactions', icon: ArrowLeftRight },
            { id: 'Students', label: 'Students', icon: Users },
          ].map((item) => {
            const IconComponent = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  if (item.id !== 'Inventory') setIsAddBookModalOpen(false);
                }}
                className={`cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-[#003f87]'
                }`}
              >
                <IconComponent className={`w-4 h-4 transition-transform group-hover:scale-105`} />
                {item.label}
              </button>
            );
          })}
          
          <div className="pt-8 mt-auto px-4 text-[10px] uppercase font-bold tracking-widest text-gray-300">
            System Operational
          </div>
        </aside>

        {/* Primary Page Content Canvas */}
        <main className="flex-1 px-4 py-8 md:px-8 pb-28 md:pb-8 min-w-0">
          <AnimatePresence mode="wait">
            {renderCurrentTab()}
          </AnimatePresence>
        </main>
      </div>

      {/* Floating Action Navigation Bottom Bar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-200 z-50 flex items-center justify-around shadow-lg select-none px-2">
        <button
          onClick={() => setCurrentTab('Dashboard')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            currentTab === 'Dashboard' ? 'text-primary scale-102 font-bold' : 'text-gray-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-widest mt-1 leading-none">Dashboard</span>
        </button>

        <button
          onClick={() => setCurrentTab('Inventory')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            currentTab === 'Inventory' ? 'text-primary scale-102 font-bold' : 'text-gray-400'
          }`}
        >
          <Library className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-widest mt-1 leading-none">Inventory</span>
        </button>

        <button
          onClick={() => setCurrentTab('Transactions')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            currentTab === 'Transactions' ? 'text-primary scale-102 font-bold' : 'text-gray-400'
          }`}
        >
          <ArrowLeftRight className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-widest mt-1 leading-none">Circulation</span>
        </button>

        <button
          onClick={() => setCurrentTab('Students')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            currentTab === 'Students' ? 'text-primary scale-102 font-bold' : 'text-gray-400'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-widest mt-1 leading-none">Students</span>
        </button>
      </nav>
    </div>
  );
}
