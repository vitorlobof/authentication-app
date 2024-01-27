import React, { MouseEvent } from "react";

interface RoundIconProps {
  imageUrl: string;
  altText: string;
  size: number;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

const RoundIcon = ({
  imageUrl,
  altText,
  size = 24,
  onClick,
}: RoundIconProps) => {
  return (
    <div
      className={`w-${size} h-${size} rounded-full overflow-hidden`}
      onClick={onClick}
    >
      <img
        src={imageUrl}
        alt={altText}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default RoundIcon;
