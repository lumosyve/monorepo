/*
 * @Author: ZhengJie
 * @Date: 2023-07-28 09:46:44
 * @Description: middleware.log
 */
import { NextFunction, Request, Response } from 'express';
import { Logger } from 'src/common/libs/log4js/log4js';

export function LoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // 过滤swagger
  if (req.url.includes('/docs') || req.url.includes('/swagger-ui')) {
    next();
    return;
  }
  const statusCode = res.statusCode;
  const logFormat = `
      ##############################################################################################################
      RequestOriginal: ${req.originalUrl}
      Method: ${req.method}
      IP: ${req.ip}
      StatusCode: ${statusCode}
      ##############################################################################################################
      `;
  // Params: ${JSON.stringify(req.params || {})}
  // Query: ${JSON.stringify(req.query || {})}
  // Body: ${JSON.stringify(req.body || {})}
  next();

  if (statusCode >= 500) {
    Logger.error(logFormat);
  } else if (statusCode >= 400) {
    Logger.warn(logFormat);
  } else {
    Logger.access(logFormat);
    Logger.log(logFormat);
  }
}
