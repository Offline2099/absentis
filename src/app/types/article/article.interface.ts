import { Epigraph } from './epigraph.interface';
import { Image } from './image.interface';
import { Paragraph } from './paragraph.interface';
import { Quote } from './quote.interface';
import { ReferenceList } from './reference-list.interface';
import { Separator } from './separator.interface';
import { Video } from './video.interface';

export interface Article {
  caption: string;
  title: string;
  content: (Paragraph | Quote | Epigraph | Image | Video | Separator | ReferenceList)[];
}