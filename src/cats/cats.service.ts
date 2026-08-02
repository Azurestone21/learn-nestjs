import { Injectable } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Cat } from './interfaces/cat.interface';

@Injectable()
export class CatsService {
  private cats: Cat[] = [];

  create(cat: CreateCatDto) {
    this.cats.push({
      id: this.cats.length + 1,
      name: cat.name,
      age: cat.age,
      sex: cat.sex,
    });
    return `新增一只名为${cat.name}的猫咪，年龄${cat.age}，性别${cat.sex || '未知'}`;
  }

  findAll(page?: number, pageSize?: number): Cat[] {
    if (!page || !pageSize) {
      return this.cats || [];
    }
    return this.cats?.slice(page - 1 * pageSize, page * pageSize) || [];
  }

  findOne(id: number) {
    return `获取ID为 ${id} 的猫咪信息`;
  }

  update(id: number, cat: UpdateCatDto) { 
    const index = this.cats.findIndex(item => item.id === id);
    if (index === -1) {
      return `ID为 ${id} 的猫咪不存在`;
    }
    this.cats[index] = cat;
    return `更新ID为 ${id} 的猫咪信息为：${JSON.stringify(cat)}`;
  }

  remove(id: number) {
    const index = this.cats.findIndex(item => item.id === id);
    if (index === -1) {
      return `ID为 ${id} 的猫咪不存在`;
    }
    this.cats.splice(index, 1);
    return `删除ID为 ${id} 的猫咪信息`;
  }
}
