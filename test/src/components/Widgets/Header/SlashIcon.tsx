interface SlashIconProps {
  className?: string;
  width?: string;
  height?: string;
  preserveAspectRatio?: string;
}

const SlashIcon = ({ 
  className,
  width = "100%", 
  height = "100%", 
  preserveAspectRatio = "none",
}: SlashIconProps) => {
  return (
    <svg 
      className={className}
      width={width} 
      height={height} 
      viewBox="0 0 2 10"
      preserveAspectRatio={preserveAspectRatio}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d={`
          M 0 0
          L 2 0
          L 2 10
          L 0 10
          Z
        `}
        fill="currentColor"
      />
    </svg>
  );
};

export default SlashIcon;
