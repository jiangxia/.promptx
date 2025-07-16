# md2pdf 工具使用手册

## 工具概述

**md2pdf** 是一个专业的 Markdown 转 PDF 工具，专为中文内容优化，支持批量处理和丰富的自定义选项。

- **工具名称**: md2pdf
- **版本**: 1.0.0
- **作者**: Luban (PromptX Tool Development Master)
- **依赖**: puppeteer, marked

## 核心特性

### 🎯 中文字体优化
- 内置中文字体支持（PingFang SC, Microsoft YaHei 等）
- 完美渲染中英文混排内容
- 自动字体回退机制

### 📁 批量处理能力
- 支持单文件转换
- 支持目录批量转换
- 可选递归处理子目录
- 智能文件发现

### 🎨 丰富自定义选项
- 可调节字体大小
- 自定义页边距
- 多种页面格式（A4, A3, Letter 等）
- 横向/纵向布局
- 页眉页脚控制

### 🔧 跨平台兼容
- 自动检测系统 Chrome 浏览器
- 支持 macOS, Windows, Linux
- 无需额外下载浏览器

## 使用方法

### PromptX 工具调用

```javascript
// 基础用法
const result = await promptx.tool('md2pdf', {
  input: 'document.md'
});

// 高级用法
const result = await promptx.tool('md2pdf', {
  input: 'docs/',
  output: 'pdf-output',
  recursive: true,
  fontSize: 16,
  margin: '25mm',
  format: 'A4',
  landscape: false,
  headerFooter: true
});
```

### 直接执行（开发/测试）

```bash
# 单文件转换
node md2pdf.tool.js document.md

# 批量转换
node md2pdf.tool.js docs/ --output=pdf-files --recursive=true

# 自定义选项
node md2pdf.tool.js content.md --fontSize=18 --margin=30mm --format=A3
```

## 参数详解

### 必需参数

| 参数 | 类型 | 描述 |
|------|------|------|
| `input` | string | 输入文件或目录路径 |

### 可选参数

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `output` | string | 'output' | 输出目录路径 |
| `recursive` | boolean | false | 递归处理子目录 |
| `fontSize` | number | 14 | 字体大小（像素） |
| `margin` | string | '20mm' | 页边距 |
| `format` | string | 'A4' | 页面格式 |
| `landscape` | boolean | false | 横向布局 |
| `headerFooter` | boolean | true | 包含页眉页脚 |

### 页面格式选项

- `A4` - 标准 A4 纸张
- `A3` - A3 纸张
- `A5` - A5 纸张
- `Letter` - 美式信纸
- `Legal` - 法律文档格式
- `Tabloid` - 小报格式

### 边距格式

支持多种单位：
- `20mm` - 毫米
- `0.8in` - 英寸
- `50px` - 像素
- `2cm` - 厘米

## 使用示例

### 示例 1: 单文件转换

```javascript
const result = await promptx.tool('md2pdf', {
  input: 'README.md',
  output: 'docs'
});

console.log(result);
// {
//   success: true,
//   message: "Conversion completed: 1 successful, 0 failed",
//   processed: 1,
//   failed: 0
// }
```

### 示例 2: 批量转换

```javascript
const result = await promptx.tool('md2pdf', {
  input: 'markdown-files/',
  output: 'pdf-output',
  recursive: true,
  fontSize: 16,
  margin: '25mm'
});
```

### 示例 3: 自定义样式

```javascript
const result = await promptx.tool('md2pdf', {
  input: 'presentation.md',
  output: 'slides',
  format: 'A3',
  landscape: true,
  fontSize: 18,
  margin: '15mm',
  headerFooter: false
});
```

## 返回值格式

### 成功返回

```javascript
{
  success: true,
  message: "Conversion completed: 3 successful, 0 failed",
  processed: 3,
  failed: 0
}
```

### 部分失败返回

```javascript
{
  success: true,
  message: "Conversion completed: 2 successful, 1 failed",
  processed: 2,
  failed: 1,
  errors: [
    "✗ Failed: broken.md - Invalid markdown syntax"
  ]
}
```

### 错误返回

```javascript
{
  success: false,
  message: "Tool execution failed: Input file not found",
  error: "Input file not found"
}
```

## 支持的 Markdown 语法

- **标题**: # ## ### #### ##### ######
- **段落**: 普通文本段落
- **强调**: *斜体* **粗体** ***粗斜体***
- **列表**: 有序列表和无序列表
- **链接**: [文本](URL)
- **图片**: ![alt](src)
- **代码**: `行内代码` 和 ```代码块```
- **引用**: > 引用文本
- **表格**: | 表格 | 语法 |
- **分割线**: ---

## 样式特性

### 字体配置
- **中文字体**: PingFang SC, Hiragino Sans GB, Microsoft YaHei
- **英文字体**: Helvetica Neue, Arial
- **代码字体**: SF Mono, Monaco, Cascadia Code

### 颜色方案
- **正文**: #333 深灰色
- **标题**: #2c3e50 深蓝灰
- **链接**: #0366d6 蓝色
- **引用**: #6a737d 中灰色

### 布局设计
- **最大宽度**: 800px
- **行高**: 1.6
- **标题间距**: 自适应
- **段落间距**: 16px

## 故障排除

### 常见问题

**Q: 提示找不到 Chrome 浏览器**
A: 确保系统已安装 Google Chrome，或检查浏览器安装路径

**Q: 中文字体显示异常**
A: 工具已内置中文字体支持，如仍有问题请检查系统字体

**Q: 转换速度较慢**
A: 大文件或批量转换需要时间，建议分批处理

**Q: PDF 文件过大**
A: 可以调整图片大小或减少字体大小来优化文件大小

### 错误代码

- **输入错误**: 文件路径不存在或格式不正确
- **权限错误**: 输出目录无写入权限
- **浏览器错误**: Chrome 启动失败
- **转换错误**: Markdown 语法错误或内容问题

## 最佳实践

### 性能优化
1. **批量处理**: 一次处理多个文件比逐个处理更高效
2. **合理分组**: 避免一次处理过多大文件
3. **图片优化**: 使用适当大小的图片

### 内容建议
1. **标准语法**: 使用标准 Markdown 语法确保兼容性
2. **图片路径**: 使用相对路径引用图片
3. **文件编码**: 确保 Markdown 文件使用 UTF-8 编码

### 输出管理
1. **目录结构**: 保持清晰的输出目录结构
2. **文件命名**: PDF 文件名与原 Markdown 文件名对应
3. **版本控制**: 建议对重要文档进行版本管理

## 技术架构

### 核心依赖
- **Puppeteer**: 无头浏览器控制
- **Marked**: Markdown 解析器
- **Node.js**: 运行时环境

### 处理流程
1. 文件发现与验证
2. Markdown 解析为 HTML
3. CSS 样式注入
4. 浏览器渲染
5. PDF 生成与保存

### 安全特性
- 沙箱执行环境
- 路径验证
- 错误隔离
- 资源清理

---

**开发者**: Luban (PromptX Tool Development Master)  
**更新时间**: 2024年1月  
**工具版本**: 1.0.0