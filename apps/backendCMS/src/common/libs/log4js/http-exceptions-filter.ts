/*
 * @Author: ZhengJie
 * @Date: 2023-08-09 16:34:15
 * @Description: http异常拦截器
 */
import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';
import { Logger } from './log4js';

@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const logFormat = `
      ##############################################################################################################
      Request original url: ${request.originalUrl}
      Method: ${request.method}
      IP: ${request.ip}
      Status code: ${status}
      Response: ${
        exception.toString() +
        `（${
          (exceptionResponse &&
            (exceptionResponse.msg || exceptionResponse.message)) ||
          exception.message
        }）`
      }
      ##############################################################################################################
      `;
    if (status >= 500) {
      Logger.warning(logFormat);
    } else {
      Logger.fatal(logFormat);
    }
    response.status(status).json({
      code: status,
      msg:
        (exceptionResponse && exceptionResponse.msg) ||
        exceptionResponse.message ||
        exception.message,
      error: `${status >= 500 ? 'Service Error' : 'Client Error'}`,
      // error:
      //   (exceptionResponse && exceptionResponse.msg) ||
      //   exceptionResponse.message ||
      //   exception.message,
      // msg: `${status >= 500 ? 'Service Error' : 'Client Error'}`,
    });
  }
}
