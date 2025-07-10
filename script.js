// This script converts a text file to a PDF file using pdf-lib and Node.js

const fs = require('fs');
const { PDFDocument, StandardFonts } = require('pdf-lib');
const path = require('path');

// Function to convert text file to PDF
async function textToPDF(inputPath, outputPath) {
    // Read the text file
    const text = fs.readFileSync(inputPath, 'utf8');

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    const { width, height } = page.getSize();

    // Split text into lines that fit the page width
    const maxLineWidth = width - 80;
    const words = text.split(/\s+/);
    let lines = [];
    let currentLine = '';

    for (let word of words) {
        const testLine = currentLine ? currentLine + ' ' + word : word;
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);
        if (testWidth < maxLineWidth) {
            currentLine = testLine;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    if (currentLine) lines.push(currentLine);

    // Draw lines on the PDF page
    let y = height - 40;
    for (let line of lines) {
        if (y < 40) break; // Stop if out of space
        page.drawText(line, { x: 40, y, size: fontSize, font });
        y -= fontSize + 4;
    }

    // Write PDF to file
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, pdfBytes);
    console.log(`Converted ${inputPath} to ${outputPath}`);
}

// Example usage
const inputFile = path.join(__dirname, 'input.txt');
const outputFile = path.join(__dirname, 'output.pdf');
textToPDF(inputFile, outputFile);