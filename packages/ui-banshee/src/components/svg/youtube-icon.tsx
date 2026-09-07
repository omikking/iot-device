type YoutubeIconProps = {
  className?: string;
  width?: number;
  height?: number;
  fill?: string;
};

export const YoutubeIcon = ({
  className,
  width = 29,
  height = 30,
  fill = '#242424',
}: YoutubeIconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 29 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer circle */}
      <circle cx="14.5" cy="15" r="14.5" fill={fill} />

      {/* YouTube icon */}
      <rect
        x="7"
        y="10"
        width="15"
        height="10"
        rx="3"
        fill="white"
      />

      {/* Play button */}
      <path
        d="M13 12.5L18 15L13 17.5V12.5Z"
        fill="#242424"
      />
    </svg>
  );
};