/*
 * @Author: ZhengJie
 * @Date: 2023-10-18 23:12:58
 * @Description: controller.role
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
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActionByIdDot } from 'src/common/dto/common.dto';
import { DelActionByIdsDot, GetPageDto } from './dto/index.dto';

@ApiTags('角色管理')
@Controller('/sys/role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('add')
  @ApiOperation({ summary: '新增' })
  add(@Body() createDto: CreateRoleDto, @Headers() headers: any) {
    return this.roleService.create(createDto, headers.authorization);
  }

  @Delete('delete')
  @ApiOperation({ summary: '删除' })
  remove(@Body() query: DelActionByIdsDot, @Headers() headers: any) {
    return this.roleService.remove(query, headers.authorization);
  }

  @Put('update')
  @ApiOperation({ summary: '更新' })
  update(@Body() updateDto: UpdateRoleDto, @Headers() headers: any) {
    return this.roleService.update(updateDto, headers.authorization);
  }
  @Put('permissions')
  @ApiOperation({ summary: '资源绑定' })
  bindMenus(@Body() updateDto: UpdateRoleDto, @Headers() headers: any) {
    return this.roleService.update(updateDto, headers.authorization);
  }

  @Get('page')
  @ApiOperation({ summary: '分页' })
  getPage(@Query() page: GetPageDto) {
    return this.roleService.getPage(page);
  }

  @Get('list')
  @ApiOperation({ summary: '列表' })
  getList() {
    return this.roleService.getList();
  }

  @Get('info')
  @ApiOperation({ summary: '详情' })
  getInfo(@Query() detailDto: ActionByIdDot) {
    return this.roleService.getInfo(detailDto.id);
  }
}
