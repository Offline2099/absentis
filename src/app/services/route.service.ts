import { Injectable } from '@angular/core';
import { Router, Route } from '@angular/router';
import { ContentList } from '../types/content-list.interface';
import { Book } from '../types/book/book.interface';
import { Material } from '../types/material/material.interface';
import { BookChapter } from '../types/book/book-chapter.interface';
import { MaterialPart } from '../types/material/material-part.interface';
import { BookPageComponent } from '../components/book-page/book-page.component';
import { MaterialPageComponent } from '../components/material-page/material-page.component';
import { ArticleComponent } from '../components/article/article.component';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  private areRoutesCreated: boolean = false;

  constructor(private router: Router) {}

  createRoutesFromContentList(list: ContentList): void {
    if (this.areRoutesCreated) return;
    this.router.resetConfig([
      ...this.router.config,
      ...list.books.map(book => this.bookRoutes(book)).flat(),
      ...list.materials.map((material) => this.materialRoutes(material)).flat(),
      { path: '**', redirectTo: '', pathMatch: 'full' }
    ]);
    this.areRoutesCreated = true;
  }

  private bookRoutes(book: Book): Route[] {
    return [
      {
        path: book.id,
        component: BookPageComponent,
        data: { entity: book }   
      },
      ...book.chapters.map(chapter => this.chapterRoute(book, chapter))
    ];
  }

  private chapterRoute(book: Book, chapter: BookChapter): Route {
    return {
      path: `${book.id}/${chapter.id}`,
      component: ArticleComponent,
      data: { entity: book, article: chapter }
    };
  }

  private materialRoutes(material: Material): Route[] {
    return [
      {
        path: material.id,
        component: MaterialPageComponent,
        data: { entity: material }
      },
      ...material.parts.map(part => this.partRoute(material, part))
    ];
  }

  private partRoute(material: Material, part: MaterialPart): Route {
    return {
      path: `${material.id}/${part.id}`,
      component: ArticleComponent,
      data: { entity: material, article: part }
    };
  }

}
