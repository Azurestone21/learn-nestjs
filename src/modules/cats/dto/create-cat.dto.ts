import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { Cat } from '../interfaces/cat.interface';

export class CreateCatDto implements Omit<Cat, 'id'> {
  @IsNotEmpty({ message: '名称不能为空' })
  @IsString({ message: '名称必须是字符串' })
  @MaxLength(10, { message: '名称最多10个字符' })
  name: string;

  @IsNotEmpty({ message: '年龄不能为空' })
  @IsNumber({}, { message: '年龄必须是数字' })
  age: number;

  @IsNumber({}, { message: '性别必须是数字' })
  sex: number;
}
