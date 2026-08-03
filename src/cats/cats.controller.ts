import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post('/create')
  async create(@Body() createCatDto: CreateCatDto) {
    return this.catsService.create(createCatDto);
  }

  @Get('/get-all')
  async findAll(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ): Promise<Cat[]> {
    return this.catsService.findAll(page, pageSize);
  }

  @Get('/detail/:id')
  async findOne(@Param('id') id: string) {
    return this.catsService.findOne(Number(id));
  }

  @Put('/update/:id')
  async update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return this.catsService.update(Number(id), updateCatDto);
  }

  @Delete('/delete/:id')
  async remove(@Param('id') id: string) {
    return this.catsService.remove(Number(id));
  }

  @Get('/test')
  async test() {
    throw new ForbiddenException();
  }
}
