import type { OpticboltSpectrum } from '../types';
import { FBG_LINE_COLORS } from './timeWavelengthChart';

export interface FbgSeriesLine {
  key: string;
  label: string;
  color: string;
}

export interface StrainLoadRow {
  load: number;
  [seriesKey: string]: number;
}

export interface StrainLoadChartData {
  rows: StrainLoadRow[];
  lines: FbgSeriesLine[];
  xDomain: [number, number];
  yDomain: [number, number];
}

function buildFbgStrainLoadLine(spectrum: OpticboltSpectrum, colorIndex: number): {
  line: FbgSeriesLine;
  points: Array<{ load: number; strain: number }>;
} {
  const fbgNumber = spectrum.fbgIndex + 1;
  const key = `fbg${spectrum.fbgIndex}`;
  const points: Array<{ load: number; strain: number }> = [{ load: 0, strain: 0 }];

  if (spectrum.strain20 != null && spectrum.load20 != null) {
    points.push({ load: spectrum.load20, strain: spectrum.strain20 });
  }
  if (spectrum.strain100 != null && spectrum.load100 != null) {
    points.push({ load: spectrum.load100, strain: spectrum.strain100 });
  }

  return {
    line: {
      key,
      label: `FBG_Raw_${fbgNumber}nm`,
      color: FBG_LINE_COLORS[colorIndex % FBG_LINE_COLORS.length],
    },
    points,
  };
}

function padAxis(min: number, max: number, step: number): [number, number] {
  const paddedMin = Math.floor(min / step) * step;
  const paddedMax = Math.ceil(max / step) * step;
  return [paddedMin, paddedMax];
}

export function buildStrainVsLoadChart(spectrums: OpticboltSpectrum[]): StrainLoadChartData {
  const sortedSpectrums = [...spectrums].sort((a, b) => a.fbgIndex - b.fbgIndex);
  const series = sortedSpectrums.map((spectrum, index) =>
    buildFbgStrainLoadLine(spectrum, index),
  );
  const lines = series.map((item) => item.line);

  const uniqueLoads = Array.from(
    new Set(series.flatMap((item) => item.points.map((point) => point.load))),
  ).sort((a, b) => a - b);

  const rows: StrainLoadRow[] = uniqueLoads.map((load) => {
    const row: StrainLoadRow = { load };
    for (const item of series) {
      const point = item.points.find((entry) => entry.load === load);
      if (point) {
        row[item.line.key] = point.strain;
      }
    }
    return row;
  });

  const strains = series.flatMap((item) => item.points.map((point) => point.strain));
  const loads = series.flatMap((item) => item.points.map((point) => point.load));

  if (strains.length === 0 || loads.length === 0) {
    return {
      rows: [],
      lines: [],
      xDomain: [0, 3000],
      yDomain: [0, 0.14],
    };
  }

  const xDomain = padAxis(Math.min(...loads), Math.max(...loads), 500);
  const yDomain = padAxis(Math.min(...strains), Math.max(...strains), 0.02);

  return { rows, lines, xDomain, yDomain };
}
