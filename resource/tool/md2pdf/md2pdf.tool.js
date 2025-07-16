/**
 * PromptX Tool: md2pdf
 * Markdown to PDF Converter with Chinese Font Support
 * 
 * @author Luban (PromptX Tool Development Master)
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { marked } = require('marked');

/**
 * ToolInterface Implementation
 */
class Md2PdfTool {
  constructor() {
    this.name = 'md2pdf';
    this.version = '1.0.0';
    this.description = 'Convert Markdown files to PDF with Chinese font support';
  }

  /**
   * Tool execution entry point
   * @param {Object} params - Tool parameters
   * @param {string} params.input - Input file or directory path
   * @param {string} [params.output] - Output directory path
   * @param {boolean} [params.recursive=false] - Process subdirectories recursively
   * @param {number} [params.fontSize=14] - Font size in pixels
   * @param {string} [params.margin='20mm'] - Page margins
   * @param {string} [params.format='A4'] - Page format
   * @param {boolean} [params.landscape=false] - Landscape orientation
   * @param {boolean} [params.headerFooter=true] - Include header and footer
   * @returns {Promise<Object>} Conversion result
   */
  async execute(params) {
    try {
      const {
        input,
        output,
        recursive = false,
        fontSize = 14,
        margin = '20mm',
        format = 'A4',
        landscape = false,
        headerFooter = true
      } = params;

      if (!input) {
        throw new Error('Input file or directory is required');
      }

      const inputPath = path.resolve(input);
      const stats = fs.statSync(inputPath);
      let files = [];

      if (stats.isFile()) {
        if (path.extname(inputPath) === '.md') {
          files = [inputPath];
        } else {
          throw new Error('Input file must be a Markdown (.md) file');
        }
      } else if (stats.isDirectory()) {
        files = this.findMarkdownFiles(inputPath, recursive);
      } else {
        throw new Error('Input must be a file or directory');
      }

      if (files.length === 0) {
        return {
          success: true,
          message: 'No Markdown files found',
          processed: 0,
          failed: 0
        };
      }

      console.log(`Found ${files.length} Markdown file(s)`);

      const browser = await this.launchBrowser();
      let processed = 0;
      let failed = 0;
      const errors = [];

      for (const file of files) {
        try {
          // 如果没有指定output，使用文件所在目录；否则使用指定的output目录
          const outputDir = output ? path.resolve(output) : path.dirname(file);
          
          // 确保输出目录存在
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }
          
          await this.convertFile(browser, file, outputDir, {
            fontSize,
            margin,
            format,
            landscape,
            headerFooter
          });
          processed++;
          console.log(`✓ Converted: ${path.basename(file)}`);
        } catch (error) {
          failed++;
          const errorMsg = `✗ Failed: ${path.basename(file)} - ${error.message}`;
          console.error(errorMsg);
          errors.push(errorMsg);
        }
      }

      await browser.close();

      return {
        success: true,
        message: `Conversion completed: ${processed} successful, ${failed} failed`,
        processed,
        failed,
        errors: errors.length > 0 ? errors : undefined
      };

    } catch (error) {
      return {
        success: false,
        message: `Tool execution failed: ${error.message}`,
        error: error.message
      };
    }
  }

  /**
   * Find Markdown files in directory
   */
  findMarkdownFiles(dir, recursive) {
    const files = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isFile() && path.extname(item) === '.md') {
        files.push(fullPath);
      } else if (stat.isDirectory() && recursive) {
        files.push(...this.findMarkdownFiles(fullPath, recursive));
      }
    }

    return files;
  }

  /**
   * Launch Puppeteer browser with system Chrome
   */
  async launchBrowser() {
    const executablePath = this.getChromePath();
    
    return await puppeteer.launch({
      headless: true,
      executablePath,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });
  }

  /**
   * Get Chrome executable path based on OS
   */
  getChromePath() {
    const platform = process.platform;
    
    if (platform === 'darwin') {
      return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    } else if (platform === 'win32') {
      return 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    } else {
      return '/usr/bin/google-chrome';
    }
  }

  /**
   * Convert single Markdown file to PDF
   */
  async convertFile(browser, inputFile, outputDir, options) {
    const markdown = fs.readFileSync(inputFile, 'utf8');
    const html = marked(markdown);
    
    const styledHtml = this.wrapWithStyles(html, options.fontSize);
    
    const page = await browser.newPage();
    await page.setContent(styledHtml, { waitUntil: 'networkidle0' });
    
    const filename = path.basename(inputFile, '.md') + '.pdf';
    const outputPath = path.join(outputDir, filename);
    
    await page.pdf({
      path: outputPath,
      format: options.format,
      landscape: options.landscape,
      margin: {
        top: '3.7cm',
        right: '2.6cm', 
        bottom: '3.5cm',
        left: '2.8cm'
      },
      displayHeaderFooter: options.headerFooter,
      headerTemplate: '',
      footerTemplate: options.headerFooter ? '<div style="font-family: FangSong, 仿宋, 仿宋_GB2312, FangSong_GB2312, serif; font-size: 10.5pt; text-align: center; width: 100%; margin-top: 10px;">-<span class="pageNumber"></span>-</div>' : '',
      printBackground: true
    });
    
    await page.close();
  }

  /**
   * Wrap HTML content with CSS styles
   */
  wrapWithStyles(html, fontSize) {
    // 预处理HTML，移除不需要的Markdown格式
    const processedHtml = this.preprocessHtml(html);
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @page {
            margin: 3.7cm 2.6cm 3.5cm 2.8cm;
            size: A4;
        }
        body {
            font-family: "FangSong", "仿宋", "仿宋_GB2312", "FangSong_GB2312", serif;
            font-size: 14pt; /* 四号字 */
            line-height: 28pt; /* 固定值28磅 */
            color: #000;
            margin: 0;
            padding: 0;
            text-align: left;
        }
        
        /* 大标题样式 - 黑体二号字，居中 */
        h1 {
            font-family: "SimHei", "黑体", "Microsoft YaHei", sans-serif;
            font-size: 22pt; /* 二号字 */
            font-weight: bold;
            text-align: center;
            margin: 0 0 28pt 0; /* 空一行 */
            line-height: 1;
            border: none;
            padding: 0;
        }
        
        /* 一级标题 - 仿宋加粗四号字，左对齐 */
        h2 {
            font-family: "FangSong", "仿宋", "仿宋_GB2312", "FangSong_GB2312", serif;
            font-size: 14pt;
            font-weight: bold;
            text-align: left;
            margin: 14pt 0 0 0; /* 与上一部分空半行 */
            line-height: 28pt;
            border: none;
            padding: 0;
        }
        
        /* 二级标题 - 仿宋加粗四号字，左对齐 */
        h3 {
            font-family: "FangSong", "仿宋", "仿宋_GB2312", "FangSong_GB2312", serif;
            font-size: 14pt;
            font-weight: bold;
            text-align: left;
            margin: 0;
            line-height: 28pt;
            border: none;
            padding: 0;
        }
        
        /* 三级标题 - 仿宋四号字，不加粗 */
        h4, h5, h6 {
            font-family: "FangSong", "仿宋", "仿宋_GB2312", "FangSong_GB2312", serif;
            font-size: 14pt;
            font-weight: normal;
            text-align: left;
            margin: 0;
            line-height: 28pt;
            border: none;
            padding: 0;
        }
        
        /* 正文段落 - 首行缩进2字符 */
        p {
            font-family: "FangSong", "仿宋", "仿宋_GB2312", "FangSong_GB2312", serif;
            font-size: 14pt;
            line-height: 28pt;
            text-indent: 2em; /* 首行缩进2字符 */
            margin: 0;
            text-align: left;
        }
        
        /* Q&A段落特殊处理 - 问题后换行 */
        .qa-section {
            margin-bottom: 28pt; /* Q&A结束后空一行 */
        }
        
        /* 移除列表样式，转为正常段落 */
        ul, ol {
            list-style: none;
            margin: 0;
            padding: 0;
        }
        
        li {
            font-family: "FangSong", "仿宋", "仿宋_GB2312", "FangSong_GB2312", serif;
            font-size: 14pt;
            line-height: 28pt;
            text-indent: 2em;
            margin: 0;
            text-align: left;
        }
        
        /* 引用内容 - 首行缩进4字符 */
        blockquote {
            font-family: "FangSong", "仿宋", "仿宋_GB2312", "FangSong_GB2312", serif;
            font-size: 14pt;
            line-height: 28pt;
            text-indent: 4em; /* 比正文多2字符 */
            margin: 0;
            border: none;
            padding: 0;
            color: #000;
        }
        
        /* 表格样式 */
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 28pt 0; /* 表格前后各空一行 */
            font-family: "FangSong", "仿宋", "仿宋_GB2312", "FangSong_GB2312", serif;
        }
        
        th {
            border: 1.5pt solid #000;
            padding: 8pt 12pt;
            text-align: center;
            font-size: 14pt;
            font-weight: bold;
            line-height: 28pt;
        }
        
        td {
            border: 1.5pt solid #000;
            padding: 8pt 12pt;
            text-align: center;
            font-size: 14pt;
            line-height: 28pt;
        }
        
        /* 移除代码块样式，转为正常文本 */
        code, pre {
            font-family: "FangSong", "仿宋", "仿宋_GB2312", "FangSong_GB2312", serif;
            font-size: 14pt;
            line-height: 28pt;
            background: none;
            border: none;
            padding: 0;
            margin: 0;
        }
        
        /* 链接样式 */
        a {
            color: #000;
            text-decoration: none;
        }
        
        /* 强调文本 */
        strong, b {
            font-weight: bold;
        }
        
        em, i {
            font-style: normal;
            font-weight: bold;
        }
        
        /* 隐藏水平分割线 */
        hr {
            display: none;
        }
    </style>
</head>
<body>
${processedHtml}
</body>
</html>`;
  }
  
  /**
   * 预处理HTML，优化法律文书格式
   */
  preprocessHtml(html) {
    let processed = html;
    
    // 移除水平分割线
    processed = processed.replace(/<hr\s*\/?>/gi, '');
    
    // 将列表项转换为正常段落
    processed = processed.replace(/<ul[^>]*>/gi, '');
    processed = processed.replace(/<\/ul>/gi, '');
    processed = processed.replace(/<ol[^>]*>/gi, '');
    processed = processed.replace(/<\/ol>/gi, '');
    processed = processed.replace(/<li[^>]*>/gi, '<p>');
    processed = processed.replace(/<\/li>/gi, '</p>');
    
    // 移除多余的空段落
    processed = processed.replace(/<p>\s*<\/p>/gi, '');
    
    // 智能处理Q&A完整单元
    processed = this.processQAUnits(processed);
    
    // 处理连续的段落，确保适当间距
    processed = processed.replace(/(<\/p>)\s*(<p>)/gi, '$1$2');
    
    return processed;
  }
  
  /**
   * 智能处理Q&A完整单元
   * 识别从Q开始到下一个Q开始之前的所有内容作为一个完整单元
   */
  processQAUnits(html) {
    // 将HTML按段落分割
    const paragraphs = html.split(/(<\/p>)/gi);
    let result = [];
    let currentQAUnit = [];
    let inQAUnit = false;
    
    for (let i = 0; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i];
      
      // 检查是否是Q开头的段落
      if (paragraph.match(/<p><strong>Q\d+/i)) {
        // 如果之前有Q&A单元，先结束它
        if (inQAUnit && currentQAUnit.length > 0) {
          result.push('<div class="qa-section">' + currentQAUnit.join('') + '</div>');
          currentQAUnit = [];
        }
        // 开始新的Q&A单元
        inQAUnit = true;
        currentQAUnit.push(paragraph);
      } else if (inQAUnit) {
        // 在Q&A单元内，继续收集内容
        currentQAUnit.push(paragraph);
      } else {
        // 不在Q&A单元内，直接添加到结果
        result.push(paragraph);
      }
    }
    
    // 处理最后一个Q&A单元
    if (inQAUnit && currentQAUnit.length > 0) {
      result.push('<div class="qa-section">' + currentQAUnit.join('') + '</div>');
    }
    
    return result.join('');
  }

  /**
   * Get tool dependencies (PromptX ToolInterface standard)
   */
  getDependencies() {
    return {
      npm: ['puppeteer@^22.15.0', 'marked@^11.2.0']
    };
  }

  /**
   * Get tool metadata
   */
  getMetadata() {
    return {
      name: this.name,
      version: this.version,
      description: this.description,
      author: 'Luban (PromptX Tool Development Master)',
      dependencies: ['puppeteer', 'marked'],
      parameters: {
        input: { type: 'string', required: true, description: 'Input file or directory path' },
        output: { type: 'string', required: false, description: 'Output directory path', default: 'output' },
        recursive: { type: 'boolean', required: false, description: 'Process subdirectories recursively', default: false },
        fontSize: { type: 'number', required: false, description: 'Font size in pixels', default: 14 },
        margin: { type: 'string', required: false, description: 'Page margins', default: '20mm' },
        format: { type: 'string', required: false, description: 'Page format', default: 'A4' },
        landscape: { type: 'boolean', required: false, description: 'Landscape orientation', default: false },
        headerFooter: { type: 'boolean', required: false, description: 'Include header and footer', default: true }
      }
    };
  }
}

// PromptX Tool Export
module.exports = Md2PdfTool;

// For direct execution (development/testing)
if (require.main === module) {
  const tool = new Md2PdfTool();
  
  // Parse command line arguments
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('Usage: node md2pdf.tool.js <input> [options]');
    console.log('Example: node md2pdf.tool.js test.md --output=output --fontSize=16');
    process.exit(1);
  }
  
  const params = { input: args[0] };
  
  // Parse additional options
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const [key, value] = arg.substring(2).split('=');
      if (value !== undefined) {
        // Convert string values to appropriate types
        if (value === 'true') params[key] = true;
        else if (value === 'false') params[key] = false;
        else if (!isNaN(value)) params[key] = Number(value);
        else params[key] = value;
      }
    }
  }
  
  tool.execute(params)
    .then(result => {
      console.log(JSON.stringify(result, null, 2));
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Tool execution failed:', error.message);
      process.exit(1);
    });
}