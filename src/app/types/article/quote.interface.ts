import { ArticleElement } from '../../constants/article-element.enum';
import { Paragraph } from './paragraph.interface';
import { Text } from './text/text.type';

export interface Quote {
  type: ArticleElement.quote;
  content: Text[];
  complexContent?: (Paragraph | Quote)[];
  author?: Text;
}