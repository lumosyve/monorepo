// 共享常量

export const API_BASE_URL = 'http://localhost:2901';

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  PAGE_SIZE: 10,
};

export const THEME = {
  PRIMARY_COLOR: '#1890ff',
  SUCCESS_COLOR: '#52c41a',
  WARNING_COLOR: '#faad14',
  ERROR_COLOR: '#f5222d',
};