import { ArticleElement } from '../../constants/article-element.enum';
import { Text } from './text.type';

export interface Epigraph {
  type: ArticleElement.epigraph;
  content: Text[];
  author?: Text;
}