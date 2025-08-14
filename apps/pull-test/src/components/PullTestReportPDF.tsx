import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from '@gsp/ui';
import { LucideFileDown } from 'lucide-react';
import { BoltResultResponse } from '@/gql/graphql';

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
  // const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);

  console.log('PullTestReportPDF objList:', objList);

  const pdfRef = useRef(new jsPDF({ orientation: 'portrait', compress: true }));

  // const loadImageAsBase64 = (imagePath: string) =>
  //   new Promise((resolve, reject) => {
  //     const img = new Image();
  //     img.crossOrigin = 'anonymous';
  //     img.src = imagePath;
  //     img.onload = () => {
  //       const canvas = document.createElement('canvas');
  //       canvas.width = img.width;
  //       canvas.height = img.height;
  //       const ctx = canvas.getContext('2d');
  //       if (!ctx) return reject(new Error('Canvas context not available'));
  //       ctx.drawImage(img, 0, 0);
  //       resolve(canvas.toDataURL('image/png'));
  //     };
  //     img.onerror = reject;
  //   });

  // const renderToCanvas = async (htmlElement: HTMLElement) => {
  //   return await html2canvas(htmlElement, {
  //     useCORS: true,
  //     scale: 3,
  //   });
  // };

  // const createHiddenWrapper = () => {
  //   const hiddenDiv = document.createElement('div');
  //   hiddenDiv.style.position = 'fixed';
  //   hiddenDiv.style.left = '-9999px';
  //   hiddenDiv.style.top = '0';
  //   hiddenDiv.style.width = '210mm';
  //   hiddenDiv.style.minHeight = '297mm';
  //   hiddenDiv.style.zIndex = '-1';
  //   document.body.appendChild(hiddenDiv);
  //   return hiddenDiv;
  // };
  /*
  const generatePdfContent = async () => {
    setLoading(true);
    const pdf = pdfRef.current;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const totalPages = Math.ceil((objList?.totalRecords || 0) / 10) + 2;

    // ========== PAGE 1 ==========
    const page1Container = createHiddenWrapper();

    const wrapper = document.createElement('div');
    wrapper.style.fontFamily = "'Poppins', sans-serif";
    wrapper.style.width = '210mm';
    wrapper.style.minHeight = '297mm';

    // Add in wrapper later
    // <div>
    //   <img src="${logoDataUrl}" alt="Logo" style="height: 30px;" />
    // </div>;

    wrapper.innerHTML = `
      <div style="width: 100%; padding: 20px; box-sizing: border-box;">
        <div style="width: 94%; height: 150px; background-color: #18B7F9; padding: 20px; display: flex; flex-direction: column; justify-content: space-between; margin-top: 25px;">
          <div style="font-size: 18px; color: white;">PULL TEST REPORT</div>
        </div>
      </div>
    `;

    page1Container.appendChild(wrapper);

    const canvas = await renderToCanvas(wrapper);
    document.body.removeChild(page1Container);

    const imgData = canvas.toDataURL('image/png');
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pageWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, imgHeight);

    pdf.setFontSize(12);
    pdf.text(pdfPageTitle, pageWidth / 2, 10, { align: 'center' });
    pdf.text(currentDate, margin, 10);
    pdf.setFontSize(10);
    pdf.text(parentUrl, margin, pageHeight - 5);
    pdf.text(`Page 1 of ${totalPages}`, pageWidth - margin, pageHeight - 5, {
      align: 'right',
    });

    // ========== TABLE PAGES ==========
    const chunkSize = 10;
    const rowChunks = [];
    const results = objList?.results || [];
    for (let i = 0; i < results.length; i += chunkSize) {
      rowChunks.push(results.slice(i, i + chunkSize));
    }

    for (let pageIndex = 0; pageIndex < rowChunks.length; pageIndex++) {
      const chunk = rowChunks[pageIndex];
      const tableContainer = createHiddenWrapper();

      const tableWrapper = document.createElement('div');
      tableWrapper.style.fontFamily = "'Poppins', sans-serif";
      tableWrapper.style.width = '210mm';
      tableWrapper.style.minHeight = '227mm';

      tableWrapper.innerHTML = `
      <div style="width: 100%; padding: 20px; box-sizing: border-box; padding-top: 20px;">
      ${
        pageIndex === 0
          ? `<div style="font-size: 20px; color: orange; font-weight: bold; margin-bottom: 20px;">
              General Observation
            </div>`
          : ''
      }
      <table style="width: 100%; border-collapse: collapse; font-family: 'Poppins', sans-serif;">
        <thead style="background: #f0f0f0;">
          <tr>
            <th style="text-align: center; padding: 10px; border-bottom: 1px solid black;">Bolt No</th>
            <th style="text-align: center; padding: 10px; border-bottom: 1px solid black;">Bolt Type</th>
            <th style="text-align: center; padding: 10px; border-bottom: 1px solid black;">Peak Load (tons)</th>
            <th style="text-align: center; padding: 10px; border-bottom: 1px solid black;">Peak Displacement</th>
            <th style="text-align: center; padding: 10px; border-bottom: 1px solid black;">Level</th>
            <th style="text-align: center; padding: 10px; border-bottom: 1px solid black;">Drive</th>
            <th style="text-align: center; padding: 10px; border-bottom: 1px solid black;">Position in Ring</th>
            <th style="text-align: center; padding: 10px; border-bottom: 1px solid black;">Result</th>
          </tr>
        </thead>
        <tbody>
          ${chunk
            .map(
              (item) => `
                <tr>
                  <td style="text-align: center; padding: 10px; border-bottom: 1px solid black;">${item['boltNumber']}</td>
                  <td style="text-align: center; padding: 10px; border-bottom: 1px solid black;">${item['boltType']}</td>
                  <td style="text-align: center; padding: 10px; border-bottom: 1px solid black;">${item['peakLoad'].join(' ')}</td>
                  <td style="text-align: center; padding: 10px; border-bottom: 1px solid black;">${item['peakDisplacement'].join(' ')}</td>
                  <td style="text-align: center; padding: 10px; border-bottom: 1px solid black;">${item['level']?.['levelName']}</td>
                  <td style="text-align: center; padding: 10px; border-bottom: 1px solid black;">${item['drive']?.['driveName']}</td>
                  <td style="text-align: center; padding: 10px; border-bottom: 1px solid black;">${item['positionInRing']}</td>
                  <td style="text-align: center; padding: 10px; border-bottom: 1px solid black;">${item['result']}</td>
                </tr>
                ${
                  item['comment']
                    ? `
                <tr class="comment-row">
                  <td colspan="8" style="padding: 0;">
                    <div style="background-color: #ffffff; padding: 10px 20px; border-bottom: 1px solid black;">
                      <div style="font-weight: bold; margin-bottom: 5px;">Comment:</div>
                      <div id="accordion" style="padding-left: 10px;">${item['comment']}</div>
                    </div>
                  </td>
                </tr>
                `
                    : ''
                } 
              `,
            )
            .join('')}
        </tbody>
      </table>
    </div>
      `;

      tableContainer.appendChild(tableWrapper);
      const tableCanvas = await renderToCanvas(tableWrapper);
      document.body.removeChild(tableContainer);

      const tableImgData = tableCanvas.toDataURL('image/png');
      const tableImgProps = pdf.getImageProperties(tableImgData);
      const tableImgHeight =
        (tableImgProps.height * pageWidth) / tableImgProps.width;

      pdf.addPage();
      pdf.addImage(tableImgData, 'PNG', 0, 0, pageWidth, tableImgHeight);
      pdf.setFontSize(12);
      pdf.text(pdfPageTitle, pageWidth / 2, 10, { align: 'center' });
      pdf.text(currentDate, margin, 10);
      pdf.setFontSize(10);
      pdf.text(parentUrl, margin, pageHeight - 5);
      pdf.text(
        `Page ${pageIndex + 2} of ${rowChunks.length + 2}`,
        pageWidth - margin,
        pageHeight - 5,
        { align: 'right' },
      );
    }

    pdf.addPage();
    pdf.setFontSize(10);
    pdf.text(pdfPageTitle, pageWidth / 2, 10, { align: 'center' });
    // pdf.text(pdfPageTitle, pageWidth / 4, 10, { align: 'center' });
    pdf.text(parentUrl, margin, pageHeight - 5);
    pdf.text(
      `Page ${rowChunks.length + 2} of ${rowChunks.length + 2}`,
      pageWidth - margin,
      pageHeight - 5,
      { align: 'right' },
    );

    pdf.save(pdfName);
    setLoading(false);
  };


  const generateTextBasedPdf = async () => {
    setLoading(true);
    const pdf = pdfRef.current;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const results = objList?.results || [];
    const totalPages = Math.ceil(results.length / 8) + 2; // Reduced items per page for text mode

    // Set up first page
    pdf.setFontSize(20);
    pdf.setTextColor(24, 183, 249);
    pdf.text('PULL TEST REPORT', margin, margin + 20);

    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(pdfPageTitle, pageWidth / 2, 10, { align: 'center' });
    pdf.text(currentDate, margin, 10);
    pdf.setFontSize(10);
    pdf.text(parentUrl, margin, pageHeight - 5);
    pdf.text(`Page 1 of ${totalPages}`, pageWidth - margin, pageHeight - 5, {
      align: 'right',
    });

    // Add company details
    pdf.setFontSize(12);
    pdf.text(`Company: ${reportDetails.companyName}`, margin, margin + 40);
    pdf.text(`Mine: ${reportDetails.mine}`, margin, margin + 50);
    // Add more report details as needed

    // Add table pages with text-based tables
    const itemsPerPage = 8;
    for (let i = 0; i < results.length; i += itemsPerPage) {
      pdf.addPage();
      const pageItems = results.slice(i, i + itemsPerPage);
      const pageNum = Math.floor(i / itemsPerPage) + 2;

      // Add header
      pdf.setFontSize(12);
      pdf.text(pdfPageTitle, pageWidth / 2, 10, { align: 'center' });
      pdf.text(currentDate, margin, 10);

      // Add table header
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);

      if (i === 0) {
        pdf.setFontSize(16);
        pdf.setTextColor(255, 165, 0);
        pdf.text('General Observation', margin, 30);
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
      }

      // Draw table header
      const headers = [
        'Bolt No',
        'Bolt Type',
        'Peak Load',
        'Displacement',
        'Level',
        'Drive',
        'Position',
        'Result',
      ];
      const colWidth = (pageWidth - margin * 2) / headers.length;
      let y = 40;

      // Draw header row
      pdf.setFillColor(240, 240, 240);
      pdf.rect(margin, y - 5, pageWidth - margin * 2, 10, 'F');
      headers.forEach((header, index) => {
        pdf.text(header, margin + colWidth * index + colWidth / 2, y, {
          align: 'center',
        });
      });

      // Draw data rows
      y += 15;
      pageItems.forEach((item, rowIndex) => {
        const values = [
          item['boltNumber'],
          item['boltType'],
          item['peakLoad'].join(' '),
          item['peakDisplacement'].join(' '),
          item['level']?.['levelName'] || '',
          item['drive']?.['driveName'] || '',
          item['positionInRing'],
          item['result'],
        ];

        values.forEach((value, colIndex) => {
          pdf.text(
            String(value),
            margin + colWidth * colIndex + colWidth / 2,
            y,
            { align: 'center' },
          );
        });

        // Add comment if present
        if (item['comment']) {
          y += 10;
          pdf.setFillColor(249, 249, 249);
          pdf.rect(margin, y - 5, pageWidth - margin * 2, 20, 'F');
          pdf.text('Comment:', margin + 5, y);
          pdf.text(item['comment'], margin + 30, y);
          y += 15;
        }

        y += 10;
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
  */
  // useEffect(() => {
  //   (async () => {
  //     const logo = (await loadImageAsBase64(layout.logo.src)) as string;
  //     setLogoDataUrl(logo);
  //   })();
  // }, [layout]);

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
    pdf.rect(margin, currentY, pageWidth - margin * 2, 30, 'F');

    pdf.setFontSize(20);
    pdf.setTextColor(255, 255, 255); // White text on blue background
    pdf.text('PULL TEST REPORT', margin + 10, currentY + 20);

    currentY += 40;

    // Reset text color and add other details
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(pdfPageTitle, pageWidth / 2, 10, { align: 'center' });
    pdf.text(currentDate, margin, 10);

    // Company details
    pdf.text(`Company: ${reportDetails.companyName}`, margin, currentY);
    pdf.text(`Mine: ${reportDetails.mine}`, margin, currentY + 10);
    pdf.text(`Contractor: ${reportDetails.contractor}`, margin, currentY + 20);

    // Add footer
    pdf.setFontSize(10);
    pdf.text(parentUrl, margin, pageHeight - 5);
    pdf.text(`Page 1 of ${totalPages}`, pageWidth - margin, pageHeight - 5, {
      align: 'right',
    });

    // Add table pages with text-based tables
    const itemsPerPage = 6; // Reduced to account for images
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
      pdf.setFontSize(12);
      pdf.text(pdfPageTitle, pageWidth / 2, 10, { align: 'center' });
      pdf.text(currentDate, margin, 10);

      // Add table header
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);

      if (i === 0) {
        pdf.setFontSize(16);
        pdf.setTextColor(255, 165, 0);
        pdf.text('General Observation', margin, pageY);
        pageY += 15;
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
      }
      // Draw table header
      const headers = [
        'Bolt No',
        'Bolt Type',
        'Peak Load (tons)',
        'Peak Displacement (mm)',
        'Level',
        'Drive',
        'Position in Ring',
        'Result',
      ];

      // Define custom column widths for better spacing
      const customColWidths = [15, 20, 25, 30, 20, 20, 35, 20];
      const totalCustomWidth = customColWidths.reduce(
        (sum, width) => sum + width,
        0,
      );
      const scaleFactor = (pageWidth - margin * 2) / totalCustomWidth;
      const colWidths = customColWidths.map((width) => width * scaleFactor);

      // Draw header row background (no border)
      pdf.setFillColor(150, 150, 150);
      pdf.rect(margin, pageY - 5, pageWidth - margin * 2, 12, 'F'); // Only fill, no stroke

      // Draw header text with text wrapping
      pdf.setFontSize(9);
      pdf.setTextColor(0, 0, 0);
      let currentX = margin;
      headers.forEach((header, index) => {
        // Split text to fit column width if needed
        const maxWidth = colWidths[index] - 4; // Leave some padding
        const lines = pdf.splitTextToSize(header, maxWidth);

        // Center the text block vertically if multiple lines
        const lineHeight = 3;
        const totalTextHeight = lines.length * lineHeight;
        const startY = pageY + 2 + (12 - totalTextHeight) / 2;

        // Draw each line centered in the column
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
      // Draw data rows
      pageY += 17;
      pageItems.forEach((item, rowIndex) => {
        const values = [
          item['boltNumber'],
          item['boltType'],
          item['peakLoad'].join(' '),
          item['peakDisplacement'].join(' '),
          item['level']?.['levelName'] || '',
          item['drive']?.['driveName'] || '',
          item['positionInRing'],
          item['result'],
        ];

        const rowHeight = 12;

        // Draw row background (alternating colors)
        if (rowIndex % 2 === 0) {
          pdf.setFillColor(248, 248, 248);
          pdf.rect(margin, pageY - 3, pageWidth - margin * 2, rowHeight, 'F');
        }

        // Draw top border for each row
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.1);
        pdf.line(margin, pageY - 3, pageWidth - margin, pageY - 3);

        // Draw cell values with proper alignment
        pdf.setFontSize(9);
        currentX = margin;
        values.forEach((value, colIndex) => {
          pdf.text(
            String(value),
            currentX + colWidths[colIndex] / 2,
            pageY + 3,
            { align: 'center' },
          );
          currentX += colWidths[colIndex];
        });

        pageY += rowHeight;

        // Add comment if present
        if (item['comment']) {
          const commentHeight = 15;

          // Draw comment background
          pdf.setFillColor(249, 249, 249);
          pdf.rect(
            margin,
            pageY - 3,
            pageWidth - margin * 2,
            commentHeight,
            'F',
          );

          // Draw top border for comment row
          // pdf.setDrawColor(0, 0, 0);
          // pdf.setLineWidth(0.1);
          // pdf.line(margin, pageY - 3, pageWidth - margin, pageY - 3);

          pdf.setFontSize(8);
          pdf.text('Comment:', margin + 5, pageY + 5);

          // Handle long comments with text wrapping
          const commentText = item['comment'];
          const maxWidth = pageWidth - margin * 4 - 30;
          const lines = pdf.splitTextToSize(commentText, maxWidth);
          pdf.text(lines, margin + 35, pageY + 5);

          pageY += commentHeight;
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
