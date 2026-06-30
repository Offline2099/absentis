import { Italic } from './italic.interface';
import { Bold } from './bold.interface';
import { InlineLink } from './inline-link.interface';
import { InlineReference } from './inline-reference.interface';

export type Text = (string | Italic | Bold | InlineLink | InlineReference)[];