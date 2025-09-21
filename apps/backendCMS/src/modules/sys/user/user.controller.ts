/*
 * @Author: ZhengJie
 * @Date: 2023-08-06 23:49:40
 * @Description: user.controller
 */
import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Query,
  Headers,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ActionByUserCodeDot,
  DelActionByIdsDot,
  GetPageDto,
} from './dto/user.dto';
import { ActionByIdDot } from 'src/common/dto/common.dto';

@Controller('/sys/user')
@ApiTags('用户管理')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post('register')
  // @ApiOperation({ summary: '注册' })
  // registerUser(@Body() createDto: CreateUserDto, @Headers() headers: any) {
  //   return this.userService.create(createDto, headers.authorization);
  // }

  @Post('add')
  @ApiOperation({ summary: '新增' })
  add(@Body() createDto: CreateUserDto, @Headers() headers: any) {
    return this.userService.create(createDto, headers.authorization);
  }

  @Delete('delete')
  @ApiOperation({ summary: '删除' })
  remove(@Body() query: DelActionByIdsDot, @Headers() headers: any) {
    return this.userService.remove(query, headers.authorization);
  }

  @Put('update')
  @ApiOperation({ summary: '更新' })
  update(@Body() updateUserDto: UpdateUserDto, @Headers() headers: any) {
    return this.userService.update(updateUserDto, headers.authorization);
  }

  @Put('rstPsd')
  @ApiOperation({ summary: '重置密码' })
  resetPassword(
    @Body() updateUserPsdDto: ActionByIdDot,
    @Headers() headers: any,
  ) {
    return this.userService.resetPassword(
      updateUserPsdDto,
      headers.authorization,
    );
  }

  @Get('page')
  @ApiOperation({ summary: '分页' })
  getPage(@Query() page: GetPageDto) {
    return this.userService.getUserPage(page);
  }

  @Get('list')
  @ApiOperation({ summary: '列表' })
  getList() {
    return this.userService.getUserList();
  }

  @Get('info')
  @ApiOperation({ summary: '详情' })
  getInfo(@Query() query: ActionByUserCodeDot) {
    return this.userService.getInfo(query);
  }

  @Get('onlines')
  @ApiOperation({ summary: '获取在线人数' })
  getOnlineUsers() {
    return this.userService.getOnlineUsers();
  }
}
