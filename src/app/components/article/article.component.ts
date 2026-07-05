import { Component, Signal, signal, computed } from '@angular/core';
import { NgClass, NgTemplateOutlet, ViewportScroller } from '@angular/common';
import { ActivatedRoute, Data, Router, RouterLink } from '@angular/router';
import { SafeResourceUrl } from '@angular/platform-browser';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, take, timer } from 'rxjs';
import { ArticleElement } from '../../constants/article-element.enum';
import { InlineElement } from '../../constants/inline-element.enum';
import { ImagePosition } from '../../constants/image-position.enum';
import { Book } from '../../types/book/book.interface';
import { Material } from '../../types/material/material.interface';
import { BookChapter } from '../../types/book/book-chapter.interface';
import { MaterialPart } from '../../types/material/material-part.interface';
import { Article } from '../../types/article/article.interface';
import { DataService } from '../../services/data.service';

interface ArticleData {
  article: Signal<Article | null>;
  entityId: string | null;
  previousId: string | null;
  nextId: string | null;
}

interface AdjacentId {
  previous: string | null;
  next: string | null;
}

@Component({
  selector: 'app-article',
  host: {
    '[class.no-animation]': 'isSameEntity',
  },
  imports: [NgClass, NgTemplateOutlet, RouterLink],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss',
})
export class ArticleComponent {

  readonly ArticleElement = ArticleElement;
  readonly InlineElement = InlineElement;
  readonly ImagePosition = ImagePosition;

  isSameEntity: boolean;
  noTransitions = signal<boolean>(true);

  articleData: ArticleData | null = null;
  videoURL: Signal<Record<string, SafeResourceUrl>>;
  selectedReferenceId: Signal<number | string | null>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private scroller: ViewportScroller,
    private data: DataService
  ) {
    this.isSameEntity = this.isNavigationFromSameEntity();
    timer(200).pipe(take(1)).subscribe(() => this.noTransitions.set(false));
    this.scroller.setOffset([0, 60]);
    this.articleData = this.getArticleData(this.route.snapshot.data);
    this.videoURL = computed<Record<string, SafeResourceUrl>>(() => 
      this.extractVideoURLs(this.articleData?.article() || null)
    );
    this.selectedReferenceId = toSignal(
      this.route.fragment.pipe(map(fragment => this.fragmentToId(fragment))),
      { initialValue: null }
    );
  }

  isNavigationFromSameEntity(): boolean {
    const currentUrl: string[] = this.router.url.split('/');
    if (currentUrl.length < 2) return false;
    const currentEntityId: string = currentUrl[currentUrl.length - 2];
    const previousUrl: string[] | undefined = 
      this.router.currentNavigation()?.previousNavigation?.finalUrl?.toString().split('/');
    if (!previousUrl || previousUrl.length < 2) return false;
    const previousEntityId: string = previousUrl[previousUrl.length - 2];
    return currentEntityId === previousEntityId;
  }

  getArticleData(routeData: Data): ArticleData {
    const entity: Book | Material | undefined = routeData['entity'];
    const article: BookChapter | MaterialPart | undefined = routeData['article'];
    const adjacentId: AdjacentId | null = this.getAdjacentId(entity, article?.id);
    return {
      article: this.data.fetchArticle(entity?.id, article?.id),
      entityId: entity?.id || null,
      previousId: adjacentId?.previous || null,
      nextId: adjacentId?.next || null
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

  extractVideoURLs(article: Article | null): Record<string, SafeResourceUrl> {
    if (!article) return {};
    return this.data.safeVideoLinks(
      article.content
        .filter(element => element.type === ArticleElement.video)
        .map(element => element.url)
    );
  }

  fragmentToId(fragment: string | null): number | string | null {
    if (!fragment) return null;
    const id: string = fragment.replace('reference-', '').trim();
    return /^-?\d+$/.test(id) ? Number(id) : id;
  }

}
