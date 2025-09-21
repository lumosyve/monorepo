/*
 * @Author: ZhengJie
 * @Date: 2025-02-14 00:51:39
 * @LastEditTime: 2025-03-12 16:05:43
 * @Description: service.files
 */
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto, UpdateFileStatusDto } from './dto/update-file.dto';
import { CommonQueryRepository, snowflakeID } from 'src/utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Files } from './entities/file.entity';
import { In, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
import { CacheService } from 'src/modules/cache/cache.service';
import { CatchErrors } from 'src/common/decorators/catch-error.decorator';
import { ResultData } from 'src/utils/result';
import * as moment from 'moment';
import { FolderService } from '../folder/folder.service';
import { DelActionByIdsDot, GetPageDto } from './dto/index.dto';
import {
  FormatDefaultPagination,
  FormatEmptyParams,
} from 'src/common/decorators/format-dto.decorator';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class FilesService {
  private readonly queryRepository: CommonQueryRepository;

  constructor(
    @InjectRepository(Files)
    private readonly filesRepository: Repository<Files>,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly cacheService: CacheService,
    @Inject(forwardRef(() => FolderService))
    private readonly folderService: FolderService,
  ) {
    this.queryRepository = new CommonQueryRepository(filesRepository);
  }

  /**
   * 新增
   */
  @CatchErrors()
  public async create(createFileDto: CreateFileDto, authorization: string) {
    // TODO 需要唯一并且排除已删除状态的数据
    // const auUserId = await this.authService.validToken(authorization);
    // const currentUser = await this.cacheService.get(`user_${auUserId}`);

    // 检查是否有该文件夹
    const { data: folderData } = await this.folderService.getInfo(
      createFileDto.folderId,
    );
    if (Object.keys(folderData).length === 0) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '文件夹不存在',
      );
    }
    const { data: userData } = await this.authService.getInfo(authorization);

    const newData = {
      ...createFileDto,
      fileId: snowflakeID.NextId() + '',
      createBy: userData.info.username || 'system',
      createDate: new Date(),
      updateBy: userData.info.username || 'system',
      updateDate: new Date(),
    };
    await this.filesRepository.save(newData);
    return ResultData.ok(
      {
        ...newData,
        createDate: moment(newData.createDate).format('YYYY-MM-DD HH:mm:ss'),
        updateDate: moment(newData.updateDate).format('YYYY-MM-DD HH:mm:ss'),
      },
      '操作成功',
    );
  }

  /**
   * 删除
   */
  @CatchErrors()
  public async remove(opt: DelActionByIdsDot, authorization: string) {
    const { ids, status } = opt;
    if (!ids || ids.length === 0) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '请检查ids',
      );
    }
    const { data: userData } = await this.authService.getInfo(authorization);

    await this.filesRepository
      .createQueryBuilder()
      .update(Files)
      .set({
        status: status || '1',
        updateDate: new Date(),
        updateBy: userData.info.username || 'system',
      })
      .whereInIds(ids)
      .execute();
    return ResultData.ok({}, '操作成功');
  }

  /**
   * 更新状态
   */
  @CatchErrors()
  public async updateStatus(
    updateFileStatusDto: UpdateFileStatusDto,
    authorization: string,
  ) {
    if (!updateFileStatusDto.ids || updateFileStatusDto.ids.length === 0) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '请检查Ids',
      );
    }
    const { data: userData } = await this.authService.getInfo(authorization);
    await this.filesRepository
      .createQueryBuilder()
      .update(Files)
      .set({
        status: updateFileStatusDto.status,
        updateDate: new Date(),
        updateBy: userData.info.username || 'system',
      })
      .whereInIds(updateFileStatusDto.ids)
      .execute();
    return ResultData.ok({}, '操作成功');
  }

  /**
   * 分页
   */
  @CatchErrors()
  @FormatDefaultPagination()
  @FormatEmptyParams()
  public async getPage(dto: GetPageDto): Promise<ResultData> {
    const where = {
      folderId: dto.folderId,
      fileType: dto.fileType,
      status: In(dto.status ? [dto.status] : ['0', '2']),
    };
    const result: [Files[], number] = await this.queryRepository.queryCount(
      {
        where,
        order: { updateDate: 'DESC' },
        skip: (dto.pageNo - 1) * dto.pageSize,
        take: dto.pageSize,
      },
      Files,
    );

    const { host, port } = this.configService.get('app');
    const { data: folderData } = await this.folderService.getList();

    return ResultData.ok({
      list: instanceToPlain(result[0]).map((item) => {
        const getFind = folderData.list.find(
          (folder) => item.folderId === folder.id,
        );
        item.folderName = getFind.folderName;
        item.filePath = `http://${host}:${port}${item.filePath}`;
        return item;
      }),
      total: result[1],
      pageNo: dto.pageNo,
      pageSize: dto.pageSize,
    });
  }

  /**
   * 列表
   */
  @CatchErrors()
  public async getList(params = {}): Promise<ResultData> {
    const result: [Files[], number] = await this.queryRepository.queryCount(
      {
        where: { status: In(['0', '2']), ...params },
      },
      Files,
    );
    return ResultData.ok({
      list: instanceToPlain(result[0]),
      total: result[1],
    });
  }

  /**
   * 详情
   */
  @CatchErrors()
  public async getInfo(fileId: string): Promise<ResultData> {
    if (!fileId) {
      return ResultData.ok({});
    }
    const result = await this.queryRepository.queryOne(
      { fileId: fileId },
      Files,
    );
    return ResultData.ok(result ? instanceToPlain(result) : {});
  }
}
