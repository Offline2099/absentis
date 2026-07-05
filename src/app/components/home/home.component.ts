import { Component, Signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { ContentList } from '../../types/content-list.interface';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {

  contentList: Signal<ContentList | null>;

  constructor(private data: DataService) {
    this.contentList = this.data.contentList;
  }

}
