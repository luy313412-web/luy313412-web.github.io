# Industrial Equipment Diagnosis Agent

## 1. Project Overview

Industrial Equipment Diagnosis Agent
是面向工业设备运维场景设计的智能诊断与维修辅助系统。

项目目标是结合大语言模型、Agent
工作流和知识增强技术，将设备故障描述、设备知识文档、历史维修经验等信息进行融合，为现场人员提供故障分析、维修建议和知识查询支持。

系统重点解决传统工业运维过程中：

-   故障定位依赖专家经验；
-   设备知识分散，查询效率低；
-   历史维修经验难以复用；
-   诊断过程缺少标准化记录。

系统定位为维修辅助决策平台，通过 AI 提供信息整理、知识检索和分析建议。

------------------------------------------------------------------------

## 2. Business Background

工业设备运行过程中，故障诊断通常需要结合：

-   设备报警信息；
-   运行状态数据；
-   维护手册；
-   历史工单；
-   专家经验。

传统方式高度依赖人工经验，存在响应速度慢、知识沉淀不足、诊断过程不可复用等问题。

因此，引入 Agent
架构，将复杂任务拆分为可管理的智能流程，使系统能够根据用户需求选择不同处理路径，并结合知识库和工具完成辅助分析。

------------------------------------------------------------------------

## 3. System Architecture

系统采用前后端分离架构，通过 Agent
编排层连接业务流程、知识库和外部工具。

``` mermaid
flowchart TB

User[User]
FE[Frontend]
API[FastAPI]
Router[Intent Router]
Orchestrator[Agent Orchestrator]

Diagnosis[Diagnosis Graph]
Knowledge[Knowledge QA Graph]
Inspection[Inspection Graph]
Ticket[Ticket Analysis Graph]

VectorDB[(Milvus)]
Embedding[BGE-M3]
Reranker[BGE-Reranker]

Memory[(PostgreSQL)]
Tools[MCP Tools]

User --> FE
FE --> API
API --> Router
Router --> Orchestrator

Orchestrator --> Diagnosis
Orchestrator --> Knowledge
Orchestrator --> Inspection
Orchestrator --> Ticket

Knowledge --> VectorDB
VectorDB --> Embedding
VectorDB --> Reranker

Orchestrator --> Memory
Diagnosis --> Tools
```

------------------------------------------------------------------------

## 4. Agent Workflow Design

系统采用 Workflow + LLM Decision 的混合模式。

相比完全开放式 ReAct Agent，工业场景更加关注：

-   流程可控；
-   状态可追踪；
-   异常可恢复；
-   成本可管理。

因此采用：

    确定性流程控制
    +
    LLM语义理解
    +
    工具调用
    +
    状态管理

典型流程：

    用户请求
     ↓
    意图识别
     ↓
    任务路由
     ↓
    进入对应Graph
     ↓
    知识检索 / 工具调用
     ↓
    结果分析
     ↓
    生成辅助建议

------------------------------------------------------------------------

## 5. LangGraph Design

### State Management

Agent 执行过程通过统一 State 管理：

``` python
{
    "user_query": "",
    "device_info": {},
    "retrieved_context": [],
    "tool_result": {},
    "diagnosis_result": {},
    "next_action": ""
}
```

State 负责：

-   节点之间数据传递；
-   执行状态记录；
-   流程恢复。

### Checkpoint

通过 LangGraph Checkpoint 保存执行状态。

当出现：

-   模型调用失败；
-   工具异常；
-   网络异常；

可以基于已有状态恢复执行。

------------------------------------------------------------------------

## 6. Knowledge Enhanced Diagnosis

系统通过 RAG 增强领域知识能力。

流程：

    设备文档
     ↓
    文档解析
     ↓
    Chunk切分
     ↓
    BGE-M3 Embedding
     ↓
    Milvus向量存储
     ↓
    向量检索
     ↓
    BGE-Reranker重排
     ↓
    LLM生成结果

优势：

-   降低模型幻觉；
-   提升领域知识覆盖；
-   支持企业私有知识。

------------------------------------------------------------------------

## 7. Memory Management

系统区分短期记忆和长期业务信息。

### Short-term Memory

保存当前任务上下文：

-   用户问题；
-   检索结果；
-   Agent执行状态。

通过 LangGraph Checkpoint 实现。

### Long-term Memory

保存长期业务信息：

-   设备历史状态；
-   历史维修记录；
-   用户行为信息。

------------------------------------------------------------------------

## 8. Tool Calling and MCP

Agent通过工具扩展实际业务能力。

工具包括：

-   设备数据查询；
-   知识库检索；
-   外部信息搜索；
-   工单分析。

调用流程：

    用户问题
     ↓
    LLM判断能力需求
     ↓
    调用Tool
     ↓
    结果返回Agent
     ↓
    继续处理

------------------------------------------------------------------------

## 9. Reliability Design

### Structured Output

通过：

-   Pydantic Schema；
-   JSON结构约束；

保证输出格式稳定。

### Error Handling

针对：

-   LLM异常；
-   Tool异常；
-   数据异常；

进行统一异常捕获和降级处理。

### Cost Control

优化策略：

-   简单请求规则拦截；
-   Prompt模板复用；
-   上下文摘要压缩；
-   模型分级调用。

------------------------------------------------------------------------

## 10. Evaluation

评估体系包括：

### Retrieval Evaluation

-   Recall@K
-   MRR

### Generation Evaluation

-   回答准确性；
-   事实一致性；
-   人工评价。

### Engineering Metrics

-   响应时间；
-   Token消耗；
-   调用成功率。

------------------------------------------------------------------------

## 11. Engineering Challenges

### 为什么不用纯RAG？

RAG主要解决知识获取问题，而工业场景还需要：

-   任务规划；
-   工具调用；
-   流程控制。

因此需要 Agent 架构。

### 为什么不用完全自治Agent？

工业应用需要：

-   可解释；
-   可维护；
-   可控制。

因此采用 Graph Workflow + LLM Decision。

### 如何降低幻觉？

通过：

-   RAG知识增强；
-   结构化输出；
-   工具查询；
-   人工审核机制。

------------------------------------------------------------------------

## 12. Summary

Industrial Equipment Diagnosis Agent
的核心不是简单调用大模型，而是通过：

-   Agent流程编排；
-   知识增强；
-   工具扩展；
-   状态管理；
-   可靠性设计；

构建面向真实业务场景的大模型应用系统。
