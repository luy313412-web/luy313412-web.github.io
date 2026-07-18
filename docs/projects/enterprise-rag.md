# Enterprise RAG Platform

## 1. Project Overview

Enterprise RAG Platform 是面向企业知识管理场景的大模型检索增强应用平台。

项目目标是将企业内部制度、流程文档、技术资料等私有知识与大语言模型结合，实现智能检索、知识问答和流程辅助。

主要解决：

-   企业知识分散；
-   关键词搜索无法理解语义；
-   通用模型缺少企业知识；
-   大模型存在幻觉风险。

------------------------------------------------------------------------

## 2. Business Background

企业内部通常存在大量：

-   制度文件；
-   业务流程；
-   技术文档；
-   FAQ知识。

传统搜索依赖关键词匹配，无法理解用户真实意图。

通过 RAG 架构，将企业知识库与 LLM 结合，实现基于私有知识的智能问答。

------------------------------------------------------------------------

## 3. System Architecture

``` mermaid
flowchart TB

User[User]
Frontend[Frontend]
API[FastAPI]

Parser[Document Parser]
Chunk[Chunk Strategy]
Embedding[BGE-M3]
VectorDB[(Milvus)]

Retriever[Hybrid Retrieval]
Reranker[BGE-Reranker]
LLM[LLM]

Evaluator[RAG Evaluation]

User --> Frontend
Frontend --> API
API --> Retriever

Retriever --> VectorDB
VectorDB --> Reranker
Reranker --> LLM

Parser --> Chunk
Chunk --> Embedding
Embedding --> VectorDB

LLM --> Evaluator
```

------------------------------------------------------------------------

## 4. Knowledge Ingestion Pipeline

知识入库流程：

    Document
     ↓
    Parsing
     ↓
    Cleaning
     ↓
    Chunking
     ↓
    Embedding
     ↓
    Vector Storage
     ↓
    Quality Check
     ↓
    Activation

核心设计：

### Document Parsing

支持：

-   PDF
-   Word
-   Markdown

### Chunk Strategy

根据业务特点设计：

-   父子切片；
-   语义切分；
-   保留上下文关系。

### Metadata

记录：

-   来源；
-   更新时间；
-   分类信息；
-   权限信息。

------------------------------------------------------------------------

## 5. Retrieval Architecture

采用 Hybrid Search：

    User Query

    ↓

    Query Processing

    ↓

    BM25 Search

    +

    Vector Search

    ↓

    Merge

    ↓

    Reranker

    ↓

    LLM

优势：

-   兼顾关键词匹配；
-   提升语义召回；
-   降低无关内容。

------------------------------------------------------------------------

## 6. Embedding and Reranking

Embedding 使用 BGE-M3。

作用：

-   文本语义表示；
-   多语言支持；
-   长文本处理。

Reranker 使用 BGE-Reranker。

流程：

    Top-K Retrieval

    ↓

    Cross Encoder Ranking

    ↓

    Top-N Context

    ↓

    LLM Generation

------------------------------------------------------------------------

## 7. Knowledge Quality Governance

企业 RAG 的核心不仅是检索，还包括知识治理。

包括：

-   OCR质量检测；
-   元数据完整性检查；
-   重复文档检测；
-   过期文档处理。

Bad Case优化流程：

    用户反馈

    ↓

    问题归档

    ↓

    原因分析

    ↓

    优化检索/Prompt

    ↓

    回归测试

------------------------------------------------------------------------

## 8. Context Management

针对长对话：

采用：

-   滑动窗口；
-   历史摘要；
-   关键信息提取。

减少无效 Token 消耗。

------------------------------------------------------------------------

## 9. Evaluation System

评估包括：

### Retrieval

-   Recall@K
-   MRR

### Generation

-   Faithfulness
-   Answer Relevance
-   Context Relevance

### Engineering

-   延迟；
-   Token成本；
-   成功率。

------------------------------------------------------------------------

## 10. Engineering Challenges

### 为什么不用普通搜索？

关键词搜索无法理解复杂语义。

RAG结合：

-   检索能力；
-   大模型生成能力；

提供智能知识交互。

### 如何降低幻觉？

通过：

-   知识检索；
-   Prompt约束；
-   结构化输出；
-   结果校验。

### 如何保证线上稳定？

通过：

-   日志监控；
-   Bad Case闭环；
-   评测集回归；
-   降级策略。

------------------------------------------------------------------------

## 11. Summary

Enterprise RAG Platform
不只是向量数据库查询，而是完整的大模型知识应用系统。

核心包括：

-   数据治理；
-   检索优化；
-   模型生成；
-   效果评估；
-   持续优化。

实现企业知识资产向智能应用能力转化。
