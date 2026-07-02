import { Book } from './book/book.interface';
import { Material } from './material/material.interface';

export interface ContentList {
  books: Book[];
  materials: Material[];
}