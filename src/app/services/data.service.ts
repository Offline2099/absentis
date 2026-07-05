import { Injectable, Signal, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, of, tap, catchError } from 'rxjs';
import { ContentList } from '../types/content-list.interface';
import { Article } from '../types/article/article.interface';
import { RouteService } from './route.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  readonly contentList = signal<ContentList | null>(null);
  readonly articles: Record<string, Record<string, Signal<Article>>> = {};

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private routeService: RouteService
  ) {}

  fetchContentList(): Observable<ContentList | null> {
    if (this.contentList() !== null) return of(this.contentList());
    return this.http.get<ContentList>('data/content-list.json').pipe(
      tap(json => {
        this.contentList.set(json);
        this.routeService.createRoutesFromContentList(json);
      }),
      catchError(error => {
        console.error('Error fetching dynamic routes: ', error);
        return of(null);
      })
    );
  }

  fetchArticle(entityId?: string, articleId?: string): Signal<Article | null> {
    if (!entityId || !articleId) return signal(null);
    if (this.articles[entityId] && this.articles[entityId][articleId]) 
      return this.articles[entityId][articleId];
    return toSignal(
      this.http.get<Article>(`data/${entityId}/${articleId}.json`).pipe(
        tap(json => {
          if (!this.articles[entityId]) this.articles[entityId] = {};
          this.articles[entityId][articleId] = signal(json);
        }),
        catchError(error => {
          console.error('Error fetching article content: ', error);
          return of(null);
        })
      ),
      { initialValue: null }
    );
  }

  safeVideoLinks(links: string[]): Record<string, SafeResourceUrl> {
    return links.reduce((acc, url) => {
      const noCookieUrl: string = url.replace('youtube', 'youtube-nocookie');
      acc[url] = this.sanitizer.bypassSecurityTrustResourceUrl(noCookieUrl);
      return acc;
    }, {} as Record<string, SafeResourceUrl>);
  }

}
