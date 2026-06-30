import { InlineElement } from '../../../constants/inline-element.enum';

export interface InlineLink {
  type: InlineElement.link;
  text: string;
  url: string;
}