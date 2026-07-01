import { InlineElement } from '../../../constants/inline-element.enum';
import { Text } from './text.type';

export interface InlineLink {
  type: InlineElement.link;
  text: string;
  url: Text;
}