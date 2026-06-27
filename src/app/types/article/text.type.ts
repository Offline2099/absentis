import { InlineLink } from './inline-link.interface';
import { InlineReference } from './inline-reference.interface';

export type Text = (string | InlineLink | InlineReference)[];