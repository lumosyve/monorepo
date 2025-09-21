/*
 * @Author: ZhengJie
 * @Date: 2023-08-07 15:13:08
 * @Description: auth.service
 */
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { LoginDto, WxLoginDto } from './dto/auth.dto';
import { ResultData } from 'src/utils/result';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateTokenDto } from 'src/common/dto/common.dto';
import { CacheService } from 'src/modules/cache/cache.service';
import { instanceToPlain } from 'class-transformer';

// import MenuJSON from './json/menu';
import { UserService } from '../user/user.service';
import { CorpService } from '../corp/corp.service';
import { CatchErrors } from 'src/common/decorators/catch-error.decorator';
import { wxHttpClient } from 'src/utils/http.service';
import { snowflakeID } from 'src/utils';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => CorpService))
    private readonly corpService: CorpService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
  ) {}

  /**
   * 生成token
   */
  public genToken(payload: {
    id: string;
    userName: string;
    corpName: string;
    corpCode: string;
  }): CreateTokenDto {
    const token = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('jwt.expiresIn'),
    });
    return { token: `Bearer ${token}` };
  }

  /**
   * 校验token
   */
  public validToken(
    token: string,
  ): Promise<{ status: number; data: any; msg?: string }> {
    return new Promise(async (resolve) => {
      try {
        const result = await this.jwtService.verifyAsync(
          token.replace('Bearer ', ''),
        );
        resolve({ status: 200, data: result });
      } catch (error) {
        if (error.message.includes('jwt expired')) {
          // token过期
          resolve({ status: 401, data: null, msg: '登录已失效，请重新登录' });
        } else if (error.message.includes('invalid signature')) {
          // token无效
          resolve({ status: 401, data: null, msg: '无效令牌，请重新登录' });
        } else {
          resolve({ status: 401, data: null, msg: '登录已失效，请重新登录' });
        }
      }
    });
  }

  /**
   * 登录
   */
  @CatchErrors()
  public async login(loginParams: LoginDto) {
    // 查找租户（企业）
    const { data: corpData } = await this.corpService.getInfo(
      loginParams.corpCode,
    );
    if (Object.keys(corpData || {}).length === 0) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        `租户${loginParams.corpCode}不存在`,
      );
    }
    // 查找用户，并同时返回密码
    const { data: userData } = await this.userService.getInfo(
      { loginCode: loginParams.loginCode },
      false,
    );

    if (Object.keys(userData || {}).length === 0 || userData.status === '1') {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        `用户${loginParams.loginCode}不存在`,
      );
    }
    if (userData.status === '2') {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        `用户${loginParams.loginCode}已被禁用，请联系管理员`,
      );
    }
    // 匹配密码
    if (userData.password !== loginParams.password) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '账号或密码错误',
      );
    }
    // 生成token
    const data = this.genToken({
      id: userData.id + '',
      userName: userData.userName,
      corpCode: userData.corpCode,
      corpName: userData.corpName,
    });
    // 写入redis，过期时间和jwt的过期时间同步
    await this.cacheService.set(
      `user_${userData.id}_${userData.userName}`,
      JSON.stringify(instanceToPlain(userData)),
      this.configService.get('jwt.expiresIn'),
    );
    return ResultData.ok({ ...data });
  }

  /**
   * 微信登录
   */
  @CatchErrors()
  public async wxLogin(loginParams: WxLoginDto) {
    let getWxAccessToken = await this.cacheService.get('wx_access_token');
    // 检查调用微信api的access_token是否存在
    if (!getWxAccessToken) {
      console.log('获取access_token');
      // 获取access_token
      const params = {
        grant_type: 'client_credential',
        appid: this.configService.get('miniApp.appId'),
        secret: this.configService.get('miniApp.appSecret'),
      };
      const wxAccessTokenRes: any = await wxHttpClient.get(
        '/cgi-bin/token',
        params,
      );
      if (wxAccessTokenRes.access_token) {
        getWxAccessToken = wxAccessTokenRes.access_token;
        await this.cacheService.set(
          'wx_access_token',
          wxAccessTokenRes.access_token,
          wxAccessTokenRes.expires_in,
        );
      }
    }
    console.log('getWxAccessToken', getWxAccessToken);
    // code解openId
    let userOpenId = '';
    if (loginParams.jsCode) {
      const wxUserOpenIdRes: any = await wxHttpClient.get(
        '/sns/jscode2session',
        {
          appid: this.configService.get('miniApp.appId'),
          secret: this.configService.get('miniApp.appSecret'),
          js_code: loginParams.jsCode,
          grant_type: 'authorization_code',
        },
      );
      if (wxUserOpenIdRes.openid) {
        userOpenId = wxUserOpenIdRes.openid;
      }
    }
    if (!userOpenId) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '微信jscode2session失败',
      );
    }
    // 遗留问题：需要300块认证才能解析手机号码，所以直接用openId
    const { data: getInfoRes } = await this.userService.getInfo({
      wxOpenid: userOpenId,
    });
    let userInfo = getInfoRes;
    if (Object.keys(userInfo || {}).length === 0) {
      // 创建用户
      const newUserId = snowflakeID.NextId() + '';
      const newUserData = {
        id: newUserId,
        createBy: 'system',
        createDate: new Date(),
        updateBy: 'system',
        updateDate: new Date(),
        // 默认一个密码
        password: '1234567890',
        status: '0',
        wxOpenid: userOpenId,
        loginCode: newUserId,
        userCode: newUserId,
        userName: '微信用户',
        mgrType: '0',
        userType: 'persion',
      };
      await this.userService.createByWx(newUserData);
      userInfo = newUserData;
    }
    // 生成token返回
    const data = this.genToken({
      id: userInfo.id + '',
      userName: userInfo.userName,
      corpCode: '',
      corpName: '',
    });
    // 写入redis，过期时间和jwt的过期时间同步
    await this.cacheService.set(
      `user_${userInfo.id}_${userInfo.userName}`,
      JSON.stringify(instanceToPlain(userInfo)),
      this.configService.get('jwt.expiresIn'),
    );
    return ResultData.ok({ ...data });
    // // 理解为自动登录流程，查询是否存在用户
    // if (!loginParams.phoneCode) {
    //   const { data } = await this.userService.getInfo({
    //     wxOpenid: userOpenId,
    //   });
    //   return ResultData.ok({ ...data });
    // } else {
    //   // 新用户，解析手机号
    //   const getWxUserPhone: any = await wxHttpClient.get(
    //     '/wxa/business/getuserphonenumber',
    //     {
    //       access_token: getWxAccessToken,
    //       code: loginParams.phoneCode,
    //       openid: userOpenId,
    //     },
    //   );
    //   const userPhoneNum = getWxUserPhone.phone_info.phoneNumber;
    //   // 创建用户
    //   const newUserData = {
    //     id: snowflakeID.NextId() + '',
    //     createBy: 'system',
    //     createDate: new Date(),
    //     updateBy: 'system',
    //     updateDate: new Date(),
    //     // 默认一个密码
    //     password: '1234567890',
    //     status: '0',
    //     wxOpenid: userOpenId,
    //     phone: userPhoneNum,
    //     loginCode: userPhoneNum,
    //     userCode: userPhoneNum,
    //     userName: userPhoneNum,
    //     mgrType: '0',
    //     userType: 'persion',
    //   };
    //   await this.userService.createByWx(newUserData);
    //   // 生成token返回
    //   // 生成token
    //   const data = this.genToken({
    //     id: newUserData.id + '',
    //     userName: newUserData.userName,
    //     corpCode: '',
    //     corpName: '',
    //   });
    //   // 写入redis，过期时间和jwt的过期时间同步
    //   await this.cacheService.set(
    //     `user_${newUserData.id}_${newUserData.userName}`,
    //     JSON.stringify(instanceToPlain(newUserData)),
    //     this.configService.get('jwt.expiresIn'),
    //   );
    //   return ResultData.ok({ ...data });
    // }
  }

  /**
   * 登出
   */
  public async logout(token: string) {
    if (token) {
      const { status, data, msg } = await this.validToken(token);
      if (status === 200) {
        await this.cacheService.del(`user_${data.id}_${data.userName}`);
      }
    }
    return ResultData.ok({});
  }

  /**
   * 获取当前登录用户信息
   */
  @CatchErrors('', true)
  public async getInfo(token: string) {
    const { status, data, msg } = await this.validToken(token);
    if (status === 401) {
      // return ResultData.fail(401, null, msg);
      throw new HttpException(msg, HttpStatus.UNAUTHORIZED);
    }
    let cacheData = await this.cacheService.get(
      `user_${data.id}_${data.userName}`,
    );
    // jwt验证已经登录，但是redis里没有了用户信息记录，则重新查询之后存起来
    if (!cacheData) {
      // 查找用户，并同时返回密码
      const { data: userData } = await this.userService.getInfo(
        { id: data.id },
        false,
      );
      if (userData && Object.keys(userData).length > 0) {
        cacheData = { ...userData };
        await this.cacheService.set(
          `user_${userData.id}_${userData.userName}`,
          JSON.stringify(userData),
          +this.configService.get('jwt.expiresIn'),
        );
      }
    } else {
      // redis中的都是json之后的
      cacheData = JSON.parse(cacheData);
    }
    return ResultData.ok({
      info: { ...cacheData, password: undefined },
      resources: [],
      permissions: [],
      roles: [],
    });
  }

  /**
   * 刷新token
   */
  @CatchErrors()
  public async refreshToken(token: string) {
    // const userData = await this.redisService.get(token);
    // if (!userData) {
    //   return ResultData.fail(401, 'token已失效');
    // }
    // const cacheData = JSON.parse(userData);
    // const newToken = this.jwtService.sign(
    //   JSON.stringify(cacheData),
    //   +this.configService.get('jwt.expiresIn'),
    // );
    // return ResultData.ok({
    //   token: newToken,
    // });
    return ResultData.ok({});
  }
}
