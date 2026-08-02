import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';

@Controller('cats')
export class CatsController {

  @Post('/create')
  create(@Body() createCatDto: CreateCatDto) {
    return `新增一只名为 ${createCatDto.name} 的猫咪`;
  }

  @Get('/get-all')
  findAll(@Query('page') page?: number, @Query('pageSize') pageSize?: number) {
    return `获取所有猫咪信息，当前页码为 ${page}，每页显示 ${pageSize} 条`;
  }

  @Get('/detail/:id')
  findOne(@Param('id') id: string) {
    return `获取ID为 ${id} 的猫咪信息`;
  }

  @Put('/update/:id')
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return `更新ID为 ${id} 的猫咪信息为：${JSON.stringify(updateCatDto)}`;
  }

  @Delete('/delete/:id')
  remove(@Param('id') id: string) {
    return `删除ID为 ${id} 的猫咪信息`;
  }
}
