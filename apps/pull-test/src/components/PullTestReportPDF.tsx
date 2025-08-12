import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from '@gsp/ui';
import { LucideFileDown } from 'lucide-react';
import { BoltResultSchema } from '@/app/mock/mock';
import { BoltResult } from '@/gql/graphql';

interface PullTestReportPDFProps {
  objList?: BoltResult;
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

  const renderToCanvas = async (htmlElement: HTMLElement) => {
    return await html2canvas(htmlElement, {
      useCORS: true,
      scale: 3,
    });
  };

  const createHiddenWrapper = () => {
    const hiddenDiv = document.createElement('div');
    hiddenDiv.style.position = 'fixed';
    hiddenDiv.style.left = '-9999px';
    hiddenDiv.style.top = '0';
    hiddenDiv.style.width = '210mm';
    hiddenDiv.style.minHeight = '297mm';
    hiddenDiv.style.zIndex = '-1';
    document.body.appendChild(hiddenDiv);
    return hiddenDiv;
  };

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
    for (let i = 0; i < objList.results.length; i += chunkSize) {
      rowChunks.push(objList.results.slice(i, i + chunkSize));
    }

    for (let pageIndex = 0; pageIndex < rowChunks.length; pageIndex++) {
      const chunk = rowChunks[pageIndex];
      const tableContainer = createHiddenWrapper();

      const tableWrapper = document.createElement('div');
      tableWrapper.style.fontFamily = "'Poppins', sans-serif";
      tableWrapper.style.width = '210mm';
      tableWrapper.style.minHeight = '297mm';

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
                  <td style="text-align: center; padding: 10px; border-bottom: 1px solid black;">${item['level']['levelName']}</td>
                  <td style="text-align: center; padding: 10px; border-bottom: 1px solid black;">${item['drive']['driveName']}</td>
                  <td style="text-align: center; padding: 10px; border-bottom: 1px solid black;">${item['positionInRing']['position']}</td>
                  <td style="text-align: center; padding: 10px; border-bottom: 1px solid black;">${item['result']}</td>
                </tr>`,
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
  // useEffect(() => {
  //   (async () => {
  //     const logo = (await loadImageAsBase64(layout.logo.src)) as string;
  //     setLogoDataUrl(logo);
  //   })();
  // }, [layout]);

  return (
    <>
      <Button
        onClick={generatePdfContent}
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
