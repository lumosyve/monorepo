/*
 * @Author: ZhengJie
 * @Date: 2025-02-14 01:24:05
 * @LastEditTime: 2025-02-17 03:36:26
 * @Description: service.folder
 */
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { CommonQueryRepository, snowflakeID } from 'src/utils';
import { InjectRepository } from '@nestjs/typeorm';
import { FileFolder } from './entities/folder.entity';
import { In, Like, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
import { CacheService } from 'src/modules/cache/cache.service';
import { CatchErrors } from 'src/common/decorators/catch-error.decorator';
import { ResultData } from 'src/utils/result';
import * as moment from 'moment';
import { instanceToPlain } from 'class-transformer';
import { DelActionByIdsDot } from './dto/index.dto';
import { FilesService } from '../files/files.service';

@Injectable()
export class FolderService {
  private readonly queryRepository: CommonQueryRepository;

  constructor(
    @InjectRepository(FileFolder)
    private readonly folderRepository: Repository<FileFolder>,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly cacheService: CacheService,
    @Inject(forwardRef(() => FilesService))
    private readonly filesService: FilesService,
  ) {
    this.queryRepository = new CommonQueryRepository(folderRepository);
  }

  /**
   * 新增
   */
  @CatchErrors()
  public async create(
    createFolderDto: CreateFolderDto,
    authorization: string,
  ): Promise<ResultData> {
    const where = {
      status: In(['0', '2']),
      folderName: createFolderDto.folderName,
      parentId: createFolderDto.parentId,
      // folderName:
      //   createFolderDto.folderName && Like(`%${createFolderDto.folderName}%`),
    };
    const [getFindList] = await this.queryRepository.queryCount(
      {
        where,
      },
      FileFolder,
    );

    // TODO 需要排除不同文件夹下同名的文件
    if (getFindList.some((item) => item.status === '0')) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        `已存在名称${createFolderDto.folderName}`,
      );
    }

    const { data: userData } = await this.authService.getInfo(authorization);

    const newData = {
      ...createFolderDto,
      status: createFolderDto.status || '0',
      id: snowflakeID.NextId() + '',
      createBy: userData.info.username || 'system',
      createDate: new Date(),
      updateBy: userData.info.username || 'system',
      updateDate: new Date(),
    };
    await this.folderRepository.save(newData);
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

    await this.folderRepository
      .createQueryBuilder()
      .update(FileFolder)
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
   * 更新
   */
  @CatchErrors()
  public async update(updateDictDto: UpdateFolderDto, authorization: string) {
    if (!updateDictDto.id) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '请检查id',
      );
    }
    const result = await this.queryRepository.queryOne(
      { id: updateDictDto.id },
      FileFolder,
    );
    if (!result) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        `未查询到${updateDictDto.id}，请检查id`,
      );
    }

    const { data: userData } = await this.authService.getInfo(authorization);

    const newData = {
      ...updateDictDto,
      updateDate: new Date(),
      updateBy: userData.info.username || 'system',
    };
    await this.folderRepository.update(updateDictDto.id, {
      ...newData,
    });
    return ResultData.ok(newData, '操作成功');
  }

  /**
   * 列表
   */
  @CatchErrors()
  public async getList(): Promise<ResultData> {
    const result: [FileFolder[], number] =
      await this.queryRepository.queryCount(
        {
          where: { status: In(['0', '2']) },
        },
        FileFolder,
      );
    return ResultData.ok({
      list: instanceToPlain(result[0]),
      total: result[1],
    });
  }

  /**
   * 列表
   */
  @CatchErrors()
  public async getTreeData(): Promise<ResultData> {
    const result: [FileFolder[], number] =
      await this.queryRepository.queryCount(
        {
          where: { status: In(['0', '2']) },
        },
        FileFolder,
      );
    return ResultData.ok(instanceToPlain(result[0]));
  }

  /**
   * 详情
   */
  @CatchErrors()
  public async getInfo(folderId: string): Promise<ResultData> {
    if (!folderId) {
      return ResultData.ok({});
    }
    const result = await this.queryRepository.queryOne(
      { id: folderId },
      FileFolder,
    );
    return ResultData.ok(result ? instanceToPlain(result) : {});
  }

  /**
   * 获取文件夹下的文件
   */
  @CatchErrors()
  public async getFolderFiles(folderId: string): Promise<ResultData> {
    if (!folderId) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '请检查id',
      );
    }
    const { data: filesData } = await this.filesService.getList({
      folderId: folderId,
    });
    return ResultData.ok(filesData.list);
  }
}
