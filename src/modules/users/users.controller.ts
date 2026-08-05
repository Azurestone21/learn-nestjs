import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('用户模块')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  @ApiOperation({
    summary: '创建用户',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('/get-all')
  @ApiOperation({
    summary: '获取所有用户',
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/detail/:id')
  @ApiOperation({
    summary: '根据ID获取用户详情',
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch('/update/:id')
  @ApiOperation({
    summary: '根据用户ID更新用户信息',
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete('/delete/:id')
  @ApiOperation({
    summary: '根据用户ID删除用户',
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
