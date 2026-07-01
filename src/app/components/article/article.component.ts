import { Component, computed, signal, Signal } from '@angular/core';
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
import { Book } from '../../types/book.interface';
import { Material } from '../../types/material.interface';

interface ArticleData {
  article: Signal<Article | null>;
  entityId: Signal<string | null>;
  previousId: Signal<string | null>;
  nextId: Signal<string | null>;
}

interface AdjacentId {
  previous: string | null;
  next: string | null;
}

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

  articleData: ArticleData | null = null;
  videoURL: Signal<Record<string, SafeResourceUrl>>;
  selectedReferenceId: Signal<number | string | null>;

  constructor(
    private route: ActivatedRoute,
    private data: DataFetchService,
    private sanitizer: DomSanitizer,
    private scroller: ViewportScroller
  ) {
    this.articleData = this.getArticleData(this.route.snapshot.data);
    this.videoURL = computed<Record<string, SafeResourceUrl>>(() => 
      this.articleData?.article() ? this.extractVideoURLs(this.articleData.article()!) : {}
    );
    this.selectedReferenceId = toSignal(
      this.route.fragment.pipe(map(fragment => this.fragmentToId(fragment))),
      { initialValue: null }
    );
    this.scroller.setOffset([0, 60]);
  }

  getArticleData(routeData: Data): ArticleData {
    const entity: Book | Material | undefined = routeData['book'] || routeData['material'];
    const primaryId: string | undefined = entity?.id;
    const secondaryId: string | undefined = routeData['chapter']?.id || routeData['part']?.id;
    const adjacentId: AdjacentId | null = this.getAdjacentId(entity, secondaryId);
    return {
      article: this.data.fetchArticle(primaryId, secondaryId),
      entityId: signal(entity?.id || null),
      previousId: signal(adjacentId?.previous || null),
      nextId: signal(adjacentId?.next || null)
    };
  }

  getAdjacentId(entity?: Book | Material, currentId?: string): AdjacentId | null {
    if (!entity || !currentId) return null;
    const array = (entity as Book).chapters || (entity as Material).parts || null;
    return this.findAdjacentId(array || [], currentId);
  }

  findAdjacentId<T extends { id: string }>(array: T[], currentId: string): AdjacentId {
    const adjacentId: AdjacentId = { previous: null, next: null };
    const index: number = array.findIndex(element => element.id === currentId);
    if (index === -1) return adjacentId;
    adjacentId.previous = index > 0 ? array[index - 1].id : null;
    adjacentId.next = index < array.length - 1 ? array[index + 1].id : null;
    return adjacentId;
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
