type FacebookIconProps = {
  className?: string;
  width?: number;
  height?: number;
  fill?: string;
};

export const FacebookIcon = ({
  className,
  width = 30,
  height = 30,
  fill = '#242424',
}: FacebookIconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="15" cy="15" r="14.5" fill={fill} strokeWidth="1" />

      <svg
        width={6}
        height={13}
        viewBox="0 0 6 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        x={12}
        y={8.5}
      >
        <path
          d="M3.70668 7.55769V13H1.68202V7.55769H0V5.35096H1.68202V4.54808C1.68202 1.56731 2.69046 0 4.82414 0C5.47826 0 5.64179 0.129808 6 0.235577V2.41827C5.59896 2.33173 5.48605 2.28365 5.06944 2.28365C4.57495 2.28365 4.31019 2.45673 4.06879 2.79808C3.82738 3.13942 3.70668 3.73077 3.70668 4.57692V5.35577H6L5.38481 7.5625H3.70668V7.55769Z"
          fill="white"
        />
      </svg>
    </svg>
  );
};
