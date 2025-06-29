# 智能模拟法庭系统角色指南

## 系统概述

`.promptx` 目录包含基于 PromptX 框架的智能模拟法庭系统，该系统由多个专业角色组成，每个角色都有独特的思维模式、执行模式和知识体系。系统采用 DPML（声明式提示词标记语言）协议，构建了三组件架构的 AI 角色。

## 角色介绍

### 🧑‍⚖️ 法官 (Judge)

**角色 ID**: `judge`

**核心职能**：庭审主持、争议调解、证据评估、法律适用和判决形成

**特色能力**：

- **三步判断法**：关联性测试、必要性评估和比例原则的司法决策框架
- **穿透式审判**：透过表象看本质，识别核心争议
- **司法中立性**：确保对各方当事人的公正对待

**主要思维模型**：

- 司法思维 (judicial-thinking)
- 穿透式判断 (penetrating-judgment)
- 逻辑分析 (logical-analysis)
- 三步判断法 (three-step-judgment)

**行为准则**：

- 庭审流程管理 (court-procedure)
- 证据分析 (evidence-analysis)
- 司法中立性 (judicial-neutrality)
- 三步判断法实践 (three-step-judgment-practice)

### 👨‍💼 律师 (Lawyer)

**角色 ID**: `lawyer`

**核心职能**：当事人代理、证据收集与质证、法律论证、权益保护

**特色能力**：

- **六维思考法**：从多角度分析法律问题
- **辩护策略**：构建有说服力的法律论证
- **证据链构建**：形成完整的证据体系

**主要思维模型**：

- 辩护思维 (advocacy-thinking)
- 六维思考 (six-dimensional-thinking)
- 逻辑分析 (logical-analysis)

**行为准则**：

- 客户代理 (client-representation)
- 法律论证 (legal-argumentation)
- 证据呈现 (evidence-presentation)

### 📝 书记员 (Clerk)

**角色 ID**: `clerk`

**核心职能**：庭审记录、文书整理、程序监督

**特色能力**：

- **客观记录**：准确无偏见地记录庭审过程
- **程序文档化**：规范化的法律文书处理
- **中立转录**：保持记录的中立性和完整性

**主要思维模型**：

- 客观观察 (objective-observation)
- 记录思维 (recording-mindset)

**行为准则**：

- 法庭记录 (court-recording)
- 中立转录 (neutral-transcription)
- 程序文档化 (procedural-documentation)

### 🧮 逻辑分析师 (Logician)

**角色 ID**: `logician`

**核心职能**：逻辑推理、论证分析、矛盾识别

**特色能力**：

- **逻辑分析**：识别和分析推理中的逻辑结构
- **论证评估**：评估论证的有效性和健全性
- **矛盾识别**：发现证词和论证中的逻辑矛盾

**主要思维模型**：

- 逻辑分析 (logical-analysis)

**行为准则**：

- 逻辑推理 (logical-reasoning)
- 论证评估 (argumentation-evaluation)

### 🧠 提示词工程师 (Prompt Engineer)

**角色 ID**: `prompt-engineer`

**核心职能**：优化 AI 提示词、角色设计、系统调优

**特色能力**：

- **提示词优化**：设计高效的 AI 交互提示词
- **角色构建**：创建和调整专业 AI 角色
- **系统优化**：提升模拟法庭系统的整体表现

**主要思维模型**：

- 提示词优化 (prompt-optimization)

**行为准则**：

- 提示词设计 (prompt-design)
- 角色构建 (role-construction)

### 💻 AI 技术专家 (AI Tech Expert)

**角色 ID**: `ai-tech-expert`

**核心职能**：AI 系统技术支持、功能开发、问题诊断

**特色能力**：

- **AI 技术思维**：理解和应用 AI 技术的核心原理
- **产品思维**：从产品视角优化 AI 系统
- **启发式对话**：引导有效的技术交流

**主要思维模型**：

- AI 技术思维 (ai-technology-thinking)
- 产品思维 (product-mindset)
- 苏格拉底对话 (socratic-dialogue)

**行为准则**：

- AI 专家服务 (ai-tech-expert)
- 启发式对话 (inspirational-dialogue)

## 最近更新

### 法官三步判断法

最近对法官角色进行了重要更新，添加了"三步判断法"作为核心行为准则：

1. **关联性测试**：评估信息与案件法律要件的关联性
2. **必要性评估**：判断信息对查明争议焦点的必要性
3. **比例原则**：平衡时间投入与价值产出的比例

这一方法论已通过思维模型、执行文件和宣誓形式全面整合到法官角色中，确保司法资源的最优配置。

## 系统架构

本系统基于 PromptX 框架的三组件架构设计：

```
角色 (Role)
├── 思维模式 (Thought)
│   └── 定义角色如何思考与分析
├── 执行模式 (Execution)
│   └── 定义角色的具体行为方式
└── 知识体系 (Knowledge)
    └── 角色所掌握的专业知识
```

## 使用方法

通过以下命令激活相应角色：

```
激活 judge         # 激活法官角色
激活 lawyer        # 激活律师角色
激活 clerk         # 激活书记员角色
激活 logician      # 激活逻辑分析师角色
激活 prompt-engineer # 激活提示词工程师角色
激活 ai-tech-expert # 激活AI技术专家角色
```

## 贡献与更新

系统持续优化中，可通过以下方式贡献：

1. 创建新的思维模型 (思维方式、分析框架)
2. 扩展执行模式 (具体行为、操作规范)
3. 增强知识库 (专业知识、法律理论)
4. 优化现有角色 (提高专业性、效率)
5. 创建新角色 (满足特定领域需求)
