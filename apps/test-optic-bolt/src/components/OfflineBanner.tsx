interface OfflineBannerProps {
  isOnline: boolean;
}

export default function OfflineBanner({ isOnline }: OfflineBannerProps) {
  if (isOnline) return null;
  
  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-600 text-sm font-medium py-2 px-4 flex items-center justify-center gap-2">
      You are currently offline. Using cached data.
    </div>
  );
}
