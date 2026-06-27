import { Injectable, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, of, tap, catchError } from 'rxjs';
import { ContentList } from '../types/content-list.interface';
import { Article } from '../types/article/article.interface';
import { RouteService } from './route.service';

@Injectable({
  providedIn: 'root'
})
export class DataFetchService {

  readonly contentList = signal<ContentList | null>(null);
  readonly articles: Record<string, Record<string, Signal<Article>>> = {};

  constructor(
    private http: HttpClient,
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

  fetchArticle(primaryId?: string, secondaryId?: string): Signal<Article | null> {
    if (!primaryId || !secondaryId) return signal(null);
    if (this.articles[primaryId] && this.articles[primaryId][secondaryId]) 
      return this.articles[primaryId][secondaryId];
    return toSignal(
      this.http.get<Article>(`data/${primaryId}/${secondaryId}.json`).pipe(
        tap(json => {
          if (!this.articles[primaryId]) this.articles[primaryId] = {};
          this.articles[primaryId][secondaryId] = signal(json);
        }),
        catchError(error => {
          console.error('Error fetching article content: ', error);
          return of(null);
        })
      ),
      { initialValue: null }
    );
  }

}
