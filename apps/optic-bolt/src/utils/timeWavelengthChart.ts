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
  time: number;
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
  points: Array<{ time: number; wavelength: number }>;
} {
  const fbgNumber = spectrum.fbgIndex + 1;
  const key = `fbg${spectrum.fbgIndex}`;
  const points: Array<{ time: number; wavelength: number }> = [];

  if (spectrum.peakInitialNm != null) {
    points.push({ time: 0, wavelength: spectrum.peakInitialNm });
  }
  if (spectrum.peak20Nm != null && spectrum.time20Ms != null) {
    points.push({
      time: spectrum.time20Ms / 1000,
      wavelength: spectrum.peak20Nm,
    });
  }
  if (spectrum.peak100Nm != null && spectrum.time100Ms != null) {
    points.push({
      time: spectrum.time100Ms / 1000,
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

  const uniqueTimes = Array.from(
    new Set(series.flatMap((item) => item.points.map((point) => point.time))),
  ).sort((a, b) => a - b);

  const rows: TimeWavelengthRow[] = uniqueTimes.map((time) => {
    const row: TimeWavelengthRow = { time };
    for (const item of series) {
      const point = item.points.find((entry) => entry.time === time);
      if (point) {
        row[item.line.key] = point.wavelength;
      }
    }
    return row;
  });

  const wavelengths = series.flatMap((item) => item.points.map((point) => point.wavelength));
  const times = series.flatMap((item) => item.points.map((point) => point.time));

  if (wavelengths.length === 0 || times.length === 0) {
    return {
      rows: [],
      lines: [],
      xDomain: [0, 120],
      yDomain: [810, 860],
    };
  }

  const xDomain = padAxis(Math.min(...times), Math.max(...times), 20);
  const yDomain = padAxis(Math.min(...wavelengths), Math.max(...wavelengths), 10);

  return { rows, lines, xDomain, yDomain };
}
