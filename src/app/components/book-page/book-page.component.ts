import { Component, computed, Signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Book } from '../../types/book/book.interface';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-book-page',
  imports: [RouterLink],
  templateUrl: './book-page.component.html',
  styleUrl: './book-page.component.scss',
})
export class BookPageComponent {

  book: Signal<Book | null>;
  videoURL: Signal<Record<string, SafeResourceUrl>>;

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer) {
    this.book = toSignal(this.route.data.pipe(map(data => data['book'])));
    this.videoURL = computed(() => this.extractVideoURLs(this.book()))
  }

  extractVideoURLs(book: Book | null): Record<string, SafeResourceUrl> {
    if (!book?.relatedVideos) return {};
    return book.relatedVideos.reduce((acc, el) => {
      const id: string = el.url;
      acc[id] = this.sanitizer.bypassSecurityTrustResourceUrl(el.url);
      return acc;
    }, {} as Record<string, SafeResourceUrl>)
  }

}
