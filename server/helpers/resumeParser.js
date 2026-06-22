const { PDFParse } = require('pdf-parse');

/**
 * Extracts plain text from an uploaded PDF resume buffer
 */
async function extractTextFromPDF(fileBuffer) {
  const parser = new PDFParse({ data: fileBuffer });
  const result = await parser.getText();
  return result.text;
}

module.exports = { extractTextFromPDF };