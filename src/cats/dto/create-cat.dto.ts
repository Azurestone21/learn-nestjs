import { Cat } from '../interfaces/cat.interface';

export class CreateCatDto implements Omit<Cat, 'id'> {
  name!: string;
  age!: number;
  sex?: number;
}
