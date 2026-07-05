import { Component, ElementRef, Signal, signal, viewChild} from '@angular/core';
import { NgClass } from '@angular/common';
import { Router, RouterLink, NavigationEnd, Route } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, take, tap, timer } from 'rxjs';
import * as BodyScrollLock from 'body-scroll-lock';
import { ContentList } from '../../types/content-list.interface';
import { Book } from '../../types/book/book.interface';
import { Material } from '../../types/material/material.interface';
import { BookChapter } from '../../types/book/book-chapter.interface';
import { MaterialPart } from '../../types/material/material-part.interface';
import { DataService } from '../../services/data.service';

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
  isActionInProgress = signal<boolean>(false);
  scrollTarget = viewChild.required<ElementRef>('scrollTarget');
  entity = signal<Book | Material | null>(null);
  article = signal<BookChapter | MaterialPart | null>(null);

  constructor(private router: Router, private data: DataService) {
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
    const currentUrl = url.substring(1);
    const route: Route | undefined = this.router.config.find(route => route.path === currentUrl);
    if (!route?.data) return;
    this.entity.set(route.data['entity'] || null);
    this.article.set(route.data['article'] || null);
  }

  togglePanel(): void {
    if (this.isActionInProgress()) return;
    this.isActionInProgress.set(true);
    this.isPanelOpen.update(value => !value);
    this.isPanelOpen() ? this.disableBodyScroll() : this.enableBodyScroll();
    timer(500).pipe(take(1)).subscribe(() => this.isActionInProgress.set(false));
  }

  disableBodyScroll(): void {
    BodyScrollLock.disableBodyScroll(
      this.scrollTarget().nativeElement,
      { reserveScrollBarGap: true }
    );
  }

  enableBodyScroll(): void {
    BodyScrollLock.enableBodyScroll(this.scrollTarget().nativeElement);
  }

  ngOnDestroy(): void {
    BodyScrollLock.clearAllBodyScrollLocks();
  }

}
