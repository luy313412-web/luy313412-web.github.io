# AI 应用后端工程实践

## 1. 后端在 AI 系统中的作用

AI 应用不仅包含模型调用，还需要完整的后端系统承载：

- 用户认证；
- 会话管理；
- 文件上传；
- 数据库事务；
- Agent 编排；
- 流式输出；
- 日志监控；
- 权限与安全；
- 异常降级；
- 部署运维。

一个可靠的 AI 系统通常是：

```text
前端
  ↓
API 网关
  ↓
业务服务
  ↓
Agent / RAG 链路
  ↓
模型、数据库、向量库和工具
```

---

## 2. FastAPI 分层架构

推荐按职责拆分：

```text
backend/
├── api/            路由与请求响应
├── services/       业务服务
├── agents/         Agent与Graph
├── rag/            检索链路
├── models/         ORM模型
├── schemas/        Pydantic模型
├── repositories/   数据访问
├── core/           配置、日志、异常、认证
└── main.py
```

### API 层

负责：

- 参数接收；
- 身份认证；
- 请求校验；
- 调用 Service；
- 返回统一响应。

不应在路由中堆积大量业务逻辑。

### Service 层

负责：

- 业务流程；
- 事务边界；
- Agent 或 RAG 调用；
- 结果组装。

### Repository 层

负责：

- 数据库查询；
- 持久化；
- 隔离 ORM 细节。

---

## 3. Pydantic 数据校验

Pydantic 用于：

- 请求体校验；
- 响应模型；
- 结构化输出；
- 配置管理。

示例：

```python
from pydantic import BaseModel, Field

class AskRequest(BaseModel):
    query: str = Field(min_length=1, max_length=2000)
    session_id: str
```

输入校验必须在进入模型前完成，避免无效请求消耗模型资源。

---

## 4. 依赖注入

FastAPI 的 `Depends` 可管理：

- 数据库会话；
- 当前用户；
- 权限校验；
- 配置；
- 服务实例。

数据库依赖示例：

```python
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
```

`yield` 之前负责准备资源，`yield` 之后负责清理、提交或回滚。

---

## 5. asyncio 与并发

异步适合 I/O 密集任务：

- 调用大模型 API；
- 查询数据库；
- 访问向量库；
- 调用外部工具；
- 文件和网络操作。

异步函数只有在遇到 `await` 等调度点时才会让出控制权。

CPU 密集任务会阻塞事件循环，应考虑：

- 线程池；
- 进程池；
- 独立任务队列；
- 单独推理服务。

并发调用示例：

```python
result_a, result_b = await asyncio.gather(
    call_retriever(),
    call_rule_engine(),
)
```

`asyncio.gather` 会并发执行并等待全部完成。

---

## 6. SQLAlchemy 异步会话

使用异步 SQLAlchemy 时，需要区分：

- Engine；
- Session Factory；
- AsyncSession；
- Transaction。

`AsyncSessionLocal()` 是会话工厂调用，返回一个 `AsyncSession` 实例。

事务原则：

- 正常完成后 commit；
- 异常时 rollback；
- 请求结束后关闭 session；
- 不跨请求共享 Session。

---

## 7. Redis

Redis 在 AI 应用中可用于：

- 查询缓存；
- 会话状态；
- 限流；
- 分布式锁；
- 临时任务状态；
- 热点数据；
- SSE 事件中转。

### 缓存穿透

查询不存在的数据反复访问数据库。

解决：

- 空值缓存；
- 布隆过滤器；
- 参数校验。

### 缓存击穿

热点 Key 过期时大量请求同时访问数据库。

解决：

- 互斥锁；
- 逻辑过期；
- 异步重建。

### 缓存雪崩

大量 Key 同时过期或 Redis 故障。

解决：

- TTL 随机化；
- 多级缓存；
- 限流降级；
- Redis 高可用。

---

## 8. SSE 流式输出

大模型生成时间较长，SSE 可逐步返回：

- 当前节点；
- 检索状态；
- 工具调用结果；
- Token 流；
- 最终答案；
- 错误事件。

事件应包含明确类型：

```json
{
  "event": "node_status",
  "data": {
    "node": "retrieval",
    "status": "running"
  }
}
```

需要处理：

- 客户端断开；
- 心跳；
- 超时；
- 异常事件；
- 任务取消。

---

## 9. 统一异常体系

建议自定义异常基类：

```python
class AppError(Exception):
    def __init__(
        self,
        message: str,
        code: str,
        retryable: bool = False,
        details: dict | None = None,
    ):
        super().__init__(message)
        self.code = code
        self.retryable = retryable
        self.details = details or {}
```

异常可按类型划分：

- 参数错误；
- 权限错误；
- 模型调用错误；
- 检索错误；
- 工具调用错误；
- 数据库错误；
- 业务规则错误。

统一异常处理可以保证：

- HTTP 状态码一致；
- 日志字段统一；
- 是否重试明确；
- 前端错误提示可控。

---

## 10. 结构化日志

结构化日志应记录事件名和键值对：

```python
logger.info(
    "rag.request.completed",
    session_id=session_id,
    latency_ms=latency_ms,
    token_usage=token_usage,
)
```

常见字段：

- request_id；
- session_id；
- user_id；
- tenant_id；
- agent_type；
- model；
- prompt_version；
- latency；
- token_usage；
- error_code。

不要记录：

- 密码；
- Token；
- 完整隐私数据；
- 未脱敏文档内容。

---

## 11. 重试、超时和降级

所有外部依赖都可能失败。

需要设置：

- 连接超时；
- 读取超时；
- 最大重试次数；
- 指数退避；
- 熔断；
- 备用模型；
- 降级结果。

只有可恢复错误才重试，例如网络抖动和限流。

参数错误、权限错误和业务规则错误不应盲目重试。

---

## 12. 认证与权限

常见认证方式：

- JWT；
- OAuth2/OIDC；
- 企业 SSO；
- API Key。

权限不仅控制接口访问，还需要控制：

- 知识库；
- 文档；
- 工具；
- 模型；
- 敏感操作；
- 管理功能。

Agent 工具调用前也要进行权限校验，不能只依赖模型自行判断。

---

## 13. Docker 部署

Docker Compose 可管理：

- FastAPI；
- PostgreSQL/MySQL；
- Redis；
- Milvus；
- Neo4j；
- 模型服务；
- 前端。

容器间访问使用服务名：

```text
postgres:5432
redis:6379
milvus:19530
```

本机访问使用：

```text
localhost + 映射端口
```

生产环境还要考虑：

- 健康检查；
- 数据卷；
- 日志持久化；
- Secret 管理；
- 资源限制；
- 滚动更新。

---

## 14. 可观测性

需要监控：

- 请求量；
- 错误率；
- P95 延迟；
- 模型成功率；
- 工具调用成功率；
- Token 成本；
- 检索质量；
- 队列积压；
- 数据库连接池；
- Redis 命中率。

链路追踪应覆盖：

```text
API
  ↓
意图路由
  ↓
检索
  ↓
重排
  ↓
模型
  ↓
工具
  ↓
响应
```

---

## 15. 安全设计

输入侧：

- 长度限制；
- 文件类型检查；
- Prompt Injection 检测；
- 参数消毒；
- 租户隔离。

执行侧：

- 工具白名单；
- 最小权限；
- 敏感操作确认；
- 最大循环次数；
- 成本和速率限制。

输出侧：

- Schema 校验；
- 内容安全；
- 敏感信息脱敏；
- 引用校验；
- 审计日志。

---

## 16. 总结

AI 后端工程的核心是把不稳定、概率化的模型能力，放入稳定、可观测、可维护的工程系统中。

需要同时处理：

- 业务流程；
- 并发与事务；
- 数据持久化；
- 安全权限；
- 异常降级；
- 成本和监控。

模型调用只是链路中的一个环节，完整系统的可靠性来自后端工程设计。
