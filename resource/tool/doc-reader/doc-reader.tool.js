/**
 * doc_reader.tool.js
 *
 * 功能：读取Microsoft Word .doc文件内容
 * 依赖：需要系统安装antiword命令行工具
 */

module.exports = {
  // 声明依赖
  getDependencies() {
    return []; // 不需要额外依赖
  },

  // 工具元数据
  getMetadata() {
    return {
      name: "doc-reader",
      description: "读取Microsoft Word .doc格式文档的内容",
      version: "1.0.0",
      category: "document",
      author: "鲁班",
      tags: ["doc", "document", "word", "reader"],
    };
  },

  // 参数Schema
  getSchema() {
    return {
      type: "object",
      properties: {
        filePath: {
          type: "string",
          description: "要读取的.doc文件路径",
        },
        showPageLayout: {
          type: "boolean",
          description: "是否保留页面布局",
          default: false,
        },
      },
      required: ["filePath"],
    };
  },

  // 参数验证
  validate(params) {
    const { filePath } = params;

    if (!filePath) {
      return { valid: false, errors: ["filePath参数不能为空"] };
    }

    // 检查文件扩展名
    if (!filePath.toLowerCase().endsWith(".doc")) {
      return { valid: false, errors: [`文件 '${filePath}' 不是.doc格式`] };
    }

    return { valid: true, errors: [] };
  },

  // 执行逻辑
  async execute(params) {
    const { filePath, showPageLayout = false } = params;
    const fs = require("fs");
    const path = require("path");
    const os = require("os");
    const { exec } = require("child_process");
    const { promisify } = require("util");
    const execPromise = promisify(exec);

    try {
      // 检查文件是否存在
      if (!fs.existsSync(filePath)) {
        return {
          success: false,
          error: {
            code: "FILE_NOT_FOUND",
            message: `文件 '${filePath}' 不存在`,
          },
        };
      }

      // 检查antiword是否安装
      try {
        await execPromise("which antiword");
      } catch (error) {
        return {
          success: false,
          error: {
            code: "TOOL_NOT_FOUND",
            message: "未安装antiword工具，请运行: brew install antiword",
          },
        };
      }

      // 创建临时文件
      const startTime = Date.now();
      const tempOutputFile = path.join(
        os.tmpdir(),
        `doc-reader-${Date.now()}.txt`
      );

      // 决定是否使用-f参数来保留格式
      const formatOption = showPageLayout ? "-f" : "";

      // 重定向输出到临时文件
      await execPromise(
        `antiword ${formatOption} "${filePath}" > "${tempOutputFile}"`
      );

      // 读取临时文件内容
      const content = fs.readFileSync(tempOutputFile, "utf8");

      // 删除临时文件
      try {
        fs.unlinkSync(tempOutputFile);
      } catch (e) {
        // 忽略删除临时文件的错误
      }

      return {
        success: true,
        data: {
          content,
          metadata: {
            fileName: path.basename(filePath),
            fileSize: fs.statSync(filePath).size,
            processingTime: Date.now() - startTime,
          },
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "EXECUTION_ERROR",
          message: `执行失败: ${error.message}`,
        },
      };
    }
  },
};
