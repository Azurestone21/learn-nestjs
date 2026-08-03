import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  // UseFilters,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';
// import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';

@Controller('cats')
// @UseFilters(HttpExceptionFilter)
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
  async findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.catsService.findOne(id);
  }

  @Put('/update/:id')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateCatDto: UpdateCatDto,
  ) {
    return this.catsService.update(id, updateCatDto);
  }

  @Delete('/delete/:id')
  async remove(@Param('id', new ParseIntPipe()) id: number) {
    return this.catsService.remove(id);
  }

  @Get('/test')
  async test() {
    throw new ForbiddenException();
  }
}
