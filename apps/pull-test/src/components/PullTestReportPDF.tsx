import React, { useCallback, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import { Button } from '@gsp/ui';
import { LucideFileDown } from 'lucide-react';
import { BoltResultResponse, RingPosition } from '@/gql/graphql';
import { capitalizeFirstLetter, convertRingPosition } from '@/libs/utils';
import sandvikLogo from './assets/Sandvik-logo.png';

interface PullTestReportPDFProps {
  allBoltResults?: BoltResultResponse;
  generateTrigger: number;
  isLoading: boolean;
  onRequestPDF: () => void;
  reportDetails: {
    testingStartDate: string;
    testingEndDate: string;
    companyName: string;
    mine: string;
  };
  parentUrl?: string;
  disabled?: boolean;
}

export const PullTestReportPDF = ({
  allBoltResults,
  generateTrigger,
  isLoading,
  onRequestPDF,
  reportDetails,
  parentUrl = '',
  disabled = false,
}: PullTestReportPDFProps) => {
  const lastProcessedTrigger = useRef(0);

  const loadImageAsBase64 = useCallback(
    (imagePath: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = imagePath;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
          }

          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        };

        img.onerror = () => reject(new Error('Failed to load image'));
      });
    },
    [],
  );

  const generatePDF = useCallback(async (): Promise<void> => {
    if (!allBoltResults?.results?.length) {
      return;
    }

    const pdf = new jsPDF({ orientation: 'portrait', compress: true });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;

    const results = allBoltResults?.results || [];

    const itemsPerPage = 8;
    const totalPages = Math.ceil(results.length / itemsPerPage) + 1;
    const currentDate = new Date().toLocaleDateString();

    let logoDataUrl: string | null = null;
    logoDataUrl = await loadImageAsBase64(sandvikLogo.src);

    let currentY = 0;
    const headerHeight = 65;

    pdf.setFillColor(248, 248, 248);
    pdf.rect(0, currentY, pageWidth, headerHeight, 'F');

    currentY = 10;

    // Sandvik logo
    if (logoDataUrl) {
      const logoWidth = 34;
      const logoHeight = 6;
      pdf.addImage(logoDataUrl, 'PNG', margin, currentY, logoWidth, logoHeight);
    }

    // Pull Test Report
    pdf.setFontSize(26);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text('PULL TEST REPORT', margin, currentY + 40);

    currentY += headerHeight + 10;

    // Report headlines
    pdf.setFontSize(8);
    pdf.setTextColor(0, 0, 0);

    const headings = [
      'COMPANY NAME',
      'MINE',
      'TESTING START DATE',
      'TESTING END DATE',
    ];

    const values = [
      reportDetails.companyName,
      reportDetails.mine,
      reportDetails.testingStartDate,
      reportDetails.testingEndDate,
    ];

    const colsPerRow = 2;
    const colWidth = (pageWidth - margin * 2) / colsPerRow;

    // Draw headings and values in rows of 2
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
    for (let i = 0; i < results.length; i += itemsPerPage) {
      pdf.addPage();
      const pageItems = results.slice(i, i + itemsPerPage);
      const pageNum = Math.floor(i / itemsPerPage) + 2;

      let pageY = 20;

      // Add header
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text(currentDate, pageWidth - margin, 10, { align: 'right' });
      pdf.text('Bolting Pull Test', margin, 10);
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

      const customColWidths = [15, 15, 18, 22, 20, 20, 25, 25];

      const totalCustomWidth = customColWidths.reduce(
        (sum, width) => sum + width,
        0,
      );
      const scaleFactor = (pageWidth - margin * 2) / totalCustomWidth;
      const colWidths = customColWidths.map((width) => width * scaleFactor);

      pdf.setFillColor(248, 248, 248);
      pdf.rect(margin, pageY, pageWidth - margin * 2, 22, 'F');

      // Header drawing
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      let currentX = margin;

      headers.forEach((header, index) => {
        const maxWidth = colWidths[index] - 4;
        const lines = pdf.splitTextToSize(header, maxWidth);
        const lineHeight = 3;
        const startY = pageY + 8;

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

      // Rows drawing
      pdf.setFont('helvetica', 'normal');
      pageY += 22;

      console.log('pageItems:', pageItems);
      pageItems.forEach((item) => {
        // Check if peak load or displacement have multiple values
        const peakLoadValues = Array.isArray(item.peakLoad)
          ? item.peakLoad
          : [item.peakLoad];
        const peakDisplacementValues = Array.isArray(item.peakDisplacement)
          ? item.peakDisplacement
          : [item.peakDisplacement];

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
          item.boltNumber,
          item.boltType,
          peakLoadValues,
          peakDisplacementValues,
          item.level?.levelName || '',
          item.drive?.driveName || '',
          convertRingPosition(item.positionInRing as RingPosition),
          capitalizeFirstLetter(item.result),
        ];

        pdf.setFillColor(255, 255, 255);
        pdf.rect(margin, pageY - 3, pageWidth - margin * 2, rowHeight, 'F');

        pdf.setDrawColor(40, 40, 40);
        pdf.setLineWidth(0.1);
        pdf.line(margin, pageY - 3, pageWidth - margin, pageY - 3);

        // Draw cell values with proper alignment
        pdf.setFontSize(9);
        currentX = margin;

        values.forEach((value, colIndex) => {
          const cellCenterX = currentX + colWidths[colIndex] / 2;

          if (colIndex === 2 || colIndex === 3) {
            const valuesArray = Array.isArray(value) ? value : [value];
            valuesArray.forEach((val, lineIndex) => {
              pdf.text(String(val), cellCenterX, pageY + 6 + lineIndex * 6, {
                align: 'center',
              });
            });
          } else if (
            colIndex === 7 &&
            item.result?.toLowerCase() === 'abort' &&
            item.abortReason
          ) {
            // Special handling for Result column when it's ABORT with reason
            pdf.text(
              String(value),
              cellCenterX,
              pageY + 6 + (maxLines - 1) * 3,
              { align: 'center' },
            );
            // Add abort reason on second line
            pdf.setFontSize(8);
            const formattedReason = capitalizeFirstLetter(
              item.abortReason,
            ).replaceAll('_', ' ');
            pdf.text(
              `(${formattedReason})`,
              cellCenterX,
              pageY + 6 + (maxLines - 1) * 3 + 4,
              { align: 'center' },
            );
          } else {
            pdf.text(
              String(value),
              cellCenterX,
              pageY + 6 + (maxLines - 1) * 3,
              { align: 'center' },
            );
          }

          currentX += colWidths[colIndex];
        });

        pageY += rowHeight;

        if (item.isHazard) {
          const hazardHeight = 5;
          pdf.setFillColor(255, 255, 255);
          pdf.rect(
            margin,
            pageY - 3,
            pageWidth - margin * 2,
            hazardHeight,
            'F',
          );

          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(220, 0, 0);
          pdf.text('Hazard reported on this bolt', margin + 5, pageY - 2);
          pdf.setTextColor(0, 0, 0);

          pageY += hazardHeight;
          pdf.setFontSize(9);
        }

        if (item.comment) {
          const commentHeight = 5;
          pdf.setFillColor(255, 255, 255);
          pdf.rect(
            margin,
            pageY - 3,
            pageWidth - margin * 2,
            commentHeight,
            'F',
          );

          pdf.setFontSize(8);
          pdf.text('Comment:', margin + 5, pageY - 2);

          // Handle long comments with text wrapping
          const commentText = item.comment;
          const maxWidth = pageWidth - margin * 4 - 30;
          const lines = pdf.splitTextToSize(commentText, maxWidth);
          pdf.text(lines, margin + 20, pageY - 2);

          pageY += commentHeight;
          pdf.setFontSize(9);
        }
      });

      // Add final line at the end of all items on the page
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.1);
      pdf.line(margin, pageY - 3, pageWidth - margin, pageY - 3);

      // Check if this is the last page of table data
      const isLastTablePage = i + itemsPerPage >= results.length;

      if (isLastTablePage) {
        // check for space
        const graphReadingsHeight = 50;
        const spaceNeeded = pageY + graphReadingsHeight + 20;

        if (spaceNeeded > pageHeight - 15) {
          // Not enough space, add page count & url for this page first
          pdf.setFontSize(8);
          pdf.text(parentUrl, margin, pageHeight - 5);
          pdf.text(
            `Page ${pageNum} of ${totalPages}`,
            pageWidth - margin,
            pageHeight - 5,
            { align: 'right' },
          );

          // Create new page for Graph Readings
          pdf.addPage();
          pageY = 20;

          // Add header for summary page
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'normal');
          pdf.text(new Date().toLocaleDateString(), pageWidth - margin, 10, {
            align: 'right',
          });
          pdf.text('Bolting Pull Test - Summary', margin, 10);
          pdf.setTextColor(0, 0, 0);
          pageY += 20;
        } else {
          pageY += 20; // Add some spacing before Graph Readings
        }

        // Graph readings titles
        const graphTitles = [
          'Total number of tests',
          'Average tons',
          'Success rate',
        ];

        // Calculate actual values from results
        const totalTests = results.length;
        const validPeakLoads = results
          .flatMap((r) =>
            Array.isArray(r.peakLoad) ? r.peakLoad : [r.peakLoad],
          )
          .filter((load) => load != null && !isNaN(Number(load)));
        const averageTons =
          validPeakLoads.length > 0
            ? (
                validPeakLoads.reduce((sum, load) => sum + Number(load), 0) /
                validPeakLoads.length
              ).toFixed(1)
            : '0';
        const successCount = results.filter(
          (r) => r.result?.toLowerCase() === 'pass',
        ).length;
        const successRate =
          totalTests > 0
            ? `${Math.round((successCount / totalTests) * 100)}%`
            : '0%';

        // Draw graph readings section
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);

        const graphColWidth = (pageWidth - margin * 2) / 3;

        // Draw graph titles
        graphTitles.forEach((title, index) => {
          const x = margin + index * graphColWidth;
          pdf.text(title, x, pageY);
        });

        // Draw calculated values
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        const graphValues = [totalTests.toString(), averageTons, successRate];

        graphValues.forEach((value, index) => {
          const x = margin + index * graphColWidth;
          pdf.text(value, x, pageY + 15);
        });
      }

      // Add page count & url
      pdf.setFontSize(8);
      pdf.text(parentUrl, margin, pageHeight - 5);
      pdf.text(
        `Page ${pageNum} of ${totalPages}`,
        pageWidth - margin,
        pageHeight - 5,
        { align: 'right' },
      );
    }

    pdf.save(`pull-test-report-${Date.now()}.pdf`);
  }, [allBoltResults, reportDetails, parentUrl, loadImageAsBase64]);

  useEffect(() => {
    if (
      generateTrigger > lastProcessedTrigger.current &&
      allBoltResults?.results?.length
    ) {
      lastProcessedTrigger.current = generateTrigger;
      generatePDF();
    }
  }, [generateTrigger, allBoltResults, generatePDF]);

  return (
    <Button
      onClick={onRequestPDF}
      disabled={disabled || isLoading}
      size="large"
      variant="primary"
      isLoading={isLoading}
      className="flex items-center gap-2"
    >
      {!isLoading && <LucideFileDown />}
      Export PDF
    </Button>
  );
};
