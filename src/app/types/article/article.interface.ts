import { Subheader } from './subheader.interface';
import { Paragraph } from './paragraph.interface';
import { Quote } from './quote.interface';
import { Epigraph } from './epigraph.interface';
import { Image } from './image.interface';
import { Video } from './video.interface';
import { Separator } from './separator.interface';
import { Attribution } from './attribution.interface';
import { ReferenceList } from './reference-list.interface';

export interface Article {
  caption?: string;
  title: string;
  content: (
    | Subheader
    | Paragraph
    | Quote
    | Epigraph
    | Image
    | Video
    | Separator
    | Attribution
    | ReferenceList
  )[];
}
