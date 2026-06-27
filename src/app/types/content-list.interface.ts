import { Book } from './book.interface';
import { Material } from './material.interface';

export interface ContentList {
  books: Book[];
  materials: Material[];
}