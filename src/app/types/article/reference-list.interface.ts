import { ArticleElement } from '../../constants/article-element.enum';
import { Reference } from './reference.interface';

export interface ReferenceList {
  type: ArticleElement.referenceList;
  content: Reference[];
}