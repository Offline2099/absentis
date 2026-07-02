import { MaterialPart } from './material-part.interface';

export interface Material {
  id: string;
  title: string;
  parts: MaterialPart[];
}