import React from "react";
import "./colorPallet.css";

const ColorPallet = (props) => {
  const PalletSvg = ({ colorCode}) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      onClick={() => {props.onChangeColor(colorCode)}}
    >
      <circle cx="16" cy="16" r="16" fill={colorCode} />
      <circle cx="16" cy="16" r="15.5" stroke="white" strokeOpacity="0.7" />
    </svg>
  );

  const colors = [
    "black",
    "#8B423B",
    "#FE0000",
    "#FDA700",
    "#00FF01",
    "#0000FE",
    "#96BDFF",
    "#FF00FE",
  ];

  return (
    <div className="color_pallet">
      {colors.map((color) => (
        <PalletSvg
          key={color}
          colorCode={color}
        />
      ))}
    </div>
  );
};

export default ColorPallet;
