type ArrowDownProps = {
  className?: string;
  width?: number;
  height?: number;
  stroke?: string;
};

export const ArrowDown = ({
  className,
  width = 24,
  height = 24,
  stroke = 'black',
}: ArrowDownProps) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3 7.5L12 16.5L21 7.5" stroke={stroke} strokeWidth="1.5" />
    </svg>
  );
};

export default ArrowDown;
