import { Component, Signal } from '@angular/core';
import { DataFetchService } from '../../services/data-fetch.service';
import { ContentList } from '../../types/content-list.interface';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {

  contentList: Signal<ContentList | null>;

  constructor(private data: DataFetchService) {
    this.contentList = this.data.contentList;
  }

  

}
