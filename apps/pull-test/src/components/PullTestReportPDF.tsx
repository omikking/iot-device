import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import { Button } from '@gsp/ui';
import { LucideFileDown } from 'lucide-react';
import { BoltResultResponse } from '@/gql/graphql';
import { capitalizeFirstLetter } from '@/libs/utils';

interface PullTestReportPDFProps {
  objList?: BoltResultResponse;
  reportDetails: {
    startDate: string;
    companyName: string;
    mine: string;
    contractor: string;
    commodity: string;
    contactPerson: { name: string; designation: string }[];
    author: string;
    designation: string;
    email: string;
    contactNumber: string;
  };
  layout: {
    contactHtml: string;
    // logo: {
    //   src: string;
    // };
  };
  parentUrl?: string;
  pdfName?: string;
  pdfPageTitle?: string;
  currentDate?: string;
  disabled?: boolean;
}

export const PullTestReportPDF = ({
  objList,
  // layout,
  reportDetails,
  parentUrl = '',
  pdfName = 'report.pdf',
  pdfPageTitle = 'Pull Test Report',
  currentDate = new Date().toLocaleDateString(),
  disabled,
}: PullTestReportPDFProps) => {
  const [isLoading, setLoading] = useState(false);
  console.log('PullTestReportPDF objList:', objList);
  const pdfRef = useRef(new jsPDF({ orientation: 'portrait', compress: true }));

  const generateTextBasedPdfTest = async () => {
    setLoading(true);
    const pdf = pdfRef.current;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const results = objList?.results || [];
    const totalPages = Math.ceil(results.length / 8) + 2;

    // Load image as base64 (you can use your commented loadImageAsBase64 function)
    const loadImageAsBase64 = (imagePath: string): Promise<string> =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = imagePath;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('Canvas context not available'));
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = reject;
      });

    // Load your logo or any other image
    let logoDataUrl: string | null = null;
    try {
      // Replace with your actual logo path
      logoDataUrl = await loadImageAsBase64('/path/to/your/logo.png');
    } catch (error) {
      console.warn('Could not load logo:', error);
    }

    // Set up first page
    // Set up first page
    let currentY = 20;

    // Add logo if available
    if (logoDataUrl) {
      const logoWidth = 30;
      const logoHeight = 20;
      pdf.addImage(logoDataUrl, 'PNG', margin, currentY, logoWidth, logoHeight);
      currentY += logoHeight + 10;
    }

    // Add blue header section
    pdf.setFillColor(24, 183, 249);
    pdf.rect(margin, currentY, pageWidth - margin * 2, 60, 'F');

    pdf.setFontSize(10);
    pdf.setTextColor(255, 255, 255); // White text on blue background
    pdf.text('Metric/Imperial', margin + 10, currentY + 10);
    pdf.text('SANDVIK LOGO', margin + 10, currentY + 20);
    pdf.setFontSize(20);
    pdf.text('PULL TEST REPORT', margin + 10, currentY + 45);

    currentY += 80;

    // Reset text color for details section
    pdf.setTextColor(0, 0, 0);

    // Left column details
    const leftColumnX = margin;
    const rightColumnX = pageWidth / 2 + 10;

    // Left column
    pdf.setFontSize(10);
    pdf.setTextColor(255, 165, 0); // Orange color for labels
    pdf.text('START DATE', 85, currentY);
    pdf.setTextColor(24, 183, 249);
    pdf.setFontSize(12);
    // pdf.text(reportDetails.startDate, leftColumnX, currentY + 5);
    pdf.text(reportDetails.startDate, 85, currentY + 5);

    currentY += 30;

    pdf.setFontSize(10);
    pdf.setTextColor(255, 165, 0);
    pdf.text('COMPANY NAME', leftColumnX, currentY);
    pdf.setTextColor(24, 183, 249);
    pdf.setFontSize(12);
    pdf.text(reportDetails.companyName, leftColumnX, currentY + 5);

    currentY += 30;

    pdf.setFontSize(10);
    pdf.setTextColor(255, 165, 0);
    pdf.text('MINE', leftColumnX, currentY);
    pdf.setTextColor(24, 183, 249);
    pdf.setFontSize(12);
    pdf.text(reportDetails.mine, leftColumnX, currentY + 5);

    // Reset currentY for right column
    let rightColumnY = currentY - 30; // Start at same level as left column

    // Right column
    pdf.setFontSize(10);
    pdf.setTextColor(255, 165, 0);
    pdf.text('CONTRACTOR', rightColumnX, rightColumnY);
    pdf.setTextColor(24, 183, 249);
    pdf.setFontSize(12);
    pdf.text(reportDetails.contractor, rightColumnX, rightColumnY + 5);

    rightColumnY += 30;

    pdf.setFontSize(10);
    pdf.setTextColor(255, 165, 0);
    pdf.text('CONTACT PERSON', rightColumnX, rightColumnY);
    pdf.setTextColor(24, 183, 249);
    pdf.setFontSize(12);
    // Handle multiple contact persons
    if (reportDetails.contactPerson && reportDetails.contactPerson.length > 0) {
      reportDetails.contactPerson.forEach((contact, index) => {
        pdf.text(contact.name, rightColumnX, rightColumnY + 10 + index * 12);
        pdf.setFontSize(10);
        pdf.text(
          contact.designation,
          rightColumnX,
          rightColumnY + 20 + index * 12,
        );
        pdf.setFontSize(12);
      });
    }

    rightColumnY += 30;

    // pdf.setFontSize(10);
    // pdf.setTextColor(255, 165, 0);
    // pdf.text('COMMODITY', rightColumnX, rightColumnY);
    // pdf.setTextColor(0, 0, 0);
    // pdf.setFontSize(12);
    // pdf.text(reportDetails.commodity, rightColumnX, rightColumnY + 10);

    // Add footer for first page
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text(parentUrl, margin, pageHeight - 5);
    pdf.text(`Page 1 of ${totalPages}`, pageWidth - margin, pageHeight - 5, {
      align: 'right',
    });

    // Add table pages with text-based tables
    const itemsPerPage = 8; // Reduced to account for images
    for (let i = 0; i < results.length; i += itemsPerPage) {
      pdf.addPage();
      const pageItems = results.slice(i, i + itemsPerPage);
      const pageNum = Math.floor(i / itemsPerPage) + 2;

      let pageY = 20;

      // Add logo on each page if available
      if (logoDataUrl) {
        const logoWidth = 25;
        const logoHeight = 15;
        pdf.addImage(logoDataUrl, 'PNG', margin, pageY, logoWidth, logoHeight);
        pageY += logoHeight + 5;
      }

      // Add header
      pdf.setFontSize(14);
      pdf.text(pdfPageTitle, pageWidth / 2, 10, { align: 'center' });
      pdf.text(currentDate, margin, 10);
      pdf.setTextColor(0, 0, 0);

      // Add table header
      const headers = [
        'Bolt number',
        'Bolt type',
        'Peak load (tons)',
        'Peak displacement (mm)',
        'Level',
        'Drive',
        'Position in the ring',
        'Results',
      ];

      const customColWidths = [25, 15, 25, 30, 20, 20, 25, 20];
      const totalCustomWidth = customColWidths.reduce(
        (sum, width) => sum + width,
        0,
      );
      const scaleFactor = (pageWidth - margin * 2) / totalCustomWidth;
      const colWidths = customColWidths.map((width) => width * scaleFactor);

      pdf.setFillColor(230, 230, 230);
      pdf.rect(margin, pageY, pageWidth - margin * 2, 18, 'F');

      /* HEADER DRAWING */
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      let currentX = margin;
      headers.forEach((header, index) => {
        const maxWidth = colWidths[index] - 4;
        const lines = pdf.splitTextToSize(header, maxWidth);
        const lineHeight = 3;
        // const totalTextHeight = lines.length * lineHeight;
        // const startY = pageY + 9 + (18 - totalTextHeight) / 2;
        const startY = pageY + 9;

        lines.forEach((line: string, lineIndex: number) => {
          pdf.text(
            line,
            currentX + colWidths[index] / 2,
            startY + lineIndex * lineHeight,
            { align: 'center' },
          );
        });

        currentX += colWidths[index];
      });

      /* ROWS DRAWING */
      pdf.setFont('helvetica', 'normal');
      pageY += 28;
      pageItems.forEach((item, rowIndex) => {
        // Check if peak load or displacement have multiple values
        const peakLoadValues = Array.isArray(item['peakLoad'])
          ? item['peakLoad']
          : [item['peakLoad']];
        const peakDisplacementValues = Array.isArray(item['peakDisplacement'])
          ? item['peakDisplacement']
          : [item['peakDisplacement']];

        // Calculate required height based on max lines needed
        const maxPeakLoadLines = peakLoadValues.length;
        const maxPeakDisplacementLines = peakDisplacementValues.length;
        const maxLines = Math.max(
          maxPeakLoadLines,
          maxPeakDisplacementLines,
          1,
        );

        const baseRowHeight = 16;
        const rowHeight = baseRowHeight + (maxLines - 1) * 8;

        const values = [
          item['boltNumber'],
          item['boltType'],
          peakLoadValues,
          peakDisplacementValues,
          item['level']?.['levelName'] || '',
          item['drive']?.['driveName'] || '',
          item['positionInRing'],
          item['result'],
        ];

        // pdf.setFillColor(255, 255, 255);
        if (item['isHazard']) {
          pdf.setFillColor(255, 240, 240); // Light red for hazardous
        } else {
          pdf.setFillColor(255, 255, 255); // White for normal
        }
        pdf.rect(margin, pageY - 3, pageWidth - margin * 2, rowHeight, 'F');

        // Draw top border for each row
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.1);
        pdf.line(margin, pageY - 4, pageWidth - margin, pageY - 4);

        // Draw cell values with proper alignment
        pdf.setFontSize(9);
        let currentX = margin;
        values.forEach((value, colIndex) => {
          const cellCenterX = currentX + colWidths[colIndex] / 2;

          // Special handling for peak load (index 2) and peak displacement (index 3)
          if (colIndex === 2 || colIndex === 3) {
            const valuesArray = Array.isArray(value) ? value : [value];
            valuesArray.forEach((val, lineIndex) => {
              pdf.text(
                String(val),
                cellCenterX,
                pageY + 5 + lineIndex * 8, // Stack values vertically
                { align: 'center' },
              );
            });
          } else {
            // Regular single-line values
            pdf.text(
              String(value),
              cellCenterX,
              pageY + 5 + (maxLines - 1) * 4, // Center vertically in the expanded cell
              { align: 'center' },
            );
          }

          currentX += colWidths[colIndex];
        });

        pageY += rowHeight;
        if (item['comment']) {
          const commentHeight = 12;
          pdf.setFillColor(255, 255, 255);
          pdf.rect(
            margin,
            pageY - 3,
            pageWidth - margin * 2,
            commentHeight,
            'F',
          );

          pdf.setFontSize(8);
          pdf.text('Comments:', margin + 5, pageY + 5);

          // Handle long comments with text wrapping
          const commentText = item['comment'];
          const maxWidth = pageWidth - margin * 4 - 30;
          const lines = pdf.splitTextToSize(commentText, maxWidth);
          pdf.text(lines, margin + 35, pageY + 5);

          pageY += commentHeight;
          pdf.setFontSize(9);
        }

        if (item['abortReason']) {
          const abortReasonHeight = 12;
          pdf.setFillColor(255, 255, 255);
          pdf.rect(
            margin,
            pageY - 3,
            pageWidth - margin * 2,
            abortReasonHeight,
            'F',
          );

          pdf.setFontSize(8);
          pdf.text('Abort Reason:', margin + 5, pageY + 5);
          const abortReasonText = item['abortReason'];
          const maxWidth = pageWidth - margin * 4 - 30;
          const abortReasonLines = pdf.splitTextToSize(
            capitalizeFirstLetter(abortReasonText).replaceAll('_', ' '),
            maxWidth,
          );
          pdf.text(abortReasonLines, margin + 35, pageY + 5);

          pageY += abortReasonHeight;
          pdf.setFontSize(9);
        }
      });

      // Add page footer
      pdf.setFontSize(10);
      pdf.text(parentUrl, margin, pageHeight - 5);
      pdf.text(
        `Page ${pageNum} of ${totalPages}`,
        pageWidth - margin,
        pageHeight - 5,
        { align: 'right' },
      );
    }

    pdf.save(pdfName);
    setLoading(false);
  };

  return (
    <>
      <Button
        // onClick={generatePdfContent}
        onClick={generateTextBasedPdfTest}
        disabled={disabled}
        size="large"
        variant="primary"
        isLoading={isLoading}
      >
        <>
          {!isLoading && <LucideFileDown />}
          Export PDF test
        </>
      </Button>
    </>
  );
};
