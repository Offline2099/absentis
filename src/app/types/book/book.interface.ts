import { BookChapter } from './book-chapter.interface';
import { RelatedVideo } from './related-video.interface';
import { BookShopList } from './book-shop-list.interface';

export interface Book {
  id: string;
  author: string;
  title: string;
  year: number;
  isbn: string;
  description: string;
  googleBooksURL?: string;
  chapters: BookChapter[];
  relatedVideos?: RelatedVideo[];
  shops?: BookShopList;
}