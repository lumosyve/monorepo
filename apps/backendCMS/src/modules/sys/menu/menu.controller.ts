/*
 * @Author: ZhengJie
 * @Date: 2023-10-17 22:57:06
 * @Description:controller.menu
 */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Headers,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActionByIdDot, ActionByNumberIdDot } from 'src/common/dto/common.dto';
import { GetPageDto } from './dto/index.dto';

@ApiTags('⭕️菜单管理')
@Controller('/sys/menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post('add')
  @ApiOperation({ summary: '新增' })
  add(@Body() createDto: CreateMenuDto, @Headers() headers: any) {
    return this.menuService.create(createDto, headers.authorization);
  }

  @Delete('delete')
  @ApiOperation({ summary: '删除' })
  remove(@Query() query: ActionByNumberIdDot) {
    return this.menuService.remove(query.id);
  }

  @Patch('update')
  @ApiOperation({ summary: '更新' })
  update(@Body() updateDto: UpdateMenuDto, @Headers() headers: any) {
    return this.menuService.update(updateDto, headers.authorization);
  }

  @Get('page')
  @ApiOperation({ summary: '分页' })
  getPage(@Query() page: GetPageDto) {
    return this.menuService.getPage(page);
  }

  @Get('list')
  @ApiOperation({ summary: '列表' })
  getList() {
    return this.menuService.getList();
  }

  @Get('info')
  @ApiOperation({ summary: '详情' })
  getInfo(@Query() query: ActionByNumberIdDot) {
    return this.menuService.getInfo(query.id);
  }

  @Get('tree')
  @ApiOperation({ summary: '获取树状结构' })
  getTree() {
    return this.menuService.getTree();
  }

  @Get('init')
  @ApiOperation({ summary: '初始化资源' })
  initMenuResource(@Headers() headers: Record<string, string>) {
    return this.menuService.initMenuRoute(headers.authorization);
  }
}
