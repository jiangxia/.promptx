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
        output = 'output',
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
      const outputPath = path.resolve(output);

      // Ensure output directory exists
      if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
      }

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
          await this.convertFile(browser, file, outputPath, {
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
        top: options.margin,
        right: options.margin,
        bottom: options.margin,
        left: options.margin
      },
      displayHeaderFooter: options.headerFooter,
      headerTemplate: options.headerFooter ? '<div style="font-size:10px; text-align:center; width:100%;"><span class="title"></span></div>' : '',
      footerTemplate: options.headerFooter ? '<div style="font-size:10px; text-align:center; width:100%;"><span class="pageNumber"></span> / <span class="totalPages"></span></div>' : '',
      printBackground: true
    });
    
    await page.close();
  }

  /**
   * Wrap HTML content with CSS styles
   */
  wrapWithStyles(html, fontSize) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", "Helvetica Neue", Arial, sans-serif;
            font-size: ${fontSize}px;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1, h2, h3, h4, h5, h6 {
            color: #2c3e50;
            margin-top: 24px;
            margin-bottom: 16px;
        }
        h1 { font-size: 2em; border-bottom: 2px solid #eee; padding-bottom: 10px; }
        h2 { font-size: 1.5em; border-bottom: 1px solid #eee; padding-bottom: 8px; }
        h3 { font-size: 1.25em; }
        p { margin-bottom: 16px; }
        code {
            background-color: #f8f8f8;
            border: 1px solid #e1e1e8;
            border-radius: 3px;
            padding: 2px 4px;
            font-family: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace;
        }
        pre {
            background-color: #f8f8f8;
            border: 1px solid #e1e1e8;
            border-radius: 3px;
            padding: 16px;
            overflow: auto;
        }
        pre code {
            background: none;
            border: none;
            padding: 0;
        }
        blockquote {
            border-left: 4px solid #dfe2e5;
            padding-left: 16px;
            color: #6a737d;
            margin: 0 0 16px 0;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 16px;
        }
        th, td {
            border: 1px solid #dfe2e5;
            padding: 8px 12px;
            text-align: left;
        }
        th {
            background-color: #f6f8fa;
            font-weight: 600;
        }
        ul, ol {
            margin-bottom: 16px;
            padding-left: 30px;
        }
        li {
            margin-bottom: 4px;
        }
        a {
            color: #0366d6;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        img {
            max-width: 100%;
            height: auto;
        }
    </style>
</head>
<body>
${html}
</body>
</html>`;
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