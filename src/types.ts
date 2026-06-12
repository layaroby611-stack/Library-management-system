/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  status: 'Available' | 'Issued' | 'Overdue';
  location: string;
  dueDate?: string;
  cover: string;
  category: string;
  rating?: number;
}

export interface Student {
  id: string;
  name: string;
  initials: string;
  department: string;
  booksIssued: number;
  status: 'Clear' | 'Overdue';
  nextDue?: string;
  email?: string;
  joinDate?: string;
}

export interface Transaction {
  id: string;
  bookId: string;
  bookTitle: string;
  studentId: string;
  studentName: string;
  status: 'Issued' | 'Returned' | 'Overdue';
  timestamp: string; // Printable relative time or date
  dueDate: string;
  returnedDate?: string;
  cover?: string;
}
