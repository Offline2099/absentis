import { ArticleElement } from '../../constants/article-element.enum';
import { Text } from './text/text.type';

export interface Attribution {
  type: ArticleElement.attribution;
  content: Text[];
}