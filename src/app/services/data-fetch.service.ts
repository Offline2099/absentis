import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, catchError } from 'rxjs';
import { ContentList } from '../types/content-list.interface';
import { RouteService } from './route.service';

const CONTENT_LIST_URL: string = 'data/content-list.json';

@Injectable({
  providedIn: 'root'
})
export class DataFetchService {

  readonly contentList = signal<ContentList | null>(null);

  constructor(
    private http: HttpClient,
    private routeService: RouteService
  ) {}

  fetchContentList(): Observable<ContentList | null> {
    if (this.contentList() !== null) return of(this.contentList());
    return this.http.get<ContentList>(CONTENT_LIST_URL).pipe(
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
}
