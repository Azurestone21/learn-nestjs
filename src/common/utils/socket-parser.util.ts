// common/utils/socket-parser.util.ts
import { Socket } from 'socket.io';

/**
 * Socket.IO 消息解析结果
 */
export interface ParseResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Socket.IO 消息解析工具类
 * 用于统一处理 Apifox、Postman 等工具发送的消息格式
 */
export class SocketMessageParser {
  /**
   * 解析消息数据，兼容字符串和对象两种格式
   *
   * @param data 原始数据
   * @returns 解析结果 { success, data, error }
   *
   * @example
   * // 对象格式
   * parse({ userId: '1', username: '小明' })
   * // => { success: true, data: { userId: '1', username: '小明' } }
   *
   * // 字符串格式
   * parse('{"userId":"1","username":"小明"}')
   * // => { success: true, data: { userId: '1', username: '小明' } }
   *
   * // 无效 JSON
   * parse('{invalid}')
   * // => { success: false, error: 'JSON 解析失败: ...' }
   */
  static parse<T = any>(data: any): ParseResult<T> {
    // 1. 检查数据是否为空
    if (data === null || data === undefined) {
      return {
        success: false,
        error: '数据不能为空',
      };
    }

    // 2. 如果已经是对象，直接返回
    if (typeof data === 'object' && !Array.isArray(data)) {
      return {
        success: true,
        data: data as T,
      };
    }

    // 3. 如果是字符串，尝试解析 JSON
    if (typeof data === 'string') {
      // 去除首尾空白
      const trimmed = data.trim();

      // 如果为空字符串
      if (trimmed === '') {
        return {
          success: false,
          error: '数据不能为空字符串',
        };
      }

      try {
        const parsed = JSON.parse(trimmed);
        return {
          success: true,
          data: parsed as T,
        };
      } catch (e) {
        return {
          success: false,
          error: `JSON 解析失败: ${(e as Error).message}`,
        };
      }
    }

    // 4. 不支持的数据类型
    return {
      success: false,
      error: `不支持的数据类型: ${typeof data}`,
    };
  }

  /**
   * 解析并验证必要字段
   *
   * @param data 原始数据
   * @param requiredFields 必要字段列表
   * @returns 解析结果 { success, data, error }
   *
   * @example
   * parseAndValidate({ userId: '1', username: '小明' }, ['userId', 'username'])
   * // => { success: true, data: { userId: '1', username: '小明' } }
   *
   * parseAndValidate({ userId: '1' }, ['userId', 'username'])
   * // => { success: false, error: '缺少必要字段: username' }
   */
  static parseAndValidate<T extends Record<string, any>>(
    data: any,
    requiredFields: (keyof T)[],
  ): ParseResult<T> {
    // 1. 先解析数据
    const parseResult = SocketMessageParser.parse<T>(data);
    if (!parseResult.success) {
      return parseResult;
    }

    const dataObj = parseResult.data as T;

    // 2. 检查必要字段
    const missingFields: string[] = [];
    for (const field of requiredFields) {
      const fieldName = String(field);
      const value = dataObj[fieldName];
      // 检查字段是否存在且不为空
      if (value === undefined || value === null || value === '') {
        missingFields.push(fieldName);
      }
    }

    if (missingFields.length > 0) {
      return {
        success: false,
        error: `缺少必要字段: ${missingFields.join(', ')}`,
      };
    }

    return {
      success: true,
      data: dataObj,
    };
  }

  /**
   * 发送错误消息给客户端
   *
   * @param client Socket 客户端
   * @param message 错误信息
   * @param code 错误码（可选）
   */
  static sendError(client: Socket, message: string, code?: string): void {
    client.emit('error', {
      success: false,
      code: code || 'PARSE_ERROR',
      message,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * 发送成功响应给客户端
   *
   * @param client Socket 客户端
   * @param event 事件名称
   * @param data 响应数据
   */
  static sendSuccess(client: Socket, event: string, data: any): void {
    client.emit(event, {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * 检查对象是否包含所有必要字段（不发送错误）
   *
   * @param obj 要检查的对象
   * @param requiredFields 必要字段列表
   * @returns 是否通过验证
   */
  static validateObject<T extends Record<string, any>>(
    obj: any,
    requiredFields: (keyof T)[],
  ): obj is T {
    if (!obj || typeof obj !== 'object') {
      return false;
    }

    for (const field of requiredFields) {
      const fieldName = String(field);
      const value = obj[fieldName];
      if (value === undefined || value === null || value === '') {
        return false;
      }
    }

    return true;
  }
}
