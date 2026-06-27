import { BookChapter } from './book-chapter.interface';

export interface Book {
  id: string;
  author: string;
  title: string;
  year: number;
  isbn: string;
  description: string;
  chapters: BookChapter[];
}