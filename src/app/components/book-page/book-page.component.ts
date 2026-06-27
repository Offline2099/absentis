import { Component, Signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Book } from '../../types/book.interface';

@Component({
  selector: 'app-book-page',
  imports: [RouterLink],
  templateUrl: './book-page.component.html',
  styleUrl: './book-page.component.scss',
})
export class BookPageComponent {

  book: Signal<Book | null>;

  constructor(private route: ActivatedRoute) {
    this.book = toSignal(this.route.data.pipe(map(data => data['book'])));
  }

}
