import type { OpticboltSpectrum } from '../types';

export const FBG_LINE_COLORS = [
  '#1f77b4',
  '#ff7f0e',
  '#2ca02c',
  '#d62728',
  '#9467bd',
  '#8c564b',
  '#e377c2',
  '#7f7f7f',
  '#bcbd22',
  '#17becf',
] as const;

export interface FbgTimeSeriesLine {
  key: string;
  label: string;
  color: string;
}

export interface TimeWavelengthRow {
  step: number;
  [seriesKey: string]: number;
}

export interface TimeWavelengthChartData {
  rows: TimeWavelengthRow[];
  lines: FbgTimeSeriesLine[];
  xDomain: [number, number];
  yDomain: [number, number];
}

function buildFbgLine(spectrum: OpticboltSpectrum, colorIndex: number): {
  line: FbgTimeSeriesLine;
  points: Array<{ step: number; wavelength: number }>;
} {
  const fbgNumber = spectrum.fbgIndex + 1;
  const key = `fbg${spectrum.fbgIndex}`;
  const points: Array<{ step: number; wavelength: number }> = [];

  if (spectrum.peakInitialNm != null) {
    points.push({ step: 1, wavelength: spectrum.peakInitialNm });
  }
  if (spectrum.peak20Nm != null) {
    points.push({
      step: 2,
      wavelength: spectrum.peak20Nm,
    });
  }
  if (spectrum.peak100Nm != null) {
    points.push({
      step: 3,
      wavelength: spectrum.peak100Nm,
    });
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

export function buildTimeVsWavelengthChart(
  spectrums: OpticboltSpectrum[],
): TimeWavelengthChartData {
  const sortedSpectrums = [...spectrums].sort((a, b) => a.fbgIndex - b.fbgIndex);
  const series = sortedSpectrums.map((spectrum, index) => buildFbgLine(spectrum, index));
  const lines = series.map((item) => item.line);

  const uniqueSteps = [1, 2, 3];

  const rows: TimeWavelengthRow[] = uniqueSteps.map((step) => {
    const row: TimeWavelengthRow = { step };
    for (const item of series) {
      const point = item.points.find((entry) => entry.step === step);
      if (point) {
        row[item.line.key] = point.wavelength;
      }
    }
    return row;
  });

  const wavelengths = series.flatMap((item) => item.points.map((point) => point.wavelength));

  if (wavelengths.length === 0) {
    return {
      rows: [],
      lines: [],
      xDomain: [1, 3],
      yDomain: [810, 860],
    };
  }

  const xDomain: [number, number] = [1, 3];
  const yDomain = padAxis(Math.min(...wavelengths), Math.max(...wavelengths), 10);

  return { rows, lines, xDomain, yDomain };
}

 