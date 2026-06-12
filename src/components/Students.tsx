/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Book, Student, Transaction } from '../types';
import { Search, UserPlus, SlidersHorizontal, ArrowUpDown, X, BookOpen, Clock, CheckCircle, Download, FileText, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StudentsProps {
  students: Student[];
  books: Book[];
  transactions: Transaction[];
  onAddStudent: (newStudent: Omit<Student, 'joinDate' | 'initials' | 'booksIssued' | 'status'>) => void;
  onNavigate: (tab: string) => void;
}

export default function Students({ students, books, transactions, onAddStudent, onNavigate }: StudentsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New Student input fields
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [department, setDepartment] = useState('Computing');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Initial Avatar Colors depending on Student initials/ID
  const getAvatarColor = (initials: string) => {
    switch (initials) {
      case 'JM': return 'bg-blue-100 text-blue-700';
      case 'MT': return 'bg-gray-100 text-gray-700';
      case 'ER': return 'bg-rose-100 text-rose-700';
      case 'SG': return 'bg-amber-100 text-amber-700';
      case 'AB': return 'bg-emerald-100 text-emerald-700';
      case 'LO': return 'bg-indigo-100 text-indigo-700';
      default: return 'bg-primary-light text-primary';
    }
  };

  // Submit new Student
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !id) {
      setErrorMsg('Name and Student ID are required.');
      return;
    }

    // Check if duplicate student ID exists
    if (students.some((s) => s.id === id)) {
      setErrorMsg('This Student ID is already registered.');
      return;
    }

    onAddStudent({ name, id, department, email });

    // Reset fields
    setName('');
    setId('');
    setDepartment('Computing');
    setEmail('');
    setErrorMsg('');
    setIsAddOpen(false);
  };

  // Filtering students
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.includes(searchTerm) ||
      s.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Find active issues for the selected student in drawer
  const getActiveIssuesForStudent = (studentId: string) => {
    return transactions.filter((t) => t.studentId === studentId && t.status !== 'Returned');
  };

  // Find historical returned transactions
  const getReturnedHistoryForStudent = (studentId: string) => {
    return transactions.filter((t) => t.studentId === studentId && t.status === 'Returned');
  };

  const baselineStudents = 2840;
  const baselineBorrowers = 1124;
  const baselineOverdues = 42;

  const currentOverdueStudents = students.filter((s) => s.status === 'Overdue').length;

  const totalEnrolledStat = baselineStudents + (students.length - 6);
  const activeBorrowersStat = baselineBorrowers + (students.filter((s) => s.booksIssued > 0).length - 5);
  const overdueNoticesStat = baselineOverdues + (currentOverdueStudents - 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Overview stats bento section matching student mockup */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 p-6 rounded-xl flex flex-col justify-between md:col-span-2 shadow-xs">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Registry Overview</span>
            <h2 className="text-2xl font-extrabold text-gray-900 mt-0.5">Student Records</h2>
          </div>
          
          <div className="mt-6 flex gap-6 overflow-x-auto pb-1">
            <div className="flex-shrink-0">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">TOTAL ENROLLED</p>
              <p className="text-xl font-extrabold text-primary min-w-[100px] mt-0.5">{totalEnrolledStat.toLocaleString()}</p>
            </div>
            
            <div className="border-l border-gray-200 h-9 my-auto"></div>
            
            <div className="flex-shrink-0">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">ACTIVE BORROWERS</p>
              <p className="text-xl font-extrabold text-primary min-w-[100px] mt-0.5">{activeBorrowersStat.toLocaleString()}</p>
            </div>
            
            <div className="border-l border-gray-200 h-9 my-auto"></div>
            
            <div className="flex-shrink-0">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">OVERDUE NOTICES</p>
              <p className="text-xl font-extrabold text-red-600 min-w-[90px] mt-0.5">{overdueNoticesStat}</p>
            </div>
          </div>
        </div>

        {/* Add Student interactive CTA Block */}
        <button
          onClick={() => setIsAddOpen(true)}
          className="cursor-pointer bg-primary hover:bg-primary-hover hover:scale-101 active:scale-99 transition-all text-white p-6 rounded-xl flex flex-col justify-center items-center text-center shadow-xs"
        >
          <UserPlus className="w-10 h-10 text-white mb-2" />
          <h4 className="text-md font-bold">Add Student</h4>
          <p className="text-xs text-blue-100 mt-1 opacity-85">Register a new library member</p>
        </button>
      </section>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:flex-grow">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            className="w-full bg-white border border-gray-200 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-xs text-gray-900 placeholder:text-gray-400 font-sans shadow-xs"
            placeholder="Search by student ID, name, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-1.5 bg-white border border-gray-200 px-4 py-3 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 hover:border-primary transition-all shadow-xs">
            <SlidersHorizontal className="w-4 h-4 text-gray-400" />
            Filter
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-1.5 bg-white border border-gray-200 px-4 py-3 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 hover:border-primary transition-all shadow-xs">
            <ArrowUpDown className="w-4 h-4 text-gray-400" />
            Sort
          </button>
        </div>
      </div>

      {/* Students Data Grid catalog */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            onClick={() => setActiveStudent(student)}
            className="group cursor-pointer bg-white border border-gray-200 p-5 rounded-xl hover:border-primary hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${getAvatarColor(student.initials)}`}>
                  {student.initials}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors">
                    {student.name}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">ID: {student.id}</p>
                </div>
              </div>
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                {student.department}
              </span>
            </div>

            <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
              <div>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">Books Issued</p>
                <p className="text-sm font-semibold text-gray-900 mt-1 leading-none">{student.booksIssued}</p>
              </div>
              <div className="text-right">
                <p className={`text-[9px] font-bold uppercase tracking-widest leading-none ${student.status === 'Overdue' ? 'text-red-500' : 'text-gray-400'}`}>
                  {student.status === 'Overdue' ? 'Overdue' : 'Next Due'}
                </p>
                <p className={`text-xs font-bold leading-none mt-1 ${student.status === 'Overdue' ? 'text-red-600' : 'text-primary'}`}>
                  {student.status === 'Overdue' ? '02 Days' : student.nextDue ? new Date(student.nextDue).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Clear'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Borrowing History Drawer Overlay representation */}
      <AnimatePresence>
        {activeStudent && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            {/* Drawer Backdrop slider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveStudent(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            />
            {/* Sliding Drawer component */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl overflow-y-auto flex flex-col justify-between"
            >
              {/* Drawer segment Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{activeStudent.name}</h3>
                  <p className="text-[10px] text-gray-400 font-mono">Student ID: {activeStudent.id}</p>
                </div>
                <button
                  onClick={() => setActiveStudent(null)}
                  className="p-2 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body details */}
              <div className="flex-1 p-6 space-y-6">
                {/* General enrolled meta cards */}
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">TOTAL BORROWED</p>
                      <p className="text-md font-bold text-gray-900 mt-1 leading-none">48 Books</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">MEMBER SINCE</p>
                      <p className="text-md font-bold text-gray-900 mt-1 leading-none">{activeStudent.joinDate || 'Aug 2022'}</p>
                    </div>
                  </div>
                </div>

                {/* Section 1: Current Activity */}
                <div>
                  <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Current Active Loans
                  </h4>
                  <div className="space-y-3">
                    {getActiveIssuesForStudent(activeStudent.id).map((issue) => (
                      <div
                        key={issue.id}
                        className="p-3 border border-gray-200 rounded-lg bg-white shadow-3xs flex justify-between items-center"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-900 leading-tight truncate">{issue.bookTitle}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5 leading-none font-mono">
                            Due date: {new Date(issue.dueDate).toLocaleDateString('en', { day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                        <span className="bg-blue-50 text-blue-700 text-[8px] font-bold px-2 py-0.5 rounded border border-blue-100 flex-shrink-0">
                          ACTIVE
                        </span>
                      </div>
                    ))}
                    {getActiveIssuesForStudent(activeStudent.id).length === 0 && (
                      <div className="text-center p-6 border border-dashed border-gray-200 text-gray-400 rounded-lg text-xs">
                        No active outstanding book loans.
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 2: Returned History logs */}
                <div>
                  <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Past Archive history
                  </h4>
                  <div className="divide-y divide-gray-100 border-t border-b border-gray-100">
                    {getReturnedHistoryForStudent(activeStudent.id).map((history) => (
                      <div key={history.id} className="py-2.5 flex justify-between items-center">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-700 leading-tight truncate">{history.bookTitle}</p>
                          <p className="text-[9px] text-gray-400 mt-0.5 leading-none">
                            Returned on: {history.returnedDate ? new Date(history.returnedDate).toLocaleDateString('en', { day: 'numeric', month: 'short' }) : 'Yesterday'}
                          </p>
                        </div>
                        <span className="text-gray-400 text-[8px] font-bold tracking-wider">ARCHIVED</span>
                      </div>
                    ))}
                    {getReturnedHistoryForStudent(activeStudent.id).length === 0 && (
                      <div className="text-center p-4 text-gray-400 text-xs">
                        No previous completed records.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Drawer footer buttons */}
              <div className="p-6 border-t border-gray-200 bg-gray-50 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setActiveStudent(null);
                    onNavigate('Transactions');
                  }}
                  className="cursor-pointer w-full bg-primary hover:bg-primary-hover text-white text-xs font-bold py-3 rounded-lg text-center"
                >
                  Issue New Book Checkout
                </button>
                <button
                  onClick={() => alert(`Creating account statement print preview for ${activeStudent.name}...`)}
                  className="cursor-pointer w-full border border-gray-200 bg-white hover:bg-gray-100 text-primary text-xs font-bold py-3 rounded-lg flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Generate Account Statement
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add New Student Dialog overlay */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddOpen(false)}
              className="absolute inset-0 bg-black"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-gray-200 rounded-xl max-w-sm w-full relative z-10 shadow-2xl overflow-hidden animate-fade-in"
            >
              <div className="p-5 bg-primary text-white flex justify-between items-center">
                <h3 className="font-bold">Add Library Student</h3>
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="text-white/80 hover:text-white font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-red-50 text-red-600 text-xs rounded-sm font-semibold flex gap-1.5 items-center">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Student Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    className="w-full border border-gray-200 p-2.5 text-xs rounded-lg outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Student ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2024-10255"
                    className="w-full border border-gray-200 p-2.5 text-xs rounded-lg outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary font-mono"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Department
                  </label>
                  <select
                    className="w-full border border-gray-200 p-2.5 text-xs rounded-lg outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary bg-white"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    <option value="Physics">Physics</option>
                    <option value="Literature">Literature</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Computing">Computing</option>
                    <option value="Arts">Arts</option>
                    <option value="History">History</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="student@university.edu"
                    className="w-full border border-gray-200 p-2.5 text-xs rounded-lg outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary font-sans"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
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
                    <UserPlus className="w-4 h-4" />
                    Register Student
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
