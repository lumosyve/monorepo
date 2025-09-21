<!--
 * @Author: ZhengJie
 * @Date: 2025-01-19 02:22:23
 * @LastEditTime: 2025-02-14 00:50:09
 * @Description: 记录
-->
# 项目笔记

## 功能（模块）列表

- [x] 注册
- [ ] 登录（需要区分平台登录？）
  - [ ] 小程序登录
  - [ ] H5登录
  - [x] 后台登录
  - [ ] App登录
- [ ] 登出（遗留问题：如何处理token续期和作废）
- [ ] token刷新（已计划）
- [x] 获取用户信息（账号信息）
- [ ] 获取用户信息（资源信息）
- [ ] 获取用户信息（角色信息）
- [x] 租户管理
- [x] 用户管理
- [x] 角色管理、角色资源管理
- [ ] 资源管理（菜单、按钮、模块）
- [x] 字典管理、字典数据管理
- [ ] 行政区划管理
- [ ] 消息管理（发布、查看）
- [ ] 日志管理（访问、错误、操作）
- [ ] 文件管理
- [ ] 自动作业（清理日志、无效图片、消息推送）
- [ ] 监控管理（暂不考虑）

## 业务模块

- [ ] 订单管理
- [ ] 商品管理
- [ ] 会员管理（复用用户管理？）
- [ ] 优惠券管理（发券、核销
- [ ] 统计管理（订单、商品、会员等）
- [ ] 应用管理
  - [ ] 门户网站
  - [ ] 小程序


## 问题记录

### 问题1：Module之间互相引用

模块导入中使用forwardRef

```typescript
// authModule
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [forwardRef(()=>UserModule)],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]

// userModule
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [forwardRef(()=> AuthModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})

```

### 问题2：Service之间也会存在互相引用

使用forwardRef()方法来创建延迟加载的服务引用

```typescript
// auth.service
import { Injectable, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {}
  // ...
}

// user.service
import { Injectable, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService
  ) {} 
  // ...
}
```

## 思考问题
### 1. 使用jwt，如何处理token续期和登出的时候token作废？
现在的处理方法，登录之后jwt生成token，返回客户端，客户端保存token，每次请求都带上token，服务端验证token，获取userId和userName，从redis中取是否有账号信息，如果没有，则视为“未登录”。如果token过去或无效，则返回401，客户端收到401，清除token，跳转到登录页。（中间层login.middleware处理内容：url白名单、是否有token、token是否有效、token是否过期、token是否正确）