import { ApiProperty } from '@nestjs/swagger';

export class CatEntity {
  @ApiProperty({
    example: 1,
    description: 'ID',
  })
  id: number;

  @ApiProperty({
    example: 'Tom',
    description: '名称',
  })
  name: string;

  @ApiProperty({
    example: 3,
    description: '年龄',
  })
  age: number;

  @ApiProperty({
    enum: [1, 2],
    example: 1,
    description: '性别（1: 男, 2: 女）',
  })
  sex: number | null;
}
