import { Component, computed, Signal } from '@angular/core';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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

  constructor(
    private route: ActivatedRoute,
    private data: DataFetchService,
    private sanitizer: DomSanitizer
  ) {
    const primaryId: string | undefined = 
      this.route.snapshot.data['book']?.id || this.route.snapshot.data['material']?.id;
    const secondaryId: string | undefined = 
      this.route.snapshot.data['chapter']?.id || this.route.snapshot.data['part']?.id;
    this.article = this.data.fetchArticle(primaryId, secondaryId);
    this.videoURL = computed<Record<string, SafeResourceUrl>>(() => 
      this.article() ? this.extractVideoURLs(this.article()!) : {}
    );
  }

  extractVideoURLs(article: Article): Record<string, SafeResourceUrl> {
    return article.content.reduce((acc, el) => {
      if (el.type !== ArticleElement.video) return acc;
      const id: string = el.url;
      acc[id] = this.sanitizer.bypassSecurityTrustResourceUrl(el.url);
      return acc;
    }, {} as Record<string, SafeResourceUrl>)
  }

}
