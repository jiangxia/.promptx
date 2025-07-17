const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

module.exports = {
  getDependencies() {
    return [
      'playwright@^1.40.0',
      '@mermaid-js/mermaid@^10.6.0'
    ];
  },

  getMetadata() {
    return {
      name: 'mermaid-chart-generator',
      description: '将Mermaid图表代码转换为高质量PNG/SVG图片的专业工具',
      version: '1.0.0',
      category: 'visualization',
      author: '鲁班',
      tags: ['mermaid', 'chart', 'diagram', 'visualization', 'image'],
      manual: '@manual://mermaid-chart-generator'
    };
  },

  getSchema() {
    return {
      type: 'object',
      properties: {
        mermaidCode: {
          type: 'string',
          description: '有效的Mermaid图表代码',
          maxLength: 50000
        },
        outputFormat: {
          type: 'string',
          enum: ['png', 'svg'],
          default: 'png',
          description: '输出格式'
        },
        outputDir: {
          type: 'string',
          default: './images',
          description: '输出目录路径'
        },
        fileName: {
          type: 'string',
          description: '自定义文件名（不含扩展名）',
          pattern: '^[a-zA-Z0-9_-]+$'
        },
        width: {
          type: 'number',
          minimum: 100,
          maximum: 4000,
          default: 800,
          description: '图片宽度（仅PNG格式）'
        },
        height: {
          type: 'number',
          minimum: 100,
          maximum: 4000,
          default: 600,
          description: '图片高度（仅PNG格式）'
        },
        backgroundColor: {
          type: 'string',
          default: 'white',
          description: '背景颜色'
        },
        theme: {
          type: 'string',
          enum: ['default', 'dark', 'forest', 'neutral'],
          default: 'default',
          description: 'Mermaid主题'
        },
        charts: {
          type: 'array',
          description: '批量处理的图表数组',
          items: {
            type: 'object',
            properties: {
              mermaidCode: { type: 'string' },
              fileName: { type: 'string' }
            },
            required: ['mermaidCode']
          }
        }
      },
      anyOf: [
        { required: ['mermaidCode'] },
        { required: ['charts'] }
      ]
    };
  },

  validate(params) {
    const errors = [];

    // 检查是否提供了mermaidCode或charts
    if (!params.mermaidCode && !params.charts) {
      errors.push('必须提供 mermaidCode 或 charts 参数');
    }

    // 验证单个图表
    if (params.mermaidCode) {
      if (typeof params.mermaidCode !== 'string') {
        errors.push('mermaidCode 必须是字符串');
      } else if (params.mermaidCode.trim().length === 0) {
        errors.push('mermaidCode 不能为空');
      } else if (params.mermaidCode.length > 50000) {
        errors.push('mermaidCode 长度不能超过50000字符');
      }
    }

    // 验证批量图表
    if (params.charts) {
      if (!Array.isArray(params.charts)) {
        errors.push('charts 必须是数组');
      } else if (params.charts.length === 0) {
        errors.push('charts 数组不能为空');
      } else {
        params.charts.forEach((chart, index) => {
          if (!chart.mermaidCode) {
            errors.push(`charts[${index}] 缺少 mermaidCode`);
          } else if (typeof chart.mermaidCode !== 'string') {
            errors.push(`charts[${index}].mermaidCode 必须是字符串`);
          }
        });
      }
    }

    // 验证文件名
    if (params.fileName && !/^[a-zA-Z0-9_-]+$/.test(params.fileName)) {
      errors.push('fileName 只能包含字母、数字、下划线、连字符');
    }

    // 验证尺寸
    if (params.width && (params.width < 100 || params.width > 4000)) {
      errors.push('width 必须在 100-4000 范围内');
    }
    if (params.height && (params.height < 100 || params.height > 4000)) {
      errors.push('height 必须在 100-4000 范围内');
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  },

  async execute(params) {
    try {
      // 参数验证
      const validation = this.validate(params);
      if (!validation.valid) {
        throw new Error(`参数验证失败: ${validation.errors.join(', ')}`);
      }

      // 设置默认值
      const options = {
        outputFormat: params.outputFormat || 'png',
        outputDir: params.outputDir || './images',
        width: params.width || 800,
        height: params.height || 600,
        backgroundColor: params.backgroundColor || 'white',
        theme: params.theme || 'default'
      };

      // 确保输出目录存在
      await this.ensureDirectory(options.outputDir);

      // 处理单个图表或批量图表
      if (params.charts) {
        return await this.processBatchCharts(params.charts, options);
      } else {
        return await this.processSingleChart(params.mermaidCode, params.fileName, options);
      }

    } catch (error) {
      return {
        success: false,
        error: {
          code: this.getErrorCode(error),
          message: error.message,
          details: error.stack,
          suggestion: this.getErrorSuggestion(error)
        }
      };
    }
  },

  async processSingleChart(mermaidCode, fileName, options) {
    const { chromium } = require('playwright');
    
    // 生成文件名
    const finalFileName = fileName || this.generateFileName(mermaidCode);
    const filePath = path.join(options.outputDir, `${finalFileName}.${options.outputFormat}`);

    // 启动浏览器
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
      // 设置页面内容
      const html = this.generateHTML(mermaidCode, options);
      await page.setContent(html);

      // 等待Mermaid渲染完成
      await page.waitForSelector('#mermaid-chart svg', { timeout: 30000 });

      // 获取SVG元素
      const svgElement = await page.$('#mermaid-chart svg');
      
      if (options.outputFormat === 'svg') {
        // 导出SVG
        const svgContent = await page.evaluate(() => {
          const svg = document.querySelector('#mermaid-chart svg');
          return svg.outerHTML;
        });
        await fs.writeFile(filePath, svgContent, 'utf8');
      } else {
        // 导出PNG
        await svgElement.screenshot({
          path: filePath,
          type: 'png'
        });
      }

      // 获取文件信息
      const stats = await fs.stat(filePath);
      const dimensions = await this.getImageDimensions(page, svgElement);

      return {
        success: true,
        data: {
          filePath: filePath,
          fileName: path.basename(filePath),
          fileSize: stats.size,
          dimensions: dimensions,
          format: options.outputFormat,
          generatedAt: new Date().toISOString()
        }
      };

    } finally {
      await browser.close();
    }
  },

  async processBatchCharts(charts, options) {
    const results = [];
    let successCount = 0;

    for (let i = 0; i < charts.length; i++) {
      const chart = charts[i];
      try {
        const result = await this.processSingleChart(
          chart.mermaidCode,
          chart.fileName,
          options
        );
        
        if (result.success) {
          successCount++;
          results.push({
            filePath: result.data.filePath,
            fileName: result.data.fileName,
            status: 'success'
          });
        } else {
          results.push({
            fileName: chart.fileName || `chart-${i}`,
            status: 'failed',
            error: result.error.message
          });
        }
      } catch (error) {
        results.push({
          fileName: chart.fileName || `chart-${i}`,
          status: 'failed',
          error: error.message
        });
      }
    }

    return {
      success: true,
      data: {
        totalGenerated: successCount,
        totalRequested: charts.length,
        results: results,
        outputDir: options.outputDir
      }
    };
  },

  generateHTML(mermaidCode, options) {
    return `
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10.6.0/dist/mermaid.min.js"></script>
    <style>
        body {
            margin: 0;
            padding: 20px;
            background-color: ${options.backgroundColor};
            font-family: Arial, sans-serif;
        }
        #mermaid-chart {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    </style>
</head>
<body>
    <div id="mermaid-chart">
        <div class="mermaid">
${mermaidCode}
        </div>
    </div>
    <script>
        mermaid.initialize({
            theme: '${options.theme}',
            startOnLoad: true,
            securityLevel: 'loose'
        });
    </script>
</body>
</html>`;
  },

  async ensureDirectory(dirPath) {
    try {
      await fs.access(dirPath);
    } catch (error) {
      await fs.mkdir(dirPath, { recursive: true });
    }
  },

  generateFileName(mermaidCode) {
    const hash = crypto.createHash('md5').update(mermaidCode).digest('hex');
    return `mermaid-${hash.substring(0, 8)}`;
  },

  async getImageDimensions(page, svgElement) {
    return await page.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return {
        width: Math.round(rect.width),
        height: Math.round(rect.height)
      };
    }, svgElement);
  },

  getErrorCode(error) {
    if (error.message.includes('syntax') || error.message.includes('parse')) {
      return 'MERMAID_SYNTAX_ERROR';
    } else if (error.message.includes('timeout')) {
      return 'RENDER_TIMEOUT';
    } else if (error.message.includes('ENOENT') || error.message.includes('permission')) {
      return 'FILE_WRITE_ERROR';
    } else if (error.message.includes('参数验证失败')) {
      return 'INVALID_PARAMETERS';
    } else {
      return 'UNKNOWN_ERROR';
    }
  },

  getErrorSuggestion(error) {
    const code = this.getErrorCode(error);
    const suggestions = {
      'MERMAID_SYNTAX_ERROR': '请检查Mermaid代码语法，确保符合官方规范',
      'RENDER_TIMEOUT': '图表过于复杂，请简化图表内容或增加超时时间',
      'FILE_WRITE_ERROR': '请检查输出目录权限和磁盘空间',
      'INVALID_PARAMETERS': '请检查输入参数格式和取值范围',
      'UNKNOWN_ERROR': '请联系技术支持或查看详细错误信息'
    };
    return suggestions[code] || suggestions['UNKNOWN_ERROR'];
  }
};
