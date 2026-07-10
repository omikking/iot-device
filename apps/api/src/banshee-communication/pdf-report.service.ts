import { Injectable, Logger } from '@nestjs/common';
import PDFDocument = require('pdfkit');

export interface PlotListReportData {
  companyName: string;
  sharedBy: string;
  generatedAt: Date;
  pngBuffer: Buffer;
  csvContent: string;
}

/**
 * Generates a printable PDF report for a shared plot list.
 * The report embeds the graph image (PNG) and renders the CSV content as a
 * table, alongside basic report metadata (title, timestamp, company, author).
 */
@Injectable()
export class PdfReportService {
  private readonly logger = new Logger(PdfReportService.name);

  // Layout constants
  private readonly PAGE_MARGIN = 40;
  private readonly TITLE = 'Ground Support Platform — Shared Plot List';

  async generatePlotListReport(data: PlotListReportData): Promise<Buffer> {
    try {
      return await new Promise<Buffer>((resolve, reject) => {
        // Landscape A4 gives us more horizontal room for the wide CSV table.
        const doc = new PDFDocument({
          size: 'A4',
          layout: 'landscape',
          margin: this.PAGE_MARGIN,
          info: {
            Title: this.TITLE,
            Author: 'Ground Support Platform',
            CreationDate: data.generatedAt,
          },
        });

        const chunks: Buffer[] = [];
        doc.on('data', (chunk: Buffer) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        this.renderHeader(doc, data);
        this.renderGraph(doc, data.pngBuffer);
        this.renderCsvTable(doc, data.csvContent);

        doc.end();
      });
    } catch (error) {
      this.logger.error(
        'Failed to generate plot list PDF report',
        error instanceof Error ? error.stack : error,
      );
      throw error;
    }
  }

  private renderHeader(
    doc: PDFKit.PDFDocument,
    data: PlotListReportData,
  ): void {
    doc.fontSize(18).fillColor('#000000').text(this.TITLE, { align: 'left' });
    doc.moveDown(0.5);

    doc.fontSize(10).fillColor('#444444');
    doc.text(`Company: ${data.companyName}`);
    doc.text(`Shared by: ${data.sharedBy}`);
    doc.text(`Generated: ${data.generatedAt.toISOString()}`);

    doc.moveDown(0.5);
    doc
      .moveTo(doc.x, doc.y)
      .lineTo(doc.page.width - this.PAGE_MARGIN, doc.y)
      .strokeColor('#cccccc')
      .stroke();
    doc.moveDown(0.5);
  }

  private renderGraph(doc: PDFKit.PDFDocument, pngBuffer: Buffer): void {
    doc.fontSize(13).fillColor('#000000').text('Graph');
    doc.moveDown(0.3);

    const availableWidth = doc.page.width - this.PAGE_MARGIN * 2;
    // Cap the image height so the table still has room on the page.
    const maxImageHeight = 280;

    try {
      doc.image(pngBuffer, {
        fit: [availableWidth, maxImageHeight],
        align: 'center',
      });
    } catch (error) {
      this.logger.warn(
        `Could not embed graph image in PDF: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      doc
        .fontSize(10)
        .fillColor('#cc0000')
        .text('Graph image could not be embedded.');
    }
    doc.moveDown(1);
  }

  private renderCsvTable(doc: PDFKit.PDFDocument, csvContent: string): void {
    const rows = this.parseCsv(csvContent);

    doc.fontSize(13).fillColor('#000000').text('Data');
    doc.moveDown(0.3);

    if (!rows.length) {
      doc.fontSize(10).fillColor('#666666').text('No data available.');
      return;
    }

    const tableLeft = this.PAGE_MARGIN;
    const tableWidth = doc.page.width - this.PAGE_MARGIN * 2;
    const columnCount = rows[0].length;
    const columnWidth = tableWidth / columnCount;
    const rowHeight = 20;
    const cellPadding = 3;
    const fontSize = 7;

    const drawRow = (cells: string[], y: number, isHeader: boolean) => {
      doc
        .fontSize(fontSize)
        .fillColor(isHeader ? '#ffffff' : '#000000')
        .font(isHeader ? 'Helvetica-Bold' : 'Helvetica');

      if (isHeader) {
        doc
          .rect(tableLeft, y, tableWidth, rowHeight)
          .fillColor('#1f2937')
          .fill();
        doc.fillColor('#ffffff');
      }

      cells.forEach((cell, colIdx) => {
        const x = tableLeft + colIdx * columnWidth;
        // Cell border
        doc
          .rect(x, y, columnWidth, rowHeight)
          .strokeColor('#dddddd')
          .lineWidth(0.5)
          .stroke();
        doc
          .fillColor(isHeader ? '#ffffff' : '#000000')
          .text(
            this.truncate(cell, columnWidth, fontSize),
            x + cellPadding,
            y + cellPadding,
            {
              width: columnWidth - cellPadding * 2,
              height: rowHeight - cellPadding * 2,
              ellipsis: true,
              lineBreak: false,
            },
          );
      });
    };

    let y = doc.y;
    const bottomLimit = doc.page.height - this.PAGE_MARGIN - rowHeight;
    const [header, ...dataRows] = rows;

    drawRow(header, y, true);
    y += rowHeight;

    for (const row of dataRows) {
      if (y > bottomLimit) {
        doc.addPage();
        y = this.PAGE_MARGIN;
        drawRow(header, y, true);
        y += rowHeight;
      }
      // Normalize ragged rows to the header column count.
      const normalized = Array.from(
        { length: columnCount },
        (_, i) => row[i] ?? '',
      );
      drawRow(normalized, y, false);
      y += rowHeight;
    }

    // Restore default font for any subsequent content.
    doc.font('Helvetica');
  }

  /** Rough character-fit truncation guard (text() ellipsis handles the rest). */
  private truncate(
    value: string,
    columnWidth: number,
    fontSize: number,
  ): string {
    const approxCharWidth = fontSize * 0.6;
    const maxChars = Math.max(1, Math.floor(columnWidth / approxCharWidth));
    return value.length > maxChars ? `${value.slice(0, maxChars - 1)}…` : value;
  }

  /**
   * Minimal CSV parser supporting quoted fields and escaped quotes ("").
   * Matches the shape produced by the frontend exporter (JSON.stringify cells).
   */
  private parseCsv(content: string): string[][] {
    const rows: string[][] = [];
    let field = '';
    let row: string[] = [];
    let inQuotes = false;

    for (let i = 0; i < content.length; i++) {
      const char = content[i];

      if (inQuotes) {
        if (char === '"') {
          if (content[i + 1] === '"') {
            field += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          field += char;
        }
        continue;
      }

      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        row.push(field);
        field = '';
      } else if (char === '\n') {
        row.push(field);
        rows.push(row);
        row = [];
        field = '';
      } else if (char === '\r') {
        // ignore (handle \r\n)
      } else {
        field += char;
      }
    }

    // Flush trailing field/row if present.
    if (field.length > 0 || row.length > 0) {
      row.push(field);
      rows.push(row);
    }

    return rows.filter((r) => r.some((c) => c.trim() !== ''));
  }
}
