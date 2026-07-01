import { InlineElement } from '../../../constants/inline-element.enum';
import { Text } from './text.type';

export interface Bold {
  type: InlineElement.bold;
  text: Text;
}