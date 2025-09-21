/*
 * @Author: ZhengJie
 * @Date: 2023-11-14 00:56:59
 * @Description: 格式化校验信息
 */
export function formatValidationMessage(property: string, type: string) {
  let result = property;
  switch (type) {
    case 'string':
      result += ' 为字符串';
      break;
    case 'number':
      result += ' 为数字';
      break;
    case 'boolean':
      result += ' 为布尔类型';
      break;

    default:
      break;
  }
  return result;
}
