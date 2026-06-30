import { Component, computed, Signal } from '@angular/core';
import { NgClass, NgTemplateOutlet, ViewportScroller } from '@angular/common';
import { ActivatedRoute, Data, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ArticleElement } from '../../constants/article-element.enum';
import { InlineElement } from '../../constants/inline-element.enum';
import { ImagePosition } from '../../constants/image-position.enum';
import { Article } from '../../types/article/article.interface';
import { DataFetchService } from '../../services/data-fetch.service';

@Component({
  selector: 'app-article',
  imports: [NgClass, NgTemplateOutlet, RouterLink],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss',
})
export class ArticleComponent {

  readonly ArticleElement = ArticleElement;
  readonly InlineElement = InlineElement;
  readonly ImagePosition = ImagePosition;

  article: Signal<Article | null>;
  videoURL: Signal<Record<string, SafeResourceUrl>>;
  selectedReferenceId: Signal<number | string | null>;

  constructor(
    private route: ActivatedRoute,
    private data: DataFetchService,
    private sanitizer: DomSanitizer,
    private scroller: ViewportScroller
  ) {
    this.article = this.getArticle(this.route.snapshot.data);
    this.videoURL = computed<Record<string, SafeResourceUrl>>(() => 
      this.article() ? this.extractVideoURLs(this.article()!) : {}
    );
    this.selectedReferenceId = toSignal(
      this.route.fragment.pipe(map(fragment => this.fragmentToId(fragment))),
      { initialValue: null }
    );
    this.scroller.setOffset([0, 60]);
  }

  getArticle(routeData: Data): Signal<Article | null> {
    const primaryId: string | undefined = routeData['book']?.id || routeData['material']?.id;
    const secondaryId: string | undefined = routeData['chapter']?.id || routeData['part']?.id;
    return this.data.fetchArticle(primaryId, secondaryId);
  }

  extractVideoURLs(article: Article): Record<string, SafeResourceUrl> {
    return article.content.reduce((acc, el) => {
      if (el.type !== ArticleElement.video) return acc;
      const id: string = el.url;
      acc[id] = this.sanitizer.bypassSecurityTrustResourceUrl(el.url);
      return acc;
    }, {} as Record<string, SafeResourceUrl>)
  }

  fragmentToId(fragment: string | null): number | string | null {
    if (!fragment) return null;
    const id: string = fragment.replace('reference-', '').trim();
    return /^-?\d+$/.test(id) ? Number(id) : id;
  }

}
