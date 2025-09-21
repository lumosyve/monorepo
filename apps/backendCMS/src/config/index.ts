/*
 * @Author: ZhengJie
 * @Date: 2023-08-07 15:56:05
 * @Description: x
 */
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const configFileNameObj = {
  development: 'dev',
  test: 'test',
  production: 'prod',
};

const env = process.env.NODE_ENV;

// 基本配置
const basic = yaml.load(
  readFileSync(join(__dirname, './basic.yml'), 'utf8'),
) as Record<string, any>;
// 环境配置
const envPath = yaml.load(
  readFileSync(join(__dirname, `./${configFileNameObj[env]}.yml`), 'utf8'),
) as Record<string, any>;

export default () => {
  return { ...basic, ...envPath };
};
