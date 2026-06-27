import { ArticleElement } from '../../constants/article-element.enum';
import { ImagePosition } from '../../constants/image-position.enum';
import { Text } from './text.type';

export interface Image {
  type: ArticleElement.image;
  position: ImagePosition;
  url: string;
  alt: string;
  caption: Text;
}