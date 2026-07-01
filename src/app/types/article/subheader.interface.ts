import { ArticleElement } from '../../constants/article-element.enum';
import { Text } from './text/text.type';

export interface Subheader {
  type: ArticleElement.subheader;
  content: Text;
}