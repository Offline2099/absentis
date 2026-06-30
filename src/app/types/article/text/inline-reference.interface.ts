import { InlineElement } from '../../../constants/inline-element.enum';

export interface InlineReference {
  type: InlineElement.reference;
  id: number | string;
  text?: string;
}