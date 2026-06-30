import { ArticleElement } from '../../constants/article-element.enum';
import { Text } from './text/text.type';

export interface Paragraph {
  type: ArticleElement.paragraph;
  content: Text;
}