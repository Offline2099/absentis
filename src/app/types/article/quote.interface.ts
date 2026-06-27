import { ArticleElement } from '../../constants/article-element.enum';
import { Text } from './text.type';

export interface Quote {
  type: ArticleElement.quote;
  content: Text[];
  author?: Text;
}