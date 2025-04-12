const fs = require('fs');
const path = require('path');
const { createWorker } = require('tesseract.js');
const pdf = require('pdf-parse');
const os = require('os');

/**
 * Extract text from a PDF file using pdf-parse and then Tesseract
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<string>} - Extracted text
 */
const extractTextFromPDF = async (pdfBuffer) => {
  try {
    // First try with pdf-parse for text-based PDFs
    try {
      const data = await pdf(pdfBuffer);
      // If we get substantial text, return it
      if (data.text && data.text.length > 100) {
        return data.text;
      }
    } catch (err) {
      console.log('pdf-parse failed, falling back to Tesseract:', err.message);
    }

    // If pdf-parse didn't yield usable results, use Tesseract for image-based PDFs
    const worker = await createWorker();
    
    // Save PDF to temp file
    const tempDir = os.tmpdir();
    const tempPdfPath = path.join(tempDir, `temp-${Date.now()}.pdf`);
    fs.writeFileSync(tempPdfPath, pdfBuffer);
    
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    
    // OCR the first page of the PDF
    const { data } = await worker.getPDF(tempPdfPath);
    
    // Clean up temp file
    fs.unlinkSync(tempPdfPath);
    
    // Extract text from the first page
    const { data: { text } } = await worker.recognize(data);
    await worker.terminate();
    
    return text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
};

/**
 * Verify if the PDF content contains the student information
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {Object} studentInfo - Student information to verify
 * @param {string} studentInfo.name - Student name
 * @param {string} studentInfo.registrationNumber - Student registration number
 * @returns {Promise<boolean>} - Whether the PDF contains the student information
 */
const verifyPDFContent = async (pdfBuffer, studentInfo) => {
  try {
    const text = await extractTextFromPDF(pdfBuffer);
    
    // Convert text to lowercase for case-insensitive comparison
    const lowerCaseText = text.toLowerCase();
    const nameToCheck = studentInfo.name.toLowerCase();
    const regNoToCheck = studentInfo.registrationNumber.toLowerCase();
    
    // Check if text contains student name AND registration number
    const containsName = lowerCaseText.includes(nameToCheck);
    const containsRegNo = lowerCaseText.includes(regNoToCheck);
    
    console.log(`PDF Verification Results: Contains Name: ${containsName}`);
    
    // Return true only if either name or registration number are found
    return containsName || containsRegNo;
  } catch (error) {
    console.error('Error verifying PDF content:', error);
    throw new Error(`Failed to verify PDF content: ${error.message}`);
  }
};

module.exports = {
  extractTextFromPDF,
  verifyPDFContent
};