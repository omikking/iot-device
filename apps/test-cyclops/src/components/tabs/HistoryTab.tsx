import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { Card, SectionTitle, Badge, Btn } from "../ui";
import type { Sample, MeasurementMeta } from "../../types";

interface HistoryTabProps {
  connected: boolean;
  meta: MeasurementMeta | null;
  history: Sample[];
  histLoading: boolean;
  histDownloadMs: number | null;
  onLoadHistory: () => void;
}

const PAGE_SIZE = 50;

/* ── Portal-based loading modal ──────────────────────────────────────────── */

function DownloadModal({
  progressPct,
  downloaded,
  total,
}: {
  progressPct: number;
  downloaded: number;
  total: number;
}) {
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* modal card */}
      <div className="relative w-full max-w-md mx-4 rounded-2xl bg-surface border border-border shadow-2xl p-8 animate-[fadeInScale_0.25s_ease-out]">
        {/* spinner icon */}
        {/* <div className="flex justify-center mb-5">
          <span className="text-4xl animate-spin inline-block">⏳</span>
        </div> */}

        <h3 className="text-center text-base font-bold text-text mb-1">
          Downloading History
        </h3>
        <p className="text-center text-xs text-text-muted mb-6">
          Fetching measurement data from device… please keep the connection active.
        </p>

        {/* progress label */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-[11px] font-semibold text-text-muted">
            Progress
          </span>
          <span className="text-[11px] font-semibold text-text-muted font-mono">
            {downloaded} / {total} ({progressPct}%)
          </span>
        </div>

        {/* progress bar */}
        <div className="w-full h-3 rounded-full bg-surface-alt border border-border overflow-hidden">
          <div
            className="h-full rounded-full bg-accent animate-pulse transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <p className="text-center text-[11px] text-text-faint mt-4">
          Polling device for measurement packets… This may take a moment.
        </p>
      </div>
    </div>,
    document.body,
  );
}

/* ── HistoryTab ──────────────────────────────────────────────────────────── */

export default function HistoryTab({
  connected,
  meta,
  history,
  histLoading,
  histDownloadMs,
  onLoadHistory,
}: HistoryTabProps) {
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [history.length]);

  const sorted = useMemo(
    () => [...history].sort((a, b) => b.timestamp - a.timestamp),
    [history],
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageData = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const progressPct =
    meta && meta.total > 0
      ? Math.min(100, Math.round((history.length / meta.total) * 100))
      : 0;

  /* ── Disconnected state ─────────────────────────────────────────────── */

  if (!connected) {
    return (
      <Card>
        <div className="text-center px-6 py-12 text-text-muted">
          <div className="text-[52px] mb-4"></div>
          <div className="text-base font-bold mb-1.5 text-text">No device connected</div>
          <div className="text-[13px] text-text-faint">
            Connect to a device to download measurement history
          </div>
        </div>
      </Card>
    );
  }

  /* ── Connected ──────────────────────────────────────────────────────── */

  return (
    <>
      {/* Portal modal while loading */}
      {histLoading && meta && meta.total > 0 && (
        <DownloadModal
          progressPct={progressPct}
          downloaded={history.length}
          total={meta.total}
        />
      )}

      {/* ── Stats row ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-5">
        <Card>
          <SectionTitle icon="">Total Measurements</SectionTitle>
          <div className="text-3xl font-bold text-accent font-mono">
            {meta?.total ?? "—"}
          </div>
          <div className="text-[11px] text-text-faint mt-1">
            Samples stored on device (UUID 0022)
          </div>
        </Card>

        <Card>
          <SectionTitle icon="">Non-Uploaded</SectionTitle>
          <div className="text-3xl font-bold text-warn font-mono">
            {meta?.notUploaded ?? "—"}
          </div>
          <div className="text-[11px] text-text-faint mt-1">
            Samples not yet uploaded via Wi-Fi
          </div>
        </Card>

        <Card>
          <SectionTitle icon="">Downloaded</SectionTitle>
          <div className="text-3xl font-bold text-success font-mono">
            {history.length}
          </div>
          <div className="text-[11px] text-text-faint mt-1">
            {histDownloadMs !== null
              ? `Fetched in ${histDownloadMs < 1000 ? `${histDownloadMs} ms` : `${(histDownloadMs / 1000).toFixed(1)} s`}`
              : "Samples downloaded this session"}
          </div>
        </Card>
      </div>

      {/* ── Data table ─────────────────────────────────────────────────── */}
      <Card>
        <div className="flex justify-between items-center mb-[14px]">
          <SectionTitle icon="">History Data</SectionTitle>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <Badge variant="accent">{history.length} samples</Badge>
            )}
            {histDownloadMs !== null && (
              <Badge variant="success">
                {histDownloadMs < 1000
                  ? `${histDownloadMs} ms`
                  : `${(histDownloadMs / 1000).toFixed(1)} s`}
              </Badge>
            )}
            <Btn onClick={onLoadHistory} disabled={!connected || histLoading} small>
              {histLoading ? (
                <span className="flex items-center gap-1.5">
                  <span className="animate-spin inline-block">⏳</span>
                  Downloading…
                </span>
              ) : (
                "Load All History"
              )}
            </Btn>
          </div>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
            <table className="w-full border-collapse text-[11px] font-mono">
              <thead>
                <tr className="bg-surface-alt sticky top-0 z-10">
                  {[
                    "ID",
                    "Timestamp",
                    "Distance (mm)",
                    "Quality",
                    "Duration (ms)",
                    "Grav X",
                    "Grav Y",
                    "Grav Z",
                    "Priority",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2.5 text-left text-[10px] font-bold text-text-muted border-b border-border whitespace-nowrap tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageData.map((s, i) => (
                  <tr
                    key={s.sampleId}
                    className={
                      i % 2 === 0 ? "bg-surface" : "bg-surface-alt/50"
                    }
                  >
                    <td className="px-3 py-2 text-text-muted">{s.sampleId}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-text">
                      {new Date(s.timestamp * 1000).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-accent font-semibold">
                      {s.distanceMm}
                    </td>
                    <td className="px-3 py-2 text-warn">{s.quality}</td>
                    <td className="px-3 py-2 text-text">{s.durationMs}</td>
                    <td className="px-3 py-2 text-[#a78bfa]">
                      {s.gravity.x.toFixed(3)}
                    </td>
                    <td className="px-3 py-2 text-[#a78bfa]">
                      {s.gravity.y.toFixed(3)}
                    </td>
                    <td className="px-3 py-2 text-[#a78bfa]">
                      {s.gravity.z.toFixed(3)}
                    </td>
                    <td className="px-3 py-2">
                      {s.gravity.highPriority ? (
                        <Badge variant="warn">Yes</Badge>
                      ) : (
                        <span className="text-text-faint">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {sorted.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-12 text-center text-text-faint text-[13px]"
                    >
                      No history loaded — click "Load All History" to download
                      samples from the device
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {sorted.length > PAGE_SIZE && (
          <div className="flex justify-center items-center gap-2 mt-4">
            <Btn
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              small
            >
              Prev
            </Btn>
            <span className="text-xs text-text-muted font-mono">
              {page + 1} / {totalPages}
            </span>
            <Btn
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              small
            >
              Next
            </Btn>
          </div>
        )}
      </Card>
    </>
  );
}
