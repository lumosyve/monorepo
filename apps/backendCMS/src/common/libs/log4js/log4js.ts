import * as path from 'path';
import * as Log4js from 'log4js';
import * as Util from 'util';
import * as Moment from 'moment'; // 处理时间的工具
import * as StackTrace from 'stacktrace-js';
import Chalk from 'chalk';

const baseLogPath = path.resolve(__dirname, '../../../logs');

const log4jsConfig = {
  appenders: {
    console: { type: 'console' }, // 控制打印至控制台
    // 统计日志
    access: {
      type: 'dateFile', // 写入文件格式，并按照日期分类
      filename: `${baseLogPath}/access/access.log`, // 日志文件名，会命名为：access.2021-04-01.log
      alwaysIncludePattern: true, // 为true, 则每个文件都会按pattern命名，否则最新的文件不会按照pattern命名
      pattern: 'yyyy-MM-dd', // 日期格式
      // maxLogSize: 10485760,  // 日志大小
      daysToKeep: 30, // 文件保存日期30天
      numBackups: 3, //  配置日志文件最多存在个数
      compress: true, // 配置日志文件是否压缩
      category: 'http', // category 类型
      keepFileExt: true, // 是否保留文件后缀
    },
    // 一些app的 应用日志
    app: {
      type: 'dateFile',
      filename: `${baseLogPath}/app-out/app.log`,
      alwaysIncludePattern: true,
      layout: {
        type: 'pattern',
        pattern:
          "[%d{yyyy-MM-dd hh:mm:ss SSS}] [%p] -h: %h -pid: %z  msg: '%m' ",
      },
      pattern: 'yyyy-MM-dd',
      daysToKeep: 30,
      numBackups: 3,
      keepFileExt: true,
    },
    // 异常日志
    errorFile: {
      type: 'dateFile',
      filename: `${baseLogPath}/error/error.log`,
      alwaysIncludePattern: true,
      layout: {
        type: 'pattern',
        pattern:
          "[%d{yyyy-MM-dd hh:mm:ss SSS}] [%p] -h: %h -pid: %z  msg: '%m' ",
      },
      pattern: 'yyyy-MM-dd',
      daysToKeep: 30,
      numBackups: 3,
      keepFileExt: true,
    },
    errors: {
      type: 'logLevelFilter',
      level: 'ERROR',
      appender: 'errorFile',
    },
  },

  categories: {
    default: {
      appenders: ['console', 'access', 'app', 'errors'],
      level: 'DEBUG',
    },
    mysql: { appenders: ['access', 'errors'], level: 'info' },
    http: { appenders: ['access'], level: 'DEBUG' },
  },
  pm2: true, // 使用 pm2 来管理项目时，打开
  pm2InstanceVar: 'INSTANCE_ID', // 会根据 pm2 分配的 id 进行区分，以免各进程在写日志时造成冲突
};

// 定义日志级别
export enum LoggerLevel {
  ALL = 'ALL',
  MARK = 'MARK',
  TRACE = 'TRACE',
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL',
  OFF = 'OFF',
}

// 内容跟踪类
export class ContextTrace {
  constructor(
    public readonly context: string,
    public readonly path?: string,
    public readonly lineNumber?: number,
    public readonly columnNumber?: number,
  ) {}
}

Log4js.addLayout('Nest-Admin', (logConfig: any) => {
  return (logEvent: Log4js.LoggingEvent): string => {
    let moduleName = '';
    let position = '';

    // 日志组装
    const messageList: string[] = [];
    logEvent.data.forEach((value: any) => {
      if (value instanceof ContextTrace) {
        moduleName = value.context;
        // 显示触发日志的坐标（行，列）
        if (value.lineNumber && value.columnNumber) {
          position = `${value.lineNumber}, ${value.columnNumber}`;
        }
        return;
      }

      if (typeof value !== 'string') {
        value = Util.inspect(value, false, 3, true);
      }

      messageList.push(value);
    });

    // 日志组成部分
    const messageOutput: string = messageList.join(' ');
    const positionOutput: string = position ? ` [${position}]` : '';
    const typeOutput = `[${logConfig.type}] ${logEvent.pid.toString()}   - `;
    const dateOutput = `${Moment(logEvent.startTime).format(
      'YYYY-MM-DD HH:mm:ss',
    )}`;
    const moduleOutput: string = moduleName
      ? `[${moduleName}] `
      : '[LoggerService] ';
    let levelOutput = `[${logEvent.level}] ${messageOutput}`;

    // 根据日志级别，用不同颜色区分
    switch (logEvent.level.toString()) {
      case LoggerLevel.DEBUG:
        levelOutput = Chalk.green(levelOutput);
        break;
      case LoggerLevel.INFO:
        levelOutput = Chalk.cyan(levelOutput);
        break;
      case LoggerLevel.WARN:
        levelOutput = Chalk.yellow(levelOutput);
        break;
      case LoggerLevel.ERROR:
        levelOutput = Chalk.red(levelOutput);
        break;
      case LoggerLevel.FATAL:
        levelOutput = Chalk.hex('#DD4C35')(levelOutput);
        break;
      default:
        levelOutput = Chalk.grey(levelOutput);
        break;
    }

    return `${Chalk.green(typeOutput)}${dateOutput}  ${Chalk.yellow(
      moduleOutput,
    )}${levelOutput}${positionOutput}`;
  };
});

// 注入配置
Log4js.configure(log4jsConfig);

// 实例化
const logger = Log4js.getLogger();
// logger.level = LoggerLevel.TRACE;
logger.level = LoggerLevel.ALL;

// 定义log类方法
export class Logger {
  static trace(...args) {
    logger.trace(Logger.getStackTrace(), ...args);
  }

  static debug(...args) {
    logger.debug(Logger.getStackTrace(), ...args);
  }

  static log(...args) {
    logger.info(Logger.getStackTrace(), ...args);
  }

  static info(...args) {
    logger.info(Logger.getStackTrace(), ...args);
  }

  static warn(...args) {
    logger.warn(Logger.getStackTrace(), ...args);
  }

  static warning(...args) {
    logger.warn(Logger.getStackTrace(), ...args);
  }

  static error(...args) {
    logger.error(Logger.getStackTrace(), ...args);
  }

  static fatal(...args) {
    logger.fatal(Logger.getStackTrace(), ...args);
  }

  static access(...args) {
    const loggerCustom = Log4js.getLogger('http');
    loggerCustom.info(Logger.getStackTrace(), ...args);
  }

  // 日志追踪，可以追溯到哪个文件、第几行第几列
  // StackTrace 可参考 https://www.npmjs.com/package/stacktrace-js
  static getStackTrace(deep = 2): string {
    const stackList: StackTrace.StackFrame[] = StackTrace.getSync();
    const stackInfo: StackTrace.StackFrame = stackList[deep];
    const lineNumber: number = stackInfo.lineNumber;
    const columnNumber: number = stackInfo.columnNumber;
    const fileName: string = stackInfo.fileName;
    const basename: string = path.basename(fileName);
    return `${basename}(line: ${lineNumber}, column: ${columnNumber}): \n`;
  }
}
