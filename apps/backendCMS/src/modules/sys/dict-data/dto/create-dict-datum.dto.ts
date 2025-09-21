/*
 * @Author: ZhengJie
 * @Date: 2023-09-17 23:34:13
 * @Description: dto.create
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
// import { formatValidationMessage } from 'src/utils/dto';

export class CreateDictDatumDto {
  // @IsString({
  //   message: ({ property }) => formatValidationMessage(property, 'string'),
  // })
  @ApiProperty({ description: '字典标签', type: 'string', required: true })
  @IsNotEmpty({ message: '请输入字典标签' })
  @IsString()
  dictLabel: string;

  @ApiProperty({ description: '字典键值', type: 'string', required: true })
  @IsNotEmpty({ message: '请输入字典键值' })
  @IsString()
  dictValue: string;

  @ApiProperty({ description: '字典图标', type: 'string' })
  @IsOptional()
  dictIcon: string;

  @ApiProperty({ description: '字典类型', type: 'string', required: true })
  @IsString()
  @IsNotEmpty({ message: '请输入字典类型' })
  dictType: string;

  @ApiProperty({ description: '字典排序', type: 'number' })
  @IsOptional()
  sort: number;

  @ApiProperty({
    description: '系统默认（0是 1否）',
    type: 'number',
    required: true,
  })
  @IsNotEmpty({ message: '请输入是否系统内置' })
  isSys: number;

  @ApiProperty({ description: 'css 类名', type: 'string' })
  @IsOptional()
  cssClass: string;

  @ApiProperty({ description: 'css 样式', type: 'string' })
  @IsOptional()
  cssStyle: string;

  @ApiProperty({ description: '状态（0正常 1删除 2停用）', type: 'string' })
  // @IsNotEmpty({ message: '请输入状态' })
  status: string;

  @ApiProperty({ description: '描述' })
  @IsOptional()
  description: string;

  @ApiProperty({ description: '备注', type: 'string' })
  @IsOptional()
  remarks: string;
}
