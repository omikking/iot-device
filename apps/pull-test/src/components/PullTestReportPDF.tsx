import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { Button } from '@gsp/ui';
import { LucideFileDown } from 'lucide-react';
import { BoltResultResponse } from '@/gql/graphql';
import { capitalizeFirstLetter } from '@/libs/utils';
import sandvikLogo from './assets/Sandvik-logo.png';

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
  parentUrl?: string;
  disabled?: boolean;
}

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

export const PullTestReportPDF = ({
  objList,
  reportDetails,
  parentUrl = '',
  disabled,
}: PullTestReportPDFProps) => {
  const [isLoading, setLoading] = useState(false);

  // TODO Remove black top border if past row is hazardous
  // TODO Fix page number issue
  const generateTextBasedPdfTest = async () => {
    setLoading(true);
    const pdf = new jsPDF({ orientation: 'portrait', compress: true });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const results = objList?.results || [];
    const totalPages = Math.ceil(results.length / 8) + 2;
    const currentDate = new Date().toLocaleDateString();

    let logoDataUrl: string | null = null;
    logoDataUrl = await loadImageAsBase64(sandvikLogo.src);

    let currentY = 0;
    const headerHeight = 60;

    pdf.setFillColor(248, 248, 248);
    pdf.rect(0, currentY, pageWidth, headerHeight, 'F');

    currentY = 10;

    // Sandvik logo
    if (logoDataUrl) {
      const logoWidth = 34;
      const logoHeight = 6;
      pdf.addImage(logoDataUrl, 'PNG', margin, currentY, logoWidth, logoHeight);
    }

    // Pull Test Report text
    pdf.setFontSize(22);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text('PULL TEST REPORT', margin, currentY + 40);

    currentY += headerHeight + 10;

    // Report headlines
    pdf.setFontSize(8);
    pdf.setTextColor(0, 0, 0);

    const headings = [
      'START DATE',
      'COMPANY NAME',
      'CONTRACTOR',
      'CONTACT PERSON',
      'MINE',
      'COMMODITY',
    ];

    const values = [
      reportDetails.startDate,
      reportDetails.companyName,
      reportDetails.contractor,
      reportDetails.contactPerson?.map((p) => p.name).join(', ') || '',
      reportDetails.mine || '',
      reportDetails.commodity || '',
    ];

    const colsPerRow = 3;
    const colWidth = (pageWidth - margin * 2) / colsPerRow;

    // Draw headings and values in rows of 3
    for (let row = 0; row < Math.ceil(headings.length / colsPerRow); row++) {
      const startIndex = row * colsPerRow;
      const endIndex = Math.min(startIndex + colsPerRow, headings.length);

      // Draw headings for this row
      pdf.setFont('helvetica', 'bold');
      for (let i = startIndex; i < endIndex; i++) {
        const col = i - startIndex;
        const x = margin + col * colWidth;
        pdf.text(headings[i], x, currentY);
      }

      // Draw values for this row
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      for (let i = startIndex; i < endIndex; i++) {
        const col = i - startIndex;
        const x = margin + col * colWidth;
        if (values[i]) {
          pdf.text(values[i], x, currentY + 10);
        }
      }

      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      currentY += 30;
    }

    // Add footer for first page
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text(parentUrl, margin, pageHeight - 5);
    pdf.text(`Page 1 of ${totalPages}`, pageWidth - margin, pageHeight - 5, {
      align: 'right',
    });

    // Add table pages with text-based tables
    const itemsPerPage = 6;
    for (let i = 0; i < results.length; i += itemsPerPage) {
      pdf.addPage();
      const pageItems = results.slice(i, i + itemsPerPage);
      const pageNum = Math.floor(i / itemsPerPage) + 2;

      let pageY = 20;

      // Add header
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Bolting Pull Test', pageWidth - margin, 10, { align: 'right' });
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
        'Position in ring',
        'Result',
      ];

      const customColWidths = [25, 15, 25, 30, 20, 20, 25, 20];
      const totalCustomWidth = customColWidths.reduce(
        (sum, width) => sum + width,
        0,
      );
      const scaleFactor = (pageWidth - margin * 2) / totalCustomWidth;
      const colWidths = customColWidths.map((width) => width * scaleFactor);

      pdf.setFillColor(248, 248, 248);
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
      pageItems.forEach((item) => {
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
          item['isHazard'] ? 'HAZARD' : item['result'],
        ];

        if (item['isHazard']) {
          pdf.setFillColor(255, 204, 204);
        } else {
          pdf.setFillColor(255, 255, 255);
        }
        pdf.rect(margin, pageY - 3, pageWidth - margin * 2, rowHeight, 'F');

        // Draw borders based on hazard status
        if (item['isHazard']) {
          // For hazard rows: draw top and bottom borders (red)
          pdf.setDrawColor(255, 0, 0);
          pdf.setLineWidth(1);
          // Top border
          pdf.line(margin, pageY - 3, pageWidth - margin, pageY - 3);
          // Bottom border
          pdf.line(
            margin,
            pageY + rowHeight - 3,
            pageWidth - margin,
            pageY + rowHeight - 3,
          );
        } else {
          // For normal rows: draw top separator line (black)
          pdf.setDrawColor(0, 0, 0);
          pdf.setLineWidth(0.1);
          pdf.line(margin, pageY - 3, pageWidth - margin, pageY - 3);
        }

        // Draw cell values with proper alignment
        pdf.setFontSize(9);
        let currentX = margin;
        values.forEach((value, colIndex) => {
          const cellCenterX = currentX + colWidths[colIndex] / 2;

          if (colIndex === 2 || colIndex === 3) {
            const valuesArray = Array.isArray(value) ? value : [value];
            valuesArray.forEach((val, lineIndex) => {
              pdf.text(String(val), cellCenterX, pageY + 5 + lineIndex * 8, {
                align: 'center',
              });
            });
          } else {
            pdf.text(
              String(value),
              cellCenterX,
              pageY + 5 + (maxLines - 1) * 4,
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

    pdf.save('pull-test-report.pdf');
    setLoading(false);
  };

  return (
    <>
      <Button
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
