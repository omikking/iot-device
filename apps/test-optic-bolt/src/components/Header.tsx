import { LucideZap } from 'lucide-react';

interface HeaderProps {
  isOnline: boolean;
  syncStatus: string | null;
  onRefresh: () => void | Promise<void>;
}

export default function Header({ isOnline, syncStatus, onRefresh }: HeaderProps) {
  return (
    <header className="bg-surface border-b border-border px-6 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-warn-bg text-warn flex items-center justify-center">
          <LucideZap size={20} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-text">Optic Bolt Testing</h1>
          <p className="text-xs text-text-muted">Spectrum analysis and test results</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {isOnline && syncStatus === 'syncing' && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Syncing...
          </div>
        )}
        {isOnline && syncStatus === 'synced' && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-600 border border-green-500/20">
            <span className="w-2 h-2 rounded-full bg-green-600" />
            Synced
          </div>
        )}
        {isOnline && syncStatus === 'error' && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 border border-red-500/20">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            Sync Error
          </div>
        )}
        <button
          type="button"
          onClick={() => void onRefresh()}
          disabled={syncStatus === 'syncing'}
          className="px-4 py-2 text-sm font-semibold rounded-lg bg-accent text-white hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Refresh
        </button>
      </div>
    </header>
  );
}
