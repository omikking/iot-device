import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { Card, SectionTitle, Btn, Badge } from "../ui";
import type { HydraMeasurementSample, MeasurementMeta } from "../../types";
 
interface HistoryTabProps {
  connected: boolean;
  meta: MeasurementMeta | null;
  history: HydraMeasurementSample[];
  histLoading: boolean;
  histDownloadMs: number | null;
  onLoadHistory: () => void;
}
 
/** Comma-joined numbers, rounded for display — these are physical measurements, not raw ints. */
function formatNumbers(values: number[], decimals: number): string {
  return values.map((v) => v.toFixed(decimals)).join(", ");
}
 
function ChannelDetails({ channels }: { channels: HydraMeasurementSample["channels"] }) {
  return (
    <div className="px-4 py-3 bg-surface-alt/60 border-b border-border last:border-0 space-y-2">
      {channels.map((ch, i) => (
        <div key={i} className="text-xs font-mono">
          <div className="text-text">
            Ch {i}: temp={ch.temperature.toFixed(2)}°C refSlope={ch.refSlope} refOffset={ch.refOffset}
          </div>
          {ch.wavelengths.length > 0 && (
            <div className="text-text-muted pl-4 break-all">
              wavelength (nm): {formatNumbers(ch.wavelengths, 2)}
            </div>
          )}
          {ch.amplitudes.length > 0 && (
            <div className="text-text-muted pl-4 break-all">
              amplitude: {formatNumbers(ch.amplitudes, 1)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
 
const PAGE_SIZE = 30;
 
function DownloadModal({ count }: { count: number }) {
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-md mx-4 rounded-2xl bg-surface border border-border shadow-2xl p-8">
        <h3 className="text-center text-base font-bold text-text mb-1">Downloading History</h3>
        <p className="text-center text-xs text-text-muted mb-4">
          Receiving Hydra measurement chunks (cmd 5) — COBS/protobuf per Appendix A.
        </p>
        <p className="text-center text-sm font-mono text-accent">{count} chunks received</p>
      </div>
    </div>,
    document.body,
  );
}
 
export default function HistoryTab({
  connected,
  meta,
  history,
  histLoading,
  histDownloadMs,
  onLoadHistory,
}: HistoryTabProps) {
  const [page, setPage] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);
  useEffect(() => setPage(0), [history.length]);

  const pageData = useMemo(
    () => history.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    [history, page],
  );
 

  const totalPages = Math.max(1, Math.ceil(history.length / PAGE_SIZE));

  if (!connected) {
    return (
      <Card>
        <div className="text-center px-6 py-12 text-text-muted">
          <div className="text-base font-bold mb-1.5 text-text">No device connected</div>
          <div className="text-[13px] text-text-faint">Connect to download Hydra measurement history</div>
        </div>
      </Card>
    );
  }

  return (
    <>
      {histLoading && <DownloadModal count={history.length} />}

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <SectionTitle>Measurement History</SectionTitle>
          <Btn onClick={onLoadHistory} disabled={histLoading}>
            {histLoading ? "Downloading…" : "Download History"}
          </Btn>
        </div>
       
        {meta && (
          <p className="text-xs text-text-muted mb-4">
            Storage: {meta.notUploaded} not uploaded / {meta.total} total · sectors{" "}
            {meta.unusedSectors}/{meta.totalSectors} free
          </p>
        )}

        {histDownloadMs != null && (
          <p className="text-xs text-success font-semibold mb-3">
            Last download: {(histDownloadMs / 1000).toFixed(1)}s · {history.length} chunks
          </p>
        )}

        {history.length === 0 ? (
          <p className="text-sm text-text-faint text-center py-8">
            No measurements loaded. Click "Download History" to retrieve and decode samples.
          </p>
        ) : (
          <>
            <div className="rounded-lg border border-border overflow-hidden">
              <div className="grid grid-cols-[80px_1fr_140px_90px_90px] px-4 py-2 text-[10px] font-bold bg-surface-alt text-text-faint border-b border-border">
                <span>SAMPLE ID</span>
                <span>TIMESTAMP</span>
                <span>SENSOR ID</span>
                <span>MODE</span>
                <span>CHANNELS</span>
              </div>
              {pageData.map((row, i) => {
                const globalIndex = page * PAGE_SIZE + i;
                const activeChannels = row.channels.filter((c) => c.wavelengths.length > 0).length;
                const isOpen = expanded === globalIndex;
                return (
                  <div key={`${row.sampleId}-${i}`}>
                    <div
                      onClick={() => setExpanded(isOpen ? null : globalIndex)}
                      className="grid grid-cols-[80px_1fr_140px_90px_90px] px-4 py-2 text-xs border-b border-border last:border-0 font-mono cursor-pointer hover:bg-surface-alt"
                    >
                      <span className="text-accent">{row.sampleId}</span>
                      <span className="text-text-muted">{row.timestamp}</span>
                      <span className="text-text-muted truncate">{row.sensorId}</span>
                      <span>
                        <Badge variant={row.isHighPriority ? "warn" : "default"}>
                          {row.compression}
                        </Badge>
                      </span>
                      <span className="text-text-muted">
                        {activeChannels}/{row.channels.length}
                      </span>
                    </div>
                    {isOpen && <ChannelDetails channels={row.channels} />}
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                <Btn small disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                  Prev
                </Btn>
                <span className="text-xs text-text-muted self-center">
                  Page {page + 1} / {totalPages}
                </span>
                <Btn
                  small
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Btn>
              </div>
            )}
          </>
        )}
      </Card>
    </>
  );
}
