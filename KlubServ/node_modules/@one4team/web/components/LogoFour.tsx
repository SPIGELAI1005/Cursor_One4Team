import React from "react";

interface LogoFourProps {
  size?: number;
  bgColor?: string;
  textColor?: string;
  className?: string;
}

const LogoFour: React.FC<LogoFourProps> = ({ 
  size = 64, 
  bgColor = "white", 
  textColor = "black",
  className = ""
}) => {
  return (
    <div 
      className={`flex items-center justify-center rounded-xl font-bold ${className}`}
      style={{ 
        width: size, 
        height: size, 
        backgroundColor: bgColor, 
        color: textColor, 
        fontSize: size / 2,
      }}
    >
      4
    </div>
  );
};

export default LogoFour; 