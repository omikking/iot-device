import { cn } from "../../lib/utils";

type ActiveBoltLocatorProps = {
  className?: string;
  width?: number;
  height?: number;
  stroke?: string;
  active?: boolean;
};

export const ActiveBoltLocator = ({
  className,
  width = 60,
  height = 60,
  stroke = '#1441F5',
  active = true,
}: ActiveBoltLocatorProps) => {
  const activeBolt = (active: boolean) => {
    if (active) {
      return (
        <path
          d="M28.4845 0.897798C16.7196 -2.54218 4.34884 4.20731 0.900273 15.9445C-2.54829 27.6826 4.21555 40.0329 15.9771 43.4737C18.0577 44.0826 20.1553 44.3725 22.2206 44.3725C31.8348 44.3725 40.7229 38.0895 43.5613 28.427C47.0099 16.689 40.2461 4.33863 28.4845 0.897798Z"
          fill={stroke}
          strokeWidth="1.5"
        />
      );
    } else if (!active) {
      return (
        <path
          d="M22.2286 44.3684C9.97145 44.3684 0 34.4168 0 22.185C0 9.9524 9.97145 0 22.2286 0C34.4857 0 44.4571 9.9524 44.4571 22.185C44.4571 34.4168 34.4857 44.3684 22.2286 44.3684ZM22.2286 3.49285C11.9017 3.49285 3.49983 11.8779 3.49983 22.185C3.49983 32.4913 11.9017 40.8755 22.2286 40.8755C32.5555 40.8755 40.9573 32.4913 40.9573 22.185C40.9573 11.8779 32.5555 3.49285 22.2286 3.49285Z"
          fill={stroke}
          strokeWidth="1.5"
        />
      );
    }
  };
  return (
    <svg
      className={cn('ui-banshee-bg-white', className) }
      width={width}
      height={height}
      viewBox="0 0 45 45"
      xmlns="http://www.w3.org/2000/svg"
    >
      {activeBolt(active)}
    </svg>
  );
};



//<svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
//<path d="M28.4845 0.897798C16.7196 -2.54218 4.34884 4.20731 0.900273 15.9445C-2.54829 27.6826 4.21555 40.0329 15.9771 43.4737C18.0577 44.0826 20.1553 44.3725 22.2206 44.3725C31.8348 44.3725 40.7229 38.0895 43.5613 28.427C47.0099 16.689 40.2461 4.33863 28.4845 0.897798Z" fill="#1441F5"/>
//</svg>
