import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { Card, SectionTitle, Btn } from "../ui";
import type { HydraMeasurement, MeasurementMeta } from "../../types";

interface HistoryTabProps {
  connected: boolean;
  meta: MeasurementMeta | null;
  history: HydraMeasurement[];
  histLoading: boolean;
  histDownloadMs: number | null;
  onLoadHistory: () => void;
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
          <SectionTitle>Measurement History (
            <span className="text-xs text-text-muted">hex parsing to be discussed</span>)</SectionTitle>
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
            No measurements loaded. Full wavelength/amplitude decode requires protobuf (Appendix A).
          </p>
        ) : (
          <>
            <div className="rounded-lg border border-border overflow-hidden">
              <div className="grid grid-cols-[1fr] px-4 py-2 text-[10px] font-bold bg-surface-alt text-text-faint border-b border-border">
                {/* <span>SAMPLE ID</span> */}
                <span>HEX PREVIEW</span>
                {/* <span>SIZE</span> */}
              </div>
              {pageData.map((row, i) => (
                <div
                  key={`${row.receivedAt}-${i}`}
                  className="grid grid-cols-[1fr] px-4 py-2 text-xs border-b border-border last:border-0 font-mono"
                >
                  {/* <span className="text-accent">{row.sampleId ?? "—"}</span> */}
                  <span className="text-text-muted break-all">{row.hexPreview}</span>
                  {/* <span>{row.byteLength} B</span> */}
                </div>
              ))}
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
