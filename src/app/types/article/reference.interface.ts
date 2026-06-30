import { Text } from './text/text.type';

export interface Reference {
  id: number | string;
  content: Text;
  text?: string;
}