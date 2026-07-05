import { Component, Signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SafeResourceUrl } from '@angular/platform-browser';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Book } from '../../types/book/book.interface';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-book-page',
  imports: [RouterLink],
  templateUrl: './book-page.component.html',
  styleUrl: './book-page.component.scss',
})
export class BookPageComponent {

  book: Signal<Book | null>;
  videoURL: Signal<Record<string, SafeResourceUrl>>;

  constructor(private route: ActivatedRoute, private data: DataService) {
    this.book = toSignal(this.route.data.pipe(map(data => data['entity'])));
    this.videoURL = computed(() => this.extractVideoURLs(this.book()))
  }

  extractVideoURLs(book: Book | null): Record<string, SafeResourceUrl> {
    if (!book?.relatedVideos) return {};
    return this.data.safeVideoLinks(book.relatedVideos.map(video => video.url));
  }

}
