<manual>
<identity>
## 工具名称
@tool://mermaid-chart-generator

## 简介
将Mermaid图表代码转换为高质量PNG/SVG图片的专业工具
</identity>

<purpose>
⚠️ **AI重要提醒**: 调用此工具前必须完整阅读本说明书，理解工具功能边界、参数要求和使用限制。禁止在不了解工具功能的情况下盲目调用。

## 核心问题定义
解决Mermaid图表代码无法直接在HTML页面中展示为图片的问题，提供从代码到图片的完整转换方案。

## 价值主张
- 🎯 **解决什么痛点**：Mermaid代码在静态HTML中无法渲染，需要转换为图片格式
- 🚀 **带来什么价值**：自动化图表生成，提升文档和网页的视觉效果
- 🌟 **独特优势**：支持多种输出格式，自动文件管理，高质量渲染

## 应用边界
- ✅ **适用场景**：
  - 为HTML页面生成图表图片
  - 创建文档中的流程图、架构图
  - 批量生成多个图表
  - 需要高质量图片输出的场景
- ❌ **不适用场景**：
  - 交互式图表需求
  - 实时动态图表
  - 超大型复杂图表（性能限制）
  - 需要编辑功能的图表
</purpose>

<usage>
## 使用时机
- 需要在静态HTML页面中展示Mermaid图表时
- 创建包含图表的文档或演示文稿时
- 需要将图表嵌入到不支持Mermaid.js的环境中时
- 批量处理多个图表时

## 操作步骤
1. **准备阶段**：
   - 准备有效的Mermaid图表代码
   - 确定输出格式（PNG或SVG）
   - 选择保存目录路径

2. **执行阶段**：
   - 调用工具并传入Mermaid代码
   - 工具自动渲染并生成图片
   - 获取生成的图片文件路径

3. **验证阶段**：
   - 检查生成的图片文件是否存在
   - 验证图片质量和内容正确性
   - 在目标环境中测试图片显示效果

## 最佳实践
- 🎯 **效率提升技巧**：
  - 使用简洁的图表代码，避免过度复杂
  - 批量处理时使用数组传入多个图表
  - 选择合适的输出格式（PNG适合展示，SVG适合缩放）

- ⚠️ **常见陷阱避免**：
  - 避免使用无效的Mermaid语法
  - 注意文件名冲突，使用唯一标识符
  - 不要生成过大的图片文件

- 🔧 **故障排除指南**：
  - 语法错误：检查Mermaid代码语法
  - 渲染失败：简化图表复杂度
  - 文件保存失败：检查目录权限

## 注意事项
- **性能考虑**：大型图表可能需要较长渲染时间
- **文件管理**：工具会自动创建必要的目录结构
- **格式兼容性**：确保目标环境支持生成的图片格式
- **安全性**：不要在Mermaid代码中包含敏感信息
</usage>

<parameter>
## 必需参数
| 参数名 | 类型 | 描述 | 示例 |
|--------|------|------|------|
| mermaidCode | string | 有效的Mermaid图表代码 | "graph TD\n A-->B" |

## 可选参数
| 参数名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| outputFormat | string | "png" | 输出格式：png 或 svg |
| outputDir | string | "./images" | 输出目录路径 |
| fileName | string | 自动生成 | 自定义文件名（不含扩展名） |
| width | number | 800 | 图片宽度（仅PNG格式） |
| height | number | 600 | 图片高度（仅PNG格式） |
| backgroundColor | string | "white" | 背景颜色 |
| theme | string | "default" | Mermaid主题：default, dark, forest, neutral |

## 参数约束
- **mermaidCode长度限制**：不超过50000字符
- **文件名规范**：只能包含字母、数字、下划线、连字符
- **尺寸限制**：宽度和高度范围 100-4000 像素
- **目录路径**：必须是相对路径或绝对路径

## 参数示例
```json
{
  "mermaidCode": "graph TD\n    A[开始] --> B[处理]\n    B --> C[结束]",
  "outputFormat": "png",
  "outputDir": "./images/charts",
  "fileName": "process-flow",
  "width": 1000,
  "height": 800,
  "backgroundColor": "white",
  "theme": "default"
}
```

## 批量处理示例
```json
{
  "charts": [
    {
      "mermaidCode": "graph TD\n A-->B",
      "fileName": "chart1"
    },
    {
      "mermaidCode": "sequenceDiagram\n A->>B: Hello",
      "fileName": "chart2"
    }
  ],
  "outputFormat": "png",
  "outputDir": "./images"
}
```
</parameter>

<outcome>
## 成功返回格式
```json
{
  "success": true,
  "data": {
    "filePath": "./images/charts/process-flow.png",
    "fileName": "process-flow.png",
    "fileSize": 15420,
    "dimensions": {
      "width": 1000,
      "height": 800
    },
    "format": "png",
    "generatedAt": "2024-01-01T12:00:00Z"
  }
}
```

## 批量处理成功返回
```json
{
  "success": true,
  "data": {
    "totalGenerated": 2,
    "results": [
      {
        "filePath": "./images/chart1.png",
        "fileName": "chart1.png",
        "status": "success"
      },
      {
        "filePath": "./images/chart2.png", 
        "fileName": "chart2.png",
        "status": "success"
      }
    ],
    "outputDir": "./images"
  }
}
```

## 错误处理格式
```json
{
  "success": false,
  "error": {
    "code": "MERMAID_SYNTAX_ERROR",
    "message": "Mermaid代码语法错误",
    "details": "第3行：无效的节点定义",
    "suggestion": "请检查Mermaid语法并修正错误"
  }
}
```

## 常见错误代码
- **MERMAID_SYNTAX_ERROR**：Mermaid代码语法错误
- **FILE_WRITE_ERROR**：文件写入失败
- **DIRECTORY_CREATE_ERROR**：目录创建失败
- **RENDER_TIMEOUT**：渲染超时
- **INVALID_PARAMETERS**：参数验证失败

## 结果解读指南
- **如何判断执行成功**：检查 success 字段为 true
- **如何获取图片路径**：使用 data.filePath 获取完整路径
- **如何在HTML中使用**：直接使用 filePath 作为 img 标签的 src 属性
- **如何处理批量结果**：遍历 data.results 数组获取每个图片信息

## 后续动作建议
- **成功时**：
  - 将生成的图片路径嵌入到HTML页面中
  - 验证图片在目标环境中的显示效果
  - 考虑为图片添加适当的CSS样式

- **失败时**：
  - 根据错误代码检查并修正问题
  - 简化复杂的Mermaid图表
  - 检查文件系统权限和磁盘空间

- **优化建议**：
  - 为生成的图片添加alt属性提升可访问性
  - 考虑使用CDN或优化图片大小提升加载速度
  - 建立图片文件的版本管理机制
</outcome>
</manual>
