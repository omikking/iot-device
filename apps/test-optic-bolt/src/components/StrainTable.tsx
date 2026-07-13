import { Card, SectionTitle } from './ui';
import type { OpticboltSpectrum } from '../types';

interface StrainTableProps {
  spectrums: OpticboltSpectrum[];
  loading?: boolean;
}

export default function StrainTable({ spectrums, loading = false }: StrainTableProps) {
  const sortedSpectrums = [...spectrums].sort((a, b) => a.fbgIndex - b.fbgIndex);

  return (
    <Card className="min-h-[300px] flex flex-col sm:col-span-2">
      <SectionTitle>Strain Data (all 9 FBGs)</SectionTitle>

      {loading ? (
        <div className="flex-1 flex items-center justify-center min-h-[220px]">
          <span className="inline-block w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-[spin_0.8s_linear_infinite]" />
        </div>
      ) : sortedSpectrums.length === 0 ? (
        <div className="flex-1 flex items-center justify-center min-h-[220px] text-sm text-text-muted text-center px-4">
          Select a serial number to view strain data.
        </div>
      ) : (
        <div className="overflow-x-auto w-full rounded-lg border border-border bg-surface">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-alt border-b border-border text-[11px] font-bold uppercase tracking-wider text-text-muted">
                <th className="py-3 px-4 font-semibold">FBG</th>
                <th className="py-3 px-4 font-semibold text-right">Peak Initial</th>
                <th className="py-3 px-4 font-semibold text-right">Peak 20</th>
                <th className="py-3 px-4 font-semibold text-right">Peak 100</th>
                <th className="py-3 px-4 font-semibold text-right">Strain_20_%</th>
                <th className="py-3 px-4 font-semibold text-right">Strain_100_%</th>
                <th className="py-3 px-4 font-semibold text-right">Calibration Factor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm font-mono">
              {sortedSpectrums.map((spectrum) => {
                const fbgNumber = spectrum.fbgIndex + 1;
                const peakInitial =
                  spectrum.peakInitialNm != null
                    ? spectrum.peakInitialNm.toFixed(6)
                    : '-';
                const peak20 =
                  spectrum.peak20Nm != null ? spectrum.peak20Nm.toFixed(6) : '-';
                const peak100 =
                  spectrum.peak100Nm != null ? spectrum.peak100Nm.toFixed(6) : '-';
                const calibration =
                  spectrum.calibrationFactor != null
                    ? spectrum.calibrationFactor.toFixed(6)
                    : '-';
                const s20 = spectrum.strain20 != null ? spectrum.strain20.toFixed(6) : '-';
                const s100 = spectrum.strain100 != null ? spectrum.strain100.toFixed(6) : '-';
                return (
                  <tr
                    key={spectrum.id || spectrum.fbgIndex}
                    className="hover:bg-slate-50 transition-colors duration-150"
                  >
                    <td className="py-2.5 px-4 font-sans font-medium text-text">
                      FBG {fbgNumber}
                    </td>
                    <td className="py-2.5 px-4 text-right text-text">
                      {peakInitial}
                    </td>
                    <td className="py-2.5 px-4 text-right text-text">
                      {peak20}
                    </td>
                    <td className="py-2.5 px-4 text-right text-text">
                      {peak100}
                    </td>
                    <td className="py-2.5 px-4 text-right text-text">
                      {s20}
                    </td>
                    <td className="py-2.5 px-4 text-right text-text">
                      {s100}
                    </td>
                    <td className="py-2.5 px-4 text-right text-text">
                      {calibration}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
 