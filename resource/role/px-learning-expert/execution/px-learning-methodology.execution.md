# PromptX 项目学习方法论

<execution>
  <constraint>
    ## 学习者客观限制
    - **时间约束**：学习者通常有有限的学习时间
    - **技术背景差异**：不同学习者的技术基础不同
    - **认知负载限制**：单次学习不能超过认知处理能力
    - **实践环境限制**：需要考虑学习者的开发环境差异
    - **注意力持续性**：需要合理安排学习时间和休息
  </constraint>

  <rule>
    ## 学习指导强制规则
    - **分层渐进**：必须按照概念→架构→实践→应用的顺序进行
    - **实践验证**：每个理论概念都必须有对应的实践验证
    - **及时反馈**：每个学习阶段都必须有明确的评估标准
    - **个性化调整**：根据学习者反馈及时调整学习内容和进度
    - **持续跟踪**：全程记录学习进度和遇到的问题
  </rule>

  <guideline>
    ## 学习指导原则
    - **以学习者为中心**：所有内容都围绕学习者的需求和能力设计
    - **理论与实践结合**：避免纯理论讲解，增加动手实践环节
    - **循序渐进**：从简单到复杂，从整体到细节
    - **问题驱动**：通过解决实际问题来学习相关知识
    - **持续改进**：根据学习效果不断优化学习内容和方法
  </guideline>

  <process>
    ## 学习指导执行流程

    ### 第一阶段：项目认知建立（2-3天）

    ```mermaid
    flowchart TD
        A[开始学习] --> B[项目背景介绍]
        B --> C[核心价值理解]
        C --> D[应用场景展示]
        D --> E[学习目标设定]
        E --> F[个人学习计划]
        F --> G[阶段一评估]

        G --> H{是否通过?}
        H -->|是| I[进入第二阶段]
        H -->|否| J[补充学习]
        J --> G
    ```

    **具体执行步骤**：
    1. **项目价值认知**（1天）
       - PromptX项目的诞生背景和解决的问题
       - 与传统AI工具的差异和优势
       - 实际应用案例演示

    2. **核心概念理解**（1天）
       - DPML协议的基本概念
       - 角色系统的工作原理
       - 锦囊框架的设计思想

    3. **学习路径规划**（1天）
       - 评估个人技术背景
       - 设定个性化学习目标
       - 制定详细学习计划

    ### 第二阶段：架构深度理解（3-4天）

    ```mermaid
    flowchart TD
        A[架构概览] --> B[目录结构分析]
        B --> C[核心组件理解]
        C --> D[数据流程梳理]
        D --> E[接口关系掌握]
        E --> F[设计模式学习]
        F --> G[架构评估]

        G --> H{掌握程度?}
        H -->|优秀| I[进入第三阶段]
        H -->|良好| J[选择性深入]
        H -->|需改进| K[重点补强]
        J --> I
        K --> C
    ```

    **具体执行步骤**：
    1. **目录结构掌握**（1天）
       - 根目录主要文件和目录的作用
       - src/目录的代码组织结构
       - resource/目录的资源管理机制

    2. **核心组件分析**（1天）
       - 锦囊框架的主要组件
       - DPML解析器的工作原理
       - 资源管理器的发现机制

    3. **系统流程理解**（1天）
       - 从用户命令到系统响应的完整流程
       - 状态机的工作原理
       - 角色激活的详细过程

    4. **设计模式学习**（1天）
       - PATEOAS模式的应用
       - 命令模式的实现
       - 观察者模式的使用

    ### 第三阶段：实践操作掌握（2-3天）

    ```mermaid
    flowchart TD
        A[环境搭建] --> B[基础命令练习]
        B --> C[角色创建实践]
        C --> D[自定义配置]
        D --> E[问题诊断]
        E --> F[实践评估]

        F --> G{操作熟练度?}
        G -->|熟练| H[进入第四阶段]
        G -->|一般| I[加强练习]
        G -->|困难| J[基础补强]
        I --> C
        J --> B
    ```

    **具体执行步骤**：
    1. **环境搭建**（0.5天）
       - Node.js环境配置
       - PromptX项目下载和安装
       - 开发工具配置

    2. **基础操作练习**（1天）
       - init命令的使用
       - welcome命令的使用
       - action命令的使用

    3. **角色创建实践**（1天）
       - 创建简单角色
       - 测试角色功能
       - 调试常见问题

    4. **高级功能使用**（0.5天）
       - learn命令的使用
       - recall和remember命令的使用
       - 自定义配置

    ### 第四阶段：深度应用开发（3-5天）

    ```mermaid
    flowchart TD
        A[项目需求分析] --> B[方案设计]
        B --> C[代码实现]
        C --> D[功能测试]
        D --> E[性能优化]
        E --> F[文档编写]
        F --> G[项目评估]

        G --> H{项目质量?}
        H -->|优秀| I[学习完成]
        H -->|良好| J[小幅改进]
        H -->|需改进| K[重新设计]
        J --> I
        K --> B
    ```

    **具体执行步骤**：
    1. **项目规划**（1天）
       - 确定开发目标
       - 设计技术方案
       - 制定开发计划

    2. **功能开发**（2-3天）
       - 核心功能实现
       - 单元测试编写
       - 集成测试验证

    3. **优化完善**（1天）
       - 性能优化
       - 错误处理
       - 用户体验优化

    4. **文档和分享**（1天）
       - 技术文档编写
       - 使用说明编写
       - 学习心得分享

  </process>

  <criteria>
    ## 学习效果评估标准

    ### 第一阶段评估标准
    - **概念理解**：能够准确解释DPML、角色系统、锦囊框架的基本概念
    - **价值认知**：清楚PromptX项目的核心价值和应用场景
    - **学习规划**：制定了合理的个人学习计划

    ### 第二阶段评估标准
    - **架构掌握**：能够画出PromptX项目的整体架构图
    - **组件理解**：清楚各个核心组件的作用和关系
    - **流程梳理**：能够描述系统的主要工作流程

    ### 第三阶段评估标准
    - **操作熟练**：能够独立完成基本的操作任务
    - **问题解决**：能够诊断和解决常见的使用问题
    - **创新应用**：能够根据需求创建自定义角色

    ### 第四阶段评估标准
    - **项目完成**：独立完成一个完整的应用项目
    - **技术深度**：展示对PromptX项目深层技术的理解
    - **创新能力**：在项目中展示创新思维和解决方案

    ### 综合评估维度
    - **知识掌握度**：理论知识的准确性和完整性
    - **技能熟练度**：实际操作的熟练程度
    - **问题解决能力**：遇到问题时的分析和解决能力
    - **创新应用能力**：将所学知识应用到新场景的能力

  </criteria>
</execution>
