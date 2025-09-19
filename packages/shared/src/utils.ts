// 共享工具函数

/**
 * 格式化日期
 * @param date 日期对象或时间戳
 * @param format 格式化字符串，默认为 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date | number | string, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  const d = new Date(date);
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 创建标准API响应
 * @param success 是否成功
 * @param data 响应数据
 * @param error 错误信息
 * @returns 标准API响应对象
 */
export function createApiResponse<T>(success: boolean, data?: T, error?: string) {
  return {
    success,
    data,
    error,
    timestamp: new Date().toISOString()
  };
}

/**
 * 创建分页响应
 * @param items 当前页的项目
 * @param total 总项目数
 * @param page 当前页码
 * @param pageSize 每页大小
 * @returns 分页响应对象
 */
export function createPaginatedResponse<T>(items: T[], total: number, page: number, pageSize: number) {
  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  };
}