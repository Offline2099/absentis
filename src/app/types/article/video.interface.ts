import { ArticleElement } from '../../constants/article-element.enum';
import { Text } from './text.type';

export interface Video {
  type: ArticleElement.video;
  url: string;
  caption: Text;
}