/*
 * @Author: ZhengJie
 * @Date: 2023-08-14 17:07:08
 * @Description: 允许无token访问api
 */
import { SetMetadata } from '@nestjs/common';

export const ALLOW_ANON = 'allowAnon';
/**
 * 允许 接口 不校验 token
 */
export const AllowAnon = () => SetMetadata(ALLOW_ANON, true);
