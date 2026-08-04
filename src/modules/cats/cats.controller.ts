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
  UseGuards,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { CatsService } from './cats.service';
// import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CatEntity } from './entities/cat.entity';

@Controller('cats')
@ApiTags('猫咪')
@UseGuards(RolesGuard)
// @Roles(['admin']) // 调试角色守卫
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post('/create')
  @ApiOperation({ summary: '创建猫' })
  @ApiBody({ type: CreateCatDto })
  @ApiResponse({ status: 200, description: '创建成功', type: CatEntity })
  create(@Body() createCatDto: CreateCatDto): CatEntity {
    return this.catsService.create(createCatDto);
  }

  @Get('/get-all')
  @ApiOperation({ summary: '获取所有猫列表' })
  findAll(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ): CatEntity[] {
    return this.catsService.findAll(page, pageSize);
  }

  @Get('/detail/:id')
  @ApiOperation({ summary: '获取猫详情' })
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.catsService.findOne(id);
  }

  @Put('/update/:id')
  @ApiOperation({ summary: '更新猫' })
  update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateCatDto: UpdateCatDto,
  ) {
    return this.catsService.update(id, updateCatDto);
  }

  @Delete('/delete/:id')
  @ApiOperation({ summary: '删除猫' })
  remove(@Param('id', new ParseIntPipe()) id: number) {
    return this.catsService.remove(id);
  }

  @Get('/test')
  @ApiOperation({ summary: '测试接口' })
  test() {
    throw new ForbiddenException();
  }
}
