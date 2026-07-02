import { Component, Signal, signal} from '@angular/core';
import { NgClass } from '@angular/common';
import { Router, RouterLink, NavigationEnd, Route } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, tap } from 'rxjs';
import { ContentList } from '../../types/content-list.interface';
import { Book } from '../../types/book/book.interface';
import { Material } from '../../types/material/material.interface';
import { BookChapter } from '../../types/book/book-chapter.interface';
import { MaterialPart } from '../../types/material/material-part.interface';
import { DataFetchService } from '../../services/data-fetch.service';

@Component({
  selector: '[app-navigation]',
  imports: [RouterLink, NgClass],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent {

  contentList: Signal<ContentList | null>;
  isMainPage: Signal<boolean>;
  isPanelOpen = signal<boolean>(false);
  primary = signal<Book | Material | null>(null);
  secondary= signal<BookChapter | MaterialPart | null>(null);

  constructor(private router: Router, private data: DataFetchService) {
    this.contentList = this.data.contentList;
    this.isMainPage = toSignal(
      this.router.events.pipe(
        filter(e => e instanceof NavigationEnd),
        map(() => this.router.url === '/'),
        tap(() => {
          this.setPageParams(this.router.url);
          if (this.isPanelOpen()) this.togglePanel();
        })
      ),
      { initialValue: true }
    );
  }

  setPageParams(url: string): void {
    const currentURL = url.substring(1);
    const route: Route | undefined = this.router.config.find(route => route.path === currentURL);
    if (!route?.data) return;
    this.primary.set(route.data['book'] || route.data['material'] || null);
    this.secondary.set(route.data['chapter'] || route.data['part'] || null);
  }

  togglePanel(): void {
    this.isPanelOpen.update(value => !value);
  }

}
