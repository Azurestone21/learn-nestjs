import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { CatEntity } from './entities/cat.entity';

@Injectable()
export class CatsService {
  private cats: CatEntity[] = [];

  create(cat: CreateCatDto) {
    const id = this.cats.length + 1;
    const newCat: CatEntity = {
      id,
      name: cat.name,
      age: cat.age,
      sex: cat.sex || null,
    };
    this.cats.push(newCat);
    return newCat;
  }

  findAll(page?: number, pageSize?: number): CatEntity[] {
    if (!page || !pageSize) {
      return this.cats || [];
    }
    return this.cats?.slice(page - 1 * pageSize, page * pageSize) || [];
  }

  findOne(id: number) {
    const index = this.cats.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new InternalServerErrorException(`ID为 ${id} 的猫咪不存在`);
    }
    return this.cats[index];
  }

  update(id: number, cat: UpdateCatDto) {
    const index = this.cats.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new InternalServerErrorException(`ID为 ${id} 的猫咪不存在`);
    }
    this.cats[index] = {
      ...this.cats[index],
      ...cat,
    };
    return this.cats[index];
  }

  remove(id: number) {
    const index = this.cats.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new InternalServerErrorException(`ID为 ${id} 的猫咪不存在`);
    }
    this.cats.splice(index, 1);
    return true;
  }
}
