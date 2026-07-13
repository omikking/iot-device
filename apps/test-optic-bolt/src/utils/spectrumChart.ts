import type { OpticboltSpectrum, SpectrumChartPoint } from '../types';

const BASELINE_AMPLITUDE = 2300;
const PEAK_HEIGHT_SCALE = 80000;
const PEAK_SIGMA_NM = 0.12;
const WAVELENGTH_STEP_NM = 0.2;

type SpectrumPair = '20' | '100';

function gaussianPeak(
  wavelength: number,
  center: number,
  height: number,
  sigma: number,
): number {
  return height * Math.exp(-0.5 * ((wavelength - center) / sigma) ** 2);
}

function buildContinuousSpectrum(
  spectrums: OpticboltSpectrum[],
  pair: SpectrumPair,
): SpectrumChartPoint[] {
  const peakKey = pair === '20' ? 'peak20Nm' : 'peak100Nm';
  const strainKey = pair === '20' ? 'strain20' : 'strain100';
  const scanStartKey = pair === '20' ? 'wavelength20' : 'wavelength100';

  const peakRecords = spectrums.filter((spectrum) => spectrum[peakKey] != null);
  if (peakRecords.length === 0) {
    return [];
  }

  const scanStarts = peakRecords
    .map((spectrum) => spectrum[scanStartKey])
    .filter((value): value is number => value != null);
  const peakPositions = peakRecords.map((spectrum) => spectrum[peakKey] as number);

  const startWavelength = scanStarts.length
    ? Math.min(...scanStarts)
    : Math.min(...peakPositions) - 5;
  const endWavelength = Math.max(...peakPositions) + 8;
  const points: SpectrumChartPoint[] = [];

  for (let wavelength = startWavelength; wavelength <= endWavelength; wavelength += WAVELENGTH_STEP_NM) {
    let amplitude = BASELINE_AMPLITUDE;

    for (const spectrum of peakRecords) {
      const center = spectrum[peakKey] as number;
      const strain = spectrum[strainKey];
      const peakHeight =
        strain != null ? strain * PEAK_HEIGHT_SCALE : PEAK_HEIGHT_SCALE * 0.05;
      amplitude += gaussianPeak(wavelength, center, peakHeight, PEAK_SIGMA_NM);
    }

    points.push({
      wavelength: Number(wavelength.toFixed(3)),
      amplitude: Number(amplitude.toFixed(2)),
      fbgIndex: 0,
    });
  }

  return points;
}

export function buildSpectrum20Points(spectrums: OpticboltSpectrum[]): SpectrumChartPoint[] {
  return buildContinuousSpectrum(spectrums, '20');
}

export function buildSpectrum100Points(spectrums: OpticboltSpectrum[]): SpectrumChartPoint[] {
  return buildContinuousSpectrum(spectrums, '100');
}

export function getChartDomains(points: SpectrumChartPoint[]): {
  x: [number, number];
  y: [number, number];
} {
  if (points.length === 0) {
    return { x: [780, 910], y: [2000, 14000] };
  }

  const wavelengths = points.map((point) => point.wavelength);
  const amplitudes = points.map((point) => point.amplitude);

  const xMin = Math.floor(Math.min(...wavelengths));
  const xMax = Math.ceil(Math.max(...wavelengths));
  const yMax = Math.max(...amplitudes);
  const yCeil = Math.ceil(yMax / 1000) * 1000;

  return {
    x: [xMin, xMax],
    y: [2000, Math.max(14000, yCeil)],
  };
}
