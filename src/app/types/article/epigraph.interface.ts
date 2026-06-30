import { ArticleElement } from '../../constants/article-element.enum';
import { Text } from './text/text.type';

export interface Epigraph {
  type: ArticleElement.epigraph;
  content: Text[];
  author?: Text;
}