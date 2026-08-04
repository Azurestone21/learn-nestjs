# learn-nestjs

## 项目介绍

这是一个基于 NestJS 框架的项目，用于学习和实践 NestJS 开发。

## 安装依赖

```bash
$ pnpm install
```

## 运行项目

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## 运行测试

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## 实践内容

- [x] 控制器
- [x] 服务
- [x] 模块
- [x] 中间件
- [x] 异常过滤器
  - [x] http异常过滤器，统一响应体
- [x] 管道
  - [x] 验证请求参数
- [x] 守卫
  - [x] 角色守卫
- [x] 拦截器
  - [x] 响应拦截器，统一响应体

- [ ] 环境配置
- [ ] Swagger API 文档
- [ ] TypeORM 数据库
- [ ] 认证与授权
- [ ] CORS 跨域
- [ ] 文件上传与下载
- [ ] WebSocket 实时通信
- [ ] 缓存
- [ ] 部署

## 参考文档

[NestJS 中文文档](https://docs.nestjs.cn/introduction/)