/*
 * @Author: ZhengJie
 * @Date: 2023-10-18 23:22:47
 * @Description: dto
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { QueryPageDto } from 'src/common/dto/common.dto';

export class GetPageDto extends QueryPageDto {
  @ApiProperty({ description: '角色编码', type: String, required: false })
  roleCode: string;

  @ApiProperty({ description: '角色名称', type: String, required: false })
  roleName: string;

  @ApiProperty({
    description: '系统内置（1是 0否）',
    type: String,
    required: false,
  })
  isSys: string;

  @ApiProperty({
    description: '用户类型（employee员工 member会员）',
    type: String,
    required: false,
  })
  userType: string;

  @ApiProperty({ description: '状态', type: String, required: false })
  // @IsString()
  status: string;
}

export class DelActionByIdsDot {
  @ApiProperty({ description: 'Ids', type: Array, required: true })
  @IsNotEmpty({ message: '请检查Ids' })
  @IsArray()
  ids: string[];

  @ApiProperty({
    description: '状态（0正常 1删除 2停用）',
    type: String,
    required: false,
  })
  @IsOptional()
  status: string;
}
